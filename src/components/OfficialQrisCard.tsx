import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Check, ShieldCheck } from 'lucide-react';
import { OFFICIAL_AUTHENTIC_QRIS_STATIC } from '../utils/qrisGenerator';

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
  const qrCardRef = React.useRef<HTMLDivElement>(null);

  // Exact 100% Valid ASPI Base QRIS payload
  const officialBasePayload = OFFICIAL_AUTHENTIC_QRIS_STATIC;

  // Determine type of QR provided: direct image (URL or base64) vs raw QRIS string
  const isImageSrc = Boolean(
    qrImageUrl &&
    (qrImageUrl.startsWith('data:image') ||
     qrImageUrl.startsWith('http://') ||
     qrImageUrl.startsWith('https://') ||
     qrImageUrl.startsWith('/'))
  );

  const isRawQris = Boolean(qrImageUrl && qrImageUrl.trim().startsWith('000201'));

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

    if (isImageSrc && qrImageUrl) {
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
      {/* Official QRIS Card Container */}
      <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 text-slate-900 text-center flex flex-col items-center justify-center relative overflow-hidden">
        {/* Top Header Badge */}
        <div className="w-full flex items-center justify-between mb-3 px-1 border-b border-slate-100 pb-2">
          <div className="text-left">
            <span className="text-[10px] font-black text-slate-400 block tracking-wider uppercase">MERCHANT RESMI:</span>
            <span className="text-xs font-black text-slate-900 block truncate max-w-[200px]">{merchantName}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-bold">NMID: {nmid}</span>
        </div>

        {/* QR Code Barcode Box */}
        <div className="p-2 bg-white rounded-2xl border border-slate-200 flex items-center justify-center shadow-inner max-w-full">
          {isImageSrc && qrImageUrl ? (
            <div className="w-64 sm:w-72 max-w-full overflow-hidden rounded-xl bg-white flex items-center justify-center">
              <img
                src={qrImageUrl}
                alt={merchantName}
                className="w-full h-auto object-contain rounded-lg max-h-[380px]"
              />
            </div>
          ) : isRawQris && qrImageUrl ? (
            <div className="p-3 bg-white rounded-xl">
              <QRCodeSVG
                value={qrImageUrl}
                size={240}
                level="M"
                includeMargin={true}
                className="w-56 h-56 max-w-full rounded-lg"
              />
            </div>
          ) : (
            <div className="p-3 bg-white rounded-xl">
              <QRCodeSVG
                value={officialBasePayload}
                size={240}
                level="M"
                includeMargin={true}
                className="w-56 h-56 max-w-full rounded-lg"
              />
            </div>
          )}
        </div>

        <p className="text-[10px] text-slate-500 mt-2.5 font-medium flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Scan Barcode QRIS di atas via m-Banking (BCA, Mandiri, BRI) atau E-Wallet (DANA, GoPay, OVO)</span>
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

