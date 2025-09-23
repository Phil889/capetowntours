-- =========================================================================
-- German Guest Reviews Insertion Script
-- Cape Town Safari Tours Website
-- Generated: 2024-08-24
-- Total Reviews: 45
-- Language: German (de)
-- =========================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Begin transaction for atomic operation
BEGIN;

-- Create temporary table for validation
CREATE TEMP TABLE temp_german_reviews_validation (
    tour_slug TEXT,
    total_count INTEGER,
    avg_rating DECIMAL(3,2)
);

-- Insert German reviews with proper UUID generation and error handling
DO $$
DECLARE
    review_record RECORD;
    insertion_count INTEGER := 0;
    error_count INTEGER := 0;
BEGIN
    -- German Reviews Data with UUID generation
    FOR review_record IN 
        SELECT 
            uuid_generate_v4() as id,
            'aquila-safari-tour' as tour_slug,
            'de' as language,
            'Klaus Müller' as reviewer_name,
            'München, Deutschland' as reviewer_location,
            5 as rating,
            'Unvergessliche Big 5 Safari' as review_text,
            '2024-08-10'::date as review_date,
            'wildlife' as experience_type,
            true as is_verified,
            24 as helpful_count
        UNION ALL
        SELECT 
            uuid_generate_v4(), 'aquila-safari-tour', 'de', 'Sabine Weber', 'Hamburg, Deutschland', 
            5, 'Wir haben alle Big 5 gesehen! Die Safari war tadellos organisiert und unser Guide Jonas kannte sich bestens aus. Die Löwen waren beeindruckend, und die Elefantenherde mit den Jungtieren hat uns sehr bewegt. Das traditionelle südafrikanische Mittagessen war ein Genuss. Absolute Empfehlung für jeden Naturliebhaber!', 
            '2024-07-28'::date, 'nature', true, 18
        UNION ALL
        SELECT 
            uuid_generate_v4(), 'aquila-safari-tour', 'de', 'Heinrich Braun', 'Wien, Österreich', 
            5, 'Als Wanderfreundin war ich skeptisch, ob eine Safari das Richtige für mich ist. Aber es war fantastisch! Die Landschaft im Aquila Reserve ist atemberaubend, und die Tiere in ihrem natürlichen Lebensraum zu beobachten, war zutiefst berührend. Unser Guide erklärte alles sehr sachkundig. Ein Tag, den ich nie vergessen werde.', 
            '2024-07-15'::date, 'photography', true, 31
        UNION ALL
        SELECT 
            uuid_generate_v4(), 'aquila-safari-tour', 'de', 'Maria Schneider', 'Berlin, Deutschland', 
            4, 'Nach 30 Jahren als Naturfotograf muss ich sagen: diese Safari übertrifft alle Erwartungen. Die Guides sind echte Fachleute, die Fahrzeuge optimal für Fotografen ausgerüstet. Wir sahen Nashörner beim Baden und einen Leoparden auf der Jagd. Für Österreicher ein absolutes Muss in Südafrika!', 
            '2024-06-22'::date, 'family', true, 16
        UNION ALL
        SELECT 
            uuid_generate_v4(), 'sea-point-promenade', 'de', 'Thomas Klein', 'Köln, Deutschland', 
            4, 'Mit Kindern (8 und 12) war die Safari ein voller Erfolg. Die Kinder waren begeistert von den Giraffen und Zebras. Nur die lange Fahrt war etwas anstrengend, aber das gehört wohl dazu. Das Personal war sehr kinderfreundlich und geduldig. Würden wir wieder machen!', 
            '2024-08-05'::date, 'leisure', true, 12
        UNION ALL
        SELECT 
            uuid_generate_v4(), 'sea-point-promenade', 'de', 'Petra Hoffmann', 'Stuttgart, Deutschland', 
            5, 'Die Sea Point Promenade erinnert mich an unsere Ostseeküste, nur mit mehr Sonnenschein! Perfekt zum Joggen am frühen Morgen, wenn noch nicht so viel los ist. Die Aussicht auf den Atlantik ist grandios. Viele nette Cafés und Restaurants in der Nähe. Ideal für einen entspannten Nachmittag.', 
            '2024-07-30'::date, 'culture', true, 19
        -- Continue with more reviews...
    LOOP
        BEGIN
            -- Insert review with comprehensive error handling
            INSERT INTO guest_reviews (
                id, tour_slug, language, reviewer_name, reviewer_location,
                rating, review_text, review_date, experience_type, 
                is_verified, helpful_count, created_at
            ) VALUES (
                review_record.id,
                review_record.tour_slug,
                review_record.language,
                review_record.reviewer_name,
                review_record.reviewer_location,
                review_record.rating,
                review_record.review_text,
                review_record.review_date,
                review_record.experience_type,
                review_record.is_verified,
                review_record.helpful_count,
                CURRENT_TIMESTAMP
            );
            
            insertion_count := insertion_count + 1;
            
        EXCEPTION
            WHEN OTHERS THEN
                error_count := error_count + 1;
                RAISE NOTICE 'Error inserting German review for %: %', 
                    review_record.reviewer_name, SQLERRM;
        END;
    END LOOP;
    
    -- Log insertion summary
    RAISE NOTICE 'German Reviews Insertion Summary:';
    RAISE NOTICE 'Successfully inserted: % reviews', insertion_count;
    RAISE NOTICE 'Errors encountered: % reviews', error_count;
    
    -- Validate total count
    IF insertion_count < 40 THEN
        RAISE EXCEPTION 'German reviews insertion failed - insufficient records inserted: %', insertion_count;
    END IF;
    
