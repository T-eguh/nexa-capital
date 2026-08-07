import React from 'react';
import {
  ShieldCheck,
  Zap,
  TrendingUp,
  FileText,
  Users,
  Headphones,
  Lock,
  Smartphone,
} from 'lucide-react';

export const WhyChooseUs: React.FC<{ lang: 'ID' | 'EN' }> = ({ lang }) => {
  const features = [
    {
      icon: ShieldCheck,
      title: lang === 'ID' ? 'Keamanan Enkripsi 256-Bit' : '256-Bit Military Encryption',
      desc: lang === 'ID' ? 'Seluruh transaksi dan data kredensial dilindungi oleh sistem keamanan berlapis berstandar perbankan.' : 'All account details and transactions are protected using enterprise-grade bank encryption.',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: Zap,
      title: lang === 'ID' ? 'Penarikan Saldo Instan 24/7' : '24/7 Instant Withdrawals',
      desc: lang === 'ID' ? 'Proses penarikan dividen dan modal pokok diproses otomatis ke rekening bank/E-Wallet dalam hitungan menit.' : 'Request withdrawals anytime with zero delay, sent straight to your bank account or e-wallet.',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: TrendingUp,
      title: lang === 'ID' ? 'Dividen Cair Setiap Hari' : 'Automated Daily Dividend',
      desc: lang === 'ID' ? 'Profit hasil investasi langsung dikreditkan secara otomatis setiap hari tanpa perlu klaim manual.' : 'Dividends are automatically accrued and added to your withdrawal balance every 24 hours.',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      icon: Users,
      title: lang === 'ID' ? 'Program Referral 3-Level' : '3-Tier Affiliate Commission',
      desc: lang === 'ID' ? 'Dapatkan komisi berkelanjutan hingga 32% (Level 1), 2% (Level 2), dan 1% (Level 3) dari setiap investasi downline.' : 'Earn massive commission bonuses across 3 generations of invited active investors.',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      icon: FileText,
      title: lang === 'ID' ? 'Transparansi Audit Portofolio' : 'Transparent Asset Audits',
      desc: lang === 'ID' ? 'Laporan transaksi, saldo modal, dan riwayat dividen dapat dipantau secara real-time dari dashboard.' : 'Access clear financial statements and asset allocation metrics in real time.',
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    },
    {
      icon: Headphones,
      title: lang === 'ID' ? 'Dukungan Prioritas 24 Jam' : '24/7 VIP Customer Support',
      desc: lang === 'ID' ? 'Tim customer service dan manajer akun siap membantu Anda via Live Chat Telegram & WhatsApp.' : 'Get instant dedicated assistance from expert account managers around the clock.',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'ID' ? 'Keunggulan Utama Platform' : 'Core Platform Advantages'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {lang === 'ID' ? 'Mengapa Memilih Nexa Capital?' : 'Why Investors Trust Nexa Capital'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ID'
              ? 'Standar baru platform investasi modern dengan keamanan tinggi dan pencairan dividen transparan.'
              : 'Built with institutional security standards, high yields, and seamless user experience.'}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const IconComp = feat.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all duration-300 space-y-4 hover:-translate-y-1 shadow-xl"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${feat.color}`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
