'use client';

import { useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Locale, defaultLocale, isValidLocale } from './config';
import { TranslationService } from './translation-service';
import { useTranslationContext, useHasTranslationProvider } from './translation-context';

// Hook to get current locale with Next.js 15 compatibility
export function useLocale(): Locale {
  const params = useParams();
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  
  useEffect(() => {
    // Handle async params in Next.js 15
    const resolveLocale = async () => {
      try {
        // If params is a promise, await it
        const resolvedParams = await Promise.resolve(params);
        const localeParam = resolvedParams?.locale as string;
        
        if (localeParam && isValidLocale(localeParam)) {
          setLocale(localeParam);
        } else {
          setLocale(defaultLocale);
        }
      } catch (error) {
        console.warn('Failed to resolve locale from params, using default:', error);
        setLocale(defaultLocale);
      }
    };

    resolveLocale();
  }, [params]);
  
  return locale;
}

// Hook for translations with caching and server-side support
export function useTranslations(context?: string) {
  const hasProvider = useHasTranslationProvider();
  
  // If we have a TranslationProvider (server-side translations), use it
  if (hasProvider) {
    const { locale, t: providerT } = useTranslationContext();
    
    const t = (key: string, values?: Record<string, string>): string => {
      // Try with context prefix first, then fallback to direct key
      if (context) {
        const contextKey = `${context}.${key}`;
        const contextResult = providerT(contextKey, values);
        // Check if translation was found (not equal to the key itself)
        if (contextResult && contextResult !== contextKey && contextResult !== key) {
          return contextResult;
        }
      }
      // Try direct key
      const directResult = providerT(key, values);
      if (directResult && directResult !== key) {
        return directResult;
      }
      // Fallback to the key itself
      return key;
    };

    return {
      t,
      locale,
      loading: false,
      error: null,
      translations: {}
    };
  }

  // Client-side loading
  const locale = useLocale();
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setLoading(true);
        const translationService = TranslationService.getInstance();
        const data = await translationService.getStaticTranslations(locale, context);
        setTranslations(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load translations');
        console.error('Translation loading error:', err);
        // Provide English fallbacks on error
        try {
          const fallbackService = TranslationService.getInstance();
          const fallbackData = await fallbackService.getStaticTranslations('en', context);
          setTranslations(fallbackData);
        } catch {
          // Last resort fallbacks
          setTranslations(getEmergencyTranslations(context));
        }
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [locale, context]);

  const t = (key: string, values?: Record<string, string>): string => {
    let translation: string;
    
    // Try with context prefix first, then fallback to direct key
    if (context) {
      const contextKey = `${context}.${key}`;
      translation = translations[contextKey] || translations[key] || key;
    } else {
      translation = translations[key] || key;
    }
    
    // Handle interpolation
    if (values) {
      Object.entries(values).forEach(([k, v]) => {
        translation = translation.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
      });
    }
    
    return translation;
  };

  return {
    t,
    locale,
    loading,
    error,
    translations
  };
}

// Emergency fallback translations for SSR
function getEmergencyTranslations(context?: string): Record<string, string> {
  const base = {
    // Accessibility
    'accessibility.skip_to_content': 'Skip to main content',
    'accessibility.home': 'Home',
    'accessibility.tours': 'Tours',
    'accessibility.javascript_required': 'JavaScript is required for the best experience',
    'accessibility.call_to_book': 'Call +27 21 424 5215 to book',
    
    // Tour detail
    'tour_detail.about_experience': 'About This Experience',
    'tour_detail.tour_highlights': 'Tour Highlights',
    'tour_detail.your_journey': 'Your Journey',
    'tour_detail.important_information': 'Important Information',
    'tour_detail.frequently_asked_questions': 'Frequently Asked Questions',
    'tour_detail.tour_location': 'Tour Location',
    'tour_detail.view_on_google_maps': 'View on Google Maps',
    'tour_detail.best_price_guarantee': 'Best Price Guarantee',
    'tour_detail.people_viewing_now': 'people viewing now',
    'tour_detail.booked_today': 'booked today',
    'tour_detail.max_group_size': 'Max Group Size',
  };

  if (context) {
    const contextual: Record<string, string> = {};
    Object.entries(base).forEach(([key, value]) => {
      contextual[key.replace(`${context}.`, '')] = value;
      contextual[key] = value;
    });
    return contextual;
  }
  
  return base;
}

