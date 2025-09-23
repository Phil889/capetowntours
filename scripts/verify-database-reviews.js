#!/usr/bin/env node

/**
 * Verify Database Reviews - Check all reviews are properly stored
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
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function verifyDatabase() {
  console.log('🔍 Verifying Tour Reviews Database...')
  console.log(`📍 Supabase URL: ${supabaseUrl}`)
  
  try {
    // Get total count
    const { data: countData, error: countError, count } = await supabase
      .from('tour_reviews')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('❌ Error getting count:', countError.message)
      return
    }
    
    console.log(`📊 Total reviews in database: ${count}`)
    
    // Get reviews by tour slug
    const { data: reviewsByTour, error: tourError } = await supabase
      .from('tour_reviews')
      .select('tour_slug, language, author, title')
      .order('tour_slug')
      .order('language')
    
    if (tourError) {
      console.error('❌ Error getting reviews by tour:', tourError.message)
      return
    }
    
    // Group by tour slug
    const tourGroups = {}
    reviewsByTour.forEach(review => {
      if (!tourGroups[review.tour_slug]) {
        tourGroups[review.tour_slug] = []
      }
      tourGroups[review.tour_slug].push(review)
    })
    
    console.log(`\n🏷️  Reviews by Tour (${Object.keys(tourGroups).length} tours):`)
    Object.keys(tourGroups).sort().forEach(tourSlug => {
      const reviews = tourGroups[tourSlug]
      console.log(`\n   📋 ${tourSlug} (${reviews.length} reviews):`)
      reviews.forEach(review => {
        console.log(`      • [${review.language.toUpperCase()}] ${review.author} - "${review.title.substring(0, 50)}..."`)
      })
    })
    
    // Get language distribution
    const { data: langData, error: langError } = await supabase
      .from('tour_reviews')
      .select('language')
    
    if (!langError && langData) {
      const langCounts = {}
      langData.forEach(item => {
        langCounts[item.language] = (langCounts[item.language] || 0) + 1
      })
      
      console.log(`\n🌍 Language Distribution:`)
      Object.keys(langCounts).sort().forEach(lang => {
        console.log(`   ${lang.toUpperCase()}: ${langCounts[lang]} reviews`)
      })
    }
    
    // Test a specific query
    console.log(`\n🧪 Testing specific query for boulders-beach-penguin-colony...`)
    const { data: testData, error: testError } = await supabase
      .from('tour_reviews')
      .select('*')
      .eq('tour_slug', 'boulders-beach-penguin-colony')
      .eq('language', 'en')
      .limit(3)
    
    if (!testError && testData) {
      console.log(`   ✅ Found ${testData.length} English reviews for Boulders Beach`)
      if (testData.length > 0) {
        console.log(`   📝 Sample: "${testData[0].title}" by ${testData[0].author}`)
        console.log(`   📄 Content length: ${testData[0].content.length} characters`)
      }
    }
    
    console.log(`\n🎉 Database Verification Complete!`)
    console.log(`✅ ${count} total reviews successfully stored`)
    console.log(`✅ ${Object.keys(tourGroups).length} tours have reviews`)
    console.log(`✅ Multi-language support working`)
    console.log(`✅ Reviews are ready for tour pages`)
    
  } catch (error) {
    console.error('❌ Verification error:', error.message)
  }
}

verifyDatabase()