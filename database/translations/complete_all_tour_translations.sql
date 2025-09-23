-- =============================================
-- COMPLETE COMPREHENSIVE TOUR CONTENT TRANSLATIONS 
-- 1:1 translations for ALL 4 TOURS in ALL 4 LANGUAGES maintaining same depth and detail as English
-- Includes: Aquila Safari, Inverdoorn Safari, Boulders Beach Penguins, Hermanus Whale Watching
-- Languages: German (de), French (fr), Spanish (es), Arabic (ar)
-- =============================================

-- =============================================
-- 1. AQUILA BIG 5 DAY SAFARI TRANSLATIONS (4 languages)
-- =============================================

INSERT INTO tour_translations (
  tour_id, locale, title, description, short_description, highlights, inclusions, exclusions, 
  important_info, what_to_bring, itinerary, faqs, meta_title, meta_description, meta_keywords, 
  translation_quality, translator_notes
) VALUES 

-- German Translation - Aquila
(
  (SELECT id FROM tours WHERE slug = 'aquila-big-5-day-safari' AND locale = 'en'),
  'de',
  'Aquila Big 5 Tages-Safari',
  'Erleben Sie den Nervenkitzel, Afrikas Big 5 in ihrem natürlichen Lebensraum im Aquila Private Game Reserve zu sehen. Dieses ganztägige Safari-Abenteuer umfasst Pirschfahrten, luxuriöse Unterkunftsmöglichkeiten und erfahrene Guides, die Ihnen helfen, Löwen, Elefanten, Nashörner, Leoparden und Büffel zu entdecken.',
  'Ganztägiges Big 5 Safari-Erlebnis im Aquila Private Game Reserve mit erfahrenen Guides.',
  ARRAY['Big 5 Wildtierbeobachtung', 'Professioneller Safari-Guide', 'Luxus-Pirschfahrzeug', 'Traditionelles südafrikanisches Mittagessen', 'Malerische Bergblicke'],
  ARRAY['Hin- und Rücktransport von Kapstadt', 'Professioneller Safari-Guide', 'Pirschfahrt im offenen Safari-Fahrzeug', 'Traditionelles Mittagessen', 'Alle Parkeintrittsgebühren'],
  ARRAY['Persönliche Ausgaben', 'Trinkgelder', 'Alkoholische Getränke', 'Optionale Aktivitäten'],
  ARRAY['Abfahrt um 7:00 Uhr von Kapstadt', 'Safari-Dauer: 8-10 Stunden', 'Wetterabhängig', 'Für alle Altersgruppen geeignet'],
  ARRAY['Bequeme Wanderschuhe', 'Hut und Sonnenbrille', 'Sonnencreme', 'Kamera', 'Warme Jacke (Wintermonate)'],
  ARRAY[
    '{"time": "07:00", "activity": "Abholung von Kapstädter Unterkunft", "description": "Komfortabler klimatisierter Transport"}',
    '{"time": "09:30", "activity": "Ankunft im Aquila Game Reserve", "description": "Begrüßungsgetränk und Safari-Briefing"}',
    '{"time": "10:00", "activity": "Morgendliche Pirschfahrt", "description": "3-stündiges Big 5 Safari-Erlebnis"}',
    '{"time": "13:00", "activity": "Traditionelles Mittagessen", "description": "Authentische südafrikanische Küche"}',
    '{"time": "14:30", "activity": "Nachmittägliche Pirschfahrt", "description": "Fortgesetzte Wildtierbeobachtung"}',
    '{"time": "17:00", "activity": "Rückfahrt nach Kapstadt", "description": "Malerische Fahrt durch die Landschaft"}',
    '{"time": "19:30", "activity": "Absetzen an der Unterkunft", "description": "Ende des Safari-Erlebnisses"}'
  ],
  ARRAY[
    '{"question": "Welche Tiere werden wir sehen?", "answer": "Obwohl wir keine spezifischen Sichtungen garantieren können, ist Aquila Heimat der Big 5 (Löwe, Elefant, Nashorn, Leopard, Büffel) sowie vieler anderer Arten wie Giraffe, Zebra und verschiedene Antilopen."}',
    '{"question": "Was soll ich anziehen?", "answer": "Bequeme Kleidung in neutralen Farben (Khaki, Braun, Grün), geschlossene Schuhe, Hut und Sonnenbrille. Bringen Sie eine warme Jacke für frühe Morgen- und Abendfahrten mit."}',
    '{"question": "Ist das für Kinder geeignet?", "answer": "Ja, diese Safari ist familienfreundlich und für Kinder aller Altersgruppen geeignet. Kinder unter 2 Jahren reisen kostenlos."}',
    '{"question": "Was ist bei schlechtem Wetter?", "answer": "Pirschfahrten finden bei den meisten Wetterbedingungen statt. Unsere Fahrzeuge haben Abdeckungen zum Regenschutz."}'
  ],
  'Aquila Big 5 Safari | Ganztägiges Wildlife-Erlebnis von Kapstadt',
  'Erleben Sie Afrikas Big 5 im Aquila Game Reserve. Ganztägige Safari von Kapstadt mit erfahrenen Guides, Luxustransport & traditionellem Mittagessen. Buchen Sie Ihr Wildlife-Abenteuer!',
  ARRAY['big 5 safari', 'aquila game reserve', 'kapstadt safari', 'wildlife tour', 'südafrika safari'],
  'published',
  'Professional German translation, maintaining same depth and structure as English original'
),

-- French Translation - Aquila
(
  (SELECT id FROM tours WHERE slug = 'aquila-big-5-day-safari' AND locale = 'en'),
  'fr',
  'Safari d''une journée Aquila Big 5',
  'Vivez l''excitation de voir les Big 5 d''Afrique dans leur habitat naturel à la réserve privée d''Aquila. Cette aventure safari d''une journée complète comprend des safaris, des options d''hébergement de luxe et des guides experts qui vous aideront à repérer les lions, éléphants, rhinocéros, léopards et buffles.',
  'Expérience safari Big 5 d''une journée complète à la réserve privée d''Aquila avec des guides experts.',
  ARRAY['Observation de la faune Big 5', 'Guide safari professionnel', 'Véhicule de safari de luxe', 'Déjeuner sud-africain traditionnel', 'Vues panoramiques sur les montagnes'],
  ARRAY['Transport aller-retour depuis Le Cap', 'Guide safari professionnel', 'Safari en véhicule ouvert', 'Déjeuner traditionnel', 'Tous les frais d''entrée du parc'],
  ARRAY['Dépenses personnelles', 'Pourboires', 'Boissons alcoolisées', 'Activités optionnelles'],
  ARRAY['Départ à 7h00 du Cap', 'Durée du safari : 8-10 heures', 'Dépendant de la météo', 'Convient à tous les âges'],
  ARRAY['Chaussures de marche confortables', 'Chapeau et lunettes de soleil', 'Crème solaire', 'Appareil photo', 'Veste chaude (mois d''hiver)'],
  ARRAY[
    '{"time": "07:00", "activity": "Prise en charge à l''hébergement du Cap", "description": "Transport climatisé confortable"}',
    '{"time": "09:30", "activity": "Arrivée à la réserve d''Aquila", "description": "Boisson de bienvenue et briefing safari"}',
    '{"time": "10:00", "activity": "Safari matinal", "description": "Expérience safari Big 5 de 3 heures"}',
    '{"time": "13:00", "activity": "Déjeuner traditionnel", "description": "Cuisine sud-africaine authentique"}',
    '{"time": "14:30", "activity": "Safari de l''après-midi", "description": "Poursuite de l''observation de la faune"}',
    '{"time": "17:00", "activity": "Voyage de retour au Cap", "description": "Conduite pittoresque à travers la campagne"}',
    '{"time": "19:30", "activity": "Dépose à l''hébergement", "description": "Fin de l''expérience safari"}'
  ],
  ARRAY[
    '{"question": "Quels animaux verrons-nous ?", "answer": "Bien que nous ne puissions pas garantir des observations spécifiques, Aquila abrite les Big 5 (lion, éléphant, rhinocéros, léopard, buffle) plus de nombreuses autres espèces dont la girafe, le zèbre et diverses antilopes."}',
    '{"question": "Que dois-je porter ?", "answer": "Vêtements confortables dans des couleurs neutres (kaki, marron, vert), chaussures fermées, chapeau et lunettes de soleil. Apportez une veste chaude pour les safaris tôt le matin et en soirée."}',
    '{"question": "Cela convient-il aux enfants ?", "answer": "Oui, ce safari est familial et convient aux enfants de tous âges. Les enfants de moins de 2 ans voyagent gratuitement."}',
    '{"question": "Que se passe-t-il si le temps est mauvais ?", "answer": "Les safaris fonctionnent dans la plupart des conditions météorologiques. Nos véhicules ont des couvertures pour la protection contre la pluie."}'
  ],
  'Safari Aquila Big 5 | Expérience Wildlife d''une journée depuis Le Cap',
  'Vivez les Big 5 d''Afrique à la réserve d''Aquila. Safari d''une journée depuis Le Cap avec guides experts, transport de luxe et déjeuner traditionnel. Réservez votre aventure wildlife !',
  ARRAY['safari big 5', 'réserve aquila', 'safari le cap', 'tour wildlife', 'safari afrique du sud'],
  'published',
  'Professional French translation, maintaining same depth and structure as English original'
),

