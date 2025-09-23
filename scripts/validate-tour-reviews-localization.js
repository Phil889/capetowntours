#!/usr/bin/env node

/**
 * Tour Reviews Localization Validation Script
 * Tests all tours across all languages to ensure proper review localization
 */

const tourSlugs = [
  'boulders-beach-penguin-colony',
  'sea-point-promenade', 
  'bo-kaap-heritage-quarter',
  'cape-town-skydive',
  'aquila-safari-tour',
  'hout-bay-harbour',
  'simon-s-town',
  'maiden-s-cove',
  'muizenberg-beach',
  'hermanus-whale-watching-tour',
  'v-a-waterfront',
  'tokara-wine-estate',
  'chapman-s-peak-drive',
  'cape-point-lighthouse',
  'shark-cage-diving-gansbaai',
  'cape-town-paragliding',
  'delaire-graff-estate',
  'inverdoorn-safari-tour',
  'atlantis-sand-dunes-adventure',
  'cape-of-good-hope',
  'babylonstoren-wine-estate'
];

const locales = ['en', 'de', 'fr', 'es', 'ar'];
const baseUrl = process.argv[2] || 'http://localhost:3001';

console.log(`🔍 Validating tour reviews localization across ${tourSlugs.length} tours and ${locales.length} locales`);
console.log(`📍 Base URL: ${baseUrl}`);
console.log('=' .repeat(80));

