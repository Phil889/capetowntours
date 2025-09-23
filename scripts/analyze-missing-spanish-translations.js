#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Function to flatten nested object keys with dot notation
function flattenKeys(obj, prefix = '') {
  const keys = [];
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys.push(...flattenKeys(obj[key], newKey));
      } else {
        keys.push(newKey);
      }
    }
  }
  
  return keys;
}

// Function to get nested value by key path
function getNestedValue(obj, keyPath) {
  return keyPath.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
}

try {
  // Load all translation files
  const messagesDir = path.join(__dirname, '..', 'messages');
  
  const enFile = path.join(messagesDir, 'en.json');
  const esFile = path.join(messagesDir, 'es.json');
  const deFile = path.join(messagesDir, 'de.json');
  const frFile = path.join(messagesDir, 'fr.json');
  const arFile = path.join(messagesDir, 'ar.json');
  
  // Parse JSON files
  const en = JSON.parse(fs.readFileSync(enFile, 'utf8'));
  const es = JSON.parse(fs.readFileSync(esFile, 'utf8'));
  const de = JSON.parse(fs.readFileSync(deFile, 'utf8'));
  const fr = JSON.parse(fs.readFileSync(frFile, 'utf8'));
  const ar = JSON.parse(fs.readFileSync(arFile, 'utf8'));
  
  // Flatten all keys
  const enKeys = flattenKeys(en);
  const esKeys = flattenKeys(es);
  const deKeys = flattenKeys(de);
  const frKeys = flattenKeys(fr);
  const arKeys = flattenKeys(ar);
  
  // Create sets for comparison
  const enKeySet = new Set(enKeys);
  const esKeySet = new Set(esKeys);
  const deKeySet = new Set(deKeys);
  const frKeySet = new Set(frKeys);
  const arKeySet = new Set(arKeys);
  
  // Find missing keys in Spanish
  const missingInSpanish = enKeys.filter(key => !esKeySet.has(key));
  
  // Find keys that exist in other languages but not in Spanish
  const additionalMissingKeys = new Set();
  
  // Check against German
  deKeys.forEach(key => {
    if (enKeySet.has(key) && !esKeySet.has(key)) {
      additionalMissingKeys.add(key);
    }
  });
  
  // Check against French
  frKeys.forEach(key => {
    if (enKeySet.has(key) && !esKeySet.has(key)) {
      additionalMissingKeys.add(key);
    }
  });
  
  // Check against Arabic
  arKeys.forEach(key => {
    if (enKeySet.has(key) && !esKeySet.has(key)) {
      additionalMissingKeys.add(key);
    }
  });
  
  // Combine all missing keys
  const allMissingKeys = [...new Set([...missingInSpanish, ...additionalMissingKeys])].sort();
  
  // Generate the analysis report
  const report = {
    summary: {
      englishKeyCount: enKeys.length,
      spanishKeyCount: esKeys.length,
      germanKeyCount: deKeys.length,
      frenchKeyCount: frKeys.length,
      arabicKeyCount: arKeys.length,
      missingInSpanishCount: allMissingKeys.length,
      spanishCompletionPercentage: ((esKeys.length / enKeys.length) * 100).toFixed(2)
    },
    missingKeys: allMissingKeys.map(key => ({
      key: key,
      englishValue: getNestedValue(en, key),
      existsInGerman: deKeySet.has(key),
      existsInFrench: frKeySet.has(key),
      existsInArabic: arKeySet.has(key),
      germanValue: getNestedValue(de, key),
      frenchValue: getNestedValue(fr, key),
      arabicValue: getNestedValue(ar, key)
    })),
    keysOnlyInSpanish: esKeys.filter(key => !enKeySet.has(key)),
    inconsistencies: {
      germanExtra: deKeys.filter(key => !enKeySet.has(key)),
      frenchExtra: frKeys.filter(key => !enKeySet.has(key)),
      arabicExtra: arKeys.filter(key => !enKeySet.has(key))
    }
  };
  
  // Print summary
  console.log('='.repeat(80));
  console.log('SPANISH TRANSLATION ANALYSIS REPORT');
  console.log('='.repeat(80));
  console.log();
  
  console.log('📊 KEY COUNT SUMMARY:');
  console.log(`  English (base):     ${report.summary.englishKeyCount} keys`);
  console.log(`  Spanish:           ${report.summary.spanishKeyCount} keys`);
  console.log(`  German:            ${report.summary.germanKeyCount} keys`);
  console.log(`  French:            ${report.summary.frenchKeyCount} keys`);
  console.log(`  Arabic:            ${report.summary.arabicKeyCount} keys`);
  console.log();
  
  console.log('🎯 COMPLETION STATUS:');
  console.log(`  Spanish completion: ${report.summary.spanishCompletionPercentage}%`);
  console.log(`  Missing keys:       ${report.summary.missingInSpanishCount}`);
  console.log();
  
  if (allMissingKeys.length > 0) {
    console.log('❌ MISSING SPANISH TRANSLATIONS:');
    console.log('-'.repeat(80));
    
    report.missingKeys.forEach((item, index) => {
      console.log(`${index + 1}. Key: ${item.key}`);
      console.log(`   English: "${item.englishValue}"`);
      
      const otherLangs = [];
      if (item.existsInGerman) otherLangs.push('German');
      if (item.existsInFrench) otherLangs.push('French');
      if (item.existsInArabic) otherLangs.push('Arabic');
      
      if (otherLangs.length > 0) {
        console.log(`   Available in: ${otherLangs.join(', ')}`);
      }
      console.log();
    });
  }
  
  if (report.keysOnlyInSpanish.length > 0) {
    console.log('⚠️  KEYS ONLY IN SPANISH (not in English base):');
    console.log('-'.repeat(80));
    report.keysOnlyInSpanish.forEach(key => {
      console.log(`  - ${key}: "${getNestedValue(es, key)}"`);
    });
    console.log();
  }
  
  // Check for inconsistencies
  const totalInconsistencies = 
    report.inconsistencies.germanExtra.length +
    report.inconsistencies.frenchExtra.length +
    report.inconsistencies.arabicExtra.length;
  
  if (totalInconsistencies > 0) {
    console.log('🔍 INCONSISTENCIES (keys in other languages not in English):');
    console.log('-'.repeat(80));
    
    if (report.inconsistencies.germanExtra.length > 0) {
      console.log(`German extra keys (${report.inconsistencies.germanExtra.length}):`);
      report.inconsistencies.germanExtra.forEach(key => {
        console.log(`  - ${key}`);
      });
    }
    
    if (report.inconsistencies.frenchExtra.length > 0) {
      console.log(`French extra keys (${report.inconsistencies.frenchExtra.length}):`);
      report.inconsistencies.frenchExtra.forEach(key => {
        console.log(`  - ${key}`);
      });
    }
    
    if (report.inconsistencies.arabicExtra.length > 0) {
      console.log(`Arabic extra keys (${report.inconsistencies.arabicExtra.length}):`);
      report.inconsistencies.arabicExtra.forEach(key => {
        console.log(`  - ${key}`);
      });
    }
    console.log();
  }
  
  // Generate missing translations JSON for easy import
  const missingTranslations = {};
  allMissingKeys.forEach(key => {
    const value = getNestedValue(en, key);
    if (value !== null) {
      // Create nested object structure
      const keys = key.split('.');
      let current = missingTranslations;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
    }
  });
  
  // Save the missing translations to a file
  const outputFile = path.join(__dirname, '..', 'docs', 'missing-spanish-translations.json');
  fs.writeFileSync(outputFile, JSON.stringify(missingTranslations, null, 2), 'utf8');
  
  console.log('💾 OUTPUT FILES GENERATED:');
  console.log(`  - Missing translations: ${path.relative(process.cwd(), outputFile)}`);
  
  // Save full report
  const reportFile = path.join(__dirname, '..', 'docs', 'spanish-translation-analysis-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf8');
  console.log(`  - Full analysis report: ${path.relative(process.cwd(), reportFile)}`);
  
  console.log();
  console.log('✅ Analysis complete!');
  console.log(`   Spanish is ${report.summary.spanishCompletionPercentage}% complete`);
  console.log(`   ${allMissingKeys.length} translations needed for 100% coverage`);
  
} catch (error) {
  console.error('Error analyzing translations:', error);
  process.exit(1);
}