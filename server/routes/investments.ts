import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateJwt, AuthenticatedRequest } from '../middleware';

const router = Router();

// GET /api/investments
router.get('/', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { status } = req.query;

  let investments = db.getInvestmentsByUserId(userId);
  if (status) {
    investments = investments.filter((i) => i.status === (status as string).toUpperCase());
  }

  return res.status(200).json({
    success: true,
    investments,
  });
});

// POST /api/investments/create
router.post('/create', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { productId, productName, productCategory, productImage, amountInvested, dailyProfit, totalDays, isLockable35H, riskLevel } = req.body;

  if (!productId || !productName || !amountInvested || !dailyProfit || !totalDays) {
    return res.status(400).json({
      success: false,
      message: 'Lengkapi semua parameter produk investasi.',
    });
  }

  const wallet = db.getWalletByUserId(userId);
  if (wallet.mainWallet < amountInvested) {
    return res.status(400).json({
      success: false,
      message: `Saldo Penarikan Anda (Rp ${wallet.mainWallet.toLocaleString('id-ID')}) tidak mencukupi untuk investasi ini (Rp ${amountInvested.toLocaleString('id-ID')}).`,
    });
  }

  // Deduct from mainWallet
  wallet.mainWallet -= amountInvested;
  db.updateWallet(userId, { mainWallet: wallet.mainWallet });

  // Create Investment Record
  const newInvestment = db.createInvestment({
    userId,
    productId,
    productName,
    productCategory: productCategory || 'General',
    productImage: productImage || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=80',
    amountInvested,
    dailyProfit,
    totalProfitTarget: dailyProfit * totalDays,
    totalDays,
    remainingDays: totalDays,
    riskLevel: riskLevel || 'LOW',
    isLockable35H: isLockable35H ?? false,
  });

  // Create Transaction Record
  db.createTransaction({
    userId,
    type: 'PRODUCT_PURCHASE',
    amount: amountInvested,
    fee: 0,
    status: 'SUCCESS',
    note: `Pembelian Paket Investasi ${productName}`,
    referenceNo: `NX-INV-${Date.now()}`,
  });

  // Create Notification
  db.createNotification({
    userId,
    category: 'INVESTMENT',
    title: 'Investasi Saham Berhasil!',
    message: `Anda telah mengaktifkan paket ${productName} senilai Rp ${amountInvested.toLocaleString('id-ID')}. Profit harian Rp ${dailyProfit.toLocaleString('id-ID')} akan otomatis terakruasi.`,
  });

  return res.status(200).json({
    success: true,
    message: `Investasi pada ${productName} berhasil diaktifkan!`,
    investment: newInvestment,
    updatedWallet: wallet,
  });
});

// POST /api/investments/:id/claim
router.post('/:id/claim', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const investmentId = req.params.id;

  const result = db.claimInvestmentProfit(userId, investmentId);
  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(200).json(result);
});

// POST /api/investments/claim-all
router.post('/claim-all', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const result = db.claimAllInvestmentProfits(userId);

  return res.status(200).json(result);
});

export default router;
