import { getTourBySlug as getSupabaseTour } from '@/lib/supabase-server';
import { normalizeTourData } from '@/lib/tour-utils';
import { Tour } from '@/types/tour-detail';

export class TourRepository {
  private static cache = new Map<string, { tour: Tour; timestamp: number }>();
  private static CACHE_TTL = 1000 * 60 * 60; // 1 hour cache

  /**
   * Get a tour by its slug with caching
   */
  static async getBySlug(slug: string): Promise<Tour | null> {
    // Check cache first
    const cached = this.cache.get(slug);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.tour;
    }

    // Fetch from database
    const tourData = await getSupabaseTour(slug);
    if (!tourData) return null;

    const tour = normalizeTourData(tourData);
    
    // Update cache
    this.cache.set(slug, { tour, timestamp: Date.now() });
    
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
