const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase credentials');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    console.log('🚀 Running Tour Reviews Migrations...');
    
    // Run migration 010
    console.log('📋 Running migration 010...');
    const migration010 = fs.readFileSync(path.join(__dirname, '../database/migrations/010_complete_tour_reviews_migration.sql'), 'utf8');
    const { error: error010 } = await supabase.rpc('execute_sql', { sql: migration010 });
    
    if (error010) {
      console.error('❌ Migration 010 failed:', error010);
      return;
    }
    console.log('✅ Migration 010 completed');
    
    // Run migration 011
    console.log('📋 Running migration 011...');
    const migration011 = fs.readFileSync(path.join(__dirname, '../database/migrations/011_remaining_tours_reviews.sql'), 'utf8');
    const { error: error011 } = await supabase.rpc('execute_sql', { sql: migration011 });
    
    if (error011) {
      console.error('❌ Migration 011 failed:', error011);
      return;
    }
    console.log('✅ Migration 011 completed');
    
    // Verify the data
    const { data: reviews, error: countError } = await supabase
      .from('tour_reviews')
      .select('tour_slug, language', { count: 'exact' })
      .limit(1);
      
    if (countError) {
      console.error('❌ Error checking reviews:', countError);
      return;
    }
    
    console.log('🎉 Migrations completed successfully!');
    console.log(`📊 Tour reviews are now available in the database`);
    
  } catch (error) {
    console.error('❌ Migration error:', error.message);
  }
}

runMigrations();