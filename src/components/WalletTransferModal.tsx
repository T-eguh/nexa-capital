import React from 'react';
import { ArrowLeftRight, AlertCircle, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface WalletTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletTransferModal: React.FC<WalletTransferModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Transfer Antar Dompet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ketentuan Pencairan & Transfer Saldo</p>
          </div>
        </div>

        <div className="space-y-3.5">
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs space-y-2 text-rose-300">
            <div className="flex items-center space-x-2 font-bold text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Transfer Manual Tidak Diperlukan</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Saldo profit yang sedang berjalan tidak dapat dipindahkan secara manual ke saldo penarikan sebelum masa kontrak/durasi habis.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs space-y-2.5">
            <div className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">1. Saldo Profit Kontrak (Otomatis Cair):</p>
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                  Saldo profit otomatis cair dan langsung masuk ke Saldo Penarikan secara otomatis saat durasi/masa aktif paket usai.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 pt-2 border-t border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">2. Bonus Komisi Referral (Otomatis Direct):</p>
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                  Bonus komisi referral 3-level Anda langsung masuk ke Saldo Penarikan secara otomatis tanpa perlu di-transfer manual.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Sistem berjalan otomatis 24 jam nonstop untuk kenyamanan Anda.</span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md text-center mt-2"
          >
            Paham & Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
