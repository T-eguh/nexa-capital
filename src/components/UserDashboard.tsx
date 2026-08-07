import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  Award,
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Zap,
  ChevronRight,
  PlayCircle,
  Sparkles,
  Lock,
  Send,
  ShieldCheck,
  Star,
  Search,
  ArrowLeftRight,
  HelpCircle,
  Gift,
  FileText,
  CreditCard,
  User as UserIcon,
  PieChart,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { WalletTransferModal } from './WalletTransferModal';
import { GlobalSearchModal } from './GlobalSearchModal';

interface UserDashboardProps {
  setActiveTab: (tab: string) => void;
  openDepositModal: () => void;
  openWithdrawModal: () => void;
}

const SAMPLE_GROWTH_DATA = [
  { day: 'Sen', profit: 12000, portfolio: 350000 },
  { day: 'Sel', profit: 24000, portfolio: 362000 },
  { day: 'Rab', profit: 41000, portfolio: 379000 },
  { day: 'Kam', profit: 62000, profitToday: 21000, portfolio: 400000 },
  { day: 'Jum', profit: 85000, profitToday: 23000, portfolio: 423000 },
  { day: 'Sab', profit: 98000, profitToday: 13000, portfolio: 436000 },
  { day: 'Ming', profit: 112500, profitToday: 14500, portfolio: 450000 },
];

