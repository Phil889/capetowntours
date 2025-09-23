-- =====================================================
-- ENHANCED INDEXING STRATEGY FOR TOUR REVIEWS
-- =====================================================
-- 
-- Advanced indexing system designed for optimal performance
-- with 1,000+ reviews across multiple languages and tours.
-- 
-- Index Categories:
-- 1. Primary Query Indexes - Most frequently used queries
-- 2. Composite Indexes - Multi-column optimized indexes  
-- 3. Partial Indexes - Filtered indexes for specific conditions
-- 4. Specialized Indexes - GIN, BTREE, and custom indexes
-- 5. Maintenance Indexes - For admin and bulk operations
--
-- Expected Query Patterns:
-- - Get reviews by tour + language (90% of queries)
-- - Get reviews ordered by rating/helpfulness (80% of queries) 
-- - Search reviews by content (15% of queries)
-- - Admin filtering by various criteria (5% of queries)
--
-- =====================================================

-- Remove any existing indexes that might conflict
DROP INDEX IF EXISTS idx_tour_reviews_main_query CASCADE;
DROP INDEX IF EXISTS idx_tour_reviews_display_order CASCADE;
DROP INDEX IF EXISTS idx_tour_reviews_stats CASCADE;
DROP INDEX IF EXISTS idx_tour_reviews_search CASCADE;
DROP INDEX IF EXISTS idx_tour_reviews_admin CASCADE;

-- =====================================================
-- 1. PRIMARY QUERY INDEXES
-- =====================================================

-- Ultra-optimized index for the most common query: tour + language + verified status
-- Covers ~90% of all queries with maximum efficiency
CREATE UNIQUE INDEX CONCURRENTLY idx_tour_reviews_primary_lookup
ON tour_reviews (tour_slug, language, id) 
WHERE verified = true;

-- Secondary index for ordering - covers sorting by popularity and recency
CREATE INDEX CONCURRENTLY idx_tour_reviews_order_optimized
ON tour_reviews (tour_slug, language, helpful_count DESC, created_at DESC, rating DESC)
WHERE verified = true
INCLUDE (author, title, content, experience_type, review_date);

-- Rating-specific index for filtering and statistics
CREATE INDEX CONCURRENTLY idx_tour_reviews_rating_stats
ON tour_reviews (tour_slug, language, rating)
WHERE verified = true AND rating BETWEEN 1 AND 5
INCLUDE (helpful_count, created_at);

-- =====================================================
-- 2. COMPOSITE INDEXES FOR COMPLEX QUERIES
-- =====================================================

-- Comprehensive index for admin dashboard queries
CREATE INDEX CONCURRENTLY idx_tour_reviews_admin_comprehensive
ON tour_reviews (verified, created_at DESC, tour_slug, language, rating)
INCLUDE (author, author_location, experience_type, helpful_count);

-- Multi-language fallback index
CREATE INDEX CONCURRENTLY idx_tour_reviews_language_fallback
ON tour_reviews (tour_slug, rating DESC, helpful_count DESC, created_at DESC)
WHERE verified = true
INCLUDE (language, author, title, content);

-- Experience type filtering index
CREATE INDEX CONCURRENTLY idx_tour_reviews_experience_filter
ON tour_reviews (experience_type, tour_slug, language, rating DESC)
WHERE verified = true
INCLUDE (author, title, helpful_count, created_at);

-- =====================================================
-- 3. PARTIAL INDEXES FOR SPECIFIC CONDITIONS
-- =====================================================

-- High-performance index for featured reviews only
CREATE INDEX CONCURRENTLY idx_tour_reviews_featured_only
ON tour_reviews (tour_slug, language, helpful_count DESC, rating DESC)
WHERE verified = true AND is_featured = true
INCLUDE (author, title, content, created_at);

-- Recent reviews index (last 90 days) - for "latest reviews" sections
CREATE INDEX CONCURRENTLY idx_tour_reviews_recent_90d
ON tour_reviews (tour_slug, language, created_at DESC, helpful_count DESC)
WHERE verified = true 
    AND created_at > (CURRENT_DATE - INTERVAL '90 days')
INCLUDE (author, title, rating, experience_type);

-- High-rated reviews index (4-5 stars only) - for showcasing best reviews
CREATE INDEX CONCURRENTLY idx_tour_reviews_high_rated_only
ON tour_reviews (tour_slug, language, helpful_count DESC, created_at DESC)
WHERE verified = true AND rating >= 4
INCLUDE (author, title, content, rating, experience_type);

-- Low-rated reviews index (for management/improvement purposes)
CREATE INDEX CONCURRENTLY idx_tour_reviews_low_rated_mgmt
ON tour_reviews (tour_slug, language, created_at DESC)
WHERE verified = true AND rating <= 2
INCLUDE (author, title, content, rating, experience_type);

