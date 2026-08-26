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
    
    // Download direct high-res canvas from SVG or image
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
      {/* Pure Barcode QR Container Only */}
      <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 text-slate-900 text-center flex flex-col items-center justify-center">
        <div className="p-3.5 bg-white rounded-2xl border-2 border-slate-900/10 flex items-center justify-center shadow-inner">
          <QRCodeSVG
            value={dynamicPayload}
            size={260}
            level="M"
            includeMargin={true}
            className="w-64 h-64 max-w-full rounded-lg"
          />
        </div>
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
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verifikasi Otomatis Aktif</span>
            </span>

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

