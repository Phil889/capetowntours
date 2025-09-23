-- =============================================
-- TOUR CONTENT TRANSLATIONS FOR CAPE TOWN SAFARI TOURS
-- This script adds comprehensive translations for tour content
-- =============================================

-- Add tour translations for Aquila Big 5 Day Safari

-- German Translation
INSERT INTO tour_translations (
  tour_id, 
  locale, 
  title, 
  description, 
  short_description,
  highlights,
  inclusions,
  exclusions,
  important_info,
  what_to_bring,
  itinerary,
  faqs,
  meta_title,
  meta_description,
  translation_quality,
  translator_notes
) VALUES 
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
    '{"time": "13:00", "activity": "Mittagessen", "description": "Traditionelle südafrikanische Küche"}',
    '{"time": "14:30", "activity": "Nachmittägliche Pirschfahrt", "description": "Weitere Wildtierbeobachtungen"}',
    '{"time": "17:00", "activity": "Rückfahrt nach Kapstadt", "description": "Entspannte Fahrt mit Sonnenuntergang"}',
    '{"time": "19:30", "activity": "Ankunft in Kapstadt", "description": "Absetzen an Ihrer Unterkunft"}'
  ],
  ARRAY[
    '{"question": "Welche Tiere können wir sehen?", "answer": "Das Aquila Game Reserve beherbergt die Big 5 (Löwe, Elefant, Nashorn, Leopard, Büffel) sowie viele andere afrikanische Wildtiere wie Zebras, Giraffen, Strauße und verschiedene Antilopenarten."}',
    '{"question": "Ist das für Kinder geeignet?", "answer": "Ja, diese Safari ist familienfreundlich und für alle Altersgruppen geeignet. Kinder werden die Wildtiere lieben, und unsere erfahrenen Guides sorgen für ein sicheres und lehrreiches Erlebnis."}',
    '{"question": "Was ist, wenn das Wetter schlecht ist?", "answer": "Safaris finden bei den meisten Wetterbedingungen statt. Bei extremem Wetter können Änderungen am Programm vorgenommen werden, um Ihre Sicherheit und Ihren Komfort zu gewährleisten."}',
    '{"question": "Können wir Fotos machen?", "answer": "Absolut! Bringen Sie Ihre Kamera mit. Unsere Guides helfen Ihnen gerne dabei, die perfekten Wildlife-Aufnahmen zu machen."}',
    '{"question": "Gibt es Toiletten vor Ort?", "answer": "Ja, das Aquila Game Reserve verfügt über moderne Einrichtungen einschließlich sauberer Toiletten und eines Restaurants."}'
  ],
  'Aquila Big 5 Tages-Safari | Kapstadt Safari-Touren',
  'Erleben Sie Afrikas Big 5 bei einer unvergesslichen Tages-Safari im Aquila Game Reserve. Professionelle Guides, luxuriöse Fahrzeuge und traditionelles Mittagessen inklusive.',
  'published',
  'Professional German translation, culturally adapted for German-speaking tourists'
),

-- French Translation
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
    '{"time": "13:00", "activity": "Déjeuner", "description": "Cuisine sud-africaine traditionnelle"}',
    '{"time": "14:30", "activity": "Safari de l''après-midi", "description": "Observations supplémentaires de la faune"}',
    '{"time": "17:00", "activity": "Retour au Cap", "description": "Voyage détendu avec coucher de soleil"}',
    '{"time": "19:30", "activity": "Arrivée au Cap", "description": "Dépose à votre hébergement"}'
  ],
  ARRAY[
    '{"question": "Quels animaux pouvons-nous voir ?", "answer": "La réserve d''Aquila abrite les Big 5 (lion, éléphant, rhinocéros, léopard, buffle) ainsi que de nombreux autres animaux sauvages africains comme les zèbres, girafes, autruches et diverses espèces d''antilopes."}',
    '{"question": "Est-ce adapté aux enfants ?", "answer": "Oui, ce safari est familial et convient à tous les âges. Les enfants adoreront voir les animaux sauvages, et nos guides expérimentés garantissent une expérience sûre et éducative."}',
    '{"question": "Que se passe-t-il si le temps est mauvais ?", "answer": "Les safaris ont lieu par la plupart des conditions météorologiques. En cas de temps extrême, des modifications peuvent être apportées au programme pour assurer votre sécurité et votre confort."}',
    '{"question": "Pouvons-nous prendre des photos ?", "answer": "Absolument ! Apportez votre appareil photo. Nos guides seront heureux de vous aider à capturer les parfaits clichés de la faune."}',
    '{"question": "Y a-t-il des toilettes sur place ?", "answer": "Oui, la réserve d''Aquila dispose d''installations modernes incluant des toilettes propres et un restaurant."}'
  ],
  'Safari d''une journée Aquila Big 5 | Tours Safari Le Cap',
  'Vivez les Big 5 d''Afrique lors d''un safari d''une journée inoubliable à la réserve d''Aquila. Guides professionnels, véhicules de luxe et déjeuner traditionnel inclus.',
  'published',
  'Professional French translation, culturally adapted for French-speaking tourists'
),

