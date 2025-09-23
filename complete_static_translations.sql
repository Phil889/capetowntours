-- Complete static UI translations for tour detail pages
-- This includes all the translation keys used in the updated components
-- Run this in Supabase SQL Editor

INSERT INTO static_translations (key, locale, value, context, description, is_approved) VALUES

-- Arabic translations for tour detail components
-- Tour Detail Page Sections
('about_this_experience', 'ar', 'حول هذه التجربة', 'tour_detail', 'Section header for tour overview', true),
('tour_highlights', 'ar', 'أبرز معالم الجولة', 'tour_detail', 'Section header for tour highlights', true),
('inclusions_exclusions', 'ar', 'المشمول والمستثنى', 'tour_detail', 'Section header for inclusions and exclusions', true),
('whats_included', 'ar', 'ما هو مشمول', 'tour_detail', 'Subsection for included items', true),
('not_included', 'ar', 'غير مشمول', 'tour_detail', 'Subsection for excluded items', true),
('your_journey', 'ar', 'رحلتك', 'tour_detail', 'Section header for itinerary', true),
('stop_number', 'ar', 'المحطة {{number}}', 'tour_detail', 'Itinerary stop number with placeholder', true),
('frequently_asked_questions', 'ar', 'الأسئلة الشائعة', 'tour_detail', 'Section header for FAQs', true),
('important_information', 'ar', 'معلومات مهمة', 'tour_detail', 'Section header for important info', true),
('seasonal_notes', 'ar', 'ملاحظات موسمية', 'tour_detail', 'Subsection for seasonal information', true),
('child_policy', 'ar', 'سياسة الأطفال', 'tour_detail', 'Subsection for child policy', true),
('accessibility', 'ar', 'إمكانية الوصول', 'tour_detail', 'Subsection for accessibility info', true),
('cancellation_policy', 'ar', 'سياسة الإلغاء', 'tour_detail', 'Subsection for cancellation policy', true),

-- Tour Location Section
('tour_location', 'ar', 'موقع الجولة', 'tour_detail', 'Tour location section header', true),
('departure', 'ar', 'المغادرة', 'tour_detail', 'Departure time label', true),
('pickup', 'ar', 'الاستلام', 'tour_detail', 'Pickup location label', true),
('getting_there', 'ar', 'الوصول إلى هناك', 'tour_detail', 'Getting there section', true),
('free_hotel_pickup', 'ar', 'استلام مجاني من الفندق', 'tour_detail', 'Free hotel pickup text', true),
('self_drive_transport', 'ar', 'القيادة الذاتية أو ترتيب النقل', 'tour_detail', 'Self drive transport text', true),
('duration', 'ar', 'المدة', 'tour_detail', 'Duration label', true),
('meeting_point', 'ar', 'نقطة اللقاء', 'tour_detail', 'Meeting point label', true),
('details_after_booking', 'ar', 'التفاصيل بعد الحجز', 'tour_detail', 'Details after booking text', true),

-- Guest Reviews Section
('guest_reviews', 'ar', 'تقييمات الضيوف', 'tour_detail', 'Guest reviews section header', true),
('excellent', 'ar', 'ممتاز', 'tour_detail', 'Excellent rating text', true),
('based_on_reviews', 'ar', 'بناءً على {{count}} تقييم', 'tour_detail', 'Based on reviews text with count', true),
('show_more_reviews', 'ar', 'عرض المزيد من التقييمات', 'tour_detail', 'Show more reviews button', true),
('show_less_reviews', 'ar', 'عرض تقييمات أقل', 'tour_detail', 'Show less reviews button', true),

