import React, { useState } from 'react';
import { Navbar } from './landing/Navbar';
import { HeroSection } from './landing/HeroSection';
import { LiveMarketTicker } from './landing/LiveMarketTicker';
import { InvestmentCalculator } from './landing/InvestmentCalculator';
import { StatisticsSection } from './landing/StatisticsSection';
import { WhyChooseUs } from './landing/WhyChooseUs';
import { HowItWorks } from './landing/HowItWorks';
import { InvestmentPackages } from './landing/InvestmentPackages';
import { PortfolioPreview } from './landing/PortfolioPreview';
import { SecuritySection } from './landing/SecuritySection';
import { CompanyTimeline } from './landing/CompanyTimeline';
import { TestimonialsSection } from './landing/TestimonialsSection';
import { LatestNews } from './landing/LatestNews';
import { FaqSection } from './landing/FaqSection';
import { CtaSection } from './landing/CtaSection';
import { ContactSection } from './landing/ContactSection';
import { Footer } from './landing/Footer';
import { AuthModal } from './landing/AuthModal';

export const AuthScreen: React.FC = () => {
  const [lang, setLang] = useState<'ID' | 'EN'>('ID');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER' | 'ADMIN_LOGIN'>('REGISTER');

  const handleOpenAuth = (mode: 'LOGIN' | 'REGISTER' | 'ADMIN_LOGIN') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Sticky Header Navigation */}
      <Navbar onOpenAuth={handleOpenAuth} lang={lang} setLang={setLang} />

      {/* Hero Section */}
      <HeroSection onOpenAuth={handleOpenAuth} lang={lang} />

      {/* Live Financial Market Ticker */}
      <LiveMarketTicker lang={lang} />

      {/* Interactive Investment ROI Calculator */}
      <InvestmentCalculator onOpenAuth={handleOpenAuth} lang={lang} />

      {/* Animated Platform Metrics */}
      <StatisticsSection lang={lang} />

      {/* Core Advantages / Why Choose Us */}
      <WhyChooseUs lang={lang} />

      {/* 6-Step Workflow */}
      <HowItWorks lang={lang} />

      {/* VIP Investment Tiers / Packages */}
      <InvestmentPackages onOpenAuth={handleOpenAuth} lang={lang} />

      {/* Interactive Portfolio Mockup Preview */}
      <PortfolioPreview lang={lang} />

      {/* Security & Infrastructure Section */}
      <SecuritySection lang={lang} />

      {/* Company Roadmap Timeline */}
      <CompanyTimeline lang={lang} />

      {/* Verified Member Testimonials */}
      <TestimonialsSection lang={lang} />

      {/* Market News & Insights */}
      <LatestNews lang={lang} />

      {/* FAQ Accordion */}
      <FaqSection lang={lang} />

      {/* Call To Action Banner */}
      <CtaSection onOpenAuth={handleOpenAuth} lang={lang} />

      {/* 24/7 VIP Contact Desk */}
      <ContactSection lang={lang} />

      {/* Comprehensive Footer */}
      <Footer lang={lang} />

      {/* Seamless Auth Modal Trigger */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};
