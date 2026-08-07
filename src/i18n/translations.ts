export type LanguageCode = 'id' | 'en' | 'ja' | 'zh' | 'ar' | 'es' | 'fr';

export interface Translations {
  [key: string]: {
    [lang in LanguageCode]?: string;
  };
}

export const translations: Translations = {
  // Navigation & General
  brand_name: {
    id: 'Nexa Capital',
    en: 'Nexa Capital',
  },
  dashboard: {
    id: 'Dashboard',
    en: 'Dashboard',
  },
  products: {
    id: 'Produk',
    en: 'Products',
  },
  portfolio: {
    id: 'Portofolio',
    en: 'Portfolio',
  },
  analytics: {
    id: 'Analytics',
    en: 'Analytics',
  },
  reports: {
    id: 'Laporan',
    en: 'Reports',
  },
  announcements: {
    id: 'Pengumuman',
    en: 'Announcements',
  },
  ledger: {
    id: 'Ledger',
    en: 'Ledger',
  },
  history: {
    id: 'Riwayat',
    en: 'History',
  },
  referral: {
    id: 'Referral',
    en: 'Referral',
  },
  deposit: {
    id: 'Deposit Saldo',
    en: 'Deposit Balance',
  },
  withdraw: {
    id: 'Tarik Saldo',
    en: 'Withdraw Balance',
  },
  balance_main: {
    id: 'Main Wallet (Saldo Utama)',
    en: 'Main Wallet Balance',
  },
  balance_profit: {
    id: 'Profit Wallet (Dividen)',
    en: 'Profit Wallet (Dividends)',
  },
  total_investment: {
    id: 'Total Investasi Aktif',
    en: 'Total Active Investments',
  },
  daily_yield: {
    id: 'Estimasi Dividen Harian',
    en: 'Estimated Daily Yield',
  },
  active_packages: {
    id: 'Paket Investasi Aktif',
    en: 'Active Investment Packages',
  },
  quick_invest: {
    id: 'Investasi Instan',
    en: 'Quick Invest',
  },
  ai_assistant: {
    id: 'NexaAI Assistant',
    en: 'NexaAI Assistant',
  },
  offline_notice: {
    id: 'Anda sedang dalam mode offline.',
    en: 'You are currently offline.',
  },
  install_pwa: {
    id: 'Install Aplikasi Nexa Capital',
    en: 'Install Nexa Capital App',
  },
  share_app: {
    id: 'Bagikan Platform',
    en: 'Share Platform',
  },
};
