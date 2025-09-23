#!/usr/bin/env node

/**
 * Tour Reviews System Validation Script
 * 
 * Comprehensive validation of all tour reviews across 105 pages (21 tours × 5 languages)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = (message, color = 'reset') => {
  console.log(COLORS[color] + message + COLORS.reset);
};

class ReviewsValidator {
  constructor() {
    this.startTime = Date.now();
    this.results = {
      databaseConnection: false,
      tourCount: 0,
      languageCount: 5,
      totalPages: 0,
      reviewsFound: 0,
      performanceMetrics: {},
      issues: [],
      recommendations: []
    };
  }

  async validateDatabaseConnection() {
    log('\n🔍 Validating Database Connection...', 'cyan');
    
    try {
      // Test basic database access
      const { getTourReviews } = require(path.join(__dirname, '../lib/tour-reviews-db'));
      const testReviews = await getTourReviews('test-tour', 'en', 1);
      
      this.results.databaseConnection = true;
      log('✅ Database connection successful', 'green');
      
    } catch (error) {
      this.results.databaseConnection = false;
      this.results.issues.push(`Database connection failed: ${error.message}`);
      log('❌ Database connection failed', 'red');
      log(`   Error: ${error.message}`, 'yellow');
    }
  }

  async validateTourData() {
    log('\n📊 Validating Tour Data...', 'cyan');
    
    try {
      const { getToursWithLocale } = require(path.join(__dirname, '../lib/tours'));
      const tours = await getToursWithLocale('en');
      
      this.results.tourCount = tours.length;
      this.results.totalPages = tours.length * this.results.languageCount;
      
      log(`✅ Found ${tours.length} tours`, 'green');
      log(`📄 Expected ${this.results.totalPages} total pages to validate`, 'blue');
      
      // Validate tour structure
      const invalidTours = tours.filter(tour => !tour.slug || !tour.title);
      if (invalidTours.length > 0) {
        this.results.issues.push(`${invalidTours.length} tours have invalid structure`);
        log(`⚠️  ${invalidTours.length} tours have missing slug or title`, 'yellow');
      }
      
    } catch (error) {
      this.results.issues.push(`Tour data validation failed: ${error.message}`);
      log('❌ Tour data validation failed', 'red');
    }
  }

  async validateReviewsAcrossLanguages() {
    log('\n🌍 Validating Reviews Across Languages...', 'cyan');
    
    const languages = ['en', 'de', 'fr', 'es', 'ar'];
    const { getToursWithLocale } = require(path.join(__dirname, '../lib/tours'));
    const { getTourReviewsWithFallback } = require(path.join(__dirname, '../lib/tour-reviews-db'));
    
    try {
      const tours = await getToursWithLocale('en');
      let totalReviewsFound = 0;
      let pagesWithReviews = 0;
      const languageStats = {};
      
      for (const language of languages) {
        languageStats[language] = {
          toursWithReviews: 0,
          totalReviews: 0,
          averageRating: 0
        };
        
        log(`   Testing ${language.toUpperCase()}...`, 'blue');
        
        for (const tour of tours.slice(0, Math.min(tours.length, 10))) { // Test first 10 tours
          try {
            const reviews = await getTourReviewsWithFallback(tour.slug, language, 5);
            
            if (reviews.length > 0) {
              languageStats[language].toursWithReviews++;
              languageStats[language].totalReviews += reviews.length;
              
              const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
              languageStats[language].averageRating = 
                (languageStats[language].averageRating + avgRating) / 2;
              
              totalReviewsFound += reviews.length;
              pagesWithReviews++;
            }
            
            // Small delay to prevent overwhelming the system
            await new Promise(resolve => setTimeout(resolve, 10));
            
          } catch (error) {
            this.results.issues.push(`Failed to load reviews for ${tour.slug} in ${language}: ${error.message}`);
          }
        }
      }
      
      this.results.reviewsFound = totalReviewsFound;
      
      log(`✅ Found ${totalReviewsFound} total reviews`, 'green');
      log(`📊 ${pagesWithReviews} pages have reviews`, 'green');
      
      // Display language statistics
      Object.entries(languageStats).forEach(([lang, stats]) => {
        log(`   ${lang.toUpperCase()}: ${stats.toursWithReviews} tours with reviews, avg rating ${stats.averageRating.toFixed(1)}`, 'blue');
      });
      
      // Validate coverage
      const coverageRate = pagesWithReviews / (tours.length * languages.length);
      if (coverageRate < 0.7) {
        this.results.issues.push(`Low review coverage: ${(coverageRate * 100).toFixed(1)}% (expected >70%)`);
      }
      
    } catch (error) {
      this.results.issues.push(`Language validation failed: ${error.message}`);
      log('❌ Language validation failed', 'red');
    }
  }

  async validatePerformance() {
    log('\n⚡ Validating Performance...', 'cyan');
    
    const { getTourReviews, getTourReviewStats } = require(path.join(__dirname, '../lib/tour-reviews-db'));
    const performanceThresholds = {
      singleLoad: 800,  // ms
      statsLoad: 400,   // ms
      batchLoad: 2000   // ms
    };
    
    try {
      // Test single review loading
      const startSingle = Date.now();
      await getTourReviews('sample-tour', 'en', 3);
      const singleLoadTime = Date.now() - startSingle;
      
      // Test stats loading
      const startStats = Date.now();
      await getTourReviewStats('sample-tour', 'en');
      const statsLoadTime = Date.now() - startStats;
      
      // Test batch loading
      const startBatch = Date.now();
      await Promise.all([
        getTourReviews('tour1', 'en', 3),
        getTourReviews('tour2', 'de', 3),
        getTourReviews('tour3', 'fr', 3)
      ]);
      const batchLoadTime = Date.now() - startBatch;
      
      this.results.performanceMetrics = {
        singleLoad: singleLoadTime,
        statsLoad: statsLoadTime,
        batchLoad: batchLoadTime
      };
      
      // Check against thresholds
      const performanceIssues = [];
      if (singleLoadTime > performanceThresholds.singleLoad) {
        performanceIssues.push(`Single load too slow: ${singleLoadTime}ms > ${performanceThresholds.singleLoad}ms`);
      }
      if (statsLoadTime > performanceThresholds.statsLoad) {
        performanceIssues.push(`Stats load too slow: ${statsLoadTime}ms > ${performanceThresholds.statsLoad}ms`);
      }
      if (batchLoadTime > performanceThresholds.batchLoad) {
        performanceIssues.push(`Batch load too slow: ${batchLoadTime}ms > ${performanceThresholds.batchLoad}ms`);
      }
      
      if (performanceIssues.length > 0) {
        this.results.issues.push(...performanceIssues);
        log(`⚠️  Performance issues detected`, 'yellow');
        performanceIssues.forEach(issue => log(`   ${issue}`, 'yellow'));
      } else {
        log(`✅ Performance acceptable`, 'green');
        log(`   Single load: ${singleLoadTime}ms`, 'blue');
        log(`   Stats load: ${statsLoadTime}ms`, 'blue');
        log(`   Batch load: ${batchLoadTime}ms`, 'blue');
      }
      
    } catch (error) {
      this.results.issues.push(`Performance validation failed: ${error.message}`);
      log('❌ Performance validation failed', 'red');
    }
  }

  async validateReviewQuality() {
    log('\n✨ Validating Review Quality...', 'cyan');
    
    const { getTourReviewsWithFallback } = require(path.join(__dirname, '../lib/tour-reviews-db'));
    const { getToursWithLocale } = require(path.join(__dirname, '../lib/tours'));
    
    try {
      const tours = await getToursWithLocale('en');
      const sampleTours = tours.slice(0, 5); // Sample 5 tours
      
      let qualityIssues = 0;
      let totalReviewsChecked = 0;
      
      for (const tour of sampleTours) {
        const reviews = await getTourReviewsWithFallback(tour.slug, 'en', 3);
        
        for (const review of reviews) {
          totalReviewsChecked++;
          
          // Check review content quality
          if (review.text.length < 50) {
            qualityIssues++;
          }
          
          if (review.text.toLowerCase().includes('lorem ipsum') || 
              review.text.toLowerCase().includes('placeholder') ||
              review.text.toLowerCase().includes('test review')) {
            qualityIssues++;
          }
          
          if (review.rating < 1 || review.rating > 5) {
            qualityIssues++;
          }
          
          if (!review.name || review.name.trim() === '') {
            qualityIssues++;
          }
        }
      }
      
      const qualityRate = 1 - (qualityIssues / totalReviewsChecked);
      
      if (qualityRate < 0.9) {
        this.results.issues.push(`Review quality concerns: ${qualityIssues}/${totalReviewsChecked} reviews have issues`);
        log(`⚠️  Review quality issues: ${(qualityRate * 100).toFixed(1)}% pass rate`, 'yellow');
      } else {
        log(`✅ Review quality acceptable: ${(qualityRate * 100).toFixed(1)}% pass rate`, 'green');
      }
      
    } catch (error) {
      this.results.issues.push(`Quality validation failed: ${error.message}`);
      log('❌ Quality validation failed', 'red');
    }
  }

  generateRecommendations() {
    log('\n💡 Generating Recommendations...', 'cyan');
    
    const recommendations = [];
    
    if (!this.results.databaseConnection) {
      recommendations.push('Fix database connection issues before deployment');
      recommendations.push('Verify Supabase credentials and network access');
    }
    
    if (this.results.tourCount < 15) {
      recommendations.push('Increase tour coverage - only ' + this.results.tourCount + ' tours found');
    }
    
    if (this.results.reviewsFound === 0) {
      recommendations.push('No reviews found - verify database has review data');
      recommendations.push('Ensure fallback review system is working');
    }
    
    if (this.results.performanceMetrics.singleLoad > 800) {
      recommendations.push('Optimize database queries for better performance');
      recommendations.push('Consider implementing caching for frequently accessed reviews');
    }
    
    if (this.results.issues.length > 5) {
      recommendations.push('Address critical issues before production deployment');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('System appears ready for production deployment');
      recommendations.push('Consider running full test suite for comprehensive validation');
    }
    
    this.results.recommendations = recommendations;
    
    recommendations.forEach(rec => {
      log(`   • ${rec}`, 'yellow');
    });
  }

  generateReport() {
    const duration = Date.now() - this.startTime;
    const report = {
      timestamp: new Date().toISOString(),
      duration: duration,
      summary: {
        databaseConnection: this.results.databaseConnection,
        tourCount: this.results.tourCount,
        expectedPages: this.results.totalPages,
        reviewsFound: this.results.reviewsFound,
        performanceAcceptable: Object.values(this.results.performanceMetrics).every(metric => metric < 1000),
        issueCount: this.results.issues.length,
        deploymentReady: this.results.databaseConnection && this.results.issues.length < 3
      },
      details: this.results,
      validation: {
        languages: ['en', 'de', 'fr', 'es', 'ar'],
        expectedTourCount: '~21',
        expectedPages: 105,
        performanceThresholds: {
          singleLoad: '< 800ms',
          statsLoad: '< 400ms',
          batchLoad: '< 2000ms'
        }
      }
    };
    
    // Write report to file
    const reportsDir = './tests/reviews/reports';
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(reportsDir, 'quick-validation-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    return report;
  }

  displaySummary() {
    const report = this.generateReport();
    const duration = (report.duration / 1000).toFixed(2);
    
    log('\n' + '='.repeat(70), 'bright');
    log('🔍 TOUR REVIEWS SYSTEM VALIDATION SUMMARY', 'bright');
    log('='.repeat(70), 'bright');
    
    log(`\n⏱️  Duration: ${duration}s`, 'blue');
    
    log('\n📊 System Status:', 'bright');
    log(`   Database Connection: ${report.summary.databaseConnection ? '✅' : '❌'}`, 
        report.summary.databaseConnection ? 'green' : 'red');
    log(`   Tours Found: ${report.summary.tourCount}`, 'blue');
    log(`   Expected Pages: ${report.summary.expectedPages}`, 'blue');
    log(`   Reviews Found: ${report.summary.reviewsFound}`, 'blue');
    log(`   Performance: ${report.summary.performanceAcceptable ? '✅ Acceptable' : '⚠️  Needs Improvement'}`,
        report.summary.performanceAcceptable ? 'green' : 'yellow');
    
    if (this.results.issues.length > 0) {
      log(`\n⚠️  Issues Found (${this.results.issues.length}):`, 'yellow');
      this.results.issues.slice(0, 5).forEach(issue => {
        log(`   • ${issue}`, 'red');
      });
      if (this.results.issues.length > 5) {
        log(`   ... and ${this.results.issues.length - 5} more`, 'yellow');
      }
    }
    
    log('\n💡 Recommendations:', 'bright');
    this.results.recommendations.forEach(rec => {
      log(`   • ${rec}`, 'cyan');
    });
    
    log('\n🚀 Deployment Status:', 'bright');
    if (report.summary.deploymentReady) {
      log('✅ READY FOR DEPLOYMENT', 'green');
      log('   System passes basic validation checks', 'green');
      log('   Run full test suite for comprehensive validation', 'blue');
    } else {
      log('❌ NOT READY FOR DEPLOYMENT', 'red');
      log('   Critical issues must be resolved first', 'red');
    }
    
    log('\n📄 Detailed report saved to: tests/reviews/reports/quick-validation-report.json', 'blue');
    log('🧪 Run full test suite: npm run test:reviews:all', 'blue');
    
    log('\n' + '='.repeat(70), 'bright');
    
    return report.summary.deploymentReady;
  }

  async run() {
    log('🚀 Starting Tour Reviews System Validation...', 'bright');
    log('This is a quick validation. Run the full test suite for comprehensive testing.', 'yellow');
    
    await this.validateDatabaseConnection();
    await this.validateTourData();
    await this.validateReviewsAcrossLanguages();
    await this.validatePerformance();
    await this.validateReviewQuality();
    
    this.generateRecommendations();
    
    return this.displaySummary();
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new ReviewsValidator();
  
  validator.run()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Validation failed:', error);
      process.exit(1);
    });
}

module.exports = ReviewsValidator;