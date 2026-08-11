import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Building2,
  Wallet,
  Check,
  Copy,
  Zap,
  Sparkles,
  ArrowDownLeft,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  CreditCard,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { requestDeposit, topUpUserBalanceAdmin, triggerConfetti, addNotification } = useApp();
  const { theme } = useTheme();

  const [selectedAmount, setSelectedAmount] = useState<number>(250000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentType, setPaymentType] = useState<'AUTO_GATEWAY' | 'QRIS' | 'BANK' | 'EWALLET'>('AUTO_GATEWAY');
  const [autoGatewayMethod, setAutoGatewayMethod] = useState<'QRIS' | 'VA_BCA' | 'VA_MANDIRI' | 'VA_BRI' | 'GOPAY'>('QRIS');
  const [copiedBankAcc, setCopiedBankAcc] = useState<string | null>(null);

  // Auto gateway step state
  const [gatewayStep, setGatewayStep] = useState<'SELECT' | 'PAYMENT_PENDING' | 'SUCCESS'>('SELECT');
  const [isProcessingGateway, setIsProcessingGateway] = useState<boolean>(false);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(899); // 14m 59s
  const [createdRefNo, setCreatedRefNo] = useState<string>('');

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

  const quickAmounts = [50000, 100000, 250000, 500000, 1000000, 2500000, 5000000];
  const amountToDeposit = customAmount ? Number(customAmount) : selectedAmount;

  const bankAccounts = [
    { bank: 'BCA', name: 'PT NEXA CAPITAL TRADING', number: '8820-1948-21', color: 'bg-blue-600' },
    { bank: 'Mandiri', name: 'PT NEXA CAPITAL TRADING', number: '1380-0092-111', color: 'bg-yellow-600' },
    { bank: 'BRI', name: 'PT NEXA CAPITAL TRADING', number: '0021-0100-222-301', color: 'bg-blue-800' },
  ];

  const handleCopyAcc = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedBankAcc(num);
    setTimeout(() => setCopiedBankAcc(null), 2000);
  };

  const handleStartAutoGateway = () => {
    if (amountToDeposit < 30000) {
      alert('Minimal deposit adalah Rp 30.000');
      return;
    }
    if (amountToDeposit > 20000000) {
      alert('Maksimal deposit adalah Rp 20.000.000 per transaksi');
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
      // Execute automatic payment
      topUpUserBalanceAdmin(amountToDeposit);
      setIsProcessingGateway(false);
      setGatewayStep('SUCCESS');
      triggerConfetti();
      addNotification(
        `Pembayaran Otomatis Berhasil! Deposit Rp ${amountToDeposit.toLocaleString('id-ID')} telah ditambahkan ke Saldo Utama Anda.`,
        'success'
      );
    }, 1500);
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 my-8 text-slate-900 dark:text-white relative animate-fadeIn">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-extrabold flex items-center gap-1.5">
                <span>Deposit Saldo</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-black border border-emerald-500/30">
                  OTOMATIS 24/7
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Isi ulang saldo otomatis real-time tanpa jeda
              </p>
            </div>
          </div>
          <button
            onClick={handleResetModal}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: SELECT AMOUNT & METHOD */}
        {gatewayStep === 'SELECT' && (
          <>
            {/* Amount Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between items-center">
                <span>Pilih Nominal Deposit (Rp)</span>
                <span className="text-[10px] text-emerald-500 font-mono font-extrabold">Proses Otomatis</span>
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-extrabold border transition-all ${
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
                  placeholder="Atau masukkan nominal khusus (contoh: 150000)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Payment Gateway Category Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Pilih Metode Pembayaran
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentType('AUTO_GATEWAY')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                    paymentType === 'AUTO_GATEWAY'
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 font-extrabold shadow-md'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Zap className="w-5 h-5 fill-current text-emerald-400" />
                  <span className="text-xs">Gateway Otomatis</span>
                  <span className="text-[9px] text-emerald-500 font-bold">Instan / 1 Detik</span>
                </button>

                <button
                  onClick={() => setPaymentType('BANK')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                    paymentType === 'BANK'
                      ? 'border-blue-500 bg-blue-500/15 text-blue-400 font-extrabold shadow-md'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="text-xs">Transfer Bank</span>
                  <span className="text-[9px] text-slate-500">Manual / QR</span>
                </button>

                <button
                  onClick={() => setPaymentType('EWALLET')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                    paymentType === 'EWALLET'
                      ? 'border-amber-500 bg-amber-500/15 text-amber-400 font-extrabold shadow-md'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                  <span className="text-xs">E-Wallet</span>
                  <span className="text-[9px] text-slate-500">Dana/OVO/GoPay</span>
                </button>
              </div>
            </div>

            {/* AUTO GATEWAY SUBCATEGORY SELECTION */}
            {paymentType === 'AUTO_GATEWAY' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Pilih Channel Payment Gateway Otomatis:</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Status: ACTIVE ⚡</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'QRIS', label: 'QRIS Instant (All Apps)', detail: 'BCA, Dana, OVO, ShopeePay' },
                    { id: 'VA_BCA', label: 'BCA Virtual Account', detail: 'VA Otomatis 24 Jam' },
                    { id: 'VA_MANDIRI', label: 'Mandiri Virtual Account', detail: 'Livin by Mandiri' },
                    { id: 'GOPAY', label: 'GoPay / QRIS Direct', detail: 'Gojek & QRIS Instant' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAutoGatewayMethod(item.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        autoGatewayMethod === item.id
                          ? 'border-emerald-500 bg-emerald-950/60 text-white font-bold'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs">{item.label}</span>
                        {autoGatewayMethod === item.id && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{item.detail}</span>
                    </button>
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Sistem mendeteksi transfer secara otomatis & saldo langsung dikreditkan!</span>
                </div>
              </div>
            )}

            {/* MANUAL BANK ACCOUNTS */}
            {paymentType === 'BANK' && (
              <div className="space-y-2">
                {bankAccounts.map((acc) => (
                  <div
                    key={acc.bank}
                    className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{acc.bank}</span>
                      <p className="text-[11px] font-mono text-slate-600 dark:text-slate-300">{acc.number}</p>
                      <span className="text-[10px] text-slate-400 block">a.n. {acc.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyAcc(acc.number)}
                      className="px-2.5 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center space-x-1"
                    >
                      {copiedBankAcc === acc.number ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedBankAcc === acc.number ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* MANUAL EWALLET */}
            {paymentType === 'EWALLET' && (
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <p className="font-bold text-slate-900 dark:text-white">Nomor E-Wallet Resmi (Dana / OVO / GoPay):</p>
                <div className="font-mono text-sm font-extrabold text-amber-500 bg-white dark:bg-slate-900 p-2.5 rounded-xl flex justify-between items-center border border-slate-200 dark:border-slate-800">
                  <span>0812-9876-5432</span>
                  <button
                    type="button"
                    onClick={() => handleCopyAcc('081298765432')}
                    className="text-xs text-amber-400 font-sans underline"
                  >
                    Salin
                  </button>
                </div>
                <span className="text-[10px] text-slate-400">Atas Nama: NEXA OFFICIAL TREASURY</span>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  if (paymentType === 'AUTO_GATEWAY') {
                    handleStartAutoGateway();
                  } else {
                    topUpUserBalanceAdmin(amountToDeposit);
                    addNotification(`Deposit Rp ${amountToDeposit.toLocaleString('id-ID')} berhasil dibuat.`, 'info');
                    onClose();
                  }
                }}
                className="w-full py-3.5 rounded-2xl font-black text-xs text-slate-950 shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300"
              >
                <Zap className="w-4 h-4 fill-current text-slate-950" />
                <span>LANJUTKAN DEPOSIT OTOMATIS RP {amountToDeposit.toLocaleString('id-ID')}</span>
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

              {/* QR Code or VA Box */}
              {autoGatewayMethod === 'QRIS' || autoGatewayMethod === 'GOPAY' ? (
                <div className="space-y-2">
                  <span className="text-xs text-slate-300 block font-bold">
                    Scan Kode QRIS Otomatis dengan m-Banking / E-Wallet:
                  </span>
                  <div className="w-44 h-44 bg-white p-2 rounded-2xl mx-auto flex items-center justify-center shadow-lg border border-slate-700">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=NEXA_AUTO_PAYMENT_${createdRefNo}`}
                      alt="QRIS Payment Gateway"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-2">
                  <span className="text-xs text-slate-300 block font-bold">
                    Nomor Virtual Account Otomatis ({autoGatewayMethod.replace('VA_', '')}):
                  </span>
                  <div className="p-3 bg-slate-900 border border-emerald-500/40 rounded-xl flex items-center justify-between font-mono font-black text-lg text-emerald-400">
                    <span>8820-9912-{createdRefNo.slice(-4)}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyAcc(`88209912${createdRefNo.slice(-4)}`)}
                      className="text-xs font-sans font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-lg hover:text-white"
                    >
                      {copiedBankAcc ? 'Tersalin!' : 'Salin VA'}
                    </button>
                  </div>
                </div>
              )}

              <div className="p-3 bg-slate-900 rounded-xl text-left text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Pembayaran:</span>
                  <span className="font-black text-emerald-400">Rp {amountToDeposit.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Metode Gateway:</span>
                  <span className="text-slate-300 font-bold">{autoGatewayMethod}</span>
                </div>
              </div>
            </div>

            {/* ACTION TO TEST AUTOMATIC CALLBACK */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={isProcessingGateway}
                onClick={handleSimulatePaymentCallback}
                className="w-full py-3.5 rounded-2xl font-black text-xs text-slate-950 shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50"
              >
                {isProcessingGateway ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Mendeteksi Pembayaran Gateway...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current text-slate-950" />
                    <span>PROSES PEMBAYARAN OTOMATIS (TES INSTAN)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setGatewayStep('SELECT')}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-400 hover:text-white transition-colors"
              >
                Kembali & Ubah Metode
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS STATE */}
        {gatewayStep === 'SUCCESS' && (
          <div className="py-6 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Pembayaran Gateway Berhasil!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Saldo sebesar <strong className="text-emerald-400 font-black">Rp {amountToDeposit.toLocaleString('id-ID')}</strong> telah berhasil dikreditkan ke akun Anda secara otomatis.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Referensi:</span>
                <span>{createdRefNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status Gateway:</span>
                <span className="text-emerald-400 font-bold">SETTLED (SUCCESS)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetModal}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all active:scale-95"
            >
              SELESAI & CEK SALDO
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
