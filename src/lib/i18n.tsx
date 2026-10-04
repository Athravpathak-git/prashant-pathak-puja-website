'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import mrTranslations from './locales/mr.json';
import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';
import teTranslations from './locales/te.json';
import knTranslations from './locales/kn.json';
import taTranslations from './locales/ta.json';
import mlTranslations from './locales/ml.json';

export type Language = 'mr' | 'en' | 'hi' | 'te' | 'kn' | 'ta' | 'ml';

export const LANGUAGES: { code: Language; name: string; nativeName: string }[] = [
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
];

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, fallback?: string) => string;
  getLocalized: (item: any, field: string) => string;
}

const translations: Record<Language, any> = {
  mr: mrTranslations,
  en: enTranslations,
  hi: hiTranslations,
  te: teTranslations,
  kn: knTranslations,
  ta: taTranslations,
  ml: mlTranslations,
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('mr');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check localStorage
    const saved = localStorage.getItem('pp_preferred_language') as Language;
    const validLanguages: Language[] = ['mr', 'en', 'hi', 'te', 'kn', 'ta', 'ml'];
    if (saved && validLanguages.includes(saved)) {
      setLanguageState(saved);
      document.cookie = `pp_language=${saved}; path=/; max-age=31536000; SameSite=Lax`;
    } else {
      // Default to Marathi
      setLanguageState('mr');
      document.cookie = `pp_language=mr; path=/; max-age=31536000; SameSite=Lax`;
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('pp_preferred_language', lang);
    document.cookie = `pp_language=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    let current: any = translations[language];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to Marathi, then English, then supplied fallback
        let fallbackVal = translations.mr;
        for (const fKey of keys) {
          if (fallbackVal && typeof fallbackVal === 'object' && fKey in fallbackVal) {
            fallbackVal = fallbackVal[fKey];
          } else {
            fallbackVal = undefined;
            break;
          }
        }
        if (typeof fallbackVal === 'string') return fallbackVal;

        let enFallback = translations.en;
        for (const efKey of keys) {
          if (enFallback && typeof enFallback === 'object' && efKey in enFallback) {
            enFallback = enFallback[efKey];
          } else {
            enFallback = undefined;
            break;
          }
        }
        if (typeof enFallback === 'string') return enFallback;

        return fallback || path;
      }
    }

    return typeof current === 'string' ? current : fallback || path;
  };

  const getLocalized = (item: any, field: string): string => {
    if (!item) return '';
    const currentLangKey = `${field}_${language}`;
    const mrLangKey = `${field}_mr`;
    const enLangKey = `${field}_en`;

    if (item[currentLangKey] && String(item[currentLangKey]).trim() !== '') {
      return String(item[currentLangKey]);
    }
    if (item[mrLangKey] && String(item[mrLangKey]).trim() !== '') {
      return String(item[mrLangKey]);
    }
    if (item[enLangKey] && String(item[enLangKey]).trim() !== '') {
      return String(item[enLangKey]);
    }
    if (item[field] && String(item[field]).trim() !== '') {
      return String(item[field]);
    }
    return '';
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, getLocalized }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within a LanguageProvider');
  }
  return context;
}
