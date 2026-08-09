import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  ArrowRight,
  Info,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { InvestmentProduct } from '../types';

interface VipStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProductToBuy?: (product: InvestmentProduct) => void;
}

interface VipTierInfo {
  level: string;
  rank: number;
  minAmount: number;
  productId?: string;
  productName?: string;
  productPrice?: number;
  productDuration?: number;
  productDailyProfit?: number;
  productTotalReturn?: number;
}

const VIP_TIERS: VipTierInfo[] = [
  {
    level: 'VIP 0',
    rank: 0,
    minAmount: 0,
  },
  {
    level: 'VIP 1',
    rank: 1,
    minAmount: 50000,
    productId: 'special-ai-1',
    productName: 'Special AI 1',
    productPrice: 30000,
    productDuration: 1,
    productDailyProfit: 45000,
    productTotalReturn: 45000,
  },
  {
    level: 'VIP 2',
    rank: 2,
    minAmount: 750000,
    productId: 'special-ai-2',
    productName: 'Special AI 2',
    productPrice: 250000,
    productDuration: 3,
    productDailyProfit: 150000,
    productTotalReturn: 450000,
  },
  {
    level: 'VIP 3',
    rank: 3,
    minAmount: 4500000,
    productId: 'special-ai-3',
    productName: 'Special AI 3',
    productPrice: 500000,
    productDuration: 3,
    productDailyProfit: 335000,
    productTotalReturn: 1005000,
  },
  {
    level: 'VIP 4',
    rank: 4,
    minAmount: 10000000,
    productId: 'special-ai-4',
    productName: 'Special AI 4',
    productPrice: 1000000,
    productDuration: 3,
    productDailyProfit: 700000,
    productTotalReturn: 2100000,
  },
  {
    level: 'VIP 5',
    rank: 5,
    minAmount: 25000000,
    productId: 'special-ai-5',
    productName: 'Special AI 5',
    productPrice: 2000000,
    productDuration: 3,
    productDailyProfit: 1400000,
    productTotalReturn: 4200000,
  },
  {
    level: 'VIP 6',
    rank: 6,
    minAmount: 40000000,
    productId: 'special-ai-6',
    productName: 'Special AI 6',
    productPrice: 5000000,
    productDuration: 3,
    productDailyProfit: 3500000,
    productTotalReturn: 10500000,
  },
  {
    level: 'VIP 7',
    rank: 7,
    minAmount: 50000000,
    productId: 'special-ai-7',
    productName: 'Special AI 7',
    productPrice: 10000000,
    productDuration: 3,
    productDailyProfit: 7000000,
    productTotalReturn: 21000000,
  },
  {
    level: 'VIP 8',
    rank: 8,
    minAmount: 120000000,
    productId: 'special-ai-8',
    productName: 'Special AI 8',
    productPrice: 30000000,
    productDuration: 3,
    productDailyProfit: 21000000,
    productTotalReturn: 63000000,
  },
];