-- Spanish Translation - Aquila
(
  (SELECT id FROM tours WHERE slug = 'aquila-big-5-day-safari' AND locale = 'en'),
  'es',
  'Safari de un día Aquila Big 5',
  'Experimenta la emoción de ver los Big 5 de África en su hábitat natural en la Reserva Privada Aquila. Esta aventura de safari de día completo incluye safaris, opciones de alojamiento de lujo y guías expertos que te ayudarán a avistar leones, elefantes, rinocerontes, leopardos y búfalos.',
  'Experiencia de safari Big 5 de día completo en la Reserva Privada Aquila con guías expertos.',
  ARRAY['Observación de vida salvaje Big 5', 'Guía de safari profesional', 'Vehículo de safari de lujo', 'Almuerzo tradicional sudafricano', 'Vistas panorámicas de las montañas'],
  ARRAY['Transporte de ida y vuelta desde Ciudad del Cabo', 'Guía de safari profesional', 'Safari en vehículo abierto', 'Almuerzo tradicional', 'Todas las tarifas de entrada al parque'],
  ARRAY['Gastos personales', 'Propinas', 'Bebidas alcohólicas', 'Actividades opcionales'],
  ARRAY['Salida a las 7:00 AM desde Ciudad del Cabo', 'Duración del safari: 8-10 horas', 'Dependiente del clima', 'Adecuado para todas las edades'],
  ARRAY['Zapatos cómodos para caminar', 'Sombrero y gafas de sol', 'Protector solar', 'Cámara', 'Chaqueta abrigada (meses de invierno)'],
  ARRAY[
    '{"time": "07:00", "activity": "Recogida en alojamiento de Ciudad del Cabo", "description": "Transporte cómodo con aire acondicionado"}',
    '{"time": "09:30", "activity": "Llegada a la Reserva Aquila", "description": "Bebida de bienvenida y briefing del safari"}',
    '{"time": "10:00", "activity": "Safari matutino", "description": "Experiencia de safari Big 5 de 3 horas"}',
    '{"time": "13:00", "activity": "Almuerzo tradicional", "description": "Cocina sudafricana auténtica"}',
    '{"time": "14:30", "activity": "Safari vespertino", "description": "Continuación de la observación de vida salvaje"}',
    '{"time": "17:00", "activity": "Viaje de regreso a Ciudad del Cabo", "description": "Conducción escénica a través del campo"}',
    '{"time": "19:30", "activity": "Bajada en alojamiento", "description": "Fin de la experiencia de safari"}'
  ],
  ARRAY[
    '{"question": "¿Qué animales veremos?", "answer": "Aunque no podemos garantizar avistamientos específicos, Aquila es hogar de los Big 5 (león, elefante, rinoceronte, leopardo, búfalo) además de muchas otras especies incluyendo jirafa, cebra y varios antílopes."}',
    '{"question": "¿Qué debo vestir?", "answer": "Ropa cómoda en colores neutros (caqui, marrón, verde), zapatos cerrados, sombrero y gafas de sol. Trae una chaqueta abrigada para los safaris temprano en la mañana y por la noche."}',
    '{"question": "¿Es adecuado para niños?", "answer": "Sí, este safari es familiar y adecuado para niños de todas las edades. Los niños menores de 2 años viajan gratis."}',
    '{"question": "¿Qué pasa si el clima es malo?", "answer": "Los safaris operan en la mayoría de las condiciones climáticas. Nuestros vehículos tienen cubiertas para protección contra la lluvia."}'
  ],
  'Safari Aquila Big 5 | Experiencia de Vida Salvaje de Día Completo desde Ciudad del Cabo',
  'Experimenta los Big 5 de África en la Reserva Aquila. Safari de día completo desde Ciudad del Cabo con guías expertos, transporte de lujo y almuerzo tradicional. ¡Reserva tu aventura de vida salvaje!',
  ARRAY['safari big 5', 'reserva aquila', 'safari ciudad del cabo', 'tour vida salvaje', 'safari sudáfrica'],
  'published',
  'Professional Spanish translation, maintaining same depth and structure as English original'
),

-- Arabic Translation - Aquila
(
  (SELECT id FROM tours WHERE slug = 'aquila-big-5-day-safari' AND locale = 'en'),
  'ar',
  'سفاري أكويلا للحيوانات الخمسة الكبرى ليوم واحد',
  'اختبر إثارة رؤية الحيوانات الخمسة الكبرى في أفريقيا في بيئتها الطبيعية في محمية أكويلا الخاصة للألعاب. تشمل مغامرة السفاري ليوم كامل رحلات صيد، خيارات إقامة فاخرة، ومرشدين خبراء سيساعدونك في رصد الأسود والفيلة ووحيد القرن والفهود والجاموس.',
  'تجربة سفاري الحيوانات الخمسة الكبرى ليوم كامل في محمية أكويلا الخاصة مع مرشدين خبراء.',
  ARRAY['مشاهدة الحيوانات البرية الخمسة الكبرى', 'مرشد سفاري محترف', 'مركبة سفاري فاخرة', 'غداء جنوب أفريقي تقليدي', 'إطلالات جبلية خلابة'],
  ARRAY['نقل ذهاب وإياب من كيب تاون', 'مرشد سفاري محترف', 'رحلة صيد في مركبة سفاري مفتوحة', 'غداء تقليدي', 'جميع رسوم دخول المتنزه'],
  ARRAY['النفقات الشخصية', 'البقشيش', 'المشروبات الكحولية', 'الأنشطة الاختيارية'],
  ARRAY['المغادرة في الساعة 7:00 صباحاً من كيب تاون', 'مدة السفاري: 8-10 ساعات', 'يعتمد على الطقس', 'مناسب لجميع الأعمار'],
  ARRAY['أحذية مشي مريحة', 'قبعة ونظارات شمسية', 'واقي من الشمس', 'كاميرا', 'سترة دافئة (أشهر الشتاء)'],
  ARRAY[
    '{"time": "07:00", "activity": "الاستلام من مكان الإقامة في كيب تاون", "description": "نقل مريح مكيف الهواء"}',
    '{"time": "09:30", "activity": "الوصول إلى محمية أكويلا", "description": "مشروب ترحيبي وإحاطة بالسفاري"}',
    '{"time": "10:00", "activity": "رحلة سفاري صباحية", "description": "تجربة سفاري الحيوانات الخمسة الكبرى لمدة 3 ساعات"}',
    '{"time": "13:00", "activity": "الغداء التقليدي", "description": "مطبخ جنوب أفريقي أصيل"}',
    '{"time": "14:30", "activity": "رحلة سفاري بعد الظهر", "description": "استكمال مراقبة الحياة البرية"}',
    '{"time": "17:00", "activity": "رحلة العودة إلى كيب تاون", "description": "قيادة خلابة عبر الريف"}',
    '{"time": "19:30", "activity": "الإنزال في مكان الإقامة", "description": "انتهاء تجربة السفاري"}'
  ],
  ARRAY[
    '{"question": "ما هي الحيوانات التي سنراها؟", "answer": "بينما لا يمكننا ضمان مشاهدات محددة، تعتبر أكويلا موطناً للحيوانات الخمسة الكبرى (الأسد، الفيل، وحيد القرن، الفهد، الجاموس) بالإضافة إلى العديد من الأنواع الأخرى بما في ذلك الزرافة والحمار الوحشي ومختلف أنواع الظباء."}',
    '{"question": "ماذا يجب أن أرتدي؟", "answer": "ملابس مريحة بألوان محايدة (كاكي، بني، أخضر)، أحذية مغلقة، قبعة ونظارات شمسية. أحضر سترة دافئة لرحلات الصباح الباكر والمساء."}',
    '{"question": "هل هذا مناسب للأطفال؟", "answer": "نعم، هذا السفاري مناسب للعائلات وللأطفال من جميع الأعمار. الأطفال تحت سن الثانية يسافرون مجاناً."}',
    '{"question": "ماذا لو كان الطقس سيئاً؟", "answer": "تعمل رحلات السفاري في معظم الأحوال الجوية. مركباتنا مزودة بأغطية للحماية من المطر."}'
  ],
  'سفاري أكويلا للحيوانات الخمسة الكبرى | تجربة الحياة البرية ليوم كامل من كيب تاون',
  'اختبر الحيوانات الخمسة الكبرى في أفريقيا في محمية أكويلا. سفاري ليوم كامل من كيب تاون مع مرشدين خبراء ونقل فاخر وغداء تقليدي. احجز مغامرتك في الحياة البرية!',
  ARRAY['سفاري الحيوانات الخمسة الكبرى', 'محمية أكويلا', 'سفاري كيب تاون', 'جولة الحياة البرية', 'سفاري جنوب أفريقيا'],
  'published',
  'Professional Arabic translation, maintaining same depth and structure as English original'
),

