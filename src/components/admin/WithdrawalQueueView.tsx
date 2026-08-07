import React, { useState, useEffect } from 'react';
import { ArrowUpRight, CheckCircle2, XCircle, Clock, Search, CreditCard } from 'lucide-react';

export const WithdrawalQueueView: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch('/api/admin/withdrawals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setWithdrawals(data.withdrawals);
      }
    } catch (err) {
      console.error('Gagal memuat penarikan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/withdrawals/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchWithdrawals();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Gagal menyetujui penarikan:', err);
    }
  };

  const handleReject = async (id: string) => {
    const note = prompt('Masukkan alasan penolakan penarikan (saldo akan dikembalikan ke pengguna):');
    if (note === null) return;
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/withdrawals/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ note })
      });
      const data = await res.json();
      if (data.success) {
        fetchWithdrawals();
      }
    } catch (err) {
      console.error('Gagal menolak penarikan:', err);
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <ArrowUpRight className="w-5 h-5 text-rose-400" />
            <span>Antrean Penarikan Saldo Investor</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Proses pencairan dana ke rekening bank / e-wallet investor dan konfirmasi status transfer.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">No. Referensi</th>
                <th className="p-4">ID Pengguna</th>
                <th className="p-4">Jumlah Penarikan</th>
                <th className="p-4">Biaya Admin</th>
                <th className="p-4">Catatan / Tujuan</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Tindakan Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {withdrawals.map((w) => (
                <tr key={w.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-amber-400">{w.referenceNo}</td>
                  <td className="p-4 font-semibold text-white">{w.userId}</td>
                  <td className="p-4 font-black text-rose-400 text-sm">{formatRupiah(w.amount)}</td>
                  <td className="p-4 text-slate-400">{formatRupiah(w.fee || 0)}</td>
                  <td className="p-4 text-slate-300 max-w-xs truncate">{w.note || 'Penarikan Bank BCA'}</td>
                  <td className="p-4">
                    {w.status === 'APPROVED' || w.status === 'SUCCESS' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Transfer Sukses
                      </span>
                    ) : w.status === 'REJECTED' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        Ditolak & Refund
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Menunggu Proses
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {w.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleApprove(w.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
                        >
                          Proses Transfer
                        </button>
                        <button
                          onClick={() => handleReject(w.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all"
                        >
                          Tolak
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">Selesai</span>
                    )}
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
