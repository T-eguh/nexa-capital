import React, { useState, useEffect } from 'react';
import {
  Shield,
  Menu,
  X,
  Globe,
  Sun,
  Moon,
  LogIn,
  UserPlus,
  TrendingUp,
} from 'lucide-react';
import { NexaCapitalLogo } from '../NexaCapitalLogo';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  onOpenAuth: (mode: 'LOGIN' | 'REGISTER') => void;
  lang: 'ID' | 'EN';
  setLang: (lang: 'ID' | 'EN') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, lang, setLang }) => {
  const { isDarkMode, toggleDarkMode, theme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: lang === 'ID' ? 'Beranda' : 'Home', href: '#hero' },
    { name: lang === 'ID' ? 'Paket VIP' : 'Packages', href: '#packages' },
    { name: lang === 'ID' ? 'Kalkulator' : 'Calculator', href: '#calculator' },
    { name: lang === 'ID' ? 'Keunggulan' : 'Features', href: '#features' },
    { name: lang === 'ID' ? 'FAQ' : 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-3'
          : 'bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center space-x-2 group">
          <NexaCapitalLogo size="md" showText={true} />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-blue-400 transition-colors py-1 relative group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-200 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Right Actions (Theme, Language, Auth) */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'ID' ? 'EN' : 'ID')}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Ganti Bahasa"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>{lang}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 transition-all cursor-pointer"
            title="Ubah Tema"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Login Button */}
          <button
            onClick={() => onOpenAuth('LOGIN')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-bold text-white transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-blue-400" />
            <span>{lang === 'ID' ? 'Masuk' : 'Login'}</span>
          </button>

          {/* Register CTA */}
          <button
            onClick={() => onOpenAuth('REGISTER')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{lang === 'ID' ? 'Daftar Akun' : 'Register'}</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center space-x-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800 px-4 pt-4 pb-6 mt-2 space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-medium text-slate-300 hover:text-blue-400 p-2 rounded-lg hover:bg-slate-900"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex flex-col space-y-2 pt-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAuth('LOGIN');
              }}
              className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold text-white flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4 text-blue-400" />
              <span>{lang === 'ID' ? 'Masuk Akun' : 'Login'}</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAuth('REGISTER');
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30"
            >
              <UserPlus className="w-4 h-4" />
              <span>{lang === 'ID' ? 'Daftar Akun Baru' : 'Create Free Account'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
