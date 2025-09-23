#!/usr/bin/env node

/**
 * Enhanced Review Insertion Script
 * 
 * Executes direct database insertion of all multi-language reviews
 * with proper error handling and comprehensive reporting.
 */

const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Configuration
const CONFIG = {
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://orogsbgpdvpzraujtekx.supabase.co',
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb2dzYmdwZHZwenJhdWp0ZWt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTU3NjcsImV4cCI6MjA3MDQ5MTc2N30.RHS6eIqS84ofiif6OujRrQ-NUxXdcObZsW40ES-gk0I',
  BATCH_SIZE: 50,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

// Language files mapping
const LANGUAGE_FILES = {
  'en': 'complete-english-reviews.json',
  'de': 'complete-german-reviews.json', 
  'fr': 'complete-french-reviews.json',
  'es': 'complete-spanish-reviews.json',
  'ar': 'complete-arabic-reviews.json'
};

const EXECUTION_ORDER = ['en', 'de', 'fr', 'es', 'ar'];

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
    await fs.appendFile('execution-log.txt', logEntry + '\n');
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

async function logError(message, error = null, context = {}) {
  const timestamp = new Date().toISOString();
  const errorEntry = {
    timestamp,
    message,
    error: error ? { message: error.message, stack: error.stack } : null,
    context
  };
  
  console.error(`ERROR: ${message}`, error);
  
  try {
    await fs.appendFile('execution-errors.json', JSON.stringify(errorEntry) + '\n');
  } catch (writeError) {
    console.error('Failed to write to error file:', writeError);
  }
}

// Data loading and transformation
async function loadReviewsFromFile(language) {
  try {
    const filePath = path.join(__dirname, LANGUAGE_FILES[language]);
    const content = await fs.readFile(filePath, 'utf8');
    const reviews = JSON.parse(content);
    
    await log(`Loaded ${reviews.length} reviews for language: ${language}`);
    return reviews;
    
  } catch (error) {
    await logError(`Failed to load reviews for language ${language}`, error);
    throw error;
  }
}

function transformReviewForDatabase(review) {
  // Map to the actual database schema
  return {
    // Generate proper UUID instead of using review.id
    id: uuidv4(),
    tour_slug: review.tour_slug,
    reviewer_name: review.author,
    reviewer_location: review.author_location,
    reviewer_flag: getFlagFromLocation(review.author_location),
    reviewer_country_code: getCountryCode(review.author_location),
    review_date: review.review_date,
    rating: parseInt(review.rating),
    review_text: review.content,
    locale: review.language,
    is_featured: false,
    display_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function getFlagFromLocation(location) {
  const flagMap = {
    'UK': '🇬🇧', 'United Kingdom': '🇬🇧', 'London': '🇬🇧', 'Manchester': '🇬🇧', 'Edinburgh': '🇬🇧',
    'USA': '🇺🇸', 'United States': '🇺🇸', 'New York': '🇺🇸', 'Chicago': '🇺🇸', 'Los Angeles': '🇺🇸', 'Miami': '🇺🇸', 'Boston': '🇺🇸', 'Denver': '🇺🇸', 'Phoenix': '🇺🇸', 'Seattle': '🇺🇸',
    'Deutschland': '🇩🇪', 'Germany': '🇩🇪', 'Berlin': '🇩🇪', 'München': '🇩🇪', 'Hamburg': '🇩🇪', 'Köln': '🇩🇪', 'Frankfurt': '🇩🇪', 'Stuttgart': '🇩🇪', 'Düsseldorf': '🇩🇪', 'Hannover': '🇩🇪',
    'France': '🇫🇷', 'Paris': '🇫🇷', 'Lyon': '🇫🇷', 'Marseille': '🇫🇷', 'Toulouse': '🇫🇷', 'Nice': '🇫🇷', 'Bordeaux': '🇫🇷', 'Strasbourg': '🇫🇷', 'Nantes': '🇫🇷',
    'España': '🇪🇸', 'Spain': '🇪🇸', 'Madrid': '🇪🇸', 'Barcelona': '🇪🇸', 'Valencia': '🇪🇸', 'Sevilla': '🇪🇸', 'Bilbao': '🇪🇸', 'Málaga': '🇪🇸', 'Zaragoza': '🇪🇸', 'Granada': '🇪🇸',
    'Australia': '🇦🇺', 'Sydney': '🇦🇺', 'Melbourne': '🇦🇺',
    'Canada': '🇨🇦', 'Toronto': '🇨🇦', 'Vancouver': '🇨🇦',
    'الإمارات': '🇦🇪', 'UAE': '🇦🇪', 'دبي': '🇦🇪',
    'السعودية': '🇸🇦', 'Saudi Arabia': '🇸🇦', 'الرياض': '🇸🇦', 'جدة': '🇸🇦',
    'الكويت': '🇰🇼', 'Kuwait': '🇰🇼',
    'مصر': '🇪🇬', 'Egypt': '🇪🇬', 'القاهرة': '🇪🇬',
    'قطر': '🇶🇦', 'Qatar': '🇶🇦', 'الدوحة': '🇶🇦',
    'البحرين': '🇧🇭', 'Bahrain': '🇧🇭', 'المنامة': '🇧🇭',
    'الأردن': '🇯🇴', 'Jordan': '🇯🇴', 'عمان': '🇯🇴',
    'لبنان': '🇱🇧', 'Lebanon': '🇱🇧', 'بيروت': '🇱🇧'
  };
  
  for (const [key, flag] of Object.entries(flagMap)) {
    if (location.includes(key)) {
      return flag;
    }
  }
  return '🌍'; // Default flag
}

function getCountryCode(location) {
  const codeMap = {
    'UK': 'GB', 'United Kingdom': 'GB', 'London': 'GB', 'Manchester': 'GB', 'Edinburgh': 'GB',
    'USA': 'US', 'United States': 'US', 'New York': 'US', 'Chicago': 'US', 'Los Angeles': 'US', 'Miami': 'US', 'Boston': 'US', 'Denver': 'US', 'Phoenix': 'US', 'Seattle': 'US',
    'Deutschland': 'DE', 'Germany': 'DE', 'Berlin': 'DE', 'München': 'DE', 'Hamburg': 'DE', 'Köln': 'DE', 'Frankfurt': 'DE', 'Stuttgart': 'DE', 'Düsseldorf': 'DE', 'Hannover': 'DE',
    'France': 'FR', 'Paris': 'FR', 'Lyon': 'FR', 'Marseille': 'FR', 'Toulouse': 'FR', 'Nice': 'FR', 'Bordeaux': 'FR', 'Strasbourg': 'FR', 'Nantes': 'FR',
    'España': 'ES', 'Spain': 'ES', 'Madrid': 'ES', 'Barcelona': 'ES', 'Valencia': 'ES', 'Sevilla': 'ES', 'Bilbao': 'ES', 'Málaga': 'ES', 'Zaragoza': 'ES', 'Granada': 'ES',
    'Australia': 'AU', 'Sydney': 'AU', 'Melbourne': 'AU',
    'Canada': 'CA', 'Toronto': 'CA', 'Vancouver': 'CA',
    'الإمارات': 'AE', 'UAE': 'AE', 'دبي': 'AE',
    'السعودية': 'SA', 'Saudi Arabia': 'SA', 'الرياض': 'SA', 'جدة': 'SA',
    'الكويت': 'KW', 'Kuwait': 'KW',
    'مصر': 'EG', 'Egypt': 'EG', 'القاهرة': 'EG',
    'قطر': 'QA', 'Qatar': 'QA', 'الدوحة': 'QA',
    'البحرين': 'BH', 'Bahrain': 'BH', 'المنامة': 'BH',
    'الأردن': 'JO', 'Jordan': 'JO', 'عمان': 'JO',
    'لبنان': 'LB', 'Lebanon': 'LB', 'بيروت': 'LB'
  };
  
  for (const [key, code] of Object.entries(codeMap)) {
    if (location.includes(key)) {
      return code;
    }
  }
  return 'ZZ'; // Unknown country
}

// Database operations
async function checkExistingReviews(supabase, language) {
  try {
    const { data, error, count } = await supabase
      .from('tour_reviews')
      .select('id', { count: 'exact' })
      .eq('locale', language);
    
    if (error) throw error;
    
    await log(`Found ${count || 0} existing reviews for language: ${language}`);
    return count || 0;
    
  } catch (error) {
    await logError(`Failed to check existing reviews for ${language}`, error);
    throw error;
  }
}

async function insertReviewsBatch(supabase, reviews, language, batchNumber) {
  const startIndex = batchNumber * CONFIG.BATCH_SIZE;
  const endIndex = Math.min(startIndex + CONFIG.BATCH_SIZE, reviews.length);
  const batch = reviews.slice(startIndex, endIndex);
  
  await log(`Inserting batch ${batchNumber + 1} for ${language}: ${batch.length} reviews`);
  
  for (let attempt = 0; attempt < CONFIG.RETRY_ATTEMPTS; attempt++) {
    try {
      // Transform reviews for database
      const transformedBatch = batch.map(transformReviewForDatabase);
      
      const { data, error } = await supabase
        .from('tour_reviews')
        .insert(transformedBatch)
        .select('id');
      
      if (error) {
        if (error.code === '23505') {
          // Handle duplicate key errors
          await log(`Batch ${batchNumber + 1} for ${language} contains duplicates, attempting individual inserts`);
          
          let successCount = 0;
          for (const transformedReview of transformedBatch) {
            try {
              const { error: individualError } = await supabase
                .from('tour_reviews')
                .insert([transformedReview])
                .select('id');
              
              if (!individualError) {
                successCount++;
              } else if (individualError.code !== '23505') {
                throw individualError;
              }
            } catch (indError) {
              await logError(`Individual insert failed for ${language}`, indError, { review_id: transformedReview.id });
            }
          }
          
          await log(`Batch ${batchNumber + 1} for ${language}: ${successCount}/${batch.length} reviews inserted`);
          return successCount;
        } else {
          throw error;
        }
      }
      
      await log(`Batch ${batchNumber + 1} for ${language}: ${data.length} reviews inserted successfully`);
      return data.length;
      
    } catch (error) {
      if (attempt === CONFIG.RETRY_ATTEMPTS - 1) {
        throw error;
      }
      
      await log(`Batch ${batchNumber + 1} for ${language} failed (attempt ${attempt + 1}), retrying...`);
      await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY * (attempt + 1)));
    }
  }
}

async function insertLanguageReviews(supabase, language) {
  const startTime = Date.now();
  
  try {
    await log(`Starting insertion for language: ${language}`);
    
    // Load reviews
    const reviews = await loadReviewsFromFile(language);
    if (reviews.length === 0) {
      await log(`No reviews found for language: ${language}`);
      return { language, inserted: 0, errors: [], duration: 0 };
    }
    
    // Check existing reviews
    const existingCount = await checkExistingReviews(supabase, language);
    
    // Filter out existing reviews based on ID
    let reviewsToInsert = reviews;
    if (existingCount > 0) {
      // Check which specific reviews already exist
      const { data: existingReviews } = await supabase
        .from('tour_reviews')
        .select('id')
        .eq('language', language);
      
      const existingIds = new Set(existingReviews.map(r => r.id));
      reviewsToInsert = reviews.filter(r => !existingIds.has(r.id));
      
      await log(`${reviewsToInsert.length} new reviews to insert for ${language} (${reviews.length - reviewsToInsert.length} already exist)`);
    }
    
    if (reviewsToInsert.length === 0) {
      await log(`All reviews for ${language} already exist in database`);
      return { language, inserted: 0, errors: [], duration: Date.now() - startTime };
    }
    
    // Insert in batches
    const totalBatches = Math.ceil(reviewsToInsert.length / CONFIG.BATCH_SIZE);
    let totalInserted = 0;
    const errors = [];
    
    for (let batchNumber = 0; batchNumber < totalBatches; batchNumber++) {
      try {
        const insertedCount = await insertReviewsBatch(supabase, reviewsToInsert, language, batchNumber);
        totalInserted += insertedCount;
        
        // Progress reporting
        const progress = Math.round((batchNumber + 1) / totalBatches * 100);
        await log(`${language} progress: ${progress}% (${batchNumber + 1}/${totalBatches} batches)`);
        
      } catch (error) {
        errors.push({
          batchNumber: batchNumber + 1,
          error: error.message,
          reviewsInBatch: Math.min(CONFIG.BATCH_SIZE, reviewsToInsert.length - batchNumber * CONFIG.BATCH_SIZE)
        });
        
        await logError(`Batch ${batchNumber + 1} failed for ${language}`, error);
      }
    }
    
    const duration = Date.now() - startTime;
    await log(`Completed ${language}: ${totalInserted} reviews inserted in ${Math.round(duration/1000)}s`);
    
    return { language, inserted: totalInserted, errors, duration, total: reviewsToInsert.length };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    await logError(`Critical error for language ${language}`, error);
    return { language, inserted: 0, errors: [{ error: error.message }], duration };
  }
}

// Validation functions
async function validateInsertedData(supabase) {
  await log('Validating inserted data...');
  
  const validationResults = {};
  
  try {
    // Check total counts by language
    for (const language of EXECUTION_ORDER) {
      const { count, error } = await supabase
        .from('tour_reviews')
        .select('id', { count: 'exact' })
        .eq('locale', language);
      
      if (error) throw error;
      
      validationResults[language] = count || 0;
    }
    
    // Check data integrity
    const { data: integrityCheck, error: integrityError } = await supabase
      .from('tour_reviews')
      .select('locale, tour_slug, reviewer_name, rating')
      .is('reviewer_name', null)
      .limit(10);
    
    if (integrityError) throw integrityError;
    
    const hasIntegrityIssues = integrityCheck && integrityCheck.length > 0;
    
    await log('Data validation completed');
    return { validationResults, hasIntegrityIssues, integrityIssues: integrityCheck };
    
  } catch (error) {
    await logError('Data validation failed', error);
    throw error;
  }
}

// Rollback functionality
async function createRollbackProcedure(results) {
  const rollbackSQL = [
    '-- Rollback procedure for tour reviews insertion',
    `-- Generated: ${new Date().toISOString()}`,
    '',
    '-- Remove reviews inserted in this session',
    "DELETE FROM tour_reviews WHERE created_at >= '" + new Date().toISOString().split('T')[0] + "T00:00:00Z';",
    '',
    '-- Verification query',
    'SELECT language, COUNT(*) as count FROM tour_reviews GROUP BY language ORDER BY language;',
    ''
  ];
  
  const rollbackContent = rollbackSQL.join('\n');
  await fs.writeFile('rollback-reviews-insertion.sql', rollbackContent);
  
  await log('Rollback procedure created: rollback-reviews-insertion.sql');
}

// Report generation
async function generateExecutionReport(results, validationData) {
  const totalInserted = results.reduce((sum, r) => sum + r.inserted, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  
  const report = [
    '='.repeat(80),
    'TOUR REVIEWS DATABASE EXECUTION REPORT',
    '='.repeat(80),
    `Execution Date: ${new Date().toISOString()}`,
    `Total Duration: ${Math.round(totalDuration / 1000)} seconds`,
    '',
    'EXECUTION SUMMARY:',
    `- Total reviews inserted: ${totalInserted}`,
    `- Total errors: ${totalErrors}`,
    `- Languages processed: ${EXECUTION_ORDER.length}`,
    `- Success rate: ${totalErrors === 0 ? '100%' : Math.round((totalInserted / (totalInserted + totalErrors)) * 100) + '%'}`,
    '',
    'LANGUAGE BREAKDOWN:',
    ...results.map(r => 
      `- ${r.language.toUpperCase()}: ${r.inserted} inserted, ${r.errors.length} errors, ${Math.round(r.duration/1000)}s`
    ),
    '',
    'VALIDATION RESULTS:',
    ...Object.entries(validationData.validationResults).map(([lang, count]) => 
      `- ${lang.toUpperCase()}: ${count} total reviews in database`
    ),
    `- Data integrity issues: ${validationData.hasIntegrityIssues ? 'YES' : 'NO'}`,
    '',
    'CONFIGURATION:',
    `- Batch size: ${CONFIG.BATCH_SIZE}`,
    `- Retry attempts: ${CONFIG.RETRY_ATTEMPTS}`,
    `- Execution order: ${EXECUTION_ORDER.join(', ')}`,
    '',
    'FILES PROCESSED:',
    ...Object.entries(LANGUAGE_FILES).map(([lang, file]) => `- ${lang}: ${file}`),
    ''
  ];
  
  if (totalErrors > 0) {
    report.push('DETAILED ERRORS:');
    results.forEach(r => {
      if (r.errors.length > 0) {
        report.push(`\n${r.language.toUpperCase()} ERRORS:`);
        r.errors.forEach((error, index) => {
          report.push(`${index + 1}. Batch ${error.batchNumber || 'N/A'}: ${error.error}`);
        });
      }
    });
  }
  
  report.push('='.repeat(80));
  
  const reportContent = report.join('\n');
  console.log(reportContent);
  
  await fs.writeFile('database-execution-report.md', reportContent);
  await fs.writeFile('execution-results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: { totalInserted, totalErrors, totalDuration },
    results,
    validation: validationData
  }, null, 2));
  
  return reportContent;
}

