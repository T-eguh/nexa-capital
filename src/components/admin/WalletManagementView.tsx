import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Minus, Search, ArrowRightLeft, ShieldAlert, X } from 'lucide-react';

export const WalletManagementView: React.FC = () => {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  const [form, setForm] = useState({
    userId: 'usr-member-1',
    walletType: 'mainWallet' as 'mainWallet' | 'profitWallet' | 'referralWallet' | 'bonusWallet',
    amount: 50000,
    isCredit: true,
    reason: 'Bonus Penyesuaian Event Komunitas'
  });

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch('/api/admin/wallets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setWallets(data.wallets);
      }
    } catch (err) {
      console.error('Gagal memuat wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleAdjustBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch('/api/admin/wallets/adjust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setIsAdjustModalOpen(false);
        fetchWallets();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Gagal penyesuaian saldo:', err);
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
            <Wallet className="w-5 h-5 text-amber-400" />
            <span>Manajemen Multi-Dompet & Penyesuaian Saldo</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitoring saldo dompet utama, profit, referral, bonus, serta eksekusi penyesuaian dana manual.
          </p>
        </div>

        <button
          onClick={() => setIsAdjustModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center space-x-2 shadow-lg shadow-amber-500/20"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Penyesuaian Saldo Manual</span>
        </button>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">ID Pengguna</th>
                <th className="p-4">Dompet Utama</th>
                <th className="p-4">Dompet Profit</th>
                <th className="p-4">Dompet Referral</th>
                <th className="p-4">Dompet Bonus</th>
                <th className="p-4 text-right">Terakhir Diperbarui</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {wallets.map((w) => (
                <tr key={w.userId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white">{w.userId}</td>
                  <td className="p-4 font-black text-emerald-400">{formatRupiah(w.mainWallet)}</td>
                  <td className="p-4 font-black text-amber-400">{formatRupiah(w.profitWallet)}</td>
                  <td className="p-4 font-black text-sky-400">{formatRupiah(w.referralWallet)}</td>
                  <td className="p-4 font-black text-indigo-400">{formatRupiah(w.bonusWallet)}</td>
                  <td className="p-4 text-right text-slate-500">{new Date(w.updatedAt).toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                <span>Penyesuaian Saldo Investor</span>
              </h3>
              <button onClick={() => setIsAdjustModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustBalance} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">ID Pengguna</label>
                <input
                  type="text"
                  required
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Jenis Dompet Target</label>
                <select
                  value={form.walletType}
                  onChange={(e) => setForm({ ...form, walletType: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="mainWallet">Dompet Utama (Saldo Penarikan)</option>
                  <option value="profitWallet">Dompet Profit (Dividen Harian)</option>
                  <option value="referralWallet">Dompet Referral (Komisi Bawahan)</option>
                  <option value="bonusWallet">Dompet Bonus (Cashback / Event)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Aksi Kredit / Debit</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, isCredit: true })}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      form.isCredit ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 border border-slate-800 text-slate-400'
                    }`}
                  >
                    + Kredit (Tambah)
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, isCredit: false })}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      !form.isCredit ? 'bg-rose-500 text-white' : 'bg-slate-950 border border-slate-800 text-slate-400'
                    }`}
                  >
                    - Debit (Kurangi)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Jumlah Nominal (IDR)</label>
                <input
                  type="number"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Alasan Penyesuaian</label>
                <textarea
                  rows={2}
                  required
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-lg shadow-amber-500/20"
                >
                  Eksekusi Penyesuaian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