-- =============================================
-- 2. INVERDOORN EXCLUSIVE DAY SAFARI TRANSLATIONS (4 languages)
-- =============================================

-- German Translation - Inverdoorn
(
  (SELECT id FROM tours WHERE slug = 'inverdoorn-exclusive-day-safari' AND locale = 'en'),
  'de',
  'Inverdoorn Exklusive Tages-Safari',
  'Entdecken Sie das exklusive Inverdoorn Game Reserve bei diesem Premium-Safari-Erlebnis. Das private Reservat liegt im malerischen Ceres Valley und bietet intime Wildtierbegegnungen mit Geparden, weißen Löwen und anderen afrikanischen Arten in einer malariafreien Umgebung.',
  'Exklusives Safari-Erlebnis im Inverdoorn Game Reserve mit Geparden- und Weiße-Löwen-Begegnungen.',
  ARRAY['Exklusive Geparden-Begegnungen', 'Seltene Weiße-Löwen-Sichtungen', 'Malariafreie Umgebung', 'Malerische Ceres Valley Lage', 'Kleingruppen-Erlebnis'],
  ARRAY['Hin- und Rücktransport im Luxus-Fahrzeug', 'Professioneller Guide', 'Pirschfahrten', 'Gourmet-Mittagessen', 'Parkgebühren', 'Erfrischungen'],
  ARRAY['Persönliche Ausgaben', 'Trinkgelder', 'Optionale Aktivitäten', 'Alkoholische Getränke'],
  ARRAY['Nur kleine Gruppen (max. 8 Personen)', 'Malariafreie Zone', 'Ganzjähriger Betrieb', 'Fotografiemöglichkeiten'],
  ARRAY['Bequeme Safari-Kleidung', 'Kamera mit Extra-Batterien', 'Sonnenhut und Sonnencreme', 'Fernglas (optional)'],
  ARRAY[
    '{"time": "07:30", "activity": "Abfahrt von Kapstadt", "description": "Luxus klimatisiertes Fahrzeug"}',
    '{"time": "10:00", "activity": "Ankunft in Inverdoorn", "description": "Begrüßung und Reservats-Briefing"}',
    '{"time": "10:30", "activity": "Erste Pirschfahrt", "description": "Fokus auf Geparden und Raubtiere"}',
    '{"time": "13:00", "activity": "Gourmet-Mittagessen", "description": "Gehobenes Essen mit Talblick"}',
    '{"time": "14:30", "activity": "Zweite Pirschfahrt", "description": "Weiße Löwen und allgemeines Wild"}',
    '{"time": "16:30", "activity": "Abfahrt", "description": "Rückfahrt nach Kapstadt"}',
    '{"time": "19:00", "activity": "Ankunft in Kapstadt", "description": "Absetzen an der Unterkunft"}'
  ],
  ARRAY[
    '{"question": "Was macht Inverdoorn besonders?", "answer": "Inverdoorn beherbergt seltene weiße Löwen und bietet exklusive Geparden-Begegnungen. Es ist ein privates Reservat mit begrenzten Besuchern, was ein intimes Erlebnis gewährleistet."}',
    '{"question": "Ist es malariafrei?", "answer": "Ja, Inverdoorn ist komplett malariafrei und damit sicher für alle Reisenden, einschließlich schwangerer Frauen und kleiner Kinder."}',
    '{"question": "Wie nahe kommen wir den Tieren?", "answer": "Unsere erfahrenen Guides positionieren die Fahrzeuge für optimale Betrachtung unter Respektierung des Tierwohls. Geparden-Begegnungen können unter kontrollierten Bedingungen sehr nah sein."}'
  ],
  'Inverdoorn Safari | Exklusive Geparden & Weiße Löwen Erfahrung',
  'Exklusive Inverdoorn Game Reserve Safari mit Geparden-Begegnungen & seltenen weißen Löwen. Malariafrei, kleine Gruppen, Luxustransport von Kapstadt.',
  ARRAY['inverdoorn safari', 'geparden begegnung', 'weiße löwen', 'exklusive safari', 'malariafreie safari'],
  'published',
  'Professional German translation, maintaining same depth and structure as English original'
),

-- French Translation - Inverdoorn
(
  (SELECT id FROM tours WHERE slug = 'inverdoorn-exclusive-day-safari' AND locale = 'en'),
  'fr',
  'Safari exclusif d''une journée à Inverdoorn',
  'Découvrez la réserve exclusive d''Inverdoorn lors de cette expérience safari premium. Située dans la pittoresque vallée de Ceres, cette réserve privée offre des rencontres intimes avec la faune incluant des guépards, des lions blancs et d''autres espèces africaines dans un environnement sans paludisme.',
  'Expérience safari exclusive à la réserve d''Inverdoorn avec rencontres de guépards et lions blancs.',
  ARRAY['Rencontres exclusives avec les guépards', 'Observations rares de lions blancs', 'Environnement sans paludisme', 'Emplacement pittoresque de la vallée de Ceres', 'Expérience en petit groupe'],
  ARRAY['Transport de luxe aller-retour', 'Guide professionnel', 'Safaris', 'Déjeuner gastronomique', 'Frais du parc', 'Rafraîchissements'],
  ARRAY['Dépenses personnelles', 'Pourboires', 'Activités optionnelles', 'Boissons alcoolisées'],
  ARRAY['Petits groupes uniquement (max 8 personnes)', 'Zone sans paludisme', 'Fonctionnement toute saison', 'Opportunités photographiques'],
  ARRAY['Vêtements de safari confortables', 'Appareil photo avec batteries supplémentaires', 'Chapeau de soleil et crème solaire', 'Jumelles (optionnel)'],
  ARRAY[
    '{"time": "07:30", "activity": "Départ du Cap", "description": "Véhicule de luxe climatisé"}',
    '{"time": "10:00", "activity": "Arrivée à Inverdoorn", "description": "Accueil et briefing de la réserve"}',
    '{"time": "10:30", "activity": "Premier safari", "description": "Focus sur les guépards et prédateurs"}',
    '{"time": "13:00", "activity": "Déjeuner gastronomique", "description": "Cuisine raffinée avec vue sur la vallée"}',
    '{"time": "14:30", "activity": "Deuxième safari", "description": "Lions blancs et gibier général"}',
    '{"time": "16:30", "activity": "Départ", "description": "Voyage de retour au Cap"}',
    '{"time": "19:00", "activity": "Arrivée au Cap", "description": "Dépose à l''hébergement"}'
  ],
  ARRAY[
    '{"question": "Qu''est-ce qui rend Inverdoorn spécial ?", "answer": "Inverdoorn abrite des lions blancs rares et offre des rencontres exclusives avec les guépards. C''est une réserve privée avec des visiteurs limités, garantissant une expérience intime."}',
    '{"question": "Est-ce sans paludisme ?", "answer": "Oui, Inverdoorn est complètement sans paludisme, ce qui le rend sûr pour tous les voyageurs y compris les femmes enceintes et les jeunes enfants."}',
    '{"question": "À quelle distance nous approchons-nous des animaux ?", "answer": "Nos guides expérimentés positionnent les véhicules pour une observation optimale tout en respectant le bien-être animal. Les rencontres avec les guépards peuvent être très proches dans des conditions contrôlées."}'
  ],
  'Safari Inverdoorn | Expérience exclusive Guépards & Lions Blancs',
  'Safari exclusif à la réserve d''Inverdoorn avec rencontres de guépards & lions blancs rares. Sans paludisme, petits groupes, transport de luxe depuis Le Cap.',
  ARRAY['safari inverdoorn', 'rencontre guépards', 'lions blancs', 'safari exclusif', 'safari sans paludisme'],
  'published',
  'Professional French translation, maintaining same depth and structure as English original'
),

