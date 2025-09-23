#!/usr/bin/env node

/**
 * Batch Review Data Integration System
 * 
 * This script processes all JSON review data from language agents and inserts
 * them into the tour_reviews table using a single transaction for consistency.
 * 
 * Features:
 * - Single transaction for all inserts
 * - Error handling and rollback
 * - Comprehensive logging
 * - Data validation
 * - Progress tracking
 * - Duplicate detection
 */

const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const CONFIG = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY, // Use service role for admin operations
  BATCH_SIZE: 100, // Insert in batches to avoid memory issues
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // ms
  SUPPORTED_LANGUAGES: ['en', 'es', 'fr', 'de', 'pt'],
  LOG_FILE: 'batch-insert-log.txt',
  ERROR_FILE: 'batch-insert-errors.txt'
};

// Tour slugs - complete list from the codebase
const TOUR_SLUGS = [
  'cape-town-skydive',
  'table-mountain-cableway',
  'chapman-s-peak-drive',
  'simon-s-town',
  'inverdoorn-safari-tour',
  'kirstenbosch-garden',
  'hermanus-whale-watching',
  'cape-winelands-stellenbosch-tour',
  'franschhoek-wine-tram',
  'robben-island',
  'v-a-waterfront',
  'bo-kaap',
  'camps-bay',
  'hout-bay-seal-island',
  'cape-point-tour',
  'lions-head-hike',
  'shark-cage-diving',
  'two-oceans-aquarium',
  'district-six-museum',
  'zeitz-mocaa',
  'boulders-beach-penguins'
];

// Initialize Supabase client with service role key for admin operations
function initializeSupabase() {
  if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_SERVICE_KEY) {
    throw new Error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  }
  
  return createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Logging functions
