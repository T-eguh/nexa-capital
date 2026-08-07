import React, { useEffect, useState } from 'react';
import { Cpu, HardDrive, Server, ShieldCheck, Activity, RefreshCw, Radio, CheckCircle, AlertTriangle } from 'lucide-react';

export const SystemMonitoringView: React.FC = () => {
  const [system, setSystem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/system/status');
      const data = await res.json();
      if (data.success) {
        setSystem(data.system);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Memuat status sistem real-time...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 animate-pulse text-emerald-500" />
            <span>Infrastructure Health Monitor</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Status Server & Infrastruktur Real-Time</h2>
          <p className="text-slate-500 text-sm mt-1">
            Pemantauan langsung kesehatan API, koneksi Database PostgreSQL, konsumsi RAM, dan WebSocket Socket.IO.
          </p>
        </div>

        <button
          onClick={fetchStatus}
          className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Segarkan Metric</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">API Status</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{system.apiHealth}</div>
          <p className="text-[11px] text-slate-400">Uptime: {Math.floor(system.uptimeSeconds / 60)} menit</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Database Engine</span>
            <Server className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white truncate">{system.databaseStatus}</div>
          <p className="text-[11px] text-slate-400">Prisma ORM Pool Active</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Penggunaan Memori (Heap)</span>
            <HardDrive className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white">
            {system.memory?.heapUsedMB} MB / {system.memory?.heapTotalMB} MB
          </div>
          <p className="text-[11px] text-slate-400">RAM Bebas: {system.memory?.systemFreeMB} MB</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Socket.IO Connections</span>
            <Radio className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white">{system.socketConnections} Live Sockets</div>
          <p className="text-[11px] text-slate-400">Real-time Broadcast Active</p>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white">Status Queue & Background Workers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
            <span>Antrean Email SMTP:</span>
            <span className="font-bold text-emerald-600">{system.activeQueues?.emailQueue} Pending</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
            <span>Antrean Payment Webhook:</span>
            <span className="font-bold text-emerald-600">{system.activeQueues?.webhookQueue} Pending</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
            <span>Dividend Worker Cron:</span>
            <span className="font-bold text-teal-600">{system.activeQueues?.dividendWorker}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