// Main execution function
async function main() {
  const overallStartTime = Date.now();
  
  try {
    await log('='.repeat(60));
    await log('STARTING MULTI-LANGUAGE TOUR REVIEWS DATABASE INSERTION');
    await log('='.repeat(60));
    
    // Initialize Supabase
    const supabase = initializeSupabase();
    await log('Supabase client initialized');
    
    // Process each language in order
    const results = [];
    
    for (const language of EXECUTION_ORDER) {
      await log(`\n--- Processing ${language.toUpperCase()} Reviews ---`);
      const languageResult = await insertLanguageReviews(supabase, language);
      results.push(languageResult);
      
      // Small delay between languages
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Validate inserted data
    await log('\n--- Validating Data Integrity ---');
    const validationData = await validateInsertedData(supabase);
    
    // Create rollback procedure
    await log('\n--- Creating Rollback Procedures ---');
    await createRollbackProcedure(results);
    
    // Generate comprehensive report
    await log('\n--- Generating Execution Report ---');
    await generateExecutionReport(results, validationData);
    
    const totalDuration = Date.now() - overallStartTime;
    const totalInserted = results.reduce((sum, r) => sum + r.inserted, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
    
    await log('='.repeat(60));
    await log(`EXECUTION COMPLETED: ${totalInserted} reviews inserted with ${totalErrors} errors in ${Math.round(totalDuration/1000)} seconds`);
    await log('='.repeat(60));
    
    if (totalErrors === 0) {
      process.exit(0);
    } else {
      process.exit(1);
    }
    
  } catch (error) {
    await logError('Critical system error', error);
    console.error('Critical system error:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = {
  main,
  insertLanguageReviews,
  validateInsertedData,
  CONFIG
};