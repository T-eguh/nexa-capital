import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { depositStore } from './payments';

const router = Router();

// Platform Settings File Persistence
const SETTINGS_FILE_PATH = path.join(process.cwd(), 'server', 'platform-settings.json');

export interface ServerPlatformSettings {
  appName: string;
  brandTagline: string;
  logoUrl: string;
  supportTelegram: string;
  supportTelegramUsername: string;
  telegramChannel: string;
  supportWhatsapp: string;
  runningText: string;

  welcomeModalEnabled: boolean;
  welcomeModalTitle: string;
  welcomeModalSubtitle: string;
  welcomeBadge1: string;
  welcomeBadge2: string;
  welcomeSecurityText: string;

  deposit24HoursEnabled: boolean;
  minDeposit: number;
  maxDeposit: number;
  depositPresetAmounts: number[];

  qris1Enabled: boolean;
  qris1Name: string;
  qris1Detail: string;
  qris1ImageUrl: string;

  qris2Enabled: boolean;
  qris2Name: string;
  qris2Detail: string;
  qris2ImageUrl: string;

  bankTransferEnabled: boolean;
  bankMaintenanceMessage: string;
  bankAccounts: Array<{ bank: string; name: string; number: string; color: string }>;

  ewalletDirectEnabled: boolean;
  ewalletMaintenanceMessage: string;
  ewalletNumber: string;
  ewalletHolder: string;

  withdrawalEnabled: boolean;
  withdrawalOpenHour: number;
  withdrawalCloseHour: number;
  withdrawalTimezone: string;
  withdrawalDailyLimitCount: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  withdrawalFeePct: number;
  withdrawalEwalletEnabled: boolean;
  withdrawalBankEnabled: boolean;
  withdrawalBankMaintenanceMessage: string;

  referralLvl1Pct: number;
  referralLvl2Pct: number;
  referralLvl3Pct: number;
  referralAutoToWithdrawalBalance: boolean;

  isMaintenanceMode: boolean;
  maintenanceMessage: string;
}

const DEFAULT_PLATFORM_SETTINGS: ServerPlatformSettings = {
  appName: 'NEXA CAPITAL',
  brandTagline: 'Platform Investasi & Trading Saham AI Dividen Harian Terpercaya',
  logoUrl: '',
  supportTelegram: 'https://t.me/CSnexacapital',
  supportTelegramUsername: 'CSnexacapital',
  telegramChannel: 'https://t.me/nexacapitalcom',
  supportWhatsapp: '+6281234567890',
  runningText: '🔥 Selamat Datang di NEXA CAPITAL SMART MARKET! Dividen Harian Otomatis Berjalan 24 Jam • Deposit Otomatis QRIS 24 Jam Nonstop • Penarikan Operasional 09:00 - 17:00 WIB • Bonus Referral 3-Level Langsung Masuk Saldo Penarikan!',

  welcomeModalEnabled: true,
  welcomeModalTitle: 'Selamat datang',
  welcomeModalSubtitle: 'Robot trading AI & pasar saham NEXA CAPITAL siap jalan. Mulai investasi dari pasar produk.',
  welcomeBadge1: 'OJK Terdaftar',
  welcomeBadge2: 'Bappebti Diawasi',
  welcomeSecurityText: 'Data terenkripsi · transaksi dipantau 24/7',

  deposit24HoursEnabled: true,
  minDeposit: 30000,
  maxDeposit: 50000000,
  depositPresetAmounts: [50000, 100000, 250000, 500000, 1000000, 2500000, 5000000],

  qris1Enabled: true,
  qris1Name: 'QRIS Realtime (CAPITAL CELL 24 Jam)',
  qris1Detail: 'BCA, DANA, OVO, ShopeePay, Mandiri, BRI & Semua Bank / e-Wallet',
  qris1ImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=00020101021126660014ID.LINKAJA.WWW01189360091410265656720215ID10265656729160303UMI51590014ID.LINKAJA.WWW01189360091410265656720215ID10265656729165204581253033605802ID5922CAPITAL%20CELL,%20BNDNG%20KD6007BANDUNG61054011562070703A0163047906&margin=8',

  qris2Enabled: false,
  qris2Name: 'QRIS Backup 24 Jam',
  qris2Detail: 'Semua Aplikasi e-Wallet & m-Banking Nasional',
  qris2ImageUrl: '',

  bankTransferEnabled: true,
  bankMaintenanceMessage: 'Jalur Transfer Rekening Bank siap melayani deposit BCA, Mandiri, dan BRI.',
  bankAccounts: [
    { bank: 'BCA', name: 'PT NEXA CAPITAL TRADING', number: '8820-1948-21', color: 'bg-blue-600' },
    { bank: 'Mandiri', name: 'PT NEXA CAPITAL TRADING', number: '1380-0092-111', color: 'bg-yellow-600' },
    { bank: 'BRI', name: 'PT NEXA CAPITAL TRADING', number: '0021-0100-222-301', color: 'bg-blue-800' },
  ],

  ewalletDirectEnabled: true,
  ewalletMaintenanceMessage: 'Jalur Transfer E-Wallet langsung siap melayani via DANA, GoPay, OVO, dan ShopeePay.',
  ewalletNumber: '0812-9876-5432',
  ewalletHolder: 'NEXA OFFICIAL TREASURY',

  withdrawalEnabled: true,
  withdrawalOpenHour: 9,
  withdrawalCloseHour: 17,
  withdrawalTimezone: 'WIB',
  withdrawalDailyLimitCount: 1,
  minWithdrawal: 50000,
  maxWithdrawal: 10000000,
  withdrawalFeePct: 0,
  withdrawalEwalletEnabled: true,
  withdrawalBankEnabled: false,
  withdrawalBankMaintenanceMessage: 'Penarikan melalui rekening bank saat ini sedang MAINTENANCE SEMENTARA. Penarikan saat ini HANYA BISA MELALUI E-WALLET (DANA, GoPay, OVO, ShopeePay).',

  referralLvl1Pct: 32,
  referralLvl2Pct: 2,
  referralLvl3Pct: 1,
  referralAutoToWithdrawalBalance: true,

  isMaintenanceMode: false,
  maintenanceMessage: 'Platform sedang dalam peningkatan sistem rutin. Layanan akan kembali normal dalam beberapa saat.',
};

