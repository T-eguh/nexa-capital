import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
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
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
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

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Harap masukkan Email/Username dan Kata Sandi.');
      return;
    }

    setLoading(true);

    if (isAdmin) {
      // Admin Login
      const adminRes = loginAdmin(identifier, password);
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
        rememberMe,
      });

      if (res.success && res.token) {
        setTokens(res.token, res.refreshToken);
        setUser(res.user);
        setSuccessMsg(res.message);
        addNotification(res.message, 'success');
        triggerConfetti();

        // Also update local AppContext state
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

  const handleGoogleLoginMock = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      loginContext('google_user@nexainvest.id', 'google123');
      setSuccessMsg('Otentikasi Akun Google Berhasil!');
      triggerConfetti();
      setTimeout(() => onSuccess(), 1200);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Alert Banner */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Admin Quick Credentials Hint */}
      {isAdmin && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] space-y-1">
          <p className="font-bold flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Portal Kredensial Khusus Pengelola</span>
          </p>
          <p className="text-slate-400">
            Username Default: <code className="text-amber-200">admin</code> | Pass: <code className="text-amber-200">admin123</code>
          </p>
        </div>
      )}

      {/* Email / Username Field */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1">
          {isAdmin ? 'Username Admin' : 'Email atau Username'} *
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder={isAdmin ? 'admin@nexainvest.id' : 'email@contoh.com atau username'}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
            required
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-bold text-slate-300">Kata Sandi *</label>
          {!isAdmin && (
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-[11px] font-medium text-sky-400 hover:underline"
            >
              Lupa Kata Sandi?
            </button>
          )}
        </div>
        <div className="relative">
          <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
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

      {/* Remember Me */}
      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-slate-800 bg-slate-900 text-sky-500 focus:ring-sky-500"
          />
          <span>Ingat Perangkat Ini</span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-xl font-bold text-xs text-white shadow-lg active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 ${
          isAdmin
            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
            : 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-sky-500/20'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Memverifikasi Akses Enkripsi...</span>
          </>
        ) : (
          <>
            <span>{isAdmin ? 'Masuk Portal Administrator' : 'Masuk ke Akun Anda'}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Google Login Section (for non-admin) */}
      {!isAdmin && (
        <>
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-slate-950 px-2 text-slate-500 font-semibold">Atau Otentikasi Instan</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLoginMock}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Masuk Cepat dengan Akun Google</span>
          </button>

          <p className="text-center text-xs text-slate-400 pt-2">
            Belum memiliki akun Nexa Capital?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-sky-400 font-bold hover:underline"
            >
              Daftar Gratis
            </button>
          </p>
        </>
      )}
    </form>
  );
};
