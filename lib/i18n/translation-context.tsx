'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Locale } from './config';

interface TranslationContextType {
  locale: Locale;
  translations: Record<string, string>;
  t: (key: string, values?: Record<string, string>) => string;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

interface TranslationProviderProps {
  children: ReactNode;
  locale: Locale;
  translations: Record<string, string>;
  context?: string;
}

export function TranslationProvider({ children, locale, translations, context }: TranslationProviderProps) {
  const t = (key: string, values?: Record<string, string>): string => {
    // Get translation with context prefix if provided
    const contextKey = context ? `${context}.${key}` : key;
    let translation = translations[contextKey] || translations[key] || key;
    
    // Handle interpolation
    if (values) {
      Object.entries(values).forEach(([k, v]) => {
        translation = translation.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
      });
    }
    
    return translation;
  };

  const value = {
    locale,
    translations,
    t
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslationContext must be used within a TranslationProvider');
  }
  return context;
}

// Hook to check if we're inside a TranslationProvider
export function useHasTranslationProvider() {
  return useContext(TranslationContext) !== null;
}