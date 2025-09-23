#!/usr/bin/env node

/**
 * Multi-Tour Reviews Insertion Script
 * 
 * Processes language-specific review files where each file contains 
 * reviews for multiple tours and inserts them into the database.
 */

const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const CONFIG = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://orogsbgpdvpzraujtekx.supabase.co',
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  BATCH_SIZE: 50,
  LOG_FILE: 'multi-tour-insert-log.txt'
};

console.log('🚀 Starting Multi-Tour Reviews Insertion');

// Initialize Supabase client
function initializeSupabase() {
  if (!CONFIG.SUPABASE_URL) {
    throw new Error('Missing SUPABASE_URL');
  }
  
  // For now, use anon key if service key not available
  const supabaseKey = CONFIG.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseKey) {
    console.log('⚠️  No Supabase keys found. Using demo mode (no actual inserts)');
    return null;
  }
  
  return createClient(CONFIG.SUPABASE_URL, supabaseKey);
}

// Logging
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

// Validate review data
function validateReview(review, language) {
  const errors = [];
  
  if (!review.id) errors.push('Missing id');
  if (!review.tour_slug) errors.push('Missing tour_slug');
  if (!review.author) errors.push('Missing author');
  if (!review.author_location) errors.push('Missing author_location');
  if (!review.rating || review.rating < 1 || review.rating > 5) errors.push('Invalid rating');
  if (!review.review_date) errors.push('Missing review_date');
  if (!review.content || review.content.length < 10) errors.push('Invalid content');
  
  // Set defaults for missing optional fields
  if (!review.language) review.language = language;
  if (!review.title) review.title = '';
  if (typeof review.verified !== 'boolean') review.verified = true;
  if (!review.experience_type) review.experience_type = 'general';
  if (typeof review.helpful_count !== 'number') review.helpful_count = 0;
  
  return errors;
}

// Process language files
async function processLanguageFiles() {
  const reviewFiles = [
    { file: 'complete-english-reviews.json', language: 'en' },
    { file: 'complete-german-reviews.json', language: 'de' },
    { file: 'complete-french-reviews.json', language: 'fr' },
    { file: 'complete-spanish-reviews.json', language: 'es' },
    { file: 'complete-arabic-reviews.json', language: 'ar' }
  ];
  
  const supabase = initializeSupabase();
  const allReviews = [];
  const errors = [];
  
  for (const { file, language } of reviewFiles) {
    try {
      console.log(`📖 Processing ${file} for language: ${language}`);
      
      const filePath = path.join(__dirname, file);
      const content = await fs.readFile(filePath, 'utf8');
      const reviews = JSON.parse(content);
      
      if (!Array.isArray(reviews)) {
        errors.push(`File ${file} does not contain an array of reviews`);
        continue;
      }
      
      let validReviews = 0;
      let invalidReviews = 0;
      
      for (const review of reviews) {
        const validationErrors = validateReview(review, language);
        
        if (validationErrors.length === 0) {
          allReviews.push(review);
          validReviews++;
        } else {
          errors.push(`Invalid review ${review.id || 'unknown'} in ${file}: ${validationErrors.join(', ')}`);
          invalidReviews++;
        }
      }
      
      console.log(`✅ ${file}: ${validReviews} valid reviews, ${invalidReviews} invalid`);
      await log(`Processed ${file}: ${validReviews} valid, ${invalidReviews} invalid reviews`);
      
    } catch (error) {
      const errorMsg = `Failed to process ${file}: ${error.message}`;
      console.error(`❌ ${errorMsg}`);
      errors.push(errorMsg);
    }
  }
  
  // Report summary
  console.log(`\\n📊 PROCESSING SUMMARY:`);
  console.log(`Total valid reviews: ${allReviews.length}`);
  console.log(`Total errors: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log(`\\n❌ ERRORS FOUND:`);
    errors.slice(0, 10).forEach(error => console.log(`  • ${error}`));
    if (errors.length > 10) {
      console.log(`  ... and ${errors.length - 10} more errors`);
    }
  }
  
  // Insert reviews into database
  if (allReviews.length > 0 && supabase) {
    console.log(`\\n💾 Inserting ${allReviews.length} reviews into database...`);
    
    try {
      // Insert in batches
      let insertedCount = 0;
      const batchSize = CONFIG.BATCH_SIZE;
      
      for (let i = 0; i < allReviews.length; i += batchSize) {
        const batch = allReviews.slice(i, i + batchSize);
        
        const { data, error } = await supabase
          .from('tour_reviews')
          .upsert(batch, { onConflict: 'id' });
        
        if (error) {
          console.error(`❌ Batch insert error:`, error);
          await log(`Batch insert error: ${error.message}`, 'ERROR');
        } else {
          insertedCount += batch.length;
          console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allReviews.length/batchSize)}`);
        }
      }
      
      console.log(`\\n🎉 Successfully inserted ${insertedCount} reviews!`);
      await log(`Successfully inserted ${insertedCount} reviews`);
      
    } catch (error) {
      console.error(`❌ Database insertion failed:`, error);
      await log(`Database insertion failed: ${error.message}`, 'ERROR');
    }
  } else if (!supabase) {
    console.log(`\\n🔄 DEMO MODE: Would insert ${allReviews.length} reviews`);
    console.log('Set SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY to actually insert data');
  }
  
  return {
    totalReviews: allReviews.length,
    totalErrors: errors.length,
    success: errors.length === 0
  };
}

