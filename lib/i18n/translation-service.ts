import { createClient } from '@supabase/supabase-js';
import { Locale } from './config';
import { TranslationEntry, TourTranslation } from '@/types/i18n';
import { logError, logInfo, logWarn } from '@/lib/error-logger';

export class TranslationService {
  private static instance: TranslationService;
  private supabase;
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  private constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  // Cache management
  private getCacheKey(key: string, locale: Locale, context?: string): string {
    return `${key}:${locale}:${context || 'default'}`;
  }

  private setCache(key: string, data: any, ttl: number = 3600000): void { // 1 hour default
    // Skip caching in development
    if (process.env.NODE_ENV === 'development') return;
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private getCache(key: string): any | null {
    // Skip cache in development
    if (process.env.NODE_ENV === 'development') return null;
    
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.timestamp + item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  private clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // Static translations
  async getStaticTranslation(key: string, locale: Locale): Promise<string | null> {
    const cacheKey = this.getCacheKey(key, locale);
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await this.supabase
        .from('static_translations')
        .select('value')
        .eq('key', key)
        .eq('locale', locale)
        .eq('is_approved', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      const value = data.value;
      this.setCache(cacheKey, value);
      return value;
    } catch (error) {
      logError('Error fetching static translation from database', error, {
        component: 'TranslationService',
        function: 'getStaticTranslation',
        key,
        locale,
        action: 'fetch_static_translation'
      });
      return null;
    }
  }

  async getStaticTranslations(locale: Locale, context?: string): Promise<Record<string, string>> {
    const cacheKey = this.getCacheKey('static_translations', locale, context);
    const cached = this.getCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // First try to get from database
      let query = this.supabase
        .from('static_translations')
        .select('key, value')
        .eq('locale', locale)
        .eq('is_approved', true);

      if (context) {
        query = query.eq('context', context);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        const translations = data.reduce((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {} as Record<string, string>);

        this.setCache(cacheKey, translations);
        return translations;
      }

      // Fallback to static JSON files
      const staticTranslations = await this.loadStaticTranslations(locale, context);
      this.setCache(cacheKey, staticTranslations);
      return staticTranslations;
    } catch (error) {
      logError('Error fetching static translations from database', error, {
        component: 'TranslationService',
        function: 'getStaticTranslations',
        locale,
        context,
        action: 'fetch_static_translations'
      });
      // Fallback to static JSON files
      try {
        const staticTranslations = await this.loadStaticTranslations(locale, context);
        this.setCache(cacheKey, staticTranslations);
        return staticTranslations;
      } catch (fallbackError) {
        logError('Error loading static translations fallback', fallbackError, {
          component: 'TranslationService',
          function: 'getStaticTranslations',
          locale,
          context,
          action: 'fallback_error'
        });
        return {};
      }
    }
  }

  private async loadStaticTranslations(locale: Locale, context?: string): Promise<Record<string, string>> {
    try {
      // Use static imports to avoid webpack issues
      let allTranslations: any;
      
      switch (locale) {
        case 'en':
          allTranslations = (await import('@/messages/en.json')).default;
          break;
        case 'de':
          allTranslations = (await import('@/messages/de.json')).default;
          break;
        case 'fr':
          allTranslations = (await import('@/messages/fr.json')).default;
          break;
        case 'es':
          allTranslations = (await import('@/messages/es.json')).default;
          break;
        case 'ar':
          allTranslations = (await import('@/messages/ar.json')).default;
          break;
        default:
          // Fallback to English for unknown locales
          allTranslations = (await import('@/messages/en.json')).default;
          break;
      }
      
      if (context) {
        // Return only the specific context
        return allTranslations[context] || {};
      }
      
      // Flatten all translations into a single object
      const flattened: Record<string, string> = {};
      
      function flattenObject(obj: any, prefix: string = '') {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const newKey = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
              flattenObject(obj[key], newKey);
            } else {
              flattened[newKey] = String(obj[key]);
            }
          }
        }
      }
      
      flattenObject(allTranslations);
      return flattened;
    } catch (error) {
      logError(`Failed to load static translations for locale ${locale}`, error, {
        component: 'TranslationService',
        function: 'loadStaticTranslations',
        locale,
        context,
        action: 'load_static_files'
      });
      // Final fallback to English
      if (locale !== 'en') {
        return this.loadStaticTranslations('en', context);
      }
      return {};
    }
  }

  async setStaticTranslation(
    key: string, 
    locale: Locale, 
    value: string, 
    context?: string,
    description?: string
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('static_translations')
        .upsert({
          key,
          locale,
          value,
          context,
          description,
          is_approved: false, // Requires approval
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Clear cache for this key and locale
      this.clearCache(`${key}:${locale}`);
    } catch (error) {
      logError('Error setting static translation in database', error, {
        component: 'TranslationService',
        function: 'setStaticTranslation',
        key,
        locale,
        action: 'set_static_translation'
      });
      throw error;
    }
  }

  // Tour translations
  async getTourTranslation(tourId: string, locale: Locale): Promise<TourTranslation | null> {
    const cacheKey = this.getCacheKey(`tour:${tourId}`, locale);
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await this.supabase
        .from('tour_translations')
        .select('*')
        .eq('tour_id', tourId)
        .eq('locale', locale)
        .eq('translation_quality', 'published')
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      // Transform database response to match our types
      const translation: TourTranslation = {
        id: data.id,
        tourId: data.tour_id,
        locale: data.locale,
        title: data.title,
        description: data.description,
        shortDescription: data.short_description,
        highlights: data.highlights || [],
        inclusions: data.inclusions || [],
        exclusions: data.exclusions || [],
        importantInfo: data.important_info || [],
        whatToBring: data.what_to_bring || [],
        itinerary: data.itinerary || [],
        faqs: data.faqs || [],
        metaTitle: data.meta_title,
        metaDescription: data.meta_description,
        metaKeywords: data.meta_keywords || [],
        translationQuality: data.translation_quality,
        translatedBy: data.translated_by,
        reviewedBy: data.reviewed_by,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      this.setCache(cacheKey, translation);
      return translation;
    } catch (error) {
      logError('Error fetching tour translation from database', error, {
        component: 'TranslationService',
        function: 'getTourTranslation',
        tourId,
        locale,
        action: 'fetch_tour_translation'
      });
      return null;
    }
  }

  async setTourTranslation(
    tourId: string,
    locale: Locale,
    translation: Partial<TourTranslation>
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('tour_translations')
        .upsert({
          tour_id: tourId,
          locale,
          title: translation.title,
          description: translation.description,
          short_description: translation.shortDescription,
          highlights: translation.highlights,
          inclusions: translation.inclusions,
          exclusions: translation.exclusions,
          important_info: translation.importantInfo,
          what_to_bring: translation.whatToBring,
          itinerary: translation.itinerary,
          faqs: translation.faqs,
          meta_title: translation.metaTitle,
          meta_description: translation.metaDescription,
          meta_keywords: translation.metaKeywords,
          translation_quality: translation.translationQuality || 'draft',
          translated_by: translation.translatedBy,
          reviewed_by: translation.reviewedBy,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Clear cache
      this.clearCache(`tour:${tourId}:${locale}`);
    } catch (error) {
      logError('Error setting tour translation in database', error, {
        component: 'TranslationService',
        function: 'setTourTranslation',
        tourId,
        locale,
        action: 'set_tour_translation'
      });
      throw error;
    }
  }

  // Bulk operations
  async getMultipleTranslations(keys: string[], locale: Locale): Promise<Record<string, string>> {
    const results: Record<string, string> = {};
    const uncachedKeys: string[] = [];

    // Check cache first
    for (const key of keys) {
      const cacheKey = this.getCacheKey(key, locale);
      const cached = this.getCache(cacheKey);
      if (cached) {
        results[key] = cached;
      } else {
        uncachedKeys.push(key);
      }
    }

    // Fetch uncached keys
    if (uncachedKeys.length > 0) {
      try {
        const { data, error } = await this.supabase
          .from('static_translations')
          .select('key, value')
          .in('key', uncachedKeys)
          .eq('locale', locale)
          .eq('is_approved', true);

        if (error) throw error;

        for (const item of data) {
          results[item.key] = item.value;
          const cacheKey = this.getCacheKey(item.key, locale);
          this.setCache(cacheKey, item.value);
        }
      } catch (error) {
        logError('Error fetching multiple translations from database', error, {
          component: 'TranslationService',
          function: 'getMultipleTranslations',
          locale,
          keyCount: uncachedKeys.length,
          action: 'fetch_multiple_translations'
        });
      }
    }

    return results;
  }

  // Translation management
  async approveTranslation(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('static_translations')
        .update({ 
          is_approved: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Clear all cache since we don't know which translation was approved
      this.clearCache();
    } catch (error) {
      logError('Error approving translation in database', error, {
        component: 'TranslationService',
        function: 'approveTranslation',
        translationId: id,
        action: 'approve_translation'
      });
      throw error;
    }
  }

  async getPendingTranslations(locale?: Locale): Promise<TranslationEntry[]> {
    try {
      let query = this.supabase
        .from('static_translations')
        .select('*')
        .eq('is_approved', false);

      if (locale) {
        query = query.eq('locale', locale);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(item => ({
        key: item.key,
        locale: item.locale,
        value: item.value,
        context: item.context,
        description: item.description,
        isApproved: item.is_approved,
        translatedBy: item.translated_by,
        reviewedBy: item.reviewed_by,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch (error) {
      logError('Error fetching pending translations from database', error, {
        component: 'TranslationService',
        function: 'getPendingTranslations',
        locale,
        action: 'fetch_pending_translations'
      });
      return [];
    }
  }

  // Utility methods
  async getAvailableLocales(): Promise<Locale[]> {
    try {
      const { data, error } = await this.supabase
        .from('locales')
        .select('code')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;

      return data.map(item => item.code as Locale);
    } catch (error) {
      logError('Error fetching available locales from database', error, {
        component: 'TranslationService',
        function: 'getAvailableLocales',
        action: 'fetch_available_locales'
      });
      return ['en']; // Fallback
    }
  }

  // Clear all cache
  clearAllCache(): void {
    this.cache.clear();
  }
}
