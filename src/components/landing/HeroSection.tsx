import React from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  Gift,
  CheckCircle2,
  Sparkles,
  Award,
  Lock,
  ChevronDown,
} from 'lucide-react';

interface HeroSectionProps {
  onOpenAuth: (mode: 'LOGIN' | 'REGISTER' | 'ADMIN_LOGIN') => void;
  lang: 'ID' | 'EN';
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAuth, lang }) => {
  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-20 overflow-hidden flex flex-col justify-center">
      {/* Background Glows & Particle Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* VIP Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-lg shadow-amber-500/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{lang === 'ID' ? 'Platform Fast Yield VIP & Investasi Saham #1' : '#1 Fast Yield & Stock Trading Platform'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black text-white leading-tight tracking-tight">
              {lang === 'ID' ? (
                <>
                  Investasi Saham & <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">
                    Dividen Cair Harian
                  </span>
                </>
              ) : (
                <>
                  Next-Gen Trading & <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">
                    Daily Dividend Returns
                  </span>
                </>
              )}
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {lang === 'ID'
                ? 'Nikmati pertumbuhan portofolio secara otomatis dengan dividen cair setiap hari, katalog saham Bluechip pilihan, sistem referral 3-level, serta penarikan dana instan 24 jam.'
                : 'Accelerate your wealth with automated daily dividend payouts, premier stock portfolios, 3-tier affiliate commissions, and 24/7 instant wallet withdrawals.'}
            </p>

            {/* Feature Checkmarks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lang === 'ID' ? 'Dividen Otomatis' : 'Auto Daily Dividend'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lang === 'ID' ? 'Penarikan Instan' : 'Instant Withdrawal'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lang === 'ID' ? 'Komisi 3-Level' : '3-Tier Referral'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => onOpenAuth('REGISTER')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-sm font-black text-white shadow-xl shadow-blue-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
              >
                <span>{lang === 'ID' ? 'Mulai Investasi Sekarang' : 'Start Investing Today'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#calculator"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/90 border border-slate-700 hover:border-slate-600 text-xs font-bold text-slate-200 transition-all text-center"
              >
                {lang === 'ID' ? 'Simulasi Kalkulator Profit' : 'Calculate Profit ROI'}
              </a>
            </div>

            {/* Security Badges */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 text-[11px] text-slate-400 pt-4 border-t border-slate-800/80">
              <div className="flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Audited Security Platform</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Glass Portfolio Card */}
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                        {lang === 'ID' ? 'Portofolio Saya' : 'My Live Portfolio'}
                      </p>
                      <h3 className="text-xl font-black text-white">Rp 128.500.000</h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    +14.8% Hari Ini
                  </span>
                </div>

                {/* Live Stock Item Samples */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        BBCA
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Bank Central Asia</h4>
                        <p className="text-[10px] text-slate-400">Dividen Cair: Rp 12.500 / hari</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-400">+5.2%</p>
                      <p className="text-[10px] text-slate-400">Aktif</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                        NVDA
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">NVIDIA Corp (VIP)</h4>
                        <p className="text-[10px] text-slate-400">Dividen Cair: Rp 45.000 / hari</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-400">+8.6%</p>
                      <p className="text-[10px] text-slate-400">Aktif</p>
                    </div>
                  </div>
                </div>

                {/* Instant Profit Notification Overlay Card */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/30 flex items-center space-x-3">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                    <Zap className="w-4 h-4 animate-bounce" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white">
                      {lang === 'ID' ? 'Dividen Harian Masuk!' : 'Daily Dividend Paid!'}
                    </p>
                    <p className="text-[10px] text-emerald-300">
                      +Rp 150.000 otomatis masuk ke Saldo Penarikan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 text-center">
          <a
            href="#market"
            className="inline-flex flex-col items-center space-y-1 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest">Explore Platform</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};
