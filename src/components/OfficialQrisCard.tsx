import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Check, ShieldCheck, Zap } from 'lucide-react';
import { generateDynamicQris } from '../utils/qrisGenerator';

interface OfficialQrisCardProps {
  amount?: number;
  qrImageUrl?: string;
  merchantName?: string;
  nmid?: string;
  terminalId?: string;
  printId?: string;
  onDownload?: () => void;
  showAmount?: boolean;
}

export const OfficialQrisCard: React.FC<OfficialQrisCardProps> = ({
  amount,
  qrImageUrl,
  merchantName = 'CAPITAL CELL, BNDNG KD',
  nmid = 'ID1026565672916',
  terminalId = 'A01',
  printId = '93600914',
  onDownload,
  showAmount = true,
}) => {
  const [copied, setCopied] = React.useState(false);
  const qrCardRef = React.useRef<HTMLDivElement>(null);

  // Exact 100% Valid ASPI Base QRIS payload for CAPITAL CELL, BNDNG KD
  const officialBasePayload = '00020101021126660014ID.LINKAJA.WWW01189360091410265656720215ID10265656729160303UMI51590014ID.LINKAJA.WWW01189360091410265656720215ID10265656729165204581253033605802ID5922CAPITAL CELL, BNDNG KD6007BANDUNG61054011562070703A0163047906';

  // Compute Dynamic QRIS string with Tag 54 (Amount) embedded so m-banking fills nominal automatically
  const dynamicPayload = React.useMemo(() => {
    return generateDynamicQris(officialBasePayload, amount);
  }, [amount]);

  const handleCopyAmount = () => {
    if (amount) {
      navigator.clipboard.writeText(amount.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadImage = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    
    // Download direct high-res canvas from SVG
    const svgElement = qrCardRef.current?.querySelector('svg');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = 1000;
        canvas.height = 1000;
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 50, 50, 900, 900);
          const pngFile = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = `QRIS_DYNAMIC_CAPITAL_CELL_${amount || 'DEPOSIT'}.png`;
          downloadLink.href = pngFile;
          downloadLink.click();
        }
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  return (
    <div ref={qrCardRef} className="w-full max-w-sm mx-auto select-none">
      {/* Authentic ASPI Standard Indonesian QRIS Card Layout */}
      <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 text-slate-900 relative overflow-hidden">
        {/* Red Decorative Geometry Header & Footer */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-red-600 -translate-x-12 -translate-y-12 rotate-45 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-28 h-28 bg-red-600 translate-x-14 translate-y-14 rotate-45 pointer-events-none" />

        {/* Header: QRIS Logo & GPN Logo */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3 relative z-10">
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-2xl tracking-tighter text-slate-950">QRIS</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                DINAMIS
              </span>
            </div>
            <span className="text-[8px] font-bold text-slate-600 tracking-tight">
              QR Code Standar Pembayaran Nasional
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <div className="px-2 py-0.5 rounded bg-red-50 border border-red-200 text-[10px] font-black text-red-600 tracking-wider">
              GPN
            </div>
          </div>
        </div>

        {/* Merchant Info */}
        <div className="text-center space-y-0.5 mb-3 relative z-10">
          <h4 className="font-extrabold text-base text-slate-950 tracking-tight">
            {merchantName}
          </h4>
          <p className="text-[11px] font-bold font-mono text-slate-700">
            NMID: {nmid}
          </p>
          <p className="text-[10px] font-semibold text-slate-500">
            {terminalId}
          </p>
        </div>

        {/* QR Code Frame - Pixel-Perfect Direct Dynamic Vector Rendering */}
        <div className="relative z-10 flex justify-center my-2">
          <div className="p-3 bg-white rounded-2xl border-2 border-slate-900 shadow-inner flex items-center justify-center">
            {qrImageUrl && qrImageUrl.startsWith('data:image') ? (
              <img
                src={qrImageUrl}
                alt={`QRIS ${merchantName}`}
                className="w-56 h-56 object-contain rounded-lg"
                loading="eager"
              />
            ) : (
              <QRCodeSVG
                value={dynamicPayload}
                size={220}
                level="M"
                includeMargin={false}
                className="w-56 h-56"
              />
            )}
          </div>
        </div>

        {/* SATU QRIS UNTUK SEMUA */}
        <div className="text-center my-2 relative z-10">
          <span className="text-[10px] font-black uppercase text-slate-900 block tracking-wider">
            SATU QRIS UNTUK SEMUA
          </span>
          <span className="text-[8px] text-slate-500 block">
            Cek aplikasi penyelenggara di: <strong className="text-slate-700">www.aspi-qris.id</strong>
          </span>
        </div>

        {/* Dynamic Amount Status Banner */}
        {amount && amount > 0 && (
          <div className="my-2 p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-center relative z-10">
            <p className="text-[10px] font-extrabold text-emerald-800 flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
              <span>Nominal Otomatis: Rp {amount.toLocaleString('id-ID')}</span>
            </p>
            <p className="text-[8px] text-emerald-600 font-medium">
              Aplikasi M-Banking akan langsung menampilkan angka di atas tanpa ketik manual
            </p>
          </div>
        )}

        {/* Footer Meta Details */}
        <div className="flex justify-between items-end text-[8px] text-slate-600 pt-2 border-t border-slate-100 relative z-10">
          <div>
            <p className="font-mono">Dicetak oleh: {printId}</p>
            <p className="font-mono">Versi cetak: v0.0.2026.08.07</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-800">Buka M-Banking / E-Wallet</p>
            <p className="text-emerald-700 font-semibold">Scan &gt; Langsung Bayar</p>
          </div>
        </div>
      </div>

      {/* Amount & Actions */}
      {showAmount && amount && (
        <div className="mt-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Transfer Deposit
              </span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                Rp {amount.toLocaleString('id-ID')}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyAmount}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center space-x-1.5 border border-slate-700 active:scale-95 cursor-pointer"
              title="Salin Nominal"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Nominal</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verifikasi Otomatis</span>
            </span>

            <button
              type="button"
              onClick={handleDownloadImage}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Simpan QRIS ke Galeri</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

