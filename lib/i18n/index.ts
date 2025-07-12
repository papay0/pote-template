import { en } from './en';
import { fr } from './fr';

export type Locale = 'en' | 'fr';

export const defaultLocale: Locale = 'en';

export const translations = {
  en,
  fr,
} as const;

export type TranslationKey = keyof typeof translations.en;

// Get browser locale with fallback
export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;
  
  const browserLang = navigator.language || navigator.languages?.[0] || '';
  
  // Check if it's French
  if (browserLang.toLowerCase().startsWith('fr')) {
    return 'fr';
  }
  
  // Default to English
  return 'en';
}

// Main translation function
export function t(key: TranslationKey, locale?: Locale): string {
  const currentLocale = locale || getBrowserLocale();
  
  // Try to get translation for current locale
  const translation = translations[currentLocale]?.[key];
  if (translation) return translation;
  
  // Fallback to English
  const fallback = translations[defaultLocale][key];
  if (fallback) return fallback;
  
  // Fallback to key if no translation found
  console.warn(`Translation missing for key: ${key}`);
  return key;
}

// Get available locales
export function getAvailableLocales(): Locale[] {
  return Object.keys(translations) as Locale[];
}

// Get locale display name
export function getLocaleDisplayName(locale: Locale): string {
  const names: Record<Locale, string> = {
    en: 'English',
    fr: 'Français',
  };
  return names[locale] || locale;
} 