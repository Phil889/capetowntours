#!/usr/bin/env python3
"""
Apply enhanced tour management schema to Supabase database.
Run this script to update your database with the new tour management features.
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Get Supabase credentials
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("Error: Missing Supabase credentials in .env.local")
    print("Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set")
    exit(1)

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def execute_migration(sql: str, description: str):
    """Execute a SQL migration with error handling."""
    try:
        print(f"Executing: {description}...")
        result = supabase.postgrest.rpc('exec', {'query': sql}).execute()
        print(f"✅ Success: {description}")
        return True
    except Exception as e:
        print(f"❌ Failed: {description}")
        print(f"   Error: {str(e)}")
        return False

# Migration steps
migrations = [
    # Step 1: Add status column
    ("""ALTER TABLE tours 
        ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' 
        CHECK (status IN ('draft', 'published', 'archived'))""",
     "Adding status column"),
    
    # Step 2: Add version tracking columns
    ("""ALTER TABLE tours 
        ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
        ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ""",
     "Adding version tracking columns"),
    
    # Step 3: Add structured content columns
    ("""ALTER TABLE tours 
        ADD COLUMN IF NOT EXISTS structured_itinerary JSONB,
        ADD COLUMN IF NOT EXISTS structured_highlights JSONB,
        ADD COLUMN IF NOT EXISTS structured_includes JSONB,
        ADD COLUMN IF NOT EXISTS structured_excludes JSONB,
        ADD COLUMN IF NOT EXISTS structured_faqs JSONB""",
     "Adding structured content columns"),
    
    # Step 4: Add additional feature columns
    ("""ALTER TABLE tours 
        ADD COLUMN IF NOT EXISTS pricing_tiers JSONB,
        ADD COLUMN IF NOT EXISTS images JSONB,
        ADD COLUMN IF NOT EXISTS seo_data JSONB,
        ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS template_id UUID""",
     "Adding feature columns"),
    
    # Step 5: Create tour_templates table
    ("""CREATE TABLE IF NOT EXISTS tour_templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        template_data JSONB NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        usage_count INTEGER DEFAULT 0
    )""",
     "Creating tour_templates table"),
    
    # Step 6: Create tour_images table
    ("""CREATE TABLE IF NOT EXISTS tour_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        alt_text TEXT,
        caption TEXT,
        is_primary BOOLEAN DEFAULT FALSE,
        order_index INTEGER DEFAULT 0,
        metadata JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
    )""",
     "Creating tour_images table"),
    
    # Step 7: Create tour_versions table
    ("""CREATE TABLE IF NOT EXISTS tour_versions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
        version_number INTEGER NOT NULL,
        version_data JSONB NOT NULL,
        created_by TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        change_notes TEXT,
        UNIQUE(tour_id, version_number)
    )""",
     "Creating tour_versions table"),
    
    # Step 8: Create ai_generation_logs table
    ("""CREATE TABLE IF NOT EXISTS ai_generation_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tour_id UUID REFERENCES tours(id) ON DELETE SET NULL,
        template_id UUID REFERENCES tour_templates(id) ON DELETE SET NULL,
        prompt TEXT NOT NULL,
        response JSONB,
        model TEXT,
        tokens_used INTEGER,
        generation_type TEXT CHECK (generation_type IN ('full_tour', 'description', 'itinerary', 'faqs', 'enhancement')),
        status TEXT CHECK (status IN ('pending', 'success', 'failed')),
        error_message TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
    )""",
     "Creating ai_generation_logs table"),
    
    # Step 9: Create indexes
    ("""CREATE INDEX IF NOT EXISTS tours_status_idx ON tours(status);
        CREATE INDEX IF NOT EXISTS tours_published_at_idx ON tours(published_at DESC);
        CREATE INDEX IF NOT EXISTS tours_template_id_idx ON tours(template_id);
        CREATE INDEX IF NOT EXISTS tour_images_tour_id_idx ON tour_images(tour_id);
        CREATE INDEX IF NOT EXISTS tour_versions_tour_id_idx ON tour_versions(tour_id);
        CREATE INDEX IF NOT EXISTS ai_generation_logs_tour_id_idx ON ai_generation_logs(tour_id)""",
     "Creating indexes"),
    
    # Step 10: Create version tracking function
    ("""CREATE OR REPLACE FUNCTION create_tour_version()
        RETURNS TRIGGER AS $$
        BEGIN
            IF TG_OP = 'UPDATE' AND OLD.version != NEW.version THEN
                INSERT INTO tour_versions (tour_id, version_number, version_data, created_by)
                VALUES (
                    NEW.id,
                    NEW.version,
                    to_jsonb(NEW),
                    current_user
                );
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql""",
     "Creating version tracking function"),
    
    # Step 11: Create version trigger
    ("""CREATE TRIGGER tour_version_trigger
        AFTER UPDATE ON tours
        FOR EACH ROW
        EXECUTE FUNCTION create_tour_version()""",
     "Creating version trigger"),
    
    # Step 12: Enable RLS on new tables
    ("""ALTER TABLE tour_templates ENABLE ROW LEVEL SECURITY;
        ALTER TABLE tour_images ENABLE ROW LEVEL SECURITY;
        ALTER TABLE tour_versions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE ai_generation_logs ENABLE ROW LEVEL SECURITY""",
     "Enabling Row Level Security"),
    
    # Step 13: Create RLS policies
    ("""CREATE POLICY "Public can view published tours" 
        ON tours FOR SELECT 
        USING (status = 'published')""",
     "Creating public tours policy"),
    
    ("""CREATE POLICY "Authenticated users can manage tours" 
        ON tours 
        USING (auth.role() = 'authenticated')
        WITH CHECK (auth.role() = 'authenticated')""",
     "Creating authenticated tours policy"),
    
    ("""CREATE POLICY "Authenticated users can manage templates" 
        ON tour_templates 
        USING (auth.role() = 'authenticated')
        WITH CHECK (auth.role() = 'authenticated')""",
     "Creating templates policy"),
    
    ("""CREATE POLICY "Public can view tour images" 
        ON tour_images FOR SELECT 
        USING (EXISTS (
            SELECT 1 FROM tours 
            WHERE tours.id = tour_images.tour_id 
            AND tours.status = 'published'
        ))""",
     "Creating public images policy"),
    
    ("""CREATE POLICY "Authenticated users can manage tour images" 
        ON tour_images 
        USING (auth.role() = 'authenticated')
        WITH CHECK (auth.role() = 'authenticated')""",
     "Creating authenticated images policy"),
]

def main():
    print("=" * 60)
    print("Tour Management Schema Migration")
    print("=" * 60)
    print()
    
    # Note: Supabase doesn't support direct SQL execution via the Python client
    # We need to use the SQL editor in Supabase Dashboard
    
    print("⚠️  IMPORTANT: The Supabase Python client doesn't support direct SQL execution.")
    print("Please copy the following SQL and run it in your Supabase SQL Editor:")
    print()
    print("=" * 60)
    print()
    
    # Read and print the SQL file
    with open('database/migrations/002_enhanced_tours_schema.sql', 'r') as f:
        sql_content = f.read()
        print(sql_content)
    
    print()
    print("=" * 60)
    print()
    print("Steps to apply the migration:")
    print("1. Go to your Supabase Dashboard")
    print("2. Navigate to SQL Editor")
    print("3. Create a new query")
    print("4. Copy and paste the SQL above")
    print("5. Click 'Run' to execute")
    print()
    print("After running the migration, your database will have:")
    print("✅ Enhanced tours table with structured JSON fields")
    print("✅ Tour templates table for reusable templates")
    print("✅ Tour images table for image management")
    print("✅ Tour versions table for version tracking")
    print("✅ AI generation logs table")
    print("✅ Row Level Security policies")
    print("✅ Automatic version tracking triggers")

if __name__ == "__main__":
    main()
