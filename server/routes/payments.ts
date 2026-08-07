import { Router, Request, Response } from 'express';
import { db } from '../db';
import { authenticateJwt, AuthenticatedRequest } from '../middleware';
import { GatewayFactory } from '../services/payment/GatewayFactory';

const router = Router();

// Payment Methods & Providers catalog
export const PAYMENT_PROVIDERS = [
  { code: 'MIDTRANS', name: 'Midtrans Snap Gateway', type: 'AUTOMATED', isActive: true },
  { code: 'XENDIT', name: 'Xendit Payment Engine', type: 'AUTOMATED', isActive: true },
  { code: 'STRIPE', name: 'Stripe International Card', type: 'AUTOMATED', isActive: true },
  { code: 'MANUAL', name: 'Transfer Bank Manual / QR', type: 'MANUAL', isActive: true },
  { code: 'CRYPTO', name: 'USDT TRC20 Crypto Vault', type: 'CRYPTO', isActive: true },
];

export const PAYMENT_METHODS = [
  {
    code: 'VA_BCA',
    providerCode: 'MIDTRANS',
    name: 'BCA Virtual Account',
    category: 'VIRTUAL_ACCOUNT',
    minAmount: 10000,
    maxAmount: 100000000,
    adminFee: 0,
    adminFeeType: 'FIXED',
    isActive: true,
    iconUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&auto=format&fit=crop&q=80',
    instructions: [
      'Buka aplikasi m-BCA atau KlikBCA.',
      'Pilih Transfer > Virtual Account.',
      'Masukkan Nomor VA yang diterbitkan.',
      'Konfirmasi jumlah pembayaran dan selesaikan transaksi.'
    ]
  },
  {
    code: 'VA_MANDIRI',
    providerCode: 'MIDTRANS',
    name: 'Mandiri Virtual Account',
    category: 'VIRTUAL_ACCOUNT',
    minAmount: 10000,
    maxAmount: 100000000,
    adminFee: 0,
    adminFeeType: 'FIXED',
    isActive: true,
    iconUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
    instructions: [
      'Buka aplikasi Livin by Mandiri.',
      'Pilih Bayar > Multipayment / Virtual Account.',
      'Masukkan Nomor VA dan bayar.'
    ]
  },
  {
    code: 'QRIS',
    providerCode: 'MIDTRANS',
    name: 'QRIS Realtime (GoPay, OVO, ShopeePay, Dana, LinkAja)',
    category: 'QR_CODE',
    minAmount: 10000,
    maxAmount: 10000000,
    adminFee: 0,
    adminFeeType: 'FIXED',
    isActive: true,
    iconUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=100&auto=format&fit=crop&q=80',
    instructions: [
      'Buka aplikasi e-wallet atau m-banking pilihan Anda.',
      'Pilih Scan QRIS.',
      'Arahkan kamera ke Kode QR pada layar invoice.'
    ]
  },
  {
    code: 'EWALLET_GOPAY',
    providerCode: 'XENDIT',
    name: 'GoPay Direct Instant',
    category: 'EWALLET',
    minAmount: 10000,
    maxAmount: 20000000,
    adminFee: 0,
    adminFeeType: 'FIXED',
    isActive: true,
    iconUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=100&auto=format&fit=crop&q=80',
    instructions: ['Buka aplikasi GoPay / Gojek.', 'Setujui notifikasi tagihan yang masuk.']
  },
  {
    code: 'CC_STRIPE',
    providerCode: 'STRIPE',
    name: 'Credit Card / Debit Card (Visa/Mastercard)',
    category: 'CREDIT_CARD',
    minAmount: 50000,
    maxAmount: 200000000,
    adminFee: 2500,
    adminFeeType: 'FIXED',
    isActive: true,
    iconUrl: 'https://images.unsplash.com/photo-1556742049-0a67e7136001?w=100&auto=format&fit=crop&q=80',
    instructions: ['Masukkan nomor kartu dan kode CVC.', 'Selesaikan autentikasi 3D Secure / OTP SMS.']
  },
  {
    code: 'BANK_TRANSFER_MANUAL',
    providerCode: 'MANUAL',
    name: 'Transfer Bank Manual Mandiri / BCA',
    category: 'MANUAL',
    minAmount: 10000,
    maxAmount: 500000000,
    adminFee: 0,
    adminFeeType: 'FIXED',
    isActive: true,
    iconUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&auto=format&fit=crop&q=80',
    instructions: [
      'Transfer ke Rekening Mandiri 122-00-0988776-5 a/n PT NEXA CAPITAL INDONESIA.',
      'Upload resi atau bukti transfer di formulir invoice.'
    ]
  },
  {
    code: 'CRYPTO_USDT',
    providerCode: 'CRYPTO',
    name: 'USDT Crypto TRC20 Wallet',
    category: 'CRYPTO',
    minAmount: 100000,
    maxAmount: 1000000000,
    adminFee: 0,
    adminFeeType: 'FIXED',
    isActive: true,
    iconUrl: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?w=100&auto=format&fit=crop&q=80',
    instructions: [
      'Kirim USDT TRC20 ke TQn9Y2kh5B4y9Y8kP1xZ9xL7M9K2aB3cD4.',
      'Lampirkan TxHash atau screenshot pengiriman.'
    ]
  }
];

