-- =============================================
-- SAMPLE TOUR DATA FOR CAPE TOWN SAFARI TOURS
-- =============================================

-- Insert sample tours (English versions)
INSERT INTO tours (
  slug, 
  locale, 
  title, 
  description, 
  short_description,
  price_from_zar, 
  category, 
  duration_days,
  image_url, 
  image_alt_text,
  highlights,
  inclusions,
  exclusions,
  important_info,
  what_to_bring,
  itinerary,
  faqs,
  meta_title,
  meta_description,
  meta_keywords,
  translation_status,
  is_template
) VALUES 
-- Aquila Big 5 Day Safari
(
  'aquila-big-5-day-safari',
  'en',
  'Aquila Big 5 Day Safari',
  'Experience the thrill of seeing Africa''s Big 5 in their natural habitat at Aquila Private Game Reserve. This full-day safari adventure includes game drives, luxury accommodation options, and expert guides who will help you spot lions, elephants, rhinos, leopards, and buffalo.',
  'Full-day Big 5 safari experience at Aquila Private Game Reserve with expert guides.',
  2850,
  'safari',
  1,
  '/safari-elephants-river.png',
  'Elephants crossing river at Aquila Game Reserve',
  ARRAY['Big 5 wildlife viewing', 'Professional safari guide', 'Luxury game drive vehicle', 'Traditional South African lunch', 'Scenic mountain views'],
  ARRAY['Return transport from Cape Town', 'Professional safari guide', 'Game drive in open safari vehicle', 'Traditional lunch', 'All park entrance fees'],
  ARRAY['Personal expenses', 'Gratuities', 'Alcoholic beverages', 'Optional activities'],
  ARRAY['Departure at 7:00 AM from Cape Town', 'Safari duration: 8-10 hours', 'Weather dependent', 'Suitable for all ages'],
  ARRAY['Comfortable walking shoes', 'Hat and sunglasses', 'Sunscreen', 'Camera', 'Warm jacket (winter months)'],
  ARRAY[
    '{"time": "07:00", "activity": "Pickup from Cape Town accommodation", "description": "Comfortable air-conditioned transport"}',
    '{"time": "09:30", "activity": "Arrival at Aquila Game Reserve", "description": "Welcome drink and safari briefing"}',
    '{"time": "10:00", "activity": "Morning game drive", "description": "3-hour Big 5 safari experience"}',
    '{"time": "13:00", "activity": "Traditional lunch", "description": "Authentic South African cuisine"}',
    '{"time": "14:30", "activity": "Afternoon game drive", "description": "Continue wildlife viewing"}',
    '{"time": "17:00", "activity": "Return journey to Cape Town", "description": "Scenic drive through countryside"}',
    '{"time": "19:30", "activity": "Drop-off at accommodation", "description": "End of safari experience"}'
  ],
  ARRAY[
    '{"question": "What animals will I see?", "answer": "While we cannot guarantee specific sightings, Aquila is home to the Big 5 (lion, elephant, rhino, leopard, buffalo) plus many other species including giraffe, zebra, and various antelope."}',
    '{"question": "What should I wear?", "answer": "Comfortable clothing in neutral colors (khaki, brown, green), closed shoes, hat, and sunglasses. Bring a warm jacket for early morning and evening drives."}',
    '{"question": "Is this suitable for children?", "answer": "Yes, this safari is family-friendly and suitable for children of all ages. Children under 2 travel free."}',
    '{"question": "What if the weather is bad?", "answer": "Game drives operate in most weather conditions. Our vehicles have covers for rain protection."}'
  ],
  'Aquila Big 5 Safari | Full Day Wildlife Experience from Cape Town',
  'Experience Africa''s Big 5 at Aquila Game Reserve. Full-day safari from Cape Town with expert guides, luxury transport & traditional lunch. Book your wildlife adventure!',
  ARRAY['big 5 safari', 'aquila game reserve', 'cape town safari', 'wildlife tour', 'south africa safari'],
  'published',
  true
),

