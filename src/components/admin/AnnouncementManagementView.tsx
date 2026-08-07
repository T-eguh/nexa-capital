import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Trash2, Tag, Calendar } from 'lucide-react';

export const AnnouncementManagementView: React.FC = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'GENERAL' | 'PROMO' | 'SYSTEM' | 'MAINTENANCE'>('GENERAL');

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch('/api/admin/announcements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.announcements);
      }
    } catch (err) {
      console.error('Gagal memuat pengumuman:', err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, category, status: 'PUBLISHED' })
      });
      const data = await res.json();
      if (data.success) {
        setTitle('');
        setContent('');
        fetchAnnouncements();
      }
    } catch (err) {
      console.error('Gagal membuat pengumuman:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchAnnouncements();
      }
    } catch (err) {
      console.error('Gagal menghapus pengumuman:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <Megaphone className="w-5 h-5 text-amber-400" />
            <span>Manajemen Pengumuman & Promo Event</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Terbitkan pengumuman publik, promo event, dan jadwal pemeliharaan sistem untuk seluruh investor.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Form Create */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Buat Pengumuman Baru</h3>

          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Judul Pengumuman</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="GENERAL">Umum (General)</option>
                <option value="PROMO">Promo & Bonus</option>
                <option value="SYSTEM">Pembaruan Sistem</option>
                <option value="MAINTENANCE">Pemeliharaan (Maintenance)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Isi Pengumuman</label>
              <textarea
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-lg shadow-amber-500/20"
            >
              Terbitkan Pengumuman
            </button>
          </form>
        </div>

        {/* List Announcements */}
        <div className="lg:col-span-2 space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {a.category}
                </span>
                <span className="text-[10px] text-slate-500">{new Date(a.createdAt).toLocaleString('id-ID')}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{a.title}</h4>
              <p className="text-slate-300">{a.content}</p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleDelete(a.id)}
                  className="px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-bold flex items-center space-x-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
