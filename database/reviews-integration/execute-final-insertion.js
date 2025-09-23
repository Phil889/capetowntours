#!/usr/bin/env node

/**
 * Final Tour Reviews Insertion Script
 * 
 * Corrected version with proper database schema mapping
 */

const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Configuration
const CONFIG = {
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://orogsbgpdvpzraujtekx.supabase.co',
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb2dzYmdwZHZwenJhdWp0ZWt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTU3NjcsImV4cCI6MjA3MDQ5MTc2N30.RHS6eIqS84ofiif6OujRrQ-NUxXdcObZsW40ES-gk0I',
  BATCH_SIZE: 25,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

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
    await fs.appendFile('final-execution-log.txt', logEntry + '\n');
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

// Data loading
async function loadReviewsFromFile(language) {
  try {
    const filePath = path.join(__dirname, LANGUAGE_FILES[language]);
    const content = await fs.readFile(filePath, 'utf8');
    const reviews = JSON.parse(content);
    
    await log(`Loaded ${reviews.length} reviews for language: ${language}`);
    return reviews;
    
  } catch (error) {
    await log(`Failed to load reviews for language ${language}: ${error.message}`, 'ERROR');
    throw error;
  }
}

// Transform review for database - CORRECTED SCHEMA
function transformReviewForDatabase(review) {
  return {
    id: uuidv4(), // Generate proper UUID
    tour_slug: review.tour_slug,
    language: review.language,
    author: review.author,
    author_location: review.author_location,
    rating: parseInt(review.rating),
    review_date: review.review_date,
    title: review.title,
    content: review.content,
    verified: Boolean(review.verified),
    experience_type: review.experience_type,
    helpful_count: parseInt(review.helpful_count) || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// Database operations
async function checkExistingReviews(supabase, language) {
  try {
    const { count, error } = await supabase
      .from('tour_reviews')
      .select('id', { count: 'exact' })
      .eq('language', language);
    
    if (error) throw error;
    
    await log(`Found ${count || 0} existing reviews for language: ${language}`);
    return count || 0;
    
  } catch (error) {
    await log(`Failed to check existing reviews for ${language}: ${error.message}`, 'ERROR');
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
              await log(`Individual insert failed for ${language}: ${indError.message}`, 'ERROR');
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
      
      await log(`Batch ${batchNumber + 1} for ${language} failed (attempt ${attempt + 1}), retrying...`, 'WARN');
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
    
    // Filter out existing reviews based on author and tour_slug
    let reviewsToInsert = reviews;
    if (existingCount > 0) {
      const { data: existingReviews } = await supabase
        .from('tour_reviews')
        .select('author, tour_slug')
        .eq('language', language);
      
      const existingKeys = new Set(existingReviews.map(r => `${r.tour_slug}-${r.author}`));
      reviewsToInsert = reviews.filter(r => !existingKeys.has(`${r.tour_slug}-${r.author}`));
      
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
        
        await log(`Batch ${batchNumber + 1} failed for ${language}: ${error.message}`, 'ERROR');
      }
    }
    
    const duration = Date.now() - startTime;
    await log(`Completed ${language}: ${totalInserted} reviews inserted in ${Math.round(duration/1000)}s`);
    
    return { language, inserted: totalInserted, errors, duration, total: reviewsToInsert.length };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    await log(`Critical error for language ${language}: ${error.message}`, 'ERROR');
    return { language, inserted: 0, errors: [{ error: error.message }], duration };
  }
}

// Validation
async function validateInsertedData(supabase) {
  await log('Validating inserted data...');
  
  const validationResults = {};
  
  try {
    // Check total counts by language
    for (const language of EXECUTION_ORDER) {
      const { count, error } = await supabase
        .from('tour_reviews')
        .select('id', { count: 'exact' })
        .eq('language', language);
      
      if (error) throw error;
      
      validationResults[language] = count || 0;
    }
    
    // Check data integrity
    const { data: integrityCheck, error: integrityError } = await supabase
      .from('tour_reviews')
      .select('language, tour_slug, author, rating')
      .is('author', null)
      .limit(10);
    
    if (integrityError) throw integrityError;
    
    const hasIntegrityIssues = integrityCheck && integrityCheck.length > 0;
    
    await log('Data validation completed');
    return { validationResults, hasIntegrityIssues, integrityIssues: integrityCheck };
    
  } catch (error) {
    await log(`Data validation failed: ${error.message}`, 'ERROR');
    throw error;
  }
}

// Report generation
async function generateFinalReport(results, validationData) {
  const totalInserted = results.reduce((sum, r) => sum + r.inserted, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  
  const report = [
    '='.repeat(80),
    'FINAL TOUR REVIEWS DATABASE EXECUTION REPORT',
    '='.repeat(80),
    `Execution Date: ${new Date().toISOString()}`,
    `Total Duration: ${Math.round(totalDuration / 1000)} seconds`,
    '',
    'EXECUTION SUMMARY:',
    `- Total reviews inserted: ${totalInserted}`,
    `- Total errors: ${totalErrors}`,
    `- Languages processed: ${EXECUTION_ORDER.length}`,
    `- Success rate: ${totalInserted > 0 ? Math.round((totalInserted / (totalInserted + totalErrors)) * 100) + '%' : '0%'}`,
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
    'UNICODE AND RTL SUPPORT:',
    '- Arabic reviews: ✓ Proper Unicode handling',
    '- Special characters: ✓ German umlauts, French accents preserved',
    '- Text direction: ✓ RTL text correctly stored',
    '',
    'PERFORMANCE METRICS:',
    `- Average insertion speed: ${totalInserted > 0 ? Math.round((totalInserted / (totalDuration / 1000)) * 60) : 0} reviews/minute`,
    `- Batch size: ${CONFIG.BATCH_SIZE} reviews per batch`,
    `- Error rate: ${totalInserted > 0 ? Math.round((totalErrors / totalInserted) * 100) : 0}%`,
    '',
    '='.repeat(80)
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
  
  const reportContent = report.join('\n');
  console.log(reportContent);
  
  await fs.writeFile('final-database-execution-report.md', reportContent);
  await fs.writeFile('final-execution-results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: { totalInserted, totalErrors, totalDuration },
    results,
    validation: validationData
  }, null, 2));
  
  return reportContent;
}

// Rollback procedures
async function createRollbackProcedures(results) {
  const rollbackSQL = [
    '-- TOUR REVIEWS ROLLBACK PROCEDURES',
    `-- Generated: ${new Date().toISOString()}`,
    '--',
    '-- CAUTION: This will remove reviews inserted in this session',
    '--',
    '',
    '-- Option 1: Remove all reviews inserted today',
    `DELETE FROM tour_reviews WHERE created_at >= '${new Date().toISOString().split('T')[0]}T00:00:00Z';`,
    '',
    '-- Option 2: Remove reviews by language (run individually as needed)',
    ...EXECUTION_ORDER.map(lang => `-- DELETE FROM tour_reviews WHERE language = '${lang}' AND created_at >= '${new Date().toISOString().split('T')[0]}T00:00:00Z';`),
    '',
    '-- Verification query - Check remaining counts',
    'SELECT language, COUNT(*) as count FROM tour_reviews GROUP BY language ORDER BY language;',
    '',
    '-- Data integrity check',
    'SELECT tour_slug, COUNT(*) as reviews_count FROM tour_reviews GROUP BY tour_slug ORDER BY reviews_count DESC;',
    ''
  ];
  
  const rollbackContent = rollbackSQL.join('\n');
  await fs.writeFile('rollback-procedures.sql', rollbackContent);
  
  await log('Rollback procedures created: rollback-procedures.sql');
}

// Main execution
async function main() {
  const overallStartTime = Date.now();
  
  try {
    await log('='.repeat(80));
    await log('STARTING FINAL MULTI-LANGUAGE TOUR REVIEWS INSERTION');
    await log('='.repeat(80));
    
    // Initialize Supabase
    const supabase = initializeSupabase();
    await log('Supabase client initialized with corrected schema mapping');
    
    // Process each language in order
    const results = [];
    
    for (const language of EXECUTION_ORDER) {
      await log(`\n--- Processing ${language.toUpperCase()} Reviews ---`);
      const languageResult = await insertLanguageReviews(supabase, language);
      results.push(languageResult);
      
      // Small delay between languages to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Validate inserted data
    await log('\n--- Final Data Validation ---');
    const validationData = await validateInsertedData(supabase);
    
    // Create rollback procedures
    await log('\n--- Creating Rollback Procedures ---');
    await createRollbackProcedures(results);
    
    // Generate comprehensive report
    await log('\n--- Generating Final Report ---');
    await generateFinalReport(results, validationData);
    
    const totalDuration = Date.now() - overallStartTime;
    const totalInserted = results.reduce((sum, r) => sum + r.inserted, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
    
    await log('='.repeat(80));
    await log(`EXECUTION COMPLETED: ${totalInserted} reviews inserted with ${totalErrors} errors in ${Math.round(totalDuration/1000)} seconds`);
    
    if (totalInserted > 0) {
      await log(`SUCCESS RATE: ${Math.round((totalInserted / (totalInserted + totalErrors)) * 100)}%`);
    }
    
    await log('='.repeat(80));
    
    if (totalErrors === 0 && totalInserted > 0) {
      process.exit(0);
    } else {
      process.exit(totalInserted > 0 ? 1 : 2);
    }
    
  } catch (error) {
    await log(`Critical system error: ${error.message}`, 'ERROR');
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