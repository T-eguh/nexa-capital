import React from 'react';
import { Calendar, CheckCircle2, Circle } from 'lucide-react';

export const CompanyTimeline: React.FC<{ lang: 'ID' | 'EN' }> = ({ lang }) => {
  const milestones = [
    {
      year: '2024',
      title: 'Inisiasi Platform & Riset Portofolio',
      desc: 'Pengembangan arsitektur dasar platform investasi dan pengujian skema Fast Yield harian.',
      status: 'DONE',
    },
    {
      year: '2025',
      title: 'Peluncuran Resmi & Sistem Referral 3-Level',
      desc: 'Peluncuran produk Bluechip, pengintegrasian enkripsi 256-bit, serta komisi affiliate hingga 32%.',
      status: 'DONE',
    },
    {
      year: '2026',
      title: 'Pencapaian AUM Rp 45B & Penarikan Instan AI',
      desc: 'Pengembangan sistem automatisasi penarikan saldo instan 24 jam dan penambahan katalog saham VIP global.',
      status: 'ACTIVE',
    },
    {
      year: 'Masa Depan',
      title: 'Ekspansi Global & Kemitraan Strategis',
      desc: 'Rencana integrasi fitur trading terdesentralisasi, reksadana syariah, dan pembukaan kantor cabang internasional.',
      status: 'FUTURE',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
            <Calendar className="w-3.5 h-3.5" />
            <span>{lang === 'ID' ? 'Roadmap Rekam Jejak' : 'Company Evolution Roadmap'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {lang === 'ID' ? 'Perjalanan Perkembangan Nexa Capital' : 'Our Strategic Roadmap'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ID' ? 'Komitmen keberlanjutan dan inovasi teknologi dalam dunia investasi finansial.' : 'Delivering continuous innovation and scalable financial performance.'}
          </p>
        </div>

        {/* Timeline List */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {milestones.map((m, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl bg-slate-900/80 border transition-all space-y-3 ${
                m.status === 'ACTIVE'
                  ? 'border-blue-500/80 ring-2 ring-blue-500/20 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-black font-mono text-blue-400">{m.year}</span>
                {m.status === 'DONE' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : m.status === 'ACTIVE' ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white uppercase">
                    Sekarang
                  </span>
                ) : (
                  <Circle className="w-5 h-5 text-slate-600" />
                )}
              </div>
              <h3 className="text-sm font-bold text-white">{m.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
