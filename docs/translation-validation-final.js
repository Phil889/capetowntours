#!/usr/bin/env node

/**
 * Final Translation Validation Script
 * 
 * This script performs comprehensive validation of all translation files
 * to ensure 100% translation coverage across all 5 languages.
 */

const fs = require('fs');
const path = require('path');

// Language files to validate
const LANGUAGES = ['en', 'de', 'fr', 'es', 'ar'];
const MESSAGES_DIR = './messages';

console.log('🌍 Cape Town Safari Tours - Final Translation Validation\n');

/**
 * Flatten nested JSON object into dot notation keys
 */
function flattenObject(obj, prefix = '') {
  let flattened = {};
  
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }
  
  return flattened;
}

/**
 * Load and validate JSON file
 */
function loadTranslationFile(language) {
  const filePath = path.join(MESSAGES_DIR, `${language}.json`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(content);
    return { success: true, data: parsed, filePath };
  } catch (error) {
    return { 
      success: false, 
      error: error.message, 
      filePath 
    };
  }
}

/**
 * Check for missing translations
 */
function findMissingTranslations(flattened, language) {
  const missing = [];
  const empty = [];
  const todos = [];
  
  for (let key in flattened) {
    const value = flattened[key];
    
    if (value === null || value === undefined) {
      missing.push(key);
    } else if (typeof value === 'string') {
      if (value.trim() === '') {
        empty.push(key);
      } else if (value.includes('TODO') || value.includes('MISSING') || value.includes('TRANSLATE')) {
        todos.push({ key, value });
      }
    }
  }
  
  return { missing, empty, todos };
}

/**
 * Validate special characters for RTL languages
 */
function validateSpecialCharacters(flattened, language) {
  const issues = [];
  
  if (language === 'ar') {
    // Check for proper Arabic text and RTL markers
    for (let key in flattened) {
      const value = flattened[key];
      if (typeof value === 'string' && value.trim()) {
        // Check if Arabic text contains proper Arabic characters
        const hasArabic = /[\u0600-\u06FF]/.test(value);
        const hasEnglishWords = /[a-zA-Z]{3,}/.test(value);
        
        if (!hasArabic && hasEnglishWords && !key.includes('placeholder') && !key.includes('phone')) {
          issues.push({
            key,
            issue: 'Possibly untranslated English text in Arabic file',
            value: value.length > 50 ? value.substring(0, 50) + '...' : value
          });
        }
      }
    }
  }
  
  return issues;
}

/**
 * Main validation function
 */
function validateTranslations() {
  const results = {
    languages: {},
    summary: {
      totalLanguages: LANGUAGES.length,
      successful: 0,
      failed: 0,
      totalKeys: 0,
      consistency: true,
      overallCompletion: 0
    },
    issues: []
  };
  
  let baselineKeys = null;
  let baselineCount = 0;
  
  // Load and analyze each language file
  for (const lang of LANGUAGES) {
    console.log(`📋 Validating ${lang.toUpperCase()}...`);
    
    const loaded = loadTranslationFile(lang);
    
    if (!loaded.success) {
      console.log(`   ❌ Failed to load: ${loaded.error}`);
      results.languages[lang] = {
        success: false,
        error: loaded.error,
        keyCount: 0
      };
      results.summary.failed++;
      continue;
    }
    
    const flattened = flattenObject(loaded.data);
    const keyCount = Object.keys(flattened).length;
    const missingData = findMissingTranslations(flattened, lang);
    const specialCharIssues = validateSpecialCharacters(flattened, lang);
    
    // Set baseline from first successful language (English)
    if (!baselineKeys) {
      baselineKeys = Object.keys(flattened);
      baselineCount = keyCount;
    }
    
    // Check key consistency
    const currentKeys = Object.keys(flattened);
    const missingKeys = baselineKeys.filter(key => !currentKeys.includes(key));
    const extraKeys = currentKeys.filter(key => !baselineKeys.includes(key));
    
    const hasIssues = missingData.missing.length > 0 || 
                     missingData.empty.length > 0 || 
                     missingData.todos.length > 0 ||
                     missingKeys.length > 0 ||
                     extraKeys.length > 0 ||
                     specialCharIssues.length > 0;
    
    results.languages[lang] = {
      success: true,
      keyCount,
      missing: missingData.missing,
      empty: missingData.empty,
      todos: missingData.todos,
      missingKeys,
      extraKeys,
      specialCharIssues,
      completionRate: ((keyCount - missingData.missing.length - missingData.empty.length - missingData.todos.length) / keyCount * 100).toFixed(2),
      hasIssues
    };
    
    if (!hasIssues) {
      console.log(`   ✅ ${keyCount} keys - Complete`);
      results.summary.successful++;
    } else {
      console.log(`   ⚠️  ${keyCount} keys - Has issues`);
      results.summary.successful++;
    }
    
    // Track consistency
    if (keyCount !== baselineCount) {
      results.summary.consistency = false;
    }
  }
  
  // Calculate overall statistics
  results.summary.totalKeys = baselineCount;
  
  let totalCompletionRate = 0;
  let validLanguages = 0;
  
  for (const lang in results.languages) {
    if (results.languages[lang].success) {
      totalCompletionRate += parseFloat(results.languages[lang].completionRate);
      validLanguages++;
    }
  }
  
  results.summary.overallCompletion = validLanguages > 0 ? 
    (totalCompletionRate / validLanguages).toFixed(2) : 0;
  
  return results;
}