// Immediate fallbacks for common translation keys
function getImmediateFallback(key: string, context?: string): string | null {
  const fallbacks: Record<string, string> = {
    'skip_to_content': 'Skip to main content',
    'home': 'Home',
    'tours': 'Tours',
    'about_experience': 'About This Experience',
    'tour_highlights': 'Tour Highlights',
    'your_journey': 'Your Journey',
    'important_information': 'Important Information',
    'frequently_asked_questions': 'Frequently Asked Questions',
    'tour_location': 'Tour Location',
    'view_on_google_maps': 'View on Google Maps',
    'best_price_guarantee': 'Best Price Guarantee',
    'people_viewing_now': 'people viewing now',
    'booked_today': 'booked today',
    'max_group_size': 'Max Group Size',
    'departure': 'Departure',
    'pickup': 'Pickup',
    'duration': 'Duration',
    'meeting_point': 'Meeting Point',
    'getting_there': 'Getting There',
    'pickup_included': 'Hotel pickup included',
    'self_drive': 'Meet at location',
    'details_after_booking': 'Details provided after booking'
  };
  
  return fallbacks[key] || null;
}

// Hook for pathname without locale
export function usePathnameWithoutLocale(): string {
  const pathname = usePathname();
  const locale = useLocale();
  
  if (locale === defaultLocale) {
    return pathname;
  }
  
  return pathname.replace(`/${locale}`, '') || '/';
}

// Hook for creating localized links
export function useLocalizedPath() {
  const locale = useLocale();
  
  const getLocalizedPath = (path: string, targetLocale?: Locale): string => {
    const targetLoc = targetLocale || locale;
    
    if (targetLoc === defaultLocale) {
      return path;
    }
    
    return `/${targetLoc}${path}`;
  };

  return { getLocalizedPath, locale };
}

// Hook for language switching
export function useLanguageSwitcher() {
  const pathname = usePathnameWithoutLocale();
  const currentLocale = useLocale();

  const switchLanguage = (newLocale: Locale) => {
    const newPath = newLocale === defaultLocale 
      ? pathname 
      : `/${newLocale}${pathname}`;
    
    // Set cookie for persistence
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Navigate to new locale
    window.location.href = newPath;
  };

  return {
    currentLocale,
    switchLanguage,
    pathname
  };
}

// Hook for RTL support
export function useDirection() {
  const locale = useLocale();
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    const config = {
      en: 'ltr',
      de: 'ltr',
      fr: 'ltr',
      es: 'ltr',
      ar: 'rtl'
    } as const;
    
    setDirection(config[locale]);
    
    // Update document direction
    document.documentElement.dir = config[locale];
    document.documentElement.lang = locale;
  }, [locale]);

  return direction;
}

// Hook for currency formatting
export function useCurrency() {
  const locale = useLocale();

  const formatPrice = (amount: number): string => {
    const currencyMap = {
      en: { currency: 'USD', locale: 'en-US' },
      de: { currency: 'EUR', locale: 'de-DE' },
      fr: { currency: 'EUR', locale: 'fr-FR' },
      es: { currency: 'EUR', locale: 'es-ES' },
      ar: { currency: 'SAR', locale: 'ar-SA' }
    };

    const config = currencyMap[locale];
    
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return { formatPrice, locale };
}

// Hook for date formatting
export function useDateFormat() {
  const locale = useLocale();

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const localeMap = {
      en: 'en-US',
      de: 'de-DE',
      fr: 'fr-FR',
      es: 'es-ES',
      ar: 'ar-SA'
    };

    return new Intl.DateTimeFormat(localeMap[locale], {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj);
  };

  const formatDateTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const localeMap = {
      en: 'en-US',
      de: 'de-DE',
      fr: 'fr-FR',
      es: 'es-ES',
      ar: 'ar-SA'
    };

    return new Intl.DateTimeFormat(localeMap[locale], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };

  return { formatDate, formatDateTime, locale };
}

// Hook for number formatting
export function useNumberFormat() {
  const locale = useLocale();

  const formatNumber = (number: number): string => {
    const localeMap = {
      en: 'en-US',
      de: 'de-DE',
      fr: 'fr-FR',
      es: 'es-ES',
      ar: 'ar-SA'
    };

    return new Intl.NumberFormat(localeMap[locale]).format(number);
  };

  return { formatNumber, locale };
}