-- Spanish Translation - Inverdoorn
(
  (SELECT id FROM tours WHERE slug = 'inverdoorn-exclusive-day-safari' AND locale = 'en'),
  'es',
  'Safari exclusivo de un día en Inverdoorn',
  'Descubre la exclusiva Reserva Inverdoorn en esta experiencia de safari premium. Ubicada en el pintoresco Valle de Ceres, esta reserva privada ofrece encuentros íntimos con la vida salvaje incluyendo guepardos, leones blancos y otras especies africanas en un ambiente libre de malaria.',
  'Experiencia de safari exclusiva en la Reserva Inverdoorn con encuentros de guepardos y leones blancos.',
  ARRAY['Encuentros exclusivos con guepardos', 'Avistamientos raros de leones blancos', 'Ambiente libre de malaria', 'Ubicación pintoresca del Valle de Ceres', 'Experiencia en grupo pequeño'],
  ARRAY['Transporte de lujo de ida y vuelta', 'Guía profesional', 'Safaris', 'Almuerzo gourmet', 'Tarifas del parque', 'Refrescos'],
  ARRAY['Gastos personales', 'Propinas', 'Actividades opcionales', 'Bebidas alcohólicas'],
  ARRAY['Solo grupos pequeños (máx. 8 personas)', 'Área libre de malaria', 'Operación todo el año', 'Oportunidades fotográficas'],
  ARRAY['Ropa de safari cómoda', 'Cámara con baterías extra', 'Sombrero y protector solar', 'Binoculares (opcional)'],
  ARRAY[
    '{"time": "07:30", "activity": "Salida desde Ciudad del Cabo", "description": "Vehículo de lujo con aire acondicionado"}',
    '{"time": "10:00", "activity": "Llegada a Inverdoorn", "description": "Bienvenida y briefing de la reserva"}',
    '{"time": "10:30", "activity": "Primer safari", "description": "Enfoque en guepardos y depredadores"}',
    '{"time": "13:00", "activity": "Almuerzo gourmet", "description": "Gastronomía fina con vistas del valle"}',
    '{"time": "14:30", "activity": "Segundo safari", "description": "Leones blancos y caza general"}',
    '{"time": "16:30", "activity": "Salida", "description": "Viaje de regreso a Ciudad del Cabo"}',
    '{"time": "19:00", "activity": "Llegada a Ciudad del Cabo", "description": "Bajada en alojamiento"}'
  ],
  ARRAY[
    '{"question": "¿Qué hace especial a Inverdoorn?", "answer": "Inverdoorn es hogar de leones blancos raros y ofrece encuentros exclusivos con guepardos. Es una reserva privada con visitantes limitados, asegurando una experiencia íntima."}',
    '{"question": "¿Está libre de malaria?", "answer": "Sí, Inverdoorn está completamente libre de malaria, haciéndolo seguro para todos los viajeros incluyendo mujeres embarazadas y niños pequeños."}',
    '{"question": "¿Qué tan cerca llegamos a los animales?", "answer": "Nuestros guías experimentados posicionan los vehículos para observación óptima mientras respetan el bienestar animal. Los encuentros con guepardos pueden ser muy cercanos bajo condiciones controladas."}'
  ],
  'Safari Inverdoorn | Experiencia exclusiva de Guepardos y Leones Blancos',
  'Safari exclusivo en la Reserva Inverdoorn con encuentros de guepardos y leones blancos raros. Libre de malaria, grupos pequeños, transporte de lujo desde Ciudad del Cabo.',
  ARRAY['safari inverdoorn', 'encuentro guepardos', 'leones blancos', 'safari exclusivo', 'safari libre malaria'],
  'published',
  'Professional Spanish translation, maintaining same depth and structure as English original'
),

-- Arabic Translation - Inverdoorn
(
  (SELECT id FROM tours WHERE slug = 'inverdoorn-exclusive-day-safari' AND locale = 'en'),
  'ar',
  'سفاري إنفردورن الحصري ليوم واحد',
  'اكتشف محمية إنفردورن الحصرية في تجربة السفاري المميزة هذه. تقع في وادي سيريس الخلاب، وتوفر هذه المحمية الخاصة لقاءات حميمة مع الحياة البرية بما في ذلك الفهود والأسود البيضاء والأنواع الأفريقية الأخرى في بيئة خالية من الملاريا.',
  'تجربة سفاري حصرية في محمية إنفردورن مع لقاءات الفهود والأسود البيضاء.',
  ARRAY['لقاءات حصرية مع الفهود', 'مشاهدات نادرة للأسود البيضاء', 'بيئة خالية من الملاريا', 'موقع وادي سيريس الخلاب', 'تجربة مجموعة صغيرة'],
  ARRAY['نقل فاخر ذهاب وإياب', 'مرشد محترف', 'رحلات سفاري', 'غداء للذواقة', 'رسوم المتنزه', 'مرطبات'],
  ARRAY['النفقات الشخصية', 'البقشيش', 'الأنشطة الاختيارية', 'المشروبات الكحولية'],
  ARRAY['مجموعات صغيرة فقط (8 أشخاص كحد أقصى)', 'منطقة خالية من الملاريا', 'التشغيل على مدار السنة', 'فرص التصوير الفوتوغرافي'],
  ARRAY['ملابس سفاري مريحة', 'كاميرا مع بطاريات إضافية', 'قبعة شمسية وواقي شمس', 'منظار (اختياري)'],
  ARRAY[
    '{"time": "07:30", "activity": "المغادرة من كيب تاون", "description": "مركبة فاخرة مكيفة الهواء"}',
    '{"time": "10:00", "activity": "الوصول إلى إنفردورن", "description": "الترحيب وإحاطة المحمية"}',
    '{"time": "10:30", "activity": "رحلة السفاري الأولى", "description": "التركيز على الفهود والحيوانات المفترسة"}',
    '{"time": "13:00", "activity": "غداء للذواقة", "description": "طعام راقي مع إطلالة على الوادي"}',
    '{"time": "14:30", "activity": "رحلة السفاري الثانية", "description": "الأسود البيضاء والصيد العام"}',
    '{"time": "16:30", "activity": "المغادرة", "description": "رحلة العودة إلى كيب تاون"}',
    '{"time": "19:00", "activity": "الوصول إلى كيب تاون", "description": "الإنزال في مكان الإقامة"}'
  ],
  ARRAY[
    '{"question": "ما الذي يجعل إنفردورن مميزة؟", "answer": "إنفردورن موطن للأسود البيضاء النادرة وتوفر لقاءات حصرية مع الفهود. إنها محمية خاصة مع زوار محدودين، مما يضمن تجربة حميمة."}',
    '{"question": "هل هي خالية من الملاريا؟", "answer": "نعم، إنفردورن خالية تماماً من الملاريا، مما يجعلها آمنة لجميع المسافرين بما في ذلك النساء الحوامل والأطفال الصغار."}',
    '{"question": "كم نقترب من الحيوانات؟", "answer": "يقوم مرشدونا ذوو الخبرة بوضع المركبات للمشاهدة المثلى مع احترام رفاهية الحيوانات. يمكن أن تكون لقاءات الفهود قريبة جداً تحت ظروف محكومة."}'
  ],
  'سفاري إنفردورن | تجربة حصرية للفهود والأسود البيضاء',
  'سفاري حصري في محمية إنفردورن مع لقاءات الفهود والأسود البيضاء النادرة. خالي من الملاريا، مجموعات صغيرة، نقل فاخر من كيب تاون.',
  ARRAY['سفاري إنفردورن', 'لقاء الفهود', 'الأسود البيضاء', 'سفاري حصري', 'سفاري خالي من الملاريا'],
  'published',
  'Professional Arabic translation, maintaining same depth and structure as English original'
),

