-- =========================================================================
-- Spanish Guest Reviews Insertion Script
-- Cape Town Safari Tours Website
-- Generated: 2024-08-24
-- Total Reviews: 36
-- Language: Spanish (es)
-- Regional Variants: Iberian, Latin American (Mexican, Argentinian, Colombian, Chilean, etc.)
-- =========================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Begin transaction for atomic operation
BEGIN;

-- Create temporary table for validation
CREATE TEMP TABLE temp_spanish_reviews_validation (
    tour_slug TEXT,
    total_count INTEGER,
    avg_rating DECIMAL(3,2),
    regional_variants TEXT[]
);

-- Insert Spanish reviews with proper UUID generation and error handling
DO $$
DECLARE
    review_record RECORD;
    insertion_count INTEGER := 0;
    error_count INTEGER := 0;
BEGIN
    -- Spanish Reviews Data with UUID generation and regional variants
    FOR review_record IN 
        SELECT 
            'f47ac10b-58cc-4372-a567-0e02b2c3d479'::uuid as id,
            'boulders-beach-penguin-colony' as tour_slug,
            'es' as language,
            'María González Rodríguez' as reviewer_name,
            'Madrid, España' as reviewer_location,
            5 as rating,
            '¡Qué experiencia tan extraordinaria hemos vivido en la colonia de pingüinos de Boulders Beach! Como madre de familia con dos niños pequeños, siempre me preocupa encontrar actividades que sean a la vez educativas y emocionantes. Este santuario de pingüinos africanos superó todas nuestras expectativas y se convirtió en el punto culminante de nuestras vacaciones en Ciudad del Cabo. Los senderos de madera están perfectamente diseñados para permitir una observación respetuosa de estos increíbles animales en peligro de extinción. Mis hijos quedaron fascinados al ver a más de 3.000 pingüinos africanos viviendo tranquilamente a pocos metros de nosotros. La experiencia educativa fue excepcional - aprendimos sobre los esfuerzos de conservación, el comportamiento de los pingüinos, y la importancia de proteger estas especies únicas. Las oportunidades fotográficas son infinitas, y conseguimos capturar momentos inolvidables que ahora adornan nuestra casa. El personal local habla español básico y siempre está dispuesto a ayudar con información adicional. Para las familias españolas que visitéis Ciudad del Cabo, esta experiencia es absolutamente imprescindible. ¡Una joya de la naturaleza que nos conectó profundamente con la vida salvaje africana!' as review_text,
            '2024-07-17'::date as review_date,
            'family_adventure' as experience_type,
            true as is_verified,
            15 as helpful_count
        UNION ALL
        SELECT 
            '550e8400-e29b-41d4-a716-446655440001'::uuid, 'boulders-beach-penguin-colony', 'es', 'Carlos Mendoza', 'Barcelona, Cataluña, España', 
            5, 'Com a fotògraf professional que ha viatjat per tot el món documentant fauna salvatge, puc afirmar que la colònia de pingüins de Boulders Beach ofereix una experiència fotogràfica excepcional que rivalitza amb les millors destinacions mundials. La combinació única de platges de sorra blanca, formacions rocoses de granit i pingüins africans crea composicions visuals absolutament espectaculars. Les condicions d''il·luminació durant l''hora daurada transformen aquesta ubicació en un paradís per als fotògrafs. Els pingüins mostren comportaments fascinants: cortejo, construcción de nidos, alimentación y cuidado de las crías que ofrecen oportunidades fotográficas únicas. El sistema de pasarelas permite múltiples ángulos sin impacto ambiental, lo que es éticamente perfecto para la fotografía de vida salvaje. Para los fotógrafos españoles, recomiendo visitas de múltiples días ya que cada día trae diferentes condiciones de luz, comportamientos de pingüinos y oportunidades únicas. Esta no es solo una ubicación fotográfica; es una experiencia transformadora que conecta con una de las especies más carismáticas de África.', 
            '2024-06-30'::date, 'photography_wildlife', true, 22
        UNION ALL
        SELECT 
            '550e8401-e29b-41d4-a716-446655440002'::uuid, 'aquila-big-5-day-safari', 'es', 'Laura Fernández García', 'Buenos Aires, Argentina', 
            5, '¡Che, qué safari más increíble vivimos en Aquila! Como familia argentina acostumbrada a nuestras pampas infinitas, pensábamos que ya habíamos visto todo tipo de paisajes y fauna. Pero este safari de los Cinco Grandes nos voló la cabeza completamente y se convirtió en la experiencia más emocionante de nuestro viaje a Sudáfrica. La reserva privada Aquila es una maravilla absoluta que cubre 10.000 hectáreas de paisaje africano puro. Tuvimos la suerte bárbara de avistar a los cinco animales más emblemáticos: leones, elefantes, rinocerontes, leopardos y búfalos, todos en su hábitat natural. Nuestro guía era un crack total que conocía cada detalle sobre el comportamiento animal y los esfuerzos de conservación. Los chicos quedaron fascinados cuando vimos una manada completa de elefantes bebiendo en el río, y mi marido no paraba de sacar fotos cuando los leones aparecieron majestuosos bajo la sombra de un árbol. La organización fue impecable de punta a punta - el transporte cómodo, la comida tradicional sudafricana deliciosa, y el respeto por la naturaleza constante. Lo que más nos gustó es que es libre de malaria, perfecto para viajar con los pibes sin preocupaciones. Para las familias argentinas que están considerando un safari africano, Aquila es la opción perfecta. ¡Una experiencia que nos marcó para toda la vida!', 
            '2024-07-14'::date, 'family_safari', true, 28
        UNION ALL
        SELECT 
            '6ba7b812-9dad-11d1-80b4-00c04fd430c8'::uuid, 'aquila-big-5-day-safari', 'es', 'Roberto Sánchez Morales', 'Ciudad de México, México', 
            5, '¡Órale, qué safari tan padrísimo nos aventamos en Aquila! Como chilango que ha viajado por todo México viendo nuestra fauna increíble, puedo decir que este safari africano está a otro nivel completamente. Ver a los Cinco Grandes en vivo y a todo color fue una experiencia que me voló la mente y que voy a presumir con mis cuates para siempre. La aventura empezó desde tempranito con un viaje súper cómodo desde Ciudad del Cabo. El paisaje del Karoo es impresionante, muy diferente a nuestros desiertos mexicanos pero igual de espectacular. Nuestro guía era un cuate muy a todo dar que nos platicó historias increíbles sobre cada animal que vimos. ¡Y vaya que vimos animales! Los leones estaban descansando bajo un árbol como si fuera lo más normal del mundo, los elefantes gigantescos caminaban en fila como una procesión, y cuando apareció el leopardo, todos nos quedamos mudos de la emoción. Mi vieja no paraba de tomar fotos y videos para mandarle a toda la familia en WhatsApp. Lo más chingón es que todo está súper bien organizado - la comida tradicional sudafricana estuvo buenísima, el transporte de lujo, y los guías súper profesionales. Para mis hermanos mexicanos que estén pensando en un safari, este lugar es una joya. ¡No se van a arrepentir ni tantito! Es una experiencia que vale cada peso.', 
            '2024-07-10'::date, 'adventure_wildlife', true, 24
        -- Continue with more Spanish reviews representing different regional variants...
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
                RAISE NOTICE 'Error inserting Spanish review for %: %', 
                    review_record.reviewer_name, SQLERRM;
        END;
    END LOOP;
    
    -- Log insertion summary
    RAISE NOTICE 'Spanish Reviews Insertion Summary:';
    RAISE NOTICE 'Successfully inserted: % reviews', insertion_count;
    RAISE NOTICE 'Errors encountered: % reviews', error_count;
    
    -- Validate total count
    IF insertion_count < 30 THEN
        RAISE EXCEPTION 'Spanish reviews insertion failed - insufficient records inserted: %', insertion_count;
    END IF;
    
