import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  Plus,
  Calendar,
  Filter,
  CheckCircle,
  RefreshCw,
  BarChart2,
  Share2,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const ReportGeneratorView: React.FC = () => {
  const { token } = useAuthStore();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('REVENUE');
  const [rangeType, setRangeType] = useState('MONTHLY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          category,
          rangeType,
          startDate,
          endDate,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowGenerateModal(false);
        setTitle('');
        fetchReports();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportCSV = (report: any) => {
    const csvRows = [
      ['ID Laporan', report.id],
      ['Judul', report.title],
      ['Kategori', report.category],
      ['Rentang', report.rangeType],
      ['Tanggal Dibuat', new Date(report.createdAt).toLocaleString('id-ID')],
      ['Total Volume (IDR)', report.summary?.totalVolume],
      ['Total Transaksi', report.summary?.totalTransactions],
      ['Tingkat Keberhasilan (%)', report.summary?.successRate],
      ['Pertumbuhan Bersih (%)', report.summary?.netGrowth],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${report.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = (report: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${report.title}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #1e293b; }
            h1 { color: #0f766e; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; }
            th { background-color: #f1f5f9; }
          </style>
        </head>
        <body>
          <h1>NEXA CAPITAL - REPORTING MODULE</h1>
          <h2>${report.title}</h2>
          <p><strong>Kategori:</strong> ${report.category} | <strong>Periode:</strong> ${report.rangeType}</p>
          <p><strong>Tanggal Dibuat:</strong> ${new Date(report.createdAt).toLocaleString('id-ID')}</p>
          <hr />
          <h3>RINGKASAN EKSEKUTIF</h3>
          <table>
            <tr><th>Metrik</th><th>Nilai</th></tr>
            <tr><td>Total Volume</td><td>Rp ${new Intl.NumberFormat('id-ID').format(report.summary?.totalVolume || 0)}</td></tr>
            <tr><td>Total Transaksi</td><td>${report.summary?.totalTransactions} Transaksi</td></tr>
            <tr><td>Tingkat Keberhasilan</td><td>${report.summary?.successRate}%</td></tr>
            <tr><td>Pertumbuhan Bersih</td><td>${report.summary?.netGrowth}%</td></tr>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Executive Report Generator</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Modul Laporan & Eksportir Data</h2>
          <p className="text-slate-500 text-sm mt-1">
            Buat laporan resmi keuangan, transaksi, dan performa investasi dalam format PDF, CSV, atau Excel.
          </p>
        </div>

        <button
          onClick={() => setShowGenerateModal(true)}
          className="px-5 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-teal-500/20 transition-all hover:scale-105 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Laporan Baru</span>
        </button>
      </div>

      {/* Reports List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-teal-500" />
            <span>Daftar Laporan Tersimpan</span>
          </h3>
          <button onClick={fetchReports} className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline flex items-center space-x-1">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Memuat data laporan...</div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Belum ada laporan yang dibuat. Klik "Buat Laporan Baru" di atas.</div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                      {report.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {report.rangeType}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{report.title}</h4>
                  <p className="text-xs text-slate-500">
                    Dibuat oleh: <span className="font-semibold text-slate-700 dark:text-slate-300">{report.generatedBy}</span> •{' '}
                    {new Date(report.createdAt).toLocaleString('id-ID')}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-400">
                    <div>
                      Volume: <span className="font-bold text-slate-900 dark:text-white">{formatIDR(report.summary?.totalVolume || 0)}</span>
                    </div>
                    <div>
                      Transaksi: <span className="font-bold text-slate-900 dark:text-white">{report.summary?.totalTransactions}</span>
                    </div>
                    <div>
                      Success: <span className="font-bold text-emerald-600">{report.summary?.successRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => exportCSV(report)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all flex items-center space-x-1.5"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>CSV / Excel</span>
                  </button>

                  <button
                    onClick={() => printReport(report)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 text-teal-600 dark:text-teal-400 text-xs font-bold transition-all flex items-center space-x-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak / PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-teal-500" />
                <span>Buat Laporan Baru</span>
              </h3>
              <button onClick={() => setShowGenerateModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Judul Laporan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Laporan Pendapatan Q3 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-teal-500"
                  >
                    <option value="REVENUE">Pendapatan (Revenue)</option>
                    <option value="INVESTMENT">Investasi (Investment)</option>
                    <option value="WALLET">Wallet & Saldo</option>
                    <option value="TRANSACTION">Transaksi</option>
                    <option value="REFERRAL">Program Referral</option>
                    <option value="REWARD">Bonus & Rewards</option>
                    <option value="USER">Aktivitas Pengguna</option>
                    <option value="SYSTEM">Status Sistem</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Rentang Waktu</label>
                  <select
                    value={rangeType}
                    onChange={(e) => setRangeType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-teal-500"
                  >
                    <option value="DAILY">Harian (Daily)</option>
                    <option value="WEEKLY">Mingguan (Weekly)</option>
                    <option value="MONTHLY">Bulanan (Monthly)</option>
                    <option value="QUARTERLY">Kuartalan (Quarterly)</option>
                    <option value="YEARLY">Tahunan (Yearly)</option>
                    <option value="CUSTOM">Rentang Custom</option>
                  </select>
                </div>
              </div>

              {rangeType === 'CUSTOM' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tanggal Mulai</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tanggal Selesai</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-bold text-sm shadow-md hover:from-teal-500 hover:to-emerald-500 transition-all flex items-center space-x-2"
                >
                  {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  <span>Proses Laporan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
