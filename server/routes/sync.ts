import { Router, Request, Response } from 'express';
import { db } from '../db';
import { depositStore, ledgerStore } from './payments';

const router = Router();

// In-memory shared downlines store synced across devices
export interface SharedDownline {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinDate: string;
  totalSpent: number;
  commissionEarned: number;
  level: 1 | 2 | 3;
  uplineReferralCode: string;
  uplineId?: string;
}

const sharedDownlines: SharedDownline[] = [];

// Helper to ensure server db users are mapped to downlines
function syncDownlinesFromUsers() {
  const allUsers = db.getAllUsers();
  allUsers.forEach((u) => {
    if (u.referredByCode) {
      const uplineCode = u.referredByCode.trim().toUpperCase();
      const uplineUser = allUsers.find((up) => up.referralCode.toUpperCase() === uplineCode);
      
      const exists = sharedDownlines.find(
        (d) => (d.email === u.email || d.name === u.fullName) && d.uplineReferralCode === uplineCode
      );

      if (!exists) {
        sharedDownlines.push({
          id: `down-${u.id}`,
          name: u.fullName,
          email: u.email,
          phone: u.phone,
          joinDate: u.createdAt ? u.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
          totalSpent: u.totalInvested || 0,
          commissionEarned: Math.round((u.totalInvested || 0) * 0.32),
          level: 1,
          uplineReferralCode: uplineCode,
          uplineId: uplineUser?.id,
        });
      }
    }
  });
}

// GET /api/sync/state - Synchronize users and downlines across all devices
router.get('/state', (req: Request, res: Response) => {
  try {
    syncDownlinesFromUsers();
    const users = db.getAllUsers().map((u) => ({
      id: u.id,
      fullName: u.fullName,
      username: u.username,
      email: u.email,
      phone: u.phone,
      roles: u.roles,
      saldoPenarikan: u.saldoPenarikan || 0,
      saldoProfit: u.saldoProfit || 0,
      totalInvested: u.totalInvested || 0,
      totalProfitEarned: u.totalProfitEarned || 0,
      totalReferralCommission: u.totalReferralCommission || 0,
      vipLevel: u.vipLevel || 'VIP 0',
      referralCode: u.referralCode,
      referredBy: u.referredByCode,
      isLockedOut: u.isLockedOut || false,
      registeredAt: u.createdAt,
    }));

    const transactions = db.getAllTransactions();

    return res.status(200).json({
      success: true,
      users,
      downlines: sharedDownlines,
      transactions,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/sync/register - Register user from any phone / device
router.post('/register', (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, referralCode } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Nama dan nomor ponsel wajib diisi.' });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const userEmail = email?.trim() || `${cleanPhone}@nexacapital.id`;
    const username = name.trim().toLowerCase().replace(/\s+/g, '_') + `_${cleanPhone.slice(-4)}`;

    // Check if already registered
    const existing = db.findUserByEmailOrUsername(cleanPhone) || db.findUserByEmailOrUsername(userEmail);
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Pengguna sudah terdaftar di server.',
        user: existing,
      });
    }

    const newRefCode = `NX-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const cleanUplineCode = referralCode?.trim()?.toUpperCase();

    const newUser = db.createUser({
      fullName: name.trim(),
      username,
      email: userEmail,
      phone: cleanPhone,
      passwordHash: password ? `plain:${password}` : 'plain:default123',
      referredByCode: cleanUplineCode || undefined,
      isEmailVerified: true,
    });

    // If registered via referral, link into shared downlines immediately
    if (cleanUplineCode) {
      const uplineUser = db.getAllUsers().find((u) => u.referralCode.toUpperCase() === cleanUplineCode);
      sharedDownlines.unshift({
        id: `down-${newUser.id}`,
        name: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        joinDate: new Date().toISOString().split('T')[0],
        totalSpent: 0,
        commissionEarned: 0,
        level: 1,
        uplineReferralCode: cleanUplineCode,
        uplineId: uplineUser?.id,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Pendaftaran tersinkronisasi ke server!',
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        referralCode: newUser.referralCode,
        referredBy: newUser.referredByCode,
        saldoPenarikan: 0,
        saldoProfit: 0,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/sync/auto-deposit - Auto-credit deposit immediately without admin manual confirmation
router.post('/auto-deposit', (req: Request, res: Response) => {
  try {
    const { userId, amount, paymentMethod } = req.body;
    const parsedAmount = Number(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Nominal deposit tidak valid.' });
    }

    const user = db.findUserById(userId);
    if (user) {
      user.saldoPenarikan = (user.saldoPenarikan || 0) + parsedAmount;
      const wallet = db.getWalletByUserId(userId);
      if (wallet) {
        wallet.mainWallet += parsedAmount;
        wallet.updatedAt = new Date().toISOString();
      }
    }

    const refNo = `NEXA-AUTO-${Date.now().toString().slice(-6)}`;
    const tx = db.createTransaction({
      userId: userId || 'guest',
      type: 'DEPOSIT',
      amount: parsedAmount,
      fee: 0,
      status: 'APPROVED',
      note: `Deposit Otomatis Terverifikasi via ${paymentMethod || 'QRIS Realtime'} (${refNo})`,
      referenceNo: refNo,
    });

    depositStore.unshift({
      id: `dep-${Date.now()}`,
      userId: userId || 'guest',
      referenceNo: refNo,
      amount: parsedAmount,
      adminFee: 0,
      totalAmount: parsedAmount,
      paymentMethodCode: 'QRIS',
      providerCode: 'MIDTRANS',
      status: 'SUCCESS',
      instructions: ['Deposit instan otomatis berhasil.'],
      createdAt: new Date().toISOString(),
      expiredAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: 'Deposit otomatis berhasil disetujui & saldo dikreditkan!',
      amount: parsedAmount,
      transaction: tx,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
