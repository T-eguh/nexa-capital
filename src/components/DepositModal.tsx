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
  Copy,
  Download,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { generateDynamicQris, getQrisQrImageUrl } from '../utils/qrisGenerator';
import { OfficialQrisCard } from './OfficialQrisCard';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { platformSettings, requestDeposit, depositSuccessInstant, user, isAdminMode, triggerConfetti, addNotification } = useApp();
  const { theme } = useTheme();

  const [selectedAmount, setSelectedAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentType, setPaymentType] = useState<'AUTO_GATEWAY' | 'BANK' | 'EWALLET'>('AUTO_GATEWAY');

  // Sender details & proof for real verification
  const [senderName, setSenderName] = useState<string>('');
  const [senderBank, setSenderBank] = useState<string>('DANA');
  const [proofImage, setProofImage] = useState<string>('');

  // Auto gateway step state
  const [gatewayStep, setGatewayStep] = useState<'SELECT' | 'PAYMENT_PENDING' | 'PAYMENT_SUCCESS' | 'PENDING_APPROVAL'>('SELECT');
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

    const ref = `NEXA-DEP-${Date.now().toString().slice(-6)}`;
    setCreatedRefNo(ref);
    setGatewayStep('PAYMENT_PENDING');
    setCountdownSeconds(899);
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentQrisRaw = '00020101021126660014ID.LINKAJA.WWW01189360091410265656720215ID10265656729160303UMI51590014ID.LINKAJA.WWW01189360091410265656720215ID10265656729165204581253033605802ID5922CAPITAL CELL, BNDNG KD6007BANDUNG61054011562070703A0163047906';

  const dynamicQrisCode = generateDynamicQris(currentQrisRaw, amountToDeposit);
  const dynamicQrisImageUrl = getQrisQrImageUrl(dynamicQrisCode);

  const currentQrisImage = platformSettings.qris1ImageUrl?.trim() || dynamicQrisImageUrl;
  const currentQrisName = platformSettings.qris1Name || 'CAPITAL CELL, BNDNG KD';

  const currentPaymentMethodName = paymentType === 'BANK'
    ? 'Transfer Bank'
    : paymentType === 'EWALLET'
    ? 'Transfer E-Wallet (DANA)'
    : currentQrisName;

  // Submit real deposit request with proof -> Goes to PENDING approval so balance is NOT credited until admin verifies transfer
  const handleSubmitDepositWithProof = () => {
    if (!proofImage) {
      alert('Wajib upload foto/screenshot bukti transfer yang berhasil dari m-Banking atau E-Wallet Anda sebelum konfirmasi!');
      return;
    }

    setIsProcessingGateway(true);

    setTimeout(() => {
      const details = `${proofImage}#SENDER:${senderName.trim() || user.name} (${senderBank})`;
      requestDeposit(amountToDeposit, currentPaymentMethodName, details);
      setIsProcessingGateway(false);
      setGatewayStep('PENDING_APPROVAL');
    }, 700);
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
                  QRIS 24 JAM
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                Layanan deposit otomatis 24 jam nonstop via QRIS Resmi
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
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-300 flex items-start space-x-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-emerald-400">Deposit Otomatis 24 Jam via QRIS:</p>
            <p className="text-[11px] text-slate-300 leading-snug">
              Mendukung semua aplikasi m-Banking (BCA, Mandiri, BRI, BNI, Permata) & E-Wallet (DANA, GoPay, OVO, ShopeePay, LinkAja).
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
                  <span className="text-xs">QRIS 24 Jam</span>
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

            {/* ACTIVE QRIS SUMMARY BOX */}
            {paymentType === 'AUTO_GATEWAY' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Jalur QRIS Resmi 24 Jam:</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">ONLINE 24/7 ⚡</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-emerald-400 block">{currentQrisName}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Semua Bank (BCA, Mandiri, BRI) & E-Wallet (DANA, GoPay, OVO, ShopeePay)</span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <QrCode className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Scan Barcode QRIS untuk deposit 24 jam nonstop langsung diverifikasi!</span>
                </div>
              </div>
            )}

            {/* ACTIVE OR MAINTENANCE BANK ACCOUNTS */}
            {paymentType === 'BANK' && (
              <div className="space-y-3">
                {platformSettings.bankTransferEnabled ? (
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
                    <span className="font-extrabold text-white flex items-center gap-1.5 border-b border-slate-800 pb-2">
                      <Building2 className="w-4 h-4 text-sky-400" />
                      <span>Pilih Rekening Bank Tujuan Transfer:</span>
                    </span>

                    <div className="space-y-2">
                      {(platformSettings.bankAccounts || [
                        { bank: 'BCA', name: 'PT NEXA CAPITAL TRADING', number: '8820-1948-21', color: 'bg-blue-600' },
                        { bank: 'Mandiri', name: 'PT NEXA CAPITAL TRADING', number: '1380-0092-111', color: 'bg-yellow-600' },
                        { bank: 'BRI', name: 'PT NEXA CAPITAL TRADING', number: '0021-0100-222-301', color: 'bg-blue-800' },
                      ]).map((acc, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black text-white ${acc.color || 'bg-slate-700'}`}>
                                {acc.bank}
                              </span>
                              <span className="font-mono font-bold text-white text-xs">{acc.number}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">a.n {acc.name}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(acc.number.replace(/-/g, ''));
                              addNotification(`Nomor rekening ${acc.bank} berhasil disalin!`, 'success');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 border border-slate-700 active:scale-95 cursor-pointer"
                          >
                            <Copy className="w-3 h-3 text-sky-400" />
                            <span>Salin</span>
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-[11px] text-sky-300">
                      💡 Silakan transfer sejumlah <strong>Rp {amountToDeposit.toLocaleString('id-ID')}</strong> ke salah satu rekening di atas, lalu klik tombol lanjutkan untuk upload bukti transfer.
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-950 rounded-2xl border border-rose-500/30 text-xs text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-white text-sm">Metode Bank Sedang Maintenance</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {platformSettings.bankMaintenanceMessage ||
                        'Jalur Transfer Rekening Bank saat ini sedang MAINTENANCE SEMENTARA. Silakan gunakan jalur QRIS yang siap melayani deposit 24 jam nonstop.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setPaymentType('AUTO_GATEWAY')}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md"
                    >
                      Gunakan Jalur QRIS (24 Jam)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ACTIVE OR MAINTENANCE EWALLET DIRECT */}
            {paymentType === 'EWALLET' && (
              <div className="space-y-3">
                {platformSettings.ewalletDirectEnabled ? (
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
                    <span className="font-extrabold text-white flex items-center gap-1.5 border-b border-slate-800 pb-2">
                      <Wallet className="w-4 h-4 text-emerald-400" />
                      <span>Transfer Langsung E-Wallet (DANA / GoPay / OVO):</span>
                    </span>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black text-white bg-emerald-600">
                            DANA / E-WALLET
                          </span>
                          <span className="font-mono font-bold text-white text-xs">{platformSettings.ewalletNumber || '0812-9876-5432'}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">a.n {platformSettings.ewalletHolder || 'NEXA OFFICIAL TREASURY'}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText((platformSettings.ewalletNumber || '081298765432').replace(/[- ]/g, ''));
                          addNotification('Nomor E-Wallet berhasil disalin!', 'success');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 border border-slate-700 active:scale-95 cursor-pointer"
                      >
                        <Copy className="w-3 h-3 text-emerald-400" />
                        <span>Salin No. HP</span>
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                      💡 Buka aplikasi DANA / GoPay Anda, transfer <strong>Rp {amountToDeposit.toLocaleString('id-ID')}</strong> ke nomor di atas, lalu lanjutkan untuk mengirim foto struk bukti transfer.
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-950 rounded-2xl border border-rose-500/30 text-xs text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-white text-sm">Metode E-Wallet Direct Sedang Maintenance</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {platformSettings.ewalletMaintenanceMessage ||
                        'Jalur Transfer E-Wallet langsung saat ini sedang MAINTENANCE SEMENTARA. Silakan scan melalui QRIS menggunakan aplikasi DANA, GoPay, OVO, ShopeePay Anda (Aktif 24 jam).'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setPaymentType('AUTO_GATEWAY')}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md"
                    >
                      Gunakan Jalur QRIS (24 Jam)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SUBMIT & CANCEL BUTTONS */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleStartAutoGateway}
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

        {/* STEP 2: PAYMENT GATEWAY INTERACTION & PROOF SUBMISSION */}
        {gatewayStep === 'PAYMENT_PENDING' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Header Status & Countdown */}
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Kode Transaksi:</span>
                <span className="text-xs font-mono font-bold text-white">{createdRefNo}</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-[11px] font-extrabold flex items-center gap-1.5 border border-amber-500/30">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>Batas Waktu: {formatCountdown(countdownSeconds)}</span>
              </div>
            </div>

            {/* Method Specific Display */}
            {paymentType === 'AUTO_GATEWAY' ? (
              <OfficialQrisCard
                amount={amountToDeposit}
                qrImageUrl={currentQrisImage}
                merchantName={currentQrisName}
                nmid={platformSettings.qris1Detail?.includes('NMID') ? platformSettings.qris1Detail : 'ID1026565672916'}
              />
            ) : paymentType === 'BANK' ? (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <span className="font-extrabold text-white flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <Building2 className="w-4 h-4 text-sky-400" />
                  <span>Transfer ke Rekening Bank Resmi:</span>
                </span>

                <div className="space-y-2">
                  {(platformSettings.bankAccounts || [
                    { bank: 'BCA', name: 'PT NEXA CAPITAL TRADING', number: '8820-1948-21', color: 'bg-blue-600' },
                    { bank: 'Mandiri', name: 'PT NEXA CAPITAL TRADING', number: '1380-0092-111', color: 'bg-yellow-600' },
                    { bank: 'BRI', name: 'PT NEXA CAPITAL TRADING', number: '0021-0100-222-301', color: 'bg-blue-800' },
                  ]).map((acc, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black text-white ${acc.color || 'bg-slate-700'}`}>
                            {acc.bank}
                          </span>
                          <span className="font-mono font-bold text-white text-xs">{acc.number}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">a.n {acc.name}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(acc.number.replace(/-/g, ''));
                          addNotification(`Nomor rekening ${acc.bank} berhasil disalin!`, 'success');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 border border-slate-700 active:scale-95 cursor-pointer"
                      >
                        <Copy className="w-3 h-3 text-sky-400" />
                        <span>Salin</span>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-sky-500/10 border border-sky-500/30">
                  <span className="text-slate-400 font-bold">Nominal Transfer:</span>
                  <span className="text-base font-black text-sky-400 font-mono">Rp {amountToDeposit.toLocaleString('id-ID')}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <span className="font-extrabold text-white flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span>Transfer ke Nomor DANA / E-Wallet Resmi:</span>
                </span>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black text-white bg-emerald-600">
                        DANA
                      </span>
                      <span className="font-mono font-bold text-white text-xs">{platformSettings.ewalletNumber || '0812-9876-5432'}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">a.n {platformSettings.ewalletHolder || 'NEXA OFFICIAL TREASURY'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText((platformSettings.ewalletNumber || '081298765432').replace(/[- ]/g, ''));
                      addNotification('Nomor E-Wallet berhasil disalin!', 'success');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 border border-slate-700 active:scale-95 cursor-pointer"
                  >
                    <Copy className="w-3 h-3 text-emerald-400" />
                    <span>Salin No. HP</span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-slate-400 font-bold">Nominal Transfer:</span>
                  <span className="text-base font-black text-emerald-400 font-mono">Rp {amountToDeposit.toLocaleString('id-ID')}</span>
                </div>
              </div>
            )}

            {/* Form Wajib Foto Bukti Transfer */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <span className="font-extrabold text-white flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Wajib Upload Bukti Pembayaran / Struk Transfer:</span>
              </span>

              <div>
                <label className="text-[11px] text-slate-300 font-bold block mb-1.5">
                  Foto Struk / Screenshot Bukti Transfer: <span className="text-rose-400">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProofUpload}
                  className="w-full text-[11px] text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 file:cursor-pointer cursor-pointer bg-slate-900 p-2 rounded-xl border border-slate-800"
                />
                {proofImage ? (
                  <div className="mt-2.5 flex items-center space-x-3 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-emerald-500/50 shrink-0">
                      <img src={proofImage} alt="Bukti Transfer" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] text-emerald-400 font-bold">
                      ✓ Foto bukti transfer siap dikirim untuk dicek admin
                    </span>
                  </div>
                ) : (
                  <p className="text-[10px] text-rose-400 mt-1">
                    *Foto bukti transfer wajib diunggah agar admin dapat memvalidasi mutasi rekening.
                  </p>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={isProcessingGateway || !proofImage}
                onClick={handleSubmitDepositWithProof}
                className="w-full py-3.5 rounded-2xl font-black text-xs text-slate-950 shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isProcessingGateway ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Mengirim Bukti & Mendaftarkan ke Antrean Admin...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-slate-950" />
                    <span>KIRIM BUKTI TRANSFER & AJUKAN DEPOSIT</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setGatewayStep('SELECT')}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Ganti Jalur / Ubah Nominal
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: INSTANT SUCCESS STATE (ADMIN MODE ONLY) */}
        {gatewayStep === 'PAYMENT_SUCCESS' && (
          <div className="py-4 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black tracking-wider uppercase inline-block mb-1">
                TERVERIFIKASI & AKTIF
              </span>
              <h3 className="text-lg font-black text-white">Deposit Berhasil Masuk!</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Saldo sebesar <strong className="text-emerald-400 font-black">Rp {amountToDeposit.toLocaleString('id-ID')}</strong> telah berhasil dikreditkan ke saldo akun Anda.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-emerald-500/30 text-xs font-mono text-slate-300 text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Nomor Referensi:</span>
                <span className="font-bold text-white">{createdRefNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Metode Pembayaran:</span>
                <span>{currentQrisName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nominal Masuk:</span>
                <span className="text-emerald-400 font-bold">Rp {amountToDeposit.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1.5">
                <span className="text-slate-500">Total Saldo Penarikan:</span>
                <span className="text-white font-black">Rp {user.saldoPenarikan.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetModal}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs rounded-2xl shadow-xl transition-all active:scale-95 cursor-pointer"
            >
              SELESAI & TUTUP
            </button>
          </div>
        )}

        {/* STEP 4: PENDING APPROVAL STATE */}
        {gatewayStep === 'PENDING_APPROVAL' && (
          <div className="py-6 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
              <Clock className="w-9 h-9 animate-pulse" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-black tracking-wider uppercase inline-block mb-1">
                MENUNGGU VERIFIKASI ADMIN
              </span>
              <h3 className="text-lg font-black text-white">Pengajuan Deposit Terkirim!</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                Pengajuan deposit sebesar <strong className="text-amber-400 font-black">Rp {amountToDeposit.toLocaleString('id-ID')}</strong> telah masuk ke antrean verifikasi admin. Saldo Anda akan otomatis bertambah setelah transfer diverifikasi.
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
                <span className="text-slate-500">Nominal:</span>
                <span className="text-amber-400 font-bold">Rp {amountToDeposit.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  MENUNGGU PERSETUJUAN
                </span>
              </div>
            </div>

            <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl text-left text-xs text-blue-200">
              💡 <strong>Petunjuk:</strong> Admin memproses verifikasi deposit dalam 1-5 menit. Anda dapat memantau status secara langsung di menu <strong>Riwayat Transaksi</strong> atau menghubungi CS via Telegram jika butuh bantuan cepat.
            </div>

            <button
              type="button"
              onClick={handleResetModal}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              TUTUP & CEK RIWAYAT TRANSAKSI
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
