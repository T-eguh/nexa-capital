import React, { useState } from 'react';
import { Bell, Send, Users, CheckCircle } from 'lucide-react';

export const BroadcastNotificationView: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<'SYSTEM' | 'INVESTMENT' | 'SECURITY' | 'PROMO'>('SYSTEM');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSending(true);
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch('/api/admin/notifications/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, message, category })
      });
      const data = await res.json();
      if (data.success) {
        setSentSuccess(true);
        setTitle('');
        setMessage('');
        setTimeout(() => setSentSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Gagal menyiarkan notifikasi:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <span>Siaran Notifikasi Massal (Broadcast Center)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Kirim notifikasi langsung ke pusat pemberitahuan seluruh akun pengguna terdaftar.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
        {sentSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span className="font-bold">Notifikasi berhasil disiarkan secara massal ke seluruh akun pengguna!</span>
          </div>
        )}

        <form onSubmit={handleBroadcast} className="space-y-4">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Judul Notifikasi</label>
            <input
              type="text"
              required
              placeholder="Contoh: Pembaruan Dividen Harian Telah Masuk"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Kategori Pesan</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="SYSTEM">Sistem & Pengumuman</option>
              <option value="INVESTMENT">Informasi Dividen / Investasi</option>
              <option value="SECURITY">Peringatan Keamanan</option>
              <option value="PROMO">Promosi & Bonus Cashback</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Pesan Lengkap Notifikasi</label>
            <textarea
              rows={4}
              required
              placeholder="Tuliskan pesan penjelasan singkat yang akan diterima pengguna di notification drawer..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Kirim Siaran Notifikasi Sekarang</span>
          </button>
        </form>
      </div>
    </div>
  );
};
