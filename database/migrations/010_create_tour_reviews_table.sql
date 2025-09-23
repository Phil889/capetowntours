-- Migration: Create tour_reviews table for multi-language review management
-- This creates a comprehensive tour reviews system with full i18n support

-- =====================================================
-- CREATE TOUR REVIEWS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS tour_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_slug VARCHAR(255) NOT NULL,
    reviewer_name VARCHAR(255) NOT NULL,
    reviewer_location VARCHAR(255) NOT NULL,
    reviewer_flag VARCHAR(10) NOT NULL,
    reviewer_country_code VARCHAR(3),
    review_date VARCHAR(50) NOT NULL DEFAULT 'Recently',
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    locale VARCHAR(5) NOT NULL DEFAULT 'en',
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    CONSTRAINT tour_reviews_tour_locale_unique UNIQUE (tour_slug, reviewer_name, locale)
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_tour_reviews_tour_slug ON tour_reviews(tour_slug);
CREATE INDEX IF NOT EXISTS idx_tour_reviews_locale ON tour_reviews(locale);
CREATE INDEX IF NOT EXISTS idx_tour_reviews_tour_locale ON tour_reviews(tour_slug, locale);
CREATE INDEX IF NOT EXISTS idx_tour_reviews_featured ON tour_reviews(is_featured);
CREATE INDEX IF NOT EXISTS idx_tour_reviews_display_order ON tour_reviews(display_order);

-- Enable RLS (Row Level Security)
ALTER TABLE tour_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read tour reviews" ON tour_reviews
    FOR SELECT USING (true);

-- Create policies for authenticated users to manage reviews (admin)
CREATE POLICY "Authenticated users can manage tour reviews" ON tour_reviews
    FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- CREATE UPDATE TRIGGER FOR updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_tour_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tour_reviews_updated_at_trigger
    BEFORE UPDATE ON tour_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_tour_reviews_updated_at();

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE tour_reviews IS 'Multi-language tour reviews with i18n support';
COMMENT ON COLUMN tour_reviews.tour_slug IS 'URL slug identifier for the tour';
COMMENT ON COLUMN tour_reviews.reviewer_name IS 'Name of the person leaving the review';
COMMENT ON COLUMN tour_reviews.reviewer_location IS 'Location/city of the reviewer';
COMMENT ON COLUMN tour_reviews.reviewer_flag IS 'Country flag emoji for the reviewer';
COMMENT ON COLUMN tour_reviews.reviewer_country_code IS 'ISO country code for the reviewer';
COMMENT ON COLUMN tour_reviews.review_date IS 'Human-readable date string (e.g., "3 days ago")';
COMMENT ON COLUMN tour_reviews.rating IS 'Star rating from 1-5';
COMMENT ON COLUMN tour_reviews.review_text IS 'The actual review content';
COMMENT ON COLUMN tour_reviews.locale IS 'Language code (en, de, fr, es, ar)';
COMMENT ON COLUMN tour_reviews.is_featured IS 'Whether this review should be prominently displayed';
COMMENT ON COLUMN tour_reviews.display_order IS 'Order for displaying reviews (0 = first)';