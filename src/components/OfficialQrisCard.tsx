import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Check, ShieldCheck, Zap, RefreshCw, Smartphone } from 'lucide-react';
import { generateDynamicQris, getStaticQris, OFFICIAL_AUTHENTIC_QRIS_STATIC } from '../utils/qrisGenerator';

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
  onDownload,
  showAmount = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedMerchant, setCopiedMerchant] = useState(false);
  // Default to static authentic ASPI QRIS so DANA, BCA, Mandiri, BRImo never return 'Transaksi Gagal'
  const [isDynamicMode, setIsDynamicMode] = useState(false);
  // View mode: 'BARCODE_ONLY' (pure square QR code) vs 'FULL_FLYER' (full poster)
  const [viewMode, setViewMode] = useState<'BARCODE_ONLY' | 'FULL_FLYER'>('BARCODE_ONLY');
  const qrCardRef = React.useRef<HTMLDivElement>(null);

  // Exact 100% Valid ASPI Base QRIS payload
  const officialBasePayload = OFFICIAL_AUTHENTIC_QRIS_STATIC;

  // Determine if a custom merchant image (data url or image url) is provided
  const hasCustomImage = Boolean(
    qrImageUrl && 
    qrImageUrl.trim().length > 10 && 
    !qrImageUrl.includes('api.qrserver.com')
  );

  // Compute QRIS string according to active mode
  const activePayload = React.useMemo(() => {
    if (isDynamicMode && amount && amount > 0) {
      return generateDynamicQris(officialBasePayload, amount);
    }
    return getStaticQris(officialBasePayload);
  }, [isDynamicMode, amount, officialBasePayload]);

  const handleCopyAmount = () => {
    if (amount) {
      navigator.clipboard.writeText(amount.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyMerchant = () => {
    navigator.clipboard.writeText(merchantName);
    setCopiedMerchant(true);
    setTimeout(() => setCopiedMerchant(false), 2000);
  };

  const handleDownloadImage = () => {
    if (onDownload) {
      onDownload();
      return;
    }

    if (hasCustomImage && viewMode === 'FULL_FLYER' && qrImageUrl) {
      const link = document.createElement('a');
      link.href = qrImageUrl;
      link.download = `QRIS_${merchantName.replace(/\s+/g, '_')}_${amount || ''}.png`;
      link.click();
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
        canvas.width = 800;
        canvas.height = 800;
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 40, 40, 720, 720);
          const pngFile = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = `QRIS_BARCODE_${amount || 'DEPOSIT'}.png`;
          downloadLink.href = pngFile;
          downloadLink.click();
        }
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  return (
    <div ref={qrCardRef} className="w-full max-w-sm mx-auto select-none space-y-3">
      {/* View Mode Toggle (Hanya Barcode vs Flyer Lengkap) */}
      <div className="flex items-center justify-between bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => setViewMode('BARCODE_ONLY')}
          className={`flex-1 py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            viewMode === 'BARCODE_ONLY'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Hanya Barcode (Fokus QR)</span>
        </button>
        {hasCustomImage && (
          <button
            type="button"
            onClick={() => setViewMode('FULL_FLYER')}
            className={`flex-1 py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'FULL_FLYER'
                ? 'bg-slate-700 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Flyer Lengkap</span>
          </button>
        )}
      </div>

      {/* Mode Switcher for Dynamic / Static Amount */}
      {viewMode === 'BARCODE_ONLY' && (
        <div className="flex items-center justify-between bg-slate-900/70 p-1.5 rounded-2xl border border-slate-800/80 text-[11px]">
          <button
            type="button"
            onClick={() => setIsDynamicMode(true)}
            className={`flex-1 py-1 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              isDynamicMode
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>Nominal Otomatis</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDynamicMode(false)}
            className={`flex-1 py-1 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              !isDynamicMode
                ? 'bg-slate-700 text-amber-400 shadow-sm font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-3 h-3" />
            <span>Nominal Bebas/Manual</span>
          </button>
        </div>
      )}

      {/* Pure Barcode QR Container */}
      <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 text-slate-900 text-center flex flex-col items-center justify-center relative overflow-hidden">
        {/* Top Header Badge */}
        <div className="w-full flex items-center justify-between mb-3 px-1 border-b border-slate-100 pb-2">
          <div className="text-left">
            <span className="text-[10px] font-black text-slate-400 block tracking-wider uppercase">Merchant Resmi:</span>
            <span className="text-xs font-black text-slate-900 block truncate max-w-[200px]">{merchantName}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-bold">NMID: {nmid}</span>
        </div>

        <div className="p-3 bg-white rounded-2xl border-2 border-slate-900/10 flex items-center justify-center shadow-inner max-w-full">
          {viewMode === 'FULL_FLYER' && hasCustomImage && qrImageUrl ? (
            <img
              src={qrImageUrl}
              alt={merchantName}
              className="w-60 h-60 max-w-full object-contain rounded-lg"
            />
          ) : (
            <div className="p-2 bg-white rounded-xl">
              <QRCodeSVG
                value={activePayload}
                size={240}
                level="M"
                includeMargin={true}
                className="w-56 h-56 max-w-full rounded-lg"
              />
            </div>
          )}
        </div>

        <p className="text-[10px] text-slate-500 mt-2 font-medium">
          {viewMode === 'FULL_FLYER'
            ? '✓ Scan gambar QRIS merchant resmi di atas menggunakan m-Banking / E-Wallet Anda'
            : isDynamicMode
            ? '✓ Scan Barcode QR di atas via BCA, Mandiri, BRI, DANA, GoPay, OVO (Nominal otomatis terisi)'
            : '✓ Scan Barcode QR di atas lalu masukkan nominal transfer secara manual'}
        </p>
      </div>

      {/* Amount & Actions */}
      {showAmount && amount && (
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-2.5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Nominal Transfer
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
            <button
              type="button"
              onClick={handleCopyMerchant}
              className="hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              {copiedMerchant ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Salin Nama Merchant</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadImage}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Simpan Barcode QR</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

