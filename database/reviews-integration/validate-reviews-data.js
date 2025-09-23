#!/usr/bin/env node

/**
 * Tour Reviews Data Validation System
 * 
 * Comprehensive validation script that checks data integrity,
 * validates review content, and ensures database consistency.
 * 
 * Features:
 * - Schema validation
 * - Content quality checks
 * - Duplicate detection
 * - Language validation
 * - Database integrity verification
 * - SEO content analysis
 * - Performance metrics
 */

const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Import batch insert utilities
const { TOUR_SLUGS, CONFIG } = require('./batch-insert-reviews.js');

// Validation configuration
const VALIDATION_CONFIG = {
  MIN_REVIEW_LENGTH: 100,
  MAX_REVIEW_LENGTH: 2000,
  MIN_TITLE_LENGTH: 10,
  MAX_TITLE_LENGTH: 120,
  REQUIRED_RATING_RANGE: [1, 5],
  SUPPORTED_LANGUAGES: ['en', 'es', 'fr', 'de', 'pt'],
  EXPECTED_EXPERIENCE_TYPES: [
    'Family Adventure',
    'Romantic Getaway',
    'Solo Travel',
    'Photography',
    'Wildlife Safari',
    'Cultural Experience',
    'Adventure Sports',
    'Luxury Experience',
    'Educational Tour',
    'Group Activity'
  ],
  SEO_KEYWORDS: {
    en: ['safari', 'cape town', 'tour', 'wildlife', 'experience', 'adventure'],
    es: ['safari', 'ciudad del cabo', 'tour', 'fauna', 'experiencia', 'aventura'],
    fr: ['safari', 'le cap', 'tour', 'faune', 'expérience', 'aventure'],
    de: ['safari', 'kapstadt', 'tour', 'tierwelt', 'erfahrung', 'abenteuer'],
    pt: ['safari', 'cidade do cabo', 'tour', 'vida selvagem', 'experiência', 'aventura']
  }
};

// Initialize Supabase client
function initializeSupabase() {
  if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_SERVICE_KEY) {
    throw new Error('Missing Supabase credentials');
  }
  
  return createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

