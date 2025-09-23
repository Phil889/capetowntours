#!/usr/bin/env node

/**
 * Reviews Insertion with UUID Generation
 * 
 * Processes review files and converts them to match the database schema
 */

const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Configuration
const CONFIG = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://orogsbgpdvpzraujtekx.supabase.co',
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  BATCH_SIZE: 25,
  LOG_FILE: 'uuid-insert-log.txt'
};

console.log('🚀 Starting Reviews Insertion with UUID Generation');

// Initialize Supabase client
function initializeSupabase() {
  if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_SERVICE_KEY) {
    console.log('❌ Missing Supabase credentials');
    return null;
  }
  
  return createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_KEY);
}

// Convert review to database format
function convertToDbFormat(review) {
  return {
    id: uuidv4(), // Generate proper UUID
    tour_slug: review.tour_slug,
    language: review.language,
    author: review.author,
    author_location: review.author_location,
    rating: review.rating,
    review_date: review.review_date,
    title: review.title || '',
    content: review.content,
    verified: review.verified !== false, // Default to true
    experience_type: review.experience_type || 'general',
    helpful_count: review.helpful_count || 0
  };
}

// Process all review files
async function processAllReviews() {
  const reviewFiles = [
    { file: 'complete-english-reviews.json', language: 'en' },
    { file: 'complete-german-reviews.json', language: 'de' },
    { file: 'complete-french-reviews.json', language: 'fr' },
    { file: 'complete-spanish-reviews.json', language: 'es' },
    { file: 'complete-arabic-reviews.json', language: 'ar' }
  ];
  
  const supabase = initializeSupabase();
  if (!supabase) {
    console.log('🔄 Demo mode - no database connection');
    return { success: false, reason: 'No database connection' };
  }
  
  const allReviews = [];
  let totalProcessed = 0;
  
  // Process each file
  for (const { file, language } of reviewFiles) {
    try {
      const filePath = path.join(__dirname, file);
      const content = await fs.readFile(filePath, 'utf8');
      const reviews = JSON.parse(content);
      
      console.log(`📖 Processing ${file}: ${reviews.length} reviews`);
      
      for (const review of reviews) {
        const dbReview = convertToDbFormat(review);
        allReviews.push(dbReview);
        totalProcessed++;
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
  
  console.log(`\\n📊 Total reviews prepared: ${allReviews.length}`);
  
  // Insert in batches
  let insertedCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < allReviews.length; i += CONFIG.BATCH_SIZE) {
    const batch = allReviews.slice(i, i + CONFIG.BATCH_SIZE);
    const batchNum = Math.floor(i / CONFIG.BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(allReviews.length / CONFIG.BATCH_SIZE);
    
    console.log(`💾 Inserting batch ${batchNum}/${totalBatches} (${batch.length} reviews)...`);
    
    try {
      const { data, error } = await supabase
        .from('tour_reviews')
        .insert(batch);
      
      if (error) {
        console.error(`❌ Batch ${batchNum} error:`, error.message);
        errorCount += batch.length;
      } else {
        console.log(`✅ Batch ${batchNum} inserted successfully`);
        insertedCount += batch.length;
      }
      
    } catch (error) {
      console.error(`❌ Batch ${batchNum} failed:`, error.message);
      errorCount += batch.length;
    }
    
    // Small delay between batches
    if (i + CONFIG.BATCH_SIZE < allReviews.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  // Summary
  console.log(`\\n🎉 INSERTION COMPLETE!`);
  console.log(`✅ Successfully inserted: ${insertedCount} reviews`);
  console.log(`❌ Failed to insert: ${errorCount} reviews`);
  console.log(`📊 Success rate: ${((insertedCount / allReviews.length) * 100).toFixed(1)}%`);
  
  return {
    success: errorCount === 0,
    totalReviews: allReviews.length,
    insertedCount,
    errorCount
  };
}

// Main execution
async function main() {
  console.log('=' .repeat(60));
  console.log('🌟 TOUR REVIEWS DATABASE INSERTION');
  console.log('=' .repeat(60));
  
  try {
    const result = await processAllReviews();
    
    if (result.success) {
      console.log('\\n🎊 All reviews inserted successfully!');
      process.exit(0);
    } else {
      console.log('\\n⚠️  Some issues occurred during insertion');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { processAllReviews, convertToDbFormat };