-- =============================================
-- 3. BOULDERS BEACH PENGUIN COLONY TRANSLATIONS (4 languages)
-- =============================================

-- German Translation - Boulders Beach
(
  (SELECT id FROM tours WHERE slug = 'boulders-beach-penguin-colony' AND locale = 'en'),
  'de',
  'Boulders Beach Pinguinkolonie Tour',
  'Besuchen Sie die berühmte Afrikanische Pinguinkolonie am Boulders Beach in Simon''s Town. Diese halbtägige Tour kombiniert Pinguinbeobachtung mit malerischen Küstenfahrten, Erkundung der historischen Marinestadt und optionaler Weinverkostung in der nahegelegenen Constantia Weinregion.',
  'Halbtägige Tour zu den Afrikanischen Pinguinen am Boulders Beach mit Küstenlandschaft.',
  ARRAY['Afrikanische Pinguinkolonie', 'Malerische Küstenfahrt', 'Historisches Simon''s Town', 'Felsenstrände', 'Optionale Weinverkostung'],
  ARRAY['Hin- und Rücktransport', 'Professioneller Guide', 'Boulders Beach Eintritt', 'Simon''s Town Besuch', 'Malerische Küstenfahrt'],
  ARRAY['Mittagessen', 'Persönliche Ausgaben', 'Optionale Weinverkostung', 'Trinkgelder'],
  ARRAY['Pinguinbeobachtung ist wetterabhängig', 'Brutzeit: Februar bis August', 'Schwimmen nicht empfohlen', 'Pinguinabstände respektieren'],
  ARRAY['Bequeme Wanderschuhe', 'Sonnenschutz', 'Kamera', 'Leichte Jacke', 'Wasserflasche'],
  ARRAY[
    '{"time": "09:00", "activity": "Abfahrt von Kapstadt", "description": "Malerische Fahrt über Chapman''s Peak"}',
    '{"time": "10:30", "activity": "Ankunft am Boulders Beach", "description": "Pinguinkolonie-Beobachtung"}',
    '{"time": "11:30", "activity": "Simon''s Town Erkundung", "description": "Besuch der historischen Marinestadt"}',
    '{"time": "12:30", "activity": "Küstenfahrt", "description": "Malerische Route mit Fotostopps"}',
    '{"time": "13:30", "activity": "Optionale Weinverkostung", "description": "Constantia Weinregion"}',
    '{"time": "15:00", "activity": "Rückkehr nach Kapstadt", "description": "Absetzen an der Unterkunft"}'
  ],
  ARRAY[
    '{"question": "Wann ist die beste Zeit, um Pinguine zu sehen?", "answer": "Pinguine sind ganzjährig anwesend, aber die Brutzeit (Februar-August) bietet die aktivste Beobachtung mit Küken und Balzverhalten."}',
    '{"question": "Können wir mit den Pinguinen schwimmen?", "answer": "Nein, Schwimmen ist am Boulders Beach zum Schutz der Pinguine nicht erlaubt. Es gibt ausgewiesene Beobachtungsbereiche und Stege."}',
    '{"question": "Wie viele Pinguine werden wir sehen?", "answer": "Die Kolonie hat etwa 3.000 Pinguine, obwohl die Zahlen saisonal variieren. Sie sehen normalerweise Dutzende bis Hunderte je nach Jahreszeit."}'
  ],
  'Boulders Beach Pinguine | Afrikanische Pinguinkolonie Tour von Kapstadt',
  'Besuchen Sie die berühmte Afrikanische Pinguinkolonie am Boulders Beach. Halbtägige Tour von Kapstadt mit malerischen Küstenfahrten & Simon''s Town Erkundung.',
  ARRAY['boulders beach', 'afrikanische pinguine', 'simons town', 'pinguinkolonie', 'kapstadt küstentour'],
  'published',
  'Professional German translation, maintaining same depth and structure as English original'
),

-- French Translation - Boulders Beach
(
  (SELECT id FROM tours WHERE slug = 'boulders-beach-penguin-colony' AND locale = 'en'),
  'fr',
  'Tour de la colonie de pingouins de Boulders Beach',
  'Visitez la célèbre colonie de pingouins africains à Boulders Beach dans Simon''s Town. Cette excursion d''une demi-journée combine l''observation des pingouins avec des routes côtières pittoresques, l''exploration de la ville navale historique et une dégustation de vins optionnelle dans la région viticole de Constantia toute proche.',
  'Excursion d''une demi-journée pour voir les pingouins africains à Boulders Beach avec paysages côtiers.',
  ARRAY['Colonie de pingouins africains', 'Route côtière pittoresque', 'Simon''s Town historique', 'Plages rocheuses', 'Dégustation de vins optionnelle'],
  ARRAY['Transport aller-retour', 'Guide professionnel', 'Entrée Boulders Beach', 'Visite de Simon''s Town', 'Route côtière pittoresque'],
  ARRAY['Déjeuner', 'Dépenses personnelles', 'Dégustation de vins optionnelle', 'Pourboires'],
  ARRAY['L''observation des pingouins dépend de la météo', 'Saison de reproduction : février à août', 'Baignade non recommandée', 'Respecter les distances avec les pingouins'],
  ARRAY['Chaussures de marche confortables', 'Protection solaire', 'Appareil photo', 'Veste légère', 'Bouteille d''eau'],
  ARRAY[
    '{"time": "09:00", "activity": "Départ du Cap", "description": "Route pittoresque via Chapman''s Peak"}',
    '{"time": "10:30", "activity": "Arrivée à Boulders Beach", "description": "Observation de la colonie de pingouins"}',
    '{"time": "11:30", "activity": "Exploration de Simon''s Town", "description": "Visite de la ville navale historique"}',
    '{"time": "12:30", "activity": "Route côtière", "description": "Itinéraire pittoresque avec arrêts photo"}',
    '{"time": "13:30", "activity": "Dégustation de vins optionnelle", "description": "Région viticole de Constantia"}',
    '{"time": "15:00", "activity": "Retour au Cap", "description": "Dépose à l''hébergement"}'
  ],
  ARRAY[
    '{"question": "Quand est le meilleur moment pour voir les pingouins ?", "answer": "Les pingouins sont présents toute l''année, mais la saison de reproduction (février-août) offre l''observation la plus active avec les poussins et les comportements de parade."}',
    '{"question": "Pouvons-nous nager avec les pingouins ?", "answer": "Non, la baignade n''est pas autorisée à Boulders Beach pour protéger les pingouins. Il y a des zones d''observation désignées et des passerelles."}',
    '{"question": "Combien de pingouins verrons-nous ?", "answer": "La colonie compte environ 3 000 pingouins, bien que les nombres varient selon la saison. Vous verrez généralement des dizaines à des centaines selon la période de l''année."}'
  ],
  'Pingouins de Boulders Beach | Tour de la colonie de pingouins africains depuis Le Cap',
  'Visitez la célèbre colonie de pingouins africains à Boulders Beach. Excursion d''une demi-journée depuis Le Cap avec routes côtières pittoresques & exploration de Simon''s Town.',
  ARRAY['boulders beach', 'pingouins africains', 'simons town', 'colonie pingouins', 'tour côtier cap'],
  'published',
  'Professional French translation, maintaining same depth and structure as English original'
),

