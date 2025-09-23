#!/usr/bin/env tsx
/**
 * Tour Pages Validation Script
 * Comprehensive validation of all 21 tour pages across 5 languages
 * Can be run independently or as part of CI/CD pipeline
 */

import { getTourReviewsWithFallback, getTourReviewStats } from '../lib/tour-reviews-db';
import { TourRepository } from '../lib/tour-data/tour-repository';
import { locales, Locale } from '../lib/i18n/config';
import fs from 'fs/promises';
import path from 'path';

// Tour slugs to validate
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

interface ValidationResult {
  tourSlug: string;
  locale: Locale;
  status: 'PASS' | 'FAIL' | 'WARNING';
  score: number;
  metrics: {
    loadTime: number;
    reviewsCount: number;
    averageRating: number;
    hasValidContent: boolean;
    hasLanguageSpecificContent: boolean;
    seoOptimized: boolean;
    performanceGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  };
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    impact: 'high' | 'medium' | 'low';
  }>;
}

interface ValidationReport {
  timestamp: string;
  totalTours: number;
  totalLanguages: number;
  totalTests: number;
  overallScore: number;
  results: ValidationResult[];
  summary: {
    statusDistribution: Record<'PASS' | 'FAIL' | 'WARNING', number>;
    languageScores: Record<Locale, number>;
    tourScores: Record<string, number>;
    performanceMetrics: {
      averageLoadTime: number;
      fastestTour: string;
      slowestTour: string;
      reviewsCoverage: number;
    };
    recommendations: string[];
  };
}

class TourPageValidator {
  private report: ValidationReport;

  constructor() {
    this.report = {
      timestamp: new Date().toISOString(),
      totalTours: TOUR_SLUGS.length,
      totalLanguages: locales.length,
      totalTests: 0,
      overallScore: 0,
      results: [],
      summary: {
        statusDistribution: { PASS: 0, FAIL: 0, WARNING: 0 },
        languageScores: {} as Record<Locale, number>,
        tourScores: {} as Record<string, number>,
        performanceMetrics: {
          averageLoadTime: 0,
          fastestTour: '',
          slowestTour: '',
          reviewsCoverage: 0
        },
        recommendations: []
      }
    };
  }

  async validateTourPage(tourSlug: string, locale: Locale): Promise<ValidationResult> {
    const startTime = Date.now();
    const result: ValidationResult = {
      tourSlug,
      locale,
      status: 'PASS',
      score: 100,
      metrics: {
        loadTime: 0,
        reviewsCount: 0,
        averageRating: 0,
        hasValidContent: false,
        hasLanguageSpecificContent: false,
        seoOptimized: false,
        performanceGrade: 'A'
      },
      issues: []
    };

    try {
      // 1. Validate tour exists
      const tour = await TourRepository.getBySlug(tourSlug);
      if (!tour) {
        result.issues.push({
          type: 'error',
          message: `Tour '${tourSlug}' not found in database`,
          impact: 'high'
        });
        result.score -= 50;
      }

      // 2. Fetch and validate reviews
      const reviews = await getTourReviewsWithFallback(tourSlug, locale, 10);
      const stats = await getTourReviewStats(tourSlug, locale);

      result.metrics.reviewsCount = reviews.length;
      result.metrics.averageRating = stats.averageRating || 0;

      // 3. Content validation
      if (reviews.length === 0) {
        result.issues.push({
          type: 'error',
          message: `No reviews found for ${locale} locale`,
          impact: 'high'
        });
        result.score -= 30;
      } else {
        result.metrics.hasValidContent = true;

        // Check for language-specific content
        const hasLanguageMarkers = this.checkLanguageSpecificContent(reviews, locale);
        result.metrics.hasLanguageSpecificContent = hasLanguageMarkers;

        if (!hasLanguageMarkers) {
          result.issues.push({
            type: 'warning',
            message: `Reviews may not be properly localized for ${locale}`,
            impact: 'medium'
          });
          result.score -= 15;
        }
      }

      // 4. Rating validation
      if (result.metrics.averageRating < 4.0) {
        result.issues.push({
          type: 'warning',
          message: `Low average rating: ${result.metrics.averageRating}`,
          impact: 'medium'
        });
        result.score -= 10;
      }

      if (result.metrics.averageRating > 5.0) {
        result.issues.push({
          type: 'error',
          message: `Invalid average rating: ${result.metrics.averageRating}`,
          impact: 'high'
        });
        result.score -= 20;
      }

      // 5. Performance validation
      const loadTime = Date.now() - startTime;
      result.metrics.loadTime = loadTime;

      if (loadTime > 2000) {
        result.metrics.performanceGrade = 'F';
        result.issues.push({
          type: 'error',
          message: `Slow load time: ${loadTime}ms`,
          impact: 'high'
        });
        result.score -= 20;
      } else if (loadTime > 1500) {
        result.metrics.performanceGrade = 'D';
        result.score -= 10;
      } else if (loadTime > 1000) {
        result.metrics.performanceGrade = 'C';
        result.score -= 5;
      } else if (loadTime > 500) {
        result.metrics.performanceGrade = 'B';
      }

      // 6. SEO optimization check
      const seoScore = this.calculateSEOScore(result.metrics, reviews);
      result.metrics.seoOptimized = seoScore >= 80;

      if (!result.metrics.seoOptimized) {
        result.issues.push({
          type: 'warning',
          message: `SEO optimization needs improvement (score: ${seoScore})`,
          impact: 'medium'
        });
        result.score -= 10;
      }

      // 7. Review content quality validation
      const contentQuality = this.validateReviewContent(reviews, locale);
      if (contentQuality.score < 80) {
        result.issues.push({
          type: 'warning',
          message: `Review content quality below threshold: ${contentQuality.score}%`,
          impact: 'medium'
        });
        result.score -= 10;
      }

      // 8. Determine final status
      if (result.score < 60) {
        result.status = 'FAIL';
      } else if (result.score < 85 || result.issues.some(i => i.type === 'warning')) {
        result.status = 'WARNING';
      }

      return result;

    } catch (error) {
      result.status = 'FAIL';
      result.score = 0;
      result.issues.push({
        type: 'error',
        message: `Validation error: ${error.message}`,
        impact: 'high'
      });
      return result;
    }
  }

