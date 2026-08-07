import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqSection: React.FC<{ lang: 'ID' | 'EN' }> = ({ lang }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: lang === 'ID' ? 'Berapa minimal investasi di Nexa Capital?' : 'What is the minimum deposit amount?',
      answer: lang === 'ID' ? 'Minimal investasi di Nexa Capital sangat terjangkau, yaitu mulai dari Rp 100.000 untuk paket Starter VIP dengan dividen harian 3.5%.' : 'You can start investing with as low as IDR 100,000 for the Starter VIP tier with 3.5% daily yield.',
    },
    {
      question: lang === 'ID' ? 'Kapan dividen harian dikreditkan ke akun?' : 'When are daily dividends credited?',
      answer: lang === 'ID' ? 'Dividen harian dikreditkan secara otomatis setiap 24 jam sejak paket investasi diaktifkan dan langsung dapat ditarik ke rekening.' : 'Daily dividend payouts are accrued automatically every 24 hours into your withdrawal balance.',
    },
    {
      question: lang === 'ID' ? 'Bagaimana cara kerja komisi referral 3-level?' : 'How does the 3-tier referral system work?',
      answer: lang === 'ID' ? 'Setiap kali member yang Anda undang melakukan deposit/pembelian produk, Anda memperoleh komisi instan: Level 1 (32%), Level 2 (2%), dan Level 3 (1%).' : 'Earn 32% instant commission on Level 1 direct invitees, 2% on Level 2, and 1% on Level 3 downlines.',
    },
    {
      question: lang === 'ID' ? 'Berapa lama proses penarikan saldo (withdrawal)?' : 'How long do withdrawals take?',
      answer: lang === 'ID' ? 'Penarikan saldo diproses secara otomatis 24 jam nonstop dengan rata-rata estimasi masuk ke rekening bank/E-Wallet dalam 1 hingga 5 menit.' : 'Withdrawals are processed automatically 24/7 with funds landing in your account within 1 to 5 minutes.',
    },
    {
      question: lang === 'ID' ? 'Apakah keamanan dana terjamin?' : 'Is my capital secure?',
      answer: lang === 'ID' ? 'Platform Nexa Capital menggunakan sistem enkripsi 256-bit SSL, autentikasi multi-faktor, dan alokasi modal pada portofolio saham terverifikasi.' : 'Yes, all communications and assets are secured via 256-bit SSL encryption, cold wallet isolation, and multi-factor authentication.',
    },
  ];

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{lang === 'ID' ? 'Pertanyaan Sering Diajukan' : 'Frequently Asked Questions'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {lang === 'ID' ? 'Informasi Seputar Platform' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ID' ? 'Temukan jawaban lengkap mengenai skema investasi dan penarikan saldo.' : 'Everything you need to know about our investment ecosystem.'}
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-white hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-blue-400' : 'text-slate-400'}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
