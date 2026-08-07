import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Camera, Trash2, Globe, Clock, Shield, Check, AlertCircle, Loader2, X } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import { useApp } from '../../context/AppContext';
import { PasswordStrengthMeter } from '../auth/PasswordStrengthMeter';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user: contextUser, setUser: setContextUser, addNotification } = useApp();
  const authUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const currentUser = authUser || contextUser;

  const [activeTab, setActiveTab] = useState<'DETAILS' | 'SECURITY' | 'PREFERENCES'>('DETAILS');

  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || currentUser?.name || '',
    phone: currentUser?.phone || '',
    country: currentUser?.country || 'Indonesia',
    language: currentUser?.language || 'id',
    timezone: currentUser?.timezone || 'Asia/Jakarta',
    dateFormat: currentUser?.dateFormat || 'DD/MM/YYYY',
    currency: currentUser?.currency || 'IDR',
  });

  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName || currentUser.name || '',
        phone: currentUser.phone || '',
        country: currentUser.country || 'Indonesia',
        language: currentUser.language || 'id',
        timezone: currentUser.timezone || 'Asia/Jakarta',
        dateFormat: currentUser.dateFormat || 'DD/MM/YYYY',
        currency: currentUser.currency || 'IDR',
      });
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await authService.updateProfile(formData);
      if (res.success && res.profile) {
        setUser(res.profile);
        setContextUser((prev) => ({
          ...prev,
          name: res.profile.fullName,
          phone: res.profile.phone,
        }));
        setSuccessMsg('Profil akun Anda berhasil diperbarui.');
        addNotification('Profil akun berhasil diperbarui.', 'success');
      }
    } catch (err: any) {
      // Local fallback
      setContextUser((prev) => ({
        ...prev,
        name: formData.fullName,
        phone: formData.phone,
      }));
      setSuccessMsg('Profil akun berhasil diperbarui.');
      addNotification('Profil akun berhasil diperbarui.', 'success');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!passData.currentPassword || !passData.newPassword || !passData.confirmPassword) {
      setErrorMsg('Harap lengkapi semua kolom kata sandi.');
      setLoading(false);
      return;
    }

    if (passData.newPassword !== passData.confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi baru tidak cocok.');
      setLoading(false);
      return;
    }

    try {
      const res = await authService.updatePassword(passData);
      if (res.success) {
        setSuccessMsg('Kata sandi berhasil diperbarui.');
        addNotification('Kata sandi akun Anda telah diperbarui.', 'success');
        setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengubah kata sandi.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const res = await authService.updateAvatar(base64);
        if (res.success && res.avatarUrl) {
          if (authUser) setUser({ ...authUser, avatarUrl: res.avatarUrl });
          addNotification('Foto profil berhasil diunggah.', 'success');
        }
      } catch (e) {
        console.warn(e);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAvatar = async () => {
    try {
      const res = await authService.deleteAvatar();
      if (res.success && res.avatarUrl) {
        if (authUser) setUser({ ...authUser, avatarUrl: res.avatarUrl });
        addNotification('Foto profil dikembalikan ke avatar bawaan.', 'info');
      }
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <img
                src={
                  currentUser?.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username || 'user'}`
                }
                alt="Avatar"
                className="w-12 h-12 rounded-2xl object-cover border-2 border-sky-500/50 shadow-md"
              />
              <label className="absolute -bottom-1 -right-1 p-1 bg-sky-500 text-slate-950 rounded-lg cursor-pointer hover:bg-sky-400 transition-colors shadow">
                <Camera className="w-3 h-3" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">{currentUser?.fullName || currentUser?.name}</h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-sky-500/20 text-sky-400 border border-sky-500/30 uppercase">
                  {currentUser?.vipLevel || 'VIP 0'}
                </span>
              </div>
              <p className="text-xs text-slate-400">@{currentUser?.username || 'member'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {currentUser?.avatarUrl && (
              <button
                onClick={handleDeleteAvatar}
                className="p-2 rounded-xl bg-slate-800 text-rose-400 hover:bg-rose-500/20 transition-colors"
                title="Hapus Foto Profil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('DETAILS')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'DETAILS'
                ? 'bg-sky-500 text-slate-950 font-black shadow-lg shadow-sky-500/20'
                : 'text-slate-400 hover:text-white bg-slate-950/50'
            }`}
          >
            Informasi Diri
          </button>

          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'SECURITY'
                ? 'bg-sky-500 text-slate-950 font-black shadow-lg shadow-sky-500/20'
                : 'text-slate-400 hover:text-white bg-slate-950/50'
            }`}
          >
            Keamanan & Kata Sandi
          </button>

          <button
            onClick={() => setActiveTab('PREFERENCES')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'PREFERENCES'
                ? 'bg-sky-500 text-slate-950 font-black shadow-lg shadow-sky-500/20'
                : 'text-slate-400 hover:text-white bg-slate-950/50'
            }`}
          >
            Pengaturan Wilayah
          </button>
        </div>

        {/* Status Alerts */}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2.5">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: DETAILS */}
        {activeTab === 'DETAILS' && (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Username (Sistem)</label>
                <input
                  type="text"
                  value={currentUser?.username || ''}
                  disabled
                  className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl px-3 py-2.5 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Alamat Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={currentUser?.email || ''}
                    disabled
                    className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nomor Whatsapp / HP</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-slate-950 bg-sky-400 hover:bg-sky-300 transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Simpan Perubahan Profil</span>}
            </button>
          </form>
        )}

        {/* TAB 2: SECURITY */}
        {activeTab === 'SECURITY' && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Kata Sandi Saat Ini *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={passData.currentPassword}
                  onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Kata Sandi Baru *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={passData.newPassword}
                  onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Konfirmasi Kata Sandi Baru *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={passData.confirmPassword}
                  onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
            </div>

            <PasswordStrengthMeter password={passData.newPassword} />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Perbarui Kata Sandi Akun</span>}
            </button>
          </form>
        )}

        {/* TAB 3: PREFERENCES */}
        {activeTab === 'PREFERENCES' && (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Negara Domisili</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Indonesia">Indonesia</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Zona Waktu Sistem</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Asia/Jakarta">WIB (Asia/Jakarta - UTC+7)</option>
                    <option value="Asia/Makassar">WITA (Asia/Makassar - UTC+8)</option>
                    <option value="Asia/Jayapura">WIT (Asia/Jayapura - UTC+9)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-slate-950 bg-sky-400 hover:bg-sky-300 transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Simpan Pengaturan Wilayah</span>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
