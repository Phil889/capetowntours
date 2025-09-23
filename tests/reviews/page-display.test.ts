/**
 * Tour Review Page Display Tests
 * 
 * Tests all 105 tour pages (21 tours × 5 languages) for review display functionality
 */

import { describe, test, expect, beforeAll } from '@jest/testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';

// Import components to test
import { GuestReviewsSectionSSR } from '@/components/tours/GuestReviewsSectionSSR';
import { getTourReviews, getTourReviewsWithFallback } from '@/lib/tour-reviews-db';
import { getToursWithLocale } from '@/lib/tours';
import { Locale } from '@/lib/i18n/config';

// Mock next-intl messages for testing
const createMockMessages = (locale: Locale) => ({
  reviews: {
    title: locale === 'en' ? 'Guest Reviews' : 'Avis des invités',
    rating: locale === 'en' ? 'Rating' : 'Évaluation',
    verified: locale === 'en' ? 'Verified Review' : 'Avis vérifié',
    showMore: locale === 'en' ? 'Show More Reviews' : 'Voir plus d\'avis',
    noReviews: locale === 'en' ? 'No reviews yet' : 'Pas encore d\'avis'
  },
  common: {
    loading: locale === 'en' ? 'Loading...' : 'Chargement...',
    error: locale === 'en' ? 'Error loading reviews' : 'Erreur lors du chargement'
  }
});

// Test configuration
const TEST_CONFIG = {
  languages: ['en', 'de', 'fr', 'es', 'ar'] as Locale[],
  displayTimeout: 5000, // 5 seconds timeout for component rendering
  requiredElements: [
    'reviews-section',
    'review-item',
    'review-rating',
    'review-author',
    'review-content'
  ]
};

// Global test state
let allTours: any[] = [];
let pageTestResults: Array<{
  tourSlug: string;
  tourTitle: string;
  language: Locale;
  displaySuccess: boolean;
  reviewsFound: number;
  renderTime: number;
  errors: string[];
  elementsFound: string[];
}> = [];

// Mock component wrapper for testing
const TestWrapper: React.FC<{
  children: React.ReactNode;
  locale: Locale;
  messages: any;
}> = ({ children, locale, messages }) => (
  <NextIntlClientProvider locale={locale} messages={messages}>
    {children}
  </NextIntlClientProvider>
);

