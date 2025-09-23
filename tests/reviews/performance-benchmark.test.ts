/**
 * Performance Benchmark Tests for Tour Reviews System
 * 
 * Tests loading times, concurrent access, and performance under load
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/testing-library/jest-dom';
import { getTourReviews, getTourReviewsWithFallback, getTourReviewStats } from '@/lib/tour-reviews-db';
import { getToursWithLocale } from '@/lib/tours';
import { Locale } from '@/lib/i18n/config';

// Performance thresholds (in milliseconds)
const PERFORMANCE_THRESHOLDS = {
  single_review_load: 800,      // Single tour review loading
  bulk_review_load: 2000,       // Multiple tours loading
  stats_load: 400,              // Statistics loading
  concurrent_load: 3000,        // Multiple concurrent requests
  fallback_load: 200,           // Fallback system response
  cache_hit: 100,               // Cached response
  database_query: 1500,         // Direct database query
  memory_usage: 100 * 1024 * 1024  // 100MB memory limit
};

// Test configuration
const TEST_CONFIG = {
  languages: ['en', 'de', 'fr', 'es', 'ar'] as Locale[],
  concurrentRequestCount: 20,
  loadTestDuration: 5000, // 5 seconds
  sampleSize: 10,
  memoryCheckInterval: 100
};

interface PerformanceResult {
  operation: string;
  duration: number;
  memoryBefore: number;
  memoryAfter: number;
  success: boolean;
  error?: string;
  metadata?: any;
}

let performanceResults: PerformanceResult[] = [];
let testTours: any[] = [];

describe('Performance Benchmark - Tour Reviews', () => {
  beforeAll(async () => {
    // Load test data
    testTours = await getToursWithLocale('en');
    console.log(`Loaded ${testTours.length} tours for performance testing`);
    
    // Warm up the system
    if (testTours.length > 0) {
      await getTourReviews(testTours[0].slug, 'en', 1);
    }
  });

  describe('Single Operation Performance', () => {
    test('single tour review loading should meet performance threshold', async () => {
      const results: PerformanceResult[] = [];
      
      for (let i = 0; i < TEST_CONFIG.sampleSize && i < testTours.length; i++) {
        const tour = testTours[i];
        const memoryBefore = process.memoryUsage().heapUsed;
        const startTime = performance.now();
        
        try {
          const reviews = await getTourReviews(tour.slug, 'en', 3);
          const endTime = performance.now();
          const memoryAfter = process.memoryUsage().heapUsed;
          const duration = endTime - startTime;
          
          results.push({
            operation: 'single_review_load',
            duration,
            memoryBefore,
            memoryAfter,
            success: true,
            metadata: { tourSlug: tour.slug, reviewCount: reviews.length }
          });
          
          expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.single_review_load);
          
        } catch (error) {
          results.push({
            operation: 'single_review_load',
            duration: performance.now() - startTime,
            memoryBefore,
            memoryAfter: process.memoryUsage().heapUsed,
            success: false,
            error: String(error)
          });
        }
      }
      
      performanceResults.push(...results);
      
      // Calculate average performance
      const successfulResults = results.filter(r => r.success);
      const averageDuration = successfulResults.reduce((sum, r) => sum + r.duration, 0) / successfulResults.length;
      
      console.log(`Average single review load time: ${averageDuration.toFixed(2)}ms`);
      expect(averageDuration).toBeLessThan(PERFORMANCE_THRESHOLDS.single_review_load * 0.8);
    });

    test('review statistics loading should be fast', async () => {
      const results: PerformanceResult[] = [];
      
      for (let i = 0; i < TEST_CONFIG.sampleSize && i < testTours.length; i++) {
        const tour = testTours[i];
        const memoryBefore = process.memoryUsage().heapUsed;
        const startTime = performance.now();
        
        try {
          const stats = await getTourReviewStats(tour.slug, 'en');
          const endTime = performance.now();
          const memoryAfter = process.memoryUsage().heapUsed;
          const duration = endTime - startTime;
          
          results.push({
            operation: 'stats_load',
            duration,
            memoryBefore,
            memoryAfter,
            success: true,
            metadata: { tourSlug: tour.slug, ...stats }
          });
          
          expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.stats_load);
          
        } catch (error) {
          results.push({
            operation: 'stats_load',
            duration: performance.now() - startTime,
            memoryBefore,
            memoryAfter: process.memoryUsage().heapUsed,
            success: false,
            error: String(error)
          });
        }
      }
      
      performanceResults.push(...results);
      
      const successfulResults = results.filter(r => r.success);
      const averageDuration = successfulResults.reduce((sum, r) => sum + r.duration, 0) / successfulResults.length;
      
      console.log(`Average stats load time: ${averageDuration.toFixed(2)}ms`);
      expect(averageDuration).toBeLessThan(PERFORMANCE_THRESHOLDS.stats_load * 0.7);
    });

    test('fallback system should be extremely fast', async () => {
      const results: PerformanceResult[] = [];
      
      // Test fallback with non-existent tours
      for (let i = 0; i < TEST_CONFIG.sampleSize; i++) {
        const nonExistentSlug = `non-existent-tour-${i}-${Date.now()}`;
        const memoryBefore = process.memoryUsage().heapUsed;
        const startTime = performance.now();
        
        try {
          const reviews = await getTourReviewsWithFallback(nonExistentSlug, 'en', 3);
          const endTime = performance.now();
          const memoryAfter = process.memoryUsage().heapUsed;
          const duration = endTime - startTime;
          
          results.push({
            operation: 'fallback_load',
            duration,
            memoryBefore,
            memoryAfter,
            success: true,
            metadata: { reviewCount: reviews.length }
          });
          
          expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.fallback_load);
          
        } catch (error) {
          results.push({
            operation: 'fallback_load',
            duration: performance.now() - startTime,
            memoryBefore,
            memoryAfter: process.memoryUsage().heapUsed,
            success: false,
            error: String(error)
          });
        }
      }
      
      performanceResults.push(...results);
      
      const successfulResults = results.filter(r => r.success);
      const averageDuration = successfulResults.reduce((sum, r) => sum + r.duration, 0) / successfulResults.length;
      
      console.log(`Average fallback response time: ${averageDuration.toFixed(2)}ms`);
      expect(averageDuration).toBeLessThan(PERFORMANCE_THRESHOLDS.fallback_load);
    });
  });

  describe('Concurrent Access Performance', () => {
    test('should handle multiple concurrent review requests efficiently', async () => {
      const concurrentPromises: Promise<any>[] = [];
      const startTime = performance.now();
      
      // Create multiple concurrent requests
      for (let i = 0; i < TEST_CONFIG.concurrentRequestCount && i < testTours.length; i++) {
        const tour = testTours[i % testTours.length];
        const language = TEST_CONFIG.languages[i % TEST_CONFIG.languages.length];
        
        concurrentPromises.push(
          getTourReviewsWithFallback(tour.slug, language, 3).then(reviews => ({
            tourSlug: tour.slug,
            language,
            reviewCount: reviews.length,
            success: true
          })).catch(error => ({
            tourSlug: tour.slug,
            language,
            success: false,
            error: String(error)
          }))
        );
      }
      
      const results = await Promise.all(concurrentPromises);
      const totalDuration = performance.now() - startTime;
      
      performanceResults.push({
        operation: 'concurrent_load',
        duration: totalDuration,
        memoryBefore: 0, // Not tracked for concurrent
        memoryAfter: 0,
        success: results.every(r => r.success),
        metadata: {
          requestCount: TEST_CONFIG.concurrentRequestCount,
          successCount: results.filter(r => r.success).length,
          results
        }
      });
      
      console.log(`Concurrent requests (${TEST_CONFIG.concurrentRequestCount}): ${totalDuration.toFixed(2)}ms`);
      expect(totalDuration).toBeLessThan(PERFORMANCE_THRESHOLDS.concurrent_load);
      
      // Most requests should succeed
      const successRate = results.filter(r => r.success).length / results.length;
      expect(successRate).toBeGreaterThan(0.8); // 80% success rate minimum
    });

    test('should handle language-switching performance', async () => {
      const languagePromises: Promise<any>[] = [];
      const tour = testTours[0];
      
      if (!tour) return;
      
      const startTime = performance.now();
      
      // Request same tour in all languages simultaneously
      for (const language of TEST_CONFIG.languages) {
        languagePromises.push(
          getTourReviewsWithFallback(tour.slug, language, 5).then(reviews => ({
            language,
            reviewCount: reviews.length,
            success: true
          })).catch(error => ({
            language,
            success: false,
            error: String(error)
          }))
        );
      }
      
      const results = await Promise.all(languagePromises);
      const totalDuration = performance.now() - startTime;
      
      console.log(`Language switching test: ${totalDuration.toFixed(2)}ms`);
      expect(totalDuration).toBeLessThan(PERFORMANCE_THRESHOLDS.bulk_review_load);
      
      // All languages should respond
      const successRate = results.filter(r => r.success).length / results.length;
      expect(successRate).toBe(1.0); // 100% success for language switching
    });
  });

  describe('Memory Usage and Leak Detection', () => {
    test('should not cause memory leaks during extended operation', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      const memorySnapshots: number[] = [initialMemory];
      
      // Perform many operations
      for (let i = 0; i < 50 && i < testTours.length * 2; i++) {
        const tour = testTours[i % testTours.length];
        const language = TEST_CONFIG.languages[i % TEST_CONFIG.languages.length];
        
        await getTourReviewsWithFallback(tour.slug, language, 3);
        
        // Take memory snapshot every 10 operations
        if (i % 10 === 0) {
          // Force garbage collection if available
          if (global.gc) {
            global.gc();
          }
          memorySnapshots.push(process.memoryUsage().heapUsed);
        }
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      console.log(`Memory usage: ${initialMemory} -> ${finalMemory} (${memoryIncrease} bytes increase)`);
      
      // Memory increase should be reasonable
      expect(memoryIncrease).toBeLessThan(PERFORMANCE_THRESHOLDS.memory_usage);
      
      // Memory should not consistently increase (no major leaks)
      const trend = memorySnapshots.slice(-3).reduce((sum, val, idx, arr) => {
        return idx === 0 ? 0 : sum + (val - arr[idx - 1]);
      }, 0) / 2;
      
      // Memory trend should be relatively stable
      expect(Math.abs(trend)).toBeLessThan(PERFORMANCE_THRESHOLDS.memory_usage * 0.1);
    });

    test('should handle rapid successive calls without performance degradation', async () => {
      const tour = testTours[0];
      if (!tour) return;
      
      const durations: number[] = [];
      
      // Make rapid successive calls
      for (let i = 0; i < 20; i++) {
        const startTime = performance.now();
        await getTourReviews(tour.slug, 'en', 1);
        const duration = performance.now() - startTime;
        durations.push(duration);
      }
      
      // Performance should not degrade significantly over time
      const firstHalf = durations.slice(0, 10);
      const secondHalf = durations.slice(10);
      
      const firstAvg = firstHalf.reduce((sum, d) => sum + d, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, d) => sum + d, 0) / secondHalf.length;
      
      // Second half should not be more than 50% slower than first half
      expect(secondAvg).toBeLessThan(firstAvg * 1.5);
    });
  });

  describe('Load Testing', () => {
    test('should maintain performance under sustained load', async () => {
      const loadTestResults: any[] = [];
      const startTime = Date.now();
      const endTime = startTime + TEST_CONFIG.loadTestDuration;
      
      let operationCount = 0;
      
      while (Date.now() < endTime) {
        const tour = testTours[operationCount % testTours.length];
        const language = TEST_CONFIG.languages[operationCount % TEST_CONFIG.languages.length];
        
        const operationStart = performance.now();
        
        try {
          const reviews = await getTourReviews(tour.slug, language, 2);
          const operationDuration = performance.now() - operationStart;
          
          loadTestResults.push({
            operation: operationCount,
            duration: operationDuration,
            success: true,
            reviewCount: reviews.length
          });
          
        } catch (error) {
          loadTestResults.push({
            operation: operationCount,
            duration: performance.now() - operationStart,
            success: false,
            error: String(error)
          });
        }
        
        operationCount++;
        
        // Small delay to prevent overwhelming
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      const totalDuration = Date.now() - startTime;
      const successfulOps = loadTestResults.filter(r => r.success);
      const averageDuration = successfulOps.reduce((sum, r) => sum + r.duration, 0) / successfulOps.length;
      const successRate = successfulOps.length / loadTestResults.length;
      const opsPerSecond = operationCount / (totalDuration / 1000);
      
      console.log(`Load test: ${operationCount} ops in ${totalDuration}ms (${opsPerSecond.toFixed(2)} ops/sec)`);
      console.log(`Success rate: ${(successRate * 100).toFixed(2)}%`);
      console.log(`Average duration: ${averageDuration.toFixed(2)}ms`);
      
      // Performance criteria for load test
      expect(averageDuration).toBeLessThan(PERFORMANCE_THRESHOLDS.single_review_load * 2);
      expect(successRate).toBeGreaterThan(0.9); // 90% success rate under load
      expect(opsPerSecond).toBeGreaterThan(1); // At least 1 operation per second
      
      performanceResults.push({
        operation: 'load_test',
        duration: totalDuration,
        memoryBefore: 0,
        memoryAfter: 0,
        success: successRate > 0.9,
        metadata: {
          operationCount,
          successRate,
          opsPerSecond,
          averageDuration
        }
      });
    });
  });

  afterAll(async () => {
    // Generate performance report
    const report = {
      timestamp: new Date().toISOString(),
      testDuration: TEST_CONFIG.loadTestDuration,
      totalOperations: performanceResults.length,
      thresholds: PERFORMANCE_THRESHOLDS,
      results: {
        single_review_load: performanceResults.filter(r => r.operation === 'single_review_load'),
        stats_load: performanceResults.filter(r => r.operation === 'stats_load'),
        fallback_load: performanceResults.filter(r => r.operation === 'fallback_load'),
        concurrent_load: performanceResults.filter(r => r.operation === 'concurrent_load'),
        load_test: performanceResults.filter(r => r.operation === 'load_test')
      },
      summary: {
        totalTests: performanceResults.length,
        successfulTests: performanceResults.filter(r => r.success).length,
        averageDuration: performanceResults.reduce((sum, r) => sum + r.duration, 0) / performanceResults.length,
        fastestOperation: Math.min(...performanceResults.map(r => r.duration)),
        slowestOperation: Math.max(...performanceResults.map(r => r.duration))
      }
    };
    
    console.log('\n🚀 PERFORMANCE BENCHMARK REPORT');
    console.log('='.repeat(50));
    console.log(`📊 Total Operations: ${report.totalOperations}`);
    console.log(`✅ Successful: ${report.summary.successfulTests}/${report.summary.totalTests}`);
    console.log(`⏱️  Average Duration: ${report.summary.averageDuration.toFixed(2)}ms`);
    console.log(`🏆 Fastest: ${report.summary.fastestOperation.toFixed(2)}ms`);
    console.log(`🐌 Slowest: ${report.summary.slowestOperation.toFixed(2)}ms`);
    
    // Write detailed performance report
    require('fs').writeFileSync(
      './tests/reviews/performance-benchmark-report.json',
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n📄 Detailed performance report saved to: ./tests/reviews/performance-benchmark-report.json');
  });
});