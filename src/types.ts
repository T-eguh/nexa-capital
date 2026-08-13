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
