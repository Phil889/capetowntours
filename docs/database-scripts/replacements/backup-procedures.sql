-- =====================================================
-- GUEST REVIEWS BACKUP PROCEDURES
-- =====================================================
-- This script creates backup tables and procedures for safe review replacement
-- Run this BEFORE any replacement operations

-- Create timestamp for backup identification
DO $$ 
DECLARE 
    backup_timestamp TEXT := to_char(now(), 'YYYY_MM_DD_HH24_MI_SS');
BEGIN
    RAISE NOTICE 'Creating backup with timestamp: %', backup_timestamp;
    
    -- Create backup table with timestamp
    EXECUTE format('CREATE TABLE guest_reviews_backup_%s AS SELECT * FROM guest_reviews', backup_timestamp);
    
    -- Create backup of static translations
    EXECUTE format('CREATE TABLE static_translations_backup_%s AS SELECT * FROM static_translations', backup_timestamp);
    
    -- Log backup creation
    RAISE NOTICE 'Backup tables created successfully:';
    RAISE NOTICE '- guest_reviews_backup_%s', backup_timestamp;
    RAISE NOTICE '- static_translations_backup_%s', backup_timestamp;
END $$;

-- Create rollback function for emergencies
CREATE OR REPLACE FUNCTION rollback_guest_reviews(backup_suffix TEXT)
RETURNS VOID AS $$
DECLARE
    backup_table_name TEXT := 'guest_reviews_backup_' || backup_suffix;
BEGIN
    -- Check if backup table exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
                   WHERE table_name = backup_table_name) THEN
        RAISE EXCEPTION 'Backup table % does not exist', backup_table_name;
    END IF;
    
    -- Truncate current table and restore from backup
    TRUNCATE guest_reviews;
    EXECUTE format('INSERT INTO guest_reviews SELECT * FROM %s', backup_table_name);
    
    RAISE NOTICE 'Successfully rolled back guest_reviews from backup: %', backup_table_name;
END;
$$ LANGUAGE plpgsql;

-- Create verification function
CREATE OR REPLACE FUNCTION verify_review_integrity()
RETURNS TABLE(
    language_code TEXT,
    tour_count BIGINT,
    total_reviews BIGINT,
    avg_rating NUMERIC,
    has_duplicates BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    WITH duplicate_check AS (
        SELECT 
            gr.language,
            COUNT(*) as total,
            COUNT(DISTINCT gr.review_text) as unique_reviews
        FROM guest_reviews gr
        GROUP BY gr.language
    )
    SELECT 
        gr.language::TEXT,
        COUNT(DISTINCT gr.tour_slug)::BIGINT,
        COUNT(*)::BIGINT,
        ROUND(AVG(gr.rating), 2),
        (dc.total > dc.unique_reviews)::BOOLEAN as has_duplicates
    FROM guest_reviews gr
    JOIN duplicate_check dc ON gr.language = dc.language
    GROUP BY gr.language, dc.total, dc.unique_reviews
    ORDER BY gr.language;
END;
$$ LANGUAGE plpgsql;

-- Initial verification before changes
SELECT 'BEFORE REPLACEMENT - Current Review Status:' as status;
SELECT * FROM verify_review_integrity();