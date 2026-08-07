import React from 'react';
import { Users, TrendingUp, ShieldCheck, DollarSign, Award, Globe } from 'lucide-react';

export const StatisticsSection: React.FC<{ lang: 'ID' | 'EN' }> = ({ lang }) => {
  const stats = [
    {
      icon: Users,
      value: '128.500+',
      label: lang === 'ID' ? 'Investor Aktif Terdaftar' : 'Registered Investors',
      sub: 'Di seluruh Indonesia & Global',
      color: 'text-blue-400',
    },
    {
      icon: TrendingUp,
      value: 'Rp 45.8B+',
      label: lang === 'ID' ? 'Total Dana Kelolaan (AUM)' : 'Assets Under Management',
      sub: 'Portfolio Bluechip & High Yield',
      color: 'text-emerald-400',
    },
    {
      icon: DollarSign,
      value: 'Rp 12.4B+',
      label: lang === 'ID' ? 'Dividen Cair Dibayarkan' : 'Daily Dividends Distributed',
      sub: 'Pencairan dana tepat waktu',
      color: 'text-amber-400',
    },
    {
      icon: ShieldCheck,
      value: '99.98%',
      label: lang === 'ID' ? 'Penarikan Saldo Sukses' : 'Successful Withdrawal Rate',
      sub: 'Proses otomatis 24 jam',
      color: 'text-purple-400',
    },
  ];

  return (
    <section className="py-20 bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const IconComp = stat.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
              >
                <div className={`p-3 rounded-xl bg-slate-900 w-fit ${stat.color}`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-mono">{stat.value}</h3>
                  <p className="text-xs font-bold text-slate-300 mt-1">{stat.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{stat.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
