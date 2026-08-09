import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, Tag, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import { useApp } from '../../context/AppContext';

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    phone: '',
    fullName: '',
    password: '',
    referralCode: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { register: registerContext, addNotification, triggerConfetti } = useApp();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validations
    if (!formData.phone.trim() || !formData.fullName.trim() || !formData.password.trim()) {
      setErrorMsg('Harap isi No HP, Nama Lengkap, dan Kata Sandi.');
      return;
    }

    if (formData.phone.trim().length < 8) {
      setErrorMsg('Nomor HP minimal 8 digit.');
      return;
    }

    if (formData.password.trim().length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter.');
      return;
    }

    setLoading(true);

    const cleanPhone = formData.phone.trim().replace(/[^0-9]/g, '');
    const autoUsername = `user_${cleanPhone}`;
    const autoEmail = `${cleanPhone}@nexacapital.id`;

    try {
      // 1. Call real backend API
      const res = await authService.register({
        fullName: formData.fullName.trim(),
        username: autoUsername,
        email: autoEmail,
        phone: formData.phone.trim(),
        password: formData.password,
        confirmPassword: formData.password,
        referralCode: formData.referralCode.trim() || undefined,
        acceptTerms: true,
      });

      if (res.success) {
        setSuccessMsg('Pendaftaran akun berhasil!');
        addNotification('Pendaftaran akun berhasil!', 'success');
        triggerConfetti();

        registerContext({
          name: formData.fullName.trim(),
          email: autoEmail,
          phone: formData.phone.trim(),
          password: formData.password,
          referralCode: formData.referralCode.trim(),
        });

        setTimeout(() => {
          onSuccess();
        }, 1200);
      }
    } catch (err: any) {
      console.warn('Backend API registration unavailable, using fallback context:', err);
      const fallbackRes = registerContext({
        name: formData.fullName.trim(),
        email: autoEmail,
        phone: formData.phone.trim(),
        password: formData.password,
        referralCode: formData.referralCode.trim(),
      });

      if (fallbackRes.success) {
        setSuccessMsg(fallbackRes.message);
        setTimeout(() => {
          onSuccess();
        }, 1200);
      } else {
        setErrorMsg(fallbackRes.message || err.message || 'Gagal mendaftar akun.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Success Alert Banner */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Alert Banner */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. No HP */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1">No HP *</label>
        <div className="relative">
          <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Contoh: 081234567890"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
            required
          />
        </div>
      </div>

      {/* 2. Nama Lengkap */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1">Nama Lengkap *</label>
        <div className="relative">
          <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Sesuai KTP / Rekening"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
            required
          />
        </div>
      </div>

      {/* 3. Kata Sandi */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1">Kata Sandi *</label>
        <div className="relative">
          <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-9 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 4. Kode Referral */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1">
          Kode Referral <span className="text-slate-500 font-normal">(Opsional)</span>
        </label>
        <div className="relative">
          <Tag className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            name="referralCode"
            value={formData.referralCode}
            onChange={handleChange}
            placeholder="Contoh: NX-ADMIN"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-sky-500 uppercase tracking-wide"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Memproses Pendaftaran...</span>
          </>
        ) : (
          <>
            <span>Daftar Akun Nexa Capital</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Switch to login link */}
      <p className="text-center text-xs text-slate-400 pt-2">
        Sudah memiliki akun?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-sky-400 font-bold hover:underline"
        >
          Masuk di Sini
        </button>
      </p>
    </form>
  );
};
