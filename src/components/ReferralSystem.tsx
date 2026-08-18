import React, { useState } from 'react';
import {
  Users,
  Copy,
  Check,
  Share2,
  Gift,
  Award,
  ArrowRight,
  Send,
  MessageCircle,
  QrCode,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

export const ReferralSystem: React.FC = () => {
  const { user, downlines, addNotification, platformSettings } = useApp();
  const { theme } = useTheme();

  const lvl1 = platformSettings?.referralLvl1Pct ?? 32;
  const lvl2 = platformSettings?.referralLvl2Pct ?? 2;
  const lvl3 = platformSettings?.referralLvl3Pct ?? 1;

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const referralLink = `https://capitalwavee.com/r/${user.referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopiedCode(true);
    addNotification('Kode referral berhasil disalin!', 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    addNotification('Link referral berhasil disalin!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = `Halo! Bergabunglah di ${theme.brandName}, platform investasi saham dengan profit harian otomatis. Gunakan kode referral saya ${user.referralCode} atau daftar via link berikut: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareTelegram = () => {
    const text = `Bergabunglah di ${theme.brandName}, platform investasi saham dengan profit harian otomatis. Kode referral: ${user.referralCode}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const totalCommission = downlines.reduce((acc, curr) => acc + curr.commissionEarned, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Referral Hero Banner */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${theme.primaryColor} 0%, #0f172a 100%)`,
        }}
      >
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black backdrop-blur-md">
            <Gift className="w-3.5 h-3.5" />
            <span>Sistem Komisi 3-Level Resmi</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Program Referral 3-Level ({lvl1}% + {lvl2}% + {lvl3}%)
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            Dapatkan komisi investasi berjenjang dari setiap anggota tim Anda! Komisi diproses secara transparan dan otomatis dikreditkan ke Saldo Penarikan.
          </p>
        </div>
      </div>

      {/* 3 Level Commission Tier Explanatory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Level 1 */}
        <div className="bg-amber-950/20 dark:bg-slate-900/90 rounded-2xl p-5 border-2 border-amber-400 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-black text-amber-600 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Level 1 (Direct)</span>
            </span>
            <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full shadow-sm">
              {lvl1}% Komisi
            </span>
          </div>
          <p className="text-xs text-slate-800 dark:text-slate-100 font-semibold mt-2 leading-relaxed">
            Anggota yang mendaftar langsung menggunakan link/kode referral Anda.
          </p>
          <div className="mt-3 p-3 bg-amber-400/15 border border-amber-400/40 rounded-xl text-xs font-extrabold text-amber-900 dark:text-amber-300">
            Simulasi: Beli Produk 50k &rarr; Komisi <strong className="text-amber-700 dark:text-amber-200 text-sm">Rp {Math.round(50000 * (lvl1 / 100)).toLocaleString('id-ID')}</strong>
          </div>
        </div>

        {/* Level 2 */}
        <div className="bg-blue-950/20 dark:bg-slate-900/90 rounded-2xl p-5 border-2 border-blue-400 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-black text-blue-600 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>Level 2 (Indirect)</span>
            </span>
            <span className="px-3 py-1 bg-blue-500 text-white font-black text-xs rounded-full shadow-sm">
              {lvl2}% Komisi
            </span>
          </div>
          <p className="text-xs text-slate-800 dark:text-slate-100 font-semibold mt-2 leading-relaxed">
            Anggota yang diundang oleh bawahan Level 1 Anda.
          </p>
          <div className="mt-3 p-3 bg-blue-400/15 border border-blue-400/40 rounded-xl text-xs font-extrabold text-blue-900 dark:text-blue-300">
            Simulasi: Beli Produk 50k &rarr; Komisi <strong className="text-blue-700 dark:text-blue-200 text-sm">Rp {Math.round(50000 * (lvl2 / 100)).toLocaleString('id-ID')}</strong>
          </div>
        </div>

        {/* Level 3 */}
        <div className="bg-purple-950/20 dark:bg-slate-900/90 rounded-2xl p-5 border-2 border-purple-400 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-black text-purple-600 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Level 3 (Sub-Indirect)</span>
            </span>
            <span className="px-3 py-1 bg-purple-500 text-white font-black text-xs rounded-full shadow-sm">
              {lvl3}% Komisi
            </span>
          </div>
          <p className="text-xs text-slate-800 dark:text-slate-100 font-semibold mt-2 leading-relaxed">
            Anggota yang diundang oleh bawahan Level 2 Anda.
          </p>
          <div className="mt-3 p-3 bg-purple-400/15 border border-purple-400/40 rounded-xl text-xs font-extrabold text-purple-900 dark:text-purple-300">
            Simulasi: Beli Produk 50k &rarr; Komisi <strong className="text-purple-700 dark:text-purple-200 text-sm">Rp {Math.round(50000 * (lvl3 / 100)).toLocaleString('id-ID')}</strong>
          </div>
        </div>
      </div>

      {/* Unique Referral Link & Code Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Referral Code Box */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Kode Referral Anda</span>
          </h2>

          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-mono text-lg font-extrabold text-blue-600 dark:text-blue-400 flex-1 tracking-wider">
              {user.referralCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center space-x-1"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Tersalin' : 'Salin Kode'}</span>
            </button>
          </div>

          {/* Social Share Buttons */}
          <div className="pt-2">
            <span className="text-[11px] text-slate-700 dark:text-slate-200 font-bold block mb-2">Bagikan Langsung Ke:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={shareWhatsApp}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={shareTelegram}
                className="flex-1 py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Telegram</span>
              </button>
            </div>
          </div>
        </div>

        {/* Referral Link Box */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Link Pendaftaran Referral</span>
          </h2>

          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="font-mono text-xs text-slate-600 dark:text-slate-300 bg-transparent flex-1 focus:outline-none truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center space-x-1"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Tersalin' : 'Salin Link'}</span>
            </button>
          </div>

          <div className="p-3 bg-slate-900 text-white border border-slate-700 rounded-xl text-xs space-y-1">
            <div className="flex items-center space-x-1 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Komisi Langsung Otomatis:</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Bonus komisi referral 3-level Anda <strong>langsung masuk ke Saldo Penarikan secara otomatis</strong> setelah downline terundang melakukan aktivitas paket investasi.
            </p>
          </div>
        </div>
      </div>

      {/* Referral Statistics */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Statistik & Daftar Teman Terundang ({downlines.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-700 dark:text-slate-200 font-bold uppercase block">Total Member Terundang</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
              {downlines.length} Member
            </span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-700 dark:text-slate-200 font-bold uppercase block font-mono">Total Komisi Disetujui</span>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
              +Rp {user.totalReferralCommission.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Downline Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 uppercase font-extrabold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3.5">Nama Member</th>
                <th className="px-4 py-3.5">Level Referral</th>
                <th className="px-4 py-3.5">Tanggal Bergabung</th>
                <th className="px-4 py-3.5 text-right">Total Transaksi</th>
                <th className="px-4 py-3.5 text-right">Komisi Anda</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60">
              {downlines.map((d) => {
                const lvl = d.level || 1;
                return (
                  <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{d.name}</td>
                    <td className="px-4 py-3">
                      {lvl === 1 && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-400 text-slate-950 inline-flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-3 h-3" />
                          <span>Level 1 (32%)</span>
                        </span>
                      )}
                      {lvl === 2 && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-600 text-white inline-flex items-center gap-1 shadow-sm">
                          <Zap className="w-3 h-3" />
                          <span>Level 2 (2%)</span>
                        </span>
                      )}
                      {lvl === 3 && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-purple-600 text-white inline-flex items-center gap-1 shadow-sm">
                          <Award className="w-3 h-3" />
                          <span>Level 3 (1%)</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{d.joinDate}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">
                      Rp {d.totalSpent.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-right font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      +Rp {d.commissionEarned.toLocaleString('id-ID')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
