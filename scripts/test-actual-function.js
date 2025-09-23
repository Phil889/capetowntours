#!/usr/bin/env node

/**
 * Test the actual getTourReviewsWithFallback function
 */

// Mock Next.js cache for testing
const cache = (fn) => fn

// Recreate the exact function from tour-reviews-db.ts
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=')
      if (key && value) {
        process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '')
      }
    })
  }
}

loadEnvFile()

// Mock the error logger
const logError = (message, error, context) => {
  console.error(`[ERROR] ${message}:`, error?.message || error, context)
}

const logInfo = (message, context) => {
  console.log(`[INFO] ${message}:`, context)
}

// Create the Supabase client exactly like the component does
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}

// Convert database review to legacy format for component compatibility
function convertToLegacyReview(dbReview) {
  // Map country codes to flag emojis
  const getFlag = (location) => {
    const flagMap = {
      'uk': '🇬🇧', 'united kingdom': '🇬🇧', 'london': '🇬🇧', 'england': '🇬🇧', 'scotland': '🇬🇧',
      'usa': '🇺🇸', 'united states': '🇺🇸', 'america': '🇺🇸', 'california': '🇺🇸', 'chicago': '🇺🇸',
      'australia': '🇦🇺', 'sydney': '🇦🇺', 'melbourne': '🇦🇺',
      'canada': '🇨🇦', 'toronto': '🇨🇦',
      'germany': '🇩🇪', 'berlin': '🇩🇪',
      'spain': '🇪🇸', 'madrid': '🇪🇸', 'barcelona': '🇪🇸'
    };
    
    const locationLower = location.toLowerCase();
    for (const [key, flag] of Object.entries(flagMap)) {
      if (locationLower.includes(key)) {
        return flag;
      }
    }
    return '🌍'; // Default world flag
  };

  // Format date to relative format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'Today';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 14) return `${Math.floor(diffDays / 7)} week ago`;
    if (diffDays <= 28) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays <= 60) return '1 month ago';
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return {
    id: dbReview.id,
    name: dbReview.author,
    location: dbReview.author_location,
    flag: getFlag(dbReview.author_location),
    date: formatDate(dbReview.review_date),
    rating: dbReview.rating,
    text: dbReview.content,
    countryCode: 'GB' // Default
  };
}

const getTourReviews = cache(async (
  tourSlug,
  locale = 'en',
  limit = 3
) => {
  const supabase = getSupabaseClient();
  
  try {
    console.log(`🔍 getTourReviews called: ${tourSlug}, ${locale}, limit=${limit}`)
    
    const { data, error } = await supabase
      .from('tour_reviews')
      .select('*')
      .eq('tour_slug', tourSlug)
      .eq('language', locale)
      .eq('verified', true)
      .order('helpful_count', { ascending: false })
      .order('review_date', { ascending: false })
      .limit(limit);

    console.log(`   Query result: ${data?.length || 0} reviews, error: ${error?.message || 'none'}`)

    if (error) {
      logError('Error fetching tour reviews from database', error, {
        component: 'TourReviewsDB',
        function: 'getTourReviews',
        tourSlug,
        locale,
        limit,
        action: 'fetch_reviews'
      });
      return [];
    }

    if (!data || data.length === 0) {
      logInfo('No reviews found for tour, falling back to default', {
        tourSlug,
        locale,
        action: 'no_reviews_found'
      });
      return [];
    }

    return data.map(convertToLegacyReview);
  } catch (error) {
    logError('Unexpected error fetching tour reviews', error, {
      component: 'TourReviewsDB',
      function: 'getTourReviews',
      tourSlug,
      locale,
      action: 'fetch_reviews_exception'
    });
    return [];
  }
});

// Get reviews with fallback to other languages if needed
const getTourReviewsWithFallback = cache(async (
  tourSlug,
  locale = 'en',
  limit = 3
) => {
  console.log(`\n🚀 getTourReviewsWithFallback called: ${tourSlug}, ${locale}, limit=${limit}`)
  
  // Try to get reviews in requested language first
  let reviews = await getTourReviews(tourSlug, locale, limit);
  console.log(`   Step 1 (${locale}): ${reviews.length} reviews`)
  
  // If we don't have enough reviews in the requested language, try English
  if (reviews.length < limit && locale !== 'en') {
    const englishReviews = await getTourReviews(tourSlug, 'en', limit - reviews.length);
    reviews = [...reviews, ...englishReviews];
    console.log(`   Step 2 (en): ${reviews.length} total reviews`)
  }
  
  // If still not enough reviews, try other languages to fill up
  if (reviews.length < limit) {
    const supabase = getSupabaseClient();
    
    try {
      console.log(`   Step 3: Trying other languages...`)
      const { data, error } = await supabase
        .from('tour_reviews')
        .select('*')
        .eq('tour_slug', tourSlug)
        .eq('verified', true)
        .not('language', 'in', `(${locale},en)`)
        .order('helpful_count', { ascending: false })
        .order('review_date', { ascending: false })
        .limit(limit - reviews.length);

      console.log(`   Step 3 result: ${data?.length || 0} additional reviews, error: ${error?.message || 'none'}`)

      if (!error && data) {
        const additionalReviews = data.map(convertToLegacyReview);
        reviews = [...reviews, ...additionalReviews];
      }
    } catch (error) {
      logError('Error fetching fallback reviews', error, {
        component: 'TourReviewsDB',
        function: 'getTourReviewsWithFallback',
        tourSlug,
        locale,
        action: 'fetch_fallback_reviews'
      });
    }
  }
  
  console.log(`   Final result: ${reviews.length} reviews returned`)
  return reviews.slice(0, limit);
});

async function testFunction() {
  console.log('🧪 Testing getTourReviewsWithFallback function...')
  
  try {
    // Test with the exact same parameters as the failing request
    const reviews = await getTourReviewsWithFallback('boulders-beach-penguin-colony', 'de', 50)
    
    console.log(`\n🎯 Final result: ${reviews.length} reviews`)
    
    if (reviews.length > 0) {
      console.log('\n📝 Sample reviews:')
      reviews.slice(0, 3).forEach((review, i) => {
        console.log(`   ${i+1}. ${review.name} - "${review.text.substring(0, 50)}..."`)
      })
      console.log('\n✅ Function is working correctly!')
    } else {
      console.log('\n❌ No reviews returned - this matches the "no_reviews_found" error')
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message)
  }
}

testFunction()