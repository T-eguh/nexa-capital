import React, { useState } from 'react';
import {
  X,
  ArrowUpRight,
  Building2,
  Wallet,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const { user, transactions, requestWithdrawal } = useApp();
  const { theme } = useTheme();

  const currentAvailableBalance = user.saldoPenarikan ?? user.balance;

  const [amount, setAmount] = useState<string>('50000');
  const [bankName, setBankName] = useState<string>(
    user.bankAccount?.bankName || 'Bank Central Asia (BCA)'
  );
  const [accountNumber, setAccountNumber] = useState<string>(
    user.bankAccount?.accountNumber || '8820194821'
  );
  const [accountHolder, setAccountHolder] = useState<string>(
    user.bankAccount?.accountHolder || user.name.toUpperCase()
  );
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const hasWithdrawnToday =
    user.lastWithdrawalDate === todayStr ||
    transactions.some(
      (tx) => tx.userId === user.id && tx.type === 'WITHDRAWAL' && tx.date.startsWith(todayStr)
    );

  const numAmount = Number(amount) || 0;

  const bankOptions = [
    'Bank Central Asia (BCA)',
    'Bank Mandiri',
    'Bank Rakyat Indonesia (BRI)',
    'Bank Negara Indonesia (BNI)',
    'E-Wallet DANA',
    'E-Wallet GoPay',
    'E-Wallet OVO',
    'E-Wallet ShopeePay',
  ];

  const handleConfirmWithdraw = () => {
    setErrorMsg('');
    if (hasWithdrawnToday) {
      setErrorMsg('penarikan cuman bisa dilakukan sekali dalam sehari, coba lagi di keesokan harinya');
      return;
    }
    if (numAmount < 50000) {
      setErrorMsg('Minimal penarikan saldo adalah Rp 50.000');
      return;
    }
    if (numAmount > 10000000) {
      setErrorMsg('Maksimal penarikan saldo adalah Rp 10.000.000 per transaksi');
      return;
    }
    if (numAmount > currentAvailableBalance) {
      setErrorMsg(`Saldo Penarikan Anda (Rp ${currentAvailableBalance.toLocaleString('id-ID')}) tidak mencukupi.`);
      return;
    }
    if (!accountNumber || !accountHolder) {
      setErrorMsg('Harap lengkapi nomor rekening dan nama pemilik rekening.');
      return;
    }

    const res = requestWithdrawal(numAmount, {
      bankName,
      accountNumber,
      accountHolder,
    });

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-5 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Penarikan Saldo (Withdrawal)
              </h3>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Batas Penarikan: 1x dalam sehari (Min Rp 50.000 - Max Rp 10.000.000)</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Notice */}
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-200 dark:border-emerald-900 flex justify-between items-center text-xs">
          <span className="text-emerald-800 dark:text-emerald-300 font-bold">Saldo Penarikan Siap Ditarik:</span>
          <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
            Rp {currentAvailableBalance.toLocaleString('id-ID')}
          </span>
        </div>

        {/* Amount Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Nominal Penarikan (Rp)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <span className="text-[10px] text-slate-400 block">Min Rp 50.000 • Max Rp 10.000.000</span>
        </div>

        {/* Destination Bank / E-Wallet Form */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Pilih Bank / E-Wallet Tujuan
            </label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {bankOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Nomor Rekening / E-Wallet
            </label>
            <input
              type="text"
              placeholder="Contoh: 8820194821"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Nama Pemilik Rekening
            </label>
            <input
              type="text"
              placeholder="Contoh: AHMAD RIZKY"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase"
            />
          </div>
        </div>

        <div className="p-3 bg-slate-900 text-white rounded-xl text-xs space-y-1 border border-slate-800">
          <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Konfirmasi Admin Panel:</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Dana akan di proses mohon menunggu 5-10 menit bisa lebih cepat jika tidak terdapat gangguan dari pihak bank
          </p>
        </div>

        {hasWithdrawnToday && !errorMsg && (
          <div className="p-3 bg-amber-500/10 dark:bg-amber-950/60 border border-amber-500/30 rounded-xl text-xs text-amber-600 dark:text-amber-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>penarikan cuman bisa dilakukan sekali dalam sehari, coba lagi di keesokan harinya</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          onClick={handleConfirmWithdraw}
          className="w-full py-3 rounded-xl font-extrabold text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md active:scale-95"
        >
          Kirim permintaaan penarikan
        </button>
      </div>
    </div>
  );
};
