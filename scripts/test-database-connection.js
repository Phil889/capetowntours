#!/usr/bin/env node

/**
 * Test Database Connection - Debug review loading issues
 */

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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🧪 Testing Database Connection...')
console.log(`📍 Supabase URL: ${supabaseUrl}`)
console.log(`🔑 Using Anon Key: ${supabaseAnonKey ? 'Yes' : 'No'}`)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    // Test 1: Simple query with German locale (same as failing request)
    console.log('\n🔍 Test 1: Query for German reviews (boulders-beach-penguin-colony)...')
    const { data: germanReviews, error: germanError } = await supabase
      .from('tour_reviews')
      .select('*')
      .eq('tour_slug', 'boulders-beach-penguin-colony')
      .eq('language', 'de')
      .eq('verified', true)
      .limit(3)
    
    if (germanError) {
      console.error('❌ German query error:', germanError.message)
    } else {
      console.log(`✅ German reviews found: ${germanReviews?.length || 0}`)
    }
    
    // Test 2: Fallback to English
    console.log('\n🔍 Test 2: Fallback to English reviews...')
    const { data: englishReviews, error: englishError } = await supabase
      .from('tour_reviews')
      .select('*')
      .eq('tour_slug', 'boulders-beach-penguin-colony')
      .eq('language', 'en')
      .eq('verified', true)
      .limit(3)
    
    if (englishError) {
      console.error('❌ English query error:', englishError.message)
    } else {
      console.log(`✅ English reviews found: ${englishReviews?.length || 0}`)
      if (englishReviews && englishReviews.length > 0) {
        console.log(`   📝 Sample: "${englishReviews[0].title}" by ${englishReviews[0].author}`)
      }
    }
    
    // Test 3: Any language fallback
    console.log('\n🔍 Test 3: Any language reviews...')
    const { data: anyReviews, error: anyError } = await supabase
      .from('tour_reviews')
      .select('*')
      .eq('tour_slug', 'boulders-beach-penguin-colony')
      .eq('verified', true)
      .limit(5)
    
    if (anyError) {
      console.error('❌ Any language query error:', anyError.message)
    } else {
      console.log(`✅ Total reviews found: ${anyReviews?.length || 0}`)
      if (anyReviews) {
        anyReviews.forEach((review, i) => {
          console.log(`   ${i+1}. [${review.language.toUpperCase()}] ${review.author} - "${review.title.substring(0, 40)}..."`)
        })
      }
    }
    
    // Test 4: Test the exact same query the component would make
    console.log('\n🔍 Test 4: Component-style query with getTourReviewsWithFallback logic...')
    
    // Step 1: Try German first
    let reviews = []
    const { data: step1Data, error: step1Error } = await supabase
      .from('tour_reviews')
      .select('*')
      .eq('tour_slug', 'boulders-beach-penguin-colony')
      .eq('language', 'de')
      .eq('verified', true)
      .order('helpful_count', { ascending: false })
      .order('review_date', { ascending: false })
      .limit(50)
    
    if (!step1Error && step1Data) {
      reviews = [...reviews, ...step1Data]
    }
    console.log(`   Step 1 (German): ${reviews.length} reviews`)
    
    // Step 2: If not enough, try English
    if (reviews.length < 50) {
      const { data: step2Data, error: step2Error } = await supabase
        .from('tour_reviews')
        .select('*')
        .eq('tour_slug', 'boulders-beach-penguin-colony')
        .eq('language', 'en')
        .eq('verified', true)
        .order('helpful_count', { ascending: false })
        .order('review_date', { ascending: false })
        .limit(50 - reviews.length)
      
      if (!step2Error && step2Data) {
        reviews = [...reviews, ...step2Data]
      }
      console.log(`   Step 2 (English): ${reviews.length} total reviews`)
    }
    
    // Step 3: Try other languages
    if (reviews.length < 50) {
      const { data: step3Data, error: step3Error } = await supabase
        .from('tour_reviews')
        .select('*')
        .eq('tour_slug', 'boulders-beach-penguin-colony')
        .eq('verified', true)
        .not('language', 'in', '(de,en)')
        .order('helpful_count', { ascending: false })
        .order('review_date', { ascending: false })
        .limit(50 - reviews.length)
      
      if (!step3Error && step3Data) {
        reviews = [...reviews, ...step3Data]
      }
      console.log(`   Step 3 (Other): ${reviews.length} total reviews`)
    }
    
    console.log(`\n🎯 Final result: ${reviews.length} reviews would be returned`)
    
    if (reviews.length === 0) {
      console.log('❌ This matches the "no_reviews_found" error from the logs!')
      console.log('🔧 The component should fall back to static reviews in this case.')
    } else {
      console.log('✅ Reviews found - component should load them from database')
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message)
  }
}

testConnection()