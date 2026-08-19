import React from 'react';
import {
  Users,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Activity,
  CheckCircle2,
  XCircle,
  CreditCard,
  Briefcase,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboardOverview: React.FC = () => {
  const { registeredUsers, transactions, userInvestments, products, platformSettings } = useApp();

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  // Calculations
  const depositTransactions = transactions.filter((t) => t.type === 'DEPOSIT');
  const withdrawalTransactions = transactions.filter((t) => t.type === 'WITHDRAWAL');

  const totalDepositVolume = depositTransactions
    .filter((d) => d.status === 'APPROVED' || d.status === 'SUCCESS')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalWithdrawalVolume = withdrawalTransactions
    .filter((w) => w.status === 'APPROVED' || w.status === 'SUCCESS')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingDeposits = depositTransactions.filter((d) => d.status === 'PENDING');
  const pendingWithdrawals = withdrawalTransactions.filter((w) => w.status === 'PENDING');

  const totalPortfolioInvested = userInvestments
    .filter((i) => i.status === 'ACTIVE')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const activeInvestmentsCount = userInvestments.filter((i) => i.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>Pusat Kendali Eksekutif NEXA CAPITAL</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Ringkasan Kinerja Platform</h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitoring langsung arus kas, antrean verifikasi deposit, pencairan dana, dan portofolio member.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Sistem Operasional Aktif</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Deposits */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Volume Deposit Disetujui</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{formatRupiah(totalDepositVolume)}</p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>{depositTransactions.filter((d) => d.status === 'APPROVED').length} Transaksi Berhasil</span>
          </p>
        </div>

        {/* Total Withdrawals */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Volume Penarikan Sukses</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{formatRupiah(totalWithdrawalVolume)}</p>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">
            {withdrawalTransactions.filter((w) => w.status === 'APPROVED').length} Pencairan Selesai
          </p>
        </div>

        {/* Total Invested */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Dana Portofolio Aktif</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{formatRupiah(totalPortfolioInvested)}</p>
          <p className="text-[11px] text-amber-400 font-semibold mt-1">
            {activeInvestmentsCount} Paket Sedang Berjalan
          </p>
        </div>

        {/* Total Users */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Total Investor Terdaftar</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{registeredUsers.length} Pengguna</p>
          <p className="text-[11px] text-sky-400 font-semibold mt-1">
            Semua Akun Terverifikasi
          </p>
        </div>
      </div>

      {/* Pending Queues Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-black">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-300">Antrean Deposit Pending</p>
              <p className="text-lg font-black text-white">{pendingDeposits.length} Permintaan</p>
            </div>
          </div>
          {pendingDeposits.length > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold animate-pulse">
              Perlu Tindakan
            </span>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-500 text-slate-950 font-black">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-300">Antrean Penarikan Pending</p>
              <p className="text-lg font-black text-white">{pendingWithdrawals.length} Permintaan</p>
            </div>
          </div>
          {pendingWithdrawals.length > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold animate-pulse">
              Perlu Transfer
            </span>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-300">Produk Investasi Tersedia</p>
              <p className="text-lg font-black text-white">{products.length} Paket Saham</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
            Aktif
          </span>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Aktivitas Transaksi Terkini</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">No. Ref</th>
                <th className="py-2.5 px-3">Tipe</th>
                <th className="py-2.5 px-3">Jumlah</th>
                <th className="py-2.5 px-3">Metode/Keterangan</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {transactions.slice(0, 8).map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{t.id}</td>
                  <td className="py-2.5 px-3 font-bold">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      t.type === 'DEPOSIT'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : t.type === 'WITHDRAWAL'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-black text-white">{formatRupiah(t.amount)}</td>
                  <td className="py-2.5 px-3 text-slate-300">{t.paymentMethod || t.accountDetails || t.note}</td>
                  <td className="py-2.5 px-3">
                    {t.status === 'APPROVED' || t.status === 'SUCCESS' ? (
                      <span className="text-emerald-400 font-bold">Disetujui</span>
                    ) : t.status === 'REJECTED' ? (
                      <span className="text-rose-400 font-bold">Ditolak</span>
                    ) : (
                      <span className="text-amber-400 font-bold animate-pulse">Pending</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                    {new Date(t.date).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
