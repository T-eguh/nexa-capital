import React, { useState } from 'react';
import {
  FileText,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Zap,
  Users,
  Filter,
  Download,
  Search,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TransactionsHistory: React.FC = () => {
  const { transactions, user, isAdminMode } = useApp();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const relevantTxs = isAdminMode
    ? transactions
    : transactions.filter((t) => t.userId === user.id);

  const filteredTxs = relevantTxs.filter((t) => {
    const matchesType = filterType === 'ALL' || t.type === filterType;
    const matchesSearch =
      t.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.referenceNo && t.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const totalPages = Math.ceil(filteredTxs.length / itemsPerPage) || 1;
  const paginatedTxs = filteredTxs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const exportToCSV = () => {
    const headers = ['ID', 'Type', 'Amount', 'Fee', 'Status', 'Note', 'ReferenceNo', 'Date'];
    const rows = filteredTxs.map((t) => [
      t.id,
      t.type,
      t.amount,
      t.fee || 0,
      t.status,
      `"${t.note.replace(/"/g, '""')}"`,
      t.referenceNo || '',
      t.date,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Transaksi_Nexa_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Header Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Riwayat Transaksi Akun</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Laporan terperinci mengenai deposit, penarikan, pembelian produk, profit harian, dan komisi.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Laporan CSV</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari transaksi, ID, atau kata kunci..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total Transaksi: <strong className="text-slate-900 dark:text-white">{filteredTxs.length}</strong>
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100 dark:border-slate-700/60">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {[
            { id: 'ALL', label: 'Semua' },
            { id: 'DEPOSIT', label: 'Deposit' },
            { id: 'WITHDRAWAL', label: 'Penarikan' },
            { id: 'PRODUCT_PURCHASE', label: 'Pembelian' },
            { id: 'DAILY_PROFIT', label: 'Profit Harian' },
            { id: 'REFERRAL_COMMISSION', label: 'Referral' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setFilterType(item.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                filterType === item.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table Container */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {paginatedTxs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Tidak ada data transaksi yang cocok dengan kriteria pencarian Anda.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {paginatedTxs.map((tx, idx) => {
              const isPlus =
                tx.type === 'DEPOSIT' ||
                tx.type === 'DAILY_PROFIT' ||
                tx.type === 'REFERRAL_COMMISSION' ||
                tx.type === 'TESTIMONIAL_REWARD' ||
                tx.type === 'MATURITY_PAYOUT';

              return (
                <div
                  key={`${tx.id}-${idx}`}
                  className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                        tx.type === 'DEPOSIT'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : tx.type === 'WITHDRAWAL'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : tx.type === 'PRODUCT_PURCHASE'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {tx.type === 'DEPOSIT' && <ArrowDownLeft className="w-5 h-5" />}
                      {tx.type === 'WITHDRAWAL' && <ArrowUpRight className="w-5 h-5" />}
                      {tx.type === 'PRODUCT_PURCHASE' && <TrendingUp className="w-5 h-5" />}
                      {(tx.type === 'DAILY_PROFIT' || tx.type === 'TESTIMONIAL_REWARD' || tx.type === 'MATURITY_PAYOUT') && <Zap className="w-5 h-5" />}
                      {tx.type === 'REFERRAL_COMMISSION' && <Users className="w-5 h-5" />}
                      {tx.type === 'WALLET_TRANSFER' && <ArrowLeftRight className="w-5 h-5" />}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {tx.note}
                      </h4>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                        <span>
                          {new Date(tx.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {tx.referenceNo && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-slate-500 dark:text-slate-400">{tx.referenceNo}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-sm sm:text-base font-extrabold block ${
                        isPlus
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {isPlus ? '+' : '-'}Rp {tx.amount.toLocaleString('id-ID')}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-1 ${
                        tx.status === 'APPROVED' || tx.status === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : tx.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500">
              Halaman {currentPage} dari {totalPages}
            </span>

            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