-- =====================================================
-- 4. SPECIALIZED INDEXES
-- =====================================================

-- Full-text search index using GIN for content search
CREATE INDEX CONCURRENTLY idx_tour_reviews_fulltext_search
ON tour_reviews USING gin(
    to_tsvector('english', 
        coalesce(title, '') || ' ' || 
        coalesce(content, '') || ' ' || 
        coalesce(experience_type, '') || ' ' ||
        coalesce(author_location, '')
    )
) WHERE verified = true;

-- Multi-language full-text search indexes
CREATE INDEX CONCURRENTLY idx_tour_reviews_fulltext_spanish
ON tour_reviews USING gin(to_tsvector('spanish', coalesce(title, '') || ' ' || coalesce(content, '')))
WHERE verified = true AND language = 'es';

CREATE INDEX CONCURRENTLY idx_tour_reviews_fulltext_french
ON tour_reviews USING gin(to_tsvector('french', coalesce(title, '') || ' ' || coalesce(content, '')))
WHERE verified = true AND language = 'fr';

CREATE INDEX CONCURRENTLY idx_tour_reviews_fulltext_german
ON tour_reviews USING gin(to_tsvector('german', coalesce(title, '') || ' ' || coalesce(content, '')))
WHERE verified = true AND language = 'de';

-- Trigram index for fuzzy matching and typo tolerance
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX CONCURRENTLY idx_tour_reviews_trigram_search
ON tour_reviews USING gin(
    (coalesce(title, '') || ' ' || coalesce(content, '')) gin_trgm_ops
) WHERE verified = true;

-- Hash index for exact tour slug lookups (fastest for equality)
CREATE INDEX CONCURRENTLY idx_tour_reviews_tour_slug_hash
ON tour_reviews USING hash(tour_slug)
WHERE verified = true;

-- =====================================================
-- 5. ANALYTICS AND REPORTING INDEXES
-- =====================================================

-- Time-series analysis index for trend reporting
CREATE INDEX CONCURRENTLY idx_tour_reviews_time_series
ON tour_reviews (
    date_trunc('month', created_at),
    tour_slug,
    language,
    rating
) WHERE verified = true
INCLUDE (helpful_count);

-- Author analysis index (for spam detection and user behavior)
CREATE INDEX CONCURRENTLY idx_tour_reviews_author_analysis
ON tour_reviews (author, author_location, created_at DESC)
WHERE verified = true
INCLUDE (tour_slug, language, rating, helpful_count);

-- Content length analysis index
CREATE INDEX CONCURRENTLY idx_tour_reviews_content_analysis
ON tour_reviews (
    length(content),
    tour_slug,
    language,
    rating
) WHERE verified = true AND content IS NOT NULL;

-- =====================================================
-- 6. MAINTENANCE AND BULK OPERATION INDEXES
-- =====================================================

-- Bulk update index for maintenance operations
CREATE INDEX CONCURRENTLY idx_tour_reviews_bulk_operations
ON tour_reviews (id, updated_at, created_at)
INCLUDE (tour_slug, language, verified);

-- Data integrity verification index
CREATE INDEX CONCURRENTLY idx_tour_reviews_integrity_check
ON tour_reviews (tour_slug, language, author, created_at)
WHERE verified = true
INCLUDE (title, rating, helpful_count);

-- Cleanup and archival index
CREATE INDEX CONCURRENTLY idx_tour_reviews_archival
ON tour_reviews (verified, created_at, updated_at)
INCLUDE (tour_slug, language, id);

-- =====================================================
-- 7. CUSTOM FUNCTIONAL INDEXES
-- =====================================================

-- Review quality score index (custom algorithm)
CREATE INDEX CONCURRENTLY idx_tour_reviews_quality_score
ON tour_reviews (
    (
        rating * 0.4 + 
        LEAST(helpful_count, 10) * 0.3 + 
        CASE WHEN length(content) > 200 THEN 2 ELSE 0 END * 0.2 +
        CASE WHEN is_featured THEN 1 ELSE 0 END * 0.1
    ) DESC,
    tour_slug,
    language
) WHERE verified = true;

-- Seasonal analysis index (for time-based insights)
CREATE INDEX CONCURRENTLY idx_tour_reviews_seasonal
ON tour_reviews (
    EXTRACT(month FROM created_at),
    EXTRACT(year FROM created_at),
    tour_slug,
    rating
) WHERE verified = true
INCLUDE (language, helpful_count);

