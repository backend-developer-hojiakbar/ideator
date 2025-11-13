import React, { createContext, useState, useEffect, useContext } from 'react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, ...args: (string | number)[]) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper to resolve nested keys like 'auth.title'
const resolve = (path: string, obj: any) => {
    return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null;
    }, obj || self);
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
        const storedLang = localStorage.getItem('lang');
        return (storedLang as Language) || 'uz-Latn';
    } catch {
        return 'uz-Latn';
    }
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang.split('-')[0];
  }, [lang]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };
  
  const t = (key: string, ...args: (string | number)[]) => {
      let value = resolve(key, translations[lang]);
      if (typeof value === 'string') {
          return value.replace(/{(\d+)}/g, (match, number) => {
              return typeof args[number] !== 'undefined' ? String(args[number]) : match;
          });
      }
      return value || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
