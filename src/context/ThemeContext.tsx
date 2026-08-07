import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppThemeConfig, ThemePreset } from '../types';
import { INITIAL_APP_THEME, INITIAL_THEME_PRESETS } from '../data/initialData';

interface ThemeContextType {
  theme: AppThemeConfig;
  presets: ThemePreset[];
  activePreset: ThemePreset;
  updateTheme: (newTheme: Partial<AppThemeConfig>) => void;
  applyPreset: (presetId: string) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<AppThemeConfig>(() => {
    const saved = localStorage.getItem('nexainvest_theme_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved theme', e);
      }
    }
    return INITIAL_APP_THEME;
  });

  const presets = INITIAL_THEME_PRESETS;

  const activePreset = presets.find((p) => p.id === theme.presetId) || presets[0];

  useEffect(() => {
    localStorage.setItem('nexainvest_theme_config', JSON.stringify(theme));

    // Update document root variables for dynamic tailwind or inline styles
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);

    if (theme.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const updateTheme = (newTheme: Partial<AppThemeConfig>) => {
    setTheme((prev) => ({ ...prev, ...newTheme }));
  };

  const applyPreset = (presetId: string) => {
    const found = presets.find((p) => p.id === presetId);
    if (found) {
      setTheme({
        ...theme,
        presetId: found.id,
        brandName: found.brandName,
        brandTagline: found.brandTagline,
        brandIconName: found.brandIcon,
        primaryColor: found.primaryColor,
        accentColor: found.accentColor,
        isDarkMode: found.darkCanvas,
      });
    }
  };

  const resetTheme = () => {
    setTheme(INITIAL_APP_THEME);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        presets,
        activePreset,
        updateTheme,
        applyPreset,
        resetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
