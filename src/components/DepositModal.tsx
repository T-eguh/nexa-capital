import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  QrCode,
  Building2,
  Wallet,
  Check,
  Zap,
  Sparkles,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { generateDynamicQris, getQrisQrImageUrl } from '../utils/qrisGenerator';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { platformSettings, requestDeposit, triggerConfetti, addNotification } = useApp();
  const { theme } = useTheme();

  const [selectedAmount, setSelectedAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentType, setPaymentType] = useState<'AUTO_GATEWAY' | 'BANK' | 'EWALLET'>('AUTO_GATEWAY');
  const [autoGatewayMethod, setAutoGatewayMethod] = useState<'QRIS_1' | 'QRIS_2'>('QRIS_1');

  // Auto gateway step state
  const [gatewayStep, setGatewayStep] = useState<'SELECT' | 'PAYMENT_PENDING' | 'PENDING_APPROVAL'>('SELECT');
  const [isProcessingGateway, setIsProcessingGateway] = useState<boolean>(false);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(899); // 14m 59s
  const [createdRefNo, setCreatedRefNo] = useState<string>('');

  // Handle mobile browser/hardware back button so it safely closes modal without restarting the SPA
  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ modal: 'deposit' }, '');

    const handlePopState = () => {
      handleResetModal();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleResetModal();
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    let timer: any;
    if (gatewayStep === 'PAYMENT_PENDING' && countdownSeconds > 0) {
      timer = setInterval(() => {
        setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gatewayStep, countdownSeconds]);

  if (!isOpen) return null;

  const quickAmounts = platformSettings?.depositPresetAmounts?.length
    ? platformSettings.depositPresetAmounts
    : [50000, 100000, 250000, 500000, 1000000, 2500000, 5000000];

  const amountToDeposit = customAmount ? Number(customAmount) : selectedAmount;
  const minDeposit = platformSettings?.minDeposit || 30000;
  const maxDeposit = platformSettings?.maxDeposit || 50000000;

  const handleStartAutoGateway = () => {
    if (amountToDeposit < minDeposit) {
      alert(`Minimal deposit adalah Rp ${minDeposit.toLocaleString('id-ID')}`);
      return;
    }
    if (amountToDeposit > maxDeposit) {
      alert(`Maksimal deposit adalah Rp ${maxDeposit.toLocaleString('id-ID')} per transaksi`);
      return;
    }

    const ref = `NEXA-AUTO-${Date.now().toString().slice(-6)}`;
    setCreatedRefNo(ref);
    setGatewayStep('PAYMENT_PENDING');
    setCountdownSeconds(899);
  };

  const handleSimulatePaymentCallback = () => {
    setIsProcessingGateway(true);

    setTimeout(() => {
      // Create pending deposit request in transactions (Waiting for Admin approval)
      requestDeposit(amountToDeposit, currentQrisName);
      setIsProcessingGateway(false);
      setGatewayStep('PENDING_APPROVAL');
      triggerConfetti();
      addNotification(
        `Pengajuan Deposit Rp ${amountToDeposit.toLocaleString('id-ID')} berhasil dibuat! Menunggu verifikasi admin.`,
        'info'
      );
    }, 1200);
  };

  const handleResetModal = () => {
    setGatewayStep('SELECT');
    setIsProcessingGateway(false);
    onClose();
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQrisRaw = autoGatewayMethod === 'QRIS_1'
    ? '00020101021126570014ID.LINKAJA.WWW01189360091438201948215204581253033605802ID5920NEXA+CAPITAL+QRIS16007JAKARTA61051234062070703A016304'
    : '00020101021126570014ID.LINKAJA.WWW01189360091438201948225204581253033605802ID5920NEXA+CAPITAL+QRIS26007JAKARTA61051234062070703A026304';

  const dynamicQrisCode = generateDynamicQris(currentQrisRaw, amountToDeposit);
  const dynamicQrisImageUrl = getQrisQrImageUrl(dynamicQrisCode);

  const currentQrisImage = autoGatewayMethod === 'QRIS_1'
    ? (platformSettings.qris1ImageUrl?.trim() || dynamicQrisImageUrl)
    : (platformSettings.qris2ImageUrl?.trim() || dynamicQrisImageUrl);

  const currentQrisName = autoGatewayMethod === 'QRIS_1'
    ? platformSettings.qris1Name
    : platformSettings.qris2Name;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 border-t sm:border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-0 sm:my-8 text-slate-900 dark:text-white relative animate-fadeIn max-h-[92vh] sm:max-h-[90vh] overflow-y-auto">
        
        {/* Sticky Mobile Friendly Header */}
        <div className="sticky -top-5 sm:-top-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-20 pb-3 pt-1 -mx-5 sm:-mx-6 px-5 sm:px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleResetModal}
              className="p-2 -ml-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 transition-colors flex items-center justify-center active:scale-95 cursor-pointer"
              title="Kembali"
              aria-label="Kembali"
            >
              <ArrowLeft className="w-5 h-5 text-emerald-500" />
            </button>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-extrabold flex items-center gap-1.5">
                <span>Deposit Saldo 24 Jam</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-black border border-emerald-500/30">
                  QRIS 1 & QRIS 2
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                Layanan deposit 24 jam nonstop via QRIS 1 & QRIS 2
              </p>
            </div>
          </div>

          <button
            onClick={handleResetModal}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/20 text-slate-500 dark:text-slate-400 hover:text-rose-400 transition-all cursor-pointer active:scale-95"
            title="Tutup Menu"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Banner */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-300 flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-400">Info Deposit 24 Jam:</p>
            <p className="text-[11px] text-slate-300 leading-snug">
              Deposit tersedia 24 jam <strong>CUMA SATU JALUR (QRIS 1 & QRIS 2)</strong>. Metode Bank/VA lain sedang <strong>MAINTENANCE SEMENTARA</strong>.
            </p>
          </div>
        </div>

        {/* STEP 1: SELECT AMOUNT & METHOD */}
        {gatewayStep === 'SELECT' && (
          <>
            {/* Amount Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between items-center">
                <span>Pilih Nominal Deposit (Rp)</span>
                <span className="text-[10px] text-emerald-500 font-mono font-extrabold">24 Jam Instan</span>
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                      selectedAmount === amt && !customAmount
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-sm scale-105'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Rp {(amt / 1000).toLocaleString('id-ID')}rb
                  </button>
                ))}
              </div>

              <div className="pt-1">
                <input
                  type="number"
                  placeholder={`Atau masukkan nominal khusus (Min Rp ${minDeposit.toLocaleString('id-ID')})`}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500 transition-colors font-bold"
                />
              </div>
            </div>

            {/* Payment Gateway Category Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Pilih Jalur Deposit
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentType('AUTO_GATEWAY')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                    paymentType === 'AUTO_GATEWAY'
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 font-extrabold shadow-md ring-1 ring-emerald-500/50'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs">QRIS 1 & QRIS 2</span>
                  <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded">AKTIF 24 JAM ⚡</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('BANK')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                    paymentType === 'BANK'
                      ? 'border-rose-500 bg-rose-500/15 text-rose-400 font-extrabold shadow-md'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="text-xs">Transfer Bank</span>
                  <span className="text-[9px] text-rose-400 font-bold bg-rose-500/20 px-1.5 py-0.5 rounded">
                    {platformSettings.bankTransferEnabled ? 'AKTIF' : 'MAINTENANCE'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('EWALLET')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                    paymentType === 'EWALLET'
                      ? 'border-rose-500 bg-rose-500/15 text-rose-400 font-extrabold shadow-md'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                  <span className="text-xs">E-Wallet Direct</span>
                  <span className="text-[9px] text-rose-400 font-bold bg-rose-500/20 px-1.5 py-0.5 rounded">
                    {platformSettings.ewalletDirectEnabled ? 'AKTIF' : 'MAINTENANCE'}
                  </span>
                </button>
              </div>
            </div>

            {/* AUTO GATEWAY QRIS 1 & QRIS 2 SELECTION */}
            {paymentType === 'AUTO_GATEWAY' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Pilih Jalur QRIS 24 Jam:</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">STATUS: ONLINE 24/7 ⚡</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'QRIS_1', label: platformSettings.qris1Name || 'QRIS 1 (Utama 24 Jam)', detail: platformSettings.qris1Detail || 'BCA, DANA, OVO, ShopeePay, Mandiri' },
                    { id: 'QRIS_2', label: platformSettings.qris2Name || 'QRIS 2 (Backup 24 Jam)', detail: platformSettings.qris2Detail || 'Semua Aplikasi e-Wallet & m-Banking' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAutoGatewayMethod(item.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        autoGatewayMethod === item.id
                          ? 'border-emerald-500 bg-emerald-950/60 text-white font-bold ring-1 ring-emerald-500'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-400">{item.label}</span>
                        {autoGatewayMethod === item.id && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1 leading-tight">{item.detail}</span>
                    </button>
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Scan QRIS 1 atau QRIS 2 untuk deposit otomatis 24 jam langsung masuk ke saldo utama!</span>
                </div>
              </div>
            )}

            {/* MAINTENANCE NOTICE OR BANK ACCOUNTS */}
            {paymentType === 'BANK' && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-rose-500/30 text-xs text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-sm">Metode Bank Lain Sedang Maintenance</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {platformSettings.bankMaintenanceMessage ||
                    'Jalur Transfer Rekening Bank saat ini sedang MAINTENANCE SEMENTARA. Silakan gunakan jalur QRIS 1 atau QRIS 2 yang siap melayani deposit 24 jam nonstop.'}
                </p>
                <button
                  type="button"
                  onClick={() => setPaymentType('AUTO_GATEWAY')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md"
                >
                  Gunakan Jalur QRIS 1 & QRIS 2 (24 Jam)
                </button>
              </div>
            )}

            {/* MAINTENANCE NOTICE OR EWALLET DIRECT */}
            {paymentType === 'EWALLET' && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-rose-500/30 text-xs text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-sm">Metode E-Wallet Direct Sedang Maintenance</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {platformSettings.ewalletMaintenanceMessage ||
                    'Jalur Transfer E-Wallet langsung saat ini sedang MAINTENANCE SEMENTARA. Silakan scan melalui QRIS 1 atau QRIS 2 menggunakan aplikasi DANA, GoPay, OVO, ShopeePay Anda (Aktif 24 jam).'}
                </p>
                <button
                  type="button"
                  onClick={() => setPaymentType('AUTO_GATEWAY')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md"
                >
                  Gunakan Jalur QRIS 1 & QRIS 2 (24 Jam)
                </button>
              </div>
            )}

            {/* SUBMIT & CANCEL BUTTONS */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (paymentType === 'AUTO_GATEWAY') {
                    handleStartAutoGateway();
                  } else {
                    requestDeposit(amountToDeposit, paymentType === 'BANK' ? 'Transfer Bank' : 'E-Wallet Transfer');
                    addNotification(`Permintaan deposit Rp ${amountToDeposit.toLocaleString('id-ID')} berhasil dibuat! Menunggu verifikasi admin.`, 'info');
                    handleResetModal();
                  }
                }}
                className="w-full py-3.5 rounded-2xl font-black text-xs text-slate-950 shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current text-slate-950" />
                <span>LANJUTKAN DEPOSIT OTOMATIS RP {amountToDeposit.toLocaleString('id-ID')}</span>
              </button>

              <button
                type="button"
                onClick={handleResetModal}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all text-center cursor-pointer"
              >
                Batal & Kembali ke Menu Utama
              </button>
            </div>
          </>
        )}

        {/* STEP 2: SIMULATED INSTANT PAYMENT GATEWAY INTERACTION */}
        {gatewayStep === 'PAYMENT_PENDING' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono text-slate-400">Ref: {createdRefNo}</span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-[11px] font-extrabold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  <span>Sisa Waktu: {formatCountdown(countdownSeconds)}</span>
                </span>
              </div>

              {/* QR Code Dynamic Box */}
              <div className="space-y-2">
                <span className="text-xs text-slate-300 block font-bold">
                  Scan Barcode {currentQrisName}:
                </span>
                <div className="w-48 h-48 bg-white p-2 rounded-2xl mx-auto flex items-center justify-center shadow-lg border border-slate-700">
                  <img
                    src={currentQrisImage}
                    alt={currentQrisName}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[10px] text-emerald-400 font-bold block">
                  Support BCA, Mandiri, BRI, BNI, DANA, OVO, GoPay, ShopeePay & Semua Bank
                </span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl text-left text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Pembayaran:</span>
                  <span className="font-black text-emerald-400">Rp {amountToDeposit.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Jalur Terpilih:</span>
                  <span className="text-slate-300 font-bold">{currentQrisName}</span>
                </div>
              </div>
            </div>

            {/* ACTION TO TEST AUTOMATIC CALLBACK */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={isProcessingGateway}
                onClick={handleSimulatePaymentCallback}
                className="w-full py-3.5 rounded-2xl font-black text-xs text-slate-950 shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 cursor-pointer"
              >
                {isProcessingGateway ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Mendeteksi Pembayaran Gateway...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current text-slate-950" />
                    <span>KONFIRMASI SUDAH BAYAR / CEK STATUS</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setGatewayStep('SELECT')}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Kembali & Ubah Metode
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PENDING APPROVAL STATE */}
        {gatewayStep === 'PENDING_APPROVAL' && (
          <div className="py-6 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
              <Clock className="w-9 h-9 animate-pulse" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Deposit Sedang Diproses</h3>
              <p className="text-xs text-slate-400 mt-1">
                Pengajuan deposit sebesar <strong className="text-amber-400 font-black">Rp {amountToDeposit.toLocaleString('id-ID')}</strong> telah masuk ke sistem verifikasi admin. Saldo akan otomatis bertambah setelah disetujui.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Nomor Referensi:</span>
                <span className="font-bold text-white">{createdRefNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Metode:</span>
                <span>{currentQrisName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status Permintaan:</span>
                <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  MENUNGGU VERIFIKASI ADMIN
                </span>
              </div>
            </div>

            <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl text-left text-xs text-blue-200">
              💡 <strong>Tips:</strong> Anda dapat memeriksa riwayat transaksi atau menghubungi CS di Telegram jika verifikasi belum masuk lebih dari 5 menit.
            </div>

            <button
              type="button"
              onClick={handleResetModal}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              TUTUP & CEK RIWAYAT
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
