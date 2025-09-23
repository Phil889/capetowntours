-- Execute Database Translations for Cape Town Safari Tours
-- This script contains the actual translation data to be inserted into the database
-- Run this after verifying the MCP connection is working

-- =====================================================
-- TOURS TRANSLATIONS
-- =====================================================

-- Tour 1: Table Mountain Cable Car Tour
INSERT INTO translations (table_name, record_id, locale, field_name, translated_value) VALUES
-- German
('tours', 1, 'de', 'title', 'Tafelberg-Seilbahn Tour'),
('tours', 1, 'de', 'description', 'Erleben Sie atemberaubende Panoramablicke auf Kapstadt und die Umgebung mit der berühmten Tafelberg-Seilbahn. Diese ikonische Attraktion bietet eine unvergessliche Reise zum Gipfel des Tafelbergs, wo Sie spektakuläre 360-Grad-Ausblicke genießen können.'),
('tours', 1, 'de', 'location', 'Tafelberg, Kapstadt'),
-- French
('tours', 1, 'fr', 'title', 'Tour du Téléphérique de Table Mountain'),
('tours', 1, 'fr', 'description', 'Découvrez des vues panoramiques à couper le souffle sur Le Cap et ses environs avec le célèbre téléphérique de Table Mountain. Cette attraction emblématique offre un voyage inoubliable au sommet de Table Mountain, où vous pourrez profiter de vues spectaculaires à 360 degrés.'),
('tours', 1, 'fr', 'location', 'Table Mountain, Le Cap'),
-- Spanish
('tours', 1, 'es', 'title', 'Tour del Teleférico de Table Mountain'),
('tours', 1, 'es', 'description', 'Experimenta vistas panorámicas impresionantes de Ciudad del Cabo y sus alrededores con el famoso teleférico de Table Mountain. Esta atracción icónica ofrece un viaje inolvidable a la cima de Table Mountain, donde podrás disfrutar de vistas espectaculares de 360 grados.'),
('tours', 1, 'es', 'location', 'Table Mountain, Ciudad del Cabo'),
-- Arabic
('tours', 1, 'ar', 'title', 'جولة التلفريك في جبل الطاولة'),
('tours', 1, 'ar', 'description', 'استمتع بإطلالات بانورامية خلابة على كيب تاون والمناطق المحيطة بها مع التلفريك الشهير في جبل الطاولة. تقدم هذه المعلم الأيقوني رحلة لا تُنسى إلى قمة جبل الطاولة، حيث يمكنك الاستمتاع بإطلالات رائعة بزاوية 360 درجة.'),
('tours', 1, 'ar', 'location', 'جبل الطاولة، كيب تاون');

-- Tour 2: Cape Point & Penguins Full Day Tour
INSERT INTO translations (table_name, record_id, locale, field_name, translated_value) VALUES
-- German
('tours', 2, 'de', 'title', 'Kap der Guten Hoffnung & Pinguine Ganztagestour'),
('tours', 2, 'de', 'description', 'Entdecken Sie die dramatische Schönheit des Kap der Guten Hoffnung und besuchen Sie die bezaubernden Pinguine am Boulders Beach. Diese ganztägige Tour führt Sie durch einige der spektakulärsten Landschaften Südafrikas.'),
('tours', 2, 'de', 'location', 'Kap der Guten Hoffnung, Boulders Beach'),
-- French
('tours', 2, 'fr', 'title', 'Tour d''une Journée Complète du Cap de Bonne-Espérance et des Manchots'),
('tours', 2, 'fr', 'description', 'Découvrez la beauté dramatique du Cap de Bonne-Espérance et visitez les charmants manchots de Boulders Beach. Cette excursion d''une journée complète vous emmène à travers certains des paysages les plus spectaculaires d''Afrique du Sud.'),
('tours', 2, 'fr', 'location', 'Cap de Bonne-Espérance, Boulders Beach'),
-- Spanish
('tours', 2, 'es', 'title', 'Tour de Día Completo al Cabo de Buena Esperanza y Pingüinos'),
('tours', 2, 'es', 'description', 'Descubre la belleza dramática del Cabo de Buena Esperanza y visita los encantadores pingüinos en Boulders Beach. Este tour de día completo te lleva a través de algunos de los paisajes más espectaculares de Sudáfrica.'),
('tours', 2, 'es', 'location', 'Cabo de Buena Esperanza, Boulders Beach'),
-- Arabic
('tours', 2, 'ar', 'title', 'جولة يوم كامل إلى رأس الرجاء الصالح والبطاريق'),
('tours', 2, 'ar', 'description', 'اكتشف الجمال الدراماتيكي لرأس الرجاء الصالح وقم بزيارة البطاريق الساحرة في شاطئ بولدرز. تأخذك هذه الجولة ليوم كامل عبر بعض من أروع المناظر الطبيعية في جنوب أفريقيا.'),
('tours', 2, 'ar', 'location', 'رأس الرجاء الصالح، شاطئ بولدرز');

