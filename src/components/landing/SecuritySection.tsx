import React from 'react';
import { Lock, ShieldCheck, Cpu, Database, EyeOff, RefreshCcw } from 'lucide-react';

export const SecuritySection: React.FC<{ lang: 'ID' | 'EN' }> = ({ lang }) => {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'Enkripsi Data 256-Bit SSL',
      desc: 'Semua lalulintas data dan kunci rahasia pengguna dienkripsi dengan standar militer.',
    },
    {
      icon: ShieldCheck,
      title: 'Proteksi Cold Wallet',
      desc: 'Sebagian besar cadangan modal disimpan di cold storage offline terisolasi dari ancaman hacker.',
    },
    {
      icon: Cpu,
      title: 'Monitoring Anti-Fraud AI',
      desc: 'Sistem pendeteksi kecurangan otomatis bekerja 24 jam memantau aktivitas transaksi abnormal.',
    },
    {
      icon: Database,
      title: 'Disaster Recovery & Backup',
      desc: 'Penyimpanan cadangan terenkripsi otomatis di berbagai region server Cloud yang aman.',
    },
  ];

  return (
    <section id="security" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === 'ID' ? 'Sistem Keamanan Berlapis' : 'Institutional Level Security'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {lang === 'ID'
                ? 'Modal & Portofolio Anda Dilindungi Enkripsi Tingkat Tinggi'
                : 'Your Investments Protected By Enterprise Encryption'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {lang === 'ID'
                ? 'Nexa Capital menerapkan standar arsitektur keamanan internasional untuk memastikan dana dan privasi data pengguna selalu terlindungi.'
                : 'Our platform utilizes multi-party computation, hardware security modules, and strict authentication controls.'}
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {securityFeatures.map((sec, i) => {
              const IconComp = sec.icon;
              return (
                <div key={i} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit border border-emerald-500/20">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{sec.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{sec.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
