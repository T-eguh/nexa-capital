import React, { useState } from 'react';
import { X, Shield } from 'lucide-react';
import { RegisterForm } from '../auth/RegisterForm';
import { LoginForm } from '../auth/LoginForm';
import { ForgotPasswordModal } from '../auth/ForgotPasswordModal';
import { NexaCapitalLogo } from '../NexaCapitalLogo';

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
        <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center space-y-3 pb-6 border-b border-slate-800">
            <div className="flex justify-center">
              <NexaCapitalLogo size="md" showText={true} />
            </div>

            {/* Mode Switcher Tabs */}
            <div className="inline-flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold w-full max-w-xs">
              <button
                onClick={() => setMode('REGISTER')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  mode === 'REGISTER'
                    ? 'bg-sky-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Daftar Akun
              </button>
              <button
                onClick={() => setMode('LOGIN')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  mode === 'LOGIN'
                    ? 'bg-sky-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Masuk
              </button>
            </div>
          </div>

          <div className="mt-6">
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
