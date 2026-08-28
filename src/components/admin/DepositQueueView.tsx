import React, { useState } from 'react';
import { ArrowDownLeft, CheckCircle2, XCircle, Clock, Search, Download, Eye, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DepositQueueView: React.FC = () => {
  const { transactions, approveDeposit, rejectDeposit, addNotification } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [previewProof, setPreviewProof] = useState<string | null>(null);

  // Filter transactions where type === 'DEPOSIT'
  const depositTransactions = transactions.filter((t) => t.type === 'DEPOSIT');

  const filteredDeposits = depositTransactions.filter((d) => {
    const matchesSearch =
      (d.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.userId || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.note || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.proofUrl || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.paymentMethod || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const handleApprove = (id: string) => {
    approveDeposit(id);
  };

  const handleReject = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menolak deposit ini?')) {
      rejectDeposit(id);
    }
  };

  const exportCSV = () => {
    const headers = 'ID Transaksi,ID User,Nominal,Metode,Status,Tanggal\n';
    const rows = filteredDeposits
      .map((d) => `"${d.id}","${d.userId}","${d.amount}","${d.paymentMethod || d.note}","${d.status}","${d.date}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `antrean-deposit-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification('Data deposit berhasil diekspor!', 'success');
  };

  const pendingCount = depositTransactions.filter((d) => d.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Proof Modal */}
      {previewProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Bukti Transfer Deposit</h3>
              <button
                onClick={() => setPreviewProof(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-auto rounded-2xl bg-black flex items-center justify-center border border-slate-800">
              <img src={previewProof} alt="Bukti Transfer" className="max-w-full object-contain" />
            </div>
            <button
              onClick={() => setPreviewProof(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 cursor-pointer"
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <ArrowDownLeft className="w-6 h-6 text-emerald-400" />
            <span>Antrean Persetujuan Deposit Saldo</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Verifikasi mutasi rekening dan setujui deposit member. Saldo member akan bertambah otomatis setelah disetujui.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {pendingCount > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black animate-pulse flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{pendingCount} Deposit Menunggu Review</span>
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
            placeholder="Cari ID transaksi, user ID, atau info pengirim..."
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
            <option value="PENDING">Menunggu Persetujuan (Pending)</option>
            <option value="APPROVED">Disetujui (Approved)</option>
            <option value="REJECTED">Ditolak (Rejected)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 text-[10px]">
              <tr>
                <th className="py-3.5 px-4">No. Transaksi / Ref</th>
                <th className="py-3.5 px-4">ID Member</th>
                <th className="py-3.5 px-4">Jumlah Deposit</th>
                <th className="py-3.5 px-4">Metode / Bukti Pengirim</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Waktu Pengajuan</th>
                <th className="py-3.5 px-4 text-center">Tindakan Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredDeposits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Tidak ada transaksi deposit dalam antrean.
                  </td>
                </tr>
              ) : (
                filteredDeposits.map((d) => {
                  const isImageProof = d.proofUrl && (d.proofUrl.startsWith('data:image') || d.proofUrl.startsWith('http'));
                  const cleanImageUrl = d.proofUrl ? d.proofUrl.split('#SENDER:')[0] : '';
                  const senderInfo = d.proofUrl && d.proofUrl.includes('#SENDER:') ? d.proofUrl.split('#SENDER:')[1] : '';

                  return (
                    <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{d.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-white">{d.userId}</td>
                      <td className="py-3.5 px-4 font-black text-emerald-400 text-sm">{formatRupiah(d.amount)}</td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-semibold block w-fit">
                            {d.paymentMethod || 'QRIS Instant 24H'}
                          </span>
                          {senderInfo && (
                            <span className="text-[11px] text-amber-300/90 font-medium block">
                              {senderInfo}
                            </span>
                          )}
                          {isImageProof && cleanImageUrl && (
                            <button
                              type="button"
                              onClick={() => setPreviewProof(cleanImageUrl)}
                              className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 underline font-semibold cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Lihat Bukti Foto</span>
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {d.status === 'APPROVED' || d.status === 'SUCCESS' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Disetujui</span>
                          </span>
                        ) : d.status === 'REJECTED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            <XCircle className="w-3 h-3" />
                            <span>Ditolak</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                            <Clock className="w-3 h-3" />
                            <span>Menunggu Review</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(d.date).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {d.status === 'PENDING' ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleApprove(d.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => handleReject(d.id)}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