// In-memory / persistent request stores for Phase 7
export interface DepositItem {
  id: string;
  userId: string;
  referenceNo: string;
  amount: number;
  adminFee: number;
  totalAmount: number;
  paymentMethodCode: string;
  providerCode: string;
  status: 'WAITING_PAYMENT' | 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'CANCELLED';
  paymentUrl?: string;
  vaNumber?: string;
  qrCodeUrl?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  receiptUrl?: string;
  adminNotes?: string;
  instructions: string[];
  createdAt: string;
  expiredAt: string;
  approvedAt?: string;
}

export interface WithdrawalItem {
  id: string;
  userId: string;
  referenceNo: string;
  amount: number;
  adminFee: number;
  netAmount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  otpVerified: boolean;
  status: 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  adminNotes?: string;
  createdAt: string;
  approvedAt?: string;
}

export interface LedgerItem {
  id: string;
  userId: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  walletType: 'MAIN' | 'PROFIT' | 'REFERRAL' | 'BONUS' | 'CASHBACK';
  referenceNo: string;
  description: string;
  createdAt: string;
}

export const depositStore: DepositItem[] = [];
export const withdrawalStore: WithdrawalItem[] = [];
export const ledgerStore: LedgerItem[] = [];

// GET /api/payments/providers
router.get('/providers', (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    providers: PAYMENT_PROVIDERS,
  });
});

// GET /api/payments/methods
router.get('/methods', (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    methods: PAYMENT_METHODS,
  });
});

