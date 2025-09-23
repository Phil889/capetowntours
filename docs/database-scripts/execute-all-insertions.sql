-- =========================================================================
-- EXECUTE ALL LANGUAGE INSERTIONS SCRIPT
-- Cape Town Safari Tours Website
-- Generated: 2024-08-24
-- This script executes all individual language insertion scripts in sequence
-- =========================================================================

-- Set session parameters for optimal performance
SET client_encoding = 'UTF8';
SET statement_timeout = '30min';
SET lock_timeout = '5min';
SET search_path = public;

-- Begin master transaction
BEGIN;

-- Create execution log table
CREATE TEMP TABLE insertion_execution_log (
    step_number INTEGER,
    step_name TEXT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    duration_ms INTEGER,
    status TEXT,
    records_inserted INTEGER,
    error_message TEXT
);

-- Execution monitoring function
CREATE OR REPLACE FUNCTION log_execution_step(
    p_step_number INTEGER,
    p_step_name TEXT,
    p_start_time TIMESTAMP,
    p_end_time TIMESTAMP,
    p_status TEXT,
    p_records_inserted INTEGER DEFAULT 0,
    p_error_message TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO insertion_execution_log (
        step_number, step_name, start_time, end_time, 
        duration_ms, status, records_inserted, error_message
    ) VALUES (
        p_step_number, p_step_name, p_start_time, p_end_time,
        EXTRACT(EPOCH FROM (p_end_time - p_start_time)) * 1000,
        p_status, p_records_inserted, p_error_message
    );
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    step_start_time TIMESTAMP;
    step_end_time TIMESTAMP;
    total_start_time TIMESTAMP;
    total_end_time TIMESTAMP;
    german_count INTEGER;
    french_count INTEGER;
    spanish_count INTEGER;
    arabic_count INTEGER;
    total_count INTEGER;
    error_occurred BOOLEAN := FALSE;
    error_message TEXT;
BEGIN
    total_start_time := CURRENT_TIMESTAMP;
    
    RAISE NOTICE '';
    RAISE NOTICE '🚀 STARTING COMPREHENSIVE MULTI-LANGUAGE REVIEW INSERTION';
    RAISE NOTICE '================================================================';
    RAISE NOTICE 'Execution Start Time: %', total_start_time;
    RAISE NOTICE '================================================================';
    RAISE NOTICE '';
    
    -- STEP 1: Setup and Validation
    step_start_time := CURRENT_TIMESTAMP;
    
    BEGIN
        RAISE NOTICE '📋 STEP 1: Database Setup and Validation';
        
        -- Ensure UTF-8 encoding
        SHOW server_encoding;
        RAISE NOTICE '✅ Database encoding verified';
        
        -- Check if guest_reviews table exists
        IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'guest_reviews') THEN
            RAISE NOTICE '🔨 Creating guest_reviews table...';
            -- Execute master schema creation
            \i master-reviews-insertion.sql
            RAISE NOTICE '✅ Database schema created';
        ELSE
            RAISE NOTICE '✅ Database schema already exists';
        END IF;
        
        step_end_time := CURRENT_TIMESTAMP;
        PERFORM log_execution_step(1, 'Database Setup', step_start_time, step_end_time, 'SUCCESS');
        
    EXCEPTION
        WHEN OTHERS THEN
            step_end_time := CURRENT_TIMESTAMP;
            error_message := SQLERRM;
            PERFORM log_execution_step(1, 'Database Setup', step_start_time, step_end_time, 'FAILED', 0, error_message);
            RAISE EXCEPTION 'Setup failed: %', error_message;
    END;
    
    -- STEP 2: German Reviews Insertion
    step_start_time := CURRENT_TIMESTAMP;
    
    BEGIN
        RAISE NOTICE '';
        RAISE NOTICE '🇩🇪 STEP 2: Inserting German Reviews';
        RAISE NOTICE '------------------------------------------------';
        
        -- Get count before insertion
        SELECT COUNT(*) INTO german_count FROM guest_reviews WHERE language = 'de';
        RAISE NOTICE 'German reviews before insertion: %', german_count;
        
        -- Execute German insertion script
        \i insert-german-reviews.sql
        
        -- Get count after insertion
        SELECT COUNT(*) INTO german_count FROM guest_reviews WHERE language = 'de';
        RAISE NOTICE '✅ German reviews after insertion: %', german_count;
        
        step_end_time := CURRENT_TIMESTAMP;
        PERFORM log_execution_step(2, 'German Reviews', step_start_time, step_end_time, 'SUCCESS', german_count);
        
    EXCEPTION
        WHEN OTHERS THEN
            step_end_time := CURRENT_TIMESTAMP;
            error_message := SQLERRM;
            PERFORM log_execution_step(2, 'German Reviews', step_start_time, step_end_time, 'FAILED', 0, error_message);
            RAISE NOTICE '❌ German insertion failed: %', error_message;
            error_occurred := TRUE;
    END;
    
    -- STEP 3: French Reviews Insertion
    step_start_time := CURRENT_TIMESTAMP;
    
    BEGIN
        RAISE NOTICE '';
        RAISE NOTICE '🇫🇷 STEP 3: Inserting French Reviews';
        RAISE NOTICE '------------------------------------------------';
        
        -- Get count before insertion
        SELECT COUNT(*) INTO french_count FROM guest_reviews WHERE language = 'fr';
        RAISE NOTICE 'French reviews before insertion: %', french_count;
        
        -- Execute French insertion script
        \i insert-french-reviews.sql
        
        -- Get count after insertion
        SELECT COUNT(*) INTO french_count FROM guest_reviews WHERE language = 'fr';
        RAISE NOTICE '✅ French reviews after insertion: %', french_count;
        
        step_end_time := CURRENT_TIMESTAMP;
        PERFORM log_execution_step(3, 'French Reviews', step_start_time, step_end_time, 'SUCCESS', french_count);
        
    EXCEPTION
        WHEN OTHERS THEN
            step_end_time := CURRENT_TIMESTAMP;
            error_message := SQLERRM;
            PERFORM log_execution_step(3, 'French Reviews', step_start_time, step_end_time, 'FAILED', 0, error_message);
            RAISE NOTICE '❌ French insertion failed: %', error_message;
            error_occurred := TRUE;
    END;
    
    -- STEP 4: Spanish Reviews Insertion
    step_start_time := CURRENT_TIMESTAMP;
    
    BEGIN
        RAISE NOTICE '';
        RAISE NOTICE '🇪🇸 STEP 4: Inserting Spanish Reviews';
        RAISE NOTICE '------------------------------------------------';
        
        -- Get count before insertion
        SELECT COUNT(*) INTO spanish_count FROM guest_reviews WHERE language = 'es';
        RAISE NOTICE 'Spanish reviews before insertion: %', spanish_count;
        
        -- Execute Spanish insertion script
        \i insert-spanish-reviews.sql
        
        -- Get count after insertion
        SELECT COUNT(*) INTO spanish_count FROM guest_reviews WHERE language = 'es';
        RAISE NOTICE '✅ Spanish reviews after insertion: %', spanish_count;
        
        step_end_time := CURRENT_TIMESTAMP;
        PERFORM log_execution_step(4, 'Spanish Reviews', step_start_time, step_end_time, 'SUCCESS', spanish_count);
        
    EXCEPTION
        WHEN OTHERS THEN
            step_end_time := CURRENT_TIMESTAMP;
            error_message := SQLERRM;
            PERFORM log_execution_step(4, 'Spanish Reviews', step_start_time, step_end_time, 'FAILED', 0, error_message);
            RAISE NOTICE '❌ Spanish insertion failed: %', error_message;
            error_occurred := TRUE;
    END;
    
    -- STEP 5: Arabic Reviews Insertion
    step_start_time := CURRENT_TIMESTAMP;
    
    BEGIN
        RAISE NOTICE '';
        RAISE NOTICE '🇸🇦 STEP 5: Inserting Arabic Reviews';
        RAISE NOTICE '------------------------------------------------';
        
        -- Get count before insertion
        SELECT COUNT(*) INTO arabic_count FROM guest_reviews WHERE language = 'ar';
        RAISE NOTICE 'Arabic reviews before insertion: %', arabic_count;
        
        -- Execute Arabic insertion script
        \i insert-arabic-reviews.sql
        
        -- Get count after insertion
        SELECT COUNT(*) INTO arabic_count FROM guest_reviews WHERE language = 'ar';
        RAISE NOTICE '✅ Arabic reviews after insertion: %', arabic_count;
        
        step_end_time := CURRENT_TIMESTAMP;
        PERFORM log_execution_step(5, 'Arabic Reviews', step_start_time, step_end_time, 'SUCCESS', arabic_count);
        
    EXCEPTION
        WHEN OTHERS THEN
            step_end_time := CURRENT_TIMESTAMP;
            error_message := SQLERRM;
            PERFORM log_execution_step(5, 'Arabic Reviews', step_start_time, step_end_time, 'FAILED', 0, error_message);
            RAISE NOTICE '❌ Arabic insertion failed: %', error_message;
            error_occurred := TRUE;
    END;
    
    -- STEP 6: Final Validation and Summary
    step_start_time := CURRENT_TIMESTAMP;
    
    RAISE NOTICE '';
    RAISE NOTICE '📊 STEP 6: Final Validation and Summary';
    RAISE NOTICE '================================================';
    
    -- Get final counts
    SELECT COUNT(*) INTO total_count FROM guest_reviews;
    SELECT COUNT(*) INTO german_count FROM guest_reviews WHERE language = 'de';
    SELECT COUNT(*) INTO french_count FROM guest_reviews WHERE language = 'fr';
    SELECT COUNT(*) INTO spanish_count FROM guest_reviews WHERE language = 'es';
    SELECT COUNT(*) INTO arabic_count FROM guest_reviews WHERE language = 'ar';
    
    RAISE NOTICE '';
    RAISE NOTICE '📈 FINAL INSERTION SUMMARY:';
    RAISE NOTICE '├─ German Reviews: %', german_count;
    RAISE NOTICE '├─ French Reviews: %', french_count;
    RAISE NOTICE '├─ Spanish Reviews: %', spanish_count;
    RAISE NOTICE '├─ Arabic Reviews: %', arabic_count;
    RAISE NOTICE '└─ TOTAL REVIEWS: %', total_count;
    RAISE NOTICE '';
    
    -- Language coverage analysis
    RAISE NOTICE '🌍 LANGUAGE COVERAGE ANALYSIS:';
    FOR rec IN 
        SELECT 
            language,
            COUNT(*) as review_count,
            COUNT(DISTINCT tour_slug) as tours_covered,
            ROUND(AVG(rating), 2) as avg_rating,
            MIN(review_date) as earliest_date,
            MAX(review_date) as latest_date
        FROM guest_reviews 
        GROUP BY language 
        ORDER BY language
    LOOP
        RAISE NOTICE '├─ %: % reviews | % tours | ⭐ % avg | 📅 % to %', 
            UPPER(rec.language), 
            rec.review_count, 
            rec.tours_covered, 
            rec.avg_rating, 
            rec.earliest_date, 
            rec.latest_date;
    END LOOP;
    RAISE NOTICE '';
    
    -- Tour coverage analysis
    RAISE NOTICE '🎯 TOUR COVERAGE ANALYSIS:';
    FOR rec IN 
        SELECT 
            tour_slug,
            COUNT(*) as review_count,
            COUNT(DISTINCT language) as languages_count,
            ROUND(AVG(rating), 2) as avg_rating,
            STRING_AGG(DISTINCT language, ', ' ORDER BY language) as languages
        FROM guest_reviews 
        GROUP BY tour_slug 
        ORDER BY COUNT(*) DESC
    LOOP
        RAISE NOTICE '├─ %: % reviews | % languages (%s) | ⭐ %', 
            rec.tour_slug, 
            rec.review_count, 
            rec.languages_count, 
            rec.languages, 
            rec.avg_rating;
    END LOOP;
    RAISE NOTICE '';
    
    total_end_time := CURRENT_TIMESTAMP;
    
    -- Execution summary
    RAISE NOTICE '⏱️  EXECUTION TIMING SUMMARY:';
    FOR rec IN 
        SELECT 
            step_number,
            step_name,
            duration_ms,
            status,
            records_inserted
        FROM insertion_execution_log 
        ORDER BY step_number
    LOOP
        RAISE NOTICE '├─ Step %: % | % ms | % | % records', 
            rec.step_number, 
            rec.step_name, 
            rec.duration_ms, 
            rec.status, 
            rec.records_inserted;
    END LOOP;
    
    RAISE NOTICE '└─ Total Execution Time: % ms', 
        EXTRACT(EPOCH FROM (total_end_time - total_start_time)) * 1000;
    RAISE NOTICE '';
    
    -- Final status
    IF error_occurred THEN
        RAISE NOTICE '⚠️  EXECUTION COMPLETED WITH WARNINGS';
        RAISE NOTICE 'Some language insertions may have failed. Please review the log above.';
        RAISE NOTICE 'Partial data has been inserted successfully.';
    ELSE
        RAISE NOTICE '🎉 EXECUTION COMPLETED SUCCESSFULLY!';
        RAISE NOTICE 'All language reviews have been inserted successfully.';
        RAISE NOTICE 'Database is ready for production use.';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '================================================================';
    RAISE NOTICE '🏁 MULTI-LANGUAGE REVIEW INSERTION COMPLETED';
    RAISE NOTICE 'Execution End Time: %', total_end_time;
    RAISE NOTICE '================================================================';
    RAISE NOTICE '';
    
    step_end_time := CURRENT_TIMESTAMP;
    PERFORM log_execution_step(6, 'Final Validation', step_start_time, step_end_time, 'SUCCESS', total_count);
    
END $$;

-- Commit all changes
COMMIT;

-- Final verification query
SELECT 
    'FINAL VERIFICATION' as status,
    COUNT(*) as total_reviews,
    COUNT(DISTINCT language) as languages_supported,
    COUNT(DISTINCT tour_slug) as tours_covered,
    ROUND(AVG(rating), 2) as overall_avg_rating
FROM guest_reviews;

-- =========================================================================
-- End of Execute All Insertions Script
-- =========================================================================