import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Info,
  X,
  Sparkles,
  Calculator,
  Lock,
  Award,
} from 'lucide-react';
import { InvestmentProduct } from '../types';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

export const ProductCatalog: React.FC = () => {
  const { products, user, buyProduct } = useApp();
  const { theme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedProductForCalc, setSelectedProductForCalc] = useState<InvestmentProduct | null>(null);
  const [calcUnits, setCalcUnits] = useState<number>(1);
  const [buyingProduct, setBuyingProduct] = useState<InvestmentProduct | null>(null);

  const categories = [
    'Semua',
    'Saham Bluechip',
    'Dividend High Yield',
    'Sektor Teknologi',
    'Obligasi & Reksa Dana',
    'Kripto Index',
  ];

  const currentSaldoPenarikan = user.saldoPenarikan ?? user.balance;

  const vipLevelRankMap: Record<string, number> = {
    'VIP 0': 0,
    'VIP 1': 1,
    'VIP 2': 2,
    'VIP 3': 3,
  };

  const userRank = vipLevelRankMap[user.vipLevel || 'VIP 0'] ?? 0;

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'Semua' || p.category === selectedCategory;
    return matchesSearch && matchesCat && p.status === 'active';
  });

  const handleConfirmBuy = () => {
    if (!buyingProduct) return;
    const res = buyProduct(buyingProduct.id);
    if (res.success) {
      setBuyingProduct(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Filter Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Katalog Produk Investasi & Saham</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-sm">
                Akun Saya: {user.vipLevel || 'VIP 0'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Produk 35 Hari profit masuk ke Saldo Profit. Produk 3H & 1H khusus akun VIP 1, 2, 3 dengan profit harian langsung masuk Saldo Penarikan!
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari produk saham / investasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => {
          const dailyRp = Math.round((p.price * p.dailyProfitPct) / 100);
          const reqRank = vipLevelRankMap[p.minVipLevel || 'VIP 0'] ?? 0;
          const isVipUnlocked = userRank >= reqRank;
          const is35H = p.isLockable35H || p.durationDays >= 35;

          return (
            <div
              key={p.id}
              className={`bg-white dark:bg-slate-800 rounded-2xl border ${
                isVipUnlocked
                  ? 'border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-lg'
                  : 'border-amber-400/50 opacity-90'
              } overflow-hidden transition-all flex flex-col justify-between group relative`}
            >
              {/* Product Header Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 text-white backdrop-blur-md">
                    {p.category}
                  </span>
                  {p.minVipLevel && (
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 shadow-sm">
                      Syarat {p.minVipLevel}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-600/90 backdrop-blur-md flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{p.durationDays} Hari</span>
                  </span>

                  {is35H ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950 flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>Saldo Profit</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-white flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-amber-300" />
                      <span>Saldo Penarikan</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Body Info */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {p.description}
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl text-xs border border-slate-100 dark:border-slate-700/50">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Harga Modal</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                      Rp {p.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Profit Harian</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                      {p.dailyProfitPct}% / hari
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Nominal / Hari</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Rp {dailyRp.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Tujuan Profit</span>
                    <span className={`font-bold ${is35H ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {is35H ? 'Saldo Profit (35H)' : 'Saldo Penarikan'}
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center space-x-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedProductForCalc(p);
                      setCalcUnits(1);
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Simulasi Kalkulator Profit"
                  >
                    <Calculator className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setBuyingProduct(p)}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs text-white shadow-sm transition-all flex items-center justify-center space-x-1.5 ${
                      isVipUnlocked
                        ? 'hover:opacity-95 active:scale-95'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                    style={{ backgroundColor: isVipUnlocked ? theme.primaryColor : undefined }}
                  >
                    {isVipUnlocked ? <Zap className="w-4 h-4" /> : <Lock className="w-4 h-4 text-amber-400" />}
                    <span>{isVipUnlocked ? 'BELI PRODUK' : `Butuh ${p.minVipLevel}`}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulator Modal */}
      {selectedProductForCalc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                <span>Simulasi Kalkulator Profit</span>
              </h3>
              <button
                onClick={() => setSelectedProductForCalc(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {selectedProductForCalc.name}
              </h4>
              <p className="text-xs text-slate-500">
                Harga 1 Paket: Rp {selectedProductForCalc.price.toLocaleString('id-ID')}
              </p>
            </div>

            {/* Slider Units */}
            <div className="space-y-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300">Jumlah Paket Didepositkan:</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                  {calcUnits} Paket
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={calcUnits}
                onChange={(e) => setCalcUnits(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 Paket</span>
                <span>10 Paket</span>
                <span>20 Paket</span>
              </div>
            </div>

            {/* Calculation Results */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500">Total Modal Dibutuhkan:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  Rp {(selectedProductForCalc.price * calcUnits).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500">Profit Harian Received:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  +Rp {Math.round((selectedProductForCalc.price * selectedProductForCalc.dailyProfitPct * calcUnits) / 100).toLocaleString('id-ID')} / hari
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500">Total Profit Akhir ({selectedProductForCalc.durationDays} Hari):</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                  +Rp {(selectedProductForCalc.totalProfitAmount * calcUnits).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setBuyingProduct(selectedProductForCalc);
                setSelectedProductForCalc(null);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-sm"
              style={{ backgroundColor: theme.primaryColor }}
            >
              Lanjutkan Pembelian
            </button>
          </div>
        </div>
      )}

      {/* Confirm Purchase Modal */}
      {buyingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span>Konfirmasi Pembelian Produk</span>
              </h3>
              <button
                onClick={() => setBuyingProduct(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Nama Produk</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {buyingProduct.name}
              </h4>
              <p className="text-xs text-slate-500">
                Durasi {buyingProduct.durationDays} Hari • Profit {buyingProduct.dailyProfitPct}% / Hari
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Harga Produk:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  Rp {buyingProduct.price.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Saldo Penarikan Anda:</span>
                <span className={`font-extrabold ${
                  currentSaldoPenarikan >= buyingProduct.price ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  Rp {currentSaldoPenarikan.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Check VIP level requirement */}
            {buyingProduct.minVipLevel && userRank < (vipLevelRankMap[buyingProduct.minVipLevel] ?? 0) && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Produk ini membutuhkan tingkat <strong>{buyingProduct.minVipLevel}</strong>. Tingkatkan total akumulasi investasi Anda untuk membuka paket ini.</span>
              </div>
            )}

            {currentSaldoPenarikan < buyingProduct.price && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Saldo Penarikan Anda tidak mencukupi untuk membeli paket ini. Silakan melakukan deposit terlebih dahulu.</span>
              </div>
            )}

            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setBuyingProduct(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmBuy}
                disabled={
                  currentSaldoPenarikan < buyingProduct.price ||
                  (buyingProduct.minVipLevel ? userRank < (vipLevelRankMap[buyingProduct.minVipLevel] ?? 0) : false)
                }
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold text-white transition-all ${
                  currentSaldoPenarikan >= buyingProduct.price &&
                  (!buyingProduct.minVipLevel || userRank >= (vipLevelRankMap[buyingProduct.minVipLevel] ?? 0))
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md active:scale-95'
                    : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
                }`}
              >
                Konfirmasi Beli
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