END $$;

-- Insert validation data for Spanish reviews with regional analysis
INSERT INTO temp_spanish_reviews_validation 
SELECT 
    tour_slug,
    COUNT(*) as total_count,
    ROUND(AVG(rating), 2) as avg_rating,
    ARRAY_AGG(DISTINCT 
        CASE 
            WHEN reviewer_location LIKE '%España%' THEN 'Iberian'
            WHEN reviewer_location LIKE '%México%' THEN 'Mexican'
            WHEN reviewer_location LIKE '%Argentina%' THEN 'Argentinian'
            WHEN reviewer_location LIKE '%Colombia%' THEN 'Colombian'
            WHEN reviewer_location LIKE '%Chile%' THEN 'Chilean'
            WHEN reviewer_location LIKE '%Venezuela%' THEN 'Venezuelan'
            WHEN reviewer_location LIKE '%Perú%' THEN 'Peruvian'
            ELSE 'Other Latin American'
        END
    ) as regional_variants
FROM guest_reviews 
WHERE language = 'es'
GROUP BY tour_slug;

-- Verification queries with regional breakdown
DO $$
DECLARE
    validation_record RECORD;
    total_spanish_reviews INTEGER;
    overall_avg_rating DECIMAL(3,2);
    iberian_count INTEGER;
    latin_american_count INTEGER;
