import React, { useState } from 'react';
import {
  X,
  QrCode,
  Building2,
  Wallet,
  Check,
  Copy,
  Upload,
  Sparkles,
  ArrowDownLeft,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { requestDeposit, topUpUserBalanceAdmin } = useApp();
  const { theme } = useTheme();

  const [selectedAmount, setSelectedAmount] = useState<number>(500000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentType, setPaymentType] = useState<'QRIS' | 'BANK' | 'EWALLET'>('QRIS');
  const [selectedBank, setSelectedBank] = useState<string>('BCA');
  const [copiedBankAcc, setCopiedBankAcc] = useState<string | null>(null);
  const [isInstantDemo, setIsInstantDemo] = useState<boolean>(true);

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

  const handleSubmitDeposit = () => {
    if (amountToDeposit < 50000) {
      alert('Minimal deposit adalah Rp 50.000');
      return;
    }
    if (amountToDeposit > 10000000) {
      alert('Maksimal deposit adalah Rp 10.000.000 per transaksi');
      return;
    }

    if (isInstantDemo) {
      // Instant approval demo mode for ease of testing
      topUpUserBalanceAdmin(amountToDeposit);
    } else {
      const methodLabel =
        paymentType === 'QRIS'
          ? 'QRIS Instant All Payment'
          : paymentType === 'BANK'
          ? `Transfer Bank ${selectedBank}`
          : 'E-Wallet (Dana/OVO/GoPay)';
      requestDeposit(amountToDeposit, methodLabel);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-5 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Deposit Saldo Akun
              </h3>
              <p className="text-[11px] text-slate-400">
                Isi ulang saldo instan untuk membeli produk investasi
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Pilih Nominal Deposit (Rp)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  setSelectedAmount(amt);
                  setCustomAmount('');
                }}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedAmount === amt && !customAmount
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                Rp {(amt / 1000).toLocaleString('id-ID')}rb
              </button>
            ))}
          </div>

          <div className="pt-1">
            <input
              type="number"
              placeholder="Atau masukkan nominal khusus (contoh: 750000)"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Pilih Metode Pembayaran
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPaymentType('QRIS')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                paymentType === 'QRIS'
                  ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-bold'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
              }`}
            >
              <QrCode className="w-5 h-5" />
              <span className="text-xs">QRIS Scan</span>
            </button>

            <button
              onClick={() => setPaymentType('BANK')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                paymentType === 'BANK'
                  ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-bold'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span className="text-xs">Bank Transfer</span>
            </button>

            <button
              onClick={() => setPaymentType('EWALLET')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                paymentType === 'EWALLET'
                  ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-bold'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span className="text-xs">E-Wallet</span>
            </button>
          </div>
        </div>

        {/* Dynamic Payment Details */}
        {paymentType === 'QRIS' && (
          <div className="p-4 bg-slate-900 text-white rounded-xl text-center space-y-3 border border-slate-700">
            <span className="px-2.5 py-0.5 rounded bg-red-600 text-[10px] font-bold tracking-wider uppercase">
              QRIS ALL PAYMENT (BCA, DANA, OVO, GOPAY, SHOPEEPAY)
            </span>
            <div className="w-40 h-40 bg-white p-2 rounded-xl mx-auto flex items-center justify-center shadow-md">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=NEXA_INVEST_DEPOSIT_PAYMENT"
                alt="QRIS Deposit Code"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs text-slate-300">
              Scan QRIS di atas menggunakan aplikasi m-Banking atau E-Wallet pilihan Anda.
            </p>
          </div>
        )}

        {paymentType === 'BANK' && (
          <div className="space-y-2">
            {bankAccounts.map((acc) => (
              <div
                key={acc.bank}
                className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{acc.bank}</span>
                  <p className="text-[11px] font-mono text-slate-600 dark:text-slate-300">{acc.number}</p>
                  <span className="text-[10px] text-slate-400 block">a.n. {acc.name}</span>
                </div>
                <button
                  onClick={() => handleCopyAcc(acc.number)}
                  className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center space-x-1"
                >
                  {copiedBankAcc === acc.number ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedBankAcc === acc.number ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {paymentType === 'EWALLET' && (
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <p className="font-bold text-slate-900 dark:text-white">Nomor E-Wallet Resmi (Dana / OVO / GoPay):</p>
            <div className="font-mono text-sm font-extrabold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 p-2.5 rounded-lg flex justify-between items-center border border-slate-200 dark:border-slate-700">
              <span>0812-9876-5432</span>
              <button
                onClick={() => handleCopyAcc('081298765432')}
                className="text-xs text-blue-600 font-sans underline"
              >
                Salin
              </button>
            </div>
            <span className="text-[10px] text-slate-400">Atas Nama: NEXA OFFICIAL TREASURY</span>
          </div>
        )}

        {/* Demo Mode Toggle */}
        <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 rounded-xl text-xs">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-amber-900 dark:text-amber-200 font-semibold">
              Simulasi Instant Approval (Otomatis Masuk Saldo)
            </span>
          </div>
          <input
            type="checkbox"
            checked={isInstantDemo}
            onChange={(e) => setIsInstantDemo(e.target.checked)}
            className="w-4 h-4 accent-amber-600 cursor-pointer"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            onClick={handleSubmitDeposit}
            className="w-full py-3 rounded-xl font-extrabold text-sm text-white shadow-md transition-all active:scale-95"
            style={{ backgroundColor: theme.primaryColor }}
          >
            KONFIRMASI DEPOSIT RP {amountToDeposit.toLocaleString('id-ID')}
          </button>
        </div>
      </div>
    </div>
  );
};
