import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Package, Plus, Edit2, Trash2, CheckCircle, X, TrendingUp } from 'lucide-react';

export const ProductManagementView: React.FC = () => {
  const { products, addProduct, updateProduct } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    category: 'Banking & Financial',
    price: 100000,
    minInvest: 100000,
    maxInvest: 10000000,
    durationDays: 35,
    dailyReturnPct: 12,
    totalProfitTarget: 420000,
    riskLevel: 'LOW' as 'LOW' | 'MEDIUM' | 'HIGH',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=80',
    description: 'Investasi saham bluechip terkemuka dengan dividen harian teratur.'
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      name: '',
      category: 'Banking & Financial',
      price: 100000,
      minInvest: 100000,
      maxInvest: 10000000,
      durationDays: 35,
      dailyReturnPct: 12,
      totalProfitTarget: 420000,
      riskLevel: 'LOW',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=80',
      description: 'Investasi saham bluechip terkemuka dengan dividen harian teratur.'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: any) => {
    setEditingId(prod.id);
    setForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      minInvest: prod.minInvest || prod.price,
      maxInvest: prod.maxInvest || prod.price * 100,
      durationDays: prod.durationDays || 35,
      dailyReturnPct: prod.dailyReturnPct || 10,
      totalProfitTarget: prod.totalProfitTarget || prod.price * 4,
      riskLevel: prod.riskLevel || 'MEDIUM',
      imageUrl: prod.imageUrl,
      description: prod.description
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct(editingId, form);
    } else {
      addProduct({
        ...form,
        totalReturnPct: form.dailyReturnPct * form.durationDays,
        lockPeriodHours: 35,
        isActive: true
      });
    }
    setIsModalOpen(false);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <Package className="w-5 h-5 text-amber-400" />
            <span>Manajemen Paket Investasi Saham</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tambah, sunting, atur harga, estimasi dividen harian, dan rasio risiko produk investasi.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center space-x-2 shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Paket Baru</span>
        </button>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between">
            <div>
              <div className="relative h-40 overflow-hidden">
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                  {p.category}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/80 text-slate-950 font-extrabold backdrop-blur-md">
                  {p.riskLevel} RISK
                </span>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold text-white line-clamp-1">{p.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Harga Saham</span>
                    <span className="font-black text-amber-400">{formatRupiah(p.price)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Dividen / Hari</span>
                    <span className="font-black text-emerald-400">+{p.dailyReturnPct}% ({formatRupiah(p.price * (p.dailyReturnPct / 100))})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Durasi Kontrak</span>
                    <span className="font-bold text-slate-200">{p.durationDays} Hari</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Total Target Return</span>
                    <span className="font-bold text-sky-400">{formatRupiah(p.totalProfitTarget || p.price * 4)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">ID: {p.id}</span>
              <button
                onClick={() => handleOpenEdit(p)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-400 border border-slate-700 flex items-center space-x-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Sunting Paket</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Package className="w-4 h-4 text-amber-400" />
                <span>{editingId ? 'Sunting Paket Saham' : 'Tambah Paket Saham Baru'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Nama Paket / Kode Saham</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Kategori</label>
                  <input
                    type="text"
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Harga Investasi (IDR)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Dividen Harian (%)</label>
                  <input
                    type="number"
                    required
                    value={form.dailyReturnPct}
                    onChange={(e) => setForm({ ...form, dailyReturnPct: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Durasi Kontrak (Hari)</label>
                  <input
                    type="number"
                    required
                    value={form.durationDays}
                    onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">URL Gambar Banner</label>
                <input
                  type="text"
                  required
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-lg shadow-amber-500/20"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
