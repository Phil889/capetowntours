-- Create tours table for Cape Town Safari Tours
-- Run this in Supabase SQL Editor after project setup

CREATE TABLE IF NOT EXISTS tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Core fields
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price INTEGER,
    price_from_zar INTEGER,
    category TEXT,
    duration_days INTEGER,
    image_url TEXT,
    
    -- SEO fields
    title_tag TEXT,
    meta_description TEXT,
    h1 TEXT,
    hero_tagline TEXT,
    short_overview TEXT,
    
    -- Content fields
    itinerary TEXT,
    highlights TEXT,
    unique_selling_points TEXT,
    included TEXT,
    excluded TEXT,
    
    -- Keywords
    primary_keyword TEXT,
    secondary_keywords TEXT,
    
    -- Additional info
    faqs TEXT,
    image_alt_text TEXT,
    cancellation_policy TEXT,
    seasonal_notes TEXT,
    child_policy TEXT,
    accessibility TEXT,
    group_size_max TEXT,
    duration TEXT,
    departure_time TEXT,
    pickup TEXT,
    map_embed TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS tours_slug_idx ON tours(slug);
CREATE INDEX IF NOT EXISTS tours_category_idx ON tours(category);
CREATE INDEX IF NOT EXISTS tours_created_at_idx ON tours(created_at DESC);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access
CREATE POLICY "Tours are viewable by everyone" 
    ON tours FOR SELECT 
    USING (true);

-- Create a policy to allow authenticated users to insert/update (for admin)
CREATE POLICY "Authenticated users can modify tours" 
    ON tours 
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Add a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tours_updated_at 
    BEFORE UPDATE ON tours 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Tours table created successfully!' as message;