export const UserDashboard: React.FC<UserDashboardProps> = ({
  setActiveTab,
  openDepositModal,
  openWithdrawModal,
}) => {
  const { user, userInvestments, claimDailyProfit, claimAllDailyProfits, transactions } = useApp();
  const { theme } = useTheme();

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const activeInvs = userInvestments.filter((i) => i.status === 'ACTIVE');
  const totalActiveInvestmentValue = activeInvs.reduce((acc, curr) => acc + curr.amountInvested, 0);
  const pendingProfitCount = activeInvs.length;

  const todayProfit = activeInvs.reduce((sum, i) => sum + i.dailyProfit, 0);
  const yesterdayProfit = Math.round(todayProfit * 0.92);
  const weeklyProfit = todayProfit * 7;
  const monthlyProfit = todayProfit * 30;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Welcome & VIP Banner */}
      <div
        className="rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl transition-all"
        style={{
          background: `linear-gradient(135deg, ${theme.primaryColor} 0%, #0f172a 100%)`,
        }}
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{user.vipLevel || 'VIP 0'}</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Akun Terverifikasi</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang Kembali, {user.name}!
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Portofolio saham Anda berkinerja optimal. Nikmati deviden harian otomatis & komisi referral 3-tier.
            </p>

            {/* VIP Level Info Box */}
            <div className="mt-4 p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md max-w-lg text-xs">
              <div className="flex justify-between items-center mb-1 font-semibold">
                <span>Tingkat VIP: <strong className="text-amber-300">{user.vipLevel}</strong></span>
                <span>Total Investasi: <strong>Rp {(user.totalInvested || 150000).toLocaleString('id-ID')}</strong></span>
              </div>
              <p className="text-[11px] text-slate-300">
                {user.vipLevel === 'VIP 0' && 'Tingkatkan total investasi ke Rp 100.000 untuk naik ke VIP 1 & buka Paket Durasi 3 Hari!'}
                {user.vipLevel === 'VIP 1' && 'Tingkatkan total investasi ke Rp 500.000 untuk naik ke VIP 2 & buka Paket Durasi 1 Hari!'}
                {user.vipLevel === 'VIP 2' && 'Tingkatkan total investasi ke Rp 2.000.000 untuk naik ke VIP 3 Exclusive!'}
                {user.vipLevel === 'VIP 3' && 'Selamat! Anda memegang tingkat VIP tertinggi dengan akses seluruh fitur Fast Yield!'}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={openDepositModal}
              className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold text-xs shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <ArrowDownLeft className="w-4 h-4 text-blue-600" />
              <span>Deposit Saldo</span>
            </button>
            <button
              onClick={openWithdrawModal}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-xs shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Tarik Saldo</span>
            </button>
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl font-bold text-xs shadow-md backdrop-blur-md transition-all flex items-center justify-center space-x-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Cari Sistem</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS BAR */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-3">Akses Cepat Pengguna</span>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 text-center text-xs">
          <button
            onClick={openDepositModal}
            className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold hover:scale-105 transition-all flex flex-col items-center justify-center space-y-1.5"
          >
            <ArrowDownLeft className="w-5 h-5" />
            <span className="text-[11px]">Deposit</span>
          </button>

          <button
            onClick={openWithdrawModal}
            className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold hover:scale-105 transition-all flex flex-col items-center justify-center space-y-1.5"
          >
            <ArrowUpRight className="w-5 h-5" />
            <span className="text-[11px]">Penarikan</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold hover:scale-105 transition-all flex flex-col items-center justify-center space-y-1.5"
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[11px]">Investasi</span>
          </button>

          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold hover:scale-105 transition-all flex flex-col items-center justify-center space-y-1.5"
          >
            <ArrowLeftRight className="w-5 h-5" />
            <span className="text-[11px]">Transfer</span>
          </button>

          <button
            onClick={() => setActiveTab('referral')}
            className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold hover:scale-105 transition-all flex flex-col items-center justify-center space-y-1.5"
          >
            <Users className="w-5 h-5" />
            <span className="text-[11px]">Referral</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold hover:scale-105 transition-all flex flex-col items-center justify-center space-y-1.5"
          >
            <FileText className="w-5 h-5" />
            <span className="text-[11px]">Transaksi</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 font-bold hover:scale-105 transition-all flex flex-col items-center justify-center space-y-1.5"
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-[11px]">Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold hover:scale-105 transition-all flex flex-col items-center justify-center space-y-1.5"
          >
            <PieChart className="w-5 h-5" />
            <span className="text-[11px]">Portofolio</span>
          </button>

          <a
            href={theme.supportTelegram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 font-bold hover:scale-105 transition-all flex flex-col items-center justify-center space-y-1.5"
          >
            <Send className="w-5 h-5" />
            <span className="text-[11px]">Support</span>
          </a>
        </div>
      </div>

      {/* WALLET BALANCES MATRIX (5 WALLETS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Wallet 1: Saldo Penarikan */}
        <div className="bg-gradient-to-br from-emerald-950/20 via-white to-emerald-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-5 border-2 border-emerald-500/30 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Saldo Penarikan
            </span>
            <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-sm">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Rp {(user.saldoPenarikan ?? 250000).toLocaleString('id-ID')}
            </span>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Dapat Ditarik Harian</span>
            </p>
          </div>
        </div>

        {/* Wallet 2: Saldo Profit */}
        <div className="bg-gradient-to-br from-amber-950/20 via-white to-amber-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-5 border-2 border-amber-500/30 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Saldo Profit (35H)
            </span>
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 shadow-sm">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
              Rp {(user.saldoProfit ?? 87500).toLocaleString('id-ID')}
            </span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              Lock 35 Hari
            </p>
          </div>
        </div>

        {/* Wallet 3: Saldo Referral */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Saldo Referral
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-extrabold text-purple-600 dark:text-purple-400">
              Rp {(user.totalReferralCommission ?? 32000).toLocaleString('id-ID')}
            </span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              Komisi 3 Tier
            </p>
          </div>
        </div>

        {/* Wallet 4: Saldo Bonus */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Saldo Bonus
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              Rp 10.000
            </span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              Bonus Registrasi
            </p>
          </div>
        </div>

        {/* Wallet 5: Saldo Cashback */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Saldo Cashback
            </span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-extrabold text-rose-600 dark:text-rose-400">
              Rp 5.000
            </span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              Promo Event
            </p>
          </div>
        </div>
      </div>

      {/* PROFIT STATS METRICS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Profit Hari Ini</span>
          <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
            +Rp {todayProfit.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Profit Kemarin</span>
          <span className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5 block">
            Rp {yesterdayProfit.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Profit Minggu Ini</span>
          <span className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5 block">
            Rp {weeklyProfit.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Estimasi Bulanan</span>
          <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400 mt-0.5 block">
            Rp {monthlyProfit.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Profit Akumulasi</span>
          <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
            Rp {(user.totalProfitEarned || 120000).toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {/* Claim All Profit Banner & Growth Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Analytics Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Grafik Pertumbuhan Profit 7 Hari</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Akumulasi imbal hasil harian investasi saham Anda
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              +28.5% Minggu Ini
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SAMPLE_GROWTH_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.primaryColor} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={theme.primaryColor} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `Rp${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Total Profit']}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke={theme.primaryColor}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#profitGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Profit Auto-Claim Box (1 Col) */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-2xl p-6 text-white border border-slate-700 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Otomatisasi Profit Harian</span>
              </span>
              <span className="text-[11px] text-slate-400">Ready</span>
            </div>

            <h3 className="text-lg font-bold">Klaim Profit Harian Sekaligus</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Tekan tombol di bawah untuk memproses profit harian dari semua paket investasi aktif Anda.
            </p>

            <div className="my-5 p-4 bg-slate-800/80 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">Paket Aktif Menghasilkan</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-extrabold text-amber-400">{pendingProfitCount} Paket</span>
                <span className="text-xs text-slate-300">Siap Ditagihkan</span>
              </div>
            </div>
          </div>

          <button
            onClick={claimAllDailyProfits}
            className="w-full py-3 px-4 rounded-xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-2"
          >
            <PlayCircle className="w-5 h-5 fill-slate-950 text-amber-400" />
            <span>KLAIM SEMUA PROFIT SEKARANG</span>
          </button>
        </div>
      </div>

      {/* Active Investments Progress Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Investasi Berjalan Saya ({activeInvs.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Progress durasi dan akrual profit harian
            </p>
          </div>
          <button
            onClick={() => setActiveTab('portfolio')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
          >
            <span>Lihat Semua Portfolio</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {activeInvs.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <Clock className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Belum ada investasi aktif saat ini.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Pilih produk dari katalog untuk mulai mendapatkan profit harian secara konsisten.
            </p>
            <button
              onClick={() => setActiveTab('products')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
              style={{ backgroundColor: theme.primaryColor }}
            >
              Jelajahi Produk Investasi
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeInvs.map((inv) => {
              const progressPct = Math.round((inv.daysElapsed / inv.totalDays) * 100);
              const is35H = inv.isLockable35H || inv.totalDays >= 35;
              return (
                <div
                  key={inv.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                          {inv.status}
                        </span>
                        {is35H ? (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                            35H Lock Profit
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                            Fast Yield Ditarik
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {inv.productName}
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-lg">
                      +Rp {inv.dailyProfit.toLocaleString('id-ID')}/hari
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span>Durasi: Hari ke-{inv.daysElapsed} dari {inv.totalDays}</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-slate-400 block text-[10px]">
                        {is35H ? 'Profit -> Saldo Profit' : 'Profit -> Saldo Penarikan'}
                      </span>
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        Rp {inv.profitEarned.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <button
                      onClick={() => claimDailyProfit(inv.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95 flex items-center space-x-1"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Klaim Profit</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODALS */}
      <WalletTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
      />

      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};
