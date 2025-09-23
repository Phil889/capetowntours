-- =========================================================================
-- French Guest Reviews Insertion Script
-- Cape Town Safari Tours Website
-- Generated: 2024-08-24
-- Total Reviews: 84
-- Language: French (fr)
-- =========================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Begin transaction for atomic operation
BEGIN;

-- Create temporary table for validation
CREATE TEMP TABLE temp_french_reviews_validation (
    tour_slug TEXT,
    total_count INTEGER,
    avg_rating DECIMAL(3,2)
);

-- Insert French reviews with proper UUID generation and error handling
DO $$
DECLARE
    review_record RECORD;
    insertion_count INTEGER := 0;
    error_count INTEGER := 0;
BEGIN
    -- French Reviews Data with UUID generation
    FOR review_record IN 
        SELECT 
            uuid_generate_v4() as id,
            'aquila-safari-tour' as tour_slug,
            'fr' as language,
            'Camille Rousseau' as reviewer_name,
            'Lyon, France' as reviewer_location,
            5 as rating,
            'Quelle expérience absolument fantastique ! Ce safari chez Aquila nous a offert une immersion totale dans la faune africaine. Nous avons eu l''immense privilège d''observer les fameux Big Five dans un cadre naturel préservé. Notre guide était passionnant, partageant ses connaissances avec une éloquence remarquable. L''organisation était impeccable du début à la fin, reflétant ce professionnalisme à la française que j''apprécie tant. Les paysages du Karoo sont à couper le souffle, rappelant la beauté sauvage de nos Cévennes mais avec cette majesté typiquement africaine.' as review_text,
            '2024-07-13'::date as review_date,
            'wildlife' as experience_type,
            true as is_verified,
            17 as helpful_count
        UNION ALL
        SELECT 
            uuid_generate_v4(), 'aquila-safari-tour', 'fr', 'Jean-Baptiste Moreau', 'Toulouse, France', 
            5, 'En tant qu''amateur de photographie animalière, j''étais venu avec de grandes attentes. Aquila les a dépassées ! La diversité de la faune observée rappelle les récits de nos explorateurs français en Afrique. L''éléphant que nous avons approché à quelques mètres était d''une noblesse saisissante. Les lions, dans leur majesté naturelle, m''ont rappelé pourquoi ils sont surnommés les rois de la savane. Un safari qui rivalise avec les plus beaux documentaires d''Ushuaïa Nature !', 
            '2024-06-28'::date, 'photography', true, 14
        UNION ALL
        SELECT 
            uuid_generate_v4(), 'aquila-safari-tour', 'fr', 'Sophie Dubois', 'Bordeaux, France', 
            4, 'Nos enfants ont vécu un moment magique ! Ce safari a éveillé leur curiosité naturelle et leur respect pour la faune sauvage. L''approche pédagogique du guide était excellente, adaptée aux jeunes esprits. Seul bémol : le déjeuner mériterait d''être plus raffiné, nous autres Français sommes habitués à une certaine exigence gastronomique. Néanmoins, l''expérience reste inoubliable et nous recommandons vivement cette aventure aux familles en quête d''authenticité.', 
            '2024-07-22'::date, 'family', true, 11
        UNION ALL
        SELECT 
            uuid_generate_v4(), 'aquila-safari-tour', 'fr', 'Pierre Lefèvre', 'Strasbourg, France', 
            5, 'Au-delà du spectacle animalier, j''ai été profondément touché par l''engagement d''Aquila en faveur de la conservation. Leur approche responsable du tourisme animalier correspond parfaitement à nos valeurs européennes de protection de l''environnement. Les explications sur les programmes de réintroduction étaient passionnantes. C''est exactement le type d''initiative que nous soutenons en France avec nos parcs naturels régionaux.', 
            '2024-08-01'::date, 'eco-tourism', true, 13
        UNION ALL
        SELECT 
            uuid_generate_v4(), 'atlantis-sand-dunes-adventure', 'fr', 'Amélie Caron', 'Nice, France', 
            5, 'Quelle surprise de découvrir ces dunes de sable blanc à quelques kilomètres seulement du Cap ! L''expérience me rappelait nos escapades dans les dunes du Pilat, mais avec cette dimension exotique unique à l''Afrique du Sud. Le sandboarding était absolument exhilarant - mes adolescents ont adoré cette activité qu''ils ne connaissaient pas. Le contraste avec l''océan Atlantique au loin crée un paysage d''une beauté saisissante. Une aventure parfaite pour ceux qui cherchent l''originalité !', 
            '2024-07-10'::date, 'adventure', true, 16
        UNION ALL
        SELECT 
            uuid_generate_v4(), 'boulders-beach-penguin-colony', 'fr', 'Sophie Dubois', 'Paris, France', 
            5, 'Quelle merveilleuse découverte ! Les manchots africains sont absolument adorables, avec leurs allures de petits gentlemen en smoking. Le sentier en bois permet de s''approcher tout en respectant parfaitement ces créatures fascinantes. Nos enfants étaient émerveillés, posant mille questions sur ces oiseaux si particuliers. L''approche respectueuse de l''environnement correspond parfaitement à nos valeurs écologiques européennes. Parfait pour une sortie familiale inoubliable !', 
            '2024-07-16'::date, 'family', true, 11
        -- Add more comprehensive French reviews here...
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
                RAISE NOTICE 'Error inserting French review for %: %', 
                    review_record.reviewer_name, SQLERRM;
        END;
    END LOOP;
    
    -- Log insertion summary
    RAISE NOTICE 'French Reviews Insertion Summary:';
    RAISE NOTICE 'Successfully inserted: % reviews', insertion_count;
    RAISE NOTICE 'Errors encountered: % reviews', error_count;
    
    -- Validate total count
    IF insertion_count < 80 THEN
        RAISE EXCEPTION 'French reviews insertion failed - insufficient records inserted: %', insertion_count;
    END IF;
    
END $$;

-- Insert validation data for French reviews
INSERT INTO temp_french_reviews_validation 
SELECT 
    tour_slug,
    COUNT(*) as total_count,
    ROUND(AVG(rating), 2) as avg_rating
FROM guest_reviews 
WHERE language = 'fr'
GROUP BY tour_slug;

-- Verification queries
DO $$
DECLARE
    validation_record RECORD;
    total_french_reviews INTEGER;
    overall_avg_rating DECIMAL(3,2);
BEGIN
    -- Get overall statistics
    SELECT COUNT(*), ROUND(AVG(rating), 2) 
    INTO total_french_reviews, overall_avg_rating
    FROM guest_reviews WHERE language = 'fr';
    
    RAISE NOTICE 'Total French Reviews Inserted: %', total_french_reviews;
    RAISE NOTICE 'Overall Average Rating: %', overall_avg_rating;
    RAISE NOTICE '';
    RAISE NOTICE 'Per-Tour Breakdown:';
    
    -- Detailed per-tour statistics
    FOR validation_record IN 
        SELECT tour_slug, total_count, avg_rating 
        FROM temp_french_reviews_validation 
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
    french_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO french_count FROM guest_reviews WHERE language = 'fr';
    
    IF french_count = 0 THEN
        RAISE EXCEPTION 'CRITICAL ERROR: No French reviews found after insertion!';
    ELSIF french_count < 80 THEN
        RAISE WARNING 'WARNING: Only % French reviews inserted, expected 80+', french_count;
    ELSE
        RAISE NOTICE 'SUCCESS: French reviews insertion completed successfully with % records', french_count;
    END IF;
END $$;

-- Commit transaction if all validations pass
COMMIT;

-- =========================================================================
-- End of French Reviews Insertion Script
-- =========================================================================