/**
 * Generate final report
 */
function generateReport(results) {
  console.log('\n' + '='.repeat(80));
  console.log('📊 FINAL TRANSLATION VALIDATION REPORT');
  console.log('='.repeat(80));
  
  // Summary
  console.log('\n📈 SUMMARY:');
  console.log(`   Total Languages: ${results.summary.totalLanguages}`);
  console.log(`   Successfully Loaded: ${results.summary.successful}`);
  console.log(`   Failed to Load: ${results.summary.failed}`);
  console.log(`   Total Translation Keys: ${results.summary.totalKeys}`);
  console.log(`   Key Consistency: ${results.summary.consistency ? '✅ CONSISTENT' : '❌ INCONSISTENT'}`);
  console.log(`   Overall Completion: ${results.summary.overallCompletion}%`);
  
  // Individual language details
  console.log('\n📋 LANGUAGE DETAILS:');
  
  for (const lang of LANGUAGES) {
    const data = results.languages[lang];
    
    if (!data.success) {
      console.log(`\n   ${lang.toUpperCase()}: ❌ FAILED`);
      console.log(`      Error: ${data.error}`);
      continue;
    }
    
    const statusIcon = data.hasIssues ? '⚠️' : '✅';
    console.log(`\n   ${lang.toUpperCase()}: ${statusIcon} ${data.completionRate}%`);
    console.log(`      Keys: ${data.keyCount}`);
    
    if (data.missing.length > 0) {
      console.log(`      Missing Values: ${data.missing.length}`);
      console.log(`         ${data.missing.slice(0, 3).join(', ')}${data.missing.length > 3 ? '...' : ''}`);
    }
    
    if (data.empty.length > 0) {
      console.log(`      Empty Values: ${data.empty.length}`);
      console.log(`         ${data.empty.slice(0, 3).join(', ')}${data.empty.length > 3 ? '...' : ''}`);
    }
    
    if (data.todos.length > 0) {
      console.log(`      TODO/Placeholders: ${data.todos.length}`);
      data.todos.slice(0, 3).forEach(todo => {
        console.log(`         ${todo.key}: "${todo.value}"`);
      });
    }
    
    if (data.missingKeys.length > 0) {
      console.log(`      Missing Keys: ${data.missingKeys.length}`);
      console.log(`         ${data.missingKeys.slice(0, 3).join(', ')}${data.missingKeys.length > 3 ? '...' : ''}`);
    }
    
    if (data.extraKeys.length > 0) {
      console.log(`      Extra Keys: ${data.extraKeys.length}`);
      console.log(`         ${data.extraKeys.slice(0, 3).join(', ')}${data.extraKeys.length > 3 ? '...' : ''}`);
    }
    
    if (data.specialCharIssues.length > 0) {
      console.log(`      Special Character Issues: ${data.specialCharIssues.length}`);
      data.specialCharIssues.slice(0, 2).forEach(issue => {
        console.log(`         ${issue.key}: ${issue.issue}`);
      });
    }
  }
  
  // Critical assessment
  console.log('\n🎯 CRITICAL ASSESSMENT:');
  
  const allComplete = Object.values(results.languages)
    .filter(lang => lang.success)
    .every(lang => !lang.hasIssues);
  
  const allConsistent = results.summary.consistency;
  const highCompletion = parseFloat(results.summary.overallCompletion) >= 98.0;
  
  if (allComplete && allConsistent && highCompletion) {
    console.log('   ✅ READY FOR PRODUCTION DEPLOYMENT');
    console.log('   ✅ 100% Translation Coverage Achieved');
    console.log('   ✅ All languages have consistent key structure');
    console.log('   ✅ No missing translations or placeholders');
    console.log('   ✅ JSON syntax is valid across all files');
  } else {
    console.log('   ❌ NOT READY FOR PRODUCTION');
    
    if (!allComplete) {
      console.log('   ❌ Some languages have missing or incomplete translations');
    }
    
    if (!allConsistent) {
      console.log('   ❌ Language files have inconsistent key structures');
    }
    
    if (!highCompletion) {
      console.log('   ❌ Overall completion rate below 98%');
    }
  }
  
  // Cross-reference critical keys
  console.log('\n🔍 CRITICAL KEY VALIDATION:');
  
  const criticalKeys = [
    'navigation.tours',
    'navigation.bookNow',
    'homepage.hero.title',
    'booking.book_your_tour',
    'booking.confirm',
    'customTour.booking.confirm',
    'tours.hero.cta',
    'footer.tagline'
  ];
  
  let criticalIssues = 0;
  
  for (const key of criticalKeys) {
    const keyStatus = [];
    
    for (const lang of LANGUAGES) {
      const data = results.languages[lang];
      if (data.success) {
        const flattened = flattenObject(loadTranslationFile(lang).data);
        const hasKey = key in flattened;
        const hasValue = hasKey && flattened[key] && flattened[key].trim() !== '';
        
        keyStatus.push({
          lang,
          hasKey,
          hasValue,
          value: hasKey ? flattened[key] : null
        });
      }
    }
    
    const allHaveKey = keyStatus.every(status => status.hasKey);
    const allHaveValue = keyStatus.every(status => status.hasValue);
    
    if (allHaveKey && allHaveValue) {
      console.log(`   ✅ ${key}`);
    } else {
      console.log(`   ❌ ${key}`);
      criticalIssues++;
      
      keyStatus.forEach(status => {
        if (!status.hasKey) {
          console.log(`      ${status.lang}: Missing key`);
        } else if (!status.hasValue) {
          console.log(`      ${status.lang}: Empty value`);
        }
      });
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('🚀 DEPLOYMENT STATUS:');
  
  if (criticalIssues === 0 && allComplete && allConsistent) {
    console.log('✅ APPROVED FOR INTERNATIONAL DEPLOYMENT');
    console.log('✅ All 5 languages (EN, DE, FR, ES, AR) are complete');
    console.log('✅ Translation coverage: 100%');
    console.log('✅ Ready for production release');
  } else {
    console.log('❌ DEPLOYMENT BLOCKED');
    console.log(`❌ Critical issues found: ${criticalIssues}`);
    console.log('❌ Must resolve all issues before deployment');
  }
  
  console.log('='.repeat(80));
  
  return {
    readyForProduction: criticalIssues === 0 && allComplete && allConsistent,
    criticalIssues,
    overallCompletion: results.summary.overallCompletion,
    summary: results.summary
  };
}

// Run validation
try {
  const results = validateTranslations();
  const report = generateReport(results);
  
  // Write detailed report to file
  const detailedReport = {
    timestamp: new Date().toISOString(),
    ...results,
    finalStatus: report
  };
  
  fs.writeFileSync('./docs/final-translation-validation-report.json', 
    JSON.stringify(detailedReport, null, 2));
  
  console.log('\n📄 Detailed report saved to: ./docs/final-translation-validation-report.json');
  
  process.exit(report.readyForProduction ? 0 : 1);
  
} catch (error) {
  console.error('💥 Validation failed:', error.message);
  process.exit(1);
}