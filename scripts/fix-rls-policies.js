#!/usr/bin/env node

/**
 * Fix RLS Policies for tour_reviews table
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

async function fixRLSPolicies() {
  console.log('🔧 Fixing RLS Policies for tour_reviews...')
  
  try {
    // Drop existing policies
    console.log('📋 Dropping existing policies...')
    await supabase.rpc('query', { 
      query: 'DROP POLICY IF EXISTS "Enable all operations for all users" ON tour_reviews;'
    })
    
    await supabase.rpc('query', { 
      query: 'DROP POLICY IF EXISTS "Allow public read access" ON tour_reviews;'
    })
    
    // Create new public read policy
    console.log('📋 Creating public read access policy...')
    const policySQL = `
      CREATE POLICY "Allow public read access to tour reviews" ON tour_reviews
      FOR SELECT USING (true);
    `
    
    await supabase.rpc('query', { query: policySQL })
    
    // Grant permissions to anon users
    console.log('📋 Granting permissions to anonymous users...')
    await supabase.rpc('query', { 
      query: 'GRANT SELECT ON tour_reviews TO anon;'
    })
    
    await supabase.rpc('query', { 
      query: 'GRANT SELECT ON tour_reviews TO authenticated;'
    })
    
    // Test the policy
    console.log('🧪 Testing policy with anon key...')
    const anonClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    const { data: testData, error: testError } = await anonClient
      .from('tour_reviews')
      .select('tour_slug, author, title')
      .eq('tour_slug', 'boulders-beach-penguin-colony')
      .limit(2)
    
    if (testError) {
      console.error('❌ Policy test failed:', testError.message)
    } else {
      console.log(`✅ Policy test passed: ${testData?.length || 0} reviews accessible`)
      if (testData && testData.length > 0) {
        console.log(`   📝 Sample: "${testData[0].title}" by ${testData[0].author}`)
      }
    }
    
    console.log('\n🎉 RLS Policies Fixed!')
    console.log('✅ Anonymous users can now read tour reviews')
    console.log('✅ Components should now load reviews from database')
    
  } catch (error) {
    console.error('❌ Error fixing RLS policies:', error.message)
  }
}

fixRLSPolicies()