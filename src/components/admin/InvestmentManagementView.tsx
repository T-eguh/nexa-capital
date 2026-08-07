import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, Shield, Search } from 'lucide-react';

export const InvestmentManagementView: React.FC = () => {
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch('/api/admin/investments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setInvestments(data.investments);
      }
    } catch (err) {
      console.error('Gagal memuat investasi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <span>Monitoring Portofolio Saham Seluruh Investor</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pantau performa paket investasi yang sedang berjalan, klaim dividen, dan status penyelesaian kontrak.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">ID Investor</th>
                <th className="p-4">Paket Saham</th>
                <th className="p-4">Modal Investasi</th>
                <th className="p-4">Dividen Harian</th>
                <th className="p-4">Progres Kontrak</th>
                <th className="p-4">Total Profit Diterima</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {investments.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white">{inv.userId}</td>
                  <td className="p-4 font-bold text-amber-400">{inv.productName}</td>
                  <td className="p-4 font-black text-white">{formatRupiah(inv.amountInvested)}</td>
                  <td className="p-4 font-bold text-emerald-400">+{formatRupiah(inv.dailyProfit)}/hari</td>
                  <td className="p-4 text-slate-300 font-semibold">{inv.daysElapsed} / {inv.totalDays} Hari</td>
                  <td className="p-4 font-black text-sky-400">{formatRupiah(inv.profitEarned)}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {inv.status}
                    </span>
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
