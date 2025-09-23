-- =====================================================
-- VERIFY AUTHENTIC REVIEWS - COMPREHENSIVE VALIDATION
-- =====================================================
-- This script performs comprehensive validation of the authentic review replacement
-- Run this script AFTER master-review-replacement.sql to validate results

-- Set output formatting for better readability
\pset border 2
\pset format aligned

SELECT '🔍 COMPREHENSIVE REVIEW VALIDATION REPORT' as title;
SELECT '================================================' as separator;
SELECT 'Generated at: ' || now() as timestamp;
SELECT '================================================' as separator;

-- 1. UNIQUENESS VALIDATION
SELECT '1️⃣ UNIQUENESS VALIDATION' as section;
SELECT '========================' as separator;

-- Check for duplicate review texts
WITH duplicate_reviews AS (
    SELECT 
        review_text,
        COUNT(*) as occurrence_count,
        string_agg(DISTINCT language, ', ') as languages,
        string_agg(DISTINCT tour_slug, ', ') as tours
    FROM guest_reviews
    GROUP BY review_text
    HAVING COUNT(*) > 1
)
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ PASSED: All review texts are unique'
        ELSE '❌ FAILED: ' || COUNT(*) || ' duplicate review texts found'
    END as uniqueness_status
FROM duplicate_reviews;

-- Show duplicates if any exist
WITH duplicate_reviews AS (
    SELECT 
        review_text,
        COUNT(*) as occurrence_count,
        string_agg(DISTINCT language, ', ') as languages,
        string_agg(DISTINCT tour_slug, ', ') as tours
    FROM guest_reviews
    GROUP BY review_text
    HAVING COUNT(*) > 1
)
SELECT 
    left(review_text, 100) || '...' as review_preview,
    occurrence_count,
    languages,
    tours
FROM duplicate_reviews
ORDER BY occurrence_count DESC
LIMIT 10;

-- 2. LANGUAGE COVERAGE VALIDATION
SELECT '2️⃣ LANGUAGE COVERAGE VALIDATION' as section;
SELECT '==================================' as separator;

SELECT 
    language as "Language Code",
    COUNT(*) as "Total Reviews",
    COUNT(DISTINCT tour_slug) as "Tours Covered",
    COUNT(DISTINCT reviewer_name) as "Unique Reviewers",
    ROUND(AVG(rating), 2) as "Avg Rating",
    MIN(review_date) as "Earliest Review",
    MAX(review_date) as "Latest Review",
    CASE 
        WHEN COUNT(DISTINCT tour_slug) >= 20 THEN '✅ Excellent'
        WHEN COUNT(DISTINCT tour_slug) >= 15 THEN '⚠️ Good'
        ELSE '❌ Insufficient'
    END as "Coverage Status"
FROM guest_reviews
GROUP BY language
ORDER BY language;

-- 3. TOUR COVERAGE VALIDATION
SELECT '3️⃣ TOUR COVERAGE VALIDATION' as section;
SELECT '==============================' as separator;

SELECT 
    tour_slug as "Tour Slug",
    COUNT(*) as "Total Reviews",
    COUNT(DISTINCT language) as "Languages",
    string_agg(DISTINCT language ORDER BY language, ', ') as "Language List",
    ROUND(AVG(rating), 2) as "Avg Rating",
    CASE 
        WHEN COUNT(DISTINCT language) = 5 THEN '✅ Complete'
        WHEN COUNT(DISTINCT language) >= 3 THEN '⚠️ Partial'
        ELSE '❌ Insufficient'
    END as "Coverage Status"
FROM guest_reviews
GROUP BY tour_slug
ORDER BY tour_slug;

-- 4. CONTENT QUALITY VALIDATION
SELECT '4️⃣ CONTENT QUALITY VALIDATION' as section;
SELECT '================================' as separator;

