import React from 'react';
import { Shield, Sparkles, Check, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/cn';

interface InvestmentPackagesProps {
  onOpenAuth: (mode: 'LOGIN' | 'REGISTER') => void;
  lang: 'ID' | 'EN';
}

export const InvestmentPackages: React.FC<InvestmentPackagesProps> = ({ onOpenAuth, lang }) => {
  const packages = [
    {
      name: 'Starter VIP',
      tagline: lang === 'ID' ? 'Cocok Untuk Pemula' : 'Ideal for Beginners',
      minAmount: 100000,
      dailyProfit: '3.5%',
      duration: '30 Hari',
      popular: false,
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      features: [
        lang === 'ID' ? 'Dividen Cair Setiap Hari' : 'Daily Automatic Payout',
        lang === 'ID' ? 'Penarikan Modal Setelah Siklus' : 'Principal Return at Cycle End',
        lang === 'ID' ? 'Akses Dukungan CS Standard' : 'Standard 24/7 Support',
      ],
    },
    {
      name: 'Bluechip Growth',
      tagline: lang === 'ID' ? 'Pilihan Paling Populer' : 'Most Popular Choice',
      minAmount: 1000000,
      dailyProfit: '5.0%',
      duration: '30 Hari',
      popular: true,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      features: [
        lang === 'ID' ? 'Portofolio Saham Bluechip Utama' : 'Prime Bluechip Stock Basket',
        lang === 'ID' ? 'Dividen Harian 5.0% Otomatis' : 'Auto 5.0% Daily Yield',
        lang === 'ID' ? 'Komisi Referral Max Level 1 (32%)' : 'Full L1 32% Referral Multiplier',
        lang === 'ID' ? 'Penarikan Saldo Instan 24 Jam' : '24/7 Priority Withdrawal',
      ],
    },
    {
      name: 'High Yield VIP',
      tagline: lang === 'ID' ? 'Akselerasi Profit Maksimal' : 'High Yield Acceleration',
      minAmount: 5000000,
      dailyProfit: '7.5%',
      duration: '30 Hari',
      popular: false,
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      features: [
        lang === 'ID' ? 'Kombinasi Saham Tech & Fast Yield' : 'Tech & Fast Yield Asset Combo',
        lang === 'ID' ? 'Dividen Harian 7.5% Otomatis' : '7.5% Accelerated Daily Return',
        lang === 'ID' ? 'Komisi Full 3-Level (32% + 2% + 1%)' : 'Full 3-Tier Affiliate Multiplier',
        lang === 'ID' ? 'Dedicated Account Manager' : 'Personal Dedicated CS Manager',
      ],
    },
    {
      name: 'Enterprise Wealth',
      tagline: lang === 'ID' ? 'Portofolio Institusional' : 'Institutional Tier',
      minAmount: 20000000,
      dailyProfit: '10.0%',
      duration: '30 Hari',
      popular: false,
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      features: [
        lang === 'ID' ? 'Portofolio Saham Global Exclusive' : 'Exclusive Global Stock Asset',
        lang === 'ID' ? 'Dividen Harian 10.0% Otomatis' : 'Max 10.0% Daily Yield Payout',
        lang === 'ID' ? 'Penarikan Prioritas Utama (<5 Menit)' : 'Instant VIP Payout (<5 mins)',
        lang === 'ID' ? 'Garansi Perlindungan Modal 100%' : '100% Asset Insurance Cover',
      ],
    },
  ];

  return (
    <section id="packages" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ID' ? 'Katalog Paket Investasi VIP' : 'VIP Investment Packages'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {lang === 'ID' ? 'Pilih Paket Investasi Sesuai Target' : 'Choose Your Investment Strategy'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ID'
              ? 'Dapatkan imbal hasil dividen harian yang tinggi dengan skema investasi aman dan transparan.'
              : 'Select from our audited investment tiers designed for steady wealth accumulation.'}
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, i) => (
            <div
              key={i}
              className={`p-6 rounded-3xl bg-slate-900/90 border transition-all duration-300 relative flex flex-col justify-between space-y-6 hover:-translate-y-2 shadow-2xl ${
                pkg.popular
                  ? 'border-emerald-500/60 ring-2 ring-emerald-500/20 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-lg">
                  {lang === 'ID' ? 'PALING POPULER' : 'MOST POPULAR'}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${pkg.badgeColor}`}>
                    {pkg.tagline}
                  </span>
                  <h3 className="text-xl font-black text-white mt-2">{pkg.name}</h3>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    {lang === 'ID' ? 'Minimal Investasi' : 'Minimum Deposit'}
                  </p>
                  <p className="text-2xl font-black text-white font-mono">{formatCurrency(pkg.minAmount)}</p>
                  <p className="text-xs font-bold text-emerald-400 font-mono mt-1">
                    +{pkg.dailyProfit} {lang === 'ID' ? 'Dividen / Hari' : 'Daily Yield'}
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onOpenAuth('REGISTER')}
                className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 cursor-pointer transition-all ${
                  pkg.popular
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                }`}
              >
                <span>{lang === 'ID' ? 'Investasi Paket Ini' : 'Invest Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
