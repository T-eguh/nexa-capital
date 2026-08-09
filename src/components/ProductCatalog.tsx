import React, { useState } from 'react';
import {
  Search,
  Zap,
  ShieldCheck,
  Calculator,
  Lock,
  ChevronRight,
  Sparkles,
  X,
  TrendingUp,
  Clock,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { InvestmentProduct } from '../types';
import { useApp } from '../context/AppContext';

export const ProductCatalog: React.FC = () => {
  const { products, user, buyProduct } = useApp();

  const [activeTab, setActiveTab] = useState<'Special AI' | 'Smart AI'>('Special AI');
  const [searchQuery, setSearchQuery] = useState('');
  const [buyingProduct, setBuyingProduct] = useState<InvestmentProduct | null>(null);
  const [showVipInfoModal, setShowVipInfoModal] = useState<InvestmentProduct | null>(null);
  const [showCalcModal, setShowCalcModal] = useState<InvestmentProduct | null>(null);
  const [calcUnits, setCalcUnits] = useState<number>(1);

  const vipLevelRankMap: Record<string, number> = {
    'VIP 0': 0,
    'VIP 1': 1,
    'VIP 2': 2,
    'VIP 3': 3,
    'VIP 4': 4,
    'VIP 5': 5,
    'VIP 6': 6,
    'VIP 7': 7,
    'VIP 8': 8,
  };

  const userRank = vipLevelRankMap[user.vipLevel || 'VIP 0'] ?? 0;

  // Filter products by tab & search
  const filteredProducts = products.filter((p) => {
    const group = p.productGroup || (p.name.startsWith('Special') || p.durationDays <= 3 ? 'Special AI' : 'Smart AI');
    const matchesTab = group === activeTab;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch && p.status === 'active';
  });

  const specialAiCount = products.filter(
    (p) => (p.productGroup || (p.name.startsWith('Special') || p.durationDays <= 3 ? 'Special AI' : 'Smart AI')) === 'Special AI'
  ).length;

  const smartAiCount = products.filter(
    (p) => (p.productGroup || (p.name.startsWith('Special') || p.durationDays <= 3 ? 'Special AI' : 'Smart AI')) === 'Smart AI'
  ).length;

  const handleActivateClick = (p: InvestmentProduct) => {
    const requiredVipStr = p.requiredVipLevel || p.minVipLevel;
    const reqRank = vipLevelRankMap[requiredVipStr || 'VIP 0'] ?? 0;

    if (reqRank > 0 && userRank < reqRank) {
      setShowVipInfoModal(p);
    } else {
      setBuyingProduct(p);
    }
  };

  const handleConfirmBuy = () => {
    if (!buyingProduct) return;
    const res = buyProduct(buyingProduct.id);
    if (res.success) {
      setBuyingProduct(null);
    }
  };

  return (
    <div className="space-y-6 pb-20 min-h-screen bg-[#0a0d14] text-slate-100 p-3 sm:p-6 rounded-3xl">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span>Katalog Produk Investasi</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pilih paket investasi kuantitatif AI terbaik sesuai strategi portfolio Anda
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama atau harga paket..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121824] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center justify-center space-x-4 sm:space-x-8 border-b border-slate-800 pb-3 pt-2">
        <button
          onClick={() => setActiveTab('Special AI')}
          className={`flex items-center space-x-2 text-sm sm:text-base font-black pb-3 relative transition-all ${
            activeTab === 'Special AI' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Special AI (1-3 Hari)</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
            {specialAiCount}
          </span>
          {activeTab === 'Special AI' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('Smart AI')}
          className={`flex items-center space-x-2 text-sm sm:text-base font-black pb-3 relative transition-all ${
            activeTab === 'Smart AI' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Smart AI (35 Hari)</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold">
            {smartAiCount}
          </span>
          {activeTab === 'Smart AI' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50" />
          )}
        </button>
      </div>

      {/* Account Info Banner */}
      <div className="bg-[#121824] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 shrink-0">
            {user.vipLevel || 'VIP 0'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white">Status Keanggotaan Anda</h3>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold px-2 py-0.5 rounded-full">
                {user.vipLevel || 'VIP 0'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tingkatkan VIP Anda untuk membuka akses produk Special AI harian dengan hasil langsung dapat ditarik.
            </p>
          </div>
        </div>

        <div className="text-right flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800/80 pt-3 sm:pt-0">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Saldo Utama</span>
            <span className="text-base font-black text-emerald-400 font-mono">
              Rp {(user.balance || 0).toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full bg-[#121824] border border-slate-800 rounded-2xl p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Tidak Ada Paket Ditemukan</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tidak ada paket investasi yang cocok dengan kriteria pencarian Anda.
            </p>
          </div>
        ) : (
          filteredProducts.map((p) => {
            const dailyRp = p.dailyProfitAmount || Math.round((p.price * p.dailyProfitPct) / 100);
            const totalProfitRp = p.totalProfitAmount || dailyRp * p.durationDays;
            const reqVipStr = p.requiredVipLevel || p.minVipLevel || 'VIP 0';
            const reqRank = vipLevelRankMap[reqVipStr] ?? 0;
            const isVipUnlocked = userRank >= reqRank;
            const isShortTerm = p.durationDays <= 3;

            return (
              <div
                key={p.id}
                className="bg-[#121824] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between hover:border-slate-700 transition-all duration-300 group"
              >
                {/* Image & Top Badges */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={p.imageUrl || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80'}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121824] via-[#121824]/40 to-transparent" />

                  {/* Badges on Image */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 font-black text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                      <Zap className="w-3 h-3 text-amber-400" />
                      {p.durationDays} Hari
                    </span>
                    {reqRank > 0 && (
                      <span className="bg-amber-500 text-slate-950 font-black text-[11px] px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {reqVipStr}
                      </span>
                    )}
                  </div>

                  {/* Withdrawal destination badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-lg backdrop-blur-md border ${
                      isShortTerm
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                        : 'bg-blue-950/80 text-blue-400 border-blue-500/40'
                    }`}>
                      {isShortTerm ? 'Cair ke Saldo Penarikan' : 'Cair ke Saldo Profit'}
                    </span>
                  </div>

                  {/* Product Title overlay */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div>
                      <h2 className="text-xl font-black text-white drop-shadow-md tracking-wide">{p.name}</h2>
                      <p className="text-[11px] text-slate-300 font-medium line-clamp-1">{p.description}</p>
                    </div>
                  </div>
                </div>

                {/* Card Body - 4 Key Financial Metrics */}
                <div className="p-4 sm:p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Modal / Price */}
                    <div className="bg-[#0b0e17] border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Modal Investasi</span>
                      <span className="text-base font-black text-white font-mono mt-0.5 block">
                        Rp {p.price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {/* Profit Harian */}
                    <div className="bg-[#0b0e17] border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Profit Produk</span>
                      <span className="text-base font-black text-emerald-400 font-mono mt-0.5 block">
                        Rp {dailyRp.toLocaleString('id-ID')} <span className="text-[10px] font-medium text-slate-400">/hari</span>
                      </span>
                    </div>

                    {/* Durasi */}
                    <div className="bg-[#0b0e17] border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Durasi Kontrak</span>
                      <span className="text-base font-black text-amber-400 font-mono mt-0.5 block">
                        {p.durationDays} Hari
                      </span>
                    </div>

                    {/* Total Profit */}
                    <div className="bg-[#0b0e17] border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Total Est. Profit</span>
                      <span className="text-base font-black text-emerald-400 font-mono mt-0.5 block">
                        Rp {totalProfitRp.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Additional info badge */}
                  {isShortTerm && (
                    <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 text-[11px] text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        Selesai {p.durationDays} hari: Modal & Profit langsung masuk ke <strong className="text-white">Saldo Penarikan</strong> dan siap ditarik.
                      </span>
                    </div>
                  )}

                  {/* Actions: Calculator & Buy Button */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setShowCalcModal(p);
                        setCalcUnits(1);
                      }}
                      className="p-3 bg-[#0b0e17] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition-colors shrink-0 flex items-center justify-center"
                      title="Hitung Simulasi Profit"
                    >
                      <Calculator className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleActivateClick(p)}
                      className={`flex-1 py-3 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 shadow-lg ${
                        reqRank > 0 && !isVipUnlocked
                          ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30'
                          : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-amber-500/20 active:scale-[0.98]'
                      }`}
                    >
                      {reqRank > 0 && !isVipUnlocked ? (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Syarat {reqVipStr} Diperlukan</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          <span>Beli & Aktifkan Paket</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* VIP Info / Unlock Requirement Modal */}
      {showVipInfoModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#121824] border border-amber-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Syarat VIP Diperlukan</h3>
                  <p className="text-xs text-slate-400">{showVipInfoModal.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowVipInfoModal(null)}
                className="text-slate-500 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 bg-[#0b0e17] border border-slate-800 p-4 rounded-2xl">
              <p>
                Untuk membeli paket <strong className="text-amber-400">{showVipInfoModal.name}</strong>, Anda memerlukan level keanggotaan minimal <strong className="text-amber-400">{showVipInfoModal.requiredVipLevel || showVipInfoModal.minVipLevel}</strong>.
              </p>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 font-mono">
                <span className="text-slate-400">Status VIP Anda saat ini:</span>
                <span className="text-slate-300 font-bold">{user.vipLevel || 'VIP 0'}</span>
              </div>
              <div className="flex justify-between items-center font-mono">
                <span className="text-slate-400">Syarat VIP Paket Ini:</span>
                <span className="text-amber-400 font-bold">{showVipInfoModal.requiredVipLevel || showVipInfoModal.minVipLevel}</span>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 text-xs text-amber-300 flex items-start space-x-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Produk Special AI (1-3 Hari) memberikan pengembalian langsung yang siap ditarik ke rekening/e-wallet Anda. Tingkatkan VIP dengan berinvestasi pada produk reguler atau meningkatkan total investasi.
              </span>
            </div>

            <button
              onClick={() => setShowVipInfoModal(null)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-colors shadow-lg shadow-amber-500/20"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Purchase */}
      {buyingProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#121824] border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Konfirmasi Pembelian</h3>
                  <p className="text-xs text-slate-400">{buyingProduct.name}</p>
                </div>
              </div>
              <button
                onClick={() => setBuyingProduct(null)}
                className="text-slate-500 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Harga Paket:</span>
                <span className="text-white font-bold">Rp {buyingProduct.price.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Profit Harian:</span>
                <span className="text-emerald-400 font-bold">
                  Rp {(buyingProduct.dailyProfitAmount || Math.round((buyingProduct.price * buyingProduct.dailyProfitPct) / 100)).toLocaleString('id-ID')} / hari
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Durasi:</span>
                <span className="text-amber-400 font-bold">{buyingProduct.durationDays} Hari</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-400">Total Pengembalian:</span>
                <span className="text-emerald-400 font-black text-sm">
                  Rp {(buyingProduct.totalProfitAmount || (buyingProduct.dailyProfitAmount || Math.round((buyingProduct.price * buyingProduct.dailyProfitPct) / 100)) * buyingProduct.durationDays).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-400">Saldo Anda Saat Ini:</span>
                <span className={user.balance >= buyingProduct.price ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  Rp {(user.balance || 0).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {user.balance < buyingProduct.price && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                Saldo Anda tidak mencukupi. Silakan lakukan Top Up terlebih dahulu.
              </p>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={() => setBuyingProduct(null)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                disabled={user.balance < buyingProduct.price}
                onClick={handleConfirmBuy}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-xl transition-colors shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Konfirmasi Beli
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profit Calculator Simulator Modal */}
      {showCalcModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#121824] border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Simulasi Profit</h3>
                  <p className="text-xs text-slate-400">{showCalcModal.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCalcModal(null)}
                className="text-slate-500 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Units Selector */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium">Jumlah Unit Paket:</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCalcUnits(Math.max(1, calcUnits - 1))}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-lg flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={calcUnits}
                  onChange={(e) => setCalcUnits(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 bg-[#0b0e17] border border-slate-800 rounded-xl py-2 px-3 text-center text-white font-mono font-bold text-base focus:outline-none"
                />
                <button
                  onClick={() => setCalcUnits(calcUnits + 1)}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-lg flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Calculation Output */}
            <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-4 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Modal ({calcUnits} unit):</span>
                <span className="text-white font-bold">
                  Rp {(showCalcModal.price * calcUnits).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Profit Per Hari:</span>
                <span className="text-emerald-400 font-bold">
                  Rp {((showCalcModal.dailyProfitAmount || Math.round((showCalcModal.price * showCalcModal.dailyProfitPct) / 100)) * calcUnits).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Durasi:</span>
                <span className="text-amber-400 font-bold">{showCalcModal.durationDays} Hari</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-400">Total Profit Hasil:</span>
                <span className="text-emerald-400 font-black text-sm">
                  Rp {((showCalcModal.totalProfitAmount || (showCalcModal.dailyProfitAmount || Math.round((showCalcModal.price * showCalcModal.dailyProfitPct) / 100)) * showCalcModal.durationDays) * calcUnits).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowCalcModal(null);
                handleActivateClick(showCalcModal);
              }}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-colors shadow-lg shadow-amber-500/20"
            >
              Lanjutkan Pembelian ({calcUnits} Unit)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