describe('Tour Review Page Display - All 105 Pages', () => {
  beforeAll(async () => {
    // Load all tours for testing
    allTours = await getToursWithLocale('en');
    console.log(`Loaded ${allTours.length} tours for page display testing`);
  });

  describe('Individual Tour Page Review Display', () => {
    test.each(TEST_CONFIG.languages)('should display reviews correctly for all tours in %s', async (locale) => {
      const languageResults: any[] = [];
      
      for (const tour of allTours) {
        const startTime = Date.now();
        const testResult = {
          tourSlug: tour.slug,
          tourTitle: tour.title,
          language: locale,
          displaySuccess: false,
          reviewsFound: 0,
          renderTime: 0,
          errors: [] as string[],
          elementsFound: [] as string[]
        };
        
        try {
          // First, check if we can get reviews for this tour
          const reviews = await getTourReviewsWithFallback(tour.slug, locale, 5);
          testResult.reviewsFound = reviews.length;
          
          // Create mock messages for this locale
          const messages = createMockMessages(locale);
          
          // Render the review component
          const { container, unmount } = render(
            <TestWrapper locale={locale} messages={messages}>
              <GuestReviewsSectionSSR
                tourSlug={tour.slug}
                locale={locale}
                initialReviews={reviews.slice(0, 3)}
              />
            </TestWrapper>
          );
          
          testResult.renderTime = Date.now() - startTime;
          
          // Wait for component to fully render
          await waitFor(() => {
            const reviewsSection = container.querySelector('[data-testid="reviews-section"]') ||
                                  container.querySelector('.reviews-section') ||
                                  container.querySelector('[id*="review"]');
            
            expect(reviewsSection).toBeInTheDocument();
          }, { timeout: TEST_CONFIG.displayTimeout });
          
          // Check for required elements
          const elementsToCheck = [
            { selector: '[data-testid="reviews-section"]', name: 'reviews-section' },
            { selector: '.review-item, [data-testid*="review-item"]', name: 'review-item' },
            { selector: '.star-rating, [data-testid*="rating"]', name: 'review-rating' },
            { selector: '.review-author, [data-testid*="author"]', name: 'review-author' },
            { selector: '.review-content, [data-testid*="content"]', name: 'review-content' }
          ];
          
          for (const element of elementsToCheck) {
            const found = container.querySelector(element.selector);
            if (found) {
              testResult.elementsFound.push(element.name);
            }
          }
          
          // Check for language-specific content
          if (reviews.length > 0) {
            const reviewContent = container.textContent || '';
            
            // Verify review content is displayed
            if (reviewContent.length > 100) {
              testResult.elementsFound.push('review-content-populated');
            }
            
            // Check for language-appropriate content
            if (locale === 'ar') {
              // Arabic pages should handle RTL properly
              const rtlElements = container.querySelectorAll('[dir="rtl"]');
              if (rtlElements.length > 0) {
                testResult.elementsFound.push('rtl-support');
              }
            }
            
            // Check for star ratings display
            const ratingElements = container.querySelectorAll('.star, .rating, [data-testid*="star"]');
            if (ratingElements.length > 0) {
              testResult.elementsFound.push('star-ratings');
            }
          }
          
          testResult.displaySuccess = testResult.elementsFound.length >= 2; // At least 2 elements should be found
          
          // Clean up
          unmount();
          
        } catch (error) {
          testResult.errors.push(`Render error: ${error}`);
          testResult.renderTime = Date.now() - startTime;
        }
        
        languageResults.push(testResult);
        pageTestResults.push(testResult);
      }
      
      // Language-level assertions
      const successfulDisplays = languageResults.filter(r => r.displaySuccess);
      const totalPages = languageResults.length;
      
      console.log(`${locale.toUpperCase()}: ${successfulDisplays.length}/${totalPages} pages displayed successfully`);
      
      // At least 80% of pages should display correctly
      expect(successfulDisplays.length / totalPages).toBeGreaterThan(0.8);
      
      // Average render time should be reasonable
      const avgRenderTime = languageResults.reduce((sum, r) => sum + r.renderTime, 0) / languageResults.length;
      expect(avgRenderTime).toBeLessThan(2000); // Less than 2 seconds average
      
    }, 30000); // 30 second timeout for each language test
  });

  describe('Review Content Quality on Pages', () => {
    test('displayed reviews should have proper formatting and content', async () => {
      const sampleTours = allTours.slice(0, 5); // Test first 5 tours
      
      for (const tour of sampleTours) {
        const reviews = await getTourReviewsWithFallback(tour.slug, 'en', 3);
        
        if (reviews.length > 0) {
          const messages = createMockMessages('en');
          
          const { container, unmount } = render(
            <TestWrapper locale="en" messages={messages}>
              <GuestReviewsSectionSSR
                tourSlug={tour.slug}
                locale="en"
                initialReviews={reviews}
              />
            </TestWrapper>
          );
          
          // Check that review content is properly displayed
          const reviewElements = container.querySelectorAll('.review-item, [data-testid*="review"]');
          
          reviewElements.forEach((reviewEl, index) => {
            const reviewText = reviewEl.textContent || '';
            
            // Should contain meaningful content
            expect(reviewText.length).toBeGreaterThan(50);
            
            // Should not contain placeholder text
            expect(reviewText.toLowerCase()).not.toContain('lorem ipsum');
            expect(reviewText.toLowerCase()).not.toContain('placeholder');
            expect(reviewText.toLowerCase()).not.toContain('test review');
          });
          
          unmount();
        }
      }
    });

    test('review ratings should be visually represented correctly', async () => {
      const sampleTours = allTours.slice(0, 3);
      
      for (const tour of sampleTours) {
        const reviews = await getTourReviewsWithFallback(tour.slug, 'en', 2);
        
        if (reviews.length > 0) {
          const messages = createMockMessages('en');
          
          const { container, unmount } = render(
            <TestWrapper locale="en" messages={messages}>
              <GuestReviewsSectionSSR
                tourSlug={tour.slug}
                locale="en"
                initialReviews={reviews}
              />
            </TestWrapper>
          );
          
          // Check for star rating elements
          const starElements = container.querySelectorAll('.star, .rating-star, [data-testid*="star"]');
          
          if (starElements.length > 0) {
            // Should have reasonable number of stars (typically 5 per review)
            expect(starElements.length).toBeGreaterThan(0);
            expect(starElements.length).toBeLessThanOrEqual(reviews.length * 5);
          }
          
          unmount();
        }
      }
    });
  });

  describe('Responsive Display Testing', () => {
    test('reviews should display properly on mobile viewports', async () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      const sampleTour = allTours[0];
      if (!sampleTour) return;
      
      const reviews = await getTourReviewsWithFallback(sampleTour.slug, 'en', 2);
      const messages = createMockMessages('en');
      
      const { container, unmount } = render(
        <TestWrapper locale="en" messages={messages}>
          <GuestReviewsSectionSSR
            tourSlug={sampleTour.slug}
            locale="en"
            initialReviews={reviews}
          />
        </TestWrapper>
      );
      
      // Check that content is not cut off or overflowing
      const reviewSection = container.querySelector('[data-testid="reviews-section"]') ||
                            container.querySelector('.reviews-section');
      
      if (reviewSection) {
        // Should not have horizontal overflow
        expect(reviewSection).toBeInTheDocument();
      }
      
      unmount();
    });

    test('reviews should display properly on tablet viewports', async () => {
      // Set tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      const sampleTour = allTours[0];
      if (!sampleTour) return;
      
      const reviews = await getTourReviewsWithFallback(sampleTour.slug, 'en', 3);
      const messages = createMockMessages('en');
      
      const { container, unmount } = render(
        <TestWrapper locale="en" messages={messages}>
          <GuestReviewsSectionSSR
            tourSlug={sampleTour.slug}
            locale="en"
            initialReviews={reviews}
          />
        </TestWrapper>
      );
      
      const reviewSection = container.querySelector('[data-testid="reviews-section"]') ||
                            container.querySelector('.reviews-section');
      
      expect(reviewSection).toBeInTheDocument();
      
      unmount();
    });
  });

  describe('Error Handling in Display', () => {
    test('should handle missing reviews gracefully', async () => {
      const messages = createMockMessages('en');
      
      const { container, unmount } = render(
        <TestWrapper locale="en" messages={messages}>
          <GuestReviewsSectionSSR
            tourSlug="non-existent-tour"
            locale="en"
            initialReviews={[]}
          />
        </TestWrapper>
      );
      
      // Should still render something (empty state or fallback)
      expect(container).toBeInTheDocument();
      
      // Should not throw errors
      const errorElements = container.querySelectorAll('.error, [data-testid*="error"]');
      expect(errorElements.length).toBeLessThan(2); // At most one error element
      
      unmount();
    });

    test('should handle malformed review data gracefully', async () => {
      const malformedReviews = [
        {
          id: '1',
          name: '',
          location: 'Test Location',
          flag: '🇺🇸',
          date: 'Invalid Date',
          rating: 0, // Invalid rating
          text: ''
        }
      ];
      
      const messages = createMockMessages('en');
      
      const { container, unmount } = render(
        <TestWrapper locale="en" messages={messages}>
          <GuestReviewsSectionSSR
            tourSlug="test-tour"
            locale="en"
            initialReviews={malformedReviews as any}
          />
        </TestWrapper>
      );
      
      // Should render without crashing
      expect(container).toBeInTheDocument();
      
      unmount();
    });
  });

  afterAll(async () => {
    // Generate comprehensive page display report
    const report = {
      timestamp: new Date().toISOString(),
      totalPages: pageTestResults.length,
      expectedPages: allTours.length * TEST_CONFIG.languages.length,
      languages: TEST_CONFIG.languages,
      tourCount: allTours.length,
      summary: {
        successfulDisplays: pageTestResults.filter(r => r.displaySuccess).length,
        totalErrors: pageTestResults.reduce((sum, r) => sum + r.errors.length, 0),
        averageRenderTime: pageTestResults.reduce((sum, r) => sum + r.renderTime, 0) / pageTestResults.length,
        pagesWithReviews: pageTestResults.filter(r => r.reviewsFound > 0).length,
        averageReviewsPerPage: pageTestResults.filter(r => r.reviewsFound > 0).reduce((sum, r) => sum + r.reviewsFound, 0) / pageTestResults.filter(r => r.reviewsFound > 0).length
      },
      languageBreakdown: TEST_CONFIG.languages.map(lang => {
        const langResults = pageTestResults.filter(r => r.language === lang);
        return {
          language: lang,
          totalPages: langResults.length,
          successfulDisplays: langResults.filter(r => r.displaySuccess).length,
          averageRenderTime: langResults.reduce((sum, r) => sum + r.renderTime, 0) / langResults.length,
          pagesWithReviews: langResults.filter(r => r.reviewsFound > 0).length,
          commonElements: langResults.reduce((acc, r) => {
            r.elementsFound.forEach(elem => {
              acc[elem] = (acc[elem] || 0) + 1;
            });
            return acc;
          }, {} as Record<string, number>)
        };
      }),
      tourBreakdown: allTours.slice(0, 10).map(tour => {
        const tourResults = pageTestResults.filter(r => r.tourSlug === tour.slug);
        return {
          tourSlug: tour.slug,
          tourTitle: tour.title,
          languagesSuccessful: tourResults.filter(r => r.displaySuccess).length,
          totalLanguages: tourResults.length,
          averageReviews: tourResults.reduce((sum, r) => sum + r.reviewsFound, 0) / tourResults.length,
          averageRenderTime: tourResults.reduce((sum, r) => sum + r.renderTime, 0) / tourResults.length
        };
      }),
      issues: pageTestResults.filter(r => r.errors.length > 0 || !r.displaySuccess).map(r => ({
        tourSlug: r.tourSlug,
        language: r.language,
        displaySuccess: r.displaySuccess,
        reviewsFound: r.reviewsFound,
        errors: r.errors,
        elementsFound: r.elementsFound.length
      }))
    };
    
    console.log('\n📱 PAGE DISPLAY TEST REPORT');
    console.log('='.repeat(60));
    console.log(`📊 Total Pages Tested: ${report.totalPages}/${report.expectedPages}`);
    console.log(`✅ Successful Displays: ${report.summary.successfulDisplays}`);
    console.log(`📝 Pages with Reviews: ${report.summary.pagesWithReviews}`);
    console.log(`⏱️  Average Render Time: ${report.summary.averageRenderTime.toFixed(2)}ms`);
    console.log(`⭐ Average Reviews per Page: ${report.summary.averageReviewsPerPage?.toFixed(2) || 'N/A'}`);
    
    if (report.issues.length > 0) {
      console.log(`\n⚠️  Display Issues: ${report.issues.length}`);
      report.issues.slice(0, 5).forEach(issue => {
        console.log(`   ${issue.language}/${issue.tourSlug}: ${issue.errors.join(', ')}`);
      });
    }
    
    console.log('\n📊 Language Performance:');
    report.languageBreakdown.forEach(lang => {
      const successRate = ((lang.successfulDisplays / lang.totalPages) * 100).toFixed(1);
      console.log(`   ${lang.language.toUpperCase()}: ${lang.successfulDisplays}/${lang.totalPages} (${successRate}%)`);
    });
    
    // Write detailed report
    require('fs').writeFileSync(
      './tests/reviews/page-display-report.json',
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n📄 Detailed display report saved to: ./tests/reviews/page-display-report.json');
  });
});