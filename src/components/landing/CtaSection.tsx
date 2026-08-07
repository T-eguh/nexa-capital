import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, UserPlus, LogIn } from 'lucide-react';

interface CtaSectionProps {
  onOpenAuth: (mode: 'LOGIN' | 'REGISTER' | 'ADMIN_LOGIN') => void;
  lang: 'ID' | 'EN';
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onOpenAuth, lang }) => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 border border-blue-500/40 p-8 sm:p-14 overflow-hidden shadow-2xl text-center space-y-6">
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{lang === 'ID' ? 'Bergabunglah Bersama 128.000+ Investor' : 'Join Over 128,000+ Active Investors'}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white max-w-3xl mx-auto leading-tight">
            {lang === 'ID' ? 'Siap Meraih Dividen Harian & Pertumbuhan Finansial?' : 'Ready To Earn Daily Dividend Yields?'}
          </h2>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto">
            {lang === 'ID'
              ? 'Daftarkan akun Anda gratis sekarang juga dan rasakan kemudahan investasi saham dengan pencairan saldo instan 24 jam.'
              : 'Create your free account in under 60 seconds and experience continuous passive daily return accumulation.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onOpenAuth('REGISTER')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-sm font-black text-white shadow-xl shadow-blue-500/30 transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{lang === 'ID' ? 'Daftar Akun Gratis' : 'Create Free Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAuth('LOGIN')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 border border-slate-700 hover:border-slate-600 text-xs font-bold text-slate-200 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4 text-blue-400" />
              <span>{lang === 'ID' ? 'Sudah Memiliki Akun? Masuk' : 'Already Member? Login'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
