import React from 'react';
import { AlertTriangle, ShieldAlert, Lock, Server, Wrench, WifiOff, ArrowLeft } from 'lucide-react';

interface ErrorPageProps {
  type: '404' | '403' | '401' | '500' | 'maintenance' | 'offline';
  onReset?: () => void;
}

export const ErrorPages: React.FC<ErrorPageProps> = ({ type, onReset }) => {
  const configs = {
    '404': {
      code: '404',
      title: 'Halaman Tidak Ditemukan',
      description: 'Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.',
      icon: AlertTriangle,
      color: 'text-amber-500',
    },
    '403': {
      code: '403',
      title: 'Akses Ditolak (Forbidden)',
      description: 'Anda tidak memiliki hak akses untuk membuka modul eksekutif ini.',
      icon: Lock,
      color: 'text-rose-500',
    },
    '401': {
      code: '401',
      title: 'Sesi Telah Berakhir',
      description: 'Silakan masuk kembali untuk melanjutkan transaksi Anda secara aman.',
      icon: ShieldAlert,
      color: 'text-purple-500',
    },
    '500': {
      code: '500',
      title: 'Kendala Server Internal',
      description: 'Sistem sedang memproses perbaikan otomatis. Coba muat ulang.',
      icon: Server,
      color: 'text-rose-500',
    },
    maintenance: {
      code: 'MAINTENANCE',
      title: 'Pemeliharaan Rutin Sistem',
      description: 'Kami sedang meningkatkan stabilitas gateway transaksi. Kembali dalam beberapa saat.',
      icon: Wrench,
      color: 'text-teal-500',
    },
    offline: {
      code: 'OFFLINE',
      title: 'Koneksi Terputus',
      description: 'Periksa koneksi internet Anda untuk memperbarui data portofolio real-time.',
      icon: WifiOff,
      color: 'text-slate-400',
    },
  };

  const current = configs[type] || configs['404'];
  const Icon = current.icon;

  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className={`p-4 rounded-3xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${current.color}`}>
        <Icon className="w-12 h-12 animate-pulse" />
      </div>

      <div className="space-y-1 max-w-md">
        <span className="text-xs font-black uppercase tracking-widest text-slate-400">{current.code} ERROR</span>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">{current.title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{current.description}</p>
      </div>

      <button
        onClick={() => onReset ? onReset() : window.location.href = '/'}
        className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-teal-500/20 transition-all flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Dasbor Utama</span>
      </button>
    </div>
  );
};
