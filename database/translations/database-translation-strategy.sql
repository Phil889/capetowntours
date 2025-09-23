-- Database Translation Strategy for Cape Town Safari Tours
-- This file contains the complete strategy for translating all database content
-- into German (DE), French (FR), Spanish (ES), and Arabic (AR)

-- =====================================================
-- PHASE 1: VERIFY EXISTING DATA STRUCTURE
-- =====================================================

-- Check current tours data
SELECT id, title, description, location, duration, price 
FROM tours 
ORDER BY id;

-- Check current blog posts
SELECT id, title, content, excerpt, slug 
FROM blog_posts 
ORDER BY created_at DESC;

-- Check existing translations (should be empty initially)
SELECT table_name, record_id, locale, field_name 
FROM translations 
ORDER BY table_name, record_id, locale;

-- =====================================================
-- PHASE 2: TOURS TABLE TRANSLATION STRATEGY
-- =====================================================

-- Tours to translate (sample data from our migrations):
-- 1. Table Mountain Cable Car Tour
-- 2. Cape Point & Penguins Full Day Tour  
-- 3. Wine Tasting in Stellenbosch
-- 4. Robben Island Historical Tour
-- 5. Township Cultural Experience
-- 6. Shark Cage Diving Adventure
-- 7. Garden Route 3-Day Safari
-- 8. Hermanus Whale Watching

-- Translation fields needed for tours:
-- - title
-- - description  
-- - location
-- - highlights (JSON array)
-- - included (JSON array)
-- - not_included (JSON array)

-- =====================================================
-- PHASE 3: BLOG POSTS TRANSLATION STRATEGY
-- =====================================================

-- Blog posts to translate:
-- - All existing blog posts
-- - Title, content, excerpt, meta_description

-- Translation fields needed for blog posts:
-- - title
-- - content
-- - excerpt
-- - meta_description

-- =====================================================
-- PHASE 4: TRANSLATION EXECUTION PLAN
-- =====================================================

-- Step 1: Tours Translation
-- For each tour, we need to insert translations for each locale

-- Example for Tour ID 1 (Table Mountain Cable Car Tour):
/*
INSERT INTO translations (table_name, record_id, locale, field_name, translated_value) VALUES
-- German translations
('tours', 1, 'de', 'title', 'Tafelberg-Seilbahn Tour'),
('tours', 1, 'de', 'description', 'Erleben Sie atemberaubende Panoramablicke auf Kapstadt und die Umgebung mit der berühmten Tafelberg-Seilbahn. Diese ikonische Attraktion bietet eine unvergessliche Reise zum Gipfel des Tafelbergs.'),
('tours', 1, 'de', 'location', 'Tafelberg, Kapstadt'),

-- French translations  
('tours', 1, 'fr', 'title', 'Tour du Téléphérique de Table Mountain'),
('tours', 1, 'fr', 'description', 'Découvrez des vues panoramiques à couper le souffle sur Le Cap et ses environs avec le célèbre téléphérique de Table Mountain. Cette attraction emblématique offre un voyage inoubliable au sommet de Table Mountain.'),
('tours', 1, 'fr', 'location', 'Table Mountain, Le Cap'),

-- Spanish translations
('tours', 1, 'es', 'title', 'Tour del Teleférico de Table Mountain'),
('tours', 1, 'es', 'description', 'Experimenta vistas panorámicas impresionantes de Ciudad del Cabo y sus alrededores con el famoso teleférico de Table Mountain. Esta atracción icónica ofrece un viaje inolvidable a la cima de Table Mountain.'),
('tours', 1, 'es', 'location', 'Table Mountain, Ciudad del Cabo'),

-- Arabic translations
('tours', 1, 'ar', 'title', 'جولة التلفريك في جبل الطاولة'),
('tours', 1, 'ar', 'description', 'استمتع بإطلالات بانورامية خلابة على كيب تاون والمناطق المحيطة بها مع التلفريك الشهير في جبل الطاولة. تقدم هذه المعلم الأيقوني رحلة لا تُنسى إلى قمة جبل الطاولة.'),
('tours', 1, 'ar', 'location', 'جبل الطاولة، كيب تاون');
*/

-- =====================================================
-- PHASE 5: AUTOMATED TRANSLATION QUERIES
-- =====================================================

-- Query to get all tours that need translation
SELECT 
    id,
    title,
    description,
    location,
    highlights,
    included,
    not_included
FROM tours
WHERE id NOT IN (
    SELECT DISTINCT record_id 
    FROM translations 
    WHERE table_name = 'tours' 
    AND locale IN ('de', 'fr', 'es', 'ar')
);

-- Query to get all blog posts that need translation  
SELECT 
    id,
    title,
    content,
    excerpt,
    meta_description
FROM blog_posts
WHERE id NOT IN (
    SELECT DISTINCT record_id 
    FROM translations 
    WHERE table_name = 'blog_posts' 
    AND locale IN ('de', 'fr', 'es', 'ar')
);

-- =====================================================
-- PHASE 6: TRANSLATION VALIDATION QUERIES
-- =====================================================