-- Booking Widget
('book_your_tour', 'ar', 'احجز جولتك', 'booking', 'Main booking widget title', true),
('reserve_spot_today', 'ar', 'احجز مكانك اليوم', 'booking', 'Default booking description', true),
('reserve_spot_for_tour', 'ar', 'احجز مكانك في {{tourName}}', 'booking', 'Booking description with tour name', true),
('tour_date', 'ar', 'تاريخ الجولة', 'booking', 'Date field label', true),
('guests', 'ar', 'الضيوف', 'booking', 'Guests field label', true),
('full_name', 'ar', 'الاسم الكامل', 'booking', 'Name field label', true),
('name_placeholder', 'ar', 'أحمد محمد', 'booking', 'Name field placeholder', true),
('email_address', 'ar', 'عنوان البريد الإلكتروني', 'booking', 'Email field label', true),
('email_placeholder', 'ar', 'your@email.com', 'booking', 'Email field placeholder', true),
('phone_number', 'ar', 'رقم الهاتف', 'booking', 'Phone field label', true),
('phone_placeholder', 'ar', '+966 12 345 6789', 'booking', 'Phone field placeholder', true),
('phone_help_text', 'ar', 'أدخل رمز البلد للأرقام الدولية', 'booking', 'Phone field help text', true),
('pickup_location', 'ar', 'موقع الاستلام', 'booking', 'Pickup location field label', true),
('pickup_placeholder', 'ar', 'اسم الفندق أو العنوان', 'booking', 'Pickup location placeholder', true),
('pickup_help_text', 'ar', 'نوفر خدمة الاستلام المجانية من معظم فنادق كيب تاون', 'booking', 'Pickup location help text', true),
('special_requirements', 'ar', 'متطلبات خاصة', 'booking', 'Special requirements field label', true),
('special_requirements_placeholder', 'ar', 'أي قيود غذائية أو احتياجات إمكانية وصول أو طلبات خاصة؟', 'booking', 'Special requirements placeholder', true),
('price_per_person', 'ar', 'السعر للشخص الواحد', 'booking', 'Price per person label', true),
('total_amount', 'ar', 'المبلغ الإجمالي', 'booking', 'Total amount label', true),
('payment_on_pickup', 'ar', 'الدفع عند الاستلام', 'booking', 'Payment method info', true),
('no_advance_payment', 'ar', 'لا حاجة لدفع مقدم', 'booking', 'No advance payment info', true),
('please_fill_required_fields', 'ar', 'يرجى ملء جميع الحقول المطلوبة', 'booking', 'Validation error message', true),
('booking_confirmed_redirecting', 'ar', 'تم تأكيد الحجز! جاري التوجيه إلى صفحة التأكيد...', 'booking', 'Success message', true),
('processing_booking', 'ar', 'جاري معالجة الحجز', 'booking', 'Loading state text', true),
('book_now_pay_pickup', 'ar', 'احجز الآن - ادفع عند الاستلام', 'booking', 'Main booking button text', true),
('instant_confirmation', 'ar', 'تأكيد فوري', 'booking', 'Trust badge text', true),
('free_cancellation', 'ar', 'إلغاء مجاني', 'booking', 'Trust badge text', true),
('best_price_guarantee', 'ar', 'ضمان أفضل سعر', 'booking', 'Trust badge text', true),
('secure_information', 'ar', 'معلوماتك آمنة ولن يتم مشاركتها أبداً', 'booking', 'Security message', true),

-- German translations
-- Tour Detail Page Sections
('about_this_experience', 'de', 'Über dieses Erlebnis', 'tour_detail', 'Section header for tour overview', true),
('tour_highlights', 'de', 'Tour-Highlights', 'tour_detail', 'Section header for tour highlights', true),
('inclusions_exclusions', 'de', 'Einschlüsse & Ausschlüsse', 'tour_detail', 'Section header for inclusions and exclusions', true),
('whats_included', 'de', 'Was ist enthalten', 'tour_detail', 'Subsection for included items', true),
('not_included', 'de', 'Nicht enthalten', 'tour_detail', 'Subsection for excluded items', true),
('your_journey', 'de', 'Ihre Reise', 'tour_detail', 'Section header for itinerary', true),
('stop_number', 'de', 'Stopp {{number}}', 'tour_detail', 'Itinerary stop number with placeholder', true),
('frequently_asked_questions', 'de', 'Häufig gestellte Fragen', 'tour_detail', 'Section header for FAQs', true),
('important_information', 'de', 'Wichtige Informationen', 'tour_detail', 'Section header for important info', true),
('seasonal_notes', 'de', 'Saisonale Hinweise', 'tour_detail', 'Subsection for seasonal information', true),
('child_policy', 'de', 'Kinderrichtlinie', 'tour_detail', 'Subsection for child policy', true),
('accessibility', 'de', 'Barrierefreiheit', 'tour_detail', 'Subsection for accessibility info', true),
('cancellation_policy', 'de', 'Stornierungsrichtlinie', 'tour_detail', 'Subsection for cancellation policy', true),

