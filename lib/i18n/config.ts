// Internationalization configuration
export const locales = ['en', 'de', 'fr', 'es', 'ar'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'en';

export const localeConfig = {
  en: { 
    name: 'English', 
    nativeName: 'English',
    flag: '🇺🇸', 
    dir: 'ltr' as const,
    currency: 'USD',
    region: 'US',
    dateFormat: 'MM/dd/yyyy'
  },
  de: { 
    name: 'German', 
    nativeName: 'Deutsch',
    flag: '🇩🇪', 
    dir: 'ltr' as const,
    currency: 'EUR',
    region: 'DE',
    dateFormat: 'dd.MM.yyyy'
  },
  fr: { 
    name: 'French', 
    nativeName: 'Français',
    flag: '🇫🇷', 
    dir: 'ltr' as const,
    currency: 'EUR',
    region: 'FR',
    dateFormat: 'dd/MM/yyyy'
  },
  es: { 
    name: 'Spanish', 
    nativeName: 'Español',
    flag: '🇪🇸', 
    dir: 'ltr' as const,
    currency: 'EUR',
    region: 'ES',
    dateFormat: 'dd/MM/yyyy'
  },
  ar: { 
    name: 'Arabic', 
    nativeName: 'العربية',
    flag: '🇸🇦', 
    dir: 'rtl' as const,
    currency: 'SAR',
    region: 'SA',
    dateFormat: 'dd/MM/yyyy'
  }
} as const;

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleConfig(locale: Locale) {
  return localeConfig[locale];
}

export function getOppositeDirection(locale: Locale): 'ltr' | 'rtl' {
  return localeConfig[locale].dir === 'rtl' ? 'ltr' : 'rtl';
}

// URL path helpers
export function getLocalizedPath(path: string, locale: Locale): string {
  if (locale === defaultLocale) {
    return path;
  }
  return `/${locale}${path}`;
}

export function removeLocaleFromPath(path: string): { locale: Locale; path: string } {
  const segments = path.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && isValidLocale(firstSegment)) {
    return {
      locale: firstSegment,
      path: '/' + segments.slice(1).join('/')
    };
  }
  
  return {
    locale: defaultLocale,
    path
  };
}