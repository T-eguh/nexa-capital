import React, { useState } from 'react';
import { Search, X, TrendingUp, FileText, Bell, ChevronRight, Briefcase } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  setActiveTab,
}) => {
  const { products, userInvestments, transactions, notifications } = useApp();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const cleanQ = query.trim().toLowerCase();

  const matchedProducts = cleanQ
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQ) ||
          p.ticker?.toLowerCase().includes(cleanQ) ||
          p.category?.toLowerCase().includes(cleanQ)
      )
    : [];

  const matchedInvestments = cleanQ
    ? userInvestments.filter(
        (i) =>
          i.productName.toLowerCase().includes(cleanQ) ||
          i.status.toLowerCase().includes(cleanQ)
      )
    : [];

  const matchedTransactions = cleanQ
    ? transactions.filter(
        (t) =>
          t.note.toLowerCase().includes(cleanQ) ||
          t.type.toLowerCase().includes(cleanQ) ||
          t.referenceNo?.toLowerCase().includes(cleanQ)
      )
    : [];

  const matchedNotifications = cleanQ
    ? notifications.filter((n) => n.message.toLowerCase().includes(cleanQ))
    : [];

  const hasResults =
    matchedProducts.length > 0 ||
    matchedInvestments.length > 0 ||
    matchedTransactions.length > 0 ||
    matchedNotifications.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Search Header Input */}
        <div className="relative flex items-center mb-4">
          <Search className="w-5 h-5 text-slate-400 absolute left-4" />
          <input
            type="text"
            autoFocus
            placeholder="Cari produk saham, investasi, transaksi, atau notifikasi..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-12 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 ml-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="max-h-96 overflow-y-auto space-y-4 text-xs pr-1">
          {!cleanQ && (
            <div className="py-8 text-center text-slate-400">
              <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p>Ketik kata kunci untuk mencari di seluruh sistem Nexa Capital</p>
            </div>
          )}

          {cleanQ && !hasResults && (
            <div className="py-8 text-center text-slate-400">
              <p className="font-semibold">Tidak ada hasil pencarian yang cocok dengan "{query}".</p>
            </div>
          )}

          {/* Products Results */}
          {matchedProducts.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2 block">
                Produk Investasi ({matchedProducts.length})
              </span>
              <div className="space-y-1">
                {matchedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setActiveTab('products');
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{p.name}</span>
                        <span className="text-slate-400 text-[10px]">Rp {p.price.toLocaleString('id-ID')} • Daily Profit Rp {p.dailyProfit.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Investments Results */}
          {matchedInvestments.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 block">
                Portofolio Investasi Saya ({matchedInvestments.length})
              </span>
              <div className="space-y-1">
                {matchedInvestments.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => {
                      setActiveTab('portfolio');
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{inv.productName}</span>
                        <span className="text-slate-400 text-[10px]">Status: {inv.status} • Profit: Rp {inv.profitEarned.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions Results */}
          {matchedTransactions.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 block">
                Riwayat Transaksi ({matchedTransactions.length})
              </span>
              <div className="space-y-1">
                {matchedTransactions.map((tx, idx) => (
                  <div
                    key={`${tx.id}-${idx}`}
                    onClick={() => {
                      setActiveTab('history');
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{tx.note}</span>
                        <span className="text-slate-400 text-[10px]">Rp {tx.amount.toLocaleString('id-ID')} • {tx.status}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