export const VipStatusModal: React.FC<VipStatusModalProps> = ({
  isOpen,
  onClose,
  onSelectProductToBuy,
}) => {
  const { user, products, buyProduct } = useApp();
  const [expandedTier, setExpandedTier] = useState<string | null>(user.vipLevel || 'VIP 1');

  if (!isOpen) return null;

  const currentVipStr = user.vipLevel || 'VIP 0';
  const currentRank = VIP_TIERS.find((t) => t.level === currentVipStr)?.rank ?? 0;
  const totalInvested = user.totalInvested || 0;

  // Next VIP level calculations
  const nextTierIndex = VIP_TIERS.findIndex((t) => t.rank === currentRank + 1);
  const nextTier = nextTierIndex !== -1 ? VIP_TIERS[nextTierIndex] : null;

  let progressPct = 100;
  let remainingNeeded = 0;

  if (nextTier) {
    const prevTierAmount = VIP_TIERS.find((t) => t.rank === currentRank)?.minAmount || 0;
    const requiredSpan = nextTier.minAmount - prevTierAmount;
    const currentProgressInSpan = Math.max(0, totalInvested - prevTierAmount);
    progressPct = Math.min(100, Math.round((currentProgressInSpan / requiredSpan) * 100));
    remainingNeeded = Math.max(0, nextTier.minAmount - totalInvested);
  }

  const toggleExpand = (level: string) => {
    setExpandedTier((prev) => (prev === level ? null : level));
  };

  const handleBuySpecial = (prodId?: string) => {
    if (!prodId) return;
    const prod = products.find((p) => p.id === prodId);
    if (prod && onSelectProductToBuy) {
      onClose();
      onSelectProductToBuy(prod);
    } else if (prod) {
      const res = buyProduct(prod.id);
      if (res.success) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#0e131f] border border-slate-800 rounded-3xl w-full max-w-xl text-white shadow-2xl my-auto overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800/80 bg-[#121826]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black text-white tracking-wide">Status VIP</h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  MEMBERSHIP
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Keuntungan & Tingkatan Akses Produk Spesial</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto custom-scrollbar">
          {/* Current VIP Status Card */}
          <div className="relative rounded-2xl p-5 bg-gradient-to-br from-[#1a2234] to-[#111624] border border-amber-500/30 shadow-xl overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  TINGKAT ANDA SAAT INI
                </span>
              </div>
              <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-full shadow-md flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{currentVipStr}</span>
              </span>
            </div>

            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Total Investasi Aktif</span>
                <span className="text-2xl font-black text-white font-mono">
                  Rp {totalInvested.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Progress to Next VIP Tier */}
            {nextTier ? (
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-amber-400 font-bold">
                    Menuju {nextTier.level} ({progressPct}%)
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Target: Rp {nextTier.minAmount.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800 p-0.5">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400">
                  Butuh tambahan investasi <strong className="text-amber-300">Rp {remainingNeeded.toLocaleString('id-ID')}</strong> lagi untuk naik ke {nextTier.level}.
                </p>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-semibold flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Selamat! Anda telah mencapai Tingkat VIP Tertinggi ({currentVipStr})!</span>
              </div>
            )}

            {/* Sub Info */}
            <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex items-center space-x-2 text-[11px] text-slate-400">
              <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Tingkat naik otomatis saat total investasi aktif mencapai syarat tingkat berikutnya.</span>
            </div>
          </div>

          {/* Section Title */}
          <div className="flex items-center justify-between pt-1">
            <h3 className="text-sm font-black text-white tracking-wide flex items-center space-x-2">
              <span>Tingkatan VIP</span>
              <span className="text-xs text-slate-300 font-semibold">(VIP 1 - VIP 8 · 8 Paket Special AI)</span>
            </h3>
          </div>

          {/* VIP Tiers List */}
          <div className="space-y-3">
            {VIP_TIERS.filter((tier) => tier.rank > 0).map((tier) => {
              const isUserCurrent = tier.level === currentVipStr;
              const isUnlocked = currentRank >= tier.rank;
              const isExpanded = expandedTier === tier.level;

              return (
                <div
                  key={tier.level}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isUserCurrent
                      ? 'bg-[#151c2d] border-amber-500/50 shadow-lg shadow-amber-500/5'
                      : isUnlocked
                      ? 'bg-[#111726] border-slate-800 hover:border-slate-700'
                      : 'bg-[#0d121e]/80 border-slate-800/60 opacity-85'
                  }`}
                >
                  {/* Tier Item Header */}
                  <div
                    onClick={() => toggleExpand(tier.level)}
                    className="p-4 flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border ${
                          isUserCurrent
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                            : isUnlocked
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}
                      >
                        {tier.level}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-black text-white">{tier.level}</h4>
                          {isUserCurrent && (
                            <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                              Aktif
                            </span>
                          )}
                          {!isUserCurrent && isUnlocked && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full">
                              Terbuka
                            </span>
                          )}
                          {!isUnlocked && (
                            <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                              <Lock className="w-2.5 h-2.5" />
                              <span>Terkunci</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          Min. Rp {tier.minAmount.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-amber-400 font-bold hidden sm:inline-block">
                        {isExpanded ? 'Tutup' : 'Lihat Keuntungan'}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-slate-800/80 text-slate-300 flex items-center justify-center">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content (Benefit & Special AI Product) */}
                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-slate-800/60 bg-[#0a0e17]/60 space-y-3">
                      {tier.productId ? (
                        <div className="space-y-3 pt-3">
                          <p className="text-xs text-slate-300">
                            Dengan <strong className="text-amber-400">{tier.level}</strong>, Anda dapat membeli produk durasi jangka pendek berikut:
                          </p>

                          <div className="bg-[#121826] border border-amber-500/30 rounded-2xl p-4 space-y-3 shadow-md">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Zap className="w-4 h-4 text-amber-400" />
                                <h5 className="text-sm font-black text-white">{tier.productName}</h5>
                              </div>
                              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Cair {tier.productDuration} Hari
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                              <div className="bg-[#0a0d14] p-2.5 rounded-xl border border-slate-800">
                                <span className="text-[10px] text-slate-400 block font-sans">Modal Aktivasi</span>
                                <span className="font-bold text-white">Rp {tier.productPrice?.toLocaleString('id-ID')}</span>
                              </div>
                              <div className="bg-[#0a0d14] p-2.5 rounded-xl border border-slate-800">
                                <span className="text-[10px] text-slate-400 block font-sans">Dividen Harian</span>
                                <span className="font-bold text-emerald-400">Rp {tier.productDailyProfit?.toLocaleString('id-ID')}</span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800/80">
                              <span className="text-slate-400">Total Est. Profit:</span>
                              <span className="font-bold text-emerald-400 font-mono">
                                Rp {tier.productTotalReturn?.toLocaleString('id-ID')}
                              </span>
                            </div>

                            <button
                              onClick={() => handleBuySpecial(tier.productId)}
                              disabled={!isUnlocked}
                              className={`w-full py-2.5 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 shadow-md ${
                                isUnlocked
                                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 active:scale-98'
                                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                              }`}
                            >
                              {isUnlocked ? (
                                <>
                                  <Zap className="w-3.5 h-3.5" />
                                  <span>Beli {tier.productName} Sekarang</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>Tingkatkan Total Investasi ke Rp {tier.minAmount.toLocaleString('id-ID')}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-3 text-xs text-slate-400 space-y-1">
                          <p>Tingkat dasar keanggotaan tanpa syarat deposit minimal.</p>
                          <p className="text-amber-400/90 font-medium">
                            Tingkatkan investasi ke Rp 50.000 untuk naik ke VIP 1 & membuka paket Special AI 1!
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-4 border-t border-slate-800/80 bg-[#121826] flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
