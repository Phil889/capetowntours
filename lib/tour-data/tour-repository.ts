import { getTourBySlug as getSupabaseTour, getTourBySlugAndLocale as getSupabaseTourLocalized } from '@/lib/supabase-server';
import { normalizeTourData } from '@/lib/tour-utils';
import { Tour } from '@/types/tour-detail';
import { Locale } from '@/lib/i18n/config';

export class TourRepository {
  private static cache = new Map<string, { tour: Tour; timestamp: number }>();
  private static CACHE_TTL = 1000 * 60 * 60; // 1 hour cache

  /**
   * Get a tour by its slug with caching
   */
  static async getBySlug(slug: string): Promise<Tour | null> {
    // Skip cache in development
    if (process.env.NODE_ENV !== 'development') {
      const cached = this.cache.get(slug);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.tour;
      }
    }

    // Fetch from database
    const tourData = await getSupabaseTour(slug);
    if (!tourData) return null;

    const tour = normalizeTourData(tourData);
    
    // Update cache only in production
    if (process.env.NODE_ENV !== 'development') {
      this.cache.set(slug, { tour, timestamp: Date.now() });
    }
    
    return tour;
  }

  /**
   * Get a tour by its slug and locale with caching and translation support
   */
  static async getBySlugAndLocale(slug: string, locale: Locale): Promise<Tour | null> {
    const cacheKey = `${slug}:${locale}`;
    
    // Skip cache in development
    if (process.env.NODE_ENV !== 'development') {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.tour;
      }
    }

    // Fetch from database with locale support
    const tourData = await getSupabaseTourLocalized(slug, locale);
    if (!tourData) return null;

    const tour = normalizeTourData(tourData);
    
    // Update cache only in production
    if (process.env.NODE_ENV !== 'development') {
      this.cache.set(cacheKey, { tour, timestamp: Date.now() });
    }
    
    return tour;
  }

  /**
   * Clear the cache for a specific tour or all tours
   */
  static clearCache(slug?: string) {
    if (slug) {
      this.cache.delete(slug);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Prefetch multiple tours for better performance
   */
  static async prefetchTours(slugs: string[]): Promise<void> {
    await Promise.all(slugs.map(slug => this.getBySlug(slug)));
  }
}