-- Inverdoorn Exclusive Day Safari
(
  'inverdoorn-exclusive-day-safari',
  'en',
  'Inverdoorn Exclusive Day Safari',
  'Discover the exclusive Inverdoorn Game Reserve on this premium safari experience. Located in the scenic Ceres Valley, this private reserve offers intimate wildlife encounters with cheetahs, white lions, and other African species in a malaria-free environment.',
  'Exclusive safari experience at Inverdoorn Game Reserve with cheetah and white lion encounters.',
  3200,
  'safari',
  1,
  '/safari-giraffe-sunset.webp',
  'Giraffe silhouette against sunset at Inverdoorn',
  ARRAY['Exclusive cheetah encounters', 'Rare white lion sightings', 'Malaria-free environment', 'Scenic Ceres Valley location', 'Small group experience'],
  ARRAY['Return luxury transport', 'Professional guide', 'Game drives', 'Gourmet lunch', 'Park fees', 'Refreshments'],
  ARRAY['Personal expenses', 'Gratuities', 'Optional activities', 'Alcoholic beverages'],
  ARRAY['Small groups only (max 8 people)', 'Malaria-free area', 'All weather operation', 'Photography opportunities'],
  ARRAY['Comfortable safari clothing', 'Camera with extra batteries', 'Sunhat and sunscreen', 'Binoculars (optional)'],
  ARRAY[
    '{"time": "07:30", "activity": "Departure from Cape Town", "description": "Luxury air-conditioned vehicle"}',
    '{"time": "10:00", "activity": "Arrival at Inverdoorn", "description": "Welcome and reserve briefing"}',
    '{"time": "10:30", "activity": "First game drive", "description": "Cheetah and predator focus"}',
    '{"time": "13:00", "activity": "Gourmet lunch", "description": "Fine dining with valley views"}',
    '{"time": "14:30", "activity": "Second game drive", "description": "White lions and general game"}',
    '{"time": "16:30", "activity": "Departure", "description": "Return journey to Cape Town"}',
    '{"time": "19:00", "activity": "Cape Town arrival", "description": "Drop-off at accommodation"}'
  ],
  ARRAY[
    '{"question": "What makes Inverdoorn special?", "answer": "Inverdoorn is home to rare white lions and offers exclusive cheetah encounters. It''s a private reserve with limited visitors, ensuring an intimate experience."}',
    '{"question": "Is it malaria-free?", "answer": "Yes, Inverdoorn is completely malaria-free, making it safe for all travelers including pregnant women and young children."}',
    '{"question": "How close do we get to the animals?", "answer": "Our experienced guides position vehicles for optimal viewing while respecting animal welfare. Cheetah encounters can be very close under controlled conditions."}'
  ],
  'Inverdoorn Safari | Exclusive Cheetah & White Lion Experience',
  'Exclusive Inverdoorn Game Reserve safari with cheetah encounters & rare white lions. Malaria-free, small groups, luxury transport from Cape Town.',
  ARRAY['inverdoorn safari', 'cheetah encounter', 'white lions', 'exclusive safari', 'malaria free safari'],
  'published',
  true
),

