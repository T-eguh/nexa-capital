import React from 'react';
import { NexaCapitalLogo } from './NexaCapitalLogo';
import { LoginForm } from './auth/LoginForm';
import { ShieldCheck, ArrowLeft, Lock, Server } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AdminLoginScreenProps {
  onGoToMember: () => void;
  onSuccessLogin: () => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({
  onGoToMember,
  onSuccessLogin,
}) => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <header className="border-b border-amber-500/20 bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <NexaCapitalLogo size="md" showText={true} />
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 uppercase tracking-wider">
            Portal Admin Dedicated (/admin)
          </span>
        </div>

        <button
          onClick={onGoToMember}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 transition-all flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4 text-sky-400" />
          <span>Ke Dashboard Member (Link: /)</span>
        </button>
      </header>

      {/* Main Login Area */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/90 border border-amber-500/30 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
          {/* Subtle Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Heading */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Akses Portal Admin Root
            </h1>
            <p className="text-xs text-slate-400">
              Halaman login khusus pengelola & tim eksekutif. Terpisah dari dashboard member.
            </p>
          </div>

          {/* Dedicated Admin Login Form */}
          <LoginForm
            isAdmin={true}
            onSuccess={onSuccessLogin}
            onSwitchToRegister={() => {}}
            onForgotPassword={() => {}}
          />

          {/* Security & Route Info */}
          <div className="pt-2 border-t border-slate-800 text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-[11px] text-amber-400 font-mono">
              <Server className="w-3.5 h-3.5" />
              <span>URL Terpisah: https://.../admin</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Seluruh aktivitas login diawasi oleh Enkripsi Enclave & System Logger 256-Bit.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-800/80">
        <p>© {new Date().getFullYear()} {theme.brandName} Dedicated Admin Portal Route.</p>
      </footer>
    </div>
  );
};
