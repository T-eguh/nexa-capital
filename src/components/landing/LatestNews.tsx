import React from 'react';
import { Newspaper, ArrowRight, Calendar, Tag } from 'lucide-react';

export const LatestNews: React.FC<{ lang: 'ID' | 'EN' }> = ({ lang }) => {
  const news = [
    {
      title: lang === 'ID' ? 'Nexa Capital Meluncurkan Portofolio Saham AI & Tech VIP 2026' : 'Nexa Capital Launches 2026 AI & Tech Stock Portfolio',
      category: 'INVESTMENT',
      date: '05 Ags 2026',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=80',
      desc: 'Portofolio baru memberikan opsi diversifikasi aset dengan proyeksi pertumbuhan dividen harian hingga 7.5%.',
    },
    {
      title: lang === 'ID' ? 'Panduan Memaksimalkan Komisi Referral 3-Level Hingga 32%' : 'How To Maximize 3-Tier Affiliate Commission Up To 32%',
      category: 'TUTORIAL',
      date: '02 Ags 2026',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=80',
      desc: 'Pelajari strategi membangun jaringan investor downline aktif untuk mendapatkan imbal hasil pasif secara konsisten.',
    },
    {
      title: lang === 'ID' ? 'Pencapaian AUM Rp 45 Miliar & Peningkatan Kecepatan Withdrawal' : 'Nexa Capital Reaches IDR 45B AUM & Enhances Payout Speed',
      category: 'ANNOUNCEMENT',
      date: '28 Jul 2026',
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&auto=format&fit=crop&q=80',
      desc: 'Peningkatan arsitektur server terbaru memungkinkan penarikan saldo instan diproses dalam waktu kurang dari 3 menit.',
    },
  ];

  return (
    <section id="news" className="py-24 bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
              <Newspaper className="w-3.5 h-3.5" />
              <span>{lang === 'ID' ? 'Wawasan Pasar & Berita' : 'Market Insights & News'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              {lang === 'ID' ? 'Kabar Terbaru Dari Nexa Capital' : 'Latest Platform Updates & Insights'}
            </h2>
          </div>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item, i) => (
            <div
              key={i}
              className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden hover:border-slate-700 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 text-blue-400 backdrop-blur-md border border-slate-800">
                    {item.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{item.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{item.desc}</p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <a
                  href="#news"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>{lang === 'ID' ? 'Baca Selengkapnya' : 'Read Article'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