-- Tour 3: Wine Tasting in Stellenbosch
INSERT INTO translations (table_name, record_id, locale, field_name, translated_value) VALUES
-- German
('tours', 3, 'de', 'title', 'Weinverkostung in Stellenbosch'),
('tours', 3, 'de', 'description', 'Genießen Sie eine exquisite Weinverkostung in der historischen Stadt Stellenbosch, dem Herzen der südafrikanischen Weinregion. Besuchen Sie preisgekrönte Weingüter und probieren Sie weltklasse Weine inmitten atemberaubender Landschaften.'),
('tours', 3, 'de', 'location', 'Stellenbosch Weinregion'),
-- French
('tours', 3, 'fr', 'title', 'Dégustation de Vins à Stellenbosch'),
('tours', 3, 'fr', 'description', 'Profitez d''une dégustation de vins exquise dans la ville historique de Stellenbosch, le cœur de la région viticole sud-africaine. Visitez des domaines viticoles primés et dégustez des vins de classe mondiale au milieu de paysages à couper le souffle.'),
('tours', 3, 'fr', 'location', 'Région Viticole de Stellenbosch'),
-- Spanish
('tours', 3, 'es', 'title', 'Cata de Vinos en Stellenbosch'),
('tours', 3, 'es', 'description', 'Disfruta de una exquisita cata de vinos en la histórica ciudad de Stellenbosch, el corazón de la región vinícola sudafricana. Visita bodegas galardonadas y prueba vinos de clase mundial en medio de paisajes impresionantes.'),
('tours', 3, 'es', 'location', 'Región Vinícola de Stellenbosch'),
-- Arabic
('tours', 3, 'ar', 'title', 'تذوق النبيذ في ستيلينبوش'),
('tours', 3, 'ar', 'description', 'استمتع بتذوق نبيذ رائع في مدينة ستيلينبوش التاريخية، قلب منطقة النبيذ في جنوب أفريقيا. قم بزيارة مصانع النبيذ الحائزة على جوائز وتذوق نبيذ عالمي الطراز وسط مناظر طبيعية خلابة.'),
('tours', 3, 'ar', 'location', 'منطقة النبيذ في ستيلينبوش');

