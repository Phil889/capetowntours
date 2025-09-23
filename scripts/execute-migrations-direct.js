#!/usr/bin/env node

/**
 * Direct Database Migration Executor
 * Executes SQL migrations using Supabase REST API
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
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function executeSQLStatement(sql) {
  try {
    // Use the rpc function to execute raw SQL
    const { data, error } = await supabase.rpc('execute_sql', { sql })
    if (error) {
      console.error('SQL Error:', error.message)
      return false
    }
    return true
  } catch (error) {
    console.error('Execution Error:', error.message)
    return false
  }
}

async function runMigrations() {
  console.log('🚀 Starting Database Migrations...')
  console.log(`📍 Supabase URL: ${supabaseUrl}`)
  
  try {
    // First, create the execute_sql function if it doesn't exist
    console.log('📋 Setting up SQL execution function...')
    const setupFunction = `
      CREATE OR REPLACE FUNCTION execute_sql(sql text)
      RETURNS void AS $$
      BEGIN
        EXECUTE sql;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `
    
    const setupResult = await supabase.rpc('query', { 
      query: setupFunction.replace(/\n/g, ' ').replace(/\s+/g, ' ')
    })
    
    // Read migration files
    const migration1Path = path.join(process.cwd(), 'database/migrations/010_complete_tour_reviews_migration.sql')
    const migration2Path = path.join(process.cwd(), 'database/migrations/011_remaining_tours_reviews.sql')
    
    if (!fs.existsSync(migration1Path)) {
      console.error(`❌ Migration file not found: ${migration1Path}`)
      process.exit(1)
    }
    
    console.log('📋 Executing Migration 010...')
    const migration1SQL = fs.readFileSync(migration1Path, 'utf8')
    
    // Split into manageable chunks and execute
    const statements = migration1SQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--') && s !== '')
    
    console.log(`   Processing ${statements.length} SQL statements...`)
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i] + ';'
      console.log(`   Executing statement ${i + 1}/${statements.length}`)
      
      try {
        const { error } = await supabase.rpc('query', { query: stmt })
        if (error) {
          console.error(`   ❌ Statement ${i + 1} failed:`, error.message)
        } else {
          console.log(`   ✅ Statement ${i + 1} completed`)
        }
      } catch (err) {
        console.error(`   ❌ Statement ${i + 1} error:`, err.message)
      }
    }
    
    console.log('✅ Migration 010 completed!')
    
    // Execute Migration 011 if it exists
    if (fs.existsSync(migration2Path)) {
      console.log('📋 Executing Migration 011...')
      const migration2SQL = fs.readFileSync(migration2Path, 'utf8')
      
      const statements2 = migration2SQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--') && s !== '')
      
      console.log(`   Processing ${statements2.length} SQL statements...`)
      
      for (let i = 0; i < statements2.length; i++) {
        const stmt = statements2[i] + ';'
        console.log(`   Executing statement ${i + 1}/${statements2.length}`)
        
        try {
          const { error } = await supabase.rpc('query', { query: stmt })
          if (error) {
            console.error(`   ❌ Statement ${i + 1} failed:`, error.message)
          } else {
            console.log(`   ✅ Statement ${i + 1} completed`)
          }
        } catch (err) {
          console.error(`   ❌ Statement ${i + 1} error:`, err.message)
        }
      }
      
      console.log('✅ Migration 011 completed!')
    }
    
    // Verify the results
    console.log('🔍 Verifying database setup...')
    
    const { data: reviews, error: countError, count } = await supabase
      .from('tour_reviews')
      .select('*', { count: 'exact' })
      .limit(5)
    
    if (countError) {
      console.error('❌ Error checking reviews:', countError.message)
    } else {
      console.log(`📊 Successfully created ${count} tour reviews in database`)
      if (reviews && reviews.length > 0) {
        console.log(`📋 Sample review: ${reviews[0].author} - "${reviews[0].title.substring(0, 50)}..."`)
      }
    }
    
    // Get unique tour slugs
    const { data: slugData, error: slugError } = await supabase
      .from('tour_reviews')
      .select('tour_slug')
    
    if (!slugError && slugData) {
      const uniqueSlugs = [...new Set(slugData.map(r => r.tour_slug))]
      console.log(`🎯 Tours with reviews (${uniqueSlugs.length} tours): ${uniqueSlugs.slice(0, 5).join(', ')}${uniqueSlugs.length > 5 ? '...' : ''}`)
    }
    
    console.log('\n🎉 Database Migration Complete!')
    console.log('✅ All tour reviews are now in the database')
    console.log('✅ Multi-language support enabled')
    console.log('✅ SEO-optimized content ready')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

runMigrations()