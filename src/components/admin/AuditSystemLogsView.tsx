import React, { useState, useEffect } from 'react';
import { History, ShieldAlert, Terminal, Search } from 'lucide-react';

export const AuditSystemLogsView: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'audit' | 'system'>('audit');

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const resAudit = await fetch('/api/admin/audit-logs', { headers: { Authorization: `Bearer ${token}` } });
      const dataAudit = await resAudit.json();
      if (dataAudit.success) setAuditLogs(dataAudit.auditLogs);

      const resSys = await fetch('/api/admin/system-logs', { headers: { Authorization: `Bearer ${token}` } });
      const dataSys = await resSys.json();
      if (dataSys.success) setSystemLogs(dataSys.systemLogs);
    } catch (err) {
      console.error('Gagal memuat log:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <History className="w-5 h-5 text-amber-400" />
            <span>Audit Trail & Terminal Log Sistem</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Rekam jejak seluruh aktivitas administratif, persetujuan transaksi, dan log eksekusi backend.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'audit' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Trail Admin
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'system' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            System Error / API Log
          </button>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Tanggal & Waktu</th>
                  <th className="p-4">Eksekutor Admin</th>
                  <th className="p-4">Modul</th>
                  <th className="p-4">Tindakan / Operasi</th>
                  <th className="p-4">Rincian Detail</th>
                  <th className="p-4">Alamat IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 text-slate-400">{new Date(log.createdAt).toLocaleString('id-ID')}</td>
                    <td className="p-4 font-bold text-white">{log.userEmail}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {log.module}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-200">{log.action}</td>
                    <td className="p-4 text-slate-300">{log.details}</td>
                    <td className="p-4 font-mono text-slate-500">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3 text-slate-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-500">
            <span className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Nexa Capital Backend System Runtime Stream</span>
            </span>
            <span>Status: Healthy (0 errors)</span>
          </div>

          <div className="space-y-2">
            {systemLogs.map((sys) => (
              <div key={sys.id} className="flex items-start space-x-3 text-[11px]">
                <span className="text-slate-500 shrink-0">[{new Date(sys.createdAt).toLocaleTimeString()}]</span>
                <span className="text-emerald-400 font-bold uppercase shrink-0">[{sys.level}]</span>
                <span className="text-amber-400 font-bold shrink-0">[{sys.source}]</span>
                <span className="text-slate-200">{sys.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
