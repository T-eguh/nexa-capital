import React from 'react';
import { X, ShieldCheck, Zap, ArrowUpRight, Send, TrendingUp, Shield, Users } from 'lucide-react';
import { NexaCapitalLogo } from './NexaCapitalLogo';
import { useApp } from '../context/AppContext';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMarket: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onOpenMarket,
}) => {
  const { platformSettings } = useApp();
  if (!isOpen) return null;

  const appName = platformSettings?.appName || 'NEXA CAPITAL';
  const title = platformSettings?.welcomeModalTitle || 'Selamat datang';
  const subtitle = platformSettings?.welcomeModalSubtitle || 'Robot trading AI & pasar saham NEXA CAPITAL siap jalan. Mulai investasi dari pasar produk.';
  const securityText = platformSettings?.welcomeSecurityText || 'Data terenkripsi · transaksi dipantau 24/7';
  const tgCs = platformSettings?.supportTelegram || 'https://t.me/CSnexacapital';
  const tgChannel = platformSettings?.telegramChannel || 'https://t.me/nexacapitalcom';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto text-white space-y-4">
        {/* Top Bar Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4 fill-emerald-400" />
            <span>{appName} SMART MARKET</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Welcome Header Box */}
        <div className="flex items-start space-x-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/70">
          <div className="shrink-0 p-1.5 bg-slate-900 rounded-xl border border-slate-800">
            <NexaCapitalLogo size="sm" showText={false} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">{title}</h2>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Verification Badges Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center space-x-3">
            <div className="px-2 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 font-black text-xs">
              OJK
            </div>
            <div>
              <p className="text-xs font-bold text-white">OJK</p>
              <p className="text-[10px] text-slate-400 font-medium">Terdaftar</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center space-x-3">
            <div className="px-2 py-1 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400 font-black text-[10px]">
              Bappebti
            </div>
            <div>
              <p className="text-xs font-bold text-white">Bappebti</p>
              <p className="text-[10px] text-slate-400 font-medium">Diawasi</p>
            </div>
          </div>
        </div>

        {/* Security Info Card */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-white">Aman & terverifikasi</p>
            <p className="text-[11px] text-slate-400">{securityText}</p>
          </div>
        </div>

        {/* Action Buttons Stack */}
        <div className="space-y-2.5 pt-1">
          {/* 1. Buka pasar */}
          <button
            onClick={() => {
              onClose();
              onOpenMarket();
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-500/25 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Buka pasar</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          {/* 2. CS Telegram */}
          <a
            href={tgCs}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Send className="w-4 h-4 text-cyan-400" />
            <span>CS Telegram Resmi</span>
          </a>

          {/* 3. Saluran Telegram */}
          <a
            href={tgChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Send className="w-4 h-4 fill-slate-950 text-sky-500" />
            <span>Saluran Telegram Komunitas</span>
          </a>

          {/* 4. Customer Support (Pusat Bantuan) */}
          <a
            href={tgCs}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Customer support 24/7</span>
          </a>
        </div>

        {/* Footer info note */}
        <div className="text-center pt-1 pb-1">
          <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center space-x-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bergabung dengan 10.000+ investor aktif</span>
          </p>
        </div>
      </div>
    </div>
  );
};