function loadSettingsFromDisk(): ServerPlatformSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const raw = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PLATFORM_SETTINGS, ...parsed };
    }
  } catch (err) {
    console.warn('[SETTINGS] Failed to load server/platform-settings.json, using defaults:', err);
  }
  return { ...DEFAULT_PLATFORM_SETTINGS };
}

function saveSettingsToDisk(settings: ServerPlatformSettings) {
  try {
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    console.error('[SETTINGS] Failed to save settings to disk:', err);
  }

  // Also safely update src/data/initialData.ts so any GitHub push / static deployment permanently retains the updated QRIS & settings
  try {
    const initialDataPath = path.join(process.cwd(), 'src', 'data', 'initialData.ts');
    if (fs.existsSync(initialDataPath)) {
      let content = fs.readFileSync(initialDataPath, 'utf-8');
      if (settings.qris1ImageUrl) {
        content = content.replace(/qris1ImageUrl:\s*['"`][^\r\n'"`]+['"`]/, `qris1ImageUrl: ${JSON.stringify(settings.qris1ImageUrl)}`);
      }
      if (settings.qris1Name) {
        content = content.replace(/qris1Name:\s*['"`][^\r\n'"`]+['"`]/, `qris1Name: ${JSON.stringify(settings.qris1Name)}`);
      }
      if (settings.qris1Detail) {
        content = content.replace(/qris1Detail:\s*['"`][^\r\n'"`]+['"`]/, `qris1Detail: ${JSON.stringify(settings.qris1Detail)}`);
      }
      fs.writeFileSync(initialDataPath, content, 'utf-8');
      console.log('[SETTINGS] Successfully synchronized updated settings to src/data/initialData.ts for GitHub repository!');
    }
  } catch (err) {
    console.warn('[SETTINGS] Could not write to initialData.ts:', err);
  }
}

let serverPlatformSettings: ServerPlatformSettings = loadSettingsFromDisk();

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

// Helper to ensure all users in server db are properly mapped to downlines
function syncDownlinesFromUsers() {
  const allUsers = db.getAllUsers();
  
  allUsers.forEach((u) => {
    if (u.referredByCode) {
      const uplineCode = u.referredByCode.trim().toUpperCase();
      const uplineUser = allUsers.find((up) => up.referralCode && up.referralCode.trim().toUpperCase() === uplineCode);
      
      const exists = sharedDownlines.find(
        (d) => (d.email === u.email || d.name === u.fullName || (u.phone && d.phone === u.phone)) &&
               d.uplineReferralCode.toUpperCase() === uplineCode
      );

      const lvl1Pct = serverPlatformSettings.referralLvl1Pct || 32;
      const spent = u.totalInvested || 0;
      const earned = Math.round(spent * (lvl1Pct / 100));

      if (!exists) {
        sharedDownlines.push({
          id: `down-${u.id}`,
          name: u.fullName,
          email: u.email,
          phone: u.phone,
          joinDate: u.createdAt ? u.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
          totalSpent: spent,
          commissionEarned: earned,
          level: 1,
          uplineReferralCode: uplineCode,
          uplineId: uplineUser?.id,
        });
      } else {
        exists.totalSpent = Math.max(exists.totalSpent, spent);
        exists.commissionEarned = Math.max(exists.commissionEarned, earned);
        if (uplineUser?.id && !exists.uplineId) {
          exists.uplineId = uplineUser.id;
        }
      }
    }
  });
}

// Ensure initial run
syncDownlinesFromUsers();

// GET /api/sync/settings - Fetch current server settings (QRIS, Bank, Referral, etc.)
router.get('/settings', (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    settings: serverPlatformSettings,
  });
});

// POST /api/sync/settings - Update server settings from Admin panel (instantly propagates to all devices)
router.post('/settings', (req: Request, res: Response) => {
  try {
    const newSettings = req.body;
    if (!newSettings || typeof newSettings !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid payload settings.' });
    }

    serverPlatformSettings = {
      ...serverPlatformSettings,
      ...newSettings,
    };

    saveSettingsToDisk(serverPlatformSettings);

    const io = req.app.get('io');
    if (io) {
      io.emit('platform_settings_updated', serverPlatformSettings);
    }

    return res.status(200).json({
      success: true,
      message: 'Pengaturan sistem & QRIS berhasil diperbarui di seluruh jaringan server!',
      settings: serverPlatformSettings,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/sync/state - Synchronize users, downlines, transactions, and platformSettings across all devices
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
      platformSettings: serverPlatformSettings,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/sync/register - Register user from any phone / device with full referral propagation
router.post('/register', (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, referralCode } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Nama dan nomor ponsel wajib diisi.' });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const userEmail = email?.trim() || `${cleanPhone}@nexacapital.id`;
    const username = name.trim().toLowerCase().replace(/\s+/g, '_') + `_${cleanPhone.slice(-4)}`;
    const cleanUplineCode = referralCode ? referralCode.trim().toUpperCase() : undefined;

    // Check if already registered
    let existing = db.findUserByEmailOrUsername(cleanPhone) || db.findUserByEmailOrUsername(userEmail);
    
    if (existing) {
      // If user exists but upline was missing, update it
      if (cleanUplineCode && !existing.referredByCode) {
        existing.referredByCode = cleanUplineCode;
      }

      // Ensure downline record is linked
      if (cleanUplineCode) {
        const uplineUser = db.getAllUsers().find((u) => u.referralCode && u.referralCode.toUpperCase() === cleanUplineCode);
        const alreadyInDownline = sharedDownlines.some(
          (d) => (d.email === existing?.email || d.phone === cleanPhone || d.name === existing?.fullName) &&
                 d.uplineReferralCode.toUpperCase() === cleanUplineCode
        );

        if (!alreadyInDownline) {
          sharedDownlines.unshift({
            id: `down-${existing.id}`,
            name: existing.fullName,
            email: existing.email,
            phone: existing.phone,
            joinDate: existing.createdAt ? existing.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
            totalSpent: existing.totalInvested || 0,
            commissionEarned: Math.round((existing.totalInvested || 0) * 0.32),
            level: 1,
            uplineReferralCode: cleanUplineCode,
            uplineId: uplineUser?.id,
          });
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Pengguna sudah terdaftar di server.',
        user: {
          id: existing.id,
          fullName: existing.fullName,
          username: existing.username,
          email: existing.email,
          phone: existing.phone,
          referralCode: existing.referralCode,
          referredBy: existing.referredByCode,
          saldoPenarikan: existing.saldoPenarikan || 0,
          saldoProfit: existing.saldoProfit || 0,
        },
      });
    }

    const passwordHash = bcrypt.hashSync(password?.trim() || 'User12345!', 10);

    const newUser = db.createUser({
      fullName: name.trim(),
      username,
      email: userEmail,
      phone: cleanPhone,
      passwordHash,
      referredByCode: cleanUplineCode || undefined,
      isEmailVerified: true,
    });

    // If registered via referral, link into shared downlines immediately
    if (cleanUplineCode) {
      const uplineUser = db.getAllUsers().find((u) => u.referralCode && u.referralCode.toUpperCase() === cleanUplineCode);
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
      message: 'Pendaftaran akun & referral berhasil tersinkronisasi ke server!',
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

// POST /api/sync/commission - Distribute and record 3-level referral commission on server
router.post('/commission', (req: Request, res: Response) => {
  try {
    const { buyerId, buyerName, buyerEmail, productPrice, productName, uplineCode } = req.body;
    const price = Number(productPrice);

    if (!price || price <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid product price.' });
    }

    if (!uplineCode || typeof uplineCode !== 'string') {
      return res.status(200).json({ success: true, message: 'No upline code provided, no commission awarded.' });
    }

    const cleanL1Code = uplineCode.trim().toUpperCase();
    const allUsers = db.getAllUsers();
    const lvl1Pct = serverPlatformSettings.referralLvl1Pct || 32;
    const lvl2Pct = serverPlatformSettings.referralLvl2Pct || 2;
    const lvl3Pct = serverPlatformSettings.referralLvl3Pct || 1;

    // --- LEVEL 1 COMMISSION ---
    const upline1 = allUsers.find((u) => u.referralCode && u.referralCode.toUpperCase() === cleanL1Code);
    let l1Commission = 0;
    if (upline1) {
      l1Commission = Math.round(price * (lvl1Pct / 100));
      upline1.saldoPenarikan = (upline1.saldoPenarikan || 0) + l1Commission;
      upline1.totalReferralCommission = (upline1.totalReferralCommission || 0) + l1Commission;

      db.createTransaction({
        userId: upline1.id,
        type: 'REFERRAL_COMMISSION',
        amount: l1Commission,
        fee: 0,
        status: 'APPROVED',
        note: `Komisi Referral Lvl 1 (${lvl1Pct}%) dari ${buyerName || 'Mitra'} (Beli ${productName || 'Produk'})`,
        referenceNo: `REF-L1-${Date.now().toString().slice(-6)}`,
      });

      // Update downline tracking
      const downlineItem = sharedDownlines.find(
        (d) => d.uplineReferralCode.toUpperCase() === cleanL1Code &&
               (d.email === buyerEmail || d.name === buyerName || d.id === `down-${buyerId}`)
      );
      if (downlineItem) {
        downlineItem.totalSpent = (downlineItem.totalSpent || 0) + price;
        downlineItem.commissionEarned = (downlineItem.commissionEarned || 0) + l1Commission;
      }

      // --- LEVEL 2 COMMISSION ---
      if (upline1.referredByCode) {
        const cleanL2Code = upline1.referredByCode.trim().toUpperCase();
        const upline2 = allUsers.find((u) => u.referralCode && u.referralCode.toUpperCase() === cleanL2Code);
        if (upline2) {
          const l2Commission = Math.round(price * (lvl2Pct / 100));
          upline2.saldoPenarikan = (upline2.saldoPenarikan || 0) + l2Commission;
          upline2.totalReferralCommission = (upline2.totalReferralCommission || 0) + l2Commission;

          db.createTransaction({
            userId: upline2.id,
            type: 'REFERRAL_COMMISSION',
            amount: l2Commission,
            fee: 0,
            status: 'APPROVED',
            note: `Komisi Referral Lvl 2 (${lvl2Pct}%) dari ${buyerName || 'Mitra'} via ${upline1.fullName} (Beli ${productName || 'Produk'})`,
            referenceNo: `REF-L2-${Date.now().toString().slice(-6)}`,
          });

          // --- LEVEL 3 COMMISSION ---
          if (upline2.referredByCode) {
            const cleanL3Code = upline2.referredByCode.trim().toUpperCase();
            const upline3 = allUsers.find((u) => u.referralCode && u.referralCode.toUpperCase() === cleanL3Code);
            if (upline3) {
              const l3Commission = Math.round(price * (lvl3Pct / 100));
              upline3.saldoPenarikan = (upline3.saldoPenarikan || 0) + l3Commission;
              upline3.totalReferralCommission = (upline3.totalReferralCommission || 0) + l3Commission;

              db.createTransaction({
                userId: upline3.id,
                type: 'REFERRAL_COMMISSION',
                amount: l3Commission,
                fee: 0,
                status: 'APPROVED',
                note: `Komisi Referral Lvl 3 (${lvl3Pct}%) dari ${buyerName || 'Mitra'} via ${upline2.fullName} (Beli ${productName || 'Produk'})`,
                referenceNo: `REF-L3-${Date.now().toString().slice(-6)}`,
              });
            }
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Komisi referral 3-level berhasil dibagikan & dicatat di server!',
      l1Commission,
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