-- Spanish Translation - Boulders Beach
(
  (SELECT id FROM tours WHERE slug = 'boulders-beach-penguin-colony' AND locale = 'en'),
  'es',
  'Tour de la Colonia de Pingüinos de Boulders Beach',
  'Visita la famosa colonia de pingüinos africanos en Boulders Beach en Simon''s Town. Este tour de medio día combina la observación de pingüinos con pintorescos recorridos costeros, exploración de la histórica ciudad naval y degustación de vinos opcional en la cercana región vinícola de Constantia.',
  'Tour de medio día para ver pingüinos africanos en Boulders Beach con paisajes costeros.',
  ARRAY['Colonia de pingüinos africanos', 'Recorrido costero pintoresco', 'Simon''s Town histórico', 'Playas rocosas', 'Degustación de vinos opcional'],
  ARRAY['Transporte de ida y vuelta', 'Guía profesional', 'Entrada a Boulders Beach', 'Visita a Simon''s Town', 'Recorrido costero pintoresco'],
  ARRAY['Almuerzo', 'Gastos personales', 'Degustación de vinos opcional', 'Propinas'],
  ARRAY['La observación de pingüinos depende del clima', 'Temporada de cría: febrero a agosto', 'No se recomienda nadar', 'Respetar las distancias con los pingüinos'],
  ARRAY['Zapatos cómodos para caminar', 'Protección solar', 'Cámara', 'Chaqueta ligera', 'Botella de agua'],
  ARRAY[
    '{"time": "09:00", "activity": "Salida desde Ciudad del Cabo", "description": "Recorrido pintoresco vía Chapman''s Peak"}',
    '{"time": "10:30", "activity": "Llegada a Boulders Beach", "description": "Observación de la colonia de pingüinos"}',
    '{"time": "11:30", "activity": "Exploración de Simon''s Town", "description": "Visita a la ciudad naval histórica"}',
    '{"time": "12:30", "activity": "Recorrido costero", "description": "Ruta pintoresca con paradas fotográficas"}',
    '{"time": "13:30", "activity": "Degustación de vinos opcional", "description": "Región vinícola de Constantia"}',
    '{"time": "15:00", "activity": "Regreso a Ciudad del Cabo", "description": "Bajada en alojamiento"}'
  ],
  ARRAY[
    '{"question": "¿Cuándo es el mejor momento para ver pingüinos?", "answer": "Los pingüinos están presentes todo el año, pero la temporada de cría (febrero-agosto) ofrece la observación más activa con polluelos y comportamientos de cortejo."}',
    '{"question": "¿Podemos nadar con los pingüinos?", "answer": "No, nadar no está permitido en Boulders Beach para proteger a los pingüinos. Hay áreas de observación designadas y pasarelas."}',
    '{"question": "¿Cuántos pingüinos veremos?", "answer": "La colonia tiene aproximadamente 3,000 pingüinos, aunque los números varían estacionalmente. Típicamente verás desde docenas hasta cientos dependiendo de la época del año."}'
  ],
  'Pingüinos de Boulders Beach | Tour de Colonia de Pingüinos Africanos desde Ciudad del Cabo',
  'Visita la famosa colonia de pingüinos africanos en Boulders Beach. Tour de medio día desde Ciudad del Cabo con recorridos costeros pintorescos & exploración de Simon''s Town.',
  ARRAY['boulders beach', 'pingüinos africanos', 'simons town', 'colonia pingüinos', 'tour costero cabo'],
  'published',
  'Professional Spanish translation, maintaining same depth and structure as English original'
),

-- Arabic Translation - Boulders Beach
(
  (SELECT id FROM tours WHERE slug = 'boulders-beach-penguin-colony' AND locale = 'en'),
  'ar',
  'جولة مستعمرة البطاريق في شاطئ بولدرز',
  'زر مستعمرة البطاريق الأفريقية الشهيرة في شاطئ بولدرز في مدينة سيمون. تجمع هذه الجولة لنصف يوم بين مراقبة البطاريق والقيادة الساحلية الخلابة، واستكشاف المدينة البحرية التاريخية وتذوق النبيذ الاختياري في منطقة كونستانتيا للنبيذ القريبة.',
  'جولة نصف يوم لرؤية البطاريق الأفريقية في شاطئ بولدرز مع المناظر الساحلية.',
  ARRAY['مستعمرة البطاريق الأفريقية', 'قيادة ساحلية خلابة', 'مدينة سيمون التاريخية', 'شواطئ صخرية', 'تذوق النبيذ الاختياري'],
  ARRAY['نقل ذهاب وإياب', 'مرشد محترف', 'دخول شاطئ بولدرز', 'زيارة مدينة سيمون', 'قيادة ساحلية خلابة'],
  ARRAY['الغداء', 'النفقات الشخصية', 'تذوق النبيذ الاختياري', 'البقشيش'],
  ARRAY['مراقبة البطاريق تعتمد على الطقس', 'موسم التكاثر: فبراير إلى أغسطس', 'السباحة غير مستحسنة', 'احترام المسافات مع البطاريق'],
  ARRAY['أحذية مشي مريحة', 'حماية من الشمس', 'كاميرا', 'سترة خفيفة', 'زجاجة ماء'],
  ARRAY[
    '{"time": "09:00", "activity": "المغادرة من كيب تاون", "description": "قيادة خلابة عبر قمة تشابمان"}',
    '{"time": "10:30", "activity": "الوصول إلى شاطئ بولدرز", "description": "مراقبة مستعمرة البطاريق"}',
    '{"time": "11:30", "activity": "استكشاف مدينة سيمون", "description": "زيارة المدينة البحرية التاريخية"}',
    '{"time": "12:30", "activity": "القيادة الساحلية", "description": "طريق خلاب مع محطات التصوير"}',
    '{"time": "13:30", "activity": "تذوق النبيذ الاختياري", "description": "منطقة كونستانتيا للنبيذ"}',
    '{"time": "15:00", "activity": "العودة إلى كيب تاون", "description": "الإنزال في مكان الإقامة"}'
  ],
  ARRAY[
    '{"question": "متى هو أفضل وقت لرؤية البطاريق؟", "answer": "البطاريق موجودة على مدار السنة، لكن موسم التكاثر (فبراير-أغسطس) يوفر المراقبة الأكثر نشاطاً مع الفراخ وسلوكيات المغازلة."}',
    '{"question": "هل يمكننا السباحة مع البطاريق؟", "answer": "لا، السباحة غير مسموحة في شاطئ بولدرز لحماية البطاريق. توجد مناطق مراقبة محددة وممرات."}',
    '{"question": "كم عدد البطاريق التي سنراها؟", "answer": "تضم المستعمرة حوالي 3000 بطريق، رغم أن الأرقام تختلف موسمياً. ستشاهد عادة العشرات إلى المئات حسب الوقت من السنة."}'
  ],
  'بطاريق شاطئ بولدرز | جولة مستعمرة البطاريق الأفريقية من كيب تاون',
  'زر مستعمرة البطاريق الأفريقية الشهيرة في شاطئ بولدرز. جولة نصف يوم من كيب تاون مع قيادة ساحلية خلابة واستكشاف مدينة سيمون.',
  ARRAY['شاطئ بولدرز', 'البطاريق الأفريقية', 'مدينة سيمون', 'مستعمرة البطاريق', 'جولة ساحلية كيب تاون'],
  'published',
  'Professional Arabic translation, maintaining same depth and structure as English original'
),

-- =============================================
-- 4. HERMANUS WHALE WATCHING CRUISE TRANSLATIONS (4 languages)
-- =============================================

