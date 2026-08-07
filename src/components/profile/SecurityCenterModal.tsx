import React, { useEffect } from 'react';
import { Shield, Laptop, Smartphone, LogOut, ShieldAlert, History, X, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useApp } from '../../context/AppContext';

interface SecurityCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityCenterModal: React.FC<SecurityCenterModalProps> = ({ isOpen, onClose }) => {
  const { activeSessions, securityLogs, fetchSessions, fetchSecurityLogs, revokeSession } = useAuthStore();
  const { addNotification } = useApp();

  useEffect(() => {
    if (isOpen) {
      fetchSessions();
      fetchSecurityLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRevokeOtherSessions = async () => {
    await revokeSession(undefined, true);
    addNotification('Semua sesi perangkat lain berhasil dikeluarkannya.', 'success');
  };

  const handleRevokeSingle = async (sessionId: string) => {
    await revokeSession(sessionId, false);
    addNotification('Sesi perangkat berhasil dihentikan.', 'info');
  };

  const failedAttempts = securityLogs.filter((l) => l.status === 'FAILED').length;
  const hasSuspiciousActivity = failedAttempts >= 3;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Pusat Keamanan & Perangkat</h3>
              <p className="text-xs text-slate-400">Kelola sesi aktif, periksa riwayat masuk, dan proteksi akun</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Suspicious Activity Warning Banner */}
        {hasSuspiciousActivity && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-200">Deteksi Aktivitas Mencurigakan</p>
              <p className="text-slate-300 mt-1">
                Sistem mencatat {failedAttempts} kali percobaan masuk yang gagal. Jika Anda merasa tidak melakukannya, disarankan untuk segera mengubah kata sandi dan mengakhiri semua sesi aktif di bawah.
              </p>
            </div>
          </div>
        )}

        {/* ACTIVE SESSIONS SECTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Laptop className="w-4 h-4 text-sky-400" />
              <span>Sesi & Perangkat Terhubung ({activeSessions.length})</span>
            </h4>

            {activeSessions.length > 1 && (
              <button
                onClick={handleRevokeOtherSessions}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-all flex items-center space-x-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluarkan Semua Perangkat Lain</span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            {activeSessions.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500">
                Sesi perangkat saat ini terautentikasi aman via JWT Token Enkripsi.
              </div>
            ) : (
              activeSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
                      {session.userAgent.includes('Mobile') ? (
                        <Smartphone className="w-4 h-4 text-sky-400" />
                      ) : (
                        <Laptop className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{session.deviceName}</span>
                        {session.isCurrent && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                            Perangkat Saat Ini
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        IP: {session.ipAddress} • Terakhir Aktif: {new Date(session.lastActiveAt).toLocaleTimeString('id-ID')}
                      </p>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <button
                      onClick={() => handleRevokeSingle(session.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-colors"
                    >
                      Keluarkan
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* LOGIN HISTORY LOGS SECTION */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <History className="w-4 h-4 text-amber-400" />
              <span>Log Riwayat Masuk Terbaru</span>
            </h4>
            <button
              onClick={() => fetchSecurityLogs()}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Perbarui Log"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {securityLogs.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500">
                Belum ada catatan log aktivitas mencurigakan.
              </div>
            ) : (
              securityLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-200">{log.deviceType}</span>
                    <span className="text-slate-500 ml-2">({log.ipAddress})</span>
                    <p className="text-[10px] text-slate-500">{new Date(log.createdAt).toLocaleString('id-ID')}</p>
                  </div>

                  <div>
                    {log.status === 'SUCCESS' ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Berhasil
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        Gagal ({log.failureReason || 'Password Salah'})
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
