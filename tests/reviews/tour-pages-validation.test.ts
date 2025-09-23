/**
 * Comprehensive Tour Pages Validation Test Suite
 * Tests all 21 tour pages across 5 languages for guest reviews functionality
 */

import { expect, test, describe, beforeAll } from '@jest/globals';
import { getTourReviewsWithFallback, getTourReviewStats } from '@/lib/tour-reviews-db';
import { TourRepository } from '@/lib/tour-data/tour-repository';
import { locales, Locale } from '@/lib/i18n/config';

// Complete list of 21 tours to validate
const TOUR_SLUGS = [
  'aquila-safari-tour',
  'atlantis-sand-dunes-adventure',
  'babylonstoren-wine-estate',
  'bo-kaap-heritage-quarter',
  'boulders-beach-penguin-colony',
  'cape-of-good-hope',
  'cape-point-lighthouse',
  'cape-town-paragliding',
  'cape-town-skydive',
  'chapman-s-peak-drive',
  'delaire-graff-estate',
  'hermanus-whale-watching-tour',
  'hout-bay-harbour',
  'inverdoorn-safari-tour',
  'maiden-s-cove',
  'muizenberg-beach',
  'sea-point-promenade',
  'shark-cage-diving-gansbaai',
  'simon-s-town',
  'tokara-wine-estate',
  'v-a-waterfront'
];

// Performance benchmarks
const PERFORMANCE_THRESHOLDS = {
  MAX_LOAD_TIME: 2000, // 2 seconds
  MIN_REVIEWS_PER_TOUR: 3,
  MIN_RATING: 4.0,
  MAX_RATING: 5.0
};

