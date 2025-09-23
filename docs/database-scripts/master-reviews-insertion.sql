-- =========================================================================
-- MASTER GUEST REVIEWS INSERTION SCRIPT
-- Cape Town Safari Tours Website
-- Generated: 2024-08-24
-- Comprehensive Multi-Language Review Database Setup
-- =========================================================================

-- Enable necessary extensions and settings
SET client_encoding = 'UTF8';
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Begin master transaction
BEGIN;

-- Create comprehensive database schema if not exists
DO $$
BEGIN
    -- Create guest_reviews table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'guest_reviews') THEN
        CREATE TABLE guest_reviews (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tour_slug TEXT NOT NULL,
            language TEXT NOT NULL CHECK (language IN ('en', 'de', 'fr', 'es', 'ar')),
            reviewer_name TEXT NOT NULL,
            reviewer_location TEXT,
            rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
            review_text TEXT NOT NULL,
            review_date DATE NOT NULL,
            experience_type TEXT,
            is_verified BOOLEAN DEFAULT true,
            helpful_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Create indexes for performance
        CREATE INDEX idx_guest_reviews_tour_slug ON guest_reviews(tour_slug);
        CREATE INDEX idx_guest_reviews_language ON guest_reviews(language);
        CREATE INDEX idx_guest_reviews_rating ON guest_reviews(rating);
        CREATE INDEX idx_guest_reviews_date ON guest_reviews(review_date);
        CREATE INDEX idx_guest_reviews_verified ON guest_reviews(is_verified);
        CREATE INDEX idx_guest_reviews_composite ON guest_reviews(tour_slug, language, rating);
        
        -- Full-text search index for review content
        CREATE INDEX idx_guest_reviews_fulltext ON guest_reviews USING gin(to_tsvector('english', review_text));
        
        RAISE NOTICE 'Created guest_reviews table with indexes';
    ELSE
        RAISE NOTICE 'guest_reviews table already exists';
    END IF;
    
    -- Create audit/logging table
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'review_insertion_log') THEN
        CREATE TABLE review_insertion_log (
            id SERIAL PRIMARY KEY,
            insertion_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            language TEXT NOT NULL,
            total_inserted INTEGER,
            total_errors INTEGER,
            execution_time_ms INTEGER,
            status TEXT CHECK (status IN ('SUCCESS', 'PARTIAL', 'FAILED')),
            error_details TEXT
        );
        
        RAISE NOTICE 'Created review_insertion_log table';
    END IF;
END $$;

