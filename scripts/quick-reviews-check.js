#!/usr/bin/env node

/**
 * Quick Tour Reviews System Check
 * 
 * A lightweight validation script that checks the basic functionality
 * of the tour reviews system without requiring complex imports.
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = (message, color = 'reset') => {
  console.log(COLORS[color] + message + COLORS.reset);
};

class QuickReviewsCheck {
  constructor() {
    this.results = {
      filesExist: false,
      configValid: false,
      dependencies: false,
      structure: false,
      testSuite: false
    };
    this.issues = [];
    this.recommendations = [];
  }

  checkFileStructure() {
    log('\n📁 Checking File Structure...', 'cyan');
    
    const requiredFiles = [
      'lib/tour-reviews.ts',
      'lib/tour-reviews-db.ts',
      'lib/tours.ts',
      'components/tours/GuestReviewsSectionSSR.tsx',
      'tests/reviews/tour-reviews-comprehensive.test.ts',
      'tests/reviews/database-integrity.test.ts',
      'tests/reviews/performance-benchmark.test.ts',
      'tests/reviews/page-display.test.ts'
    ];
    
    let existingFiles = 0;
    let missingFiles = [];
    
    for (const file of requiredFiles) {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        existingFiles++;
        log(`   ✅ ${file}`, 'green');
      } else {
        missingFiles.push(file);
        log(`   ❌ ${file}`, 'red');
      }
    }
    
    this.results.filesExist = missingFiles.length === 0;
    
    if (missingFiles.length > 0) {
      this.issues.push(`Missing ${missingFiles.length} required files`);
      this.recommendations.push('Ensure all tour review system files are present');
    }
    
    log(`\n   📊 Files: ${existingFiles}/${requiredFiles.length} present`, 'blue');
    return this.results.filesExist;
  }

  checkEnvironmentConfig() {
    log('\n⚙️  Checking Environment Configuration...', 'cyan');
    
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];
    
    let configIssues = 0;
    
    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        log(`   ✅ ${envVar} configured`, 'green');
      } else {
        log(`   ⚠️  ${envVar} missing`, 'yellow');
        configIssues++;
      }
    }
    
    // Check .env files
    const envFiles = ['.env.local', '.env'];
    let envFileFound = false;
    
    for (const envFile of envFiles) {
      if (fs.existsSync(path.join(process.cwd(), envFile))) {
        log(`   ✅ ${envFile} exists`, 'green');
        envFileFound = true;
        break;
      }
    }
    
    if (!envFileFound) {
      log(`   ⚠️  No .env files found`, 'yellow');
      this.recommendations.push('Create .env.local with Supabase credentials');
    }
    
    this.results.configValid = configIssues === 0;
    
    if (configIssues > 0) {
      this.issues.push(`${configIssues} environment configuration issues`);
    }
    
    return this.results.configValid;
  }

  checkDependencies() {
    log('\n📦 Checking Dependencies...', 'cyan');
    
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      log('   ❌ package.json not found', 'red');
      this.issues.push('package.json missing');
      return false;
    }
    
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      const requiredDeps = [
        '@supabase/supabase-js',
        'next-intl',
        'react',
        'next',
        '@testing-library/react',
        '@testing-library/jest-dom',
        'jest'
      ];
      
      let missingDeps = 0;
      
      for (const dep of requiredDeps) {
        if (dependencies[dep]) {
          log(`   ✅ ${dep}`, 'green');
        } else {
          log(`   ❌ ${dep} missing`, 'red');
          missingDeps++;
        }
      }
      
      this.results.dependencies = missingDeps === 0;
      
      if (missingDeps > 0) {
        this.issues.push(`${missingDeps} required dependencies missing`);
        this.recommendations.push('Install missing dependencies with npm install');
      }
      
      return this.results.dependencies;
      
    } catch (error) {
      log('   ❌ Error reading package.json', 'red');
      this.issues.push('Cannot parse package.json');
      return false;
    }
  }

  checkCodeStructure() {
    log('\n🏗️  Checking Code Structure...', 'cyan');
    
    const checks = [];
    
    // Check tour-reviews-db.ts structure
    const tourReviewsDbPath = path.join(process.cwd(), 'lib/tour-reviews-db.ts');
    if (fs.existsSync(tourReviewsDbPath)) {
      const content = fs.readFileSync(tourReviewsDbPath, 'utf8');
      
      const requiredExports = [
        'getTourReviews',
        'getTourReviewsWithFallback',
        'getTourReviewStats',
        'DatabaseReview'
      ];
      
      for (const exportName of requiredExports) {
        if (content.includes(`export`) && content.includes(exportName)) {
          checks.push({ name: `${exportName} export`, status: true });
        } else {
          checks.push({ name: `${exportName} export`, status: false });
        }
      }
    }
    
    // Check component structure
    const componentPath = path.join(process.cwd(), 'components/tours/GuestReviewsSectionSSR.tsx');
    if (fs.existsSync(componentPath)) {
      const content = fs.readFileSync(componentPath, 'utf8');
      
      if (content.includes('export') && content.includes('GuestReviewsSectionSSR')) {
        checks.push({ name: 'GuestReviewsSectionSSR component', status: true });
      } else {
        checks.push({ name: 'GuestReviewsSectionSSR component', status: false });
      }
    }
    
    let passedChecks = 0;
    
    for (const check of checks) {
      if (check.status) {
        log(`   ✅ ${check.name}`, 'green');
        passedChecks++;
      } else {
        log(`   ❌ ${check.name}`, 'red');
      }
    }
    
    this.results.structure = checks.length > 0 && passedChecks === checks.length;
    
    if (!this.results.structure) {
      this.issues.push('Code structure issues detected');
      this.recommendations.push('Review function exports and component structure');
    }
    
    return this.results.structure;
  }

  checkTestSuite() {
    log('\n🧪 Checking Test Suite...', 'cyan');
    
    const testFiles = [
      'tests/reviews/tour-reviews-comprehensive.test.ts',
      'tests/reviews/database-integrity.test.ts',
      'tests/reviews/performance-benchmark.test.ts',
      'tests/reviews/page-display.test.ts',
      'tests/reviews/automated-validation-runner.ts'
    ];
    
    let testFilesExist = 0;
    
    for (const testFile of testFiles) {
      if (fs.existsSync(path.join(process.cwd(), testFile))) {
        log(`   ✅ ${testFile}`, 'green');
        testFilesExist++;
      } else {
        log(`   ❌ ${testFile}`, 'red');
      }
    }
    
    // Check Jest configuration
    const jestConfigPath = path.join(process.cwd(), 'tests/reviews/jest.config.js');
    const hasJestConfig = fs.existsSync(jestConfigPath);
    
    if (hasJestConfig) {
      log('   ✅ Jest configuration', 'green');
    } else {
      log('   ❌ Jest configuration missing', 'red');
    }
    
    this.results.testSuite = testFilesExist === testFiles.length && hasJestConfig;
    
    if (!this.results.testSuite) {
      this.issues.push('Test suite incomplete or misconfigured');
      this.recommendations.push('Ensure all test files are present and Jest is configured');
    }
    
    log(`\n   📊 Test Files: ${testFilesExist}/${testFiles.length} present`, 'blue');
    return this.results.testSuite;
  }

  generateRecommendations() {
    log('\n💡 Analyzing System State...', 'cyan');
    
    if (this.results.filesExist && this.results.configValid && this.results.dependencies && 
        this.results.structure && this.results.testSuite) {
      this.recommendations.push('✅ System appears ready for testing');
      this.recommendations.push('Run: npm run test:reviews:all');
      this.recommendations.push('Run: node tests/reviews/automated-validation-runner.ts');
    }
    
    if (!this.results.configValid) {
      this.recommendations.push('Configure Supabase environment variables');
      this.recommendations.push('Verify database connectivity');
    }
    
    if (!this.results.dependencies) {
      this.recommendations.push('Install missing dependencies');
      this.recommendations.push('Run: npm install');
    }
    
    if (!this.results.testSuite) {
      this.recommendations.push('Complete test suite setup');
      this.recommendations.push('Verify Jest configuration');
    }
    
    if (this.issues.length === 0) {
      this.recommendations.push('System ready for comprehensive validation');
    }
  }

  displaySummary() {
    log('\n' + '='.repeat(60), 'bright');
    log('🔍 QUICK TOUR REVIEWS SYSTEM CHECK', 'bright');
    log('='.repeat(60), 'bright');
    
    const checks = [
      { name: 'File Structure', status: this.results.filesExist },
      { name: 'Environment Config', status: this.results.configValid },
      { name: 'Dependencies', status: this.results.dependencies },
      { name: 'Code Structure', status: this.results.structure },
      { name: 'Test Suite', status: this.results.testSuite }
    ];
    
    log('\n📊 System Components:', 'bright');
    
    let passedChecks = 0;
    
    for (const check of checks) {
      const icon = check.status ? '✅' : '❌';
      const color = check.status ? 'green' : 'red';
      log(`   ${icon} ${check.name}`, color);
      if (check.status) passedChecks++;
    }
    
    const overallScore = (passedChecks / checks.length * 100).toFixed(0);
    
    log(`\n🎯 Overall System Health: ${overallScore}%`, 'blue');
    
    if (this.issues.length > 0) {
      log(`\n⚠️  Issues Found (${this.issues.length}):`, 'yellow');
      this.issues.forEach(issue => {
        log(`   • ${issue}`, 'red');
      });
    }
    
    log('\n💡 Next Steps:', 'bright');
    this.recommendations.forEach(rec => {
      log(`   • ${rec}`, 'cyan');
    });
    
    const isReady = passedChecks === checks.length;
    
    log('\n🚀 Status:', 'bright');
    if (isReady) {
      log('✅ READY FOR COMPREHENSIVE TESTING', 'green');
      log('   All system components are in place', 'green');
    } else {
      log('⚠️  SETUP INCOMPLETE', 'yellow');
      log(`   ${checks.length - passedChecks} component(s) need attention`, 'yellow');
    }
    
    log('\n📋 Test Coverage Expected:', 'blue');
    log('   • Languages: 5 (EN, DE, FR, ES, AR)', 'blue');
    log('   • Tours: ~21 tours', 'blue');
    log('   • Pages: 105 total (21 × 5)', 'blue');
    log('   • Test Categories: 4 (Database, Reviews, Performance, Display)', 'blue');
    
    log('\n' + '='.repeat(60), 'bright');
    
    return isReady;
  }

  async run() {
    log('🚀 Starting Quick Tour Reviews System Check...', 'bright');
    log('This checks system readiness before running comprehensive tests.\n', 'yellow');
    
    this.checkFileStructure();
    this.checkEnvironmentConfig();
    this.checkDependencies();
    this.checkCodeStructure();
    this.checkTestSuite();
    
    this.generateRecommendations();
    
    return this.displaySummary();
  }
}

// Run check if called directly
if (require.main === module) {
  const checker = new QuickReviewsCheck();
  
  checker.run()
    .then(ready => {
      if (ready) {
        console.log('\n🎉 System ready! You can now run the comprehensive test suite.');
        console.log('   Run: cd tests/reviews && npm run test:all');
      }
      process.exit(ready ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Check failed:', error);
      process.exit(1);
    });
}

module.exports = QuickReviewsCheck;