  private checkLanguageSpecificContent(reviews: any[], locale: Locale): boolean {
    const languageMarkers = {
      en: ['the', 'and', 'was', 'were', 'amazing', 'great'],
      de: ['der', 'die', 'das', 'war', 'waren', 'fantastisch', 'großartig'],
      fr: ['le', 'la', 'les', 'était', 'étaient', 'magnifique', 'excellent'],
      es: ['el', 'la', 'los', 'era', 'fueron', 'increíble', 'excelente'],
      ar: ['كان', 'كانت', 'رائع', 'ممتاز', 'مذهل', 'جميل']
    };

    const markers = languageMarkers[locale] || [];
    
    return reviews.some(review => 
      markers.some(marker => 
        review.text?.toLowerCase().includes(marker.toLowerCase())
      )
    );
  }

  private calculateSEOScore(metrics: ValidationResult['metrics'], reviews: any[]): number {
    let score = 0;

    // Reviews count (30 points)
    if (metrics.reviewsCount >= 5) score += 30;
    else if (metrics.reviewsCount >= 3) score += 20;
    else if (metrics.reviewsCount >= 1) score += 10;

    // Average rating (25 points)
    if (metrics.averageRating >= 4.8) score += 25;
    else if (metrics.averageRating >= 4.5) score += 20;
    else if (metrics.averageRating >= 4.0) score += 15;

    // Content quality (25 points)
    const avgContentLength = reviews.reduce((sum, r) => sum + (r.text?.length || 0), 0) / reviews.length;
    if (avgContentLength >= 100) score += 25;
    else if (avgContentLength >= 50) score += 15;
    else if (avgContentLength >= 20) score += 10;

    // Performance (20 points)
    if (metrics.performanceGrade === 'A') score += 20;
    else if (metrics.performanceGrade === 'B') score += 15;
    else if (metrics.performanceGrade === 'C') score += 10;
    else if (metrics.performanceGrade === 'D') score += 5;

    return score;
  }

  private validateReviewContent(reviews: any[], locale: Locale): { score: number; issues: string[] } {
    let score = 100;
    const issues: string[] = [];

    reviews.forEach((review, index) => {
      // Check content length
      if (!review.text || review.text.length < 10) {
        issues.push(`Review ${index + 1}: Content too short`);
        score -= 10;
      }

      // Check for proper names and locations
      if (!review.name || review.name.length < 2) {
        issues.push(`Review ${index + 1}: Invalid author name`);
        score -= 5;
      }

      if (!review.location || review.location.length < 3) {
        issues.push(`Review ${index + 1}: Invalid location`);
        score -= 5;
      }

      // Check rating validity
      if (!review.rating || review.rating < 1 || review.rating > 5) {
        issues.push(`Review ${index + 1}: Invalid rating`);
        score -= 10;
      }

      // Check date format
      if (!review.date) {
        issues.push(`Review ${index + 1}: Missing date`);
        score -= 3;
      }
    });

    return { score: Math.max(0, score), issues };
  }