// Language breakdown
async function generateLanguageBreakdown() {
  console.log(`\\n🌍 LANGUAGE BREAKDOWN:`);
  
  const reviewFiles = [
    { file: 'complete-english-reviews.json', language: 'English (EN)' },
    { file: 'complete-german-reviews.json', language: 'German (DE)' },
    { file: 'complete-french-reviews.json', language: 'French (FR)' },
    { file: 'complete-spanish-reviews.json', language: 'Spanish (ES)' },
    { file: 'complete-arabic-reviews.json', language: 'Arabic (AR)' }
  ];
  
  let totalReviews = 0;
  const tourCounts = {};
  
  for (const { file, language } of reviewFiles) {
    try {
      const filePath = path.join(__dirname, file);
      const content = await fs.readFile(filePath, 'utf8');
      const reviews = JSON.parse(content);
      
      console.log(`  ${language}: ${reviews.length} reviews`);
      totalReviews += reviews.length;
      
      // Count unique tour slugs
      reviews.forEach(review => {
        if (review.tour_slug) {
          if (!tourCounts[review.tour_slug]) tourCounts[review.tour_slug] = 0;
          tourCounts[review.tour_slug]++;
        }
      });
      
    } catch (error) {
      console.log(`  ${language}: Error reading file`);
    }
  }
  
  console.log(`\\nTotal reviews: ${totalReviews}`);
  console.log(`Unique tours covered: ${Object.keys(tourCounts).length}`);
  
  return { totalReviews, tourCounts };
}

// Main execution
async function main() {
  try {
    console.log('=' .repeat(60));
    console.log('🌟 MULTI-TOUR GUEST REVIEWS INSERTION');
    console.log('=' .repeat(60));
    
    // Show language breakdown
    await generateLanguageBreakdown();
    
    // Process and insert reviews
    const result = await processLanguageFiles();
    
    console.log('\\n' + '=' .repeat(60));
    console.log('✅ INSERTION COMPLETE');
    console.log('=' .repeat(60));
    console.log(`📊 Total Reviews Processed: ${result.totalReviews}`);
    console.log(`❌ Total Errors: ${result.totalErrors}`);
    console.log(`🎯 Success Rate: ${result.totalErrors === 0 ? '100%' : ((result.totalReviews - result.totalErrors) / result.totalReviews * 100).toFixed(1) + '%'}`);
    
    if (result.success) {
      console.log('\\n🎉 All reviews processed successfully!');
      process.exit(0);
    } else {
      console.log('\\n⚠️  Some errors occurred. Check the log file for details.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    await log(`Script failed: ${error.message}`, 'ERROR');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { processLanguageFiles, generateLanguageBreakdown };