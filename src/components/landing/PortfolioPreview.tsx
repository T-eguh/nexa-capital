import React, { useState } from 'react';
import { LayoutDashboard, TrendingUp, Wallet, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';

export const PortfolioPreview: React.FC<{ lang: 'ID' | 'EN' }> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'HISTORY' | 'REFERRAL'>('OVERVIEW');

  return (
    <section id="preview" className="py-24 bg-slate-900/50 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{lang === 'ID' ? 'Antarmuka Dashboard Intuitif' : 'Intuitive Dashboard Preview'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {lang === 'ID' ? 'Pantau Portofolio & Dividen Dengan Mudah' : 'Real-Time Portfolio & Dividend Analytics'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ID'
              ? 'Tampilan dashboard modern, cepat, dan responsif di semua perangkat (Desktop, Tablet, Mobile).'
              : 'Designed for effortless tracking, fast deposits, and instant withdrawals.'}
          </p>
        </div>

        {/* Dashboard Frame Preview */}
        <div className="max-w-5xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-8 shadow-2xl space-y-6">
          {/* Top Bar Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-slate-500 ml-2">app.nexacapital.com/dashboard</span>
            </div>

            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setActiveTab('OVERVIEW')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'OVERVIEW' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Ringkasan
              </button>
              <button
                onClick={() => setActiveTab('HISTORY')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'HISTORY' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Riwayat Dividen
              </button>
              <button
                onClick={() => setActiveTab('REFERRAL')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'REFERRAL' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Downline (3-Tier)
              </button>
            </div>
          </div>

          {/* Interactive Mock Dashboard Body */}
          {activeTab === 'OVERVIEW' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900/40 via-slate-900 to-slate-950 border border-blue-500/30 space-y-3">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Saldo Penarikan</p>
                <h3 className="text-2xl font-black text-white font-mono">Rp 48.250.000</h3>
                <div className="flex items-center space-x-1.5 text-xs text-emerald-400">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Siap Ditarik Ke Rekening Bank</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Modal Aktif</p>
                <h3 className="text-2xl font-black text-white font-mono">Rp 150.000.000</h3>
                <p className="text-xs text-slate-400">Tersebar di 4 Portofolio Saham VIP</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Komisi Referral (32%)</p>
                <h3 className="text-2xl font-black text-amber-400 font-mono">Rp 16.400.000</h3>
                <p className="text-xs text-slate-400">Dari 18 Investor Downline Aktif</p>
              </div>
            </div>
          )}

          {activeTab === 'HISTORY' && (
            <div className="space-y-3 animate-fade-in">
              {[
                { time: 'Hari Ini, 14:00', title: 'Dividen Harian - NVDA Tech VIP', amount: '+Rp 225.000', status: 'Cair' },
                { time: 'Kemarin, 14:00', title: 'Dividen Harian - BBCA Bluechip', amount: '+Rp 150.000', status: 'Cair' },
                { time: '03 Ags 2026', title: 'Penarikan Saldo Ke BCA (1284****)', amount: '-Rp 2.500.000', status: 'Sukses (Instan)' },
              ].map((row, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{row.title}</p>
                    <p className="text-[10px] text-slate-400">{row.time}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono font-bold ${row.amount.startsWith('+') ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {row.amount}
                    </p>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'REFERRAL' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 animate-fade-in">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Level 1 (32%)</p>
                  <p className="text-lg font-black text-emerald-400 font-mono">12 Member</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Level 2 (2%)</p>
                  <p className="text-lg font-black text-blue-400 font-mono">24 Member</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Level 3 (1%)</p>
                  <p className="text-lg font-black text-purple-400 font-mono">48 Member</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
