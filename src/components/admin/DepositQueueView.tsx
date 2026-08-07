import React, { useState, useEffect } from 'react';
import { ArrowDownLeft, CheckCircle2, XCircle, Clock, Eye, Search, FileText } from 'lucide-react';

export const DepositQueueView: React.FC = () => {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch('/api/admin/deposits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDeposits(data.deposits);
      }
    } catch (err) {
      console.error('Gagal memuat deposit:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/deposits/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchDeposits();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Gagal menyetujui deposit:', err);
    }
  };

  const handleReject = async (id: string) => {
    const note = prompt('Masukkan alasan penolakan deposit:');
    if (note === null) return;
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/deposits/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ note })
      });
      const data = await res.json();
      if (data.success) {
        fetchDeposits();
      }
    } catch (err) {
      console.error('Gagal menolak deposit:', err);
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
            <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
            <span>Antrean Persetujuan Deposit Saldo</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Verifikasi dan setujui bukti transfer pembayaran deposit dari investor secara instan.
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
                <th className="p-4">Jumlah Deposit</th>
                <th className="p-4">Catatan / Metode</th>
                <th className="p-4">Status</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4 text-right">Tindakan Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {deposits.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-amber-400">{d.referenceNo}</td>
                  <td className="p-4 font-semibold text-white">{d.userId}</td>
                  <td className="p-4 font-black text-emerald-400 text-sm">{formatRupiah(d.amount)}</td>
                  <td className="p-4 text-slate-300 max-w-xs truncate">{d.note || 'Deposit QRIS Instant'}</td>
                  <td className="p-4">
                    {d.status === 'APPROVED' || d.status === 'SUCCESS' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Disetujui
                      </span>
                    ) : d.status === 'REJECTED' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        Ditolak
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Menunggu Review
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-400">{new Date(d.date).toLocaleString('id-ID')}</td>
                  <td className="p-4 text-right space-x-2">
                    {d.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleApprove(d.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
                        >
                          Setujui
                        </button>
                        <button
                          onClick={() => handleReject(d.id)}
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