-- Geographic distribution index (based on author location)
CREATE INDEX CONCURRENTLY idx_tour_reviews_geographic
ON tour_reviews (
    CASE 
        WHEN author_location ILIKE '%usa%' OR author_location ILIKE '%america%' THEN 'North America'
        WHEN author_location ILIKE '%uk%' OR author_location ILIKE '%england%' OR author_location ILIKE '%scotland%' THEN 'United Kingdom'
        WHEN author_location ILIKE '%germany%' OR author_location ILIKE '%france%' OR author_location ILIKE '%spain%' OR author_location ILIKE '%italy%' THEN 'Europe'
        WHEN author_location ILIKE '%australia%' OR author_location ILIKE '%new zealand%' THEN 'Oceania'
        ELSE 'Other'
    END,
    tour_slug,
    language,
    rating DESC
) WHERE verified = true;

-- =====================================================
-- 8. INDEX MONITORING AND STATISTICS
-- =====================================================

-- Create view to monitor index usage and performance
CREATE OR REPLACE VIEW v_tour_reviews_index_performance AS
WITH index_stats AS (
    SELECT 
        schemaname,
        tablename,
        indexname,
        idx_scan,
        idx_tup_read,
        idx_tup_fetch,
        pg_relation_size(indexname::regclass) as index_size_bytes,
        pg_size_pretty(pg_relation_size(indexname::regclass)) as index_size
    FROM pg_stat_user_indexes
    WHERE tablename = 'tour_reviews'
),
table_stats AS (
    SELECT 
        schemaname,
        tablename,
        n_tup_ins,
        n_tup_upd,
        n_tup_del,
        n_live_tup,
        n_dead_tup
    FROM pg_stat_user_tables
    WHERE tablename = 'tour_reviews'
)
SELECT 
    i.*,
    t.n_live_tup,
    t.n_dead_tup,
    CASE 
        WHEN i.idx_scan = 0 THEN 'UNUSED'
        WHEN i.idx_scan < 100 THEN 'LOW_USAGE'
        WHEN i.idx_scan < 1000 THEN 'MEDIUM_USAGE'
        ELSE 'HIGH_USAGE'
    END as usage_category,
    ROUND(
        (i.idx_scan::numeric / GREATEST(t.n_live_tup, 1)) * 100, 
        2
    ) as scan_ratio_percent
FROM index_stats i
CROSS JOIN table_stats t
ORDER BY i.idx_scan DESC;

-- =====================================================
-- 9. INDEX MAINTENANCE PROCEDURES
-- =====================================================

