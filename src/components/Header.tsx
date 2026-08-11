import React, { useState } from 'react';
import {
  TrendingUp,
  LineChart,
  ShieldCheck,
  Zap,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Shield,
  Bell,
  Headphones,
  CheckCircle2,
  XCircle,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { useAuthStore } from '../store/useAuthStore';
import { NexaCapitalLogo } from './NexaCapitalLogo';
import { UserProfileModal } from './profile/UserProfileModal';
import { SecurityCenterModal } from './profile/SecurityCenterModal';
import { VipStatusModal } from './VipStatusModal';
import { LanguageSelector } from './LanguageSelector';
import { SocialShareModal } from './SocialShareModal';
import { Share2 } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openDepositModal: () => void;
  openWithdrawModal: () => void;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openDepositModal,
  openWithdrawModal,
  onOpenProfile,
}) => {
  const { theme } = useTheme();
  const { user, isAdminMode, setIsAdminMode, notifications, logout } = useApp();
  const authUser = useAuthStore((state) => state.user);

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isInternalProfileOpen, setIsInternalProfileOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);

  const isProfileOpen = isInternalProfileOpen;
  const handleOpenProfile = onOpenProfile || (() => setIsInternalProfileOpen(true));

  const roles = authUser?.roles || ['USER'];

  const navItems = [
    { id: 'dashboard', label: 'Beranda' },
    { id: 'products', label: 'Perdagangan' },
    { id: 'referral', label: 'Hadiah' },
    { id: 'portfolio', label: 'Portofolio' },
    { id: 'ledger', label: 'Mutasi' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Brand Logo & Name */}
            <div className="flex items-center space-x-2 shrink-0 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <NexaCapitalLogo size="md" showText={true} />
              <span className="hidden xl:inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 whitespace-nowrap">
                Trading & Investasi
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id && !isAdminMode;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setIsAdminMode(false);
                      setActiveTab(item.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Right Section: Balance, User Profile, Security Center, Notifications */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              {/* Quick Deposit & Tarik Buttons */}
              <div className="flex items-center space-x-1 shrink-0">
                <button
                  onClick={openDepositModal}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-95 whitespace-nowrap shrink-0"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span>Deposit</span>
                </button>
                <button
                  onClick={openWithdrawModal}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all active:scale-95 whitespace-nowrap shrink-0"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Tarik</span>
                </button>
              </div>

              {/* User Profile Trigger Button */}
              <button
                onClick={handleOpenProfile}
                className="px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center space-x-1 text-xs font-bold shrink-0 whitespace-nowrap"
                title="Pengaturan Profil Akun"
              >
                <UserIcon className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="max-w-[70px] sm:max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
              </button>

              {/* VIP Badge */}
              <button
                onClick={() => setIsVipModalOpen(true)}
                className="hidden xl:flex px-2 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] shadow-sm items-center space-x-1 transition-transform hover:scale-105 active:scale-95 shrink-0 whitespace-nowrap"
                title="Klik untuk melihat Status VIP & Keuntungan"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>{user.vipLevel || 'VIP 0'}</span>
              </button>

              {/* Language Selector */}
              <LanguageSelector />

              {/* Social Share Trigger */}
              <button
                onClick={() => setIsShareOpen(true)}
                className="p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-teal-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shrink-0"
                title="Bagikan Platform"
              >
                <Share2 className="w-3.5 h-3.5 text-teal-400" />
              </button>

              {/* Security Center Trigger Button */}
              <button
                onClick={() => setIsSecurityOpen(true)}
                className="p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-emerald-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shrink-0"
                title="Pusat Keamanan & Perangkat"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </button>

              {/* Notifications Menu */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setShowNotifMenu(!showNotifMenu)}
                  className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all relative shrink-0"
                  title="Notifikasi"
                >
                  <Bell className="w-3.5 h-3.5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
                  )}
                </button>

                {showNotifMenu && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Notifikasi Terkini
                      </span>
                      <span className="text-[10px] text-slate-400">Real-time</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-xs text-slate-400">
                          Belum ada notifikasi baru.
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors flex items-start space-x-2.5">
                            {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                            {n.type === 'error' && <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
                            {n.type === 'info' && <Bell className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}
                            <div>
                              <p className="text-xs text-slate-700 dark:text-slate-200">{n.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-rose-500 hover:text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900 transition-all flex items-center space-x-1 text-xs font-bold shrink-0 whitespace-nowrap"
                title="Keluar / Logout Akun"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Keluar</span>
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 shrink-0"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl mb-3">
              <div>
                <span className="text-xs text-slate-400 font-medium">Saldo Utama</span>
                <p className="text-base font-bold text-slate-900 dark:text-emerald-400">
                  Rp {(user.saldoPenarikan ?? user.balance ?? 0).toLocaleString('id-ID')}
                </p>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    openDepositModal();
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  Deposit
                </button>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    openWithdrawModal();
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                >
                  Tarik
                </button>
              </div>
            </div>

            <div className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsAdminMode(false);
                    setActiveTab(item.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                    activeTab === item.id && !isAdminMode
                      ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsInternalProfileOpen(false)}
      />

      {/* Security Center Modal */}
      <SecurityCenterModal
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
      />

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* VIP Status Membership Modal */}
      <VipStatusModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        onSelectProductToBuy={() => {
          setIsVipModalOpen(false);
          setActiveTab('products');
        }}
      />
    </>
  );
};