-- Check review text length distribution
SELECT 
    language,
    COUNT(*) as review_count,
    ROUND(AVG(LENGTH(review_text))) as avg_length,
    MIN(LENGTH(review_text)) as min_length,
    MAX(LENGTH(review_text)) as max_length,
    CASE 
        WHEN AVG(LENGTH(review_text)) >= 200 THEN '✅ Detailed'
        WHEN AVG(LENGTH(review_text)) >= 100 THEN '⚠️ Adequate'
        ELSE '❌ Too Short'
    END as content_quality
FROM guest_reviews
GROUP BY language
ORDER BY language;

-- 5. RATING DISTRIBUTION VALIDATION
SELECT '5️⃣ RATING DISTRIBUTION VALIDATION' as section;
SELECT '====================================' as separator;

SELECT 
    rating as "Rating",
    COUNT(*) as "Count",
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as "Percentage",
    repeat('█', (COUNT(*) * 50 / MAX(COUNT(*)) OVER ())::int) as "Distribution"
FROM guest_reviews
GROUP BY rating
ORDER BY rating DESC;

-- Check for unnatural rating patterns
WITH rating_stats AS (
    SELECT 
        language,
        ROUND(AVG(rating), 2) as avg_rating,
        ROUND(STDDEV(rating), 2) as rating_stddev,
        COUNT(*) as total_reviews
    FROM guest_reviews
    GROUP BY language
)
SELECT 
    language,
    avg_rating,
    rating_stddev,
    total_reviews,
    CASE 
        WHEN avg_rating BETWEEN 4.0 AND 4.8 AND rating_stddev BETWEEN 0.3 AND 1.2 THEN '✅ Natural'
        WHEN avg_rating > 4.8 THEN '⚠️ Too High'
        WHEN rating_stddev < 0.3 THEN '⚠️ Too Uniform'
        ELSE '❌ Unnatural'
    END as rating_pattern
FROM rating_stats
ORDER BY language;

-- 6. DATE DISTRIBUTION VALIDATION
SELECT '6️⃣ DATE DISTRIBUTION VALIDATION' as section;
SELECT '===================================' as separator;

SELECT 
    DATE_TRUNC('month', review_date::date) as "Month",
    COUNT(*) as "Reviews",
    COUNT(DISTINCT language) as "Languages",
    repeat('█', (COUNT(*) * 30 / MAX(COUNT(*)) OVER ())::int) as "Distribution"
FROM guest_reviews
GROUP BY DATE_TRUNC('month', review_date::date)
ORDER BY "Month" DESC;

-- 7. REVIEWER DIVERSITY VALIDATION
SELECT '7️⃣ REVIEWER DIVERSITY VALIDATION' as section;
SELECT '===================================' as separator;

SELECT 
    language,
    COUNT(DISTINCT reviewer_name) as unique_reviewers,
    COUNT(*) as total_reviews,
    ROUND(COUNT(DISTINCT reviewer_name) * 100.0 / COUNT(*), 1) as uniqueness_percentage,
    CASE 
        WHEN COUNT(DISTINCT reviewer_name) * 100.0 / COUNT(*) > 90 THEN '✅ Excellent Diversity'
        WHEN COUNT(DISTINCT reviewer_name) * 100.0 / COUNT(*) > 80 THEN '⚠️ Good Diversity'
        ELSE '❌ Poor Diversity'
    END as diversity_status
FROM guest_reviews
GROUP BY language
ORDER BY language;

-- 8. CULTURAL AUTHENTICITY CHECK
SELECT '8️⃣ CULTURAL AUTHENTICITY CHECK' as section;
SELECT '=================================' as separator;

-- Check for language-specific patterns in reviewer locations
SELECT 
    language,
    COUNT(DISTINCT reviewer_location) as unique_locations,
    string_agg(DISTINCT split_part(reviewer_location, ',', -1) ORDER BY split_part(reviewer_location, ',', -1), ', ') as countries
FROM guest_reviews
GROUP BY language
ORDER BY language;

