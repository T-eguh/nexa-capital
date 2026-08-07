import React, { useState } from 'react';
import { Folder, Upload, Image, Trash2, Copy, Check } from 'lucide-react';

export const FileManagerView: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const mockFiles = [
    { name: 'bca_qris_qr.png', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=80', size: '240 KB', folder: 'payments' },
    { name: 'banner_promo_juni.jpg', url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&auto=format&fit=crop&q=80', size: '1.2 MB', folder: 'promos' },
    { name: 'bbca_stock_thumb.png', url: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=500&auto=format&fit=crop&q=80', size: '512 KB', folder: 'products' },
  ];

  const copyUrl = (url: string, idx: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <Folder className="w-5 h-5 text-amber-400" />
            <span>Penyimpanan Aset Gambar & Berkas Platform</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Kelola gambar QRIS, banner produk saham, logo media, dan dokumen bukti pembayaran.
          </p>
        </div>

        <button
          onClick={() => alert('Fitur upload berkas baru siap digunakan!')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center space-x-2 shadow-lg shadow-amber-500/20"
        >
          <Upload className="w-4 h-4" />
          <span>Unggah Aset Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockFiles.map((f, idx) => (
          <div key={f.name} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="h-32 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-white truncate max-w-[150px]">{f.name}</p>
                <p className="text-[10px] text-slate-500">{f.size} • Folder: {f.folder}</p>
              </div>
              <button
                onClick={() => copyUrl(f.url, idx)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                title="Salin URL Aset"
              >
                {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
