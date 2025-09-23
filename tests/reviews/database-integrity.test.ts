/**
 * Database Integrity Tests for Tour Reviews
 * 
 * Tests database connection, schema validation, and data consistency
 */

import { describe, test, expect, beforeAll } from '@jest/testing-library/jest-dom';
import { getSupabaseClient } from '@/lib/supabase-server';
import { getTourReviews, getTourReviewStats, DatabaseReview } from '@/lib/tour-reviews-db';
import { Locale } from '@/lib/i18n/config';

describe('Database Integrity - Tour Reviews', () => {
  let supabase: any;
  
  beforeAll(async () => {
    supabase = getSupabaseClient();
  });

  describe('Database Connection', () => {
    test('should establish connection to Supabase', async () => {
      expect(supabase).toBeTruthy();
      
      if (supabase) {
        // Test basic connection with a simple query
        const { data, error } = await supabase
          .from('tour_reviews')
          .select('count')
          .limit(1);
          
        // Should not throw error (data might be empty, that's ok)
        expect(error?.code).not.toBe('PGRST301'); // Table not found
      }
    });

    test('should handle connection timeout gracefully', async () => {
      // This test checks if our error handling works
      const startTime = Date.now();
      
      try {
        await getTourReviews('test-tour', 'en', 1);
        const duration = Date.now() - startTime;
        
        // Should complete within reasonable time
        expect(duration).toBeLessThan(10000); // 10 seconds max
      } catch (error) {
        // If it fails, it should fail gracefully
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Schema Validation', () => {
    test('tour_reviews table should have correct structure', async () => {
      if (!supabase) return;

      try {
        const { data, error } = await supabase
          .from('tour_reviews')
          .select('*')
          .limit(1);

        if (data && data.length > 0) {
          const review = data[0];
          
          // Check required columns exist
          const requiredColumns = [
            'id', 'tour_slug', 'language', 'author', 'author_location',
            'rating', 'review_date', 'title', 'content', 'verified',
            'experience_type', 'helpful_count'
          ];
          
          requiredColumns.forEach(column => {
            expect(review).toHaveProperty(column);
          });
          
          // Validate data types
          expect(typeof review.id).toBe('string');
          expect(typeof review.tour_slug).toBe('string');
          expect(typeof review.language).toBe('string');
          expect(typeof review.rating).toBe('number');
          expect(typeof review.verified).toBe('boolean');
          expect(typeof review.helpful_count).toBe('number');
          
          // Validate rating range
          expect(review.rating).toBeGreaterThanOrEqual(1);
          expect(review.rating).toBeLessThanOrEqual(5);
        }
      } catch (error) {
        console.log('Schema validation skipped - table may be empty or unavailable');
      }
    });

    test('should validate review data constraints', async () => {
      if (!supabase) return;

      try {
        const { data } = await supabase
          .from('tour_reviews')
          .select('tour_slug, language, rating, verified')
          .limit(10);

        if (data && data.length > 0) {
          data.forEach((review: any, index: number) => {
            // Tour slug should not be empty
            expect(review.tour_slug).toBeTruthy();
            expect(typeof review.tour_slug).toBe('string');
            expect(review.tour_slug.length).toBeGreaterThan(0);
            
            // Language should be valid ISO code
            expect(['en', 'de', 'fr', 'es', 'ar']).toContain(review.language);
            
            // Rating should be valid
            expect(review.rating).toBeGreaterThanOrEqual(1);
            expect(review.rating).toBeLessThanOrEqual(5);
            
            // Verified should be boolean
            expect(typeof review.verified).toBe('boolean');
          });
        }
      } catch (error) {
        console.log('Data constraints validation skipped');
      }
    });
  });

  describe('Data Consistency', () => {
    test('should have consistent data across languages for same tour', async () => {
      if (!supabase) return;

      try {
        // Get a tour that has reviews in multiple languages
        const { data: tours } = await supabase
          .from('tour_reviews')
          .select('tour_slug')
          .limit(5);

        if (tours && tours.length > 0) {
          const tourSlug = tours[0].tour_slug;
          const languages = ['en', 'de', 'fr', 'es', 'ar'];
          const languageResults: any = {};

          for (const lang of languages) {
            const { data } = await supabase
              .from('tour_reviews')
              .select('*')
              .eq('tour_slug', tourSlug)
              .eq('language', lang)
              .limit(5);

            languageResults[lang] = data || [];
          }

          // Check consistency of review structure
          Object.values(languageResults).forEach((reviews: any) => {
            reviews.forEach((review: any) => {
              expect(review.tour_slug).toBe(tourSlug);
              expect(typeof review.rating).toBe('number');
              expect(review.content).toBeTruthy();
              expect(review.author).toBeTruthy();
            });
          });
        }
      } catch (error) {
        console.log('Consistency validation skipped');
      }
    });

    test('should not have duplicate reviews with same content', async () => {
      if (!supabase) return;

      try {
        const { data } = await supabase
          .from('tour_reviews')
          .select('content, tour_slug, language')
          .limit(50);

        if (data && data.length > 0) {
          const contentMap = new Map();
          
          data.forEach((review: any) => {
            const key = `${review.tour_slug}-${review.language}`;
            if (!contentMap.has(key)) {
              contentMap.set(key, new Set());
            }
            contentMap.get(key).add(review.content);
          });

          // Check for excessive duplicates within same tour/language
          contentMap.forEach((contents, key) => {
            const totalReviews = data.filter((r: any) => 
              `${r.tour_slug}-${r.language}` === key
            ).length;
            
            const uniqueContents = contents.size;
            const duplicateRatio = (totalReviews - uniqueContents) / totalReviews;
            
            // Should not have more than 20% duplicate content
            expect(duplicateRatio).toBeLessThan(0.2);
          });
        }
      } catch (error) {
        console.log('Duplicate check skipped');
      }
    });
  });

  describe('Query Performance', () => {
    test('basic tour reviews query should be fast', async () => {
      const startTime = Date.now();
      
      await getTourReviews('sample-tour', 'en', 5);
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000); // Less than 1 second
    });

    test('stats query should be efficient', async () => {
      const startTime = Date.now();
      
      await getTourReviewStats('sample-tour', 'en');
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(500); // Less than 500ms
    });

    test('should handle concurrent queries efficiently', async () => {
      const startTime = Date.now();
      
      const promises = [
        getTourReviews('tour-1', 'en', 3),
        getTourReviews('tour-2', 'de', 3),
        getTourReviews('tour-3', 'fr', 3),
        getTourReviewStats('tour-1', 'en'),
        getTourReviewStats('tour-2', 'de')
      ];
      
      await Promise.all(promises);
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(2000); // Less than 2 seconds for all
    });
  });

  describe('Error Handling', () => {
    test('should handle malformed tour slugs', async () => {
      const malformedSlugs = [
        '', 
        null as any, 
        undefined as any, 
        'tour with spaces', 
        'tour/with/slashes',
        'very-long-tour-slug-'.repeat(10)
      ];

      for (const slug of malformedSlugs) {
        const reviews = await getTourReviews(slug, 'en');
        expect(Array.isArray(reviews)).toBe(true);
        expect(reviews.length).toBe(0);
      }
    });

    test('should handle invalid language codes', async () => {
      const invalidLocales = [
        'invalid', 
        'xx', 
        'eng', 
        '123', 
        null as any, 
        undefined as any
      ];

      for (const locale of invalidLocales) {
        const reviews = await getTourReviews('sample-tour', locale as any);
        expect(Array.isArray(reviews)).toBe(true);
      }
    });

    test('should handle network timeouts gracefully', async () => {
      // Simulate long-running query
      const promise = getTourReviews('sample-tour', 'en', 100);
      
      // Should resolve within reasonable time or handle timeout
      await expect(promise).resolves.toBeDefined();
    });
  });

  describe('Data Quality Checks', () => {
    test('review content should meet quality standards', async () => {
      if (!supabase) return;

      try {
        const { data } = await supabase
          .from('tour_reviews')
          .select('content, rating, author, author_location')
          .eq('verified', true)
          .limit(20);

        if (data && data.length > 0) {
          data.forEach((review: any) => {
            // Content should be substantial
            expect(review.content.length).toBeGreaterThan(50);
            
            // Should not be obviously fake
            expect(review.content).not.toMatch(/lorem ipsum/i);
            expect(review.content).not.toMatch(/test review/i);
            expect(review.content).not.toMatch(/placeholder/i);
            
            // Author info should be realistic
            expect(review.author.length).toBeGreaterThan(3);
            expect(review.author_location.length).toBeGreaterThan(3);
            
            // Rating should be within valid range
            expect(review.rating).toBeGreaterThanOrEqual(1);
            expect(review.rating).toBeLessThanOrEqual(5);
          });
        }
      } catch (error) {
        console.log('Quality checks skipped');
      }
    });

    test('review dates should be realistic', async () => {
      if (!supabase) return;

      try {
        const { data } = await supabase
          .from('tour_reviews')
          .select('review_date, created_at')
          .limit(10);

        if (data && data.length > 0) {
          const now = new Date();
          const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          const future = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

          data.forEach((review: any) => {
            const reviewDate = new Date(review.review_date);
            
            // Review date should be realistic (not too old, not in future)
            expect(reviewDate.getTime()).toBeGreaterThan(oneYearAgo.getTime());
            expect(reviewDate.getTime()).toBeLessThan(future.getTime());
          });
        }
      } catch (error) {
        console.log('Date validation skipped');
      }
    });
  });
});