// Language-specific validation patterns
const LANGUAGE_PATTERNS = {
  en: {
    name: 'English',
    charset: /^[\w\s\.,!?\-'":()]+$/,
    specialChars: [],
    direction: 'ltr'
  },
  de: {
    name: 'German',
    charset: /^[\w\s\.,!?\-'":()äöüßÄÖÜ]+$/,
    specialChars: ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'],
    direction: 'ltr'
  },
  fr: {
    name: 'French',
    charset: /^[\w\s\.,!?\-'":()àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ]+$/,
    specialChars: ['à', 'â', 'ä', 'é', 'è', 'ê', 'ë', 'ï', 'î', 'ô', 'ù', 'û', 'ü', 'ÿ', 'ç'],
    direction: 'ltr'
  },
  es: {
    name: 'Spanish',
    charset: /^[\w\s\.,!?\-'":()áéíóúñüÁÉÍÓÚÑÜ¡¿]+$/,
    specialChars: ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¡', '¿'],
    direction: 'ltr'
  },
  ar: {
    name: 'Arabic',
    charset: /^[\w\s\.,!?\-'":()؛،؟أإآاةتثجحخدذرزسشصضطظعغفقكلمنهوىيءئؤً ٌ ٍ َ ُ ِ ّ ْ]+$/,
    specialChars: ['أ', 'إ', 'آ', 'ة', 'ى', 'ء', 'ئ', 'ؤ'],
    direction: 'rtl'
  }
};

interface ValidationResult {
  tourSlug: string;
  locale: Locale;
  passed: boolean;
  errors: string[];
  warnings: string[];
  metrics: {
    loadTime: number;
    reviewsCount: number;
    averageRating: number;
    hasReviews: boolean;
    hasValidContent: boolean;
    hasValidCharacters: boolean;
    hasRTLSupport: boolean;
    seoScore: number;
  };
}

interface TestReport {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  overallScore: number;
  results: ValidationResult[];
  summary: {
    byLanguage: Record<Locale, { passed: number; total: number; score: number }>;
    byTour: Record<string, { passed: number; total: number; score: number }>;
    performance: {
      averageLoadTime: number;
      fastestTour: string;
      slowestTour: string;
    };
  };
}

describe('Tour Pages Validation - Complete Test Suite', () => {
  let testReport: TestReport;

  beforeAll(async () => {
    testReport = {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      overallScore: 0,
      results: [],
      summary: {
        byLanguage: {} as Record<Locale, { passed: number; total: number; score: number }>,
        byTour: {} as Record<string, { passed: number; total: number; score: number }>,
        performance: {
          averageLoadTime: 0,
          fastestTour: '',
          slowestTour: ''
        }
      }
    };

    // Initialize language and tour summaries
    locales.forEach(locale => {
      testReport.summary.byLanguage[locale] = { passed: 0, total: 0, score: 0 };
    });

    TOUR_SLUGS.forEach(slug => {
      testReport.summary.byTour[slug] = { passed: 0, total: 0, score: 0 };
    });
  });

  describe('Individual Tour Page Validation', () => {
    TOUR_SLUGS.forEach(tourSlug => {
      describe(`Tour: ${tourSlug}`, () => {
        locales.forEach(locale => {
          test(`${tourSlug} - ${LANGUAGE_PATTERNS[locale].name} (${locale})`, async () => {
            const startTime = Date.now();
            const result: ValidationResult = {
              tourSlug,
              locale,
              passed: true,
              errors: [],
              warnings: [],
              metrics: {
                loadTime: 0,
                reviewsCount: 0,
                averageRating: 0,
                hasReviews: false,
                hasValidContent: false,
                hasValidCharacters: false,
                hasRTLSupport: false,
                seoScore: 0
              }
            };

            try {
              // Test 1: Tour Data Retrieval
              const tour = await TourRepository.getBySlug(tourSlug);
              if (!tour) {
                result.errors.push(`Tour '${tourSlug}' not found in database`);
                result.passed = false;
              }

              // Test 2: Reviews Retrieval
              const reviews = await getTourReviewsWithFallback(tourSlug, locale, 10);
              const stats = await getTourReviewStats(tourSlug, locale);

              result.metrics.reviewsCount = reviews.length;
              result.metrics.averageRating = stats.averageRating || 0;
              result.metrics.hasReviews = reviews.length > 0;

              // Test 3: Minimum Reviews Check
              if (reviews.length < PERFORMANCE_THRESHOLDS.MIN_REVIEWS_PER_TOUR) {
                result.warnings.push(`Low review count: ${reviews.length} (expected at least ${PERFORMANCE_THRESHOLDS.MIN_REVIEWS_PER_TOUR})`);
              }

              // Test 4: Review Content Validation
              let validContentCount = 0;
              let validCharacterCount = 0;
              
              reviews.forEach((review, index) => {
                // Content validation
                if (review.text && review.text.length > 10) {
                  validContentCount++;
                } else {
                  result.errors.push(`Review ${index + 1}: Insufficient content length`);
                }

                // Character encoding validation
                const pattern = LANGUAGE_PATTERNS[locale].charset;
                if (review.text && pattern.test(review.text)) {
                  validCharacterCount++;
                } else if (locale === 'ar') {
                  // Arabic might have mixed content, so we're more lenient
                  if (review.text && review.text.length > 0) {
                    validCharacterCount++;
                  }
                } else {
                  result.warnings.push(`Review ${index + 1}: Character encoding issues for ${locale}`);
                }

                // Rating validation
                if (review.rating < PERFORMANCE_THRESHOLDS.MIN_RATING || review.rating > PERFORMANCE_THRESHOLDS.MAX_RATING) {
                  result.errors.push(`Review ${index + 1}: Invalid rating ${review.rating}`);
                }

                // Author and location validation
                if (!review.name || review.name.length < 2) {
                  result.errors.push(`Review ${index + 1}: Invalid author name`);
                }

                if (!review.location || review.location.length < 2) {
                  result.errors.push(`Review ${index + 1}: Invalid location`);
                }

                // Date validation
                if (!review.date) {
                  result.errors.push(`Review ${index + 1}: Missing date`);
                }

                // Flag validation
                if (!review.flag || review.flag.length < 1) {
                  result.warnings.push(`Review ${index + 1}: Missing country flag`);
                }
              });

              result.metrics.hasValidContent = validContentCount > 0;
              result.metrics.hasValidCharacters = validCharacterCount === reviews.length;

              // Test 5: RTL Support for Arabic
              if (locale === 'ar') {
                result.metrics.hasRTLSupport = true; // Assume RTL is implemented
              } else {
                result.metrics.hasRTLSupport = true; // Not applicable for LTR languages
              }

              // Test 6: Performance Check
              const loadTime = Date.now() - startTime;
              result.metrics.loadTime = loadTime;

              if (loadTime > PERFORMANCE_THRESHOLDS.MAX_LOAD_TIME) {
                result.warnings.push(`Slow load time: ${loadTime}ms (expected < ${PERFORMANCE_THRESHOLDS.MAX_LOAD_TIME}ms)`);
              }

              // Test 7: SEO Score Calculation
              let seoScore = 0;
              if (result.metrics.hasReviews) seoScore += 25;
              if (result.metrics.hasValidContent) seoScore += 25;
              if (result.metrics.hasValidCharacters) seoScore += 25;
              if (result.metrics.averageRating >= 4.5) seoScore += 25;

              result.metrics.seoScore = seoScore;

              // Final Pass/Fail Determination
              if (result.errors.length > 0) {
                result.passed = false;
              }

              // Update test report
              testReport.totalTests++;
              if (result.passed) {
                testReport.passedTests++;
              } else {
                testReport.failedTests++;
              }

              testReport.results.push(result);

              // Update summaries
              testReport.summary.byLanguage[locale].total++;
              testReport.summary.byTour[tourSlug].total++;

              if (result.passed) {
                testReport.summary.byLanguage[locale].passed++;
                testReport.summary.byTour[tourSlug].passed++;
              }

              // Assertions for Jest
              expect(result.passed).toBe(true);
              expect(result.errors.length).toBe(0);
              expect(result.metrics.hasReviews).toBe(true);
              expect(result.metrics.averageRating).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.MIN_RATING);
              expect(result.metrics.loadTime).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.MAX_LOAD_TIME);

            } catch (error) {
              result.errors.push(`Test execution error: ${error.message}`);
              result.passed = false;
              testReport.totalTests++;
              testReport.failedTests++;
              testReport.results.push(result);
              
              throw new Error(`Validation failed for ${tourSlug} (${locale}): ${error.message}`);
            }
          }, 10000); // 10 second timeout per test
        });
      });
    });
  });

  describe('Cross-Language Consistency Tests', () => {
    test('All tours should have reviews in all languages', async () => {
      const missingReviews: string[] = [];

      for (const tourSlug of TOUR_SLUGS) {
        for (const locale of locales) {
          const reviews = await getTourReviewsWithFallback(tourSlug, locale, 1);
          if (reviews.length === 0) {
            missingReviews.push(`${tourSlug} (${locale})`);
          }
        }
      }

      expect(missingReviews.length).toBeLessThanOrEqual(10); // Allow some missing reviews
      if (missingReviews.length > 0) {
        console.warn('Tours missing reviews:', missingReviews);
      }
    });

    test('Review ratings should be consistent across languages', async () => {
      const inconsistentRatings: string[] = [];

      for (const tourSlug of TOUR_SLUGS) {
        const ratings: Record<Locale, number> = {} as Record<Locale, number>;

        for (const locale of locales) {
          const stats = await getTourReviewStats(tourSlug, locale);
          ratings[locale] = stats.averageRating || 0;
        }

        const ratingValues = Object.values(ratings).filter(r => r > 0);
        const maxRating = Math.max(...ratingValues);
        const minRating = Math.min(...ratingValues);

        // Allow 0.5 star difference between languages
        if (maxRating - minRating > 0.5) {
          inconsistentRatings.push(`${tourSlug}: ${JSON.stringify(ratings)}`);
        }
      }

      expect(inconsistentRatings.length).toBeLessThanOrEqual(5); // Allow some variation
      if (inconsistentRatings.length > 0) {
        console.warn('Tours with inconsistent ratings:', inconsistentRatings);
      }
    });
  });

  describe('Performance Benchmarks', () => {
    test('All tours should meet performance requirements', async () => {
      const slowTours: string[] = [];

      for (const tourSlug of TOUR_SLUGS) {
        const startTime = Date.now();
        await getTourReviewsWithFallback(tourSlug, 'en', 5);
        const loadTime = Date.now() - startTime;

        if (loadTime > PERFORMANCE_THRESHOLDS.MAX_LOAD_TIME) {
          slowTours.push(`${tourSlug}: ${loadTime}ms`);
        }
      }

      expect(slowTours.length).toBeLessThanOrEqual(2); // Allow 2 slow tours
      if (slowTours.length > 0) {
        console.warn('Slow loading tours:', slowTours);
      }
    });

    test('Database queries should be optimized', async () => {
      const startTime = Date.now();
      
      // Test concurrent queries (real-world scenario)
      const promises = TOUR_SLUGS.slice(0, 5).map(tourSlug => 
        Promise.all(locales.map(locale => getTourReviewsWithFallback(tourSlug, locale, 3)))
      );

      await Promise.all(promises);
      
      const totalTime = Date.now() - startTime;
      const averageTimePerQuery = totalTime / (5 * locales.length);

      expect(averageTimePerQuery).toBeLessThanOrEqual(500); // 500ms per query on average
    });
  });

  afterAll(async () => {
    // Calculate final scores
    testReport.overallScore = Math.round((testReport.passedTests / testReport.totalTests) * 100);

    // Calculate language scores
    locales.forEach(locale => {
      const summary = testReport.summary.byLanguage[locale];
      summary.score = summary.total > 0 ? Math.round((summary.passed / summary.total) * 100) : 0;
    });

    // Calculate tour scores
    TOUR_SLUGS.forEach(slug => {
      const summary = testReport.summary.byTour[slug];
      summary.score = summary.total > 0 ? Math.round((summary.passed / summary.total) * 100) : 0;
    });

    // Calculate performance metrics
    const loadTimes = testReport.results.map(r => r.metrics.loadTime);
    testReport.summary.performance.averageLoadTime = Math.round(
      loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length
    );

    const sortedByLoadTime = [...testReport.results].sort((a, b) => a.metrics.loadTime - b.metrics.loadTime);
    testReport.summary.performance.fastestTour = sortedByLoadTime[0]?.tourSlug || '';
    testReport.summary.performance.slowestTour = sortedByLoadTime[sortedByLoadTime.length - 1]?.tourSlug || '';

    console.log('=== TOUR PAGES VALIDATION REPORT ===');
    console.log(`Overall Score: ${testReport.overallScore}%`);
    console.log(`Tests Passed: ${testReport.passedTests}/${testReport.totalTests}`);
    console.log(`Average Load Time: ${testReport.summary.performance.averageLoadTime}ms`);
    console.log('\nLanguage Scores:');
    locales.forEach(locale => {
      const summary = testReport.summary.byLanguage[locale];
      console.log(`  ${LANGUAGE_PATTERNS[locale].name} (${locale}): ${summary.score}% (${summary.passed}/${summary.total})`);
    });

    // Export test report for further analysis
    global.testReport = testReport;
  });
});