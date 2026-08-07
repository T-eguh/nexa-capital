import React, { useState, useEffect } from 'react';
import { Settings, Save, ShieldAlert, Globe, Mail, DollarSign } from 'lucide-react';

export const SystemSettingsView: React.FC = () => {
  const [settings, setSettings] = useState<any>({
    appName: 'Nexa Capital Enterprise',
    brandTagline: 'Platform Investment Saham & Dividen Harian Real-Time',
    timezone: 'Asia/Jakarta',
    currency: 'IDR',
    language: 'id',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'notifications@nexainvest.id',
    isMaintenanceMode: false
  });
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch('/api/admin/settings', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setSettings(data.settings);
    } catch (err) {
      console.error('Gagal memuat settings:', err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) alert('Pengaturan sistem berhasil disimpan!');
    } catch (err) {
      console.error('Gagal menyimpan settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <span>Pengaturan Konfigurasi Sistem Platform</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Atur parameter identitas aplikasi, server SMTP email, zona waktu, serta mode pemeliharaan (maintenance mode).
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center space-x-2 shadow-lg shadow-amber-500/20"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Konfigurasi</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* General Identity Settings */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>Identitas & Lokalisasi Platform</span>
          </h3>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Nama Platform / Merek</label>
            <input
              type="text"
              value={settings.appName}
              onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Slogan (Tagline)</label>
            <input
              type="text"
              value={settings.brandTagline}
              onChange={(e) => setSettings({ ...settings, brandTagline: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Zona Waktu Default</label>
              <input
                type="text"
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Mata Uang Default</label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* SMTP & Maintenance Settings */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Server SMTP Email & Mode Pemeliharaan</span>
          </h3>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Host Server SMTP Email</label>
            <input
              type="text"
              value={settings.smtpHost}
              onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Port SMTP</label>
              <input
                type="number"
                value={settings.smtpPort}
                onChange={(e) => setSettings({ ...settings, smtpPort: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Pengirim (SMTP User)</label>
              <input
                type="text"
                value={settings.smtpUser}
                onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Mode Pemeliharaan (Maintenance Mode)</span>
              <span className="text-[10px] text-slate-400">Batasi akses investor hanya untuk admin selama perbaikan.</span>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, isMaintenanceMode: !settings.isMaintenanceMode })}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                settings.isMaintenanceMode
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-950 border border-slate-800 text-slate-400'
              }`}
            >
              {settings.isMaintenanceMode ? 'AKTIF (Sistem Dikunci)' : 'NONAKTIF (Normal)'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