// POST /api/deposits
router.post('/deposits', authenticateJwt, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { amount, paymentMethodCode } = req.body;

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Nominal deposit tidak valid.' });
    }

    const method = PAYMENT_METHODS.find((m) => m.code === paymentMethodCode && m.isActive);
    if (!method) {
      return res.status(400).json({ success: false, message: 'Metode pembayaran tidak tersedia atau tidak aktif.' });
    }

    if (parsedAmount < method.minAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimal deposit untuk ${method.name} adalah Rp ${method.minAmount.toLocaleString('id-ID')}.`,
      });
    }

    if (parsedAmount > method.maxAmount) {
      return res.status(400).json({
        success: false,
        message: `Maksimal deposit untuk ${method.name} adalah Rp ${method.maxAmount.toLocaleString('id-ID')}.`,
      });
    }

    const user = db.findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    const referenceNo = `NEXA-DEP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const gateway = GatewayFactory.getGateway(method.providerCode);

    const chargeResponse = await gateway.createCharge({
      referenceNo,
      amount: parsedAmount,
      customerName: user.fullName,
      customerEmail: user.email,
      customerPhone: user.phone,
      paymentMethodCode: method.code,
      description: `Deposit Saldo Nexa Capital - ${method.name}`,
    });

    const adminFee = method.adminFee;
    const totalAmount = parsedAmount + adminFee;

    const depositRecord: DepositItem = {
      id: `dep-${Date.now()}`,
      userId,
      referenceNo,
      amount: parsedAmount,
      adminFee,
      totalAmount,
      paymentMethodCode: method.code,
      providerCode: method.providerCode,
      status: 'WAITING_PAYMENT',
      paymentUrl: chargeResponse.paymentUrl,
      vaNumber: chargeResponse.vaNumber,
      qrCodeUrl: chargeResponse.qrCodeUrl,
      bankName: chargeResponse.bankName || method.name,
      accountNumber: chargeResponse.accountNumber || chargeResponse.vaNumber,
      accountName: chargeResponse.accountName || 'PT NEXA CAPITAL INDONESIA',
      instructions: chargeResponse.instructions || method.instructions,
      createdAt: new Date().toISOString(),
      expiredAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    };

    depositStore.unshift(depositRecord);

    // Also register in main transactions table for backward compatibility
    db.createTransaction({
      userId,
      type: 'DEPOSIT',
      amount: parsedAmount,
      fee: adminFee,
      status: 'PENDING',
      note: `Deposit via ${method.name} (${referenceNo})`,
      referenceNo,
    });

    // Create Notification
    db.createNotification({
      userId,
      category: 'DEPOSIT',
      title: 'Invoice Deposit Diterbitkan',
      message: `Invoice deposit ${referenceNo} sebesar Rp ${parsedAmount.toLocaleString('id-ID')} via ${method.name} telah dibuat. Silakan selesaikan pembayaran.`,
    });

    // Add Audit Log
    db.addAuditLog({
      userId,
      userEmail: user.email,
      action: 'DEPOSIT_CREATED',
      module: 'DEPOSIT',
      details: `Membuat tagihan deposit ${referenceNo} nominal Rp ${parsedAmount.toLocaleString('id-ID')}`,
      ipAddress: req.ip || '127.0.0.1',
    });

    return res.status(201).json({
      success: true,
      message: 'Invoice deposit berhasil diterbitkan.',
      deposit: depositRecord,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Terjadi kesalahan sistem saat membuat deposit.' });
  }
});

// GET /api/deposits
router.get('/deposits', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const list = depositStore.filter((d) => d.userId === userId);

  return res.status(200).json({
    success: true,
    deposits: list,
  });
});

// GET /api/deposits/:id
router.get('/deposits/:id', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  const deposit = depositStore.find((d) => (d.id === id || d.referenceNo === id) && d.userId === userId);
  if (!deposit) {
    return res.status(404).json({ success: false, message: 'Data deposit tidak ditemukan.' });
  }

  return res.status(200).json({
    success: true,
    deposit,
  });
});

// POST /api/deposits/:id/upload-receipt
router.post('/deposits/:id/upload-receipt', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;
  const { receiptUrl } = req.body;

  if (!receiptUrl) {
    return res.status(400).json({ success: false, message: 'Bukti transfer wajib diunggah.' });
  }

  const deposit = depositStore.find((d) => (d.id === id || d.referenceNo === id) && d.userId === userId);
  if (!deposit) {
    return res.status(404).json({ success: false, message: 'Data deposit tidak ditemukan.' });
  }

  deposit.receiptUrl = receiptUrl;
  deposit.status = 'PENDING'; // Moves to admin verification queue

  return res.status(200).json({
    success: true,
    message: 'Bukti transfer berhasil diunggah! Tim Finance akan memverifikasi dalam 1x24 jam.',
    deposit,
  });
});

