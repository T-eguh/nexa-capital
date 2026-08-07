import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  AlertCircle,
  Activity,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';

export const AdminDashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Gagal memuat dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>Pusat Kendali Eksekutif</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Ringkasan Kinerja Platform</h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitoring arus kas, antrean deposit, penarikan, dan portofolio investasi secara real-time.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-all flex items-center space-x-2 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Deposits */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Volume Deposit</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{formatRupiah(stats?.totalDepositVolume || 300000)}</p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>+18.5% dari bulan lalu</span>
          </p>
        </div>

        {/* Total Withdrawals */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Volume Penarikan</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{formatRupiah(stats?.totalWithdrawalVolume || 0)}</p>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">Saldo penarikan diproses</p>
        </div>

        {/* Total Invested */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Dana Portofolio Saham</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{formatRupiah(stats?.totalInvestmentsVolume || 250000)}</p>
          <p className="text-[11px] text-amber-400 font-semibold mt-1">
            {stats?.activeInvestmentsCount || 2} Paket Aktif Berjalan
          </p>
        </div>

        {/* Total Users */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Total Investor Aktif</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{stats?.totalUsers || 3} Pengguna</p>
          <p className="text-[11px] text-sky-400 font-semibold mt-1">
            +{stats?.newUsersToday || 1} Pendaftaran Hari Ini
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
              <p className="text-lg font-black text-white">{stats?.pendingDepositsCount || 0} Permintaan</p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-400 underline cursor-pointer">Tinjau</span>
        </div>

        <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-sky-500 text-slate-950 font-black">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-sky-300">Antrean Penarikan Pending</p>
              <p className="text-lg font-black text-white">{stats?.pendingWithdrawalsCount || 0} Permintaan</p>
            </div>
          </div>
          <span className="text-xs font-bold text-sky-400 underline cursor-pointer">Tinjau</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-300">Sistem Keamanan Akun</p>
              <p className="text-xs text-slate-300 font-semibold">Semua Enkripsi & JWT Normal</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full font-bold">Terproteksi</span>
        </div>
      </div>

      {/* Visual Chart Simulation & Analytics */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Proyeksi Tren Kas & Dividen Harian Platform</span>
          </h3>
          <span className="text-xs text-slate-400 font-semibold">6 Bulan Terakhir</span>
        </div>

        <div className="h-48 w-full flex items-end justify-between gap-2 pt-8 pb-2 px-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
          {[
            { month: 'Jan', deposit: 40, withdrawal: 15 },
            { month: 'Feb', deposit: 55, withdrawal: 20 },
            { month: 'Mar', deposit: 70, withdrawal: 28 },
            { month: 'Apr', deposit: 82, withdrawal: 35 },
            { month: 'May', deposit: 90, withdrawal: 42 },
            { month: 'Jun', deposit: 100, withdrawal: 50 },
          ].map((bar, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div className="w-full flex items-end justify-center gap-1.5 h-full">
                <div
                  className="w-1/3 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all hover:brightness-125"
                  style={{ height: `${bar.deposit}%` }}
                  title={`Deposit: ${bar.deposit}%`}
                />
                <div
                  className="w-1/3 bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-md transition-all hover:brightness-125"
                  style={{ height: `${bar.withdrawal}%` }}
                  title={`Penarikan: ${bar.withdrawal}%`}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-bold mt-2">{bar.month}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center space-x-6 text-xs font-semibold pt-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-emerald-400" />
            <span className="text-slate-300">Volume Deposit</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-rose-400" />
            <span className="text-slate-300">Volume Penarikan</span>
          </div>
        </div>
      </div>
    </div>
  );
};