-- German Translation - Hermanus
(
  (SELECT id FROM tours WHERE slug = 'hermanus-whale-watching-cruise' AND locale = 'en'),
  'de',
  'Hermanus Walbeobachtungs-Kreuzfahrt',
  'Erleben Sie die weltbeste landbasierte Walbeobachtung in Hermanus während der Walsaison (Juni-November). Diese ganztägige Tour umfasst eine Walbeobachtungs-Kreuzfahrt, malerische Küstenfahrt und Erkundung der charmanten Küstenstadt, die als Walbeobachtungs-Hauptstadt der Welt bekannt ist.',
  'Ganztägiges Walbeobachtungs-Erlebnis in Hermanus mit Bootskreuzfahrt und Küstenerkundung.',
  ARRAY['Weltklasse-Walbeobachtung', 'Bootsbasierte Wal-Kreuzfahrt', 'Malerische Hermanus Stadt', 'Küsten-Klippenwanderungen', 'Walsaison: Juni-November'],
  ARRAY['Hin- und Rücktransport', 'Professioneller Guide', 'Walbeobachtungs-Kreuzfahrt', 'Hermanus Stadtbesuch', 'Klippenpfad-Wanderungen'],
  ARRAY['Mittagessen', 'Persönliche Ausgaben', 'Seekrankheits-Medikamente', 'Trinkgelder'],
  ARRAY['Walsaison: Juni bis November', 'Wetterabhängige Kreuzfahrt', 'Seekrankheits-Medikamente mitbringen', 'Walsichtungen nicht garantiert'],
  ARRAY['Warme Kleidung', 'Winddichte Jacke', 'Rutschfeste Schuhe', 'Kamera mit Zoomobjektiv', 'Seekrankheits-Tabletten'],
  ARRAY[
    '{"time": "07:00", "activity": "Abfahrt von Kapstadt", "description": "Malerische Fahrt über Küstenroute"}',
    '{"time": "09:30", "activity": "Ankunft in Hermanus", "description": "Stadtorientierung und Klippenwanderung"}',
    '{"time": "10:30", "activity": "Walbeobachtungs-Kreuzfahrt", "description": "2-stündige bootsbasierte Walbeobachtung"}',
    '{"time": "13:00", "activity": "Mittagspause", "description": "Freie Zeit für Mittagessen in der Stadt"}',
    '{"time": "14:30", "activity": "Klippenpfad-Erkundung", "description": "Landbasierte Walbeobachtung"}',
    '{"time": "16:00", "activity": "Rückfahrt", "description": "Malerische Fahrt zurück nach Kapstadt"}',
    '{"time": "18:30", "activity": "Ankunft in Kapstadt", "description": "Absetzen an der Unterkunft"}'
  ],
  ARRAY[
    '{"question": "Wann ist Walsaison?", "answer": "Südliche Glattwale besuchen Hermanus von Juni bis November, mit Hauptsaison von August bis Oktober."}',
    '{"question": "Was ist, wenn wir keine Wale sehen?", "answer": "Obwohl Sichtungen während der Saison sehr häufig sind, können sie nicht garantiert werden. Die Kreuzfahrt bietet dennoch schöne Küstenlandschaft und Meeresleben."}',
    '{"question": "Ist die Bootstour für jeden geeignet?", "answer": "Die Kreuzfahrt operiert in ruhigen Buchtwassern, aber Personen, die zu Seekrankheit neigen, sollten Vorkehrungen treffen. Kinder und Senioren sind willkommen."}'
  ],
  'Hermanus Walbeobachtung | Beste Wal-Kreuzfahrt-Erfahrung von Kapstadt',
  'Weltklasse-Walbeobachtung in Hermanus mit Bootskreuzfahrt. Ganztägige Tour von Kapstadt während Walsaison (Juni-Nov). Südliche Glattwale garantiert!',
  ARRAY['hermanus walbeobachtung', 'wal kreuzfahrt', 'südliche glattwale', 'walsaison', 'kapstadt wal tour'],
  'published',
  'Professional German translation, maintaining same depth and structure as English original'
),

-- French Translation - Hermanus
(
  (SELECT id FROM tours WHERE slug = 'hermanus-whale-watching-cruise' AND locale = 'en'),
  'fr',
  'Croisière d''observation des baleines à Hermanus',
  'Vivez la meilleure observation de baleines terrestre au monde à Hermanus pendant la saison des baleines (juin-novembre). Cette excursion d''une journée complète comprend une croisière d''observation des baleines, une route côtière pittoresque et l''exploration de la charmante ville côtière connue comme la capitale mondiale de l''observation des baleines.',
  'Expérience d''observation des baleines d''une journée complète à Hermanus avec croisière en bateau et exploration côtière.',
  ARRAY['Observation de baleines de classe mondiale', 'Croisière d''observation des baleines en bateau', 'Ville pittoresque d''Hermanus', 'Promenades sur les falaises côtières', 'Saison des baleines : juin-novembre'],
  ARRAY['Transport aller-retour', 'Guide professionnel', 'Croisière d''observation des baleines', 'Visite de la ville d''Hermanus', 'Promenades sur le sentier des falaises'],
  ARRAY['Déjeuner', 'Dépenses personnelles', 'Médicaments contre le mal de mer', 'Pourboires'],
  ARRAY['Saison des baleines : juin à novembre', 'Croisière dépendante de la météo', 'Apportez des médicaments contre le mal de mer', 'Observations de baleines non garanties'],
  ARRAY['Vêtements chauds', 'Veste coupe-vent', 'Chaussures antidérapantes', 'Appareil photo avec objectif zoom', 'Comprimés contre le mal de mer'],
  ARRAY[
    '{"time": "07:00", "activity": "Départ du Cap", "description": "Route pittoresque via l''itinéraire côtier"}',
    '{"time": "09:30", "activity": "Arrivée à Hermanus", "description": "Orientation de la ville et promenade sur la falaise"}',
    '{"time": "10:30", "activity": "Croisière d''observation des baleines", "description": "Observation des baleines en bateau de 2 heures"}',
    '{"time": "13:00", "activity": "Pause déjeuner", "description": "Temps libre pour déjeuner en ville"}',
    '{"time": "14:30", "activity": "Exploration du sentier des falaises", "description": "Observation terrestre des baleines"}',
    '{"time": "16:00", "activity": "Voyage de retour", "description": "Route pittoresque de retour au Cap"}',
    '{"time": "18:30", "activity": "Arrivée au Cap", "description": "Dépose à l''hébergement"}'
  ],
  ARRAY[
    '{"question": "Quand est la saison des baleines ?", "answer": "Les baleines franches australes visitent Hermanus de juin à novembre, avec la haute saison d''août à octobre."}',
    '{"question": "Que se passe-t-il si nous ne voyons pas de baleines ?", "answer": "Bien que les observations soient très courantes pendant la saison, elles ne peuvent pas être garanties. La croisière offrira toujours de beaux paysages côtiers et une vie marine."}',
    '{"question": "L''excursion en bateau convient-elle à tout le monde ?", "answer": "La croisière opère dans des eaux calmes de baie, mais ceux sujets au mal de mer devraient prendre des précautions. Les enfants et les personnes âgées sont les bienvenus."}'
  ],
  'Observation des baleines à Hermanus | Meilleure expérience de croisière de baleines depuis Le Cap',
  'Observation de baleines de classe mondiale à Hermanus avec croisière en bateau. Excursion d''une journée complète depuis Le Cap pendant la saison des baleines (juin-nov). Baleines franches australes garanties !',
  ARRAY['observation baleines hermanus', 'croisière baleines', 'baleines franches australes', 'saison baleines', 'tour baleines cap'],
  'published',
  'Professional French translation, maintaining same depth and structure as English original'
),

