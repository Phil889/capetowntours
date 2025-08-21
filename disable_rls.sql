-- Run this in Supabase SQL Editor to temporarily disable RLS for importing tours

-- Disable RLS on tours table
ALTER TABLE tours DISABLE ROW LEVEL SECURITY;

-- After running this, you can import your tours
-- Then re-enable RLS with: ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