-- Function to analyze index effectiveness
CREATE OR REPLACE FUNCTION analyze_tour_reviews_index_effectiveness()
RETURNS TABLE(
    index_name TEXT,
    scans BIGINT,
    tuples_read BIGINT,
    size_mb NUMERIC,
    effectiveness_score NUMERIC,
    recommendation TEXT
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    WITH index_analysis AS (
        SELECT 
            indexname,
            idx_scan,
            idx_tup_read,
            ROUND(pg_relation_size(indexname::regclass) / 1024.0 / 1024.0, 2) as size_mb,
            CASE 
                WHEN idx_scan = 0 THEN 0
                ELSE ROUND((idx_scan::numeric / GREATEST(idx_tup_read, 1)) * 100, 2)
            END as effectiveness
        FROM pg_stat_user_indexes
        WHERE tablename = 'tour_reviews'
    )
    SELECT 
        ia.indexname::TEXT,
        ia.idx_scan,
        ia.idx_tup_read,
        ia.size_mb,
        ia.effectiveness,
        CASE 
            WHEN ia.idx_scan = 0 AND ia.size_mb > 10 THEN 'CONSIDER DROPPING - Large unused index'
            WHEN ia.idx_scan < 10 AND ia.size_mb > 5 THEN 'LOW USAGE - Monitor for potential removal'
            WHEN ia.effectiveness > 80 THEN 'EXCELLENT - Keep as is'
            WHEN ia.effectiveness > 50 THEN 'GOOD - Monitor performance'
            WHEN ia.effectiveness > 20 THEN 'MODERATE - Consider optimization'
            ELSE 'POOR - Investigate or drop'
        END::TEXT
    FROM index_analysis ia
    ORDER BY ia.effectiveness DESC, ia.idx_scan DESC;
END;
$$;

-- Function to rebuild indexes when needed
CREATE OR REPLACE FUNCTION rebuild_tour_reviews_indexes_if_needed()
RETURNS TABLE(
    index_name TEXT,
    action_taken TEXT,
    old_size TEXT,
    new_size TEXT
) LANGUAGE plpgsql AS $$
DECLARE
    idx_record RECORD;
    old_size BIGINT;
    new_size BIGINT;
BEGIN
    -- Check for indexes with high bloat or fragmentation
    FOR idx_record IN 
        SELECT indexname 
        FROM pg_stat_user_indexes 
        WHERE tablename = 'tour_reviews'
            AND idx_scan > 1000  -- Only rebuild frequently used indexes
    LOOP
        -- Get current size
        SELECT pg_relation_size(idx_record.indexname::regclass) INTO old_size;
        
        -- Rebuild index concurrently
        EXECUTE format('REINDEX INDEX CONCURRENTLY %I', idx_record.indexname);
        
        -- Get new size
        SELECT pg_relation_size(idx_record.indexname::regclass) INTO new_size;
        
        RETURN QUERY VALUES(
            idx_record.indexname::TEXT,
            'REBUILT'::TEXT,
            pg_size_pretty(old_size)::TEXT,
            pg_size_pretty(new_size)::TEXT
        );
    END LOOP;
    
    RETURN;
END;
$$;

-- =====================================================
-- 10. CONFIGURATION OPTIMIZATIONS
-- =====================================================

-- Optimize autovacuum settings for tour_reviews table
ALTER TABLE tour_reviews SET (
    autovacuum_vacuum_scale_factor = 0.05,  -- Vacuum when 5% of rows change
    autovacuum_analyze_scale_factor = 0.02, -- Analyze when 2% of rows change
    autovacuum_vacuum_cost_delay = 10,      -- Reduce vacuum impact on performance
    autovacuum_vacuum_cost_limit = 2000,    -- Increase vacuum work rate
    fillfactor = 85                         -- Leave 15% free space for updates
);

-- Set statistics target for better query planning
ALTER TABLE tour_reviews ALTER COLUMN tour_slug SET STATISTICS 1000;
ALTER TABLE tour_reviews ALTER COLUMN language SET STATISTICS 1000;
ALTER TABLE tour_reviews ALTER COLUMN rating SET STATISTICS 1000;
ALTER TABLE tour_reviews ALTER COLUMN helpful_count SET STATISTICS 500;
ALTER TABLE tour_reviews ALTER COLUMN created_at SET STATISTICS 500;

-- =====================================================
-- 11. FINAL VALIDATION AND STATISTICS
-- =====================================================

-- Update statistics for all new indexes
ANALYZE tour_reviews;

-- Create a summary view of all indexes
CREATE OR REPLACE VIEW v_tour_reviews_index_summary AS
SELECT 
    COUNT(*) as total_indexes,
    pg_size_pretty(SUM(pg_relation_size(indexname::regclass))) as total_index_size,
    ROUND(
        AVG(CASE WHEN idx_scan = 0 THEN 0 ELSE 1 END) * 100, 
        1
    ) as percent_used,
    MAX(idx_scan) as max_scans,
    MIN(idx_scan) as min_scans
FROM pg_stat_user_indexes 
WHERE tablename = 'tour_reviews';

-- Validate index creation success
DO $$
DECLARE
    index_count INTEGER;
    expected_count INTEGER := 25; -- Adjust based on indexes created above
BEGIN
    SELECT COUNT(*) INTO index_count
    FROM pg_stat_user_indexes 
    WHERE tablename = 'tour_reviews';
    
    IF index_count >= expected_count THEN
        RAISE NOTICE 'SUCCESS: Created % indexes for tour_reviews table', index_count;
    ELSE
        RAISE WARNING 'WARNING: Only created % indexes, expected at least %', index_count, expected_count;
    END IF;
END $$;

-- =====================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON INDEX idx_tour_reviews_primary_lookup IS 'Primary lookup index for tour + language queries (90% of traffic)';
COMMENT ON INDEX idx_tour_reviews_order_optimized IS 'Optimized index for review ordering by popularity and recency';
COMMENT ON INDEX idx_tour_reviews_rating_stats IS 'Rating-specific index for statistics and filtering';
COMMENT ON INDEX idx_tour_reviews_fulltext_search IS 'Full-text search index for content search functionality';
COMMENT ON INDEX idx_tour_reviews_quality_score IS 'Custom quality score index for intelligent review ranking';

COMMENT ON FUNCTION analyze_tour_reviews_index_effectiveness IS 'Analyzes index usage and provides optimization recommendations';
COMMENT ON FUNCTION rebuild_tour_reviews_indexes_if_needed IS 'Rebuilds fragmented indexes to maintain performance';

-- Final success message
SELECT 
    'Enhanced indexing setup complete' as status,
    COUNT(*) as total_indexes_created,
    pg_size_pretty(pg_total_relation_size('tour_reviews')) as total_table_size,
    NOW() as completed_at
FROM pg_stat_user_indexes 
WHERE tablename = 'tour_reviews';