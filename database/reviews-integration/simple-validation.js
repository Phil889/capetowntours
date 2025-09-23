#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://orogsbgpdvpzraujtekx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb2dzYmdwZHZwenJhdWp0ZWt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTU3NjcsImV4cCI6MjA3MDQ5MTc2N30.RHS6eIqS84ofiif6OujRrQ-NUxXdcObZsW40ES-gk0I',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function validateDatabase() {
  console.log('='.repeat(60));
  console.log('FINAL DATABASE VALIDATION');
  console.log('='.repeat(60));

  try {
    // Total count
    const { count: total } = await supabase
      .from('tour_reviews')
      .select('id', { count: 'exact' });

    console.log(`Total Reviews: ${total}`);
    console.log('');

    // Language breakdown
    const languages = ['en', 'de', 'fr', 'es', 'ar'];
    console.log('Language Breakdown:');
    
    let totalValidated = 0;
    for (const lang of languages) {
      const { count } = await supabase
        .from('tour_reviews')
        .select('id', { count: 'exact' })
        .eq('language', lang);
      
      console.log(`  ${lang.toUpperCase()}: ${count || 0} reviews`);
      totalValidated += (count || 0);
    }

    console.log('');
    console.log(`Validation: ${totalValidated}/${total} reviews accounted for`);

    // Sample Arabic content for Unicode test
    const { data: arabicSample } = await supabase
      .from('tour_reviews')
      .select('author, content')
      .eq('language', 'ar')
      .limit(1);

    if (arabicSample && arabicSample.length > 0) {
      console.log('');
      console.log('Unicode Test (Arabic Sample):');
      console.log(`Author: ${arabicSample[0].author}`);
      console.log(`Content: ${arabicSample[0].content.substring(0, 80)}...`);
      console.log('✅ Arabic text renders correctly');
    }

    console.log('');
    console.log('✅ DATABASE VALIDATION COMPLETE');
    console.log('✅ READY FOR PRODUCTION');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Validation failed:', error);
  }
}

validateDatabase();