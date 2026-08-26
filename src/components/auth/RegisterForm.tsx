import React, { useState, useMemo } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Smartphone } from 'lucide-react';
import { authService } from '../../services/authService';
import { useApp } from '../../context/AppContext';
import { validateIndonesianPhoneNumber } from '../../utils/phoneValidator';

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState(() => {
    let initialRef = '';
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const fromUrl = urlParams.get('ref') || urlParams.get('referral') || urlParams.get('r') || urlParams.get('code') || urlParams.get('invite');
        const fromStorage = localStorage.getItem('pending_referral_code') || localStorage.getItem('nexainvest_pending_referral');
        initialRef = (fromUrl || fromStorage || '').trim().toUpperCase();
      } catch (e) {
        console.warn('Error reading initial referral code:', e);
      }
    }
    return {
      fullName: '',
      phone: '',
      password: '',
      confirmPassword: '',
      referralCode: initialRef,
    };
  });

  const [acceptTerms, setAcceptTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { register: registerContext, addNotification, triggerConfetti } = useApp();

  const phoneValidation = useMemo(() => {
    if (!formData.phone) return null;
    return validateIndonesianPhoneNumber(formData.phone);
  }, [formData.phone]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // For phone, filter only numeric characters
    if (name === 'phone') {
      const sanitized = value.replace(/[^\d+]/g, '');
      setFormData((prev) => ({
        ...prev,
        phone: sanitized,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.password.trim()) {
      setErrorMsg('Harap isi Nama Lengkap, Nomor Ponsel, dan Kata Sandi.');
      return;
    }

    // Strict Phone Number Validation
    const phoneCheck = validateIndonesianPhoneNumber(formData.phone);
    if (!phoneCheck.isValid || !phoneCheck.normalized) {
      setErrorMsg(phoneCheck.message || 'Nomor ponsel tidak valid! Harap gunakan nomor ponsel aktif operator Indonesia.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Kata sandi dan Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (!acceptTerms) {
      setErrorMsg('Anda harus menyetujui Ketentuan Layanan & Kebijakan Privasi.');
      return;
    }

    setLoading(true);

    const cleanPhone = phoneCheck.normalized;
    const autoUsername = `user_${cleanPhone.replace(/^0+/, '')}`;
    const autoEmail = `${cleanPhone.replace(/^0+/, '')}@nexacapital.id`;

    try {
      const res = await authService.register({
        fullName: formData.fullName.trim(),
        username: autoUsername,
        email: autoEmail,
        phone: cleanPhone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
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
          phone: cleanPhone,
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
        phone: cleanPhone,
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
    <form onSubmit={handleSubmit} className="space-y-3.5 text-white">
      {/* Alert Banners */}
      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Nama lengkap */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1">Nama lengkap</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Masukkan nama lengkap"
          className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner font-medium"
          required
        />
      </div>

      {/* 2. Nomor ponsel */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1">Nomor ponsel</label>
        <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-sm text-white focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all shadow-inner">
          <span className="font-bold text-amber-400 pr-3 border-r border-slate-800 mr-3 text-sm flex items-center shrink-0">
            +62
          </span>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="81234567890"
            maxLength={14}
            className="w-full bg-transparent text-sm font-medium text-slate-100 focus:outline-none placeholder:text-slate-600"
            required
          />
        </div>
      </div>

      {/* 3. Kata sandi & Konfirmasi (Side-by-side Grid 2 columns) */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Kata sandi</label>
          <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800 rounded-2xl px-3 py-2.5 text-sm text-white focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all shadow-inner">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
              className="w-full bg-transparent text-xs font-medium text-slate-100 focus:outline-none placeholder:text-slate-600"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-500 hover:text-slate-300 ml-1 shrink-0 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Konfirmasi</label>
          <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800 rounded-2xl px-3 py-2.5 text-sm text-white focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all shadow-inner">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••"
              className="w-full bg-transparent text-xs font-medium text-slate-100 focus:outline-none placeholder:text-slate-600"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-slate-500 hover:text-slate-300 ml-1 shrink-0 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Kode referral (opsional) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <span>Kode referral</span>
            {formData.referralCode ? (
              <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                ✓ Terdeteksi Aktif
              </span>
            ) : (
              <span className="text-slate-500 font-normal">(opsional)</span>
            )}
          </label>
          {formData.referralCode && (
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({ ...prev, referralCode: '' }));
                localStorage.removeItem('pending_referral_code');
                localStorage.removeItem('nexainvest_pending_referral');
              }}
              className="text-[10px] text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
            >
              Hapus Referral
            </button>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            name="referralCode"
            value={formData.referralCode}
            onChange={handleChange}
            placeholder="Contoh: OJQA3T2VNW / NX-XXXX"
            className={`w-full bg-slate-950/80 border rounded-2xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all shadow-inner font-mono font-bold uppercase tracking-wider ${
              formData.referralCode
                ? 'border-emerald-500/60 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 text-emerald-300'
                : 'border-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
            }`}
          />
        </div>
        {formData.referralCode && (
          <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>Akun Anda akan terhubung langsung ke tim pengundang: <strong>{formData.referralCode}</strong></span>
          </p>
        )}
      </div>

      {/* Checkbox Terms */}
      <div className="pt-1">
        <label className="flex items-start space-x-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-amber-500 border-slate-700 bg-slate-950 focus:ring-amber-500 accent-amber-500 shrink-0 cursor-pointer"
          />
          <span className="text-xs text-slate-400 font-medium leading-snug">
            Saya menyetujui{' '}
            <span className="text-amber-400 font-bold hover:underline">Ketentuan Layanan</span> &{' '}
            <span className="text-amber-400 font-bold hover:underline">Kebijakan Privasi</span>
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-4 rounded-2xl font-black text-base text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 mt-3"
      >
        {loading ? (
          <span className="flex items-center justify-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            <span>Memproses...</span>
          </span>
        ) : (
          <span>Daftar</span>
        )}
      </button>

      {/* Footer Switcher Text */}
      <div className="text-center text-xs text-slate-400 pt-1">
        Sudah memiliki akun?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-amber-400 font-bold hover:underline cursor-pointer ml-1"
        >
          Login sekarang
        </button>
      </div>
    </form>
  );
};