-- Tour 4: Robben Island Historical Tour
INSERT INTO translations (table_name, record_id, locale, field_name, translated_value) VALUES
-- German
('tours', 4, 'de', 'title', 'Robben Island Historische Tour'),
('tours', 4, 'de', 'description', 'Besuchen Sie die UNESCO-Welterbestätte Robben Island, wo Nelson Mandela 18 Jahre inhaftiert war. Diese bewegende Tour bietet einen tiefen Einblick in Südafrikas Kampf für Freiheit und Demokratie.'),
('tours', 4, 'de', 'location', 'Robben Island, Kapstadt'),
-- French
('tours', 4, 'fr', 'title', 'Tour Historique de Robben Island'),
('tours', 4, 'fr', 'description', 'Visitez le site du patrimoine mondial de l''UNESCO Robben Island, où Nelson Mandela a été emprisonné pendant 18 ans. Cette visite émouvante offre un aperçu profond de la lutte de l''Afrique du Sud pour la liberté et la démocratie.'),
('tours', 4, 'fr', 'location', 'Robben Island, Le Cap'),
-- Spanish
('tours', 4, 'es', 'title', 'Tour Histórico de Robben Island'),
('tours', 4, 'es', 'description', 'Visita el sitio del Patrimonio Mundial de la UNESCO Robben Island, donde Nelson Mandela estuvo encarcelado durante 18 años. Este tour conmovedor ofrece una visión profunda de la lucha de Sudáfrica por la libertad y la democracia.'),
('tours', 4, 'es', 'location', 'Robben Island, Ciudad del Cabo'),
-- Arabic
('tours', 4, 'ar', 'title', 'جولة تاريخية في جزيرة روبن'),
('tours', 4, 'ar', 'description', 'قم بزيارة موقع التراث العالمي لليونسكو جزيرة روبن، حيث سُجن نيلسون مانديلا لمدة 18 عامًا. تقدم هذه الجولة المؤثرة نظرة عميقة على نضال جنوب أفريقيا من أجل الحرية والديمقراطية.'),
('tours', 4, 'ar', 'location', 'جزيرة روبن، كيب تاون');

-- Tour 5: Township Cultural Experience
INSERT INTO translations (table_name, record_id, locale, field_name, translated_value) VALUES
-- German
('tours', 5, 'de', 'title', 'Township Kulturerlebnis'),
('tours', 5, 'de', 'description', 'Erleben Sie die lebendige Kultur und Gemeinschaft der Kap-Townships. Diese authentische Tour bietet Einblicke in das tägliche Leben, die Geschichte und die Widerstandsfähigkeit der lokalen Gemeinden.'),
('tours', 5, 'de', 'location', 'Langa & Gugulethu Townships'),
-- French
('tours', 5, 'fr', 'title', 'Expérience Culturelle des Townships'),
('tours', 5, 'fr', 'description', 'Découvrez la culture vibrante et la communauté des townships du Cap. Cette visite authentique offre un aperçu de la vie quotidienne, de l''histoire et de la résilience des communautés locales.'),
('tours', 5, 'fr', 'location', 'Townships de Langa et Gugulethu'),
-- Spanish
('tours', 5, 'es', 'title', 'Experiencia Cultural de los Townships'),
('tours', 5, 'es', 'description', 'Experimenta la cultura vibrante y la comunidad de los townships del Cabo. Este tour auténtico ofrece perspectivas sobre la vida diaria, la historia y la resistencia de las comunidades locales.'),
('tours', 5, 'es', 'location', 'Townships de Langa y Gugulethu'),
-- Arabic
('tours', 5, 'ar', 'title', 'تجربة ثقافية في الأحياء الشعبية'),
('tours', 5, 'ar', 'description', 'اختبر الثقافة النابضة بالحياة والمجتمع في أحياء كيب تاون الشعبية. تقدم هذه الجولة الأصيلة نظرة على الحياة اليومية والتاريخ ومرونة المجتمعات المحلية.'),
('tours', 5, 'ar', 'location', 'أحياء لانغا وغوغوليتو الشعبية');

