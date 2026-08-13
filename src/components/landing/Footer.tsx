import React from 'react';
import { NexaCapitalLogo } from '../NexaCapitalLogo';
import { ShieldCheck, Send, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Footer: React.FC<{ lang: 'ID' | 'EN' }> = ({ lang }) => {
  const { theme } = useTheme();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-8 border-b border-slate-800">
          {/* Col 1 Brand */}
          <div className="lg:col-span-2 space-y-4">
            <NexaCapitalLogo size="md" showText={true} />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Platform investasi saham dan produk Fast Yield Nexa Capital dengan dividen cair harian otomatis, sistem referral 3-level, serta penarikan dana instan 24 jam.
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <a
                href="https://t.me/CSnexacapital"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors flex items-center space-x-1.5 text-xs font-bold"
                title="CS Bantuan Telegram"
              >
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>CS Telegram</span>
              </a>
              <a
                href="https://t.me/nexacapitalcom"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors flex items-center space-x-1.5 text-xs font-bold"
                title="Saluran Telegram Resmi"
              >
                <Send className="w-3.5 h-3.5 text-blue-400" />
                <span>Saluran Resmi</span>
              </a>
            </div>
          </div>

          {/* Col 2 Products */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Produk Investasi</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><a href="#packages" className="hover:text-blue-400 transition-colors">Starter VIP Tier</a></li>
              <li><a href="#packages" className="hover:text-blue-400 transition-colors">Bluechip Stock Basket</a></li>
              <li><a href="#packages" className="hover:text-blue-400 transition-colors">High Yield Tech VIP</a></li>
              <li><a href="#packages" className="hover:text-blue-400 transition-colors">Enterprise Wealth</a></li>
            </ul>
          </div>

          {/* Col 3 Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigasi Utama</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><a href="#hero" className="hover:text-blue-400 transition-colors">Beranda</a></li>
              <li><a href="#calculator" className="hover:text-blue-400 transition-colors">Kalkulator Profit</a></li>
              <li><a href="#how-it-works" className="hover:text-blue-400 transition-colors">Cara Kerja</a></li>
              <li><a href="#testimonials" className="hover:text-blue-400 transition-colors">Testimoni Member</a></li>
              <li><a href="#faq" className="hover:text-blue-400 transition-colors">FAQ & Bantuan</a></li>
            </ul>
          </div>

          {/* Col 4 Legal & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Keamanan & Legal</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><a href="#security" className="hover:text-blue-400 transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#security" className="hover:text-blue-400 transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#security" className="hover:text-blue-400 transition-colors">Manajemen Risiko</a></li>
              <li><a href="#security" className="hover:text-blue-400 transition-colors">Audit Sistem 2026</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="space-y-3 text-[11px] text-slate-500 leading-relaxed">
          <p>
            <strong>Peringatan Risiko:</strong> Seluruh kegiatan investasi memiliki potensi risiko finansial. Hasil imbal hasil masa lalu tidak menjamin kinerja masa depan. Harap pahami profil risiko dan alokasikan dana secara bijak.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800/80 pt-4 text-[11px]">
            <p>© {new Date().getFullYear()} Nexa Capital Platform. Hak Cipta Dilindungi Undang-Undang.</p>
            <p>Sistem Keamanan Terintegrasi 256-Bit SSL</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
