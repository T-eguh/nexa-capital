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
  const { user, downlines, registeredUsers, addNotification, platformSettings, syncWithServer } = useApp();
  const { theme } = useTheme();

  const [isSyncing, setIsSyncing] = useState(false);

  React.useEffect(() => {
    syncWithServer?.();
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncWithServer?.();
    setTimeout(() => {
      setIsSyncing(false);
      addNotification('Data referral & tim berhasil diperbarui!', 'success');
    }, 600);
  };

  const lvl1 = platformSettings?.referralLvl1Pct ?? 32;
  const lvl2 = platformSettings?.referralLvl2Pct ?? 2;
  const lvl3 = platformSettings?.referralLvl3Pct ?? 1;

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://nexacapital.web.id';
  const referralLink = `${baseUrl}/?ref=${user.referralCode}`;

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

  // 1. Find Level 1 registered users (referred directly by current user)
  const l1Users = (registeredUsers || []).filter(
    (u) =>
      u.referredBy &&
      user.referralCode &&
      u.referredBy.trim().toUpperCase() === user.referralCode.trim().toUpperCase() &&
      u.id !== user.id
  );

  // 2. Find Level 2 registered users (referred by Level 1 users)
  const l1Codes = new Set(l1Users.map((u) => u.referralCode?.trim().toUpperCase()).filter(Boolean));
  const l2Users = (registeredUsers || []).filter(
    (u) => u.referredBy && l1Codes.has(u.referredBy.trim().toUpperCase()) && u.id !== user.id
  );

  // 3. Find Level 3 registered users (referred by Level 2 users)
  const l2Codes = new Set(l2Users.map((u) => u.referralCode?.trim().toUpperCase()).filter(Boolean));
  const l3Users = (registeredUsers || []).filter(
    (u) => u.referredBy && l2Codes.has(u.referredBy.trim().toUpperCase()) && u.id !== user.id
  );

  // Build combined downline map
  const downlineMap = new Map<string, any>();

  // Add L1 registered users
  l1Users.forEach((u) => {
    const key = u.id || u.phone || u.email;
    const spent = u.totalInvested || 0;
    downlineMap.set(key, {
      id: u.id,
      name: u.fullName,
      email: u.email,
      phone: u.phone,
      joinDate: u.registeredAt ? u.registeredAt.split('T')[0] : '2026-08-24',
      totalSpent: spent,
      commissionEarned: Math.round(spent * (lvl1 / 100)),
      level: 1,
      uplineReferralCode: user.referralCode,
      uplineId: user.id,
    });
  });

  // Add L2 registered users
  l2Users.forEach((u) => {
    const key = u.id || u.phone || u.email;
    const spent = u.totalInvested || 0;
    downlineMap.set(key, {
      id: u.id,
      name: u.fullName,
      email: u.email,
      phone: u.phone,
      joinDate: u.registeredAt ? u.registeredAt.split('T')[0] : '2026-08-24',
      totalSpent: spent,
      commissionEarned: Math.round(spent * (lvl2 / 100)),
      level: 2,
      uplineReferralCode: u.referredBy,
    });
  });

  // Add L3 registered users
  l3Users.forEach((u) => {
    const key = u.id || u.phone || u.email;
    const spent = u.totalInvested || 0;
    downlineMap.set(key, {
      id: u.id,
      name: u.fullName,
      email: u.email,
      phone: u.phone,
      joinDate: u.registeredAt ? u.registeredAt.split('T')[0] : '2026-08-24',
      totalSpent: spent,
      commissionEarned: Math.round(spent * (lvl3 / 100)),
      level: 3,
      uplineReferralCode: u.referredBy,
    });
  });

  // Merge any recorded downlines from context state (Level 1, Level 2, Level 3)
  (downlines || []).forEach((d) => {
    const isL1 = d.uplineReferralCode?.toUpperCase() === user.referralCode?.toUpperCase() || d.uplineId === user.id;
    const isL2 = l1Codes.has(d.uplineReferralCode?.toUpperCase() || '');
    const isL3 = l2Codes.has(d.uplineReferralCode?.toUpperCase() || '');

    if (isL1 || isL2 || isL3 || (d.level && d.level > 1 && (l1Codes.size > 0 || l2Codes.size > 0))) {
      const key = d.id || d.name || d.email;
      const existing = downlineMap.get(key);
      const assignedLevel = isL1 ? 1 : isL2 ? 2 : isL3 ? 3 : (d.level || 1);
      if (existing) {
        existing.totalSpent = Math.max(existing.totalSpent, d.totalSpent || 0);
        existing.commissionEarned = Math.max(existing.commissionEarned, d.commissionEarned || 0);
      } else {
        downlineMap.set(key, {
          ...d,
          level: assignedLevel,
        });
      }
    }
  });

  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'ALL' | '1' | '2' | '3'>('ALL');
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  const userDownlines = Array.from(downlineMap.values());
  const filteredDownlines = userDownlines.filter((d) => {
    if (selectedLevelFilter === 'ALL') return true;
    return String(d.level || 1) === selectedLevelFilter;
  });

  const countL1 = userDownlines.filter((d) => (d.level || 1) === 1).length;
  const countL2 = userDownlines.filter((d) => d.level === 2).length;
  const countL3 = userDownlines.filter((d) => d.level === 3).length;

  const commissionL1 = userDownlines.filter((d) => (d.level || 1) === 1).reduce((acc, curr) => acc + (curr.commissionEarned || 0), 0);
  const commissionL2 = userDownlines.filter((d) => d.level === 2).reduce((acc, curr) => acc + (curr.commissionEarned || 0), 0);
  const commissionL3 = userDownlines.filter((d) => d.level === 3).reduce((acc, curr) => acc + (curr.commissionEarned || 0), 0);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(referralLink)}&margin=10`;

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
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black backdrop-blur-md">
              <Gift className="w-3.5 h-3.5" />
              <span>Sistem Komisi 3-Level Resmi</span>
            </div>
            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 active:scale-95 cursor-pointer"
            >
              <span className={isSyncing ? 'animate-spin' : ''}>🔄</span>
              <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Tim'}</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Program Referral 3-Level ({lvl1}% + {lvl2}% + {lvl3}%)
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            Dapatkan komisi investasi berjenjang dari setiap anggota tim Anda! Komisi diproses secara transparan dan otomatis dikreditkan langsung ke Saldo Penarikan tanpa perlu persetujuan manual.
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
          <div className="mt-3 p-3 bg-amber-400/15 border border-amber-400/40 rounded-xl text-xs font-extrabold text-amber-900 dark:text-amber-300 flex justify-between items-center">
            <span>Total Anggota: <strong>{countL1} Orang</strong></span>
            <span className="text-amber-600 dark:text-amber-300 font-bold">+Rp {commissionL1.toLocaleString('id-ID')}</span>
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
          <div className="mt-3 p-3 bg-blue-400/15 border border-blue-400/40 rounded-xl text-xs font-extrabold text-blue-900 dark:text-blue-300 flex justify-between items-center">
            <span>Total Anggota: <strong>{countL2} Orang</strong></span>
            <span className="text-blue-600 dark:text-blue-300 font-bold">+Rp {commissionL2.toLocaleString('id-ID')}</span>
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
          <div className="mt-3 p-3 bg-purple-400/15 border border-purple-400/40 rounded-xl text-xs font-extrabold text-purple-900 dark:text-purple-300 flex justify-between items-center">
            <span>Total Anggota: <strong>{countL3} Orang</strong></span>
            <span className="text-purple-600 dark:text-purple-300 font-bold">+Rp {commissionL3.toLocaleString('id-ID')}</span>
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
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center space-x-1 cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Tersalin' : 'Salin Kode'}</span>
            </button>
          </div>

          {/* Social Share & QR Code Buttons */}
          <div className="pt-2">
            <span className="text-[11px] text-slate-700 dark:text-slate-200 font-bold block mb-2">Bagikan & Scan QR:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={shareWhatsApp}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={shareTelegram}
                className="flex-1 py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Telegram</span>
              </button>
              <button
                onClick={() => setShowQrModal(true)}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center justify-center space-x-1.5 border border-slate-700 transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>QR Code</span>
              </button>
            </div>
          </div>
        </div>

        {/* Referral Link Box */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Link Pendaftaran Referral Otomatis</span>
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
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center space-x-1 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Tersalin' : 'Salin Link'}</span>
            </button>
          </div>

          <div className="p-3 bg-slate-900 text-white border border-slate-700 rounded-xl text-xs space-y-1">
            <div className="flex items-center space-x-1 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Komisi Langsung Masuk Saldo Penarikan:</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Bonus komisi referral 3-level Anda <strong>langsung cair ke Saldo Penarikan secara otomatis</strong> setelah member terundang membeli paket investasi.
            </p>
          </div>
        </div>
      </div>

      {/* Referral Statistics & Filter Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Daftar Anggota Tim & Downline ({userDownlines.length})
          </h2>

          {/* Level Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setSelectedLevelFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                selectedLevelFilter === 'ALL'
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({userDownlines.length})
            </button>
            <button
              onClick={() => setSelectedLevelFilter('1')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                selectedLevelFilter === '1'
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lvl 1 ({countL1})
            </button>
            <button
              onClick={() => setSelectedLevelFilter('2')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                selectedLevelFilter === '2'
                  ? 'bg-blue-500 text-white font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lvl 2 ({countL2})
            </button>
            <button
              onClick={() => setSelectedLevelFilter('3')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                selectedLevelFilter === '3'
                  ? 'bg-purple-500 text-white font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lvl 3 ({countL3})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-700 dark:text-slate-200 font-bold uppercase block">Total Member Terundang</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
              {userDownlines.length} Member
            </span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-700 dark:text-slate-200 font-bold uppercase block font-mono">Total Komisi Referral Cair</span>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
              +Rp {user.totalReferralCommission.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Downline Table or Empty State */}
        {filteredDownlines.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {selectedLevelFilter === 'ALL'
                ? 'Belum ada member terundang'
                : `Belum ada member di Level ${selectedLevelFilter}`}
            </p>
            <p className="text-xs text-slate-500">
              Bagikan link referral Anda di atas ke teman atau media sosial untuk mulai menerima komisi 3-Level!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 uppercase font-extrabold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3.5">Nama Member</th>
                  <th className="px-4 py-3.5">Level Referral</th>
                  <th className="px-4 py-3.5">Tanggal Bergabung</th>
                  <th className="px-4 py-3.5 text-right">Total Investasi</th>
                  <th className="px-4 py-3.5 text-right">Komisi Anda</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60">
                {filteredDownlines.map((d) => {
                  const lvl = d.level || 1;
                  return (
                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{d.name}</td>
                      <td className="px-4 py-3">
                        {lvl === 1 && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-400 text-slate-950 inline-flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-3 h-3" />
                            <span>Level 1 ({lvl1}%)</span>
                          </span>
                        )}
                        {lvl === 2 && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-600 text-white inline-flex items-center gap-1 shadow-sm">
                            <Zap className="w-3 h-3" />
                            <span>Level 2 ({lvl2}%)</span>
                          </span>
                        )}
                        {lvl === 3 && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-purple-600 text-white inline-flex items-center gap-1 shadow-sm">
                            <Award className="w-3 h-3" />
                            <span>Level 3 ({lvl3}%)</span>
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
        )}
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-fadeIn">
            <h3 className="text-base font-extrabold text-white">QR Code Referral Anda</h3>
            <p className="text-xs text-slate-400">Scan QR Code ini menggunakan kamera HP untuk mendaftar otomatis:</p>
            <div className="p-4 bg-white rounded-2xl inline-block shadow-lg mx-auto">
              <img src={qrImageUrl} alt="QR Referral" className="w-48 h-48 mx-auto" />
            </div>
            <div className="text-xs font-mono text-amber-400 font-bold bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              Kode: {user.referralCode}
            </div>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