// Logging utilities
async function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${level}: ${message}`;
  console.log(logEntry);
  
  try {
    await fs.appendFile('validation-log.txt', logEntry + '\n');
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

async function logValidationError(message, context = {}) {
  const errorEntry = {
    timestamp: new Date().toISOString(),
    message,
    context,
    level: 'VALIDATION_ERROR'
  };
  
  console.error('VALIDATION ERROR:', message, context);
  
  try {
    await fs.appendFile('validation-errors.json', JSON.stringify(errorEntry) + '\n');
  } catch (error) {
    console.error('Failed to write to error file:', error);
  }
}

// Core validation functions
function validateReviewSchema(review) {
  const errors = [];
  const warnings = [];
  
  // Required fields
  const requiredFields = ['author', 'author_location', 'rating', 'review_date', 'title', 'content', 'verified', 'experience_type'];
  
  for (const field of requiredFields) {
    if (!(field in review)) {
      errors.push(`Missing required field: ${field}`);
    } else if (review[field] === null || review[field] === undefined) {
      errors.push(`Field ${field} is null or undefined`);
    }
  }
  
  // Type validation
  if (review.rating !== undefined && (typeof review.rating !== 'number' || !Number.isInteger(review.rating))) {
    errors.push('Rating must be an integer');
  }
  
  if (review.verified !== undefined && typeof review.verified !== 'boolean') {
    errors.push('Verified must be a boolean');
  }
  
  if (review.helpful_count !== undefined && (typeof review.helpful_count !== 'number' || !Number.isInteger(review.helpful_count))) {
    warnings.push('helpful_count should be an integer (will default to 0)');
  }
  
  return { errors, warnings };
}

function validateReviewContent(review, language = 'en') {
  const errors = [];
  const warnings = [];
  
  // Rating validation
  if (review.rating < VALIDATION_CONFIG.REQUIRED_RATING_RANGE[0] || 
      review.rating > VALIDATION_CONFIG.REQUIRED_RATING_RANGE[1]) {
    errors.push(`Rating ${review.rating} is outside valid range ${VALIDATION_CONFIG.REQUIRED_RATING_RANGE}`);
  }
  
  // Title validation
  if (review.title) {
    if (review.title.length < VALIDATION_CONFIG.MIN_TITLE_LENGTH) {
      errors.push(`Title too short (${review.title.length} chars, min ${VALIDATION_CONFIG.MIN_TITLE_LENGTH})`);
    }
    if (review.title.length > VALIDATION_CONFIG.MAX_TITLE_LENGTH) {
      errors.push(`Title too long (${review.title.length} chars, max ${VALIDATION_CONFIG.MAX_TITLE_LENGTH})`);
    }
    
    // Check for placeholder text
    if (review.title.toLowerCase().includes('lorem ipsum') || 
        review.title.toLowerCase().includes('placeholder')) {
      errors.push('Title contains placeholder text');
    }
  }
  
  // Content validation
  if (review.content) {
    if (review.content.length < VALIDATION_CONFIG.MIN_REVIEW_LENGTH) {
      errors.push(`Content too short (${review.content.length} chars, min ${VALIDATION_CONFIG.MIN_REVIEW_LENGTH})`);
    }
    if (review.content.length > VALIDATION_CONFIG.MAX_REVIEW_LENGTH) {
      warnings.push(`Content very long (${review.content.length} chars, max recommended ${VALIDATION_CONFIG.MAX_REVIEW_LENGTH})`);
    }
    
    // Check for placeholder text
    if (review.content.toLowerCase().includes('lorem ipsum') || 
        review.content.toLowerCase().includes('placeholder')) {
      errors.push('Content contains placeholder text');
    }
    
    // SEO keyword check
    const keywords = VALIDATION_CONFIG.SEO_KEYWORDS[language] || VALIDATION_CONFIG.SEO_KEYWORDS.en;
    const contentLower = review.content.toLowerCase();
    const foundKeywords = keywords.filter(keyword => contentLower.includes(keyword.toLowerCase()));
    
    if (foundKeywords.length < 2) {
      warnings.push(`Low SEO keyword density (found: ${foundKeywords.join(', ')})`);
    }
  }
  
  // Author validation
  if (review.author) {
    if (review.author.length < 2) {
      errors.push('Author name too short');
    }
    if (review.author.length > 100) {
      errors.push('Author name too long');
    }
    
    // Check for test data
    if (review.author.toLowerCase().includes('test') || 
        review.author.toLowerCase().includes('sample')) {
      warnings.push('Author name appears to be test data');
    }
  }
  
  // Location validation
  if (review.author_location) {
    if (review.author_location.length < 2) {
      errors.push('Author location too short');
    }
    if (review.author_location.length > 100) {
      errors.push('Author location too long');
    }
  }
  
  // Experience type validation
  if (review.experience_type && 
      !VALIDATION_CONFIG.EXPECTED_EXPERIENCE_TYPES.includes(review.experience_type)) {
    warnings.push(`Unexpected experience type: ${review.experience_type}`);
  }
  
  // Date validation
  if (review.review_date) {
    // Check if it's a valid date format
    const dateFormats = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d+ days? ago$/, // X days ago
      /^\d+ weeks? ago$/, // X weeks ago
      /^\d+ months? ago$/, // X months ago
      /^(Today|Yesterday|Recently)$/ // Relative dates
    ];
    
    if (!dateFormats.some(format => format.test(review.review_date))) {
      warnings.push(`Unusual date format: ${review.review_date}`);
    }
  }
  
  return { errors, warnings };
}

function validateLanguageConsistency(reviews, expectedLanguage) {
  const errors = [];
  const warnings = [];
  
  // Check for mixed language content (basic check)
  const languagePatterns = {
    en: /\b(the|and|is|was|were|have|has|with|for|this|that)\b/gi,
    es: /\b(el|la|los|las|y|es|fue|fueron|tiene|con|para|este|esta)\b/gi,
    fr: /\b(le|la|les|et|est|était|étaient|avoir|avec|pour|ce|cette)\b/gi,
    de: /\b(der|die|das|und|ist|war|waren|haben|mit|für|dies|diese)\b/gi,
    pt: /\b(o|a|os|as|e|é|foi|foram|tem|com|para|este|esta)\b/gi
  };
  
  const expectedPattern = languagePatterns[expectedLanguage];
  if (!expectedPattern) return { errors, warnings };
  
  for (const review of reviews) {
    if (review.content && review.title) {
      const combinedText = `${review.title} ${review.content}`;
      const matches = combinedText.match(expectedPattern);
      const matchRatio = matches ? matches.length / combinedText.split(' ').length : 0;
      
      if (matchRatio < 0.05) { // Less than 5% expected language patterns
        warnings.push({
          author: review.author,
          message: `Content may not be in expected language (${expectedLanguage})`,
          matchRatio: Math.round(matchRatio * 100)
        });
      }
    }
  }
  
  return { errors, warnings };
}

function detectDuplicates(reviews) {
  const duplicates = [];
  const seen = new Set();
  
  for (let i = 0; i < reviews.length; i++) {
    const review = reviews[i];
    const key = `${review.tour_slug}-${review.language}-${review.author}-${review.title}`;
    
    if (seen.has(key)) {
      duplicates.push({
        index: i,
        key,
        review: {
          author: review.author,
          title: review.title,
          tour_slug: review.tour_slug,
          language: review.language
        }
      });
    } else {
      seen.add(key);
    }
  }
  
  // Also check for near-duplicates (same author, similar content)
  const nearDuplicates = [];
  for (let i = 0; i < reviews.length; i++) {
    for (let j = i + 1; j < reviews.length; j++) {
      const review1 = reviews[i];
      const review2 = reviews[j];
      
      if (review1.tour_slug === review2.tour_slug &&
          review1.language === review2.language &&
          review1.author === review2.author) {
        
        // Check content similarity (simple Levenshtein-like check)
        const similarity = calculateSimilarity(review1.content || '', review2.content || '');
        if (similarity > 0.8) {
          nearDuplicates.push({
            indices: [i, j],
            similarity: Math.round(similarity * 100),
            author: review1.author,
            tour_slug: review1.tour_slug
          });
        }
      }
    }
  }
  
  return { duplicates, nearDuplicates };
}

function calculateSimilarity(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  
  if (len1 === 0) return len2 === 0 ? 1 : 0;
  if (len2 === 0) return 0;
  
  const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(null));
  
  for (let i = 0; i <= len1; i++) matrix[0][i] = i;
  for (let j = 0; j <= len2; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= len2; j++) {
    for (let i = 1; i <= len1; i++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j - 1][i] + 1,
        matrix[j][i - 1] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }
  
  const maxLen = Math.max(len1, len2);
  return (maxLen - matrix[len2][len1]) / maxLen;
}

// Database validation functions
async function validateDatabaseIntegrity(supabase) {
  const issues = [];
  const stats = {};
  
  try {
    // Check table structure
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'tour_reviews' });
    
    if (columnsError) {
      issues.push(`Could not fetch table structure: ${columnsError.message}`);
    }
    
    // Check existing data
    const { data: reviews, error: reviewsError } = await supabase
      .from('tour_reviews')
      .select('*');
    
    if (reviewsError) {
      issues.push(`Could not fetch reviews: ${reviewsError.message}`);
    } else if (reviews) {
      stats.totalReviews = reviews.length;
      stats.byLanguage = reviews.reduce((acc, review) => {
        acc[review.language] = (acc[review.language] || 0) + 1;
        return acc;
      }, {});
      
      stats.byTour = reviews.reduce((acc, review) => {
        acc[review.tour_slug] = (acc[review.tour_slug] || 0) + 1;
        return acc;
      }, {});
      
      stats.averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      
      // Check for data quality issues
      const dataIssues = reviews.filter(review => {
        return !review.tour_slug || 
               !review.language || 
               !review.author || 
               !review.content || 
               review.rating < 1 || 
               review.rating > 5;
      });
      
      if (dataIssues.length > 0) {
        issues.push(`Found ${dataIssues.length} reviews with data quality issues`);
      }
    }
    
    // Check for missing tours
    const toursInDb = Object.keys(stats.byTour || {});
    const missingTours = TOUR_SLUGS.filter(slug => !toursInDb.includes(slug));
    
    if (missingTours.length > 0) {
      issues.push(`Missing reviews for tours: ${missingTours.join(', ')}`);
    }
    
  } catch (error) {
    issues.push(`Database validation error: ${error.message}`);
  }
  
  return { issues, stats };
}

// File processing functions
async function loadReviewsForValidation() {
  const { loadAndValidateReviewData } = require('./batch-insert-reviews.js');
  return await loadAndValidateReviewData();
}

async function validateAllReviews() {
  const results = {
    files: {},
    overall: {
      totalReviews: 0,
      totalErrors: 0,
      totalWarnings: 0,
      duplicates: [],
      languageIssues: {}
    }
  };
  
  await log('Starting comprehensive review validation');
  
  // Load all reviews
  const { reviews, errors: loadErrors } = await loadReviewsForValidation();
  
  if (loadErrors.length > 0) {
    await log(`Found ${loadErrors.length} loading errors`);
    results.overall.loadErrors = loadErrors;
  }
  
  results.overall.totalReviews = reviews.length;
  
  // Group reviews by tour and language
  const reviewsByTourLang = reviews.reduce((acc, review) => {
    const key = `${review.tour_slug}-${review.language}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(review);
    return acc;
  }, {});
  
  // Validate each group
  for (const [key, reviewGroup] of Object.entries(reviewsByTourLang)) {
    const [tourSlug, language] = key.split('-');
    const groupResults = {
      tourSlug,
      language,
      reviewCount: reviewGroup.length,
      errors: [],
      warnings: [],
      schemaErrors: 0,
      contentErrors: 0,
      languageWarnings: 0
    };
    
    // Validate each review in the group
    for (let i = 0; i < reviewGroup.length; i++) {
      const review = reviewGroup[i];
      
      // Schema validation
      const schemaResult = validateReviewSchema(review);
      groupResults.errors.push(...schemaResult.errors.map(e => `Review ${i + 1}: ${e}`));
      groupResults.warnings.push(...schemaResult.warnings.map(w => `Review ${i + 1}: ${w}`));
      groupResults.schemaErrors += schemaResult.errors.length;
      
      // Content validation
      const contentResult = validateReviewContent(review, language);
      groupResults.errors.push(...contentResult.errors.map(e => `Review ${i + 1}: ${e}`));
      groupResults.warnings.push(...contentResult.warnings.map(w => `Review ${i + 1}: ${w}`));
      groupResults.contentErrors += contentResult.errors.length;
    }
    
    // Language consistency validation
    const langResult = validateLanguageConsistency(reviewGroup, language);
    groupResults.warnings.push(...langResult.warnings.map(w => `Language: ${JSON.stringify(w)}`));
    groupResults.languageWarnings += langResult.warnings.length;
    
    results.files[key] = groupResults;
    results.overall.totalErrors += groupResults.errors.length;
    results.overall.totalWarnings += groupResults.warnings.length;
  }
  
  // Global duplicate detection
  const duplicateResult = detectDuplicates(reviews);
  results.overall.duplicates = duplicateResult.duplicates;
  results.overall.nearDuplicates = duplicateResult.nearDuplicates;
  
  return results;
}

