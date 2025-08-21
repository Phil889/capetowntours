-- Simple SQL to create tours table
-- Copy and paste this into Supabase SQL Editor

CREATE TABLE tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price INTEGER,
    price_from_zar INTEGER,
    category TEXT,
    duration_days INTEGER,
    image_url TEXT,
    title_tag TEXT,
    meta_description TEXT,
    h1 TEXT,
    hero_tagline TEXT,
    short_overview TEXT,
    itinerary TEXT,
    highlights TEXT,
    unique_selling_points TEXT,
    included TEXT,
    excluded TEXT,
    primary_keyword TEXT,
    secondary_keywords TEXT,
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

-- Enable public access
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON tours
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON tours
    FOR INSERT WITH CHECK (true);
