import React from 'react';
import { UserPlus, Wallet, ShoppingBag, TrendingUp, BarChart2, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC<{ lang: 'ID' | 'EN' }> = ({ lang }) => {
  const steps = [
    {
      num: '01',
      icon: UserPlus,
      title: lang === 'ID' ? 'Pendaftaran Gratis' : 'Sign Up Account',
      desc: lang === 'ID' ? 'Lengkapi data pendaftaran singkat kurang dari 1 menit.' : 'Fill out the quick sign-up form in under 60 seconds.',
    },
    {
      num: '02',
      icon: Wallet,
      title: lang === 'ID' ? 'Deposit Saldo' : 'Deposit Balance',
      desc: lang === 'ID' ? 'Isi saldo via Bank Transfer atau E-Wallet pilihan Anda.' : 'Top up your account wallet via Instant Bank Transfer or QRIS.',
    },
    {
      num: '03',
      icon: ShoppingBag,
      title: lang === 'ID' ? 'Pilih Produk VIP' : 'Select Product VIP',
      desc: lang === 'ID' ? 'Beli unit saham Bluechip atau paket Fast Yield harian.' : 'Choose your desired stock portfolio or yield acceleration tier.',
    },
    {
      num: '04',
      icon: TrendingUp,
      title: lang === 'ID' ? 'Dividen Harian' : 'Daily Dividends',
      desc: lang === 'ID' ? 'Dividen harian otomatis dikreditkan ke dompet akun Anda.' : 'Sit back as yield payouts are credited directly to your balance.',
    },
    {
      num: '05',
      icon: BarChart2,
      title: lang === 'ID' ? 'Pantau Portofolio' : 'Track Growth',
      desc: lang === 'ID' ? 'Pantau akumulasi profit dan komisi referral 3-level secara live.' : 'Monitor total return rates and referral rewards in real time.',
    },
    {
      num: '06',
      icon: Wallet,
      title: lang === 'ID' ? 'Penarikan Instan' : 'Instant Withdrawal',
      desc: lang === 'ID' ? 'Tarik modal dan dividen kapan saja langsung ke rekening bank.' : 'Withdraw your earnings and principal anytime directly to bank.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-900/50 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
            <ArrowRight className="w-3.5 h-3.5" />
            <span>{lang === 'ID' ? 'Langkah Mudah Berinvestasi' : 'Simple Step-by-Step Workflow'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {lang === 'ID' ? 'Cara Kerja Platform Nexa Capital' : 'How Nexa Capital Works'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ID'
              ? 'Hanya 6 langkah sederhana untuk mulai menghasilkan dividen harian secara konsisten.'
              : 'Start building passive daily returns in six seamless steps.'}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const IconComp = step.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 transition-all space-y-4 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black font-mono text-slate-700 group-hover:text-blue-400 transition-colors">
                    {step.num}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{step.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
