import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Wallet,
  Building2,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FinancialLedgerView: React.FC = () => {
  const { authFetch } = useApp();
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterWallet, setFilterWallet] = useState<string>('ALL');

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/payments/ledger');
      if (res.ok) {
        const data = await res.json();
        setLedgerEntries(data.ledger || []);
      }
    } catch (err) {
      console.error('Failed to fetch financial ledger', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const filteredEntries = ledgerEntries.filter((item) => {
    const matchesSearch =
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.referenceNo?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || item.type === filterType;
    const matchesWallet = filterWallet === 'ALL' || item.walletType === filterWallet;
    return matchesSearch && matchesType && matchesWallet;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Reference No', 'Type', 'Wallet', 'Amount', 'Balance Before', 'Balance After', 'Description', 'Date'];
    const rows = filteredEntries.map((item) => [
      item.id,
      item.referenceNo,
      item.type,
      item.walletType,
      item.amount,
      item.balanceBefore,
      item.balanceAfter,
      `"${item.description?.replace(/"/g, '""')}"`,
      new Date(item.createdAt).toLocaleString('id-ID'),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `financial_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Buku Besar Keuangan (Financial Ledger)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Catatan mutasi saldo ganda (Double-Entry Ledger) yang terverifikasi dan aman
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchLedger}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari deskripsi, nomor referensi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Semua Jenis (Debit & Kredit)</option>
            <option value="CREDIT">Kredit (+ Saldo Masuk)</option>
            <option value="DEBIT">Debit (- Saldo Keluar)</option>
          </select>
        </div>

        <div>
          <select
            value={filterWallet}
            onChange={(e) => setFilterWallet(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Semua Tipe Dompet</option>
            <option value="MAIN">Dompet Utama (Main)</option>
            <option value="PROFIT">Dompet Profit (Lockable)</option>
            <option value="REFERRAL">Dompet Referral</option>
            <option value="BONUS">Dompet Bonus</option>
            <option value="CASHBACK">Dompet Cashback</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4">Referensi & Tanggal</th>
                <th className="py-3.5 px-4">Jenis</th>
                <th className="py-3.5 px-4">Dompet</th>
                <th className="py-3.5 px-4">Nominal</th>
                <th className="py-3.5 px-4">Saldo Sebelum</th>
                <th className="py-3.5 px-4">Saldo Sesudah</th>
                <th className="py-3.5 px-4">Deskripsi Mutasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Memuat data buku besar keuangan...
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Belum ada riwayat catatan ledger keuangan.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-slate-900 dark:text-white">{item.referenceNo}</p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.createdAt).toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {item.type === 'CREDIT' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-extrabold text-[10px] inline-flex items-center space-x-1">
                          <ArrowDownLeft className="w-3 h-3" />
                          <span>KREDIT (+)</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 font-extrabold text-[10px] inline-flex items-center space-x-1">
                          <ArrowUpRight className="w-3 h-3" />
                          <span>DEBIT (-)</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                        {item.walletType} WALLET
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold font-mono text-slate-900 dark:text-white">
                      Rp {item.amount?.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                      Rp {item.balanceBefore?.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      Rp {item.balanceAfter?.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                      {item.description}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