-- Tour 6: Shark Cage Diving Adventure
INSERT INTO translations (table_name, record_id, locale, field_name, translated_value) VALUES
-- German
('tours', 6, 'de', 'title', 'Hai-Käfigtauchen Abenteuer'),
('tours', 6, 'de', 'description', 'Erleben Sie den ultimativen Adrenalinstoß beim Käfigtauchen mit Weißen Haien vor der Küste von Gansbaai. Diese aufregende Erfahrung bringt Sie diesen majestätischen Raubtieren sicher näher.'),
('tours', 6, 'de', 'location', 'Gansbaai, Shark Alley'),
-- French
('tours', 6, 'fr', 'title', 'Aventure de Plongée en Cage avec les Requins'),
('tours', 6, 'fr', 'description', 'Vivez la montée d''adrénaline ultime en plongeant en cage avec les grands requins blancs au large de Gansbaai. Cette expérience palpitante vous rapproche en toute sécurité de ces prédateurs majestueux.'),
('tours', 6, 'fr', 'location', 'Gansbaai, Shark Alley'),
-- Spanish
('tours', 6, 'es', 'title', 'Aventura de Buceo en Jaula con Tiburones'),
('tours', 6, 'es', 'description', 'Experimenta la máxima descarga de adrenalina buceando en jaula con grandes tiburones blancos frente a la costa de Gansbaai. Esta emocionante experiencia te acerca de forma segura a estos majestuosos depredadores.'),
('tours', 6, 'es', 'location', 'Gansbaai, Shark Alley'),
-- Arabic
('tours', 6, 'ar', 'title', 'مغامرة الغوص في قفص مع أسماك القرش'),
('tours', 6, 'ar', 'description', 'اختبر الإثارة القصوى بالغوص في قفص مع أسماك القرش البيضاء الكبيرة قبالة ساحل غانسباي. تقربك هذه التجربة المثيرة بأمان من هذه الحيوانات المفترسة المهيبة.'),
('tours', 6, 'ar', 'location', 'غانسباي، زقاق القرش');

-- Tour 7: Garden Route 3-Day Safari
INSERT INTO translations (table_name, record_id, locale, field_name, translated_value) VALUES
-- German
('tours', 7, 'de', 'title', 'Garden Route 3-Tage Safari'),
('tours', 7, 'de', 'description', 'Begeben Sie sich auf eine unvergessliche 3-tägige Safari entlang der berühmten Garden Route. Erleben Sie vielfältige Landschaften, Wildtiere und charmante Küstenstädte auf dieser umfassenden Reise.'),
('tours', 7, 'de', 'location', 'Garden Route, Ostkap'),
-- French
('tours', 7, 'fr', 'title', 'Safari de 3 Jours sur la Route des Jardins'),
('tours', 7, 'fr', 'description', 'Embarquez pour un safari inoubliable de 3 jours le long de la célèbre Route des Jardins. Découvrez des paysages diversifiés, la faune et de charmantes villes côtières lors de ce voyage complet.'),
('tours', 7, 'fr', 'location', 'Route des Jardins, Cap-Oriental'),
-- Spanish
('tours', 7, 'es', 'title', 'Safari de 3 Días por la Ruta Jardín'),
('tours', 7, 'es', 'description', 'Embárcate en un safari inolvidable de 3 días a lo largo de la famosa Ruta Jardín. Experimenta paisajes diversos, vida silvestre y encantadoras ciudades costeras en este viaje integral.'),
('tours', 7, 'es', 'location', 'Ruta Jardín, Cabo Oriental'),
-- Arabic
('tours', 7, 'ar', 'title', 'رحلة سفاري 3 أيام في طريق الحديقة'),
('tours', 7, 'ar', 'description', 'انطلق في رحلة سفاري لا تُنسى لمدة 3 أيام على طول طريق الحديقة الشهير. اختبر المناظر الطبيعية المتنوعة والحياة البرية والمدن الساحلية الساحرة في هذه الرحلة الشاملة.'),
('tours', 7, 'ar', 'location', 'طريق الحديقة، الكاب الشرقي');

-- Tour 8: Hermanus Whale Watching
INSERT INTO translations (table_name, record_id, locale, field_name, translated_value) VALUES
-- German
('tours', 8, 'de', 'title', 'Hermanus Walbeobachtung'),
('tours', 8, 'de', 'description', 'Erleben Sie die majestätischen Südkaper-Wale in ihrem natürlichen Lebensraum vor der Küste von Hermanus. Diese saisonale Tour bietet einige der besten landbasierten Walbeobachtungen der Welt.'),
('tours', 8, 'de', 'location', 'Hermanus, Walker Bay'),
-- French
('tours', 8, 'fr', 'title', 'Observation des Baleines à Hermanus'),
('tours', 8, 'fr', 'description', 'Découvrez les majestueuses baleines franches australes dans leur habitat naturel au large d''Hermanus. Cette visite saisonnière offre certaines des meilleures observations de baleines depuis la terre au monde.'),
('tours', 8, 'fr', 'location', 'Hermanus, Baie Walker'),
-- Spanish
('tours', 8, 'es', 'title', 'Avistamiento de Ballenas en Hermanus'),
('tours', 8, 'es', 'description', 'Experimenta las majestuosas ballenas francas australes en su hábitat natural frente a la costa de Hermanus. Este tour estacional ofrece algunos de los mejores avistamientos de ballenas desde tierra del mundo.'),
('tours', 8, 'es', 'location', 'Hermanus, Bahía Walker'),
-- Arabic
('tours', 8, 'ar', 'title', 'مراقبة الحيتان في هيرمانوس'),
('tours', 8, 'ar', 'description', 'اختبر الحيتان الجنوبية المهيبة في موطنها الطبيعي قبالة ساحل هيرمانوس. تقدم هذه الجولة الموسمية بعضًا من أفضل مراقبة الحيتان من البر في العالم.'),
('tours', 8, 'ar', 'location', 'هيرمانوس، خليج ووكر');

