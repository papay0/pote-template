import { en } from './en';
import { fr } from './fr';

// Define the strict translation protocol/interface
export interface TranslationProtocol {
  home: {
    getStarted: string;
    saveAndSee: string;
    deployNow: string;
    readDocs: string;
  };
  footer: {
    learn: string;
    examples: string;
    goToNextjs: string;
    language: string;
  };
  layout: {
    title: string;
    description: string;
  };
}


export type Locale = 'en' | 'fr';

export const defaultLocale: Locale = 'en';

// Validate that en implements the protocol (used as the source of truth)
const _validateEn: TranslationProtocol = en;

// Validate that fr implements the protocol (must match en structure)
const _validateFr: TranslationProtocol = fr;

// Compile-time validated translations
export const translations = {
  en: _validateEn,
  fr: _validateFr,
} as const;

// Deep readonly type for translation objects
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Type for the translation structure (now based on the protocol)
export type TranslationStructure = DeepReadonly<TranslationProtocol>;


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

// Simple proxy to enable object-style access to translations
function createTranslationProxy<T>(obj: T): T {
  return new Proxy(obj as object, {
    get(target: Record<string, unknown>, prop) {
      const key = String(prop);
      const value = target[key];
      
      if (typeof value === 'object' && value !== null) {
        // Return a proxy for nested objects
        return createTranslationProxy(value);
      } else {
        // Return the string value (guaranteed to exist due to TypeScript)
        return value;
      }
    }
  }) as T;
}

// Main translation function that returns the translation object
export function t(locale?: Locale): TranslationStructure {
  const currentLocale = locale || getBrowserLocale();
  const currentTranslations = translations[currentLocale];
  
  return createTranslationProxy(currentTranslations) as TranslationStructure;
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