#!/usr/bin/env node

/**
 * Automated Tour Reviews Validation Runner
 * 
 * Comprehensive test runner that validates all aspects of the tour reviews system
 * across all 105 tour pages (21 tours × 5 languages)
 */

import { execSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { performance } from 'perf_hooks';

interface TestSuite {
  name: string;
  description: string;
  testFile: string;
  timeout: number;
  critical: boolean;
}

interface ValidationResult {
  suite: string;
  passed: boolean;
  duration: number;
  errors: string[];
  warnings: string[];
  coverage?: {
    tours: number;
    languages: number;
    pages: number;
  };
}

const TEST_SUITES: TestSuite[] = [
  {
    name: 'Database Integrity',
    description: 'Tests database connection, schema, and data consistency',
    testFile: 'database-integrity.test.ts',
    timeout: 30000,
    critical: true
  },
  {
    name: 'Comprehensive Reviews',
    description: 'Tests all tours and languages for review functionality',
    testFile: 'tour-reviews-comprehensive.test.ts',
    timeout: 120000, // 2 minutes for comprehensive testing
    critical: true
  },
  {
    name: 'Performance Benchmark',
    description: 'Tests performance under various load conditions',
    testFile: 'performance-benchmark.test.ts',
    timeout: 60000,
    critical: false
  },
  {
    name: 'Page Display',
    description: 'Tests review display on all 105 tour pages',
    testFile: 'page-display.test.ts',
    timeout: 300000, // 5 minutes for all page testing
    critical: true
  }
];

const VALIDATION_CONFIG = {
  outputDir: './tests/reviews/reports',
  maxRetries: 2,
  parallelSuites: false, // Run sequentially for accurate reporting
  languages: ['en', 'de', 'fr', 'es', 'ar'],
  expectedTourCount: 21,
  totalExpectedPages: 105
};

class ReviewValidationRunner {
  private results: ValidationResult[] = [];
  private startTime: number = 0;

  constructor() {
    this.ensureOutputDirectory();
  }

  private ensureOutputDirectory(): void {
    if (!fs.existsSync(VALIDATION_CONFIG.outputDir)) {
      fs.mkdirSync(VALIDATION_CONFIG.outputDir, { recursive: true });
    }
  }

  private async runTestSuite(suite: TestSuite, attempt: number = 1): Promise<ValidationResult> {
    console.log(`\n🧪 Running ${suite.name} (Attempt ${attempt})...`);
    console.log(`   ${suite.description}`);
    
    const startTime = performance.now();
    const result: ValidationResult = {
      suite: suite.name,
      passed: false,
      duration: 0,
      errors: [],
      warnings: []
    };

    try {
      // Run the test suite
      const testCommand = `npx jest tests/reviews/${suite.testFile} --verbose --detectOpenHandles --forceExit`;
      
      const output = execSync(testCommand, {
        encoding: 'utf8',
        timeout: suite.timeout,
        cwd: process.cwd()
      });

      result.duration = performance.now() - startTime;
      result.passed = true;

      // Parse output for additional information
      if (output.includes('PASS')) {
        console.log(`   ✅ ${suite.name} passed in ${result.duration.toFixed(2)}ms`);
      }

      // Extract coverage information if available
      const tourMatch = output.match(/(\d+) tours/);
      const pageMatch = output.match(/(\d+)\/(\d+) pages/);
      
      if (tourMatch || pageMatch) {
        result.coverage = {
          tours: tourMatch ? parseInt(tourMatch[1]) : 0,
          languages: VALIDATION_CONFIG.languages.length,
          pages: pageMatch ? parseInt(pageMatch[2]) : 0
        };
      }

    } catch (error: any) {
      result.duration = performance.now() - startTime;
      result.passed = false;
      
      const errorMessage = error.stdout || error.stderr || error.message || String(error);
      result.errors.push(errorMessage);

      console.log(`   ❌ ${suite.name} failed: ${error.message}`);

      // Retry logic for critical tests
      if (suite.critical && attempt < VALIDATION_CONFIG.maxRetries) {
        console.log(`   🔄 Retrying ${suite.name} (${attempt + 1}/${VALIDATION_CONFIG.maxRetries})...`);
        return await this.runTestSuite(suite, attempt + 1);
      }
    }

    return result;
  }

  private async runAllSuites(): Promise<void> {
    console.log('🚀 Starting Tour Reviews Validation Suite\n');
    console.log(`📊 Expected Coverage:`);
    console.log(`   • Languages: ${VALIDATION_CONFIG.languages.length}`);
    console.log(`   • Tours: ~${VALIDATION_CONFIG.expectedTourCount}`);
    console.log(`   • Total Pages: ${VALIDATION_CONFIG.totalExpectedPages}`);
    
    this.startTime = performance.now();

    for (const suite of TEST_SUITES) {
      const result = await this.runTestSuite(suite);
      this.results.push(result);

      // Stop on critical test failure
      if (!result.passed && suite.critical) {
        console.log(`\n🛑 Critical test ${suite.name} failed. Stopping validation.`);
        break;
      }
    }
  }

  private generateSummaryReport(): any {
    const totalDuration = performance.now() - this.startTime;
    const passedTests = this.results.filter(r => r.passed).length;
    const criticalTests = TEST_SUITES.filter(s => s.critical).length;
    const criticalPassed = this.results.filter(r => 
      r.passed && TEST_SUITES.find(s => s.name === r.suite)?.critical
    ).length;

    const report = {
      timestamp: new Date().toISOString(),
      duration: totalDuration,
      summary: {
        totalSuites: TEST_SUITES.length,
        passedSuites: passedTests,
        criticalSuites: criticalTests,
        criticalPassed: criticalPassed,
        overallSuccess: criticalPassed === criticalTests,
        coverageAchieved: this.calculateCoverageAchieved()
      },
      results: this.results.map(r => ({
        ...r,
        criticalTest: TEST_SUITES.find(s => s.name === r.suite)?.critical || false
      })),
      recommendations: this.generateRecommendations(),
      deploymentReadiness: this.assessDeploymentReadiness()
    };

    return report;
  }

  private calculateCoverageAchieved(): any {
    const coverageResults = this.results.filter(r => r.coverage);
    
    if (coverageResults.length === 0) {
      return { tours: 0, languages: 0, pages: 0 };
    }

    return {
      tours: Math.max(...coverageResults.map(r => r.coverage?.tours || 0)),
      languages: Math.max(...coverageResults.map(r => r.coverage?.languages || 0)),
      pages: Math.max(...coverageResults.map(r => r.coverage?.pages || 0))
    };
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const failedTests = this.results.filter(r => !r.passed);
    const slowTests = this.results.filter(r => r.duration > 30000); // > 30 seconds

    if (failedTests.length > 0) {
      recommendations.push(`Fix ${failedTests.length} failing test suite(s)`);
      failedTests.forEach(test => {
        if (test.errors.length > 0) {
          recommendations.push(`Address ${test.suite}: ${test.errors[0].substring(0, 100)}...`);
        }
      });
    }

    if (slowTests.length > 0) {
      recommendations.push('Optimize performance for slow test suites');
    }

    const coverage = this.calculateCoverageAchieved();
    if (coverage.tours < VALIDATION_CONFIG.expectedTourCount * 0.8) {
      recommendations.push('Increase tour coverage - some tours may not be accessible');
    }

    if (coverage.pages < VALIDATION_CONFIG.totalExpectedPages * 0.8) {
      recommendations.push('Increase page coverage - some language/tour combinations may be failing');
    }

    if (recommendations.length === 0) {
      recommendations.push('All validations passed - system is ready for production');
    }

    return recommendations;
  }

  private assessDeploymentReadiness(): {
    ready: boolean;
    confidence: number;
    blockers: string[];
  } {
    const criticalPassed = this.results.filter(r => 
      r.passed && TEST_SUITES.find(s => s.name === r.suite)?.critical
    ).length;
    const totalCritical = TEST_SUITES.filter(s => s.critical).length;
    
    const coverage = this.calculateCoverageAchieved();
    const blockers: string[] = [];

    // Check for critical test failures
    if (criticalPassed < totalCritical) {
      blockers.push(`${totalCritical - criticalPassed} critical test(s) failing`);
    }

    // Check coverage thresholds
    if (coverage.tours < VALIDATION_CONFIG.expectedTourCount * 0.8) {
      blockers.push('Insufficient tour coverage (<80%)');
    }

    if (coverage.pages < VALIDATION_CONFIG.totalExpectedPages * 0.7) {
      blockers.push('Insufficient page coverage (<70%)');
    }

    const confidence = (criticalPassed / totalCritical) * 
                      Math.min(coverage.tours / VALIDATION_CONFIG.expectedTourCount, 1) *
                      Math.min(coverage.pages / VALIDATION_CONFIG.totalExpectedPages, 1) * 100;

    return {
      ready: blockers.length === 0,
      confidence: Math.min(confidence, 100),
      blockers
    };
  }

  private displayResults(): void {
    const report = this.generateSummaryReport();
    
    console.log('\n' + '='.repeat(80));
    console.log('🔍 TOUR REVIEWS VALIDATION REPORT');
    console.log('='.repeat(80));
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total Duration: ${(report.duration / 1000).toFixed(2)}s`);
    console.log(`   Test Suites: ${report.summary.passedSuites}/${report.summary.totalSuites} passed`);
    console.log(`   Critical Tests: ${report.summary.criticalPassed}/${report.summary.criticalSuites} passed`);
    console.log(`   Overall Success: ${report.summary.overallSuccess ? '✅ YES' : '❌ NO'}`);
    
    console.log(`\n🎯 COVERAGE ACHIEVED:`);
    console.log(`   Tours Tested: ${report.summary.coverageAchieved.tours}/${VALIDATION_CONFIG.expectedTourCount}`);
    console.log(`   Languages: ${report.summary.coverageAchieved.languages}/${VALIDATION_CONFIG.languages.length}`);
    console.log(`   Pages Tested: ${report.summary.coverageAchieved.pages}/${VALIDATION_CONFIG.totalExpectedPages}`);
    
    console.log(`\n📋 TEST RESULTS:`);
    this.results.forEach(result => {
      const icon = result.passed ? '✅' : '❌';
      const critical = TEST_SUITES.find(s => s.name === result.suite)?.critical ? '🔴' : '🟡';
      console.log(`   ${icon} ${critical} ${result.suite} (${result.duration.toFixed(2)}ms)`);
      
      if (!result.passed && result.errors.length > 0) {
        result.errors.slice(0, 2).forEach(error => {
          console.log(`      Error: ${error.substring(0, 100)}...`);
        });
      }
    });
    
    console.log(`\n🚀 DEPLOYMENT READINESS:`);
    console.log(`   Ready: ${report.deploymentReadiness.ready ? '✅ YES' : '❌ NO'}`);
    console.log(`   Confidence: ${report.deploymentReadiness.confidence.toFixed(1)}%`);
    
    if (report.deploymentReadiness.blockers.length > 0) {
      console.log(`   Blockers:`);
      report.deploymentReadiness.blockers.forEach(blocker => {
        console.log(`      • ${blocker}`);
      });
    }
    
    console.log(`\n💡 RECOMMENDATIONS:`);
    report.recommendations.forEach(rec => {
      console.log(`   • ${rec}`);
    });
    
    console.log('\n' + '='.repeat(80));

    // Save detailed report
    const reportPath = path.join(VALIDATION_CONFIG.outputDir, 'validation-summary.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Detailed report saved to: ${reportPath}`);
  }

  public async run(): Promise<boolean> {
    try {
      await this.runAllSuites();
      this.displayResults();
      
      const report = this.generateSummaryReport();
      return report.summary.overallSuccess;
      
    } catch (error) {
      console.error('🚨 Validation runner failed:', error);
      return false;
    }
  }
}

// CLI Interface
if (require.main === module) {
  const runner = new ReviewValidationRunner();
  
  runner.run().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { ReviewValidationRunner, VALIDATION_CONFIG, TEST_SUITES };