  async runFullValidation(): Promise<ValidationReport> {
    console.log('🚀 Starting Tour Pages Validation...');
    console.log(`📊 Testing ${TOUR_SLUGS.length} tours across ${locales.length} languages`);

    const totalTests = TOUR_SLUGS.length * locales.length;
    let completedTests = 0;

    for (const tourSlug of TOUR_SLUGS) {
      const tourResults: ValidationResult[] = [];

      for (const locale of locales) {
        const result = await this.validateTourPage(tourSlug, locale);
        this.report.results.push(result);
        tourResults.push(result);

        completedTests++;
        const progress = Math.round((completedTests / totalTests) * 100);
        process.stdout.write(`\r⏳ Progress: ${progress}% (${completedTests}/${totalTests})`);

        // Update summary
        this.report.summary.statusDistribution[result.status]++;
      }

      // Calculate tour score
      const tourScore = Math.round(
        tourResults.reduce((sum, r) => sum + r.score, 0) / tourResults.length
      );
      this.report.summary.tourScores[tourSlug] = tourScore;
    }

    console.log('\n✅ Validation completed!');

    // Calculate language scores
    locales.forEach(locale => {
      const localeResults = this.report.results.filter(r => r.locale === locale);
      const avgScore = localeResults.reduce((sum, r) => sum + r.score, 0) / localeResults.length;
      this.report.summary.languageScores[locale] = Math.round(avgScore);
    });

    // Calculate overall score
    this.report.overallScore = Math.round(
      this.report.results.reduce((sum, r) => sum + r.score, 0) / this.report.results.length
    );

    // Performance metrics
    const loadTimes = this.report.results.map(r => r.metrics.loadTime);
    this.report.summary.performanceMetrics.averageLoadTime = Math.round(
      loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length
    );

    const sortedByPerformance = [...this.report.results].sort((a, b) => a.metrics.loadTime - b.metrics.loadTime);
    this.report.summary.performanceMetrics.fastestTour = sortedByPerformance[0]?.tourSlug || '';
    this.report.summary.performanceMetrics.slowestTour = sortedByPerformance[sortedByPerformance.length - 1]?.tourSlug || '';

    // Reviews coverage
    const toursWithReviews = new Set(this.report.results.filter(r => r.metrics.reviewsCount > 0).map(r => r.tourSlug));
    this.report.summary.performanceMetrics.reviewsCoverage = Math.round((toursWithReviews.size / TOUR_SLUGS.length) * 100);

    // Generate recommendations
    this.generateRecommendations();

    this.report.totalTests = totalTests;
    return this.report;
  }

  private generateRecommendations(): void {
    const recommendations: string[] = [];

    // Check for languages with low scores
    Object.entries(this.report.summary.languageScores).forEach(([locale, score]) => {
      if (score < 80) {
        recommendations.push(`Improve ${locale} language reviews (current score: ${score}%)`);
      }
    });

    // Check for tours with low scores
    Object.entries(this.report.summary.tourScores).forEach(([tour, score]) => {
      if (score < 70) {
        recommendations.push(`Tour '${tour}' needs review improvements (current score: ${score}%)`);
      }
    });

    // Performance recommendations
    if (this.report.summary.performanceMetrics.averageLoadTime > 1000) {
      recommendations.push('Optimize database queries to improve load times');
    }

    // Coverage recommendations
    if (this.report.summary.performanceMetrics.reviewsCoverage < 90) {
      recommendations.push(`Improve reviews coverage (${this.report.summary.performanceMetrics.reviewsCoverage}% of tours have reviews)`);
    }

    // General recommendations based on common issues
    const commonIssues = this.report.results.flatMap(r => r.issues.map(i => i.message));
    const issueFrequency = commonIssues.reduce((acc, issue) => {
      acc[issue] = (acc[issue] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(issueFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .forEach(([issue, count]) => {
        if (count >= 5) {
          recommendations.push(`Address common issue: ${issue} (affects ${count} test cases)`);
        }
      });

    this.report.summary.recommendations = recommendations;
  }

  async exportReport(filePath: string): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(this.report, null, 2), 'utf-8');
    console.log(`📄 Report exported to: ${filePath}`);
  }

  printSummary(): void {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 TOUR PAGES VALIDATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`📈 Overall Score: ${this.report.overallScore}%`);
    console.log(`✅ Passed: ${this.report.summary.statusDistribution.PASS}`);
    console.log(`⚠️  Warnings: ${this.report.summary.statusDistribution.WARNING}`);
    console.log(`❌ Failed: ${this.report.summary.statusDistribution.FAIL}`);
    console.log(`⚡ Avg Load Time: ${this.report.summary.performanceMetrics.averageLoadTime}ms`);
    console.log(`📊 Reviews Coverage: ${this.report.summary.performanceMetrics.reviewsCoverage}%`);

    console.log('\n📍 Language Scores:');
    Object.entries(this.report.summary.languageScores).forEach(([locale, score]) => {
      const emoji = score >= 90 ? '🟢' : score >= 80 ? '🟡' : score >= 70 ? '🟠' : '🔴';
      console.log(`  ${emoji} ${locale.toUpperCase()}: ${score}%`);
    });

    if (this.report.summary.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      this.report.summary.recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`);
      });
    }

    console.log('='.repeat(60));
  }
}

// Main execution
async function main() {
  const validator = new TourPageValidator();
  
  try {
    const report = await validator.runFullValidation();
    validator.printSummary();

    // Export detailed report
    const reportPath = path.join(process.cwd(), 'docs', 'TOUR_PAGES_VALIDATION_REPORT.json');
    await validator.exportReport(reportPath);

    // Exit with appropriate code
    const exitCode = report.overallScore >= 85 ? 0 : 1;
    process.exit(exitCode);

  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export default TourPageValidator;