// Reporting functions
async function generateValidationReport(results, dbValidation) {
  const report = [
    '='.repeat(80),
    'TOUR REVIEWS DATA VALIDATION REPORT',
    '='.repeat(80),
    `Generated: ${new Date().toISOString()}`,
    '',
    'OVERVIEW:',
    `- Total reviews validated: ${results.overall.totalReviews}`,
    `- Total errors found: ${results.overall.totalErrors}`,
    `- Total warnings: ${results.overall.totalWarnings}`,
    `- Duplicate reviews: ${results.overall.duplicates.length}`,
    `- Near-duplicate reviews: ${results.overall.nearDuplicates.length}`,
    '',
    'DATABASE STATUS:',
    `- Reviews in database: ${dbValidation.stats.totalReviews || 0}`,
    `- Database issues: ${dbValidation.issues.length}`,
    `- Average rating: ${dbValidation.stats.averageRating ? dbValidation.stats.averageRating.toFixed(2) : 'N/A'}`,
    '',
    'VALIDATION BY TOUR/LANGUAGE:',
    ...Object.entries(results.files).map(([key, data]) => 
      `- ${key}: ${data.reviewCount} reviews, ${data.errors.length} errors, ${data.warnings.length} warnings`
    ),
    ''
  ];
  
  if (results.overall.duplicates.length > 0) {
    report.push('DUPLICATE REVIEWS:');
    results.overall.duplicates.forEach((dup, i) => {
      report.push(`${i + 1}. ${dup.review.author} - ${dup.review.title} (${dup.review.tour_slug})`);
    });
    report.push('');
  }
  
  if (dbValidation.issues.length > 0) {
    report.push('DATABASE ISSUES:');
    dbValidation.issues.forEach((issue, i) => {
      report.push(`${i + 1}. ${issue}`);
    });
    report.push('');
  }
  
  // Detailed errors for first 10 files
  const fileEntries = Object.entries(results.files).slice(0, 10);
  if (fileEntries.length > 0) {
    report.push('DETAILED ISSUES (First 10 groups):');
    fileEntries.forEach(([key, data]) => {
      if (data.errors.length > 0 || data.warnings.length > 0) {
        report.push(`\n${key.toUpperCase()}:`);
        data.errors.slice(0, 5).forEach(error => report.push(`  ERROR: ${error}`));
        data.warnings.slice(0, 3).forEach(warning => report.push(`  WARNING: ${warning}`));
      }
    });
  }
  
  report.push('='.repeat(80));
  
  const reportText = report.join('\n');
  console.log(reportText);
  
  await fs.writeFile('validation-report.txt', reportText);
  await fs.writeFile('validation-results.json', JSON.stringify(results, null, 2));
  
  return reportText;
}

// Main execution
async function main() {
  try {
    await log('Starting Tour Reviews Validation System');
    
    // Validate file data
    const results = await validateAllReviews();
    
    // Validate database
    const supabase = initializeSupabase();
    const dbValidation = await validateDatabaseIntegrity(supabase);
    
    // Generate report
    await generateValidationReport(results, dbValidation);
    
    const hasErrors = results.overall.totalErrors > 0 || dbValidation.issues.length > 0;
    
    if (hasErrors) {
      await log('Validation completed with errors');
      process.exit(1);
    } else {
      await log('Validation completed successfully');
      process.exit(0);
    }
    
  } catch (error) {
    await logValidationError('Critical validation error', { error: error.message, stack: error.stack });
    console.error('Critical validation error:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = {
  main,
  validateReviewSchema,
  validateReviewContent,
  validateLanguageConsistency,
  detectDuplicates,
  validateDatabaseIntegrity,
  VALIDATION_CONFIG
};