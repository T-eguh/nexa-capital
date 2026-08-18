import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  TrendingUp,
  Search,
  SlidersHorizontal,
  Sparkles,
  Shield,
  Clock,
  Layers,
  Power,
  Upload,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { InvestmentProduct, VipLevel } from '../../types';

export const ProductManagementView: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, toggleProductStatus, addNotification } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState<'ALL' | 'Smart AI' | 'Special AI'>('ALL');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const PRESET_IMAGES = [
    { label: 'AI Supercomputer Blue', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80' },
    { label: 'Neural Trading Gold', url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600&auto=format&fit=crop&q=80' },
    { label: 'Algorithmic Charts', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80' },
    { label: 'Quantum Matrix Purple', url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&auto=format&fit=crop&q=80' },
    { label: 'Global Finance Network', url: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&auto=format&fit=crop&q=80' },
  ];

  const [form, setForm] = useState({
    name: '',
    category: 'Smart AI',
    productGroup: 'Smart AI' as 'Smart AI' | 'Special AI',
    price: 50000,
    durationDays: 35,
    dailyProfitPct: 38,
    dailyProfitAmount: 19000,
    totalProfitAmount: 665000,
    totalReturnPct: 1330,
    riskLevel: 'Rendah' as 'Rendah' | 'Sedang' | 'Tinggi',
    status: 'active' as 'active' | 'inactive',
    requiredVipLevel: 'VIP 0' as VipLevel,
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
    description: 'Investasi Smart AI dengan dividen harian otomatis.',
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      name: 'Smart AI Baru',
      category: 'Smart AI',
      productGroup: 'Smart AI',
      price: 100000,
      durationDays: 35,
      dailyProfitPct: 38,
      dailyProfitAmount: 38000,
      totalProfitAmount: 1330000,
      totalReturnPct: 1330,
      riskLevel: 'Rendah',
      status: 'active',
      requiredVipLevel: 'VIP 0',
      imageUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600&auto=format&fit=crop&q=80',
      description: 'Investasi Smart AI durasi 35 hari dengan dividen harian teratur.',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: InvestmentProduct) => {
    setEditingId(prod.id);
    setForm({
      name: prod.name,
      category: prod.category || prod.productGroup || 'Smart AI',
      productGroup: (prod.productGroup as 'Smart AI' | 'Special AI') || (prod.name.startsWith('Special') ? 'Special AI' : 'Smart AI'),
      price: prod.price,
      durationDays: prod.durationDays,
      dailyProfitPct: prod.dailyProfitPct || 38,
      dailyProfitAmount: prod.dailyProfitAmount || Math.round(prod.price * ((prod.dailyProfitPct || 38) / 100)),
      totalProfitAmount: prod.totalProfitAmount || (prod.dailyProfitAmount ? prod.dailyProfitAmount * prod.durationDays : prod.price * 13.3),
      totalReturnPct: prod.totalReturnPct || (prod.dailyProfitPct ? prod.dailyProfitPct * prod.durationDays : 1330),
      riskLevel: (prod.riskLevel as 'Rendah' | 'Sedang' | 'Tinggi') || 'Rendah',
      status: prod.status || 'active',
      requiredVipLevel: (prod.requiredVipLevel || prod.minVipLevel || 'VIP 0') as VipLevel,
      imageUrl: prod.imageUrl || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
      description: prod.description || 'Paket investasi otomatis dengan imbal hasil harian terjamin.',
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar. Maksimal ukuran 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
        addNotification('Foto berhasil dimuat!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePriceOrPctChange = (newPrice: number, newDailyPct: number, newDays: number) => {
    const dailyAmt = Math.round(newPrice * (newDailyPct / 100));
    const totalAmt = dailyAmt * newDays;
    const totalPct = newDailyPct * newDays;

    setForm((prev) => ({
      ...prev,
      price: newPrice,
      dailyProfitPct: newDailyPct,
      durationDays: newDays,
      dailyProfitAmount: dailyAmt,
      totalProfitAmount: totalAmt,
      totalReturnPct: totalPct,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productPayload: Omit<InvestmentProduct, 'id'> = {
      name: form.name,
      category: form.category,
      productGroup: form.productGroup,
      price: form.price,
      durationDays: form.durationDays,
      dailyProfitPct: form.dailyProfitPct,
      dailyProfitAmount: form.dailyProfitAmount,
      totalProfitAmount: form.totalProfitAmount,
      totalReturnPct: form.totalReturnPct,
      riskLevel: form.riskLevel,
      status: form.status,
      requiredVipLevel: form.requiredVipLevel,
      minVipLevel: form.requiredVipLevel,
      imageUrl: form.imageUrl,
      description: form.description,
      tags: [form.productGroup, `${form.durationDays} Hari`, form.requiredVipLevel === 'VIP 0' ? 'Tanpa Syarat VIP' : form.requiredVipLevel],
    };

    if (editingId) {
      updateProduct({
        ...productPayload,
        id: editingId,
      });
      addNotification(`Produk "${form.name}" berhasil diperbarui.`, 'success');
    } else {
      addProduct(productPayload);
      addNotification(`Produk baru "${form.name}" berhasil diterbitkan ke katalog.`, 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (prod: InvestmentProduct) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus paket "${prod.name}" dari katalog?`)) {
      deleteProduct(prod.id);
      addNotification(`Produk "${prod.name}" berhasil dihapus.`, 'info');
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGroup =
      filterGroup === 'ALL' ||
      p.productGroup === filterGroup ||
      (filterGroup === 'Special AI' && (p.name.startsWith('Special') || p.category === 'Special AI')) ||
      (filterGroup === 'Smart AI' && (p.name.startsWith('Smart') || p.category === 'Smart AI'));
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Katalog & Dividen Harian</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">Manajemen Saham & Produk AI</h2>
          <p className="text-xs text-slate-400 mt-1">
            Kelola daftar paket investasi saham AI, atur nominal harga, persen dividen harian, durasi, foto banner, dan status aktif.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Paket AI Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama produk / kode saham..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'Smart AI', 'Special AI'] as const).map((grp) => (
            <button
              key={grp}
              onClick={() => setFilterGroup(grp)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterGroup === grp
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {grp === 'ALL' ? 'Semua Produk' : grp}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((p) => {
          const isInactive = p.status === 'inactive';
          return (
            <div
              key={p.id}
              className={`rounded-3xl border transition-all overflow-hidden flex flex-col justify-between ${
                isInactive
                  ? 'bg-slate-950/60 border-slate-800/60 opacity-60'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-xl'
              }`}
            >
              <div>
                {/* Banner & Badges */}
                <div className="relative h-40 w-full overflow-hidden bg-slate-950">
                  <img
                    src={p.imageUrl || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80'}
                    alt={p.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
                      {p.productGroup || 'Smart AI'}
                    </span>
                    {(p.requiredVipLevel || p.minVipLevel) && (p.requiredVipLevel !== 'VIP 0' && p.minVipLevel !== 'VIP 0') && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-md">
                        {p.requiredVipLevel || p.minVipLevel}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={() => toggleProductStatus(p.id)}
                      title="Klik untuk ubah status aktif / non-aktif"
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md flex items-center space-x-1 cursor-pointer transition-all active:scale-95 ${
                        isInactive
                          ? 'bg-rose-500/80 text-white'
                          : 'bg-emerald-500/80 text-slate-950 font-black'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      <span>{isInactive ? 'NONAKTIF' : 'AKTIF'}</span>
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-white">{p.name}</h3>
                      <p className="text-[11px] text-slate-300 font-semibold">{p.category || 'Trading Saham AI'}</p>
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>

                  <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-800 text-xs">
                    <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 font-semibold block">Harga Beli Saham</span>
                      <span className="font-black text-amber-400">{formatRupiah(p.price)}</span>
                    </div>

                    <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 font-semibold block">Dividen Harian</span>
                      <span className="font-black text-emerald-400">
                        +{p.dailyProfitPct || 38}% ({formatRupiah(p.dailyProfitAmount || Math.round(p.price * ((p.dailyProfitPct || 38) / 100)))})
                      </span>
                    </div>

                    <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 font-semibold block">Durasi Kontrak</span>
                      <span className="font-bold text-slate-200">{p.durationDays} Hari</span>
                    </div>

                    <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 font-semibold block">Total Dividen Target</span>
                      <span className="font-bold text-sky-400">
                        {formatRupiah(p.totalProfitAmount || (p.dailyProfitAmount ? p.dailyProfitAmount * p.durationDays : p.price * 13.3))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">ID: {p.id}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDelete(p)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer"
                    title="Hapus paket"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-black text-slate-950 transition-all flex items-center space-x-1.5 shadow-md shadow-amber-500/10 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Sunting</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <Package className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">Tidak ada paket saham yang sesuai</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau ganti filter kategori paket di atas.
          </p>
        </div>
      )}

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Package className="w-4 h-4 text-amber-400" />
                <span>{editingId ? 'Sunting Detail Paket Saham AI' : 'Tambah Paket Saham AI Baru'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Nama Paket / Kode Saham</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Kelompok Produk</label>
                  <select
                    value={form.productGroup}
                    onChange={(e) => {
                      const grp = e.target.value as 'Smart AI' | 'Special AI';
                      setForm({
                        ...form,
                        productGroup: grp,
                        category: grp,
                        durationDays: grp === 'Special AI' ? 3 : 35,
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Smart AI">Smart AI (Reguler 35 Hari)</option>
                    <option value="Special AI">Special AI (VIP / Kilat)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Syarat Minimal VIP</label>
                  <select
                    value={form.requiredVipLevel}
                    onChange={(e) => setForm({ ...form, requiredVipLevel: e.target.value as VipLevel })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="VIP 0">VIP 0 (Semua Member)</option>
                    <option value="VIP 1">VIP 1</option>
                    <option value="VIP 2">VIP 2</option>
                    <option value="VIP 3">VIP 3</option>
                    <option value="VIP 4">VIP 4</option>
                    <option value="VIP 5">VIP 5</option>
                    <option value="VIP 6">VIP 6</option>
                    <option value="VIP 7">VIP 7</option>
                    <option value="VIP 8">VIP 8</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Harga Modal (IDR)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => handlePriceOrPctChange(Number(e.target.value), form.dailyProfitPct, form.durationDays)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Dividen Harian (%)</label>
                  <input
                    type="number"
                    required
                    value={form.dailyProfitPct}
                    onChange={(e) => handlePriceOrPctChange(form.price, Number(e.target.value), form.durationDays)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Durasi (Hari)</label>
                  <input
                    type="number"
                    required
                    value={form.durationDays}
                    onChange={(e) => handlePriceOrPctChange(form.price, form.dailyProfitPct, Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Automatic Calculation Preview */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-amber-400 font-bold block">Kalkulasi Otomatis Sistem:</span>
                <div className="flex items-center justify-between text-slate-300 text-[11px]">
                  <span>Dividen Harian Member:</span>
                  <span className="font-bold text-emerald-400">{formatRupiah(form.dailyProfitAmount)} / Hari</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 text-[11px]">
                  <span>Total Dividen ({form.durationDays} Hari):</span>
                  <span className="font-bold text-sky-400">{formatRupiah(form.totalProfitAmount)} (+{form.totalReturnPct}%)</span>
                </div>
              </div>

              {/* Image Upload & Presets */}
              <div className="space-y-2 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-300 font-bold flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload Foto Banner Produk</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Dari Galeri / Kamera / File</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-20 h-14 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                    {form.imageUrl ? (
                      <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-[11px] font-bold flex items-center space-x-1.5 border border-slate-700 cursor-pointer active:scale-95 transition-all"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Pilih Foto dari Perangkat / Galeri</span>
                    </button>
                    <p className="text-[10px] text-slate-500">Mendukung JPG, PNG, WebP (Maks 5MB)</p>
                  </div>
                </div>

                {/* Preset Fast Select */}
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block mb-1 font-semibold">Atau pilih preset banner siap pakai:</span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, imageUrl: preset.url }))}
                        className={`p-1 rounded-lg border shrink-0 text-[10px] flex items-center space-x-1 cursor-pointer transition-all ${
                          form.imageUrl === preset.url
                            ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        <img src={preset.url} alt="" className="w-4 h-4 rounded object-cover" />
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom URL Fallback */}
                <div className="pt-1">
                  <input
                    type="text"
                    placeholder="Atau tempel link URL foto langsung..."
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white text-[11px] font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
                >
                  {editingId ? 'Simpan Perubahan Produk' : 'Terbitkan Produk Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