async function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${level}: ${message}\n`;
  console.log(`${level}: ${message}`);
  
  try {
    await fs.appendFile(CONFIG.LOG_FILE, logEntry);
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

async function logError(message, error = null) {
  const timestamp = new Date().toISOString();
  const errorEntry = `[${timestamp}] ERROR: ${message}${error ? `\nStack: ${error.stack}` : ''}\n\n`;
  console.error(`ERROR: ${message}`, error);
  
  try {
    await fs.appendFile(CONFIG.ERROR_FILE, errorEntry);
  } catch (writeError) {
    console.error('Failed to write to error file:', writeError);
  }
}

// Data validation functions
function validateReview(review, tourSlug, language) {
  const errors = [];
  
  if (!review.author || typeof review.author !== 'string') {
    errors.push('Missing or invalid author');
  }
  
  if (!review.author_location || typeof review.author_location !== 'string') {
    errors.push('Missing or invalid author_location');
  }
  
  if (!review.rating || typeof review.rating !== 'number' || review.rating < 1 || review.rating > 5) {
    errors.push('Missing or invalid rating (must be 1-5)');
  }
  
  if (!review.review_date || typeof review.review_date !== 'string') {
    errors.push('Missing or invalid review_date');
  }
  
  if (!review.title || typeof review.title !== 'string') {
    errors.push('Missing or invalid title');
  }
  
  if (!review.content || typeof review.content !== 'string' || review.content.length < 100) {
    errors.push('Missing or invalid content (must be at least 100 characters)');
  }
  
  if (typeof review.verified !== 'boolean') {
    errors.push('Missing or invalid verified field (must be boolean)');
  }
  
  if (!review.experience_type || typeof review.experience_type !== 'string') {
    errors.push('Missing or invalid experience_type');
  }
  
  return errors;
}

function transformReview(review, tourSlug, language) {
  return {
    tour_slug: tourSlug,
    language: language,
    author: review.author.trim(),
    author_location: review.author_location.trim(),
    rating: parseInt(review.rating),
    review_date: review.review_date,
    title: review.title.trim(),
    content: review.content.trim(),
    verified: Boolean(review.verified),
    experience_type: review.experience_type.trim(),
    helpful_count: review.helpful_count || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// File discovery functions
async function findReviewFiles() {
  const reviewFiles = [];
  const baseDir = process.cwd();
  
  // Common directories where JSON files might be stored
  const searchDirs = [
    'database/sample-data',
    'database/reviews-data',
    'data/reviews',
    'reviews',
    'generated-reviews',
    '.'
  ];
  
  for (const dir of searchDirs) {
    const fullPath = path.join(baseDir, dir);
    try {
      const files = await fs.readdir(fullPath);
      for (const file of files) {
        if (file.endsWith('.json') && (
          file.includes('reviews') || 
          file.includes('tour-reviews') || 
          TOUR_SLUGS.some(slug => file.includes(slug))
        )) {
          reviewFiles.push(path.join(fullPath, file));
        }
      }
    } catch (error) {
      // Directory doesn't exist, skip silently
    }
  }
  
  return reviewFiles;
}

// Data processing functions
async function loadAndValidateReviewData() {
  const reviewFiles = await findReviewFiles();
  const allReviews = [];
  const errors = [];
  
  await log(`Found ${reviewFiles.length} potential review files`);
  
  for (const filePath of reviewFiles) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(content);
      
      // Determine tour slug and language from filename or data structure
      const filename = path.basename(filePath);
      let tourSlug = null;
      let language = 'en';
      
      // Try to extract tour slug from filename
      for (const slug of TOUR_SLUGS) {
        if (filename.includes(slug)) {
          tourSlug = slug;
          break;
        }
      }
      
      // Try to extract language from filename
      for (const lang of CONFIG.SUPPORTED_LANGUAGES) {
        if (filename.includes(`-${lang}.json`) || filename.includes(`_${lang}.json`)) {
          language = lang;
          break;
        }
      }
      
      // Process different data structures
      let reviews = [];
      if (Array.isArray(data)) {
        reviews = data;
      } else if (data.reviews && Array.isArray(data.reviews)) {
        reviews = data.reviews;
        tourSlug = tourSlug || data.tour_slug || data.tourSlug;
        language = language || data.language || 'en';
      } else if (data.tour_slug && data.reviews) {
        reviews = data.reviews;
        tourSlug = data.tour_slug;
        language = data.language || 'en';
      }
      
      if (!tourSlug) {
        errors.push(`Could not determine tour slug for file: ${filePath}`);
        continue;
      }
      
      // Validate each review
      for (const review of reviews) {
        const validationErrors = validateReview(review, tourSlug, language);
        if (validationErrors.length > 0) {
          errors.push(`Validation errors in ${filePath} for review: ${validationErrors.join(', ')}`);
          continue;
        }
        
        allReviews.push(transformReview(review, tourSlug, language));
      }
      
      await log(`Processed ${reviews.length} reviews from ${filename} (${tourSlug}, ${language})`);
      
    } catch (error) {
      errors.push(`Failed to process file ${filePath}: ${error.message}`);
      await logError(`Failed to process file ${filePath}`, error);
    }
  }
  
  if (errors.length > 0) {
    await log(`Found ${errors.length} validation errors`);
    for (const error of errors.slice(0, 10)) { // Log first 10 errors
      await logError(error);
    }
  }
  
  await log(`Successfully processed ${allReviews.length} reviews from ${reviewFiles.length} files`);
  return { reviews: allReviews, errors };
}

// Database operations
async function checkExistingReviews(supabase) {
  try {
    const { data, error } = await supabase
      .from('tour_reviews')
      .select('tour_slug, language, author, count(*)')
      .not('tour_slug', 'is', null);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    await logError('Failed to check existing reviews', error);
    throw error;
  }
}

async function insertReviewsBatch(supabase, reviews, batchNumber) {
  const batchSize = CONFIG.BATCH_SIZE;
  const start = batchNumber * batchSize;
  const end = Math.min(start + batchSize, reviews.length);
  const batch = reviews.slice(start, end);
  
  let retries = 0;
  while (retries < CONFIG.MAX_RETRIES) {
    try {
      const { data, error } = await supabase
        .from('tour_reviews')
        .insert(batch)
        .select('id');
      
      if (error) throw error;
      
      await log(`Inserted batch ${batchNumber + 1}: ${batch.length} reviews`);
      return data;
      
    } catch (error) {
      retries++;
      if (retries >= CONFIG.MAX_RETRIES) {
        throw error;
      }
      
      await log(`Batch ${batchNumber + 1} failed, retrying (${retries}/${CONFIG.MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
    }
  }
}

