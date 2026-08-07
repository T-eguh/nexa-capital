import React from 'react';
import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const criteria = [
    { label: 'Minimal 8 Karakter', valid: password.length >= 8 },
    { label: 'Huruf Besar (A-Z)', valid: /[A-Z]/.test(password) },
    { label: 'Huruf Kecil (a-z)', valid: /[a-z]/.test(password) },
    { label: 'Angka (0-9)', valid: /[0-9]/.test(password) },
    { label: 'Karakter Khusus (!@#$%^&*)', valid: /[^a-zA-Z0-9]/.test(password) },
  ];

  const validCount = criteria.filter((c) => c.valid).length;

  let strengthLabel = 'Sangat Lemah';
  let strengthColor = 'bg-rose-500';
  let textColor = 'text-rose-400';

  if (validCount === 5) {
    strengthLabel = 'Sangat Kuat';
    strengthColor = 'bg-emerald-500';
    textColor = 'text-emerald-400';
  } else if (validCount >= 3) {
    strengthLabel = 'Cukup Kuat';
    strengthColor = 'bg-amber-500';
    textColor = 'text-amber-400';
  } else if (validCount >= 1) {
    strengthLabel = 'Lemah';
    strengthColor = 'bg-rose-400';
    textColor = 'text-rose-400';
  }

  const scorePct = (validCount / 5) * 100;

  if (!password) return null;

  return (
    <div className="space-y-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5 font-bold">
          {validCount === 5 ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          )}
          <span className="text-slate-300">Keamanan Kata Sandi:</span>
        </div>
        <span className={`font-black ${textColor}`}>{strengthLabel}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
        <div
          className={`h-full transition-all duration-300 ${strengthColor}`}
          style={{ width: `${scorePct}%` }}
        />
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
        {criteria.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-1.5 text-[11px]">
            {item.valid ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            )}
            <span className={item.valid ? 'text-slate-200 font-medium' : 'text-slate-500'}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
