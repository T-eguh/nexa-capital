export type TransactionType =
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'PRODUCT_PURCHASE'
  | 'DAILY_PROFIT'
  | 'REFERRAL_COMMISSION'
  | 'TESTIMONIAL_REWARD'
  | 'MATURITY_PAYOUT';

export type TransactionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUCCESS';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  note: string;
  date: string; // ISO string
  paymentMethod?: string;
  proofUrl?: string;
  accountDetails?: string;
  referralLevel?: 1 | 2 | 3;
}

export type VipLevel =
  | 'VIP 0'
  | 'VIP 1'
  | 'VIP 2'
  | 'VIP 3'
  | 'VIP 4'
  | 'VIP 5'
  | 'VIP 6'
  | 'VIP 7'
  | 'VIP 8';

export interface InvestmentProduct {
  id: string;
  name: string;
  category: string;
  productGroup?: 'Smart AI' | 'Special AI';
  price: number; // Modal aktivasi e.g. Rp 50.000 / Rp 30.000
  durationDays: number; // e.g. 35, 3, or 1 day(s)
  dailyProfitPct: number; // e.g. 2.5%
  dailyProfitAmount?: number; // Dividen harian in Rp
  totalProfitAmount: number; // Estimasi hasil in Rp
  totalReturnPct: number; // e.g. 87.5%
  riskLevel: 'Rendah' | 'Sedang' | 'Tinggi';
  status: 'active' | 'inactive';
  description: string;
  imageUrl: string;
  tags: string[];
  requiredVipLevel?: VipLevel; // Required VIP level e.g. VIP 1, VIP 2
  minVipLevel?: string;
  performance30d?: string; // e.g. "+120,94%"
  marketPrice?: string; // e.g. "2.078,73"
  marketHigh?: string; // e.g. "1.086,98"
  riskBars?: number;
  profitBars?: number;
  efficiencyBars?: number;
  isLockable35H?: boolean;
}

export interface UserInvestment {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  amountInvested: number;
  dailyProfit: number;
  totalExpectedProfit: number;
  profitEarned: number;
  daysElapsed: number;
  totalDays: number;
  startDate: string; // ISO
  endDate: string; // ISO
  lastClaimDate: string; // ISO
  status: 'ACTIVE' | 'COMPLETED';
  isLockable35H?: boolean; // If true, profits accumulate into saldoProfit and mature after 35 days
}

export interface DownlineUser {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  totalSpent: number;
  commissionEarned: number;
  level: 1 | 2 | 3;
  uplineReferralCode?: string;
  uplineId?: string;
}

export interface RegisteredUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password?: string;
  roles: string[];
  saldoPenarikan: number;
  saldoProfit: number;
  totalInvested: number;
  totalProfitEarned: number;
  totalReferralCommission: number;
  vipLevel: VipLevel;
  referralCode: string;
  referredBy?: string;
  isLockedOut?: boolean;
  registeredAt: string;
}


export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  saldoPenarikan: number; // Saldo yang dapat ditarik / dipakai beli produk
  saldoProfit: number; // Saldo profit terkunci (produk 35H)
  balance?: number; // Legacy balance fallback
  totalInvested: number;
  totalProfitEarned: number;
  totalReferralCommission: number;
  referralCode: string;
  referredBy?: string;
  vipLevel: VipLevel;
  lastWithdrawalDate?: string; // Date string format YYYY-MM-DD to restrict 1x per day
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
}

export interface Testimonial {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string; // e.g. "+62 *** 6408"
  userAvatar?: string;
  withdrawalAmount: number;
  rating: number; // 1-5
  comment: string;
  proofImageUrl?: string;
  rewardAmount?: number; // Set by admin (Rp 2.000 - Rp 5.000)
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  timeStr?: string; // e.g. "09.22"
  typeCategory?: 'Penarikan' | 'Setoran' | 'Modal';
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  primaryColor: string; // hex
  primaryHover: string;
  secondaryColor: string; // hex
  accentColor: string; // hex
  cardBg: string;
  darkCanvas: boolean;
  brandName: string;
  brandTagline: string;
  brandIcon: string; // Lucide icon identifier
}

export interface BankAccountInfo {
  bank: string;
  number: string;
  name: string;
  color?: string;
}

export interface AppThemeConfig {
  presetId: string;
  brandName: string;
  brandTagline: string;
  brandIconName: string;
  primaryColor: string;
  accentColor: string;
  isDarkMode: boolean;
  supportWhatsapp: string;
  supportTelegram: string;
  telegramChannel?: string;
  currencySymbol: string;
}

export interface PlatformSettings {
  // Brand & Identity
  appName: string;
  brandTagline: string;
  logoUrl?: string;
  supportTelegram: string;
  supportTelegramUsername: string; // e.g. "CSnexacapital"
  telegramChannel: string; // e.g. "nexacapitalcom"
  supportWhatsapp: string;
  runningText: string;

  // Welcome Modal Config
  welcomeModalEnabled: boolean;
  welcomeModalTitle: string;
  welcomeModalSubtitle: string;
  welcomeBadge1: string;
  welcomeBadge2: string;
  welcomeSecurityText: string;

  // Deposit Config
  deposit24HoursEnabled: boolean;
  minDeposit: number;
  maxDeposit: number;
  depositPresetAmounts: number[];
  
  // Channels Config
  qris1Enabled: boolean;
  qris1Name: string;
  qris1Detail: string;
  qris1ImageUrl: string;
  
  qris2Enabled: boolean;
  qris2Name: string;
  qris2Detail: string;
  qris2ImageUrl: string;
  
  bankTransferEnabled: boolean; // if false, shows maintenance
  bankMaintenanceMessage: string;
  bankAccounts: BankAccountInfo[];
  
  ewalletDirectEnabled: boolean; // if false, shows maintenance
  ewalletMaintenanceMessage: string;
  ewalletNumber: string;
  ewalletHolder: string;

  // Withdrawal Config
  withdrawalEnabled: boolean;
  withdrawalOpenHour: number; // 9
  withdrawalCloseHour: number; // 17
  withdrawalTimezone: string; // 'WIB'
  withdrawalDailyLimitCount: number; // 1 (1x per day)
  minWithdrawal: number; // 50000
  maxWithdrawal: number; // 10000000
  withdrawalFeePct: number; // 0%
  withdrawalEwalletEnabled: boolean;
  withdrawalBankEnabled: boolean; // false / maintenance
  withdrawalBankMaintenanceMessage: string;
  
  // Referral & Commission Config
  referralLvl1Pct: number; // 32
  referralLvl2Pct: number; // 2
  referralLvl3Pct: number; // 1
  referralAutoToWithdrawalBalance: boolean; // true

  // System General
  isMaintenanceMode: boolean;
  maintenanceMessage: string;
}