-- 9. SEO KEYWORD DISTRIBUTION
SELECT '9️⃣ SEO KEYWORD DISTRIBUTION' as section;
SELECT '===============================' as separator;

-- Check for tour-specific keyword presence in reviews
WITH tour_keywords AS (
    SELECT 
        tour_slug,
        language,
        COUNT(*) as total_reviews,
        SUM(CASE WHEN LOWER(review_text) LIKE '%safari%' OR LOWER(review_text) LIKE '%wildlife%' THEN 1 ELSE 0 END) as safari_mentions,
        SUM(CASE WHEN LOWER(review_text) LIKE '%wine%' OR LOWER(review_text) LIKE '%vineyard%' THEN 1 ELSE 0 END) as wine_mentions,
        SUM(CASE WHEN LOWER(review_text) LIKE '%mountain%' OR LOWER(review_text) LIKE '%view%' THEN 1 ELSE 0 END) as scenic_mentions,
        SUM(CASE WHEN LOWER(review_text) LIKE '%family%' OR LOWER(review_text) LIKE '%children%' OR LOWER(review_text) LIKE '%kids%' THEN 1 ELSE 0 END) as family_mentions
    FROM guest_reviews
    GROUP BY tour_slug, language
)
SELECT 
    language,
    AVG(safari_mentions::float / total_reviews * 100) as avg_safari_mention_rate,
    AVG(wine_mentions::float / total_reviews * 100) as avg_wine_mention_rate,
    AVG(scenic_mentions::float / total_reviews * 100) as avg_scenic_mention_rate,
    AVG(family_mentions::float / total_reviews * 100) as avg_family_mention_rate
FROM tour_keywords
GROUP BY language
ORDER BY language;

-- 10. FINAL SUMMARY REPORT
SELECT '🏁 FINAL VALIDATION SUMMARY' as section;
SELECT '=============================' as separator;

WITH validation_summary AS (
    SELECT 
        COUNT(*) as total_reviews,
        COUNT(DISTINCT review_text) as unique_texts,
        COUNT(DISTINCT tour_slug) as tours_covered,
        COUNT(DISTINCT language) as languages_covered,
        COUNT(DISTINCT reviewer_name) as unique_reviewers,
        ROUND(AVG(rating), 2) as overall_avg_rating,
        ROUND(AVG(LENGTH(review_text))) as avg_content_length
    FROM guest_reviews
)
SELECT 
    '📊 Total Reviews: ' || total_reviews as metric_1,
    '🎯 Unique Texts: ' || unique_texts || ' (' || ROUND(unique_texts * 100.0 / total_reviews, 1) || '% unique)' as metric_2,
    '🗺️ Tours Covered: ' || tours_covered || '/21' as metric_3,
    '🌍 Languages: ' || languages_covered || '/5' as metric_4,
    '👥 Unique Reviewers: ' || unique_reviewers as metric_5,
    '⭐ Overall Rating: ' || overall_avg_rating || '/5' as metric_6,
    '📝 Avg Content Length: ' || avg_content_length || ' characters' as metric_7
FROM validation_summary;

-- Final validation status
WITH final_check AS (
    SELECT 
        COUNT(*) as total_reviews,
        COUNT(DISTINCT review_text) as unique_texts,
        COUNT(DISTINCT tour_slug) as tours_covered,
        COUNT(DISTINCT language) as languages_covered
    FROM guest_reviews
)
SELECT 
    CASE 
        WHEN unique_texts = total_reviews 
         AND tours_covered >= 21 
         AND languages_covered = 5 
        THEN '🎉 VALIDATION PASSED: All authentic reviews successfully implemented!'
        ELSE '⚠️ VALIDATION ISSUES: Please review the above metrics for problems'
    END as final_status
FROM final_check;

SELECT '================================================' as separator;
SELECT '✅ Validation report completed' as completion_status;
SELECT 'Timestamp: ' || now() as end_timestamp;