-- Boulders Beach Penguin Colony
(
  'boulders-beach-penguin-colony',
  'en',
  'Boulders Beach Penguin Colony Tour',
  'Visit the famous African penguin colony at Boulders Beach in Simon''s Town. This half-day tour combines penguin viewing with scenic coastal drives, historic naval town exploration, and optional wine tasting in the nearby Constantia wine region.',
  'Half-day tour to see African penguins at Boulders Beach with coastal scenery.',
  1450,
  'coastal',
  0.5,
  '/boulders-beach-penguins.jpg',
  'African penguins at Boulders Beach, Simon''s Town',
  ARRAY['African penguin colony', 'Scenic coastal drive', 'Historic Simon''s Town', 'Boulder-strewn beaches', 'Optional wine tasting'],
  ARRAY['Return transport', 'Professional guide', 'Boulders Beach entrance', 'Simon''s Town visit', 'Coastal scenic drive'],
  ARRAY['Lunch', 'Personal expenses', 'Optional wine tasting', 'Gratuities'],
  ARRAY['Penguin viewing is weather dependent', 'Breeding season: February to August', 'Swimming not recommended', 'Respect penguin boundaries'],
  ARRAY['Comfortable walking shoes', 'Sun protection', 'Camera', 'Light jacket', 'Water bottle'],
  ARRAY[
    '{"time": "09:00", "activity": "Cape Town departure", "description": "Scenic drive via Chapman''s Peak"}',
    '{"time": "10:30", "activity": "Boulders Beach arrival", "description": "Penguin colony viewing"}',
    '{"time": "11:30", "activity": "Simon''s Town exploration", "description": "Historic naval town visit"}',
    '{"time": "12:30", "activity": "Coastal drive", "description": "Scenic route with photo stops"}',
    '{"time": "13:30", "activity": "Optional wine tasting", "description": "Constantia wine region"}',
    '{"time": "15:00", "activity": "Return to Cape Town", "description": "Drop-off at accommodation"}'
  ],
  ARRAY[
    '{"question": "When is the best time to see penguins?", "answer": "Penguins are present year-round, but breeding season (February-August) offers the most active viewing with chicks and courtship behavior."}',
    '{"question": "Can we swim with the penguins?", "answer": "No, swimming is not permitted at Boulders Beach to protect the penguins. There are designated viewing areas and boardwalks."}',
    '{"question": "How many penguins will we see?", "answer": "The colony has approximately 3,000 penguins, though numbers vary seasonally. You''ll typically see dozens to hundreds depending on the time of year."}'
  ],
  'Boulders Beach Penguins | African Penguin Colony Tour from Cape Town',
  'Visit the famous African penguin colony at Boulders Beach. Half-day tour from Cape Town with scenic coastal drives & Simon''s Town exploration.',
  ARRAY['boulders beach', 'african penguins', 'simons town', 'penguin colony', 'cape town coastal tour'],
  'published',
  true
),

-- Hermanus Whale Watching Cruise
(
  'hermanus-whale-watching-cruise',
  'en',
  'Hermanus Whale Watching Cruise',
  'Experience the world''s best land-based whale watching in Hermanus during whale season (June-November). This full-day tour includes a whale watching cruise, scenic coastal drive, and exploration of the charming seaside town known as the whale watching capital of the world.',
  'Full-day whale watching experience in Hermanus with boat cruise and coastal exploration.',
  2650,
  'coastal',
  1,
  '/hermanus-whale-watching.jpg',
  'Southern Right Whale breaching near Hermanus coast',
  ARRAY['World-class whale watching', 'Boat-based whale cruise', 'Scenic Hermanus town', 'Coastal cliff walks', 'Whale season: June-November'],
  ARRAY['Return transport', 'Professional guide', 'Whale watching cruise', 'Hermanus town visit', 'Cliff path walks'],
  ARRAY['Lunch', 'Personal expenses', 'Seasickness medication', 'Gratuities'],
  ARRAY['Whale season: June to November', 'Weather dependent cruise', 'Bring seasickness medication', 'Whale sightings not guaranteed'],
  ARRAY['Warm clothing', 'Windproof jacket', 'Non-slip shoes', 'Camera with zoom lens', 'Seasickness tablets'],
  ARRAY[
    '{"time": "07:00", "activity": "Cape Town departure", "description": "Scenic drive via coastal route"}',
    '{"time": "09:30", "activity": "Hermanus arrival", "description": "Town orientation and cliff walk"}',
    '{"time": "10:30", "activity": "Whale watching cruise", "description": "2-hour boat-based whale viewing"}',
    '{"time": "13:00", "activity": "Lunch break", "description": "Free time for lunch in town"}',
    '{"time": "14:30", "activity": "Cliff path exploration", "description": "Land-based whale watching"}',
    '{"time": "16:00", "activity": "Return journey", "description": "Scenic drive back to Cape Town"}',
    '{"time": "18:30", "activity": "Cape Town arrival", "description": "Drop-off at accommodation"}'
  ],
  ARRAY[
    '{"question": "When is whale season?", "answer": "Southern Right Whales visit Hermanus from June to November, with peak season being August to October."}',
    '{"question": "What if we don''t see whales?", "answer": "While sightings are very common during season, they cannot be guaranteed. The cruise will still offer beautiful coastal scenery and marine life."}',
    '{"question": "Is the boat trip suitable for everyone?", "answer": "The cruise operates in calm bay waters, but those prone to seasickness should take precautions. Children and elderly are welcome."}'
  ],
  'Hermanus Whale Watching | Best Whale Cruise Experience from Cape Town',
  'World-class whale watching in Hermanus with boat cruise. Full-day tour from Cape Town during whale season (June-Nov). Southern Right Whales guaranteed!',
  ARRAY['hermanus whale watching', 'whale cruise', 'southern right whales', 'whale season', 'cape town whale tour'],
  'published',
  true
)

