import React, { useState } from 'react';
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
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { AuthScreen } from './components/AuthScreen';
import { NexaCapitalLogo } from './components/NexaCapitalLogo';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Shield, LogOut, ShieldCheck, Send, TrendingUp } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState<boolean>(false);

  const { isAdminMode, isLoggedIn, logout } = useApp();
  const { theme } = useTheme();

  if (!isLoggedIn) {
    return <AuthScreen />;
  }

  // ISOLATED ADMIN PORTAL VIEW
  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
        <div>
          {/* Admin Header Bar */}
          <header className="border-b border-amber-500/30 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 py-3.5">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <NexaCapitalLogo size="md" showText={true} />
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500 text-slate-950 uppercase tracking-wide">
                  Portal Admin
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Akses Terautentikasi (Root)</span>
                </div>

                <button
                  onClick={logout}
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
          <p>© {new Date().getFullYear()} {theme.brandName} Admin Portal System. Hak Akses Terbatas Pengelola.</p>
        </footer>
      </div>
    );
  }

  // STANDARD USER APP VIEW
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
          {activeTab === 'testimonials' && <TestimonialsView />}
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
      />

      {/* Global Modals */}
      <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
      <WithdrawModal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} />

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

            <div className="flex items-center space-x-4 text-xs font-medium">
              <a
                href={theme.supportTelegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 hover:text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>Telegram Support</span>
              </a>
              <span className="text-slate-700">•</span>
              <span className="flex items-center space-x-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sistem Enkripsi 256-Bit</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} {theme.brandName}. Hak Cipta Dilindungi Undang-Undang.</p>
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
