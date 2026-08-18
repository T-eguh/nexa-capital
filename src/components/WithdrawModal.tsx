import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Wallet,
  AlertCircle,
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
  const { user, transactions, requestWithdrawal, platformSettings } = useApp();
  const { theme } = useTheme();

  const currentAvailableBalance = user.saldoPenarikan ?? user.balance;

  const minWithdrawal = platformSettings?.minWithdrawal || 50000;
  const maxWithdrawal = platformSettings?.maxWithdrawal || 10000000;
  const openHour = platformSettings?.withdrawalOpenHour ?? 9;
  const closeHour = platformSettings?.withdrawalCloseHour ?? 17;
  const bankEnabled = platformSettings?.withdrawalBankEnabled ?? false;
  const bankMaintenanceMsg = platformSettings?.withdrawalBankMaintenanceMessage ||
    'Penarikan melalui rekening bank saat ini sedang MAINTENANCE SEMENTARA. Penarikan saat ini HANYA BISA MELALUI E-WALLET (DANA, GoPay, OVO, ShopeePay).';

  const [amount, setAmount] = useState<string>(minWithdrawal.toString());
  const [methodType, setMethodType] = useState<'EWALLET' | 'BANK'>('EWALLET');
  const [bankName, setBankName] = useState<string>('E-Wallet DANA');
  const [accountNumber, setAccountNumber] = useState<string>(
    user.bankAccount?.accountNumber || ''
  );
  const [accountHolder, setAccountHolder] = useState<string>(
    user.bankAccount?.accountHolder || user.name.toUpperCase()
  );
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Handle hardware / browser back button on mobile so it closes modal without refreshing the app
  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ modal: 'withdraw' }, '');

    const handlePopState = () => {
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Check operating hours dynamically
  const now = new Date();
  const currentWibHour = (now.getUTCHours() + 7) % 24;
  const isOperatingHours = currentWibHour >= openHour && currentWibHour < closeHour;

  const todayStr = new Date().toISOString().split('T')[0];
  const hasWithdrawnToday =
    user.lastWithdrawalDate === todayStr ||
    transactions.some(
      (tx) => tx.userId === user.id && tx.type === 'WITHDRAWAL' && tx.date.startsWith(todayStr)
    );

  const numAmount = Number(amount) || 0;

  const ewalletOptions = [
    'E-Wallet DANA',
    'E-Wallet GoPay',
    'E-Wallet OVO',
    'E-Wallet ShopeePay',
  ];

  const handleConfirmWithdraw = () => {
    setErrorMsg('');

    if (methodType === 'BANK' && !bankEnabled) {
      setErrorMsg(bankMaintenanceMsg);
      return;
    }

    if (!isOperatingHours) {
      setErrorMsg(`Penarikan saldo hanya dapat diproses pada jam operasional ${openHour.toString().padStart(2, '0')}:00 - ${closeHour.toString().padStart(2, '0')}:00 WIB.`);
      return;
    }

    if (hasWithdrawnToday) {
      setErrorMsg('penarikan cuman bisa dilakukan sekali dalam sehari, coba lagi di keesokan harinya');
      return;
    }
    if (numAmount < minWithdrawal) {
      setErrorMsg(`Minimal penarikan saldo adalah Rp ${minWithdrawal.toLocaleString('id-ID')}`);
      return;
    }
    if (numAmount > maxWithdrawal) {
      setErrorMsg(`Maksimal penarikan saldo adalah Rp ${maxWithdrawal.toLocaleString('id-ID')} per transaksi`);
      return;
    }
    if (numAmount > currentAvailableBalance) {
      setErrorMsg(`Saldo Penarikan Anda (Rp ${currentAvailableBalance.toLocaleString('id-ID')}) tidak mencukupi.`);
      return;
    }
    if (!accountNumber || !accountHolder) {
      setErrorMsg('Harap lengkapi nomor e-wallet dan nama akun pemegang e-wallet.');
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 border-t sm:border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-0 sm:my-8 max-h-[92vh] sm:max-h-[90vh] overflow-y-auto relative animate-fadeIn">
        
        {/* Sticky Mobile Friendly Header */}
        <div className="sticky -top-5 sm:-top-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-20 pb-3 pt-1 -mx-5 sm:-mx-6 px-5 sm:px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onClose}
              className="p-2 -ml-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 transition-colors flex items-center justify-center active:scale-95 cursor-pointer"
              title="Kembali"
              aria-label="Kembali"
            >
              <ArrowLeft className="w-5 h-5 text-amber-500" />
            </button>
            <div className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black shadow-sm">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Penarikan Saldo</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold border ${
                  isOperatingHours
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                }`}>
                  {isOperatingHours
                    ? `BUKA`
                    : `TUTUP`}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold flex items-center space-x-1">
                <Clock className="w-3 h-3 text-amber-500" />
                <span>Buka {openHour.toString().padStart(2, '0')}:00 - {closeHour.toString().padStart(2, '0')}:00 WIB</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/20 text-slate-500 dark:text-slate-400 hover:text-rose-400 transition-all cursor-pointer active:scale-95"
            title="Tutup Menu"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Operational Hours Banner */}
        {!isOperatingHours && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-400 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div>
              <p className="font-bold text-rose-300">Layanan Penarikan Tutup:</p>
              <p className="text-[11px] text-slate-300">
                Penarikan saldo hanya dapat diproses pada jam operasional <strong>{openHour.toString().padStart(2, '0')}:00 sampai {closeHour.toString().padStart(2, '0')}:00 WIB</strong>. Silakan ajukan penarikan kembali saat jam buka operasional.
              </p>
            </div>
          </div>
        )}

        {/* Current Balance Notice */}
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-900 flex justify-between items-center text-xs">
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
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <span className="text-[10px] text-slate-400 block">Min Rp {minWithdrawal.toLocaleString('id-ID')} • Max Rp {maxWithdrawal.toLocaleString('id-ID')}</span>
        </div>

        {/* Method Type Selector: E-Wallet vs Bank */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Pilih Metode Penarikan
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMethodType('EWALLET');
                setBankName('E-Wallet DANA');
              }}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                methodType === 'EWALLET'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold ring-1 ring-amber-500/50'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-amber-400" />
                <span className="text-xs">E-Wallet</span>
              </div>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-extrabold">AKTIF</span>
            </button>

            <button
              type="button"
              onClick={() => setMethodType('BANK')}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                methodType === 'BANK'
                  ? 'border-rose-500 bg-rose-500/10 text-rose-400 font-bold'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-rose-400" />
                <span className="text-xs">Rekening Bank</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold ${
                bankEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {bankEnabled ? 'AKTIF' : 'MAINTENANCE'}
              </span>
            </button>
          </div>
        </div>

        {/* Destination Details Form */}
        {methodType === 'EWALLET' ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Pilih E-Wallet Tujuan
              </label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                {ewalletOptions.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Nomor Handphone / Akun E-Wallet
              </label>
              <input
                type="text"
                placeholder="Contoh: 081234567890"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Nama Akun Pemegang E-Wallet
              </label>
              <input
                type="text"
                placeholder="Contoh: AHMAD RIZKY"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase font-bold"
              />
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-950 rounded-2xl border border-rose-500/30 text-xs text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">Penarikan via Rekening Bank Maintenance</h4>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {bankMaintenanceMsg}
            </p>
            <button
              type="button"
              onClick={() => {
                setMethodType('EWALLET');
                setBankName('E-Wallet DANA');
              }}
              className="px-4 py-2 bg-amber-400 text-slate-950 font-black text-xs rounded-xl hover:bg-amber-300 transition-all cursor-pointer shadow-md"
            >
              Gunakan Penarikan E-Wallet
            </button>
          </div>
        )}

        <div className="p-3 bg-slate-950 text-white rounded-xl text-xs space-y-1 border border-slate-800">
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

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleConfirmWithdraw}
            className="w-full py-3.5 rounded-xl font-black text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20 active:scale-95 cursor-pointer flex items-center justify-center space-x-2"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Kirim Permintaan Penarikan</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all text-center cursor-pointer"
          >
            Batal & Kembali ke Menu Utama
          </button>
        </div>
      </div>
    </div>
  );
};
