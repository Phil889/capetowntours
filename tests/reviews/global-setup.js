// Global setup for tour reviews tests
module.exports = async () => {
  console.log('🚀 Setting up Tour Reviews Test Environment...\n');
  
  // Set environment variables for testing
  process.env.NODE_ENV = 'test';
  process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://test.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test-anon-key';
  
  // Create reports directory if it doesn't exist
  const fs = require('fs');
  const path = require('path');
  
  const reportsDir = path.join(__dirname, 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  console.log('✅ Test environment setup complete\n');
};