#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://orogsbgpdvpzraujtekx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb2dzYmdwZHZwenJhdWp0ZWt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTU3NjcsImV4cCI6MjA3MDQ5MTc2N30.RHS6eIqS84ofiif6OujRrQ-NUxXdcObZsW40ES-gk0I',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function checkSchema() {
  try {
    // Try to get some sample records to understand the schema
    const { data, error } = await supabase
      .from('tour_reviews')
      .select('*')
      .limit(3);
    
    if (error) {
      console.error('Error querying tour_reviews:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('Sample records from tour_reviews:');
      console.log(JSON.stringify(data[0], null, 2));
      
      console.log('\nAll columns in the first record:');
      Object.keys(data[0]).forEach(key => {
        console.log(`- ${key}: ${typeof data[0][key]} (${data[0][key]})`);
      });
    } else {
      console.log('No records found in tour_reviews table');
    }
    
  } catch (error) {
    console.error('Critical error:', error);
  }
}

checkSchema();