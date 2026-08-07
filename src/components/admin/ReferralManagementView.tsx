import React from 'react';
import { Share2, Award, Users, DollarSign, TrendingUp } from 'lucide-react';

export const ReferralManagementView: React.FC = () => {
  const tiers = [
    { level: 'Tier 1 (Direct Referral)', comm: '10.0%', count: 18, volume: 'Rp 12.500.000' },
    { level: 'Tier 2 (Indirect Referral)', comm: '3.0%', count: 42, volume: 'Rp 28.000.000' },
    { level: 'Tier 3 (Extended Network)', comm: '1.0%', count: 85, volume: 'Rp 45.000.000' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            <span>Sistem Referral & Struktur Komisi 3 Tier</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitoring jaringan kemitraan investor, persentase komisi bawahan, dan statistik bonus.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div key={t.level} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase">{t.level}</span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {t.comm} Komisi
              </span>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{t.count} Investor</p>
              <p className="text-xs text-slate-400 mt-1">Total Turnover: {t.volume}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