-- Spanish Translation
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
    '{"time": "13:00", "activity": "Almuerzo", "description": "Cocina tradicional sudafricana"}',
    '{"time": "14:30", "activity": "Safari vespertino", "description": "Observaciones adicionales de vida salvaje"}',
    '{"time": "17:00", "activity": "Regreso a Ciudad del Cabo", "description": "Viaje relajado con puesta de sol"}',
    '{"time": "19:30", "activity": "Llegada a Ciudad del Cabo", "description": "Bajada en tu alojamiento"}'
  ],
  ARRAY[
    '{"question": "¿Qué animales podemos ver?", "answer": "La Reserva Aquila alberga los Big 5 (león, elefante, rinoceronte, leopardo, búfalo) así como muchos otros animales salvajes africanos como cebras, jirafas, avestruces y varias especies de antílopes."}',
    '{"question": "¿Es adecuado para niños?", "answer": "Sí, este safari es familiar y adecuado para todas las edades. Los niños encantarán ver los animales salvajes, y nuestros guías experimentados aseguran una experiencia segura y educativa."}',
    '{"question": "¿Qué pasa si el tiempo es malo?", "answer": "Los safaris se realizan en la mayoría de las condiciones climáticas. En caso de clima extremo, se pueden hacer modificaciones al programa para asegurar tu seguridad y comodidad."}',
    '{"question": "¿Podemos tomar fotos?", "answer": "¡Absolutamente! Trae tu cámara. Nuestros guías estarán encantados de ayudarte a capturar las perfectas tomas de vida salvaje."}',
    '{"question": "¿Hay baños en el lugar?", "answer": "Sí, la Reserva Aquila tiene instalaciones modernas incluyendo baños limpios y un restaurante."}'
  ],
  'Safari de un día Aquila Big 5 | Tours Safari Ciudad del Cabo',
  'Experimenta los Big 5 de África en un safari de día inolvidable en la Reserva Aquila. Guías profesionales, vehículos de lujo y almuerzo tradicional incluido.',
  'published',
  'Professional Spanish translation, culturally adapted for Spanish-speaking tourists'
),

-- Arabic Translation
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
    '{"time": "13:00", "activity": "الغداء", "description": "مطبخ جنوب أفريقي تقليدي"}',
    '{"time": "14:30", "activity": "رحلة سفاري بعد الظهر", "description": "مراقبة إضافية للحياة البرية"}',
    '{"time": "17:00", "activity": "العودة إلى كيب تاون", "description": "رحلة مريحة مع غروب الشمس"}',
    '{"time": "19:30", "activity": "الوصول إلى كيب تاون", "description": "الإنزال في مكان إقامتك"}'
  ],
  ARRAY[
    '{"question": "ما هي الحيوانات التي يمكننا رؤيتها؟", "answer": "تضم محمية أكويلا الحيوانات الخمسة الكبرى (الأسد والفيل ووحيد القرن والفهد والجاموس) بالإضافة إلى العديد من الحيوانات البرية الأفريقية الأخرى مثل الحمار الوحشي والزرافة والنعامة وأنواع مختلفة من الظباء."}',
    '{"question": "هل هو مناسب للأطفال؟", "answer": "نعم، هذا السفاري مناسب للعائلات ولجميع الأعمار. سيحب الأطفال رؤية الحيوانات البرية، ومرشدونا ذوو الخبرة يضمنون تجربة آمنة وتعليمية."}',
    '{"question": "ماذا لو كان الطقس سيئاً؟", "answer": "تجري رحلات السفاري في معظم الأحوال الجوية. في حالة الطقس القاسي، قد يتم إجراء تعديلات على البرنامج لضمان سلامتك وراحتك."}',
    '{"question": "هل يمكننا التقاط الصور؟", "answer": "بالتأكيد! أحضر كاميرتك. سيكون مرشدونا سعداء لمساعدتك في التقاط أفضل صور للحياة البرية."}',
    '{"question": "هل توجد دورات مياه في الموقع؟", "answer": "نعم، تحتوي محمية أكويلا على مرافق حديثة تشمل دورات مياه نظيفة ومطعماً."}'
  ],
  'سفاري أكويلا للحيوانات الخمسة الكبرى ليوم واحد | جولات سفاري كيب تاون',
  'اختبر الحيوانات الخمسة الكبرى في أفريقيا في سفاري ليوم لا يُنسى في محمية أكويلا. مرشدون محترفون ومركبات فاخرة وغداء تقليدي مشمول.',
  'published',
  'Professional Arabic translation, culturally adapted for Arabic-speaking tourists'
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
  translation_quality = EXCLUDED.translation_quality,
  translator_notes = EXCLUDED.translator_notes,
  updated_at = NOW();

-- Verify the translations were added
SELECT 
  t.slug,
  tt.locale,
  tt.title,
  tt.translation_quality,
  tt.created_at
FROM tour_translations tt
JOIN tours t ON tt.tour_id = t.id
WHERE tt.locale IN ('de', 'fr', 'es', 'ar')
  AND t.slug = 'aquila-big-5-day-safari'
ORDER BY tt.locale;