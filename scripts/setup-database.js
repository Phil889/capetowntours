#!/usr/bin/env node

/**
 * Database Setup Script
 * 
 * This script sets up the i18n database schema for the Cape Town Safari Tours
 * internationalization system.
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
  console.error('\nPlease check your .env.local file.')
  process.exit(1)
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// SQL for creating the i18n tables
const createTablesSQL = `
-- Create locales table
CREATE TABLE IF NOT EXISTS locales (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    native_name TEXT NOT NULL,
    direction TEXT DEFAULT 'ltr' CHECK (direction IN ('ltr', 'rtl')),
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id INTEGER NOT NULL,
    locale TEXT NOT NULL REFERENCES locales(code) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    translated_value TEXT NOT NULL,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'approved', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(table_name, record_id, locale, field_name)
);

-- Insert default locales
INSERT INTO locales (code, name, native_name, direction) VALUES
    ('en', 'English', 'English', 'ltr'),
    ('de', 'German', 'Deutsch', 'ltr'),
    ('fr', 'French', 'Français', 'ltr'),
    ('es', 'Spanish', 'Español', 'ltr'),
    ('ar', 'Arabic', 'العربية', 'rtl')
ON CONFLICT (code) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_translations_lookup ON translations(table_name, record_id, locale, field_name);
CREATE INDEX IF NOT EXISTS idx_translations_locale ON translations(locale);
CREATE INDEX IF NOT EXISTS idx_translations_table_record ON translations(table_name, record_id);

-- Create blog_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    meta_description TEXT,
    featured_image TEXT,
    author_id UUID,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample blog posts if they don't exist
INSERT INTO blog_posts (title, slug, content, excerpt, meta_description) VALUES
    (
        'Top 10 Must-Visit Attractions in Cape Town',
        'top-10-attractions-cape-town',
        'Cape Town is one of the world''s most beautiful cities, offering a perfect blend of natural wonders, rich history, and vibrant culture. From the iconic Table Mountain to the charming penguins at Boulders Beach, here are the top 10 attractions you absolutely cannot miss when visiting the Mother City.',
        'Discover the best attractions that make Cape Town one of the world''s most popular destinations.',
        'Discover the top 10 must-visit attractions in Cape Town, from Table Mountain Cable Car to Boulders Beach penguins. Your ultimate Cape Town travel guide.'
    ),
    (
        'Best Time to Visit Cape Town',
        'best-time-visit-cape-town',
        'Planning your trip to Cape Town? Understanding the city''s seasons and weather patterns is crucial for making the most of your visit. Cape Town enjoys a Mediterranean climate with warm, dry summers and mild, wet winters.',
        'Plan your Cape Town trip with our comprehensive guide to weather, seasons, and special events.',
        'Discover the best time to visit Cape Town. Comprehensive guide to weather, seasons, and activities for your perfect South Africa trip.'
    )
ON CONFLICT (slug) DO NOTHING;
`

async function setupDatabase() {
  console.log('🚀 Setting up i18n database schema...\n')

  try {
    // Test database connection
    console.log('🔍 Testing database connection...')
    const { data: testData, error: testError } = await supabase
      .from('tours')
      .select('id, title')
      .limit(1)

    if (testError) {
      throw new Error(`Database connection failed: ${testError.message}`)
    }

    console.log('✅ Database connection successful')
    console.log(`📊 Found ${testData?.length || 0} tours in database\n`)

    // Execute the schema creation SQL
    console.log('📝 Creating i18n tables and inserting sample data...')
    
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: createTablesSQL 
    })

    if (error) {
      // If the RPC function doesn't exist, try direct SQL execution
      console.log('⚠️  RPC function not available, trying direct execution...')
      
      // Split the SQL into individual statements and execute them
      const statements = createTablesSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0)

      for (const statement of statements) {
        try {
          const { error: stmtError } = await supabase
            .from('_temp_sql_execution')
            .select('*')
            .limit(0) // This will fail but we can catch it

          // Since direct SQL execution isn't available through the client,
          // let's create the tables using the client methods
          console.log('⚠️  Direct SQL execution not available. Please run the migrations manually.')
          console.log('\nTo set up the database manually:')
          console.log('1. Go to your Supabase dashboard')
          console.log('2. Navigate to SQL Editor')
          console.log('3. Run the following SQL:')
          console.log('\n' + createTablesSQL)
          
          return
        } catch (e) {
          // Expected to fail
        }
      }
    } else {
      console.log('✅ Database schema created successfully')
    }

    // Verify tables were created
    console.log('\n🔍 Verifying table creation...')
    
    try {
      const { data: localesData, error: localesError } = await supabase
        .from('locales')
        .select('code, name')
        .limit(5)

      if (localesError) {
        console.log('❌ Locales table not found - manual setup required')
      } else {
        console.log('✅ Locales table created successfully')
        console.log(`📊 Found ${localesData?.length || 0} locales:`, localesData?.map(l => l.code).join(', '))
      }

      const { data: translationsData, error: translationsError } = await supabase
        .from('translations')
        .select('id')
        .limit(1)

      if (translationsError) {
        console.log('❌ Translations table not found - manual setup required')
      } else {
        console.log('✅ Translations table created successfully')
      }

      const { data: blogData, error: blogError } = await supabase
        .from('blog_posts')
        .select('id, title')
        .limit(5)

      if (blogError) {
        console.log('❌ Blog posts table not found - manual setup required')
      } else {
        console.log('✅ Blog posts table verified')
        console.log(`📊 Found ${blogData?.length || 0} blog posts`)
      }

    } catch (verifyError) {
      console.log('⚠️  Could not verify table creation automatically')
    }

    console.log('\n🎉 Database setup completed!')
    console.log('\nNext steps:')
    console.log('1. If tables were not created automatically, run the SQL manually in Supabase dashboard')
    console.log('2. Run: npm run translate')
    console.log('3. Test the application: npm run dev')

  } catch (error) {
    console.error('💥 Fatal error during database setup:', error.message)
    
    console.log('\n📋 Manual Setup Instructions:')
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Create a new query and paste the following SQL:')
    console.log('\n' + createTablesSQL)
    console.log('\n4. Execute the query')
    console.log('5. Run: npm run translate')
    
    process.exit(1)
  }
}

// Run the script
setupDatabase()