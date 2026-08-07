import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ContactSection: React.FC<{ lang: 'ID' | 'EN' }> = ({ lang }) => {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
      setTimeout(() => {
        setName('');
        setEmail('');
        setMessage('');
        setSubmitted(false);
      }, 4000);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-900/50 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{lang === 'ID' ? 'Layanan Bantuan 24/7' : 'Customer Support Center'}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                {lang === 'ID' ? 'Hubungi Tim Support Nexa Capital' : 'Get In Touch With Support'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {lang === 'ID'
                  ? 'Ada pertanyaan seputar kendala akun, pendaftaran, atau penarikan saldo? Tim kami siap melayani Anda 24 jam nonstop.'
                  : 'Have questions about deposits, payouts, or accounts? Reach out to our 24/7 VIP desk.'}
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <a
                href={theme.supportTelegram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 transition-all flex items-center space-x-4 group"
              >
                <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Telegram Support Channel</h4>
                  <p className="text-[11px] text-slate-400">Respon tercepat & saluran informasi resmi</p>
                </div>
              </a>

              <a
                href={`https://wa.me/${theme.supportWhatsapp?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center space-x-4 group"
              >
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">WhatsApp VIP Helpdesk</h4>
                  <p className="text-[11px] text-slate-400">{theme.supportWhatsapp}</p>
                </div>
              </a>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Official Email</h4>
                  <p className="text-[11px] text-slate-400">support@nexacapital.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Inquiry Form */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">
              {lang === 'ID' ? 'Kirim Pesan Pertanyaan' : 'Send An Inquiry'}
            </h3>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Pesan Berhasil Terkirim!</h4>
                <p className="text-xs text-slate-300">
                  Terima kasih. Tim support Nexa Capital akan menghubungi email Anda dalam waktu kurang dari 15 menit.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama Anda"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300">Alamat Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Pesan / Kendala Anda</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan pertanyaan atau bantuan yang dibutuhkan..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  Kirim Pesan Bantuan
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
