import React from 'react';
import {
  LayoutGrid,
  CandlestickChart,
  Gift,
  Receipt,
  User,
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenProfile: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenProfile,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Beranda',
      icon: LayoutGrid,
      action: () => setActiveTab('dashboard'),
      isActive: activeTab === 'dashboard',
    },
    {
      id: 'products',
      label: 'Perdagangan',
      icon: CandlestickChart,
      action: () => setActiveTab('products'),
      isActive: activeTab === 'products',
    },
    {
      id: 'referral',
      label: 'Hadiah',
      icon: Gift,
      action: () => setActiveTab('referral'),
      isActive: activeTab === 'referral',
    },
    {
      id: 'ledger',
      label: 'Mutasi',
      icon: Receipt,
      action: () => setActiveTab('ledger'),
      isActive: activeTab === 'ledger' || activeTab === 'history',
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
      action: onOpenProfile,
      isActive: false,
    },
  ];

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 lg:hidden">
      <div className="bg-[#0c1322] border border-slate-800 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 ${
                active
                  ? 'bg-[#13282b] border border-emerald-500/30 text-emerald-400 font-bold scale-102'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium'
              }`}
            >
              <div
                className={`w-4 h-0.5 rounded-full mb-1 transition-colors ${
                  active ? 'bg-emerald-400' : 'bg-transparent'
                }`}
              />
              <Icon
                className={`w-5 h-5 transition-colors ${
                  active ? 'text-emerald-400' : 'text-slate-400'
                }`}
              />
              <span
                className={`text-[11px] mt-1 transition-colors ${
                  active ? 'text-emerald-400 font-extrabold' : 'text-slate-400 font-semibold'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
