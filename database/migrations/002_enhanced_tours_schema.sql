-- Enhanced Tours Table with structured JSON fields
-- Run this in Supabase SQL Editor after the initial tours table

-- First, add new columns to existing tours table
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS structured_itinerary JSONB,
ADD COLUMN IF NOT EXISTS structured_highlights JSONB,
ADD COLUMN IF NOT EXISTS structured_includes JSONB,
ADD COLUMN IF NOT EXISTS structured_excludes JSONB,
ADD COLUMN IF NOT EXISTS structured_faqs JSONB,
ADD COLUMN IF NOT EXISTS pricing_tiers JSONB,
ADD COLUMN IF NOT EXISTS images JSONB,
ADD COLUMN IF NOT EXISTS seo_data JSONB,
ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS template_id UUID,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Create tour_templates table
CREATE TABLE IF NOT EXISTS tour_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    template_data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0
);

-- Create tour_images table
CREATE TABLE IF NOT EXISTS tour_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    caption TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tour_versions table
CREATE TABLE IF NOT EXISTS tour_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    version_data JSONB NOT NULL,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    change_notes TEXT,
    UNIQUE(tour_id, version_number)
);

-- Create ai_generation_logs table
CREATE TABLE IF NOT EXISTS ai_generation_logs (
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
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS tours_status_idx ON tours(status);
CREATE INDEX IF NOT EXISTS tours_published_at_idx ON tours(published_at DESC);
CREATE INDEX IF NOT EXISTS tours_template_id_idx ON tours(template_id);
CREATE INDEX IF NOT EXISTS tour_images_tour_id_idx ON tour_images(tour_id);
CREATE INDEX IF NOT EXISTS tour_versions_tour_id_idx ON tour_versions(tour_id);
CREATE INDEX IF NOT EXISTS ai_generation_logs_tour_id_idx ON ai_generation_logs(tour_id);

-- Add triggers for version tracking
CREATE OR REPLACE FUNCTION create_tour_version()
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER tour_version_trigger
AFTER UPDATE ON tours
FOR EACH ROW
EXECUTE FUNCTION create_tour_version();

-- Add RLS policies
ALTER TABLE tour_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generation_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for published tours
CREATE POLICY "Public can view published tours" 
    ON tours FOR SELECT 
    USING (status = 'published');

-- Authenticated users can manage all tours
CREATE POLICY "Authenticated users can manage tours" 
    ON tours 
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Similar policies for other tables
CREATE POLICY "Authenticated users can manage templates" 
    ON tour_templates 
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Public can view tour images" 
    ON tour_images FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM tours 
        WHERE tours.id = tour_images.tour_id 
        AND tours.status = 'published'
    ));

CREATE POLICY "Authenticated users can manage tour images" 
    ON tour_images 
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Success message
SELECT 'Enhanced tours schema created successfully!' as message;
