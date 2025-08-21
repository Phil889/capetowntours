-- Enable tour versioning system
-- This migration creates the necessary structures for tour version control

-- First, ensure the tour_versions table exists with proper structure
CREATE TABLE IF NOT EXISTS tour_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    version_data JSONB NOT NULL,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    change_notes TEXT,
    is_restore_point BOOLEAN DEFAULT FALSE,
    UNIQUE(tour_id, version_number)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_tour_versions_tour_id ON tour_versions(tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_versions_created_at ON tour_versions(created_at DESC);

-- Function to create a version before updating a tour
CREATE OR REPLACE FUNCTION create_tour_version()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create version if data actually changed
    IF OLD IS DISTINCT FROM NEW THEN
        INSERT INTO tour_versions (
            tour_id,
            version_number,
            version_data,
            created_by,
            change_notes
        ) VALUES (
            OLD.id,
            COALESCE((
                SELECT MAX(version_number) + 1 
                FROM tour_versions 
                WHERE tour_id = OLD.id
            ), 1),
            to_jsonb(OLD),
            current_setting('app.current_user', true),
            'Auto-saved before update'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically version tours on update
DROP TRIGGER IF EXISTS tour_version_trigger ON tours;
CREATE TRIGGER tour_version_trigger
    BEFORE UPDATE ON tours
    FOR EACH ROW
    EXECUTE FUNCTION create_tour_version();

-- Function to restore a tour from a specific version
CREATE OR REPLACE FUNCTION restore_tour_version(
    p_tour_id UUID,
    p_version_number INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    v_version_data JSONB;
    v_current_data JSONB;
BEGIN
    -- Get the version data
    SELECT version_data INTO v_version_data
    FROM tour_versions
    WHERE tour_id = p_tour_id AND version_number = p_version_number;
    
    IF v_version_data IS NULL THEN
        RAISE EXCEPTION 'Version not found';
    END IF;
    
    -- Save current state as a restore point before restoring
    SELECT to_jsonb(t.*) INTO v_current_data
    FROM tours t
    WHERE t.id = p_tour_id;
    
    INSERT INTO tour_versions (
        tour_id,
        version_number,
        version_data,
        created_by,
        change_notes,
        is_restore_point
    ) VALUES (
        p_tour_id,
        (SELECT MAX(version_number) + 1 FROM tour_versions WHERE tour_id = p_tour_id),
        v_current_data,
        current_setting('app.current_user', true),
        'Restore point before reverting to version ' || p_version_number,
        TRUE
    );
    
    -- Update the tour with the version data
    UPDATE tours
    SET 
        title = (v_version_data->>'title')::TEXT,
        description = (v_version_data->>'description')::TEXT,
        category = (v_version_data->>'category')::TEXT,
        duration_days = (v_version_data->>'duration_days')::INTEGER,
        price = (v_version_data->>'price')::TEXT,
        highlights = (v_version_data->>'highlights')::TEXT,
        itinerary = (v_version_data->>'itinerary')::TEXT,
        included = (v_version_data->>'included')::TEXT,
        excluded = (v_version_data->>'excluded')::TEXT,
        faqs = (v_version_data->>'faqs')::TEXT,
        structured_highlights = (v_version_data->'structured_highlights')::JSONB,
        structured_itinerary = (v_version_data->'structured_itinerary')::JSONB,
        structured_includes = (v_version_data->'structured_includes')::JSONB,
        structured_excludes = (v_version_data->'structured_excludes')::JSONB,
        structured_faqs = (v_version_data->'structured_faqs')::JSONB,
        updated_at = NOW()
    WHERE id = p_tour_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- View to get latest versions for each tour
CREATE OR REPLACE VIEW tour_latest_versions AS
SELECT DISTINCT ON (tour_id)
    tv.*,
    t.title as tour_title
FROM tour_versions tv
JOIN tours t ON t.id = tv.tour_id
ORDER BY tour_id, version_number DESC;

-- Function to clean up old versions (keep last 10 versions per tour)
CREATE OR REPLACE FUNCTION cleanup_old_versions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    WITH versions_to_delete AS (
        SELECT id
        FROM (
            SELECT 
                id,
                ROW_NUMBER() OVER (PARTITION BY tour_id ORDER BY version_number DESC) as rn,
                is_restore_point
            FROM tour_versions
        ) ranked
        WHERE rn > 10 AND is_restore_point = FALSE
    )
    DELETE FROM tour_versions
    WHERE id IN (SELECT id FROM versions_to_delete);
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT SELECT, INSERT ON tour_versions TO authenticated;
GRANT EXECUTE ON FUNCTION restore_tour_version TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_versions TO service_role;