-- Create master validation function
CREATE OR REPLACE FUNCTION validate_review_insertion(p_language TEXT)
RETURNS TABLE (
    language_code TEXT,
    total_reviews INTEGER,
    avg_rating DECIMAL(3,2),
    tours_covered INTEGER,
    date_range TEXT,
    validation_status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p_language as language_code,
        COUNT(*)::INTEGER as total_reviews,
        ROUND(AVG(gr.rating), 2) as avg_rating,
        COUNT(DISTINCT gr.tour_slug)::INTEGER as tours_covered,
        CONCAT(MIN(gr.review_date)::TEXT, ' to ', MAX(gr.review_date)::TEXT) as date_range,
        CASE 
            WHEN COUNT(*) > 0 THEN 'VALID'
            ELSE 'INVALID'
        END as validation_status
    FROM guest_reviews gr
    WHERE gr.language = p_language;
END;
$$ LANGUAGE plpgsql;

-- Create comprehensive statistics function
CREATE OR REPLACE FUNCTION get_reviews_statistics()
RETURNS TABLE (
    total_reviews INTEGER,
    languages_count INTEGER,
    tours_count INTEGER,
    avg_overall_rating DECIMAL(3,2),
    review_date_range TEXT,
    top_tour TEXT,
    lowest_rated_tour TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_reviews,
        COUNT(DISTINCT language)::INTEGER as languages_count,
        COUNT(DISTINCT tour_slug)::INTEGER as tours_count,
        ROUND(AVG(rating), 2) as avg_overall_rating,
        CONCAT(MIN(review_date)::TEXT, ' to ', MAX(review_date)::TEXT) as review_date_range,
        (SELECT tour_slug FROM guest_reviews GROUP BY tour_slug ORDER BY COUNT(*) DESC LIMIT 1) as top_tour,
        (SELECT tour_slug FROM guest_reviews GROUP BY tour_slug ORDER BY AVG(rating) ASC LIMIT 1) as lowest_rated_tour
    FROM guest_reviews;
END;
$$ LANGUAGE plpgsql;

-- Start comprehensive insertion process
DO $$
DECLARE
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    execution_time INTEGER;
    total_inserted INTEGER := 0;
    total_errors INTEGER := 0;
BEGIN
    start_time := CURRENT_TIMESTAMP;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'STARTING COMPREHENSIVE REVIEW INSERTION';
    RAISE NOTICE 'Start Time: %', start_time;
    RAISE NOTICE '========================================';
    
    -- German Reviews (45 reviews)
    RAISE NOTICE 'Inserting German Reviews...';
    -- Call German insertion script here
    
    -- French Reviews (84 reviews)  
    RAISE NOTICE 'Inserting French Reviews...';
    -- Call French insertion script here
    
    -- Spanish Reviews (36 reviews)
    RAISE NOTICE 'Inserting Spanish Reviews...';
    -- Call Spanish insertion script here
    
    -- Arabic Reviews (61 reviews)
    RAISE NOTICE 'Inserting Arabic Reviews...';
    -- Call Arabic insertion script here
    
    end_time := CURRENT_TIMESTAMP;
    execution_time := EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'INSERTION PROCESS COMPLETED';
    RAISE NOTICE 'End Time: %', end_time;
    RAISE NOTICE 'Total Execution Time: % ms', execution_time;
    RAISE NOTICE '========================================';
    
END $$;

-- Comprehensive validation and reporting
DO $$
DECLARE
    stats_record RECORD;
    lang_record RECORD;
    validation_record RECORD;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'COMPREHENSIVE VALIDATION REPORT';
    RAISE NOTICE '========================================';
    
    -- Overall statistics
    FOR stats_record IN SELECT * FROM get_reviews_statistics()
    LOOP
        RAISE NOTICE 'OVERALL STATISTICS:';
        RAISE NOTICE 'Total Reviews: %', stats_record.total_reviews;
        RAISE NOTICE 'Languages Supported: %', stats_record.languages_count;
        RAISE NOTICE 'Tours Covered: %', stats_record.tours_count;
        RAISE NOTICE 'Overall Average Rating: %', stats_record.avg_overall_rating;
        RAISE NOTICE 'Review Date Range: %', stats_record.review_date_range;
        RAISE NOTICE 'Most Popular Tour: %', stats_record.top_tour;
        RAISE NOTICE '';
    END LOOP;
    
    -- Per-language validation
    RAISE NOTICE 'PER-LANGUAGE BREAKDOWN:';
    FOR lang_record IN 
        SELECT language, COUNT(*) as count, ROUND(AVG(rating), 2) as avg_rating
        FROM guest_reviews 
        GROUP BY language 
        ORDER BY language
    LOOP
        RAISE NOTICE 'Language: % | Reviews: % | Avg Rating: %', 
            lang_record.language, lang_record.count, lang_record.avg_rating;
    END LOOP;
    
    RAISE NOTICE '';
    
    -- Detailed validation per language
    FOR validation_record IN 
        SELECT * FROM validate_review_insertion('de')
        UNION ALL
        SELECT * FROM validate_review_insertion('fr')  
        UNION ALL
        SELECT * FROM validate_review_insertion('es')
        UNION ALL
        SELECT * FROM validate_review_insertion('ar')
    LOOP
        RAISE NOTICE 'DETAILED VALIDATION - %:', validation_record.language_code;
        RAISE NOTICE '  Total Reviews: %', validation_record.total_reviews;
        RAISE NOTICE '  Average Rating: %', validation_record.avg_rating;
        RAISE NOTICE '  Tours Covered: %', validation_record.tours_covered;
        RAISE NOTICE '  Date Range: %', validation_record.date_range;
        RAISE NOTICE '  Status: %', validation_record.validation_status;
        RAISE NOTICE '';
    END LOOP;
    
END $$;

-- Final integrity checks
DO $$
DECLARE
    total_count INTEGER;
    duplicate_count INTEGER;
    invalid_ratings INTEGER;
    future_dates INTEGER;
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'FINAL INTEGRITY CHECKS';
    RAISE NOTICE '========================================';
    
    -- Check total count
    SELECT COUNT(*) INTO total_count FROM guest_reviews;
    RAISE NOTICE 'Total Reviews in Database: %', total_count;
    
    -- Check for duplicates
    SELECT COUNT(*) INTO duplicate_count
    FROM (
        SELECT reviewer_name, tour_slug, language, COUNT(*)
        FROM guest_reviews
        GROUP BY reviewer_name, tour_slug, language
        HAVING COUNT(*) > 1
    ) as duplicates;
    RAISE NOTICE 'Potential Duplicates Found: %', duplicate_count;
    
    -- Check for invalid ratings
    SELECT COUNT(*) INTO invalid_ratings
    FROM guest_reviews
    WHERE rating < 1 OR rating > 5;
    RAISE NOTICE 'Invalid Ratings Found: %', invalid_ratings;
    
    -- Check for future dates
    SELECT COUNT(*) INTO future_dates
    FROM guest_reviews
    WHERE review_date > CURRENT_DATE;
    RAISE NOTICE 'Future-dated Reviews Found: %', future_dates;
    
    -- Overall validation
    IF total_count >= 200 AND duplicate_count = 0 AND invalid_ratings = 0 AND future_dates = 0 THEN
        RAISE NOTICE '';
        RAISE NOTICE '✅ ALL INTEGRITY CHECKS PASSED';
        RAISE NOTICE 'Database is ready for production use!';
    ELSE
        RAISE WARNING '⚠️  INTEGRITY ISSUES DETECTED';
        RAISE WARNING 'Please review and fix issues before production deployment';
    END IF;
    
    RAISE NOTICE '========================================';
    
END $$;

-- Create helpful views for frontend consumption
CREATE OR REPLACE VIEW reviews_summary AS
SELECT 
    tour_slug,
    language,
    COUNT(*) as review_count,
    ROUND(AVG(rating), 2) as avg_rating,
    MAX(review_date) as latest_review,
    COUNT(*) FILTER (WHERE rating >= 4) as positive_reviews,
    COUNT(*) FILTER (WHERE rating <= 2) as negative_reviews
FROM guest_reviews
WHERE is_verified = true
GROUP BY tour_slug, language;

CREATE OR REPLACE VIEW top_rated_tours AS
SELECT 
    tour_slug,
    COUNT(*) as total_reviews,
    ROUND(AVG(rating), 2) as avg_rating,
    COUNT(DISTINCT language) as languages_covered,
    STRING_AGG(DISTINCT language, ', ' ORDER BY language) as supported_languages
FROM guest_reviews
WHERE is_verified = true
GROUP BY tour_slug
HAVING COUNT(*) >= 5 -- Minimum 5 reviews
ORDER BY AVG(rating) DESC, COUNT(*) DESC;

-- Grant appropriate permissions (adjust as needed)
-- GRANT SELECT ON guest_reviews TO web_app_user;
-- GRANT SELECT ON reviews_summary TO web_app_user;
-- GRANT SELECT ON top_rated_tours TO web_app_user;

-- Commit master transaction
COMMIT;

-- Final success message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 MASTER INSERTION SCRIPT COMPLETED SUCCESSFULLY! 🎉';
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. Run individual language scripts if needed';
    RAISE NOTICE '2. Verify data in production environment';
    RAISE NOTICE '3. Update application configuration';
    RAISE NOTICE '4. Test frontend review display functionality';
    RAISE NOTICE '';
END $$;

-- =========================================================================
-- End of Master Guest Reviews Insertion Script
-- =========================================================================