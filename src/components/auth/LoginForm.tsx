import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import { useApp } from '../../context/AppContext';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
  isAdmin?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
  onForgotPassword,
  isAdmin = false,
}) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { login: loginContext, loginAdmin, addNotification, triggerConfetti } = useApp();
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!phone.trim() || !password.trim()) {
      setErrorMsg('Harap masukkan nomor ponsel dan kata sandi.');
      return;
    }

    if (!acceptTerms) {
      setErrorMsg('Anda harus menyetujui Ketentuan Layanan & Kebijakan Privasi.');
      return;
    }

    setLoading(true);

    // Clean phone number
    const cleanPhone = phone.trim().replace(/^0+/, '').replace(/^\+62/, '');
    const identifier = cleanPhone;

    if (isAdmin) {
      // Admin Login
      const adminRes = loginAdmin(phone, password);
      setLoading(false);
      if (adminRes.success) {
        setSuccessMsg(adminRes.message);
        setTimeout(() => onSuccess(), 1000);
      } else {
        setErrorMsg(adminRes.message);
      }
      return;
    }

    try {
      // Standard User Login via API
      const res = await authService.login({
        identifier,
        password,
        rememberMe: true,
      });

      if (res.success && res.token) {
        setTokens(res.token, res.refreshToken);
        setUser(res.user);
        setSuccessMsg(res.message);
        addNotification(res.message, 'success');
        triggerConfetti();

        loginContext(identifier, password);

        setTimeout(() => {
          onSuccess();
        }, 1200);
      }
    } catch (err: any) {
      console.warn('API login error, using local fallback:', err);
      const fallbackRes = loginContext(identifier, password);
      if (fallbackRes.success) {
        setSuccessMsg(fallbackRes.message);
        setTimeout(() => onSuccess(), 1000);
      } else {
        setErrorMsg(fallbackRes.message || err.message || 'Gagal masuk ke akun Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      {/* Alert Banner */}
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

      {/* Admin Hint if applicable */}
      {isAdmin && (
        <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs space-y-1">
          <p className="font-bold flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Portal Administrator</span>
          </p>
          <p className="text-slate-400">
            Username: <code className="text-amber-300 font-bold">admin</code> | Pass: <code className="text-amber-300 font-bold">admin123</code>
          </p>
        </div>
      )}

      {/* Nomor ponsel */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1.5">
          {isAdmin ? 'Username Admin' : 'Nomor ponsel'}
        </label>
        <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-sm text-white focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all shadow-inner">
          {!isAdmin && (
            <span className="font-bold text-amber-400 pr-3 border-r border-slate-800 mr-3 text-sm flex items-center shrink-0">
              +62
            </span>
          )}
          <input
            type="text"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder={isAdmin ? 'admin' : '8xxxxxxxxx'}
            className="w-full bg-transparent text-sm font-medium text-slate-100 focus:outline-none placeholder:text-slate-600"
            required
          />
        </div>
      </div>

      {/* Kata sandi */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1.5">Kata sandi</label>
        <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-sm text-white focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all shadow-inner">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder="••••••••"
            className="w-full bg-transparent text-sm font-medium text-slate-100 focus:outline-none placeholder:text-slate-600"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-500 hover:text-slate-300 ml-2 shrink-0 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
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
        className="w-full py-3.5 px-4 rounded-2xl font-black text-base text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 mt-2"
      >
        {loading ? (
          <span className="flex items-center justify-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            <span>Memproses...</span>
          </span>
        ) : (
          <span>Login</span>
        )}
      </button>

      {/* Forgot Password Link */}
      <div className="text-center pt-1">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          Lupa kata sandi?
        </button>
      </div>

      {/* Footer Switcher Text */}
      <div className="text-center text-xs text-slate-400 pt-1">
        Belum memiliki akun?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-amber-400 font-bold hover:underline cursor-pointer ml-1"
        >
          Daftar sekarang
        </button>
      </div>
    </form>
  );
};