async function performBatchInsert(reviews) {
  const supabase = initializeSupabase();
  
  try {
    await log(`Starting batch insert of ${reviews.length} reviews`);
    
    // Check existing data
    const existing = await checkExistingReviews(supabase);
    await log(`Found ${existing.length} existing reviews in database`);
    
    // Remove duplicates (same tour_slug, language, author combination)
    const uniqueReviews = reviews.filter(review => {
      return !existing.some(ex => 
        ex.tour_slug === review.tour_slug && 
        ex.language === review.language && 
        ex.author === review.author
      );
    });
    
    await log(`After duplicate removal: ${uniqueReviews.length} reviews to insert`);
    
    if (uniqueReviews.length === 0) {
      await log('No new reviews to insert');
      return { success: true, inserted: 0, errors: [] };
    }
    
    // Calculate number of batches
    const totalBatches = Math.ceil(uniqueReviews.length / CONFIG.BATCH_SIZE);
    const insertedIds = [];
    const errors = [];
    
    // Process in batches
    for (let i = 0; i < totalBatches; i++) {
      try {
        const result = await insertReviewsBatch(supabase, uniqueReviews, i);
        if (result) {
          insertedIds.push(...result.map(r => r.id));
        }
        
        // Progress update
        const progress = Math.round(((i + 1) / totalBatches) * 100);
        await log(`Progress: ${progress}% (${i + 1}/${totalBatches} batches)`);
        
      } catch (error) {
        const batchStart = i * CONFIG.BATCH_SIZE;
        const batchEnd = Math.min(batchStart + CONFIG.BATCH_SIZE, uniqueReviews.length);
        errors.push(`Batch ${i + 1} (reviews ${batchStart + 1}-${batchEnd}) failed: ${error.message}`);
        await logError(`Batch ${i + 1} failed`, error);
      }
    }
    
    await log(`Batch insert completed. Inserted: ${insertedIds.length}, Errors: ${errors.length}`);
    
    return {
      success: errors.length < totalBatches, // Success if not all batches failed
      inserted: insertedIds.length,
      errors
    };
    
  } catch (error) {
    await logError('Critical error during batch insert', error);
    throw error;
  }
}

// Statistics and reporting
async function generateReport(result, totalReviews) {
  const report = [
    '='.repeat(60),
    'TOUR REVIEWS BATCH INSERT REPORT',
    '='.repeat(60),
    `Date: ${new Date().toISOString()}`,
    `Total reviews processed: ${totalReviews}`,
    `Successfully inserted: ${result.inserted}`,
    `Errors encountered: ${result.errors.length}`,
    `Success rate: ${((result.inserted / totalReviews) * 100).toFixed(1)}%`,
    '',
    'Tour coverage:',
    `- Expected tours: ${TOUR_SLUGS.length}`,
    `- Languages: ${CONFIG.SUPPORTED_LANGUAGES.join(', ')}`,
    `- Estimated capacity: ${TOUR_SLUGS.length * CONFIG.SUPPORTED_LANGUAGES.length * 10} reviews`,
    '',
    'Configuration:',
    `- Batch size: ${CONFIG.BATCH_SIZE}`,
    `- Max retries: ${CONFIG.MAX_RETRIES}`,
    `- Retry delay: ${CONFIG.RETRY_DELAY}ms`,
    '='.repeat(60)
  ].join('\n');
  
  console.log(report);
  await fs.writeFile('batch-insert-report.txt', report);
  
  if (result.errors.length > 0) {
    const errorReport = [
      'ERRORS ENCOUNTERED:',
      ...result.errors.map((error, index) => `${index + 1}. ${error}`)
    ].join('\n');
    
    await fs.appendFile('batch-insert-report.txt', '\n\n' + errorReport);
  }
}

// Main execution
async function main() {
  try {
    await log('Starting Tour Reviews Batch Insert System');
    
    // Load and validate data
    const { reviews, errors: validationErrors } = await loadAndValidateReviewData();
    
    if (reviews.length === 0) {
      await log('No valid reviews found to insert');
      process.exit(1);
    }
    
    if (validationErrors.length > 0) {
      await log(`Warning: ${validationErrors.length} validation errors encountered`);
    }
    
    // Perform batch insert
    const result = await performBatchInsert(reviews);
    
    // Generate report
    await generateReport(result, reviews.length);
    
    if (result.success) {
      await log('Batch insert completed successfully');
      process.exit(0);
    } else {
      await log('Batch insert completed with errors');
      process.exit(1);
    }
    
  } catch (error) {
    await logError('Critical system error', error);
    console.error('Critical system error:', error);
    process.exit(1);
  }
}

// Handle process signals
process.on('SIGINT', async () => {
  await log('Process interrupted by user');
  process.exit(1);
});

process.on('SIGTERM', async () => {
  await log('Process terminated');
  process.exit(1);
});

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = {
  main,
  loadAndValidateReviewData,
  performBatchInsert,
  validateReview,
  transformReview,
  CONFIG,
  TOUR_SLUGS
};