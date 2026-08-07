import React, { useState } from 'react';
import { Star, CheckCircle2, Quote, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  content: string;
  profitAmount: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Budi Santoso',
    role: 'Investor Platinum - Jakarta',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    content: 'Sangat puas dengan dividen harian Nexa Capital. Penarikan Rp 15.000.000 ke rekening BCA langsung masuk dalam 3 menit tanpa kendala.',
    profitAmount: 'Rp 45.000.000 Total Profit',
    rating: 5,
  },
  {
    name: 'Dewi Lestari',
    role: 'Pebisnis & Member VIP - Surabaya',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    content: 'Sistem referral 3-levelnya sangat menguntungkan! Komisi 32% dari Level 1 langsung bisa ditarik kapan saja.',
    profitAmount: 'Rp 28.500.000 Total Profit',
    rating: 5,
  },
  {
    name: 'Rudi Hermawan',
    role: 'Trader & Investor - Bandung',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    content: 'Aplikasi mudah digunakan dan transparan. CS Telegram juga sangat responsif membantu proses deposit awal.',
    profitAmount: 'Rp 18.200.000 Total Profit',
    rating: 5,
  },
];

export const TestimonialsSection: React.FC<{ lang: 'ID' | 'EN' }> = ({ lang }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[activeIdx];

  return (
    <section id="testimonials" className="py-24 bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
            <Quote className="w-3.5 h-3.5" />
            <span>{lang === 'ID' ? 'Testimoni Member Terverifikasi' : 'Verified Member Reviews'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {lang === 'ID' ? 'Pengalaman Investor Bersama Nexa Capital' : 'Trusted By Over 128,000+ Investors'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ID'
              ? 'Bukti nyata kepuasan member terhadap dividen harian dan kecepatan penarikan saldo.'
              : 'Read genuine feedback from active platform members across Indonesia and beyond.'}
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-3xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {current.profitAmount}
              </span>
            </div>

            <p className="text-base sm:text-lg text-slate-200 italic leading-relaxed">
              "{current.content}"
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="flex items-center space-x-3">
                <img src={current.avatar} alt={current.name} className="w-11 h-11 rounded-full object-cover border-2 border-blue-500" />
                <div>
                  <h4 className="text-sm font-bold text-white">{current.name}</h4>
                  <p className="text-xs text-slate-400">{current.role}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
