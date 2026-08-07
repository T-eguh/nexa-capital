import React, { useState } from 'react';
import { ArrowLeftRight, CheckCircle, AlertCircle, X, Wallet } from 'lucide-react';
import { apiClient } from '../services/api';
import { useApp } from '../context/AppContext';

interface WalletTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const WalletTransferModal: React.FC<WalletTransferModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, refreshUserData } = useApp();
  const [fromWallet, setFromWallet] = useState<'PROFIT' | 'REFERRAL' | 'BONUS' | 'CASHBACK'>('PROFIT');
  const [toWallet] = useState<'MAIN'>('MAIN');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setErrorMsg('Masukkan nominal transfer yang valid.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/wallet/transfer', {
        fromWallet,
        toWallet,
        amount: numAmount,
        note: note || `Transfer ${fromWallet} ke Saldo Penarikan`,
      });

      if (response.data.success) {
        setSuccessMsg(response.data.message || 'Transfer antar dompet berhasil!');
        setAmount('');
        setNote('');
        if (refreshUserData) refreshUserData();
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
          setSuccessMsg(null);
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal melakukan transfer antar dompet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Transfer Antar Dompet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pindahkan saldo profit/referral ke Saldo Penarikan Utama</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Transfer Dari
            </label>
            <select
              value={fromWallet}
              onChange={(e) => setFromWallet(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PROFIT">Saldo Profit (Rp {(user?.saldoProfit ?? 0).toLocaleString('id-ID')})</option>
              <option value="REFERRAL">Saldo Referral (Rp {(user?.totalReferralCommission ?? 0).toLocaleString('id-ID')})</option>
              <option value="BONUS">Saldo Bonus (Rp 10.000)</option>
              <option value="CASHBACK">Saldo Cashback (Rp 5.000)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Ke Dompet Tujuan
            </label>
            <div className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-between">
              <span>Saldo Penarikan Utama</span>
              <Wallet className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nominal Transfer (Rp)
            </label>
            <input
              type="number"
              placeholder="Contoh: 50000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Catatan / Keterangan (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Penarikan profit harian"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all shadow-md disabled:opacity-50 flex items-center justify-center space-x-2 mt-2"
          >
            {isLoading ? (
              <span>Memproses Transfer...</span>
            ) : (
              <>
                <ArrowLeftRight className="w-4 h-4" />
                <span>Konfirmasi Transfer Sekarang</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
