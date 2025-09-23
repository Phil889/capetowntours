-- TOUR REVIEWS ROLLBACK PROCEDURES
-- Generated: 2025-08-24T21:04:30.641Z
--
-- CAUTION: This will remove reviews inserted in this session
--

-- Option 1: Remove all reviews inserted today
DELETE FROM tour_reviews WHERE created_at >= '2025-08-24T00:00:00Z';

-- Option 2: Remove reviews by language (run individually as needed)
-- DELETE FROM tour_reviews WHERE language = 'en' AND created_at >= '2025-08-24T00:00:00Z';
-- DELETE FROM tour_reviews WHERE language = 'de' AND created_at >= '2025-08-24T00:00:00Z';
-- DELETE FROM tour_reviews WHERE language = 'fr' AND created_at >= '2025-08-24T00:00:00Z';
-- DELETE FROM tour_reviews WHERE language = 'es' AND created_at >= '2025-08-24T00:00:00Z';
-- DELETE FROM tour_reviews WHERE language = 'ar' AND created_at >= '2025-08-24T00:00:00Z';

-- Verification query - Check remaining counts
SELECT language, COUNT(*) as count FROM tour_reviews GROUP BY language ORDER BY language;

-- Data integrity check
SELECT tour_slug, COUNT(*) as reviews_count FROM tour_reviews GROUP BY tour_slug ORDER BY reviews_count DESC;