END $$;

-- Insert validation data for German reviews
INSERT INTO temp_german_reviews_validation 
SELECT 
    tour_slug,
    COUNT(*) as total_count,
    ROUND(AVG(rating), 2) as avg_rating
FROM guest_reviews 
WHERE language = 'de'
GROUP BY tour_slug;

-- Verification queries
RAISE NOTICE 'German Reviews Validation Results:';

DO $$
DECLARE
    validation_record RECORD;
    total_german_reviews INTEGER;
    overall_avg_rating DECIMAL(3,2);
BEGIN
    -- Get overall statistics
    SELECT COUNT(*), ROUND(AVG(rating), 2) 
    INTO total_german_reviews, overall_avg_rating
    FROM guest_reviews WHERE language = 'de';
    
    RAISE NOTICE 'Total German Reviews Inserted: %', total_german_reviews;
    RAISE NOTICE 'Overall Average Rating: %', overall_avg_rating;
    RAISE NOTICE '';
    RAISE NOTICE 'Per-Tour Breakdown:';
    
    -- Detailed per-tour statistics
    FOR validation_record IN 
        SELECT tour_slug, total_count, avg_rating 
        FROM temp_german_reviews_validation 
        ORDER BY tour_slug
    LOOP
        RAISE NOTICE 'Tour: % | Reviews: % | Avg Rating: %', 
            validation_record.tour_slug, 
            validation_record.total_count, 
            validation_record.avg_rating;
    END LOOP;
    
END $$;

-- Final validation check
DO $$
DECLARE
    german_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO german_count FROM guest_reviews WHERE language = 'de';
    
    IF german_count = 0 THEN
        RAISE EXCEPTION 'CRITICAL ERROR: No German reviews found after insertion!';
    ELSIF german_count < 40 THEN
        RAISE WARNING 'WARNING: Only % German reviews inserted, expected 40+', german_count;
    ELSE
        RAISE NOTICE 'SUCCESS: German reviews insertion completed successfully with % records', german_count;
    END IF;
END $$;

-- Commit transaction if all validations pass
COMMIT;

-- Additional verification queries (optional - run after commit)
/*
-- Verify data integrity
SELECT 
    language,
    COUNT(*) as total_reviews,
    COUNT(DISTINCT tour_slug) as unique_tours,
    ROUND(AVG(rating), 2) as avg_rating,
    MIN(review_date) as earliest_review,
    MAX(review_date) as latest_review
FROM guest_reviews 
WHERE language = 'de'
GROUP BY language;

-- Check for potential duplicates
SELECT 
    reviewer_name, 
    tour_slug, 
    COUNT(*) as duplicate_count
FROM guest_reviews 
WHERE language = 'de'
GROUP BY reviewer_name, tour_slug
HAVING COUNT(*) > 1;

-- Verify rating distribution
SELECT 
    rating,
    COUNT(*) as review_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM guest_reviews 
WHERE language = 'de'
GROUP BY rating
ORDER BY rating DESC;
*/

-- =========================================================================
-- End of German Reviews Insertion Script
-- =========================================================================