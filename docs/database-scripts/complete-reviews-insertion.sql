-- Complete Multi-Language Guest Reviews Database Insertion
-- This script inserts all guest reviews for all 21 tours in all 5 languages
-- Generated automatically with proper UUIDs and database structure

-- English Reviews Insertion
\i 'C:/Users/USER-PC/Documents/Cape-Town-Safari-Tours-Website/docs/database-scripts/insert-english-reviews.sql';

-- German Reviews Insertion  
\i 'C:/Users/USER-PC/Documents/Cape-Town-Safari-Tours-Website/docs/database-scripts/insert-german-reviews.sql';

-- French Reviews Insertion
\i 'C:/Users/USER-PC/Documents/Cape-Town-Safari-Tours-Website/docs/database-scripts/insert-french-reviews.sql';

-- Spanish Reviews Insertion
\i 'C:/Users/USER-PC/Documents/Cape-Town-Safari-Tours-Website/docs/database-scripts/insert-spanish-reviews.sql';

-- Arabic Reviews Insertion
\i 'C:/Users/USER-PC/Documents/Cape-Town-Safari-Tours-Website/docs/database-scripts/insert-arabic-reviews.sql';

-- Verification Queries
SELECT 
    language,
    COUNT(*) as review_count,
    AVG(rating) as average_rating,
    COUNT(DISTINCT tour_slug) as tours_covered
FROM guest_reviews 
GROUP BY language 
ORDER BY language;

-- Tour Coverage Verification
SELECT 
    tour_slug,
    COUNT(*) as total_reviews,
    COUNT(CASE WHEN language = 'en' THEN 1 END) as english_reviews,
    COUNT(CASE WHEN language = 'de' THEN 1 END) as german_reviews,
    COUNT(CASE WHEN language = 'fr' THEN 1 END) as french_reviews,
    COUNT(CASE WHEN language = 'es' THEN 1 END) as spanish_reviews,
    COUNT(CASE WHEN language = 'ar' THEN 1 END) as arabic_reviews
FROM guest_reviews 
GROUP BY tour_slug 
ORDER BY tour_slug;

-- Language Distribution Summary
SELECT 
    'TOTAL REVIEWS INSERTED' as summary,
    COUNT(*) as total_count,
    ROUND(AVG(rating), 2) as overall_avg_rating
FROM guest_reviews;

COMMIT;