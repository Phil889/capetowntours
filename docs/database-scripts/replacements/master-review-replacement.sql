-- =====================================================
-- MASTER GUEST REVIEWS REPLACEMENT SCRIPT
-- =====================================================
-- This script executes all review replacements in the correct order
-- Replaces all duplicate reviews with authentic, unique content

-- Start transaction for entire replacement process
BEGIN;

-- Log master replacement start
DO $$ BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'STARTING MASTER REVIEW REPLACEMENT PROCESS';
    RAISE NOTICE 'Timestamp: %', now();
    RAISE NOTICE '====================================================';
END $$;

-- Step 1: Create backup procedures and backup existing data
\echo 'Step 1: Creating backup procedures and backing up existing data...'
\i 'C:/Users/USER-PC/Documents/Cape-Town-Safari-Tours-Website/docs/database-scripts/replacements/backup-procedures.sql'

-- Step 2: Replace German reviews
\echo 'Step 2: Replacing German reviews...'
\i 'C:/Users/USER-PC/Documents/Cape-Town-Safari-Tours-Website/docs/database-scripts/replacements/replace-german-reviews.sql'

-- Step 3: Replace English reviews
\echo 'Step 3: Replacing English reviews...'
\i 'C:/Users/USER-PC/Documents/Cape-Town-Safari-Tours-Website/docs/database-scripts/replacements/replace-english-reviews.sql'

-- Step 4: Replace French reviews
\echo 'Step 4: Replacing French reviews...'
\i 'C:/Users/USER-PC/Documents/Cape-Town-Safari-Tours-Website/docs/database-scripts/replacements/replace-french-reviews.sql'

-- Step 5: Replace Spanish reviews
\echo 'Step 5: Replacing Spanish reviews...'
\i 'C:/Users/USER-PC/Documents/Cape-Town-Safari-Tours-Website/docs/database-scripts/replacements/replace-spanish-reviews.sql'

-- Step 6: Replace Arabic reviews
\echo 'Step 6: Replacing Arabic reviews...'
\i 'C:/Users/USER-PC/Documents/Cape-Town-Safari-Tours-Website/docs/database-scripts/replacements/replace-arabic-reviews.sql'

-- Step 7: Final verification and validation
\echo 'Step 7: Running final verification...'

-- Verify no duplicate content exists
WITH duplicate_check AS (
    SELECT 
        review_text,
        COUNT(*) as count
    FROM guest_reviews
    GROUP BY review_text
    HAVING COUNT(*) > 1
)
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM duplicate_check) 
        THEN 'FAILED: Duplicate review text found!'
        ELSE 'PASSED: No duplicate review text found.'
    END as duplicate_check_result;

-- Verify language distribution
SELECT 'LANGUAGE DISTRIBUTION:' as check_type;
SELECT 
    language,
    COUNT(*) as total_reviews,
    COUNT(DISTINCT tour_slug) as tours_covered,
    ROUND(AVG(rating), 2) as avg_rating,
    MIN(review_date) as earliest_review,
    MAX(review_date) as latest_review
FROM guest_reviews
GROUP BY language
ORDER BY language;

-- Verify tour coverage
SELECT 'TOUR COVERAGE:' as check_type;
SELECT 
    tour_slug,
    COUNT(*) as total_reviews,
    COUNT(DISTINCT language) as languages_count,
    ROUND(AVG(rating), 2) as avg_rating
FROM guest_reviews
GROUP BY tour_slug
ORDER BY tour_slug;

-- Check for any missing tours or languages
SELECT 'COVERAGE GAPS:' as check_type;
WITH expected_combinations AS (
    SELECT 
        t.slug as tour_slug,
        l.code as language_code
    FROM (VALUES 
        ('aquila-safari-tour'),
        ('atlantis-sand-dunes-adventure'),
        ('babylonstoren-wine-estate'),
        ('bo-kaap-heritage-quarter'),
        ('boulders-beach-penguin-colony'),
        ('cape-of-good-hope'),
        ('cape-point-lighthouse'),
        ('cape-town-paragliding'),
        ('cape-town-skydive'),
        ('chapman-s-peak-drive'),
        ('delaire-graff-estate'),
        ('hermanus-whale-watching-tour'),
        ('hout-bay-harbour'),
        ('inverdoorn-safari-tour'),
        ('maiden-s-cove'),
        ('muizenberg-beach'),
        ('sea-point-promenade'),
        ('shark-cage-diving-gansbaai'),
        ('simon-s-town'),
        ('tokara-wine-estate'),
        ('v-a-waterfront')
    ) AS t(slug),
    (VALUES ('en'), ('es'), ('fr'), ('de'), ('ar')) AS l(code)
),
actual_combinations AS (
    SELECT DISTINCT tour_slug, language
    FROM guest_reviews
)
SELECT 
    ec.tour_slug,
    ec.language_code,
    'MISSING' as status
FROM expected_combinations ec
LEFT JOIN actual_combinations ac ON ec.tour_slug = ac.tour_slug AND ec.language_code = ac.language
WHERE ac.tour_slug IS NULL
ORDER BY ec.tour_slug, ec.language_code;

-- Performance verification
SELECT 'REVIEW STATISTICS:' as check_type;
SELECT 
    COUNT(*) as total_reviews,
    COUNT(DISTINCT reviewer_name) as unique_reviewers,
    COUNT(DISTINCT review_text) as unique_review_texts,
    ROUND(AVG(rating), 2) as overall_avg_rating,
    COUNT(DISTINCT tour_slug) as tours_with_reviews,
    COUNT(DISTINCT language) as languages_covered
FROM guest_reviews;

-- Final integrity check
SELECT 'INTEGRITY CHECK:' as check_type;
SELECT 
    CASE 
        WHEN COUNT(*) = COUNT(DISTINCT review_text) 
        THEN '✅ PASSED: All review texts are unique'
        ELSE '❌ FAILED: Duplicate review texts exist'
    END as uniqueness_check,
    CASE 
        WHEN COUNT(DISTINCT tour_slug) >= 21
        THEN '✅ PASSED: All tours have reviews'
        ELSE '❌ FAILED: Some tours missing reviews'
    END as tour_coverage_check,
    CASE 
        WHEN COUNT(DISTINCT language) = 5
        THEN '✅ PASSED: All 5 languages covered'
        ELSE '❌ FAILED: Missing language coverage'
    END as language_coverage_check
FROM guest_reviews;

-- Log completion
DO $$ 
DECLARE
    total_reviews INTEGER;
    unique_texts INTEGER;
BEGIN
    SELECT COUNT(*), COUNT(DISTINCT review_text) 
    INTO total_reviews, unique_texts 
    FROM guest_reviews;
    
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'MASTER REVIEW REPLACEMENT COMPLETED SUCCESSFULLY!';
    RAISE NOTICE 'Completion timestamp: %', now();
    RAISE NOTICE 'Total reviews inserted: %', total_reviews;
    RAISE NOTICE 'Unique review texts: %', unique_texts;
    RAISE NOTICE 'Uniqueness ratio: %/%', unique_texts, total_reviews;
    
    IF total_reviews = unique_texts THEN
        RAISE NOTICE '✅ SUCCESS: All reviews are unique!';
    ELSE
        RAISE NOTICE '❌ WARNING: Some duplicate content may exist!';
    END IF;
    
    RAISE NOTICE '====================================================';
END $$;

-- Commit all changes
COMMIT;

-- Final success message
\echo '✅ Master review replacement completed successfully!'
\echo '📊 Run verify-authentic-reviews.sql for detailed validation'