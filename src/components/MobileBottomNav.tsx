import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Briefcase,
  PieChart,
  Bot,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownLeft,
  Share2,
  FileText,
  Megaphone,
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenDeposit,
  onOpenWithdraw,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const mainNavItems = [
    { id: 'dashboard', label: 'Dasbor', icon: LayoutDashboard },
    { id: 'products', label: 'Produk', icon: ShoppingBag },
    { id: 'portfolio', label: 'Portofolio', icon: Briefcase },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {showMenu && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end lg:hidden animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Aksi Cepat & Menu Lainnya</h3>
              <button onClick={() => setShowMenu(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpenDeposit();
                }}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2"
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>Deposit Saldo</span>
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpenWithdraw();
                }}
                className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center space-x-2"
              >
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                <span>Tarik Saldo</span>
              </button>
            </div>

            {/* Menu Links */}
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => {
                  setActiveTab('reports');
                  setShowMenu(false);
                }}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-800 dark:text-slate-200 flex items-center space-x-2"
              >
                <FileText className="w-4 h-4 text-teal-500" />
                <span>Laporan & Export</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('announcements');
                  setShowMenu(false);
                }}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-800 dark:text-slate-200 flex items-center space-x-2"
              >
                <Megaphone className="w-4 h-4 text-amber-500" />
                <span>Pengumuman</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 lg:hidden px-2 py-1.5 shadow-lg flex items-center justify-around">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-teal-600 dark:text-teal-400 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setShowMenu(true)}
          className="flex flex-col items-center py-1.5 px-3 rounded-2xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Lainnya</span>
        </button>
      </nav>
    </>
  );
};
