import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { StockTicker } from './components/StockTicker';
import { UserDashboard } from './components/UserDashboard';
import { ProductCatalog } from './components/ProductCatalog';
import { MyPortfolio } from './components/MyPortfolio';
import { ReferralSystem } from './components/ReferralSystem';
import { TransactionsHistory } from './components/TransactionsHistory';
import { FinancialLedgerView } from './components/FinancialLedgerView';
import { TestimonialsView } from './components/TestimonialsView';
import { AnalyticsDashboardView } from './components/AnalyticsDashboardView';
import { ReportGeneratorView } from './components/ReportGeneratorView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { SystemMonitoringView } from './components/SystemMonitoringView';
import { ActivityLogsView } from './components/ActivityLogsView';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { AiAssistantWidget } from './components/AiAssistantWidget';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginScreen } from './components/AdminLoginScreen';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { AuthScreen } from './components/AuthScreen';
import { NexaCapitalLogo } from './components/NexaCapitalLogo';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { MobileBottomNav } from './components/MobileBottomNav';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { WelcomeModal } from './components/WelcomeModal';
import { Shield, LogOut, ShieldCheck, Send, ArrowLeft, ArrowRight } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(true);

  // Separate Route Detection: /admin vs / (Member)
  const [currentRoute, setCurrentRoute] = useState<'/admin' | '/'>(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    const search = window.location.search;
    if (path.includes('/admin') || hash.includes('admin') || search.includes('admin')) {
      return '/admin';
    }
    return '/';
  });

  const { isAdminMode, isLoggedIn, logout, setIsAdminMode } = useApp();
  const { theme } = useTheme();

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;
      if (path.includes('/admin') || hash.includes('admin') || search.includes('admin')) {
        setCurrentRoute('/admin');
      } else {
        setCurrentRoute('/');
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateToRoute = (route: '/admin' | '/') => {
    if (route === '/admin') {
      window.history.pushState({}, '', '/admin');
    } else {
      window.history.pushState({}, '', '/');
    }
    setCurrentRoute(route);
  };

  // ROUTE 1: ADMIN PORTAL (/admin)
  if (currentRoute === '/admin') {
    if (isAdminMode && isLoggedIn) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
          <div>
            {/* Admin Header Bar */}
            <header className="border-b border-amber-500/30 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 py-3.5">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <NexaCapitalLogo size="md" showText={true} />
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-amber-500 text-slate-950 uppercase tracking-wide">
                    Portal Admin (/admin)
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setIsAdminMode(false);
                      navigateToRoute('/');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center space-x-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />
                    <span>Ke Dashboard Member (Link: /)</span>
                  </button>

                  <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Root Admin Active</span>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      navigateToRoute('/admin');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all flex items-center space-x-1.5"
                    title="Keluar dari Portal Admin"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Admin</span>
                  </button>
                </div>
              </div>
            </header>

            {/* Admin Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
              <AdminPanel />
            </main>
          </div>

          {/* Floating AI Widget for Admin */}
          <AiAssistantWidget />

          {/* Admin Footer */}
          <footer className="bg-slate-900/80 border-t border-slate-800 text-xs py-4 text-center text-slate-500">
            <p>© {new Date().getFullYear()} {theme.brandName} Admin Portal (/admin). Hak Akses Terbatas Pengelola.</p>
          </footer>
        </div>
      );
    }

    // Admin login view for unauthenticated access to /admin
    return (
      <AdminLoginScreen
        onGoToMember={() => navigateToRoute('/')}
        onSuccessLogin={() => navigateToRoute('/admin')}
      />
    );
  }

  // ROUTE 2: MEMBER / CUSTOMER PORTAL (/)
  if (!isLoggedIn) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 flex flex-col justify-between">
      <div>
        {/* Announcement Banner */}
        <AnnouncementBanner />

        {/* Live Market Stock Ticker */}
        <StockTicker />

        {/* Navigation Bar */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openDepositModal={() => setIsDepositOpen(true)}
          openWithdrawModal={() => setIsWithdrawOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {activeTab === 'dashboard' && (
            <UserDashboard
              setActiveTab={setActiveTab}
              openDepositModal={() => setIsDepositOpen(true)}
              openWithdrawModal={() => setIsWithdrawOpen(true)}
            />
          )}
          {activeTab === 'products' && <ProductCatalog />}
          {activeTab === 'portfolio' && <MyPortfolio />}
          {activeTab === 'analytics' && <AnalyticsDashboardView />}
          {activeTab === 'reports' && <ReportGeneratorView />}
          {activeTab === 'announcements' && <AnnouncementsView />}
          {activeTab === 'system' && <SystemMonitoringView />}
          {activeTab === 'activity' && <ActivityLogsView />}
          {activeTab === 'referral' && <ReferralSystem />}
          {activeTab === 'testimonials' && <TestimonialsView onBack={() => setActiveTab('dashboard')} />}
          {activeTab === 'history' && <TransactionsHistory />}
          {activeTab === 'ledger' && <FinancialLedgerView />}
        </main>
      </div>

      {/* Floating AI Assistant Widget */}
      <AiAssistantWidget />

      {/* PWA Install Banner & Update Alert */}
      <PwaInstallPrompt />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDeposit={() => setIsDepositOpen(true)}
        onOpenWithdraw={() => setIsWithdrawOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Global Modals */}
      <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
      <WithdrawModal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} />
      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        onOpenMarket={() => {
          setActiveTab('products');
          setIsWelcomeOpen(false);
        }}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {theme.brandName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="text-sm font-bold text-white">{theme.brandName}</span>
                <p className="text-[11px] text-slate-500">{theme.brandTagline}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs font-medium">
              <a
                href="https://t.me/CSnexacapital"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 hover:text-white transition-colors text-cyan-400 font-bold"
              >
                <Send className="w-3.5 h-3.5" />
                <span>CS Telegram (@CSnexacapital)</span>
              </a>
              <span className="text-slate-700">•</span>
              <a
                href="https://t.me/nexacapitalcom"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 hover:text-white transition-colors text-blue-400 font-bold"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Saluran Telegram</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} {theme.brandName}. Member Dashboard Route (/)</p>
            <p className="flex items-center space-x-1">
              <span>Platform Investasi Saham & Profit Harian Otomatis</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </ThemeProvider>
  );
}