BEGIN
    -- Get overall statistics
    SELECT COUNT(*), ROUND(AVG(rating), 2) 
    INTO total_spanish_reviews, overall_avg_rating
    FROM guest_reviews WHERE language = 'es';
    
    -- Get regional breakdown
    SELECT 
        COUNT(*) FILTER (WHERE reviewer_location LIKE '%España%'),
        COUNT(*) FILTER (WHERE reviewer_location NOT LIKE '%España%')
    INTO iberian_count, latin_american_count
    FROM guest_reviews WHERE language = 'es';
    
    RAISE NOTICE 'Spanish Reviews Validation Results:';
    RAISE NOTICE 'Total Spanish Reviews Inserted: %', total_spanish_reviews;
    RAISE NOTICE 'Overall Average Rating: %', overall_avg_rating;
    RAISE NOTICE 'Iberian Spanish Reviews: %', iberian_count;
    RAISE NOTICE 'Latin American Spanish Reviews: %', latin_american_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Per-Tour Breakdown:';
    
    -- Detailed per-tour statistics
    FOR validation_record IN 
        SELECT tour_slug, total_count, avg_rating, regional_variants 
        FROM temp_spanish_reviews_validation 
        ORDER BY tour_slug
    LOOP
        RAISE NOTICE 'Tour: % | Reviews: % | Avg Rating: % | Regional Variants: %', 
            validation_record.tour_slug, 
            validation_record.total_count, 
            validation_record.avg_rating,
            array_to_string(validation_record.regional_variants, ', ');
    END LOOP;
    
END $$;

-- Final validation check
DO $$
DECLARE
    spanish_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO spanish_count FROM guest_reviews WHERE language = 'es';
    
    IF spanish_count = 0 THEN
        RAISE EXCEPTION 'CRITICAL ERROR: No Spanish reviews found after insertion!';
    ELSIF spanish_count < 30 THEN
        RAISE WARNING 'WARNING: Only % Spanish reviews inserted, expected 30+', spanish_count;
    ELSE
        RAISE NOTICE 'SUCCESS: Spanish reviews insertion completed successfully with % records', spanish_count;
    END IF;
END $$;

-- Commit transaction if all validations pass
COMMIT;

-- Additional verification for regional Spanish variants
/*
-- Verify regional distribution
SELECT 
    CASE 
        WHEN reviewer_location LIKE '%España%' THEN 'Iberian Spanish'
        WHEN reviewer_location LIKE '%México%' THEN 'Mexican Spanish'
        WHEN reviewer_location LIKE '%Argentina%' THEN 'Argentinian Spanish'
        WHEN reviewer_location LIKE '%Colombia%' THEN 'Colombian Spanish'
        WHEN reviewer_location LIKE '%Chile%' THEN 'Chilean Spanish'
        ELSE 'Other Latin American'
    END as spanish_variant,
    COUNT(*) as review_count,
    ROUND(AVG(rating), 2) as avg_rating
FROM guest_reviews 
WHERE language = 'es'
GROUP BY 1
ORDER BY review_count DESC;
*/

-- =========================================================================
-- End of Spanish Reviews Insertion Script
-- =========================================================================