async function validateTourReviews(slug, locale) {
  try {
    const url = `${baseUrl}/${locale}/tours/${slug}`;
    console.log(`🌐 Testing: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      return {
        slug,
        locale,
        status: 'ERROR',
        message: `HTTP ${response.status} - ${response.statusText}`,
        url
      };
    }
    
    const html = await response.text();
    
    // Check if reviews section exists
    if (!html.includes('Guest Reviews') && 
        !html.includes('Gästebewertungen') && 
        !html.includes('Avis des clients') && 
        !html.includes('Reseñas de huéspedes') &&
        !html.includes('تقييمات الضيوف')) {
      return {
        slug,
        locale,
        status: 'MISSING',
        message: 'Reviews section not found',
        url
      };
    }
    
    // Check for localized content based on locale
    let localizedContentFound = false;
    let localizedIndicators = [];
    
    switch (locale) {
      case 'de':
        if (html.includes('Gästebewertungen')) localizedIndicators.push('Section title');
        if (html.includes('vor ') && html.includes('Woche')) localizedIndicators.push('Date format');
        if (html.includes('Hervorragend') || html.includes('Sehr gut')) localizedIndicators.push('Rating text');
        if (html.includes('Bewertungen')) localizedIndicators.push('Review count');
        break;
      case 'fr':
        if (html.includes('Avis des clients')) localizedIndicators.push('Section title');
        if (html.includes('il y a') && html.includes('semaine')) localizedIndicators.push('Date format');
        if (html.includes('Excellent') || html.includes('Très bien')) localizedIndicators.push('Rating text');
        if (html.includes('avis')) localizedIndicators.push('Review count');
        break;
      case 'es':
        if (html.includes('Reseñas de huéspedes')) localizedIndicators.push('Section title');
        if (html.includes('hace ') && html.includes('semana')) localizedIndicators.push('Date format');
        if (html.includes('Excelente') || html.includes('Muy bueno')) localizedIndicators.push('Rating text');
        if (html.includes('reseñas')) localizedIndicators.push('Review count');
        break;
      case 'ar':
        if (html.includes('تقييمات الضيوف')) localizedIndicators.push('Section title');
        if (html.includes('ممتاز') || html.includes('جيد جداً')) localizedIndicators.push('Rating text');
        if (html.includes('تقييم')) localizedIndicators.push('Review count');
        break;
      case 'en':
      default:
        if (html.includes('Guest Reviews')) localizedIndicators.push('Section title');
        if (html.includes('week ago') || html.includes('weeks ago')) localizedIndicators.push('Date format');
        if (html.includes('Excellent') || html.includes('Very Good')) localizedIndicators.push('Rating text');
        if (html.includes('reviews')) localizedIndicators.push('Review count');
        break;
    }
    
    localizedContentFound = localizedIndicators.length >= 2;
    
    return {
      slug,
      locale,
      status: localizedContentFound ? 'SUCCESS' : 'PARTIAL',
      message: localizedContentFound 
        ? `✅ Found: ${localizedIndicators.join(', ')}`
        : `⚠️ Limited localization: ${localizedIndicators.join(', ') || 'None found'}`,
      url,
      indicators: localizedIndicators
    };
    
  } catch (error) {
    return {
      slug,
      locale,
      status: 'ERROR',
      message: error.message,
      url: `${baseUrl}/${locale}/tours/${slug}`
    };
  }
}

async function runValidation() {
  const results = [];
  const summary = {
    total: 0,
    success: 0,
    partial: 0,
    missing: 0,
    error: 0
  };
  
  for (const locale of locales) {
    console.log(`\n🌍 Testing locale: ${locale.toUpperCase()}`);
    console.log('-'.repeat(40));
    
    for (const slug of tourSlugs) {
      const result = await validateTourReviews(slug, locale);
      results.push(result);
      summary.total++;
      
      switch (result.status) {
        case 'SUCCESS': 
          summary.success++; 
          console.log(`✅ ${slug}: ${result.message}`);
          break;
        case 'PARTIAL': 
          summary.partial++; 
          console.log(`⚠️  ${slug}: ${result.message}`);
          break;
        case 'MISSING': 
          summary.missing++; 
          console.log(`❌ ${slug}: ${result.message}`);
          break;
        case 'ERROR': 
          summary.error++; 
          console.log(`🚨 ${slug}: ${result.message}`);
          break;
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  // Generate summary report
  console.log('\n' + '='.repeat(80));
  console.log('📊 VALIDATION SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total tests run: ${summary.total}`);
  console.log(`✅ Fully localized: ${summary.success} (${(summary.success/summary.total*100).toFixed(1)}%)`);
  console.log(`⚠️  Partially localized: ${summary.partial} (${(summary.partial/summary.total*100).toFixed(1)}%)`);
  console.log(`❌ Missing reviews: ${summary.missing} (${(summary.missing/summary.total*100).toFixed(1)}%)`);
  console.log(`🚨 Errors: ${summary.error} (${(summary.error/summary.total*100).toFixed(1)}%)`);
  
  // Detailed breakdown by locale
  console.log('\n📈 BREAKDOWN BY LOCALE:');
  console.log('-'.repeat(50));
  
  locales.forEach(locale => {
    const localeResults = results.filter(r => r.locale === locale);
    const localeSuccess = localeResults.filter(r => r.status === 'SUCCESS').length;
    const localePartial = localeResults.filter(r => r.status === 'PARTIAL').length;
    const localeMissing = localeResults.filter(r => r.status === 'MISSING').length;
    const localeError = localeResults.filter(r => r.status === 'ERROR').length;
    
    console.log(`${locale.toUpperCase()}: ${localeSuccess}✅ ${localePartial}⚠️ ${localeMissing}❌ ${localeError}🚨`);
  });
  
  // List problematic tours
  const problematicResults = results.filter(r => r.status === 'MISSING' || r.status === 'ERROR');
  if (problematicResults.length > 0) {
    console.log('\n🚨 ISSUES FOUND:');
    console.log('-'.repeat(50));
    problematicResults.forEach(result => {
      console.log(`${result.status} - ${result.locale}/${result.slug}: ${result.message}`);
    });
  }
  
  // Success rate by tour
  const tourSummary = {};
  tourSlugs.forEach(slug => {
    const tourResults = results.filter(r => r.slug === slug);
    const successCount = tourResults.filter(r => r.status === 'SUCCESS').length;
    tourSummary[slug] = {
      total: tourResults.length,
      success: successCount,
      rate: successCount / tourResults.length
    };
  });
  
  const lowPerformingTours = Object.entries(tourSummary)
    .filter(([_, stats]) => stats.rate < 0.8)
    .sort(([_, a], [__, b]) => a.rate - b.rate);
  
  if (lowPerformingTours.length > 0) {
    console.log('\n📉 TOURS NEEDING ATTENTION (< 80% success rate):');
    console.log('-'.repeat(60));
    lowPerformingTours.forEach(([slug, stats]) => {
      console.log(`${slug}: ${stats.success}/${stats.total} (${(stats.rate * 100).toFixed(1)}%)`);
    });
  }
  
  console.log('\n✨ Validation completed!');
  
  return {
    summary,
    results,
    tourSummary,
    overallSuccess: (summary.success + summary.partial) / summary.total >= 0.9
  };
}

// Run the validation
if (require.main === module) {
  runValidation()
    .then(report => {
      process.exit(report.overallSuccess ? 0 : 1);
    })
    .catch(error => {
      console.error('🚨 Validation failed:', error);
      process.exit(1);
    });
}

module.exports = { validateTourReviews, runValidation };