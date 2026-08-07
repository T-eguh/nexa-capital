import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  Package,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Share2,
  FileText,
  Megaphone,
  Bell,
  LifeBuoy,
  History,
  Settings,
  Folder,
  Menu,
  ChevronLeft,
  Search,
  Moon,
  Sun,
  LogOut,
  ShieldCheck,
  ChevronDown,
  UserCheck,
  HelpCircle
} from 'lucide-react';

export type AdminTabType =
  | 'overview'
  | 'users'
  | 'roles'
  | 'products'
  | 'investments'
  | 'deposits'
  | 'withdrawals'
  | 'wallets'
  | 'referrals'
  | 'cms'
  | 'announcements'
  | 'broadcast'
  | 'tickets'
  | 'logs'
  | 'settings'
  | 'files';

interface AdminLayoutProps {
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  setActiveTab,
  children,
}) => {
  const { user, logout } = useApp();
  const { isDark, toggleTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const navGroups = [
    {
      title: 'UTAMA',
      items: [
        { id: 'overview', label: 'Dashboard & Analitik', icon: LayoutDashboard },
        { id: 'users', label: 'Pengguna & Akun', icon: Users },
        { id: 'roles', label: 'Role & Izin (RBAC)', icon: ShieldAlert },
      ],
    },
    {
      title: 'INVESTASI & FINANSIAL',
      items: [
        { id: 'products', label: 'Paket Saham / Produk', icon: Package },
        { id: 'investments', label: 'Portofolio Investasi', icon: TrendingUp },
        { id: 'deposits', label: 'Antrean Deposit', icon: ArrowDownLeft, badge: 'Baru' },
        { id: 'withdrawals', label: 'Antrean Penarikan', icon: ArrowUpRight, badge: 'Baru' },
        { id: 'wallets', label: 'Kelola Dompet & Saldo', icon: Wallet },
        { id: 'referrals', label: 'Sistem Referral & Komisi', icon: Share2 },
      ],
    },
    {
      title: 'KONTEN & KOMUNIKASI',
      items: [
        { id: 'cms', label: 'CMS Landing Page', icon: FileText },
        { id: 'announcements', label: 'Pengumuman & Promo', icon: Megaphone },
        { id: 'broadcast', label: 'Siaran Notifikasi', icon: Bell },
        { id: 'tickets', label: 'Tiket Dukungan Support', icon: LifeBuoy, badge: '1' },
      ],
    },
    {
      title: 'SISTEM & AUDIT',
      items: [
        { id: 'logs', label: 'Log Audit & Sistem', icon: History },
        { id: 'settings', label: 'Pengaturan Sistem', icon: Settings },
        { id: 'files', label: 'Aset Berkas & Gambar', icon: Folder },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* MOBILE SIDEBAR OVERLAY */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Sidebar Header / Logo */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-slate-950 text-lg shadow-lg shadow-amber-500/20 shrink-0">
                NX
              </div>
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <h1 className="text-sm font-bold text-white tracking-wide truncate">NEXA CAPITAL</h1>
                  <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Enterprise Admin</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title={isSidebarCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
            >
              <ChevronLeft className={`w-4 h-4 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="py-4 px-3 space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)] custom-scrollbar">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                {!isSidebarCollapsed && (
                  <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {group.title}
                  </p>
                )}

                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as AdminTabType);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                      title={isSidebarCollapsed ? item.label : undefined}
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                        {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!isSidebarCollapsed && item.badge && (
                        <span
                          className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                            isActive
                              ? 'bg-slate-950 text-amber-400'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={user?.fullName}
                className="w-8 h-8 rounded-full border border-amber-500/40 object-cover shrink-0"
              />
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-200 truncate">{user?.fullName || 'Super Admin'}</p>
                  <p className="text-[10px] text-emerald-400 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Root Superadmin</span>
                  </p>
                </div>
              )}
            </div>

            {!isSidebarCollapsed && (
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Keluar Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER AREA */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* TOP HEADER NAVIGATION BAR */}
        <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar */}
            <div className="relative hidden md:block w-72 lg:w-96">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari pengguna, transaksi, ID deposit, produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-800/60 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Ganti Tema Visual"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Notification Center */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-xl bg-slate-800/60 border border-slate-800 text-slate-400 hover:text-white transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-white">Notifikasi Admin</h3>
                    <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      3 Baru
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <p className="font-semibold text-white">Deposit Baru (QRIS)</p>
                      <p className="text-[11px] text-slate-400">Budi Santoso mengirim deposit Rp 300.000</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <p className="font-semibold text-white">Tiket Support Baru</p>
                      <p className="text-[11px] text-slate-400">Pertanyaan verifikasi dari user #101</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800/80 transition-colors"
              >
                <img
                  src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt="Admin Avatar"
                  className="w-7 h-7 rounded-lg object-cover"
                />
                <span className="hidden sm:inline text-xs font-bold text-slate-200">{user?.username || 'superadmin'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1 text-xs">
                  <div className="p-2 border-b border-slate-800">
                    <p className="font-bold text-white">{user?.fullName}</p>
                    <p className="text-[10px] text-slate-400">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 text-left transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Pengaturan Akun</span>
                  </button>
                  <button
                    onClick={logout}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-left transition-colors font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Sesi Admin</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-[11px] text-slate-500 bg-slate-950/80">
          <p>© {new Date().getFullYear()} Nexa Capital Enterprise Admin Platform v5.0. Hak Cipta Dilindungi Undang-Undang.</p>
        </footer>
      </div>
    </div>
  );
};