// POST /api/withdrawals
router.post('/withdrawals', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { amount, bankName, accountNumber, accountName, otpCode } = req.body;

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount < 50000) {
      return res.status(400).json({ success: false, message: 'Minimal penarikan saldo adalah Rp 50.000.' });
    }

    if (!bankName || !accountNumber || !accountName) {
      return res.status(400).json({ success: false, message: 'Lengkapi nama bank, nomor rekening, dan nama pemilik rekening.' });
    }

    // Check user balance
    const wallet = db.getWalletByUserId(userId);
    const user = db.findUserById(userId);

    if (wallet.mainWallet < parsedAmount) {
      return res.status(400).json({
        success: false,
        message: `Saldo Utama Anda (Rp ${wallet.mainWallet.toLocaleString('id-ID')}) tidak mencukupi untuk melakukan penarikan Rp ${parsedAmount.toLocaleString('id-ID')}.`,
      });
    }

    const adminFee = 5000; // Standard withdrawal flat fee
    const netAmount = parsedAmount - adminFee;

    // Deduct main wallet balance immediately (hold balance)
    const balanceBefore = wallet.mainWallet;
    wallet.mainWallet -= parsedAmount;
    wallet.updatedAt = new Date().toISOString();
    if (user) user.saldoPenarikan = wallet.mainWallet;

    const referenceNo = `NEXA-WD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const withdrawalRecord: WithdrawalItem = {
      id: `wd-${Date.now()}`,
      userId,
      referenceNo,
      amount: parsedAmount,
      adminFee,
      netAmount,
      bankName,
      accountNumber,
      accountName,
      otpVerified: otpCode ? true : false,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    withdrawalStore.unshift(withdrawalRecord);

    // Ledger entry
    const ledgerEntry: LedgerItem = {
      id: `ldg-${Date.now()}`,
      userId,
      type: 'DEBIT',
      amount: parsedAmount,
      balanceBefore,
      balanceAfter: wallet.mainWallet,
      walletType: 'MAIN',
      referenceNo,
      description: `Penarikan Saldo ke ${bankName} (${accountNumber})`,
      createdAt: new Date().toISOString(),
    };
    ledgerStore.unshift(ledgerEntry);

    // Register transaction
    db.createTransaction({
      userId,
      type: 'WITHDRAWAL',
      amount: parsedAmount,
      fee: adminFee,
      status: 'PENDING',
      note: `Penarikan ke ${bankName} ${accountNumber} a/n ${accountName}`,
      referenceNo,
    });

    // Notification
    db.createNotification({
      userId,
      category: 'WITHDRAWAL',
      title: 'Permintaan Penarikan Diterima',
      message: `Permintaan penarikan Rp ${parsedAmount.toLocaleString('id-ID')} ke ${bankName} (${accountNumber}) sedang diproses tim Finance.`,
    });

    // Audit Log
    db.addAuditLog({
      userId,
      userEmail: user?.email || '',
      action: 'WITHDRAWAL_REQUESTED',
      module: 'WITHDRAWAL',
      details: `Mengajukan penarikan Rp ${parsedAmount.toLocaleString('id-ID')} ke ${bankName} ${accountNumber}`,
      ipAddress: req.ip || '127.0.0.1',
    });

    return res.status(201).json({
      success: true,
      message: 'Permintaan penarikan berhasil dikirim dan menunggu verifikasi Admin/Finance.',
      withdrawal: withdrawalRecord,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Terjadi kesalahan sistem saat proses penarikan.' });
  }
});

// GET /api/withdrawals
router.get('/withdrawals', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const list = withdrawalStore.filter((w) => w.userId === userId);

  return res.status(200).json({
    success: true,
    withdrawals: list,
  });
});

// GET /api/withdrawals/:id
router.get('/withdrawals/:id', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  const withdrawal = withdrawalStore.find((w) => (w.id === id || w.referenceNo === id) && w.userId === userId);
  if (!withdrawal) {
    return res.status(404).json({ success: false, message: 'Data penarikan tidak ditemukan.' });
  }

  return res.status(200).json({
    success: true,
    withdrawal,
  });
});

// GET /api/ledger
router.get('/ledger', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const list = ledgerStore.filter((l) => l.userId === userId);

  return res.status(200).json({
    success: true,
    ledger: list,
  });
});

// POST /api/payments/webhook
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const { provider, referenceNo, status: inputStatus } = req.body;

    const gateway = GatewayFactory.getGateway(provider || 'MIDTRANS');
    const verification = await gateway.verifyWebhook(req.headers, req.body);

    if (!verification.isValid) {
      return res.status(400).json({ success: false, message: 'Signature Webhook tidak valid.' });
    }

    const refNo = verification.referenceNo || referenceNo;
    const dep = depositStore.find((d) => d.referenceNo === refNo);

    if (dep && dep.status !== 'SUCCESS') {
      if (verification.status === 'SUCCESS' || inputStatus === 'SUCCESS') {
        dep.status = 'SUCCESS';
        dep.approvedAt = new Date().toISOString();

        // Credit user wallet
        const wallet = db.getWalletByUserId(dep.userId);
        const balanceBefore = wallet.mainWallet;
        wallet.mainWallet += dep.amount;
        wallet.updatedAt = new Date().toISOString();

        const user = db.findUserById(dep.userId);
        if (user) user.saldoPenarikan = wallet.mainWallet;

        // Financial Ledger entry
        ledgerStore.unshift({
          id: `ldg-${Date.now()}`,
          userId: dep.userId,
          type: 'CREDIT',
          amount: dep.amount,
          balanceBefore,
          balanceAfter: wallet.mainWallet,
          walletType: 'MAIN',
          referenceNo: dep.referenceNo,
          description: `Deposit Berhasil via Webhook (${dep.paymentMethodCode})`,
          createdAt: new Date().toISOString(),
        });

        // Update transaction table
        const tx = db.getAllTransactions('DEPOSIT').find((t) => t.referenceNo === dep.referenceNo);
        if (tx) tx.status = 'APPROVED';

        // Notification
        db.createNotification({
          userId: dep.userId,
          category: 'DEPOSIT',
          title: 'Deposit Berhasil Diterima!',
          message: `Deposit sebesar Rp ${dep.amount.toLocaleString('id-ID')} telah sukses dikreditkan ke Saldo Utama Anda.`,
        });
      } else if (verification.status === 'EXPIRED') {
        dep.status = 'EXPIRED';
      } else if (verification.status === 'FAILED') {
        dep.status = 'FAILED';
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Webhook berhasil diproses.',
      referenceNo: refNo,
      status: dep?.status || 'PROCESSED',
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ADMIN API ENDPOINTS
// GET /api/payments/admin/deposits
router.get('/admin/deposits', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    deposits: depositStore,
  });
});

// PUT /api/payments/admin/deposits/:id/approve
router.put('/admin/deposits/:id/approve', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const dep = depositStore.find((d) => d.id === id || d.referenceNo === id);

  if (!dep) {
    return res.status(404).json({ success: false, message: 'Deposit tidak ditemukan.' });
  }

  if (dep.status === 'SUCCESS') {
    return res.status(400).json({ success: false, message: 'Deposit sudah disetujui sebelumnya.' });
  }

  dep.status = 'SUCCESS';
  dep.approvedAt = new Date().toISOString();

  // Credit user wallet
  const wallet = db.getWalletByUserId(dep.userId);
  const balanceBefore = wallet.mainWallet;
  wallet.mainWallet += dep.amount;
  wallet.updatedAt = new Date().toISOString();

  const user = db.findUserById(dep.userId);
  if (user) user.saldoPenarikan = wallet.mainWallet;

  ledgerStore.unshift({
    id: `ldg-${Date.now()}`,
    userId: dep.userId,
    type: 'CREDIT',
    amount: dep.amount,
    balanceBefore,
    balanceAfter: wallet.mainWallet,
    walletType: 'MAIN',
    referenceNo: dep.referenceNo,
    description: `Deposit Disetujui Admin (${dep.paymentMethodCode})`,
    createdAt: new Date().toISOString(),
  });

  const tx = db.getAllTransactions('DEPOSIT').find((t) => t.referenceNo === dep.referenceNo);
  if (tx) tx.status = 'APPROVED';

  db.createNotification({
    userId: dep.userId,
    category: 'DEPOSIT',
    title: 'Deposit Disetujui Admin!',
    message: `Deposit sebesar Rp ${dep.amount.toLocaleString('id-ID')} telah disetujui admin dan ditambahkan ke saldo Anda.`,
  });

  return res.status(200).json({
    success: true,
    message: 'Deposit berhasil disetujui!',
    deposit: dep,
  });
});

// PUT /api/payments/admin/deposits/:id/reject
router.put('/admin/deposits/:id/reject', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { adminNotes } = req.body;
  const dep = depositStore.find((d) => d.id === id || d.referenceNo === id);

  if (!dep) {
    return res.status(404).json({ success: false, message: 'Deposit tidak ditemukan.' });
  }

  dep.status = 'FAILED';
  dep.adminNotes = adminNotes || 'Penolakan oleh Finance / Admin';

  const tx = db.getAllTransactions('DEPOSIT').find((t) => t.referenceNo === dep.referenceNo);
  if (tx) tx.status = 'REJECTED';

  db.createNotification({
    userId: dep.userId,
    category: 'DEPOSIT',
    title: 'Deposit Ditolak Admin',
    message: `Deposit ${dep.referenceNo} sebesar Rp ${dep.amount.toLocaleString('id-ID')} ditolak. Alasan: ${dep.adminNotes}`,
  });

  return res.status(200).json({
    success: true,
    message: 'Deposit berhasil ditolak.',
    deposit: dep,
  });
});

// GET /api/payments/admin/withdrawals
router.get('/admin/withdrawals', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    withdrawals: withdrawalStore,
  });
});

// PUT /api/payments/admin/withdrawals/:id/approve
router.put('/admin/withdrawals/:id/approve', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const wd = withdrawalStore.find((w) => w.id === id || w.referenceNo === id);

  if (!wd) {
    return res.status(404).json({ success: false, message: 'Penarikan tidak ditemukan.' });
  }

  if (wd.status === 'APPROVED') {
    return res.status(400).json({ success: false, message: 'Penarikan sudah disetujui sebelumnya.' });
  }

  wd.status = 'APPROVED';
  wd.approvedAt = new Date().toISOString();

  const tx = db.getAllTransactions('WITHDRAWAL').find((t) => t.referenceNo === wd.referenceNo);
  if (tx) tx.status = 'APPROVED';

  db.createNotification({
    userId: wd.userId,
    category: 'WITHDRAWAL',
    title: 'Penarikan Saldo Disetujui!',
    message: `Penarikan saldo Rp ${wd.amount.toLocaleString('id-ID')} ke ${wd.bankName} (${wd.accountNumber}) telah ditransfer.`,
  });

  return res.status(200).json({
    success: true,
    message: 'Penarikan saldo berhasil disetujui!',
    withdrawal: wd,
  });
});

// PUT /api/payments/admin/withdrawals/:id/reject
router.put('/admin/withdrawals/:id/reject', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { adminNotes } = req.body;
  const wd = withdrawalStore.find((w) => w.id === id || w.referenceNo === id);

  if (!wd) {
    return res.status(404).json({ success: false, message: 'Penarikan tidak ditemukan.' });
  }

  if (wd.status === 'REJECTED') {
    return res.status(400).json({ success: false, message: 'Penarikan sudah ditolak sebelumnya.' });
  }

  wd.status = 'REJECTED';
  wd.adminNotes = adminNotes || 'Ditolak oleh Admin / Finance';

  // Refund wallet
  const wallet = db.getWalletByUserId(wd.userId);
  const balanceBefore = wallet.mainWallet;
  wallet.mainWallet += wd.amount;
  wallet.updatedAt = new Date().toISOString();

  const user = db.findUserById(wd.userId);
  if (user) user.saldoPenarikan = wallet.mainWallet;

  ledgerStore.unshift({
    id: `ldg-${Date.now()}`,
    userId: wd.userId,
    type: 'CREDIT',
    amount: wd.amount,
    balanceBefore,
    balanceAfter: wallet.mainWallet,
    walletType: 'MAIN',
    referenceNo: wd.referenceNo,
    description: `Pengembalian Saldo Penarikan Ditolak (${wd.referenceNo})`,
    createdAt: new Date().toISOString(),
  });

  const tx = db.getAllTransactions('WITHDRAWAL').find((t) => t.referenceNo === wd.referenceNo);
  if (tx) tx.status = 'REJECTED';

  db.createNotification({
    userId: wd.userId,
    category: 'WITHDRAWAL',
    title: 'Penarikan Ditolak (Saldo Dikembalikan)',
    message: `Penarikan Rp ${wd.amount.toLocaleString('id-ID')} ditolak. Saldo dikembalikan ke akun Anda. Alasan: ${wd.adminNotes}`,
  });

  return res.status(200).json({
    success: true,
    message: 'Penarikan berhasil ditolak dan saldo telah dikembalikan.',
    withdrawal: wd,
  });
});

export default router;
