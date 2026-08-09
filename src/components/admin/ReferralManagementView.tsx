import React from 'react';
import { Share2, Award, Users, DollarSign, TrendingUp } from 'lucide-react';

export const ReferralManagementView: React.FC = () => {
  const tiers = [
    { level: 'Level 1 (Direct Referral)', comm: '32.0%', count: 18, volume: 'Rp 12.500.000', color: 'border-amber-400 bg-amber-950/20 text-amber-300' },
    { level: 'Level 2 (Indirect Referral)', comm: '2.0%', count: 42, volume: 'Rp 28.000.000', color: 'border-blue-400 bg-blue-950/20 text-blue-300' },
    { level: 'Level 3 (Sub-Indirect Referral)', comm: '1.0%', count: 85, volume: 'Rp 45.000.000', color: 'border-purple-400 bg-purple-950/20 text-purple-300' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            <span>Sistem Referral & Struktur Komisi 3 Level</span>
          </h2>
          <p className="text-xs text-slate-200 mt-1">
            Monitoring jaringan kemitraan investor, persentase komisi bawahan, dan statistik bonus.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div key={t.level} className={`p-6 rounded-3xl bg-slate-900 border-2 ${t.color.split(' ')[0]} space-y-3 shadow-md`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-black uppercase ${t.color.split(' ')[2]}`}>{t.level}</span>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-slate-950 shadow">
                {t.comm} Komisi
              </span>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{t.count} Investor</p>
              <p className="text-xs text-slate-200 font-semibold mt-1">Total Turnover: <span className="text-white font-bold">{t.volume}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
