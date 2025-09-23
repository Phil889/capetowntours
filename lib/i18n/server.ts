import { Locale, defaultLocale, isValidLocale } from './config';

// Pre-import all translation files for optimal SSR performance
import enTranslations from '@/messages/en.json';
import deTranslations from '@/messages/de.json';
import frTranslations from '@/messages/fr.json';
import esTranslations from '@/messages/es.json';
import arTranslations from '@/messages/ar.json';

// Static translation registry for fast SSR lookups
const translationRegistry: Record<Locale, any> = {
  en: enTranslations,
  de: deTranslations,
  fr: frTranslations,
  es: esTranslations,
  ar: arTranslations,
};

// Server-side translation loader optimized for SSR
export async function getTranslations(locale: Locale) {
  // Validate locale
  if (!isValidLocale(locale)) {
    console.warn(`Invalid locale '${locale}', falling back to '${defaultLocale}'`);
    return translationRegistry[defaultLocale];
  }

  // Return pre-loaded translations for optimal performance
  return translationRegistry[locale] || translationRegistry[defaultLocale];
}

// Get nested translation value with dot notation
export function getTranslationValue(translations: any, key: string): string {
  const keys = key.split('.');
  let value = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key;
}

// Simple translation function for server-side use
export async function t(locale: Locale, key: string): Promise<string> {
  const translations = await getTranslations(locale);
  return getTranslationValue(translations, key);
}

// Batch translation loading for components
export async function getTranslationsForKeys(locale: Locale, keys: string[]): Promise<Record<string, string>> {
  const translations = await getTranslations(locale);
  const result: Record<string, string> = {};
  
  for (const key of keys) {
    result[key] = getTranslationValue(translations, key);
  }
  
  return result;
}

// Get translations for a specific section/namespace
export async function getSectionTranslations(locale: Locale, section: string) {
  const translations = await getTranslations(locale);
  return translations[section] || {};
}

// Get all available locales with their configurations
export function getAvailableLocales() {
  return Object.keys(translationRegistry) as Locale[];
}

// Check if a locale has complete translations
export function hasCompleteTranslations(locale: Locale): boolean {
  return locale in translationRegistry;
}

// Get locale direction for RTL support
export function getLocaleDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

// Format numbers according to locale
export function formatNumber(locale: Locale, number: number): string {
  try {
    return new Intl.NumberFormat(locale === 'en' ? 'en-US' : locale).format(number);
  } catch {
    return number.toString();
  }
}

// Format currency according to locale
export function formatCurrency(locale: Locale, amount: number): string {
  const currencyMap = {
    en: { code: 'USD', locale: 'en-US' },
    de: { code: 'EUR', locale: 'de-DE' },
    fr: { code: 'EUR', locale: 'fr-FR' },
    es: { code: 'EUR', locale: 'es-ES' },
    ar: { code: 'SAR', locale: 'ar-SA' },
  };
  
  const config = currencyMap[locale] || currencyMap.en;
  
  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
    }).format(amount);
  } catch {
    return `${config.code} ${amount}`;
  }
}

// Format date according to locale
export function formatDate(locale: Locale, date: Date): string {
  const localeMap = {
    en: 'en-US',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
    ar: 'ar-SA',
  };
  
  try {
    return new Intl.DateTimeFormat(localeMap[locale] || localeMap.en).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}