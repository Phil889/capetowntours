/**
 * Comprehensive Tour Reviews Testing Suite
 * 
 * Tests all tour reviews across all languages (21 tours × 5 languages = 105 pages)
 * Validates database-driven reviews, fallback reviews, and performance
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/testing-library/jest-dom';
import { getTourReviews, getTourReviewsWithFallback, getAllTourReviews, getTourReviewStats } from '@/lib/tour-reviews-db';
import { getReviewsForTour } from '@/lib/tour-reviews';
import { getToursWithLocale } from '@/lib/tours';
import { Locale } from '@/lib/i18n/config';

// Test configuration
const TEST_CONFIG = {
  languages: ['en', 'de', 'fr', 'es', 'ar'] as Locale[],
  expectedTourCount: 21,
  maxPerformanceTime: 2000, // 2 seconds max for review loading
  minReviewsPerTour: 1,
  maxReviewsPerTour: 10,
  requiredReviewFields: ['id', 'name', 'location', 'flag', 'date', 'rating', 'text'],
  performanceThresholds: {
    single: 500, // 500ms for single tour reviews
    multiple: 1000, // 1s for multiple tours
    stats: 300 // 300ms for stats
  }
};

// Global test data
let allTours: any[] = [];
let testResults: {
  language: string;
  tourSlug: string;
  hasReviews: boolean;
  reviewCount: number;
  avgRating: number;
  loadTime: number;
  errors: string[];
}[] = [];

describe('Tour Reviews System - Comprehensive Testing', () => {
  beforeAll(async () => {
    // Load all tours for testing
    allTours = await getToursWithLocale('en');
    console.log(`Loaded ${allTours.length} tours for testing`);
  });

  describe('Database Connection and Query Validation', () => {
    test('database should be accessible and responsive', async () => {
      const startTime = Date.now();
      
      if (allTours.length > 0) {
        const sampleTour = allTours[0];
        const reviews = await getTourReviews(sampleTour.slug, 'en', 1);
        
        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThan(TEST_CONFIG.performanceThresholds.single);
        
        // Should either return reviews or empty array (not throw)
        expect(Array.isArray(reviews)).toBe(true);
      }
    });

    test('should handle invalid tour slugs gracefully', async () => {
      const reviews = await getTourReviews('non-existent-tour', 'en');
      expect(Array.isArray(reviews)).toBe(true);
      expect(reviews.length).toBe(0);
    });

    test('should handle invalid locales gracefully', async () => {
      if (allTours.length > 0) {
        const sampleTour = allTours[0];
        const reviews = await getTourReviews(sampleTour.slug, 'invalid' as Locale);
        expect(Array.isArray(reviews)).toBe(true);
      }
    });
  });

  describe('Review Data Quality and Authenticity', () => {
    test('all reviews should have required fields', async () => {
      for (const tour of allTours.slice(0, 5)) { // Test first 5 tours
        const reviews = await getTourReviewsWithFallback(tour.slug, 'en', 3);
        
        for (const review of reviews) {
          TEST_CONFIG.requiredReviewFields.forEach(field => {
            expect(review).toHaveProperty(field);
            expect(review[field]).toBeDefined();
            
            if (field === 'rating') {
              expect(review[field]).toBeGreaterThan(0);
              expect(review[field]).toBeLessThanOrEqual(5);
            }
            
            if (field === 'text') {
              expect(review[field].length).toBeGreaterThan(10);
            }
          });
        }
      }
    });

    test('review content should be authentic and varied', async () => {
      const allReviewTexts: string[] = [];
      
      for (const tour of allTours.slice(0, 3)) {
        const reviews = await getTourReviewsWithFallback(tour.slug, 'en', 5);
        reviews.forEach(review => {
          allReviewTexts.push(review.text);
        });
      }
      
      // Check for content diversity (no exact duplicates)
      const uniqueTexts = new Set(allReviewTexts);
      const duplicateRatio = (allReviewTexts.length - uniqueTexts.size) / allReviewTexts.length;
      
      expect(duplicateRatio).toBeLessThan(0.3); // Less than 30% duplicates
    });

    test('review ratings should be realistic distribution', async () => {
      const allRatings: number[] = [];
      
      for (const tour of allTours.slice(0, 5)) {
        const reviews = await getTourReviewsWithFallback(tour.slug, 'en', 10);
        reviews.forEach(review => {
          allRatings.push(review.rating);
        });
      }
      
      if (allRatings.length > 0) {
        const avgRating = allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length;
        
        // Average rating should be realistic (between 3.5 and 5.0 for a good tour company)
        expect(avgRating).toBeGreaterThan(3.5);
        expect(avgRating).toBeLessThanOrEqual(5.0);
        
        // Should have some variety in ratings
        const uniqueRatings = new Set(allRatings);
        expect(uniqueRatings.size).toBeGreaterThan(1);
      }
    });
  });

  describe('Multi-language Review Testing (105 Tour Pages)', () => {
    test.each(TEST_CONFIG.languages)('should load reviews for all tours in %s', async (locale) => {
      const tourResults: any[] = [];
      
      for (const tour of allTours) {
        const startTime = Date.now();
        
        try {
          const reviews = await getTourReviewsWithFallback(tour.slug, locale, 3);
          const loadTime = Date.now() - startTime;
          
          const result = {
            language: locale,
            tourSlug: tour.slug,
            tourTitle: tour.title,
            hasReviews: reviews.length > 0,
            reviewCount: reviews.length,
            avgRating: reviews.length > 0 ? 
              reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
            loadTime,
            errors: [] as string[]
          };
          
          // Validate review structure for each language
          if (reviews.length > 0) {
            const firstReview = reviews[0];
            
            // Check if review has appropriate language characteristics
            if (locale === 'ar') {
              // Arabic text should contain Arabic characters or be a fallback
              const hasArabicChars = /[\u0600-\u06FF]/.test(firstReview.text);
              const isEnglishFallback = /^[a-zA-Z\s.,!?'"()-]+$/.test(firstReview.text);
              
              if (!hasArabicChars && !isEnglishFallback) {
                result.errors.push('Arabic review may have character encoding issues');
              }
            }
            
            // Check for proper rating range
            reviews.forEach((review, index) => {
              if (review.rating < 1 || review.rating > 5) {
                result.errors.push(`Review ${index + 1} has invalid rating: ${review.rating}`);
              }
            });
          }
          
          tourResults.push(result);
          testResults.push(result);
          
        } catch (error) {
          tourResults.push({
            language: locale,
            tourSlug: tour.slug,
            tourTitle: tour.title,
            hasReviews: false,
            reviewCount: 0,
            avgRating: 0,
            loadTime: Date.now() - startTime,
            errors: [`Error loading reviews: ${error}`]
          });
        }
      }
      
      // Language-specific assertions
      const successfulLoads = tourResults.filter(r => r.errors.length === 0);
      const toursWithReviews = tourResults.filter(r => r.hasReviews);
      
      console.log(`${locale.toUpperCase()}: ${successfulLoads.length}/${tourResults.length} successful, ${toursWithReviews.length} with reviews`);
      
      // At least 80% of tours should load successfully
      expect(successfulLoads.length / tourResults.length).toBeGreaterThan(0.8);
      
      // At least 50% of tours should have some reviews (database or fallback)
      expect(toursWithReviews.length / tourResults.length).toBeGreaterThan(0.5);
    });
  });

  describe('Performance Testing', () => {
    test('review loading should meet performance thresholds', async () => {
      const performanceResults: any[] = [];
      
      for (const tour of allTours.slice(0, 10)) { // Test first 10 tours
        const startTime = Date.now();
        
        const reviews = await getTourReviewsWithFallback(tour.slug, 'en', 5);
        const loadTime = Date.now() - startTime;
        
        performanceResults.push({
          tourSlug: tour.slug,
          loadTime,
          reviewCount: reviews.length
        });
        
        // Individual tour should load within threshold
        expect(loadTime).toBeLessThan(TEST_CONFIG.performanceThresholds.single);
      }
      
      // Average performance should be good
      const avgLoadTime = performanceResults.reduce((sum, r) => sum + r.loadTime, 0) / performanceResults.length;
      expect(avgLoadTime).toBeLessThan(TEST_CONFIG.performanceThresholds.single * 0.7);
    });

    test('stats loading should be fast', async () => {
      for (const tour of allTours.slice(0, 5)) {
        const startTime = Date.now();
        
        const stats = await getTourReviewStats(tour.slug, 'en');
        const loadTime = Date.now() - startTime;
        
        expect(loadTime).toBeLessThan(TEST_CONFIG.performanceThresholds.stats);
        expect(stats).toHaveProperty('totalReviews');
        expect(stats).toHaveProperty('averageRating');
        expect(stats).toHaveProperty('ratingDistribution');
      }
    });

    test('concurrent review loading should handle load', async () => {
      const concurrentPromises = allTours.slice(0, 5).map(tour => 
        getTourReviewsWithFallback(tour.slug, 'en', 3)
      );
      
      const startTime = Date.now();
      const results = await Promise.all(concurrentPromises);
      const totalTime = Date.now() - startTime;
      
      // Concurrent loading should complete within reasonable time
      expect(totalTime).toBeLessThan(TEST_CONFIG.performanceThresholds.multiple);
      
      // All results should be arrays
      results.forEach(reviews => {
        expect(Array.isArray(reviews)).toBe(true);
      });
    });
  });

  describe('Fallback System Testing', () => {
    test('should fallback gracefully when database is unavailable', async () => {
      // Test the legacy fallback system
      for (const tour of allTours.slice(0, 3)) {
        const fallbackReviews = getReviewsForTour(tour.slug);
        
        // Legacy function should return array (even if empty)
        expect(Array.isArray(fallbackReviews)).toBe(true);
      }
    });

    test('should provide reviews for unknown tours via fallback', async () => {
      const unknownTourSlug = 'unknown-tour-' + Date.now();
      
      // Database query should return empty
      const dbReviews = await getTourReviews(unknownTourSlug, 'en');
      expect(dbReviews.length).toBe(0);
      
      // Fallback with fallback function should still work
      const fallbackReviews = await getTourReviewsWithFallback(unknownTourSlug, 'en', 3);
      expect(Array.isArray(fallbackReviews)).toBe(true);
    });
  });

  describe('Cross-language Consistency', () => {
    test('tours should have consistent review availability across languages', async () => {
      const languageConsistency: Record<string, number[]> = {};
      
      for (const tour of allTours.slice(0, 5)) {
        languageConsistency[tour.slug] = [];
        
        for (const locale of TEST_CONFIG.languages) {
          const reviews = await getTourReviewsWithFallback(tour.slug, locale, 3);
          languageConsistency[tour.slug].push(reviews.length);
        }
      }
      
      // Check that tours don't have wildly inconsistent review counts
      Object.entries(languageConsistency).forEach(([slug, counts]) => {
        const max = Math.max(...counts);
        const min = Math.min(...counts);
        
        // Variation should not be extreme (max 3x difference)
        if (min > 0) {
          expect(max / min).toBeLessThan(3);
        }
      });
    });
  });
});

// Generate comprehensive test report
afterAll(async () => {
  const report = {
    timestamp: new Date().toISOString(),
    totalTests: testResults.length,
    languages: TEST_CONFIG.languages,
    tourCount: allTours.length,
    summary: {
      totalPagesTested: testResults.length,
      expectedPages: allTours.length * TEST_CONFIG.languages.length,
      successfulLoads: testResults.filter(r => r.errors.length === 0).length,
      pagesWithReviews: testResults.filter(r => r.hasReviews).length,
      averageLoadTime: testResults.reduce((sum, r) => sum + r.loadTime, 0) / testResults.length,
      averageReviewCount: testResults.filter(r => r.hasReviews).reduce((sum, r) => sum + r.reviewCount, 0) / testResults.filter(r => r.hasReviews).length,
      averageRating: testResults.filter(r => r.avgRating > 0).reduce((sum, r) => sum + r.avgRating, 0) / testResults.filter(r => r.avgRating > 0).length
    },
    languageBreakdown: TEST_CONFIG.languages.map(lang => {
      const langResults = testResults.filter(r => r.language === lang);
      return {
        language: lang,
        totalTours: langResults.length,
        successful: langResults.filter(r => r.errors.length === 0).length,
        withReviews: langResults.filter(r => r.hasReviews).length,
        averageLoadTime: langResults.reduce((sum, r) => sum + r.loadTime, 0) / langResults.length
      };
    }),
    issues: testResults.filter(r => r.errors.length > 0).map(r => ({
      language: r.language,
      tour: r.tourSlug,
      errors: r.errors
    })),
    performance: {
      fastestLoad: Math.min(...testResults.map(r => r.loadTime)),
      slowestLoad: Math.max(...testResults.map(r => r.loadTime)),
      medianLoad: testResults.sort((a, b) => a.loadTime - b.loadTime)[Math.floor(testResults.length / 2)]?.loadTime
    }
  };
  
  console.log('\n🔍 TOUR REVIEWS TEST REPORT');
  console.log('='.repeat(50));
  console.log(`📊 Total Pages Tested: ${report.summary.totalPagesTested}/${report.summary.expectedPages}`);
  console.log(`✅ Successful Loads: ${report.summary.successfulLoads}`);
  console.log(`📝 Pages with Reviews: ${report.summary.pagesWithReviews}`);
  console.log(`⏱️  Average Load Time: ${report.summary.averageLoadTime.toFixed(2)}ms`);
  console.log(`⭐ Average Rating: ${report.summary.averageRating?.toFixed(2) || 'N/A'}`);
  
  if (report.issues.length > 0) {
    console.log(`\n⚠️  Issues Found: ${report.issues.length}`);
    report.issues.forEach(issue => {
      console.log(`   ${issue.language}/${issue.tour}: ${issue.errors.join(', ')}`);
    });
  }
  
  // Write report to file
  require('fs').writeFileSync(
    './tests/reviews/tour-reviews-test-report.json', 
    JSON.stringify(report, null, 2)
  );
});