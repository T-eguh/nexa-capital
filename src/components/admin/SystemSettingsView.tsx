import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Save,
  RotateCcw,
  Zap,
  CreditCard,
  Building2,
  Clock,
  Users,
  MessageSquare,
  Globe,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  CheckCircle2,
  Plus,
  Trash2,
  Smartphone,
  ExternalLink,
  Volume2,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { BankAccountInfo } from '../../types';

export const SystemSettingsView: React.FC = () => {
  const { platformSettings, updatePlatformSettings, resetPlatformSettings } = useApp();
  const [activeTab, setActiveTab] = useState<'DEPOSIT' | 'WITHDRAW' | 'REFERRAL' | 'COMMUNICATION' | 'BRANDING'>('DEPOSIT');
  const [formData, setFormData] = useState(platformSettings);
  const [isSavedRecently, setIsSavedRecently] = useState(false);
  const qris1InputRef = useRef<HTMLInputElement>(null);
  const qris2InputRef = useRef<HTMLInputElement>(null);

  const handleQrisFileUpload = (field: 'qris1ImageUrl' | 'qris2ImageUrl', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const img = new Image();
        img.onload = () => {
          // Compress using canvas to ensure small size (<60KB) and prevent LocalStorage quota error
          const canvas = document.createElement('canvas');
          const maxDim = 500;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.8);
            handleChange(field, compressed);
          } else {
            handleChange(field, reader.result as string);
          }
        };
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const applyCapitalCellQrisPreset = () => {
    const capitalCellUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=00020101021126660014ID.LINKAJA.WWW01189360091410265656720215ID10265656729160303UMI51590014ID.LINKAJA.WWW01189360091410265656720215ID10265656729165204581253033605802ID5922CAPITAL%20CELL,%20BNDNG%20KD6007BANDUNG61054011562070703A0163047906&margin=8';
    setFormData((prev) => ({
      ...prev,
      qris1Name: 'QRIS 1 (CAPITAL CELL 24 Jam)',
      qris1Detail: 'BCA, DANA, OVO, ShopeePay, Mandiri, BRI & Semua Bank',
      qris1ImageUrl: capitalCellUrl,
      qris1Enabled: true,
      qris2Name: 'QRIS 2 (CAPITAL CELL Backup 24 Jam)',
      qris2Detail: 'Semua Aplikasi E-Wallet & M-Banking Nasional',
      qris2ImageUrl: capitalCellUrl,
      qris2Enabled: true,
    }));
  };

  // Sync if context updates
  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBankChange = (index: number, field: keyof BankAccountInfo, value: string) => {
    const updated = [...formData.bankAccounts];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, bankAccounts: updated }));
  };

  const handleAddBank = () => {
    setFormData((prev) => ({
      ...prev,
      bankAccounts: [
        ...prev.bankAccounts,
        { bank: 'Bank Baru', number: '123-456-7890', name: formData.appName + ' OFFICIAL', color: 'bg-blue-600' },
      ],
    }));
  };

  const handleRemoveBank = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      bankAccounts: prev.bankAccounts.filter((_, i) => i !== index),
    }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updatePlatformSettings(formData);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan seluruh pengaturan sistem ke default awal?')) {
      resetPlatformSettings();
      setFormData(platformSettings);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-white">
              Pusat Pengaturan Dinamis Sistem Platform
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ubah seluruh konfigurasi deposit, QRIS, penarikan, jam operasional, komisi referral, CS Telegram, dan pop-up secara instan tanpa perlu coding.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center space-x-2 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Pengaturan</span>
          </button>
        </div>
      </div>

      {isSavedRecently && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-bold">
            Semua perubahan pengaturan sistem telah BERHASIL DISIMPAN dan langsung aktif di seluruh halaman member!
          </span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950/60 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setActiveTab('DEPOSIT')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
            activeTab === 'DEPOSIT'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Deposit & QRIS</span>
        </button>

        <button
          onClick={() => setActiveTab('WITHDRAW')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
            activeTab === 'WITHDRAW'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Penarikan & Jam Operasional</span>
        </button>

        <button
          onClick={() => setActiveTab('REFERRAL')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
            activeTab === 'REFERRAL'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Komisi Referral</span>
        </button>

        <button
          onClick={() => setActiveTab('COMMUNICATION')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
            activeTab === 'COMMUNICATION'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Pop-Up, Ticker & Kontak CS</span>
        </button>

        <button
          onClick={() => setActiveTab('BRANDING')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
            activeTab === 'BRANDING'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Identitas & Maintenance</span>
        </button>
      </div>

      {/* Tab Content 1: DEPOSIT */}
      {activeTab === 'DEPOSIT' && (
        <div className="space-y-6">
          {/* General Deposit Rules */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Ketentuan & Batas Nominal Deposit</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-200 font-bold block">Deposit 24 Jam Nonstop</span>
                  <span className="text-[11px] text-slate-400">Aktifkan status penerimaan deposit 24 jam</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.deposit24HoursEnabled}
                  onChange={(e) => handleChange('deposit24HoursEnabled', e.target.checked)}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Minimal Deposit (Rp)</label>
                <input
                  type="number"
                  value={formData.minDeposit}
                  onChange={(e) => handleChange('minDeposit', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Maksimal Deposit (Rp)</label>
                <input
                  type="number"
                  value={formData.maxDeposit}
                  onChange={(e) => handleChange('maxDeposit', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Quick Preset Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-xs block">
                  Barcode Resmi Merchant: CAPITAL CELL (NMID: ID1026565672916)
                </span>
                <span className="text-[11px] text-slate-400">
                  Gunakan barcode resmi standar perbankan (BCA, Mandiri, BRI) & e-wallet (DANA, GoPay, OVO).
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={applyCapitalCellQrisPreset}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              ⚡ Terapkan Barcode CAPITAL CELL Otomatis
            </button>
          </div>

          {/* QRIS Single Configuration */}
          <div className="max-w-2xl">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Konfigurasi QRIS Resmi 24 Jam</h3>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <span className="text-[11px] text-slate-300 font-bold">Status Aktif:</span>
                  <input
                    type="checkbox"
                    checked={formData.qris1Enabled}
                    onChange={(e) => handleChange('qris1Enabled', e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </label>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Nama Merchant QRIS</label>
                  <input
                    type="text"
                    value={formData.qris1Name}
                    onChange={(e) => handleChange('qris1Name', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Sub-Keterangan / Bank Didukung</label>
                  <input
                    type="text"
                    value={formData.qris1Detail}
                    onChange={(e) => handleChange('qris1Detail', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-400 font-semibold">Gambar Barcode / Flyer QRIS</label>
                    <span className="text-[10px] text-slate-500">Galeri / Kamera / URL</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <input
                      type="file"
                      ref={qris1InputRef}
                      onChange={(e) => handleQrisFileUpload('qris1ImageUrl', e)}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => qris1InputRef.current?.click()}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-[11px] font-bold flex items-center space-x-1.5 border border-slate-700 cursor-pointer active:scale-95 transition-all"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Upload Gambar QRIS dari HP / Laptop</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Atau tempel URL gambar QRIS..."
                    value={formData.qris1ImageUrl}
                    onChange={(e) => handleChange('qris1ImageUrl', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-[11px] font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2 flex items-center space-x-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <img src={formData.qris1ImageUrl} alt="QRIS Preview" className="w-20 h-20 rounded-xl bg-white p-1 object-contain border border-slate-700 shrink-0" />
                  <div className="text-[11px] text-slate-400">
                    <p className="font-bold text-emerald-400">Preview Tampilan QRIS</p>
                    <p>Member akan otomatis memindai QR ini pada saat deposit QRIS 24 jam.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Transfer & E-Wallet Direct Gateways Maintenance Control */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bank Transfer */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Jalur Transfer Bank Langsung</h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange('bankTransferEnabled', !formData.bankTransferEnabled)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-black transition-all ${
                    formData.bankTransferEnabled
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {formData.bankTransferEnabled ? 'AKTIF' : 'MAINTENANCE (OFF)'}
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Pesan Peringatan Maintenance</label>
                  <textarea
                    rows={2}
                    value={formData.bankMaintenanceMessage}
                    onChange={(e) => handleChange('bankMaintenanceMessage', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300">Daftar Rekening Bank Tujuan:</span>
                    <button
                      type="button"
                      onClick={handleAddBank}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-[10px] font-bold flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Bank</span>
                    </button>
                  </div>

                  {formData.bankAccounts.map((b, i) => (
                    <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Nama Bank"
                          value={b.bank}
                          onChange={(e) => handleBankChange(i, 'bank', e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Nomor Rekening"
                          value={b.number}
                          onChange={(e) => handleBankChange(i, 'number', e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-xs font-mono"
                        />
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            placeholder="Atas Nama"
                            value={b.name}
                            onChange={(e) => handleBankChange(i, 'name', e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-xs w-full"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveBank(i)}
                            className="p-1 text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* E-Wallet Direct */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Jalur E-Wallet Langsung</h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange('ewalletDirectEnabled', !formData.ewalletDirectEnabled)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-black transition-all ${
                    formData.ewalletDirectEnabled
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {formData.ewalletDirectEnabled ? 'AKTIF' : 'MAINTENANCE (OFF)'}
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Pesan Peringatan Maintenance</label>
                  <textarea
                    rows={2}
                    value={formData.ewalletMaintenanceMessage}
                    onChange={(e) => handleChange('ewalletMaintenanceMessage', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Nomor E-Wallet Resmi</label>
                  <input
                    type="text"
                    value={formData.ewalletNumber}
                    onChange={(e) => handleChange('ewalletNumber', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Nama Pemilik Akun E-Wallet</label>
                  <input
                    type="text"
                    value={formData.ewalletHolder}
                    onChange={(e) => handleChange('ewalletHolder', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: WITHDRAW */}
      {activeTab === 'WITHDRAW' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Jam Operasional & Batasan Penarikan Saldo</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Jam Buka Penarikan (Format 24 Jam)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={formData.withdrawalOpenHour}
                    onChange={(e) => handleChange('withdrawalOpenHour', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-slate-400 font-bold">:00 WIB</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Jam Tutup Penarikan (Format 24 Jam)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={formData.withdrawalCloseHour}
                    onChange={(e) => handleChange('withdrawalCloseHour', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-slate-400 font-bold">:00 WIB</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Minimal Penarikan (Rp)</label>
                <input
                  type="number"
                  value={formData.minWithdrawal}
                  onChange={(e) => handleChange('minWithdrawal', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Maksimal Penarikan (Rp)</label>
                <input
                  type="number"
                  value={formData.maxWithdrawal}
                  onChange={(e) => handleChange('maxWithdrawal', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* E-Wallet Withdrawal Channel */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Penarikan via E-Wallet (DANA, OVO, GoPay)</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  AKTIF NORMAL
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Pilihan penarikan utama bagi seluruh member. Member mengisi nomor akun e-wallet mereka dan diproses pada antrean penarikan.
              </p>
            </div>

            {/* Bank Withdrawal Channel */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>Penarikan via Rekening Bank</span>
                </h3>
                <button
                  type="button"
                  onClick={() => handleChange('withdrawalBankEnabled', !formData.withdrawalBankEnabled)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-black transition-all ${
                    formData.withdrawalBankEnabled
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {formData.withdrawalBankEnabled ? 'AKTIF' : 'MAINTENANCE (OFF)'}
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <label className="block text-slate-400 font-semibold">Pesan Peringatan Maintenance Bank</label>
                <textarea
                  rows={2}
                  value={formData.withdrawalBankMaintenanceMessage}
                  onChange={(e) => handleChange('withdrawalBankMaintenanceMessage', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: REFERRAL */}
      {activeTab === 'REFERRAL' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Persentase Komisi Referral 3-Level</span>
            </h3>

            <p className="text-xs text-slate-400">
              Setiap downline membeli paket investasi, bonus komisi di bawah ini akan langsung dihitung dan dikreditkan secara otomatis ke Saldo Penarikan upline.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400">Level 1 (Direct Downline)</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={formData.referralLvl1Pct}
                    onChange={(e) => handleChange('referralLvl1Pct', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm font-black focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-slate-300 font-bold">%</span>
                </div>
                <span className="text-[10px] text-slate-400 block">Default: 32% (misal beli 50k = komisi 16.000)</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-sky-400">Level 2 (Downline Generasi 2)</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={formData.referralLvl2Pct}
                    onChange={(e) => handleChange('referralLvl2Pct', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm font-black focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-slate-300 font-bold">%</span>
                </div>
                <span className="text-[10px] text-slate-400 block">Default: 2% (misal beli 50k = komisi 1.000)</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-purple-400">Level 3 (Downline Generasi 3)</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={formData.referralLvl3Pct}
                    onChange={(e) => handleChange('referralLvl3Pct', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm font-black focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-slate-300 font-bold">%</span>
                </div>
                <span className="text-[10px] text-slate-400 block">Default: 1% (misal beli 50k = komisi 500)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: COMMUNICATION */}
      {activeTab === 'COMMUNICATION' && (
        <div className="space-y-6">
          {/* Pop-up Sambutan Modal Config */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Modal Pop-Up Selamat Datang (Welcome Modal)</h3>
              </div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <span className="text-[11px] text-slate-300 font-bold">Tampilkan Otomatis:</span>
                <input
                  type="checkbox"
                  checked={formData.welcomeModalEnabled}
                  onChange={(e) => handleChange('welcomeModalEnabled', e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Judul Pop-Up</label>
                <input
                  type="text"
                  value={formData.welcomeModalTitle}
                  onChange={(e) => handleChange('welcomeModalTitle', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Teks Keamanan</label>
                <input
                  type="text"
                  value={formData.welcomeSecurityText}
                  onChange={(e) => handleChange('welcomeSecurityText', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-400 mb-1 font-semibold">Deskripsi Sambutan</label>
                <textarea
                  rows={2}
                  value={formData.welcomeModalSubtitle}
                  onChange={(e) => handleChange('welcomeModalSubtitle', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Running Text & CS Contact Links */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>Ticker Pengumuman Berjalan & Tautan Customer Service</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Teks Pengumuman Berjalan (Top Live Ticker)</label>
                <textarea
                  rows={2}
                  value={formData.runningText}
                  onChange={(e) => handleChange('runningText', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Link CS Telegram Resmi (URL Lengkap)</label>
                  <input
                    type="text"
                    value={formData.supportTelegram}
                    onChange={(e) => handleChange('supportTelegram', e.target.value)}
                    placeholder="https://t.me/CSnexacapital"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Link Saluran Telegram Komunitas</label>
                  <input
                    type="text"
                    value={formData.telegramChannel}
                    onChange={(e) => handleChange('telegramChannel', e.target.value)}
                    placeholder="https://t.me/nexacapitalcom"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 5: BRANDING */}
      {activeTab === 'BRANDING' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>Identitas Merek Platform & Mode Pemeliharaan Global</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Nama Brand / Platform</label>
                <input
                  type="text"
                  value={formData.appName}
                  onChange={(e) => handleChange('appName', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Slogan (Tagline)</label>
                <input
                  type="text"
                  value={formData.brandTagline}
                  onChange={(e) => handleChange('brandTagline', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Mode Pemeliharaan (Maintenance Mode)</span>
                  <span className="text-[11px] text-slate-400">Kunci seluruh aplikasi hanya untuk akses administrator.</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange('isMaintenanceMode', !formData.isMaintenanceMode)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                    formData.isMaintenanceMode
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                      : 'bg-slate-950 border border-slate-800 text-slate-400'
                  }`}
                >
                  {formData.isMaintenanceMode ? 'AKTIF (SISTEM DIKUNCI)' : 'NON-AKTIF (NORMAL)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Button on Bottom */}
      <div className="sticky bottom-4 z-40 p-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl flex items-center justify-between shadow-2xl">
        <span className="text-xs text-slate-300">
          Klik tombol <strong>Simpan Perubahan</strong> untuk menerapkan seluruh konfigurasi ke sistem.
        </span>
        <button
          type="button"
          onClick={() => handleSave()}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-transform active:scale-95 flex items-center space-x-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan Sekarang</span>
        </button>
      </div>
    </div>
  );
};
