import React, { useState } from 'react';
import { X } from 'lucide-react';
import { RegisterForm } from '../auth/RegisterForm';
import { LoginForm } from '../auth/LoginForm';
import { ForgotPasswordModal } from '../auth/ForgotPasswordModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'LOGIN' | 'REGISTER';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'REGISTER',
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>(initialMode);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
        <div className="relative w-full max-w-sm sm:max-w-md bg-slate-900 border border-slate-800 rounded-[28px] p-6 sm:p-7 shadow-2xl max-h-[95vh] overflow-y-auto text-white">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Title & Subtitle */}
          <div className="pr-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {mode === 'LOGIN' ? 'Login ke akun' : 'Buat akun'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {mode === 'LOGIN'
                ? 'Login untuk mengelola investasi saham & portofolio Anda.'
                : 'Buat akun untuk mulai berinvestasi saham bersama AI.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="bg-slate-950 p-1 rounded-2xl flex border border-slate-800/80 my-4">
            <button
              onClick={() => setMode('LOGIN')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                mode === 'LOGIN'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-400 font-semibold hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('REGISTER')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                mode === 'REGISTER'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-400 font-semibold hover:text-white'
              }`}
            >
              Daftar
            </button>
          </div>

          {/* Form Content */}
          <div>
            {mode === 'REGISTER' && (
              <RegisterForm
                onSuccess={onClose}
                onSwitchToLogin={() => setMode('LOGIN')}
              />
            )}

            {mode === 'LOGIN' && (
              <LoginForm
                onSuccess={onClose}
                onSwitchToRegister={() => setMode('REGISTER')}
                onForgotPassword={() => setForgotModalOpen(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
      />
    </>
  );
};