ON CONFLICT (slug, locale) DO NOTHING;

-- Insert locales if they don't exist
INSERT INTO locales (code, name, native_name, is_active, is_rtl, sort_order) VALUES
('en', 'English', 'English', true, false, 1),
('de', 'German', 'Deutsch', true, false, 2),
('fr', 'French', 'Français', true, false, 3),
('es', 'Spanish', 'Español', true, false, 4),
('ar', 'Arabic', 'العربية', true, true, 5)
ON CONFLICT (code) DO NOTHING;

-- Insert some sample static translations
INSERT INTO static_translations (key, locale, value, context, description, is_approved) VALUES
-- Navigation translations
('nav.home', 'en', 'Home', 'navigation', 'Main navigation home link', true),
('nav.tours', 'en', 'Tours', 'navigation', 'Main navigation tours link', true),
('nav.about', 'en', 'About', 'navigation', 'Main navigation about link', true),
('nav.contact', 'en', 'Contact', 'navigation', 'Main navigation contact link', true),

-- German translations
('nav.home', 'de', 'Startseite', 'navigation', 'Main navigation home link', true),
('nav.tours', 'de', 'Touren', 'navigation', 'Main navigation tours link', true),
('nav.about', 'de', 'Über uns', 'navigation', 'Main navigation about link', true),
('nav.contact', 'de', 'Kontakt', 'navigation', 'Main navigation contact link', true),

-- French translations
('nav.home', 'fr', 'Accueil', 'navigation', 'Main navigation home link', true),
('nav.tours', 'fr', 'Tours', 'navigation', 'Main navigation tours link', true),
('nav.about', 'fr', 'À propos', 'navigation', 'Main navigation about link', true),
('nav.contact', 'fr', 'Contact', 'navigation', 'Main navigation contact link', true),

-- Spanish translations
('nav.home', 'es', 'Inicio', 'navigation', 'Main navigation home link', true),
('nav.tours', 'es', 'Tours', 'navigation', 'Main navigation tours link', true),
('nav.about', 'es', 'Acerca de', 'navigation', 'Main navigation about link', true),
('nav.contact', 'es', 'Contacto', 'navigation', 'Main navigation contact link', true),

-- Arabic translations
('nav.home', 'ar', 'الرئيسية', 'navigation', 'Main navigation home link', true),
('nav.tours', 'ar', 'الجولات', 'navigation', 'Main navigation tours link', true),
('nav.about', 'ar', 'حولنا', 'navigation', 'Main navigation about link', true),
('nav.contact', 'ar', 'اتصل بنا', 'navigation', 'Main navigation contact link', true)

ON CONFLICT (key, locale) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();