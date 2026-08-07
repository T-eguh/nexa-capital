import React, { useState, useEffect } from 'react';
import { Download, X, WifiOff, RefreshCw, Smartphone } from 'lucide-react';

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    const handlePwaUpdate = () => setShowUpdate(true);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('pwa-update-available', handlePwaUpdate);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('pwa-update-available', handlePwaUpdate);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('[PWA] User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  return (
    <>
      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-600 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center space-x-2 shadow-md">
          <WifiOff className="w-4 h-4 animate-pulse" />
          <span>Anda sedang dalam mode offline. Fitur terbatas aktif menggunakan data tersimpan.</span>
        </div>
      )}

      {/* Version Update Notification */}
      {showUpdate && (
        <div className="fixed top-4 right-4 z-50 bg-teal-600 text-white p-4 rounded-2xl shadow-2xl max-w-sm flex items-center justify-between space-x-3 border border-teal-400">
          <div className="flex items-center space-x-2 text-xs">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Versi baru Nexa Capital telah tersedia.</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-white text-teal-700 rounded-xl font-bold text-xs hover:bg-slate-100"
          >
            Muat Ulang
          </button>
        </div>
      )}

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-40 max-w-md bg-white dark:bg-slate-900 border border-teal-500/30 rounded-3xl p-4 shadow-2xl flex items-center justify-between space-x-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Install Nexa Capital App</h4>
              <p className="text-xs text-slate-500">Akses cepat, dividen real-time, dan pendaftaran kilat.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-bold text-xs shadow-md hover:scale-105 transition-all flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