-- Check translation coverage for tours
SELECT 
    t.id,
    t.title as original_title,
    COUNT(CASE WHEN tr.locale = 'de' THEN 1 END) as german_translations,
    COUNT(CASE WHEN tr.locale = 'fr' THEN 1 END) as french_translations,
    COUNT(CASE WHEN tr.locale = 'es' THEN 1 END) as spanish_translations,
    COUNT(CASE WHEN tr.locale = 'ar' THEN 1 END) as arabic_translations
FROM tours t
LEFT JOIN translations tr ON t.id = tr.record_id AND tr.table_name = 'tours'
GROUP BY t.id, t.title
ORDER BY t.id;

-- Check translation coverage for blog posts
SELECT 
    bp.id,
    bp.title as original_title,
    COUNT(CASE WHEN tr.locale = 'de' THEN 1 END) as german_translations,
    COUNT(CASE WHEN tr.locale = 'fr' THEN 1 END) as french_translations,
    COUNT(CASE WHEN tr.locale = 'es' THEN 1 END) as spanish_translations,
    COUNT(CASE WHEN tr.locale = 'ar' THEN 1 END) as arabic_translations
FROM blog_posts bp
LEFT JOIN translations tr ON bp.id = tr.record_id AND tr.table_name = 'blog_posts'
GROUP BY bp.id, bp.title
ORDER BY bp.created_at DESC;

-- =====================================================
-- PHASE 7: QUALITY ASSURANCE QUERIES
-- =====================================================

-- Find missing translations
SELECT 
    'tours' as table_name,
    t.id as record_id,
    t.title as original_title,
    l.locale
FROM tours t
CROSS JOIN (SELECT 'de' as locale UNION SELECT 'fr' UNION SELECT 'es' UNION SELECT 'ar') l
LEFT JOIN translations tr ON t.id = tr.record_id 
    AND tr.table_name = 'tours' 
    AND tr.locale = l.locale
    AND tr.field_name = 'title'
WHERE tr.id IS NULL

UNION ALL

SELECT 
    'blog_posts' as table_name,
    bp.id as record_id,
    bp.title as original_title,
    l.locale
FROM blog_posts bp
CROSS JOIN (SELECT 'de' as locale UNION SELECT 'fr' UNION SELECT 'es' UNION SELECT 'ar') l
LEFT JOIN translations tr ON bp.id = tr.record_id 
    AND tr.table_name = 'blog_posts' 
    AND tr.locale = l.locale
    AND tr.field_name = 'title'
WHERE tr.id IS NULL
ORDER BY table_name, record_id, locale;

-- =====================================================
-- PHASE 8: PERFORMANCE OPTIMIZATION
-- =====================================================

-- Create indexes for better translation query performance
CREATE INDEX IF NOT EXISTS idx_translations_lookup 
ON translations(table_name, record_id, locale, field_name);

CREATE INDEX IF NOT EXISTS idx_translations_locale 
ON translations(locale);

CREATE INDEX IF NOT EXISTS idx_translations_table_record 
ON translations(table_name, record_id);

-- =====================================================
-- PHASE 9: TRANSLATION MAINTENANCE
-- =====================================================

-- Function to check translation completeness
CREATE OR REPLACE FUNCTION check_translation_completeness()
RETURNS TABLE(
    table_name TEXT,
    record_id INTEGER,
    missing_locales TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    WITH required_locales AS (
        SELECT unnest(ARRAY['de', 'fr', 'es', 'ar']) as locale
    ),
    tour_translations AS (
        SELECT 
            'tours' as tbl_name,
            t.id as rec_id,
            array_agg(DISTINCT tr.locale) as existing_locales
        FROM tours t
        LEFT JOIN translations tr ON t.id = tr.record_id AND tr.table_name = 'tours'
        GROUP BY t.id
    ),
    blog_translations AS (
        SELECT 
            'blog_posts' as tbl_name,
            bp.id as rec_id,
            array_agg(DISTINCT tr.locale) as existing_locales
        FROM blog_posts bp
        LEFT JOIN translations tr ON bp.id = tr.record_id AND tr.table_name = 'blog_posts'
        GROUP BY bp.id
    )
    SELECT 
        tt.tbl_name::TEXT,
        tt.rec_id::INTEGER,
        array_agg(rl.locale) as missing_locales
    FROM (
        SELECT * FROM tour_translations
        UNION ALL
        SELECT * FROM blog_translations
    ) tt
    CROSS JOIN required_locales rl
    WHERE rl.locale != ALL(COALESCE(tt.existing_locales, ARRAY[]::TEXT[]))
    GROUP BY tt.tbl_name, tt.rec_id
    HAVING array_length(array_agg(rl.locale), 1) > 0;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- NOTES FOR MCP EXECUTION
-- =====================================================

/*
When the MCP server is working, use these steps:

1. First, verify the database connection and existing data
2. Use the Supabase MCP tools to execute translation queries
3. For each tour and blog post, generate translations using AI
4. Insert translations using the translations table structure
5. Validate translation completeness using the provided queries
6. Test the frontend to ensure translations are loading correctly

Key MCP commands to use:
- list_tables: Verify database structure
- execute_sql: Run translation queries
- apply_migration: If any schema changes are needed

Translation priorities:
1. Tours (highest priority - main product)
2. Blog posts (medium priority - SEO content)
3. Static content (handled by JSON files)
*/