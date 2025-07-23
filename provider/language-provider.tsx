"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, defaultLocale, getBrowserLocale, t as translateFunction } from '@/lib/i18n';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize locale on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Try to get saved locale from localStorage
      const savedLocale = localStorage.getItem('pote-locale') as Locale;
      
      if (savedLocale && (savedLocale === 'en' || savedLocale === 'fr')) {
        setLocaleState(savedLocale);
      } else {
        // Use browser locale as default
        const browserLocale = getBrowserLocale();
        setLocaleState(browserLocale);
      }
      
      setIsInitialized(true);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pote-locale', newLocale);
    }
  };

  // Don't render until initialized to avoid hydration issues
  if (!isInitialized) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Hook for easy translation access
export function useTranslation() {
  const { locale } = useLanguage();
  
  const t = translateFunction(locale);

  return { t, locale };
} 