-- Spanish Translation - Hermanus
(
  (SELECT id FROM tours WHERE slug = 'hermanus-whale-watching-cruise' AND locale = 'en'),
  'es',
  'Crucero de Avistamiento de Ballenas en Hermanus',
  'Experimenta la mejor observación de ballenas desde tierra del mundo en Hermanus durante la temporada de ballenas (junio-noviembre). Este tour de día completo incluye un crucero de avistamiento de ballenas, recorrido costero pintoresco y exploración de la encantadora ciudad costera conocida como la capital mundial del avistamiento de ballenas.',
  'Experiencia de avistamiento de ballenas de día completo en Hermanus con crucero en barco y exploración costera.',
  ARRAY['Avistamiento de ballenas de clase mundial', 'Crucero de avistamiento de ballenas en barco', 'Ciudad pintoresca de Hermanus', 'Caminatas por acantilados costeros', 'Temporada de ballenas: junio-noviembre'],
  ARRAY['Transporte de ida y vuelta', 'Guía profesional', 'Crucero de avistamiento de ballenas', 'Visita a la ciudad de Hermanus', 'Caminatas por el sendero de acantilados'],
  ARRAY['Almuerzo', 'Gastos personales', 'Medicamentos para el mareo', 'Propinas'],
  ARRAY['Temporada de ballenas: junio a noviembre', 'Crucero dependiente del clima', 'Traer medicamentos para el mareo', 'Avistamientos de ballenas no garantizados'],
  ARRAY['Ropa abrigada', 'Chaqueta cortavientos', 'Zapatos antideslizantes', 'Cámara con lente zoom', 'Tabletas para el mareo'],
  ARRAY[
    '{"time": "07:00", "activity": "Salida desde Ciudad del Cabo", "description": "Recorrido pintoresco vía ruta costera"}',
    '{"time": "09:30", "activity": "Llegada a Hermanus", "description": "Orientación de la ciudad y caminata por acantilado"}',
    '{"time": "10:30", "activity": "Crucero de avistamiento de ballenas", "description": "Avistamiento de ballenas en barco de 2 horas"}',
    '{"time": "13:00", "activity": "Pausa para almorzar", "description": "Tiempo libre para almorzar en la ciudad"}',
    '{"time": "14:30", "activity": "Exploración del sendero de acantilados", "description": "Avistamiento terrestre de ballenas"}',
    '{"time": "16:00", "activity": "Viaje de regreso", "description": "Recorrido pintoresco de regreso a Ciudad del Cabo"}',
    '{"time": "18:30", "activity": "Llegada a Ciudad del Cabo", "description": "Bajada en alojamiento"}'
  ],
  ARRAY[
    '{"question": "¿Cuándo es la temporada de ballenas?", "answer": "Las ballenas francas australes visitan Hermanus de junio a noviembre, con temporada alta de agosto a octubre."}',
    '{"question": "¿Qué pasa si no vemos ballenas?", "answer": "Aunque los avistamientos son muy comunes durante la temporada, no se pueden garantizar. El crucero aún ofrecerá hermosos paisajes costeros y vida marina."}',
    '{"question": "¿Es el viaje en barco adecuado para todos?", "answer": "El crucero opera en aguas tranquilas de bahía, pero aquellos propensos al mareo deberían tomar precauciones. Niños y personas mayores son bienvenidos."}'
  ],
  'Avistamiento de Ballenas en Hermanus | Mejor Experiencia de Crucero de Ballenas desde Ciudad del Cabo',
  'Avistamiento de ballenas de clase mundial en Hermanus con crucero en barco. Tour de día completo desde Ciudad del Cabo durante temporada de ballenas (junio-nov). ¡Ballenas francas australes garantizadas!',
  ARRAY['avistamiento ballenas hermanus', 'crucero ballenas', 'ballenas francas australes', 'temporada ballenas', 'tour ballenas cabo'],
  'published',
  'Professional Spanish translation, maintaining same depth and structure as English original'
),

-- Arabic Translation - Hermanus
(
  (SELECT id FROM tours WHERE slug = 'hermanus-whale-watching-cruise' AND locale = 'en'),
  'ar',
  'رحلة مراقبة الحيتان في هيرمانوس',
  'اختبر أفضل مراقبة حيتان برية في العالم في هيرمانوس خلال موسم الحيتان (يونيو-نوفمبر). تشمل هذه الجولة ليوم كامل رحلة بحرية لمراقبة الحيتان، وقيادة ساحلية خلابة، واستكشاف المدينة الساحلية الساحرة المعروفة بعاصمة مراقبة الحيتان في العالم.',
  'تجربة مراقبة الحيتان ليوم كامل في هيرمانوس مع رحلة بحرية واستكشاف ساحلي.',
  ARRAY['مراقبة حيتان عالمية المستوى', 'رحلة بحرية لمراقبة الحيتان بالقارب', 'مدينة هيرمانوس الخلابة', 'مشي على منحدرات ساحلية', 'موسم الحيتان: يونيو-نوفمبر'],
  ARRAY['نقل ذهاب وإياب', 'مرشد محترف', 'رحلة بحرية لمراقبة الحيتان', 'زيارة مدينة هيرمانوس', 'مشي على مسار المنحدرات'],
  ARRAY['الغداء', 'النفقات الشخصية', 'أدوية دوار البحر', 'البقشيش'],
  ARRAY['موسم الحيتان: يونيو إلى نوفمبر', 'الرحلة البحرية تعتمد على الطقس', 'إحضار أدوية دوار البحر', 'مشاهدة الحيتان غير مضمونة'],
  ARRAY['ملابس دافئة', 'سترة مقاومة للرياح', 'أحذية مانعة للانزلاق', 'كاميرا مع عدسة تكبير', 'أقراص دوار البحر'],
  ARRAY[
    '{"time": "07:00", "activity": "المغادرة من كيب تاون", "description": "قيادة خلابة عبر الطريق الساحلي"}',
    '{"time": "09:30", "activity": "الوصول إلى هيرمانوس", "description": "التوجيه في المدينة ومشي على المنحدر"}',
    '{"time": "10:30", "activity": "رحلة بحرية لمراقبة الحيتان", "description": "مراقبة الحيتان بالقارب لمدة ساعتين"}',
    '{"time": "13:00", "activity": "استراحة الغداء", "description": "وقت حر للغداء في المدينة"}',
    '{"time": "14:30", "activity": "استكشاف مسار المنحدرات", "description": "مراقبة الحيتان من البر"}',
    '{"time": "16:00", "activity": "رحلة العودة", "description": "قيادة خلابة للعودة إلى كيب تاون"}',
    '{"time": "18:30", "activity": "الوصول إلى كيب تاون", "description": "الإنزال في مكان الإقامة"}'
  ],
  ARRAY[
    '{"question": "متى موسم الحيتان؟", "answer": "حيتان الحق الجنوبية تزور هيرمانوس من يونيو إلى نوفمبر، مع الموسم الذروة من أغسطس إلى أكتوبر."}',
    '{"question": "ماذا لو لم نر حيتان؟", "answer": "رغم أن المشاهدات شائعة جداً خلال الموسم، لا يمكن ضمانها. ستوفر الرحلة البحرية مناظر ساحلية جميلة وحياة بحرية."}',
    '{"question": "هل رحلة القارب مناسبة للجميع؟", "answer": "تعمل الرحلة البحرية في مياه الخليج الهادئة، لكن المعرضون لدوار البحر يجب أن يأخذوا احتياطات. الأطفال وكبار السن مرحب بهم."}'
  ],
  'مراقبة الحيتان في هيرمانوس | أفضل تجربة رحلة بحرية للحيتان من كيب تاون',
  'مراقبة حيتان عالمية المستوى في هيرمانوس مع رحلة بحرية بالقارب. جولة ليوم كامل من كيب تاون خلال موسم الحيتان (يونيو-نوفمبر). حيتان الحق الجنوبية مضمونة!',
  ARRAY['مراقبة حيتان هيرمانوس', 'رحلة بحرية حيتان', 'حيتان الحق الجنوبية', 'موسم الحيتان', 'جولة حيتان كيب تاون'],
  'published',
  'Professional Arabic translation, maintaining same depth and structure as English original'
)

ON CONFLICT (tour_id, locale) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  highlights = EXCLUDED.highlights,
  inclusions = EXCLUDED.inclusions,
  exclusions = EXCLUDED.exclusions,
  important_info = EXCLUDED.important_info,
  what_to_bring = EXCLUDED.what_to_bring,
  itinerary = EXCLUDED.itinerary,
  faqs = EXCLUDED.faqs,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  translation_quality = EXCLUDED.translation_quality,
  translator_notes = EXCLUDED.translator_notes,
  updated_at = NOW();

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Verify all translations were added successfully
SELECT 
  t.slug as tour_slug,
  tt.locale,
  tt.title,
  tt.translation_quality,
  LENGTH(tt.description) as description_length,
  ARRAY_LENGTH(tt.highlights, 1) as highlights_count,
  ARRAY_LENGTH(tt.inclusions, 1) as inclusions_count,
  ARRAY_LENGTH(tt.itinerary, 1) as itinerary_count,
  ARRAY_LENGTH(tt.faqs, 1) as faqs_count,
  tt.created_at
FROM tour_translations tt
JOIN tours t ON tt.tour_id = t.id
WHERE tt.locale IN ('de', 'fr', 'es', 'ar')
ORDER BY t.slug, tt.locale;

-- Summary of translations per tour
SELECT 
  t.slug as tour_slug,
  COUNT(tt.id) as translation_count,
  ARRAY_AGG(tt.locale ORDER BY tt.locale) as languages
FROM tours t
LEFT JOIN tour_translations tt ON t.id = tt.tour_id AND tt.locale IN ('de', 'fr', 'es', 'ar')
GROUP BY t.id, t.slug
ORDER BY t.slug;