-- Tour Location Section
('tour_location', 'de', 'Tour-Standort', 'tour_detail', 'Tour location section header', true),
('departure', 'de', 'Abfahrt', 'tour_detail', 'Departure time label', true),
('pickup', 'de', 'Abholung', 'tour_detail', 'Pickup location label', true),
('getting_there', 'de', 'Anreise', 'tour_detail', 'Getting there section', true),
('free_hotel_pickup', 'de', 'Kostenlose Hotelabholung', 'tour_detail', 'Free hotel pickup text', true),
('self_drive_transport', 'de', 'Selbstfahrt oder Transport arrangieren', 'tour_detail', 'Self drive transport text', true),
('duration', 'de', 'Dauer', 'tour_detail', 'Duration label', true),
('meeting_point', 'de', 'Treffpunkt', 'tour_detail', 'Meeting point label', true),
('details_after_booking', 'de', 'Details nach der Buchung', 'tour_detail', 'Details after booking text', true),

-- Guest Reviews Section
('guest_reviews', 'de', 'Gästebewertungen', 'tour_detail', 'Guest reviews section header', true),
('excellent', 'de', 'Ausgezeichnet', 'tour_detail', 'Excellent rating text', true),
('based_on_reviews', 'de', 'Basierend auf {{count}} Bewertungen', 'tour_detail', 'Based on reviews text with count', true),
('show_more_reviews', 'de', 'Mehr Bewertungen anzeigen', 'tour_detail', 'Show more reviews button', true),
('show_less_reviews', 'de', 'Weniger Bewertungen anzeigen', 'tour_detail', 'Show less reviews button', true),

-- Booking Widget
('book_your_tour', 'de', 'Buchen Sie Ihre Tour', 'booking', 'Main booking widget title', true),
('reserve_spot_today', 'de', 'Reservieren Sie heute Ihren Platz', 'booking', 'Default booking description', true),
('reserve_spot_for_tour', 'de', 'Reservieren Sie Ihren Platz für {{tourName}}', 'booking', 'Booking description with tour name', true),
('tour_date', 'de', 'Tour-Datum', 'booking', 'Date field label', true),
('guests', 'de', 'Gäste', 'booking', 'Guests field label', true),
('full_name', 'de', 'Vollständiger Name', 'booking', 'Name field label', true),
('name_placeholder', 'de', 'Max Mustermann', 'booking', 'Name field placeholder', true),
('email_address', 'de', 'E-Mail-Adresse', 'booking', 'Email field label', true),
('email_placeholder', 'de', 'ihre@email.com', 'booking', 'Email field placeholder', true),
('phone_number', 'de', 'Telefonnummer', 'booking', 'Phone field label', true),
('phone_placeholder', 'de', '+49 30 12345678', 'booking', 'Phone field placeholder', true),
('phone_help_text', 'de', 'Ländercode für internationale Nummern angeben', 'booking', 'Phone field help text', true),
('pickup_location', 'de', 'Abholort', 'booking', 'Pickup location field label', true),
('pickup_placeholder', 'de', 'Ihr Hotelname oder Adresse', 'booking', 'Pickup location placeholder', true),
('pickup_help_text', 'de', 'Wir bieten kostenlosen Abholservice von den meisten Hotels in Kapstadt', 'booking', 'Pickup location help text', true),
('special_requirements', 'de', 'Besondere Anforderungen', 'booking', 'Special requirements field label', true),
('special_requirements_placeholder', 'de', 'Diätbeschränkungen, Barrierefreiheit oder besondere Wünsche?', 'booking', 'Special requirements placeholder', true),
('price_per_person', 'de', 'Preis pro Person', 'booking', 'Price per person label', true),
('total_amount', 'de', 'Gesamtbetrag', 'booking', 'Total amount label', true),
('payment_on_pickup', 'de', 'Zahlung bei Abholung', 'booking', 'Payment method info', true),
('no_advance_payment', 'de', 'Keine Vorauszahlung erforderlich', 'booking', 'No advance payment info', true),
('please_fill_required_fields', 'de', 'Bitte füllen Sie alle Pflichtfelder aus', 'booking', 'Validation error message', true),
('booking_confirmed_redirecting', 'de', 'Buchung bestätigt! Weiterleitung zur Bestätigungsseite...', 'booking', 'Success message', true),
('processing_booking', 'de', 'Buchung wird bearbeitet', 'booking', 'Loading state text', true),
('book_now_pay_pickup', 'de', 'Jetzt buchen - Bei Abholung zahlen', 'booking', 'Main booking button text', true),
('instant_confirmation', 'de', 'Sofortige Bestätigung', 'booking', 'Trust badge text', true),
('free_cancellation', 'de', 'Kostenlose Stornierung', 'booking', 'Trust badge text', true),
('best_price_guarantee', 'de', 'Bestpreisgarantie', 'booking', 'Trust badge text', true),
('secure_information', 'de', 'Ihre Informationen sind sicher und werden niemals geteilt', 'booking', 'Security message', true),

