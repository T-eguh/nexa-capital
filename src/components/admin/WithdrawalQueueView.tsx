import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, XCircle, Clock, Search, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WithdrawalQueueView: React.FC = () => {
  const { transactions, approveWithdrawal, rejectWithdrawal, addNotification } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  // Filter transactions where type === 'WITHDRAWAL'
  const withdrawalTransactions = transactions.filter((t) => t.type === 'WITHDRAWAL');

  const filteredWithdrawals = withdrawalTransactions.filter((w) => {
    const matchesSearch =
      (w.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (w.userId || '').toLowerCase().includes(search.toLowerCase()) ||
      (w.note || '').toLowerCase().includes(search.toLowerCase()) ||
      (w.accountDetails || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const handleApprove = (id: string) => {
    approveWithdrawal(id);
  };

  const handleReject = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menolak penarikan ini? Saldo akan dikembalikan ke member.')) {
      rejectWithdrawal(id);
    }
  };

  const exportCSV = () => {
    const headers = 'ID Transaksi,ID User,Nominal,Tujuan/Rekening,Status,Tanggal\n';
    const rows = filteredWithdrawals
      .map((w) => `"${w.id}","${w.userId}","${w.amount}","${w.accountDetails || w.note}","${w.status}","${w.date}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `antrean-penarikan-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification('Data penarikan berhasil diekspor!', 'success');
  };

  const pendingCount = withdrawalTransactions.filter((w) => w.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <ArrowUpRight className="w-6 h-6 text-rose-400" />
            <span>Antrean Penarikan Saldo Investor</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Proses dan transfer dana pencairan hasil investasi ke rekening bank / e-wallet member secara cepat.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {pendingCount > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-black animate-pulse flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{pendingCount} Penarikan Menunggu Proses</span>
            </span>
          )}
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari ID transaksi, user ID, rekening, atau nama bank..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-amber-500 font-bold"
          >
            <option value="ALL">Semua Status</option>
            <option value="PENDING">Menunggu Transfer (Pending)</option>
            <option value="APPROVED">Ditransfer (Approved)</option>
            <option value="REJECTED">Ditolak / Refund (Rejected)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 text-[10px]">
              <tr>
                <th className="py-3.5 px-4">No. Transaksi</th>
                <th className="py-3.5 px-4">ID Member</th>
                <th className="py-3.5 px-4">Jumlah Penarikan</th>
                <th className="py-3.5 px-4">Tujuan Rekening / E-Wallet</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Waktu Pengajuan</th>
                <th className="py-3.5 px-4 text-center">Tindakan Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Tidak ada transaksi penarikan dalam antrean.
                  </td>
                </tr>
              ) : (
                filteredWithdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{w.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">{w.userId}</td>
                    <td className="py-3.5 px-4 font-black text-rose-400 text-sm">{formatRupiah(w.amount)}</td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="font-semibold text-white">{w.accountDetails || w.note || 'E-Wallet / Bank'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {w.status === 'APPROVED' || w.status === 'SUCCESS' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Transfer Sukses</span>
                        </span>
                      ) : w.status === 'REJECTED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          <XCircle className="w-3 h-3" />
                          <span>Ditolak & Refund</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                          <Clock className="w-3 h-3" />
                          <span>Menunggu Proses</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(w.date).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {w.status === 'PENDING' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApprove(w.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
                          >
                            Setujui Transfer
                          </button>
                          <button
                            onClick={() => handleReject(w.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
                          >
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Selesai</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
