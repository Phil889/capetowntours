-- Rollback procedure for tour reviews insertion
-- Generated: 2025-08-24T21:00:50.086Z

-- Remove reviews inserted in this session
DELETE FROM tour_reviews WHERE created_at >= '2025-08-24T00:00:00Z';

-- Verification query
SELECT language, COUNT(*) as count FROM tour_reviews GROUP BY language ORDER BY language;
