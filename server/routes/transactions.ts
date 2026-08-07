import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateJwt, AuthenticatedRequest } from '../middleware';

const router = Router();

// GET /api/transactions
router.get('/', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { type, search, page, limit } = req.query;

  const result = db.getTransactionsByUserId(userId, {
    type: type as string,
    search: search as string,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 20,
  });

  return res.status(200).json({
    success: true,
    transactions: result.transactions,
    total: result.total,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 20,
  });
});

// POST /api/transactions/deposit
router.post('/deposit', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { amount, paymentMethod } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ success: false, message: 'Masukkan nominal deposit yang valid.' });
  }

  const numAmount = Number(amount);
  const tx = db.createTransaction({
    userId,
    type: 'DEPOSIT',
    amount: numAmount,
    fee: 0,
    status: 'APPROVED', // Instant simulation for UX testing
    note: `Deposit Saldo via ${paymentMethod || 'QRIS Instant'}`,
    referenceNo: `NX-DEP-${Date.now()}`,
  });

  // Credit user wallet instantly
  const wallet = db.getWalletByUserId(userId);
  wallet.mainWallet += numAmount;
  db.updateWallet(userId, { mainWallet: wallet.mainWallet });

  // Add Notification
  db.createNotification({
    userId,
    category: 'DEPOSIT',
    title: 'Deposit Berhasil!',
    message: `Saldo sebesar Rp ${numAmount.toLocaleString('id-ID')} berhasil ditambahkan ke Saldo Penarikan Anda.`,
  });

  return res.status(200).json({
    success: true,
    message: 'Deposit berhasil diproses dan saldo telah bertambah!',
    transaction: tx,
    wallet,
  });
});

// POST /api/transactions/withdraw
router.post('/withdraw', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { amount, bankName, accountNumber, accountHolder } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ success: false, message: 'Masukkan nominal penarikan yang valid.' });
  }

  const numAmount = Number(amount);
  const wallet = db.getWalletByUserId(userId);

  if (wallet.mainWallet < numAmount) {
    return res.status(400).json({
      success: false,
      message: `Saldo Penarikan tidak mencukupi. Saldo saat ini: Rp ${wallet.mainWallet.toLocaleString('id-ID')}`,
    });
  }

  // Deduct wallet
  wallet.mainWallet -= numAmount;
  db.updateWallet(userId, { mainWallet: wallet.mainWallet });

  const tx = db.createTransaction({
    userId,
    type: 'WITHDRAWAL',
    amount: numAmount,
    fee: 2500,
    status: 'PENDING',
    note: `Penarikan ke ${bankName || 'BCA'} (${accountNumber || '12345678'}) a.n ${accountHolder || 'User'}`,
    referenceNo: `NX-WD-${Date.now()}`,
  });

  db.createNotification({
    userId,
    category: 'WITHDRAWAL',
    title: 'Permintaan Penarikan Diterima',
    message: `Permintaan penarikan Rp ${numAmount.toLocaleString('id-ID')} ke ${bankName || 'Rekening Anda'} sedang diproses oleh Tim Keuangan Nexa Capital.`,
  });

  return res.status(200).json({
    success: true,
    message: 'Permintaan penarikan berhasil dikirim dan akan segera diproses!',
    transaction: tx,
    wallet,
  });
});

export default router;