-- French translations
-- Tour Detail Page Sections
('about_this_experience', 'fr', 'À propos de cette expérience', 'tour_detail', 'Section header for tour overview', true),
('tour_highlights', 'fr', 'Points forts de la visite', 'tour_detail', 'Section header for tour highlights', true),
('inclusions_exclusions', 'fr', 'Inclusions et exclusions', 'tour_detail', 'Section header for inclusions and exclusions', true),
('whats_included', 'fr', 'Ce qui est inclus', 'tour_detail', 'Subsection for included items', true),
('not_included', 'fr', 'Non inclus', 'tour_detail', 'Subsection for excluded items', true),
('your_journey', 'fr', 'Votre voyage', 'tour_detail', 'Section header for itinerary', true),
('stop_number', 'fr', 'Arrêt {{number}}', 'tour_detail', 'Itinerary stop number with placeholder', true),
('frequently_asked_questions', 'fr', 'Questions fréquemment posées', 'tour_detail', 'Section header for FAQs', true),
('important_information', 'fr', 'Informations importantes', 'tour_detail', 'Section header for important info', true),
('seasonal_notes', 'fr', 'Notes saisonnières', 'tour_detail', 'Subsection for seasonal information', true),
('child_policy', 'fr', 'Politique enfants', 'tour_detail', 'Subsection for child policy', true),
('accessibility', 'fr', 'Accessibilité', 'tour_detail', 'Subsection for accessibility info', true),
('cancellation_policy', 'fr', 'Politique d''annulation', 'tour_detail', 'Subsection for cancellation policy', true),

-- Spanish translations
-- Tour Detail Page Sections
('about_this_experience', 'es', 'Acerca de esta experiencia', 'tour_detail', 'Section header for tour overview', true),
('tour_highlights', 'es', 'Aspectos destacados del tour', 'tour_detail', 'Section header for tour highlights', true),
('inclusions_exclusions', 'es', 'Inclusiones y exclusiones', 'tour_detail', 'Section header for inclusions and exclusions', true),
('whats_included', 'es', 'Qué está incluido', 'tour_detail', 'Subsection for included items', true),
('not_included', 'es', 'No incluido', 'tour_detail', 'Subsection for excluded items', true),
('your_journey', 'es', 'Tu viaje', 'tour_detail', 'Section header for itinerary', true),
('stop_number', 'es', 'Parada {{number}}', 'tour_detail', 'Itinerary stop number with placeholder', true),
('frequently_asked_questions', 'es', 'Preguntas frecuentes', 'tour_detail', 'Section header for FAQs', true),
('important_information', 'es', 'Información importante', 'tour_detail', 'Section header for important info', true),
('seasonal_notes', 'es', 'Notas estacionales', 'tour_detail', 'Subsection for seasonal information', true),
('child_policy', 'es', 'Política de niños', 'tour_detail', 'Subsection for child policy', true),
('accessibility', 'es', 'Accesibilidad', 'tour_detail', 'Subsection for accessibility info', true),
('cancellation_policy', 'es', 'Política de cancelación', 'tour_detail', 'Subsection for cancellation policy', true)

ON CONFLICT (key, locale) DO UPDATE SET 
  value = EXCLUDED.value,
  context = EXCLUDED.context,
  description = EXCLUDED.description,
  is_approved = EXCLUDED.is_approved,
  updated_at = NOW();

-- Verify the translations were added
SELECT key, locale, value, is_approved 
FROM static_translations 
WHERE locale IN ('ar', 'de', 'fr', 'es') 
  AND context IN ('tour_detail', 'booking')
ORDER BY locale, key;