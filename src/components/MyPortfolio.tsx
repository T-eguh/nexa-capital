import React, { useState } from 'react';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  Zap,
  TrendingUp,
  Award,
  Calendar,
  Sparkles,
  AlertCircle,
  PlayCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

export const MyPortfolio: React.FC = () => {
  const {
    user,
    userInvestments,
    claimDailyProfit,
    claimAllDailyProfits,
    canClaimInvestmentToday,
    getTimeUntilNextClaim,
  } = useApp();
  const { theme } = useTheme();

  const [activeTabFilter, setActiveTabFilter] = useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');

  // Filter scoped to current logged-in user
  const currentUserInvs = userInvestments.filter((i) => i.userId === user.id);
  const filteredInvestments = currentUserInvs.filter((i) => i.status === activeTabFilter);
  const activeCount = currentUserInvs.filter((i) => i.status === 'ACTIVE').length;
  const completedCount = currentUserInvs.filter((i) => i.status === 'COMPLETED').length;

  const totalActiveInvested = currentUserInvs
    .filter((i) => i.status === 'ACTIVE')
    .reduce((sum, curr) => sum + curr.amountInvested, 0);

  const totalActiveDailyReturn = currentUserInvs
    .filter((i) => i.status === 'ACTIVE')
    .reduce((sum, curr) => sum + curr.dailyProfit, 0);

  const readyInvs = currentUserInvs
    .filter((i) => i.status === 'ACTIVE')
    .filter(canClaimInvestmentToday);

  return (
    <div className="space-y-6 pb-12">
      {/* Portfolio Summary Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Portofolio Investasi Saya</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pantau status durasi, akrual dividen 24 jam, dan riwayat paket investasi saham Anda.
            </p>
          </div>

          {activeCount > 0 && (
            <button
              onClick={claimAllDailyProfits}
              disabled={readyInvs.length === 0}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-md flex items-center space-x-2 ${
                readyInvs.length > 0
                  ? 'text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 active:scale-95 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-80'
              }`}
            >
              <Zap className={`w-4 h-4 ${readyInvs.length > 0 ? 'fill-slate-950' : 'text-slate-500'}`} />
              <span>
                {readyInvs.length > 0
                  ? `KLAIM SEMUA PROFIT (${readyInvs.length} SIAP)`
                  : 'SEMUA SIKLUS 24J BERJALAN'}
              </span>
            </button>
          )}
        </div>

        {/* Quick Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Modal Aktif</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 block">
              Rp {totalActiveInvested.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Profit Harian Berjalan</span>
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              +Rp {totalActiveDailyReturn.toLocaleString('id-ID')} / hari
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Jumlah Paket Berjalan</span>
            <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 mt-0.5 block">
              {activeCount} Paket Aktif
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-700 pb-2">
        <button
          onClick={() => setActiveTabFilter('ACTIVE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTabFilter === 'ACTIVE'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Berjalan ({activeCount})</span>
        </button>

        <button
          onClick={() => setActiveTabFilter('COMPLETED')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTabFilter === 'COMPLETED'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Selesai ({completedCount})</span>
        </button>
      </div>

      {/* Portfolio Items List */}
      {filteredInvestments.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700">
          <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
            {activeTabFilter === 'ACTIVE'
              ? 'Tidak ada paket investasi yang sedang berjalan.'
              : 'Belum ada paket investasi yang telah selesai.'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Mulai berinvestasi sekarang melalui katalog produk saham untuk mendapatkan dividen harian otomatis.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInvestments.map((inv) => {
            const progressPct = Math.round((inv.daysElapsed / inv.totalDays) * 100);
            const is35H = inv.isLockable35H || inv.totalDays >= 35;
            const isReady = canClaimInvestmentToday(inv);
            const timeRemaining = getTimeUntilNextClaim(inv);

            return (
              <div
                key={inv.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          inv.status === 'ACTIVE'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {inv.status === 'ACTIVE' ? 'Investasi Aktif' : 'Investasi Selesai'}
                      </span>
                      {is35H ? (
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                          35H Lock Profit (Cair di Akhir Durasi)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                          {inv.totalDays}H Fast Yield (Cair Harian ke Saldo Penarikan)
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-medium flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Mulai: {new Date(inv.startDate).toLocaleDateString('id-ID')}</span>
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {inv.productName}
                    </h3>
                  </div>

                  {inv.status === 'ACTIVE' && (
                    <div>
                      {isReady ? (
                        <button
                          onClick={() => claimDailyProfit(inv.id)}
                          className="px-4 py-2 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
                        >
                          <Zap className="w-4 h-4 fill-current" />
                          <span>Klaim Dividen Hari Ini</span>
                        </button>
                      ) : (
                        <div className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-700 flex items-center space-x-1.5 font-mono">
                          <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span>Siklus 24J ({timeRemaining})</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <span>Progress Hari: {inv.daysElapsed} dari {inv.totalDays} Hari</span>
                    <span>{progressPct}% Selesai</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Modal Awal</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      Rp {inv.amountInvested.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Profit Harian</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                      +Rp {inv.dailyProfit.toLocaleString('id-ID')} / hari
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {is35H ? 'Profit Terkumpul (Saldo Profit)' : 'Profit Diterima (Saldo Penarikan)'}
                    </span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                      Rp {inv.profitEarned.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Estimasi Total Profit</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      Rp {inv.totalExpectedProfit.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
