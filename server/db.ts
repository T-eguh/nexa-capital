import bcrypt from 'bcryptjs';

export type RoleName = 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'SUPPORT' | 'USER' | 'GUEST';

export interface UserEntity {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  passwordHash: string;
  avatarUrl?: string;
  country: string;
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  isEmailVerified: boolean;
  referralCode: string;
  referredByCode?: string;
  vipLevel: string;
  saldoPenarikan: number;
  saldoProfit: number;
  totalInvested: number;
  totalProfitEarned: number;
  totalReferralCommission: number;
  failedLoginAttempts: number;
  isLockedOut: boolean;
  lockoutUntil?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  roles: RoleName[];
}

export interface SessionEntity {
  id: string;
  userId: string;
  token: string;
  ipAddress: string;
  userAgent: string;
  deviceName: string;
  isCurrent: boolean;
  isValid: boolean;
  expiresAt: string;
  lastActiveAt: string;
  createdAt: string;
}

export interface LoginHistoryEntity {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  deviceType: string;
  status: 'SUCCESS' | 'FAILED' | 'SUSPICIOUS';
  failureReason?: string;
  createdAt: string;
}

export interface EmailVerificationEntity {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
}

export interface PasswordResetEntity {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
}

export interface RefreshTokenEntity {
  id: string;
  userId: string;
  token: string;
  isRevoked: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface WalletEntity {
  userId: string;
  mainWallet: number;
  profitWallet: number;
  referralWallet: number;
  bonusWallet: number;
  cashbackWallet: number;
  updatedAt: string;
}

export interface WalletLedgerEntity {
  id: string;
  userId: string;
  fromWallet: 'MAIN' | 'PROFIT' | 'REFERRAL' | 'BONUS' | 'CASHBACK';
  toWallet: 'MAIN' | 'PROFIT' | 'REFERRAL' | 'BONUS' | 'CASHBACK';
  amount: number;
  note: string;
  createdAt: string;
}

export interface InvestmentEntity {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productCategory: string;
  productImage: string;
  amountInvested: number;
  dailyProfit: number;
  totalProfitTarget: number;
  profitEarned: number;
  daysElapsed: number;
  totalDays: number;
  remainingDays: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  isLockable35H: boolean;
  purchaseDate: string;
  completedDate?: string;
  lastProfitClaimAt?: string;
}

export interface TransactionEntity {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PRODUCT_PURCHASE' | 'DAILY_PROFIT' | 'REFERRAL_COMMISSION' | 'TESTIMONIAL_REWARD' | 'WALLET_TRANSFER' | 'MATURITY_PAYOUT';
  amount: number;
  fee: number;
  status: 'APPROVED' | 'SUCCESS' | 'PENDING' | 'REJECTED';
  note: string;
  referenceNo: string;
  date: string;
}

export interface NotificationEntity {
  id: string;
  userId: string;
  category: 'INVESTMENT' | 'DEPOSIT' | 'WITHDRAWAL' | 'REFERRAL' | 'SECURITY' | 'SYSTEM';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ProfitLogEntity {
  id: string;
  userId: string;
  investmentId: string;
  productName: string;
  amount: number;
  date: string;
}

export interface CMSContentEntity {
  heroTitle: string;
  heroSubtitle: string;
  bannerText: string;
  bannerActive: boolean;
  faqs: { id: string; question: string; answer: string; category: string }[];
  news: { id: string; title: string; summary: string; content: string; author: string; date: string; imageUrl: string }[];
  socialLinks: { telegram: string; whatsapp: string; instagram: string; youtube: string };
  termsOfService: string;
  privacyPolicy: string;
  contactEmail: string;
  contactPhone: string;
  companyAddress: string;
}

export interface AnnouncementEntity {
  id: string;
  title: string;
  content: string;
  category: 'GENERAL' | 'PROMO' | 'SYSTEM' | 'MAINTENANCE';
  status: 'PUBLISHED' | 'SCHEDULED' | 'DRAFT' | 'ARCHIVED';
  publishedAt?: string;
  createdAt: string;
}

export interface SupportTicketEntity {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'DEPOSIT' | 'WITHDRAWAL' | 'INVESTMENT' | 'ACCOUNT' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  assignedStaff?: string;
  replies: { id: string; sender: 'USER' | 'STAFF' | 'SYSTEM'; senderName: string; message: string; date: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntity {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  module: 'AUTH' | 'USER' | 'PRODUCT' | 'DEPOSIT' | 'WITHDRAWAL' | 'ROLE' | 'SETTINGS' | 'CMS';
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface SystemLogEntity {
  id: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  source: string;
  stack?: string;
  createdAt: string;
}

export interface SystemSettingsEntity {
  appName: string;
  brandTagline: string;
  logoUrl: string;
  faviconUrl: string;
  defaultTheme: 'DARK' | 'LIGHT' | 'PRESET';
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  timezone: string;
  currency: string;
  language: string;
  isMaintenanceMode: boolean;
  maintenanceReason?: string;
}

export interface FileAssetEntity {
  id: string;
  name: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
  folder: string;
  uploadedBy: string;
  createdAt: string;
}

// System Roles & Permissions Matrix
export const ROLE_PERMISSIONS: Record<RoleName, string[]> = {
  SUPER_ADMIN: [
    'users:read', 'users:write', 'users:delete',
    'roles:manage', 'system:settings', 'audit:logs',
    'deposits:approve', 'withdrawals:approve', 'products:manage'
  ],
  ADMIN: [
    'users:read', 'users:write',
    'deposits:approve', 'withdrawals:approve', 'products:manage', 'audit:logs'
  ],
  MODERATOR: [
    'users:read', 'testimonials:approve', 'audit:logs'
  ],
  SUPPORT: [
    'users:read', 'tickets:manage'
  ],
  USER: [
    'profile:read', 'profile:write', 'investments:buy', 'transactions:view'
  ],
  GUEST: [
    'public:view'
  ]
};

class InMemoryDatabase {
  private users: UserEntity[] = [];
  private sessions: SessionEntity[] = [];
  private loginHistory: LoginHistoryEntity[] = [];
  private emailVerifications: EmailVerificationEntity[] = [];
  private passwordResets: PasswordResetEntity[] = [];
  private refreshTokens: RefreshTokenEntity[] = [];
  private wallets: WalletEntity[] = [];
  private walletLedgers: WalletLedgerEntity[] = [];
  private investments: InvestmentEntity[] = [];
  private transactions: TransactionEntity[] = [];
  private notifications: NotificationEntity[] = [];
  private profitLogs: ProfitLogEntity[] = [];

  // Phase 5 Enterprise Admin & CMS State
  private cmsContent: CMSContentEntity = {
    heroTitle: 'Platform Investasi Saham Modern & Dividen Harian',
    heroSubtitle: 'Investasi saham terpercaya dengan imbal hasil teratur, transparansi penuh, dan komisi referral multi-tier.',
    bannerText: '🔥 PROMO EVENT: Dapatkan Bonus Cashback hingga Rp 50.000 untuk deposit di atas Rp 1.000.000!',
    bannerActive: true,
    faqs: [
      { id: 'faq-1', question: 'Bagaimana cara mulai berinvestasi di Nexa Capital?', answer: 'Daftar akun, lakukan deposit via QRIS/Transfer Bank, dan pilih paket saham favorit Anda.', category: 'Umum' },
      { id: 'faq-2', question: 'Kapan dividen / profit harian bisa diklaim?', answer: 'Profit harian dapat diklaim setiap 24 jam sekali dari halaman Dashboard Pengguna.', category: 'Profit & Penarikan' },
      { id: 'faq-3', question: 'Berapa minimal penarikan saldo?', answer: 'Minimal penarikan adalah Rp 20.000 tanpa biaya tersembunyi.', category: 'Penarikan' }
    ],
    news: [
      {
        id: 'news-1',
        title: 'Nexa Capital Tembus Total Portofolio Rp 50 Miliar',
        summary: 'Pencapaian luar biasa berkat kepercayaan ribuan investor aktif di seluruh Indonesia.',
        content: 'Nexa Capital secara resmi mengumumkan total dana kelolaan saham dan investasi telah melampaui Rp 50 Miliar.',
        author: 'Nexa News Desk',
        date: new Date().toISOString().split('T')[0],
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80'
      }
    ],
    socialLinks: {
      telegram: 'https://t.me/nexacapital_official',
      whatsapp: 'https://wa.me/6281299001122',
      instagram: 'https://instagram.com/nexacapital.id',
      youtube: 'https://youtube.com/@nexacapital'
    },
    termsOfService: 'Ketentuan layanan penggunaan Nexa Capital. Harap gunakan akun dengan bijak dan ikuti seluruh syarat dan ketentuan investasi.',
    privacyPolicy: 'Kebijakan privasi Nexa Capital menjamin keamanan data pribadi, nomor HP, dan informasi transaksi Anda terlindungi dengan enkripsi 256-bit.',
    contactEmail: 'support@nexainvest.id',
    contactPhone: '+62 812-9900-1122',
    companyAddress: 'Nexa Capital Financial Tower Lt. 28, Jakarta Selatan, Indonesia'
  };

  private announcements: AnnouncementEntity[] = [
    {
      id: 'ann-1',
      title: 'Pembaruan Fitur: Transfer Antar Dompet Instan',
      content: 'Pengguna sekarang dapat memindahkan Saldo Profit dan Saldo Referral langsung ke Saldo Penarikan Utama secara instan.',
      category: 'SYSTEM',
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
  ];

  private tickets: SupportTicketEntity[] = [
    {
      id: 'tkt-101',
      userId: 'usr-member-1',
      userName: 'Budi Santoso',
      userEmail: 'budi.santoso@example.com',
      subject: 'Pertanyaan mengenai waktu verifikasi deposit QRIS',
      category: 'DEPOSIT',
      priority: 'MEDIUM',
      status: 'OPEN',
      assignedStaff: 'Support Admin',
      replies: [
        {
          id: 'rep-1',
          sender: 'USER',
          senderName: 'Budi Santoso',
          message: 'Halo min, deposit saya via QRIS baru saja masuk, berapa lama otomatis disetujui?',
          date: new Date(Date.now() - 3600000).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString()
    }
  ];

  private auditLogs: AuditLogEntity[] = [
    {
      id: 'aud-1',
      userId: 'usr-superadmin',
      userEmail: 'superadmin@nexainvest.id',
      action: 'SYSTEM_BOOT',
      module: 'SETTINGS',
      details: 'Sistem Enterprise Admin & CMS telah berhasil diinisialisasi.',
      ipAddress: '127.0.0.1',
      createdAt: new Date().toISOString()
    }
  ];

  private systemLogs: SystemLogEntity[] = [
    {
      id: 'slog-1',
      level: 'INFO',
      message: 'Server backend Nexa Capital siap melayani permintaan API.',
      source: 'server.ts',
      createdAt: new Date().toISOString()
    }
  ];

  private systemSettings: SystemSettingsEntity = {
    appName: 'Nexa Capital Enterprise',
    brandTagline: 'Platform Investment Saham & Dividen Harian Real-Time',
    logoUrl: '/favicon.ico',
    faviconUrl: '/favicon.ico',
    defaultTheme: 'DARK',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'notifications@nexainvest.id',
    timezone: 'Asia/Jakarta',
    currency: 'IDR',
    language: 'id',
    isMaintenanceMode: false
  };

  private fileAssets: FileAssetEntity[] = [
    {
      id: 'file-1',
      name: 'banner_promo_august.jpg',
      url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
      sizeBytes: 420000,
      mimeType: 'image/jpeg',
      folder: 'banners',
      uploadedBy: 'superadmin',
      createdAt: new Date().toISOString()
    }
  ];

  constructor() {
    this.seedInitialUsers();
    this.seedPhase4Data();
  }

  private seedPhase4Data() {
    // Wallets
    this.wallets.push(
      {
        userId: 'usr-superadmin',
        mainWallet: 50000000,
        profitWallet: 12000000,
        referralWallet: 5000000,
        bonusWallet: 1000000,
        cashbackWallet: 500000,
        updatedAt: new Date().toISOString(),
      },
      {
        userId: 'usr-admin',
        mainWallet: 10000000,
        profitWallet: 2500000,
        referralWallet: 1200000,
        bonusWallet: 250000,
        cashbackWallet: 100000,
        updatedAt: new Date().toISOString(),
      },
      {
        userId: 'usr-member-1',
        mainWallet: 250000,
        profitWallet: 87500,
        referralWallet: 32000,
        bonusWallet: 10000,
        cashbackWallet: 5000,
        updatedAt: new Date().toISOString(),
      }
    );

    // Investments for usr-member-1
    this.investments.push(
      {
        id: 'inv-101',
        userId: 'usr-member-1',
        productId: 'prod-bbca',
        productName: 'BBCA - Bank Central Asia Bluechip',
        productCategory: 'Banking & Financial',
        productImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=80',
        amountInvested: 100000,
        dailyProfit: 12000,
        totalProfitTarget: 420000,
        profitEarned: 60000,
        daysElapsed: 5,
        totalDays: 35,
        remainingDays: 30,
        riskLevel: 'LOW',
        status: 'ACTIVE',
        isLockable35H: true,
        purchaseDate: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        id: 'inv-102',
        userId: 'usr-member-1',
        productId: 'prod-tlkm',
        productName: 'TLKM - Telkom Indonesia Digital Yield',
        productCategory: 'Telecommunication',
        productImage: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=500&auto=format&fit=crop&q=80',
        amountInvested: 50000,
        dailyProfit: 5500,
        totalProfitTarget: 192500,
        profitEarned: 27500,
        daysElapsed: 5,
        totalDays: 35,
        remainingDays: 30,
        riskLevel: 'MEDIUM',
        status: 'ACTIVE',
        isLockable35H: false,
        purchaseDate: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        id: 'inv-103',
        userId: 'usr-member-1',
        productId: 'prod-goto',
        productName: 'GOTO - GoTo Gojek Tokopedia Fast Yield',
        productCategory: 'Technology & E-commerce',
        productImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&auto=format&fit=crop&q=80',
        amountInvested: 100000,
        dailyProfit: 25000,
        totalProfitTarget: 75000,
        profitEarned: 75000,
        daysElapsed: 3,
        totalDays: 3,
        remainingDays: 0,
        riskLevel: 'HIGH',
        status: 'COMPLETED',
        isLockable35H: false,
        purchaseDate: new Date(Date.now() - 10 * 86400000).toISOString(),
        completedDate: new Date(Date.now() - 7 * 86400000).toISOString(),
      }
    );

    // Transactions for usr-member-1
    this.transactions.push(
      {
        id: 'tx-501',
        userId: 'usr-member-1',
        type: 'DEPOSIT',
        amount: 300000,
        fee: 0,
        status: 'APPROVED',
        note: 'Deposit Saldo via QRIS Instant',
        referenceNo: 'NX-DEP-20260801-9921',
        date: new Date(Date.now() - 12 * 86400000).toISOString(),
      },
      {
        id: 'tx-502',
        userId: 'usr-member-1',
        type: 'PRODUCT_PURCHASE',
        amount: 100000,
        fee: 0,
        status: 'SUCCESS',
        note: 'Pembelian Paket BBCA Bluechip',
        referenceNo: 'NX-INV-20260801-4412',
        date: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        id: 'tx-503',
        userId: 'usr-member-1',
        type: 'PRODUCT_PURCHASE',
        amount: 50000,
        fee: 0,
        status: 'SUCCESS',
        note: 'Pembelian Paket TLKM Digital Yield',
        referenceNo: 'NX-INV-20260801-4413',
        date: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        id: 'tx-504',
        userId: 'usr-member-1',
        type: 'DAILY_PROFIT',
        amount: 17500,
        fee: 0,
        status: 'SUCCESS',
        note: 'Klaim Profit Harian Saham BBCA & TLKM',
        referenceNo: 'NX-PRF-20260805-1102',
        date: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        id: 'tx-505',
        userId: 'usr-member-1',
        type: 'REFERRAL_COMMISSION',
        amount: 32000,
        fee: 0,
        status: 'SUCCESS',
        note: 'Bonus Komisi Referral Level 1 (Anis S.)',
        referenceNo: 'NX-REF-20260804-8831',
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
      }
    );

    // Notifications for usr-member-1
    this.notifications.push(
      {
        id: 'notif-1',
        userId: 'usr-member-1',
        category: 'DAILY_PROFIT' as any,
        title: 'Profit Harian Berhasil Diklaim!',
        message: 'Profit sebesar Rp 17.500 telah ditambahkan ke saldo akun Anda.',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      },
      {
        id: 'notif-2',
        userId: 'usr-member-1',
        category: 'REFERRAL',
        title: 'Komisi Referral Masuk!',
        message: 'Selamat! Anda menerima komisi referral sebesar Rp 32.000 dari bawahan Level 1.',
        isRead: false,
        createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      },
      {
        id: 'notif-3',
        userId: 'usr-member-1',
        category: 'SYSTEM',
        title: 'Keamanan Akun Terverifikasi',
        message: 'Sistem Nexa Capital telah memverifikasi data akun dan alamat IP Anda.',
        isRead: true,
        createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
      }
    );

    // Profit Logs for usr-member-1
    for (let i = 1; i <= 7; i++) {
      this.profitLogs.push({
        id: `plog-${i}`,
        userId: 'usr-member-1',
        investmentId: 'inv-101',
        productName: 'BBCA - Bank Central Asia Bluechip',
        amount: 17500,
        date: new Date(Date.now() - (7 - i) * 86400000).toISOString().split('T')[0],
      });
    }
  }

  private seedInitialUsers() {
    const salt = bcrypt.genSaltSync(10);
    const superAdminPassword = bcrypt.hashSync('SuperAdmin123!', salt);
    const adminPassword = bcrypt.hashSync('admin123', salt);
    const userPassword = bcrypt.hashSync('User12345!', salt);

    // Pre-seeded Super Admin
    this.users.push({
      id: 'usr-superadmin',
      fullName: 'Super Administrator',
      username: 'superadmin',
      email: 'superadmin@nexainvest.id',
      phone: '+6281299001122',
      passwordHash: superAdminPassword,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      country: 'Indonesia',
      language: 'id',
      timezone: 'Asia/Jakarta',
      dateFormat: 'DD/MM/YYYY',
      currency: 'IDR',
      isEmailVerified: true,
      referralCode: 'NX-SUPER',
      vipLevel: 'VIP 3',
      saldoPenarikan: 50000000,
      saldoProfit: 12000000,
      totalInvested: 25000000,
      totalProfitEarned: 18000000,
      totalReferralCommission: 5000000,
      failedLoginAttempts: 0,
      isLockedOut: false,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      roles: ['SUPER_ADMIN', 'ADMIN'],
    });

    // Pre-seeded Admin
    this.users.push({
      id: 'usr-admin',
      fullName: 'System Admin',
      username: 'admin',
      email: 'admin@nexainvest.id',
      phone: '+6281288776655',
      passwordHash: adminPassword,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      country: 'Indonesia',
      language: 'id',
      timezone: 'Asia/Jakarta',
      dateFormat: 'DD/MM/YYYY',
      currency: 'IDR',
      isEmailVerified: true,
      referralCode: 'NX-ADMIN',
      vipLevel: 'VIP 3',
      saldoPenarikan: 10000000,
      saldoProfit: 2500000,
      totalInvested: 5000000,
      totalProfitEarned: 3500000,
      totalReferralCommission: 1200000,
      failedLoginAttempts: 0,
      isLockedOut: false,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      roles: ['ADMIN'],
    });

    // Pre-seeded Member User
    this.users.push({
      id: 'usr-member-1',
      fullName: 'Budi Santoso',
      username: 'budisantoso',
      email: 'budi.santoso@example.com',
      phone: '+6281355443322',
      passwordHash: userPassword,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      country: 'Indonesia',
      language: 'id',
      timezone: 'Asia/Jakarta',
      dateFormat: 'DD/MM/YYYY',
      currency: 'IDR',
      isEmailVerified: true,
      referralCode: 'NX-BUDI8',
      vipLevel: 'VIP 1',
      saldoPenarikan: 250000,
      saldoProfit: 87500,
      totalInvested: 150000,
      totalProfitEarned: 120000,
      totalReferralCommission: 32000,
      failedLoginAttempts: 0,
      isLockedOut: false,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      roles: ['USER'],
    });
  }

  // User Operations
  findUserById(id: string): UserEntity | undefined {
    return this.users.find((u) => u.id === id);
  }

  findUserByEmailOrUsername(identifier: string): UserEntity | undefined {
    const clean = identifier.trim().toLowerCase();
    return this.users.find(
      (u) => u.email.toLowerCase() === clean || u.username.toLowerCase() === clean
    );
  }

  createUser(data: Partial<UserEntity>): UserEntity {
    const newUser: UserEntity = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fullName: data.fullName || '',
      username: data.username || '',
      email: data.email || '',
      phone: data.phone || '',
      passwordHash: data.passwordHash || '',
      avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
      country: data.country || 'Indonesia',
      language: data.language || 'id',
      timezone: data.timezone || 'Asia/Jakarta',
      dateFormat: data.dateFormat || 'DD/MM/YYYY',
      currency: data.currency || 'IDR',
      isEmailVerified: data.isEmailVerified ?? false,
      referralCode: data.referralCode || `NX-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      referredByCode: data.referredByCode,
      vipLevel: 'VIP 0',
      saldoPenarikan: 0,
      saldoProfit: 0,
      totalInvested: 0,
      totalProfitEarned: 0,
      totalReferralCommission: 0,
      failedLoginAttempts: 0,
      isLockedOut: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      roles: data.roles || ['USER'],
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: string, updates: Partial<UserEntity>): UserEntity | undefined {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return undefined;
    this.users[index] = {
      ...this.users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.users[index];
  }

  // Session Operations
  createSession(session: Omit<SessionEntity, 'id' | 'createdAt'>): SessionEntity {
    const newSession: SessionEntity = {
      ...session,
      id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.sessions.push(newSession);
    return newSession;
  }

  getUserSessions(userId: string): SessionEntity[] {
    return this.sessions.filter((s) => s.userId === userId && s.isValid);
  }

  revokeSession(sessionId: string, userId: string): boolean {
    const index = this.sessions.findIndex((s) => s.id === sessionId && s.userId === userId);
    if (index !== -1) {
      this.sessions[index].isValid = false;
      return true;
    }
    return false;
  }

  revokeAllOtherSessions(currentSessionId: string, userId: string): void {
    this.sessions.forEach((s) => {
      if (s.userId === userId && s.id !== currentSessionId) {
        s.isValid = false;
      }
    });
  }

  // Refresh Token Operations
  createRefreshToken(userId: string, token: string, expiresAt: string): RefreshTokenEntity {
    const item: RefreshTokenEntity = {
      id: `rt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      token,
      isRevoked: false,
      expiresAt,
      createdAt: new Date().toISOString(),
    };
    this.refreshTokens.push(item);
    return item;
  }

  findRefreshToken(token: string): RefreshTokenEntity | undefined {
    return this.refreshTokens.find((r) => r.token === token && !r.isRevoked);
  }

  revokeRefreshToken(token: string): void {
    const item = this.refreshTokens.find((r) => r.token === token);
    if (item) item.isRevoked = true;
  }

  revokeAllUserRefreshTokens(userId: string): void {
    this.refreshTokens.forEach((r) => {
      if (r.userId === userId) r.isRevoked = true;
    });
  }

  // Login History Operations
  addLoginHistory(log: Omit<LoginHistoryEntity, 'id' | 'createdAt'>): LoginHistoryEntity {
    const newLog: LoginHistoryEntity = {
      ...log,
      id: `lh-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.loginHistory.push(newLog);
    return newLog;
  }

  getLoginHistory(userId: string): LoginHistoryEntity[] {
    return this.loginHistory
      .filter((lh) => lh.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Email Verification Tokens
  createEmailVerificationToken(userId: string, token: string, expiresAt: string): EmailVerificationEntity {
    const ev: EmailVerificationEntity = {
      id: `ev-${Date.now()}`,
      userId,
      token,
      expiresAt,
      isUsed: false,
      createdAt: new Date().toISOString(),
    };
    this.emailVerifications.push(ev);
    return ev;
  }

  findEmailVerificationToken(token: string): EmailVerificationEntity | undefined {
    return this.emailVerifications.find((ev) => ev.token === token && !ev.isUsed);
  }

  markEmailVerificationUsed(id: string): void {
    const ev = this.emailVerifications.find((e) => e.id === id);
    if (ev) ev.isUsed = true;
  }

  // Password Reset Tokens
  createPasswordResetToken(userId: string, token: string, expiresAt: string): PasswordResetEntity {
    const pr: PasswordResetEntity = {
      id: `pr-${Date.now()}`,
      userId,
      token,
      expiresAt,
      isUsed: false,
      createdAt: new Date().toISOString(),
    };
    this.passwordResets.push(pr);
    return pr;
  }

  findPasswordResetToken(token: string): PasswordResetEntity | undefined {
    return this.passwordResets.find((pr) => pr.token === token && !pr.isUsed);
  }

  markPasswordResetUsed(id: string): void {
    const pr = this.passwordResets.find((p) => p.id === id);
    if (pr) pr.isUsed = true;
  }

  // Wallet Operations
  getWalletByUserId(userId: string): WalletEntity {
    let wallet = this.wallets.find((w) => w.userId === userId);
    if (!wallet) {
      wallet = {
        userId,
        mainWallet: 0,
        profitWallet: 0,
        referralWallet: 0,
        bonusWallet: 0,
        cashbackWallet: 0,
        updatedAt: new Date().toISOString(),
      };
      this.wallets.push(wallet);
    }
    return wallet;
  }

  updateWallet(userId: string, updates: Partial<WalletEntity>): WalletEntity {
    const wallet = this.getWalletByUserId(userId);
    Object.assign(wallet, updates, { updatedAt: new Date().toISOString() });
    
    // Synchronize user entity balances as well
    const user = this.findUserById(userId);
    if (user) {
      if (typeof updates.mainWallet === 'number') user.saldoPenarikan = updates.mainWallet;
      if (typeof updates.profitWallet === 'number') user.saldoProfit = updates.profitWallet;
    }
    
    return wallet;
  }

  transferBetweenWallets(
    userId: string,
    fromWallet: 'MAIN' | 'PROFIT' | 'REFERRAL' | 'BONUS' | 'CASHBACK',
    toWallet: 'MAIN' | 'PROFIT' | 'REFERRAL' | 'BONUS' | 'CASHBACK',
    amount: number,
    note: string
  ): { success: boolean; message: string; wallet?: WalletEntity } {
    if (amount <= 0) {
      return { success: false, message: 'Jumlah transfer harus lebih dari 0.' };
    }

    const wallet = this.getWalletByUserId(userId);

    const walletKeys: Record<string, keyof WalletEntity> = {
      MAIN: 'mainWallet',
      PROFIT: 'profitWallet',
      REFERRAL: 'referralWallet',
      BONUS: 'bonusWallet',
      CASHBACK: 'cashbackWallet',
    };

    const fromKey = walletKeys[fromWallet];
    const toKey = walletKeys[toWallet];

    if ((wallet[fromKey] as number) < amount) {
      return { success: false, message: `Saldo ${fromWallet} tidak mencukupi untuk transfer.` };
    }

    (wallet[fromKey] as number) -= amount;
    (wallet[toKey] as number) += amount;
    wallet.updatedAt = new Date().toISOString();

    // Sync with UserEntity
    const user = this.findUserById(userId);
    if (user) {
      user.saldoPenarikan = wallet.mainWallet;
      user.saldoProfit = wallet.profitWallet;
    }

    // Ledger
    this.walletLedgers.push({
      id: `wl-${Date.now()}`,
      userId,
      fromWallet,
      toWallet,
      amount,
      note: note || `Transfer dari ${fromWallet} ke ${toWallet}`,
      createdAt: new Date().toISOString(),
    });

    return { success: true, message: 'Transfer antar dompet berhasil dilakukan!', wallet };
  }

  getWalletLedgers(userId: string): WalletLedgerEntity[] {
    return this.walletLedgers
      .filter((l) => l.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Investment Operations
  getInvestmentsByUserId(userId: string): InvestmentEntity[] {
    return this.investments.filter((i) => i.userId === userId);
  }

  createInvestment(data: Omit<InvestmentEntity, 'id' | 'purchaseDate' | 'profitEarned' | 'daysElapsed' | 'status'>): InvestmentEntity {
    const newInv: InvestmentEntity = {
      ...data,
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      profitEarned: 0,
      daysElapsed: 0,
      status: 'ACTIVE',
      purchaseDate: new Date().toISOString(),
    };
    this.investments.push(newInv);

    // Update user's totalInvested
    const user = this.findUserById(data.userId);
    if (user) {
      user.totalInvested += data.amountInvested;
      
      // Update VIP level logic
      if (user.totalInvested >= 2000000) user.vipLevel = 'VIP 3';
      else if (user.totalInvested >= 500000) user.vipLevel = 'VIP 2';
      else if (user.totalInvested >= 100000) user.vipLevel = 'VIP 1';
    }

    return newInv;
  }

  claimInvestmentProfit(userId: string, investmentId: string): { success: boolean; message: string; profitEarned?: number } {
    const inv = this.investments.find((i) => i.id === investmentId && i.userId === userId);
    if (!inv || inv.status !== 'ACTIVE') {
      return { success: false, message: 'Investasi tidak ditemukan atau sudah selesai.' };
    }

    const profit = inv.dailyProfit;
    inv.profitEarned += profit;
    inv.daysElapsed += 1;
    inv.remainingDays = Math.max(0, inv.totalDays - inv.daysElapsed);
    inv.lastProfitClaimAt = new Date().toISOString();

    if (inv.daysElapsed >= inv.totalDays) {
      inv.status = 'COMPLETED';
      inv.completedDate = new Date().toISOString();
    }

    // Add profit to appropriate wallet
    const wallet = this.getWalletByUserId(userId);
    if (inv.isLockable35H) {
      wallet.profitWallet += profit;
    } else {
      wallet.mainWallet += profit;
    }

    // Sync user
    const user = this.findUserById(userId);
    if (user) {
      user.totalProfitEarned += profit;
      user.saldoPenarikan = wallet.mainWallet;
      user.saldoProfit = wallet.profitWallet;
    }

    // Log Profit
    this.profitLogs.push({
      id: `plog-${Date.now()}`,
      userId,
      investmentId: inv.id,
      productName: inv.productName,
      amount: profit,
      date: new Date().toISOString().split('T')[0],
    });

    // Add Transaction
    this.createTransaction({
      userId,
      type: 'DAILY_PROFIT',
      amount: profit,
      fee: 0,
      status: 'SUCCESS',
      note: `Klaim Profit Harian ${inv.productName}`,
      referenceNo: `NX-PRF-${Date.now()}`,
    });

    return { success: true, message: `Profit Rp ${profit.toLocaleString('id-ID')} berhasil diklaim!`, profitEarned: profit };
  }

  claimAllInvestmentProfits(userId: string): { success: boolean; message: string; totalProfitClaimed: number } {
    const activeInvs = this.investments.filter((i) => i.userId === userId && i.status === 'ACTIVE');
    if (activeInvs.length === 0) {
      return { success: false, message: 'Tidak ada investasi aktif untuk diklaim.', totalProfitClaimed: 0 };
    }

    let totalClaimed = 0;
    activeInvs.forEach((inv) => {
      const res = this.claimInvestmentProfit(userId, inv.id);
      if (res.success && res.profitEarned) {
        totalClaimed += res.profitEarned;
      }
    });

    return {
      success: true,
      message: `Berhasil mengklaim profit dari ${activeInvs.length} paket investasi dengan total Rp ${totalClaimed.toLocaleString('id-ID')}!`,
      totalProfitClaimed: totalClaimed,
    };
  }

  // Transaction Operations
  getTransactionsByUserId(
    userId: string,
    options?: { type?: string; search?: string; page?: number; limit?: number }
  ): { transactions: TransactionEntity[]; total: number } {
    let list = this.transactions.filter((t) => t.userId === userId);

    if (options?.type && options.type !== 'ALL') {
      list = list.filter((t) => t.type === options.type);
    }

    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.note.toLowerCase().includes(q) ||
          t.referenceNo.toLowerCase().includes(q) ||
          t.type.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const startIndex = (page - 1) * limit;

    return {
      transactions: list.slice(startIndex, startIndex + limit),
      total: list.length,
    };
  }

  createTransaction(data: Omit<TransactionEntity, 'id' | 'date'>): TransactionEntity {
    const newTx: TransactionEntity = {
      ...data,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: new Date().toISOString(),
    };
    this.transactions.push(newTx);
    return newTx;
  }

  // Notification Operations
  getNotificationsByUserId(userId: string): NotificationEntity[] {
    return this.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  markNotificationRead(userId: string, notificationId: string): void {
    const notif = this.notifications.find((n) => n.id === notificationId && n.userId === userId);
    if (notif) notif.isRead = true;
  }

  markAllNotificationsRead(userId: string): void {
    this.notifications.forEach((n) => {
      if (n.userId === userId) n.isRead = true;
    });
  }

  createNotification(data: Omit<NotificationEntity, 'id' | 'createdAt' | 'isRead'>): NotificationEntity {
    const notif: NotificationEntity = {
      ...data,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.push(notif);
    return notif;
  }

  // Profit Log Operations
  getProfitLogsByUserId(userId: string): ProfitLogEntity[] {
    return this.profitLogs
      .filter((pl) => pl.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // ==========================================================
  // PHASE 5 ENTERPRISE ADMIN & CMS METHODS
  // ==========================================================

  // Admin User CRUD Operations
  getAllUsers(): UserEntity[] {
    return this.users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  deleteUser(id: string): boolean {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      this.users.splice(idx, 1);
      return true;
    }
    return false;
  }

  setUserStatus(id: string, isLockedOut: boolean): UserEntity | undefined {
    const user = this.findUserById(id);
    if (user) {
      user.isLockedOut = isLockedOut;
      user.updatedAt = new Date().toISOString();
    }
    return user;
  }

  setUserRoles(id: string, roles: RoleName[]): UserEntity | undefined {
    const user = this.findUserById(id);
    if (user) {
      user.roles = roles;
      user.updatedAt = new Date().toISOString();
    }
    return user;
  }

  // Admin Product Operations
  // (Products are managed via existing products array / or products logic)

  // Admin Deposits & Withdrawals Operations
  getAllTransactions(type?: string): TransactionEntity[] {
    if (type && type !== 'ALL') {
      return this.transactions.filter((t) => t.type === type).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return this.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  approveDeposit(transactionId: string): { success: boolean; message: string; transaction?: TransactionEntity } {
    const tx = this.transactions.find((t) => t.id === transactionId && t.type === 'DEPOSIT');
    if (!tx) return { success: false, message: 'Transaksi deposit tidak ditemukan.' };
    if (tx.status === 'APPROVED' || tx.status === 'SUCCESS') {
      return { success: false, message: 'Deposit sudah disetujui sebelumnya.' };
    }

    tx.status = 'APPROVED';
    
    // Credit main wallet
    const wallet = this.getWalletByUserId(tx.userId);
    wallet.mainWallet += tx.amount;
    wallet.updatedAt = new Date().toISOString();

    const user = this.findUserById(tx.userId);
    if (user) user.saldoPenarikan = wallet.mainWallet;

    // Create Notification
    this.createNotification({
      userId: tx.userId,
      category: 'DEPOSIT',
      title: 'Deposit Berhasil Disetujui!',
      message: `Deposit sebesar Rp ${tx.amount.toLocaleString('id-ID')} telah disetujui admin dan ditambahkan ke saldo Anda.`,
    });

    return { success: true, message: `Deposit Rp ${tx.amount.toLocaleString('id-ID')} berhasil disetujui!`, transaction: tx };
  }

  rejectDeposit(transactionId: string, note?: string): { success: boolean; message: string; transaction?: TransactionEntity } {
    const tx = this.transactions.find((t) => t.id === transactionId && t.type === 'DEPOSIT');
    if (!tx) return { success: false, message: 'Transaksi deposit tidak ditemukan.' };

    tx.status = 'REJECTED';
    if (note) tx.note = `${tx.note} [Penolakan Admin: ${note}]`;

    // Create Notification
    this.createNotification({
      userId: tx.userId,
      category: 'DEPOSIT',
      title: 'Deposit Ditolak',
      message: `Deposit sebesar Rp ${tx.amount.toLocaleString('id-ID')} ditolak. Alasan: ${note || 'Bukti transfer tidak valid'}.`,
    });

    return { success: true, message: 'Deposit berhasil ditolak.', transaction: tx };
  }

  approveWithdrawal(transactionId: string): { success: boolean; message: string; transaction?: TransactionEntity } {
    const tx = this.transactions.find((t) => t.id === transactionId && t.type === 'WITHDRAWAL');
    if (!tx) return { success: false, message: 'Transaksi penarikan tidak ditemukan.' };
    if (tx.status === 'APPROVED' || tx.status === 'SUCCESS') {
      return { success: false, message: 'Penarikan sudah disetujui sebelumnya.' };
    }

    tx.status = 'APPROVED';

    // Create Notification
    this.createNotification({
      userId: tx.userId,
      category: 'WITHDRAWAL',
      title: 'Penarikan Saldo Disetujui!',
      message: `Penarikan saldo sebesar Rp ${tx.amount.toLocaleString('id-ID')} telah diproses dan ditransfer ke rekening/e-wallet Anda.`,
    });

    return { success: true, message: `Penarikan Rp ${tx.amount.toLocaleString('id-ID')} berhasil disetujui!`, transaction: tx };
  }

  rejectWithdrawal(transactionId: string, note?: string): { success: boolean; message: string; transaction?: TransactionEntity } {
    const tx = this.transactions.find((t) => t.id === transactionId && t.type === 'WITHDRAWAL');
    if (!tx) return { success: false, message: 'Transaksi penarikan tidak ditemukan.' };

    tx.status = 'REJECTED';
    if (note) tx.note = `${tx.note} [Penolakan Admin: ${note}]`;

    // Refund wallet
    const wallet = this.getWalletByUserId(tx.userId);
    wallet.mainWallet += tx.amount + (tx.fee || 0);
    wallet.updatedAt = new Date().toISOString();

    const user = this.findUserById(tx.userId);
    if (user) user.saldoPenarikan = wallet.mainWallet;

    // Create Notification
    this.createNotification({
      userId: tx.userId,
      category: 'WITHDRAWAL',
      title: 'Penarikan Saldo Ditolak (Saldo Dikembalikan)',
      message: `Penarikan saldo sebesar Rp ${tx.amount.toLocaleString('id-ID')} ditolak. Saldo telah dikembalikan ke akun Anda.`,
    });

    return { success: true, message: 'Penarikan berhasil ditolak dan saldo dikembalikan.', transaction: tx };
  }

  // Admin All Investments
  getAllInvestments(): InvestmentEntity[] {
    return this.investments.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
  }

  updateInvestmentStatus(id: string, status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'): InvestmentEntity | undefined {
    const inv = this.investments.find((i) => i.id === id);
    if (inv) {
      inv.status = status;
      if (status === 'COMPLETED') inv.completedDate = new Date().toISOString();
    }
    return inv;
  }

  // Admin Wallets Management
  getAllWallets(): WalletEntity[] {
    return this.wallets;
  }

  adjustWalletBalance(userId: string, walletType: 'mainWallet' | 'profitWallet' | 'referralWallet' | 'bonusWallet' | 'cashbackWallet', amount: number, isCredit: boolean, reason: string): WalletEntity {
    const wallet = this.getWalletByUserId(userId);
    if (isCredit) {
      wallet[walletType] += amount;
    } else {
      wallet[walletType] = Math.max(0, wallet[walletType] - amount);
    }
    wallet.updatedAt = new Date().toISOString();

    const user = this.findUserById(userId);
    if (user) {
      user.saldoPenarikan = wallet.mainWallet;
      user.saldoProfit = wallet.profitWallet;
    }

    this.createTransaction({
      userId,
      type: 'WALLET_TRANSFER',
      amount,
      fee: 0,
      status: 'SUCCESS',
      note: `Penyesuaian Saldo Admin (${isCredit ? '+' : '-'}${amount}): ${reason}`,
      referenceNo: `NX-ADJ-${Date.now()}`
    });

    return wallet;
  }

  // CMS Operations
  getCMSContent(): CMSContentEntity {
    return this.cmsContent;
  }

  updateCMSContent(updates: Partial<CMSContentEntity>): CMSContentEntity {
    this.cmsContent = { ...this.cmsContent, ...updates };
    return this.cmsContent;
  }

  // Announcements Operations
  getAnnouncements(): AnnouncementEntity[] {
    return this.announcements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createAnnouncement(data: Omit<AnnouncementEntity, 'id' | 'createdAt'>): AnnouncementEntity {
    const ann: AnnouncementEntity = {
      ...data,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.announcements.push(ann);
    return ann;
  }

  updateAnnouncement(id: string, updates: Partial<AnnouncementEntity>): AnnouncementEntity | undefined {
    const idx = this.announcements.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.announcements[idx] = { ...this.announcements[idx], ...updates };
      return this.announcements[idx];
    }
    return undefined;
  }

  deleteAnnouncement(id: string): boolean {
    const idx = this.announcements.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.announcements.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Support Tickets Operations
  getTickets(): SupportTicketEntity[] {
    return this.tickets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  replyTicket(ticketId: string, sender: 'USER' | 'STAFF' | 'SYSTEM', senderName: string, message: string): SupportTicketEntity | undefined {
    const tkt = this.tickets.find((t) => t.id === ticketId);
    if (tkt) {
      tkt.replies.push({
        id: `rep-${Date.now()}`,
        sender,
        senderName,
        message,
        date: new Date().toISOString()
      });
      tkt.status = sender === 'STAFF' ? 'IN_PROGRESS' : 'OPEN';
      tkt.updatedAt = new Date().toISOString();
    }
    return tkt;
  }

  updateTicketStatus(ticketId: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'): SupportTicketEntity | undefined {
    const tkt = this.tickets.find((t) => t.id === ticketId);
    if (tkt) {
      tkt.status = status;
      tkt.updatedAt = new Date().toISOString();
    }
    return tkt;
  }

  // Audit & System Logs
  getAuditLogs(): AuditLogEntity[] {
    return this.auditLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addAuditLog(log: Omit<AuditLogEntity, 'id' | 'createdAt'>): AuditLogEntity {
    const item: AuditLogEntity = {
      ...log,
      id: `aud-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.auditLogs.push(item);
    return item;
  }

  getSystemLogs(): SystemLogEntity[] {
    return this.systemLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addSystemLog(log: Omit<SystemLogEntity, 'id' | 'createdAt'>): SystemLogEntity {
    const item: SystemLogEntity = {
      ...log,
      id: `slog-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.systemLogs.push(item);
    return item;
  }

  // System Settings Operations
  getSystemSettings(): SystemSettingsEntity {
    return this.systemSettings;
  }

  updateSystemSettings(updates: Partial<SystemSettingsEntity>): SystemSettingsEntity {
    this.systemSettings = { ...this.systemSettings, ...updates };
    return this.systemSettings;
  }

  // File Assets Operations
  getFileAssets(): FileAssetEntity[] {
    return this.fileAssets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addFileAsset(data: Omit<FileAssetEntity, 'id' | 'createdAt'>): FileAssetEntity {
    const file: FileAssetEntity = {
      ...data,
      id: `file-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.fileAssets.push(file);
    return file;
  }

  deleteFileAsset(id: string): boolean {
    const idx = this.fileAssets.findIndex((f) => f.id === id);
    if (idx !== -1) {
      this.fileAssets.splice(idx, 1);
      return true;
    }
    return false;
  }
}

export const db = new InMemoryDatabase();