-- =====================================================
-- BLOG POSTS TRANSLATIONS
-- =====================================================

-- Blog Post 1: Top 10 Must-Visit Attractions in Cape Town
INSERT INTO translations (table_name, record_id, locale, field_name, translated_value) VALUES
-- German
('blog_posts', 1, 'de', 'title', 'Top 10 Sehenswürdigkeiten in Kapstadt, die Sie besuchen müssen'),
('blog_posts', 1, 'de', 'excerpt', 'Entdecken Sie die besten Attraktionen, die Kapstadt zu einem der beliebtesten Reiseziele der Welt machen.'),
('blog_posts', 1, 'de', 'meta_description', 'Entdecken Sie die Top 10 Sehenswürdigkeiten in Kapstadt, von der Tafelberg-Seilbahn bis zu den Pinguinen am Boulders Beach. Ihr ultimativer Kapstadt-Reiseführer.'),
-- French
('blog_posts', 1, 'fr', 'title', 'Top 10 des Attractions Incontournables au Cap'),
('blog_posts', 1, 'fr', 'excerpt', 'Découvrez les meilleures attractions qui font du Cap l''une des destinations les plus populaires au monde.'),
('blog_posts', 1, 'fr', 'meta_description', 'Découvrez le top 10 des attractions incontournables au Cap, du téléphérique de Table Mountain aux manchots de Boulders Beach. Votre guide ultime du Cap.'),
-- Spanish
('blog_posts', 1, 'es', 'title', 'Top 10 Atracciones Imprescindibles en Ciudad del Cabo'),
('blog_posts', 1, 'es', 'excerpt', 'Descubre las mejores atracciones que hacen de Ciudad del Cabo uno de los destinos más populares del mundo.'),
('blog_posts', 1, 'es', 'meta_description', 'Descubre las top 10 atracciones imprescindibles en Ciudad del Cabo, desde el teleférico de Table Mountain hasta los pingüinos de Boulders Beach. Tu guía definitiva de Ciudad del Cabo.'),
-- Arabic
('blog_posts', 1, 'ar', 'title', 'أفضل 10 معالم يجب زيارتها في كيب تاون'),
('blog_posts', 1, 'ar', 'excerpt', 'اكتشف أفضل المعالم التي تجعل كيب تاون واحدة من أشهر الوجهات السياحية في العالم.'),
('blog_posts', 1, 'ar', 'meta_description', 'اكتشف أفضل 10 معالم يجب زيارتها في كيب تاون، من تلفريك جبل الطاولة إلى البطاريق في شاطئ بولدرز. دليلك الشامل لكيب تاون.');

