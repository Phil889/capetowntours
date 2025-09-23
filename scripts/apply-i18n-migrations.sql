-- Apply internationalization migrations to Supabase
-- Run this in your Supabase SQL editor

-- First migration: Create i18n tables
\i database/migrations/001_create_i18n_tables.sql

-- Second migration: Create indexes and policies  
\i database/migrations/002_create_indexes_and_policies.sql

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'locales', 
  'tour_translations', 
  'blog_posts', 
  'blog_categories', 
  'blog_comments', 
  'static_translations',
  'translation_jobs'
);

-- Check if locales were inserted
SELECT * FROM locales ORDER BY sort_order;

-- Check if blog categories were created
SELECT locale, name FROM blog_categories ORDER BY locale, sort_order;