-- Blog Post 2: Best Time to Visit Cape Town
INSERT INTO translations (table_name, record_id, locale, field_name, translated_value) VALUES
-- German
('blog_posts', 2, 'de', 'title', 'Die beste Reisezeit für Kapstadt'),
('blog_posts', 2, 'de', 'excerpt', 'Planen Sie Ihre Kapstadt-Reise mit unserem umfassenden Leitfaden zu Wetter, Jahreszeiten und besonderen Ereignissen.'),
('blog_posts', 2, 'de', 'meta_description', 'Entdecken Sie die beste Reisezeit für Kapstadt. Umfassender Leitfaden zu Wetter, Jahreszeiten und Aktivitäten für Ihre perfekte Südafrika-Reise.'),
-- French
('blog_posts', 2, 'fr', 'title', 'Meilleure Période pour Visiter Le Cap'),
('blog_posts', 2, 'fr', 'excerpt', 'Planifiez votre voyage au Cap avec notre guide complet sur la météo, les saisons et les événements spéciaux.'),
('blog_posts', 2, 'fr', 'meta_description', 'Découvrez la meilleure période pour visiter Le Cap. Guide complet sur la météo, les saisons et les activités pour votre voyage parfait en Afrique du Sud.'),
-- Spanish
('blog_posts', 2, 'es', 'title', 'Mejor Época para Visitar Ciudad del Cabo'),
('blog_posts', 2, 'es', 'excerpt', 'Planifica tu viaje a Ciudad del Cabo con nuestra guía completa sobre clima, estaciones y eventos especiales.'),
('blog_posts', 2, 'es', 'meta_description', 'Descubre la mejor época para visitar Ciudad del Cabo. Guía completa sobre clima, estaciones y actividades para tu viaje perfecto a Sudáfrica.'),
-- Arabic
('blog_posts', 2, 'ar', 'title', 'أفضل وقت لزيارة كيب تاون'),
('blog_posts', 2, 'ar', 'excerpt', 'خطط لرحلتك إلى كيب تاون مع دليلنا الشامل حول الطقس والمواسم والأحداث الخاصة.'),
('blog_posts', 2, 'ar', 'meta_description', 'اكتشف أفضل وقت لزيارة كيب تاون. دليل شامل حول الطقس والمواسم والأنشطة لرحلتك المثالية إلى جنوب أفريقيا.');

-- =====================================================
-- VALIDATION QUERIES
-- =====================================================

-- Check translation completeness
SELECT 
    table_name,
    record_id,
    COUNT(DISTINCT locale) as translated_locales,
    array_agg(DISTINCT locale ORDER BY locale) as available_locales
FROM translations 
GROUP BY table_name, record_id
ORDER BY table_name, record_id;

-- Check for missing translations
WITH required_translations AS (
    SELECT 
        'tours' as table_name,
        t.id as record_id,
        t.title as original_title,
        l.locale
    FROM tours t
    CROSS JOIN (VALUES ('de'), ('fr'), ('es'), ('ar')) l(locale)
    
    UNION ALL
    
    SELECT 
        'blog_posts' as table_name,
        bp.id as record_id,
        bp.title as original_title,
        l.locale
    FROM blog_posts bp
    CROSS JOIN (VALUES ('de'), ('fr'), ('es'), ('ar')) l(locale)
)
SELECT 
    rt.table_name,
    rt.record_id,
    rt.original_title,
    rt.locale,
    'MISSING' as status
FROM required_translations rt
LEFT JOIN translations tr ON rt.table_name = tr.table_name 
    AND rt.record_id = tr.record_id 
    AND rt.locale = tr.locale
    AND tr.field_name = 'title'
WHERE tr.id IS NULL
ORDER BY rt.table_name, rt.record_id, rt.locale;

-- Summary report
SELECT 
    'TOURS' as content_type,
    COUNT(DISTINCT t.id) as total_items,
    COUNT(DISTINCT tr.record_id) as translated_items,
    COUNT(DISTINCT tr.record_id) * 100.0 / COUNT(DISTINCT t.id) as completion_percentage
FROM tours t
LEFT JOIN translations tr ON t.id = tr.record_id AND tr.table_name = 'tours'

UNION ALL

SELECT 
    'BLOG_POSTS' as content_type,
    COUNT(DISTINCT bp.id) as total_items,
    COUNT(DISTINCT tr.record_id) as translated_items,
    COUNT(DISTINCT tr.record_id) * 100.0 / COUNT(DISTINCT bp.id) as completion_percentage
FROM blog_posts bp
LEFT JOIN translations tr ON bp.id = tr.record_id AND tr.table_name = 'blog_posts';