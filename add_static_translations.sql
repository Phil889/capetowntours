-- Add comprehensive static UI translations for Arabic tour detail page
-- Run this in Supabase SQL Editor

INSERT INTO static_translations (key, locale, value, context, is_approved) VALUES

-- Section Headers
('tour.about.title', 'ar', 'حول هذه التجربة', 'tour-detail', true),
('tour.highlights.title', 'ar', 'أبرز المعالم', 'tour-detail', true),
('tour.journey.title', 'ar', 'رحلتك', 'tour-detail', true),
('tour.inclusions.title', 'ar', 'المشمول والمستثنى', 'tour-detail', true),
('tour.included.title', 'ar', 'ما هو مشمول', 'tour-detail', true),
('tour.excluded.title', 'ar', 'غير مشمول', 'tour-detail', true),
('tour.important.title', 'ar', 'معلومات مهمة', 'tour-detail', true),
('tour.faqs.title', 'ar', 'الأسئلة الشائعة', 'tour-detail', true),
('tour.location.title', 'ar', 'موقع الجولة', 'tour-detail', true),
('tour.reviews.title', 'ar', 'تقييمات الضيوف', 'tour-detail', true),

-- Booking Section
('tour.book.title', 'ar', 'احجز جولتك', 'tour-detail', true),
('tour.book.from', 'ar', 'من', 'tour-detail', true),
('tour.book.person', 'ar', 'للشخص', 'tour-detail', true),
('tour.book.button', 'ar', 'احجز الآن - دفع آمن', 'tour-detail', true),
('tour.book.secure', 'ar', 'دفع آمن', 'tour-detail', true),
('tour.book.instant', 'ar', 'تأكيد فوري', 'tour-detail', true),
('tour.book.cancellation', 'ar', 'إلغاء مجاني', 'tour-detail', true),

-- Trust Indicators
('tour.rating', 'ar', 'التقييم', 'tour-detail', true),
('tour.satisfaction', 'ar', 'الرضا', 'tour-detail', true),
('tour.reviews', 'ar', 'المراجعات', 'tour-detail', true),
('tour.years', 'ar', 'سنوات', 'tour-detail', true),

-- Common Actions
('common.readMore', 'ar', 'اقرأ المزيد', 'common', true),
('common.showLess', 'ar', 'عرض أقل', 'common', true),
('common.viewOnMap', 'ar', 'عرض على الخريطة', 'common', true),
('common.getDirections', 'ar', 'احصل على الاتجاهات', 'common', true),

-- Tour Details
('tour.duration', 'ar', 'المدة', 'tour-detail', true),
('tour.groupSize', 'ar', 'حجم المجموعة', 'tour-detail', true),
('tour.pickup', 'ar', 'نقطة الالتقاء', 'tour-detail', true),
('tour.departure', 'ar', 'وقت المغادرة', 'tour-detail', true),

-- Policies
('tour.cancellation.title', 'ar', 'سياسة الإلغاء', 'tour-detail', true),
('tour.child.policy', 'ar', 'سياسة الأطفال', 'tour-detail', true),
('tour.accessibility', 'ar', 'إمكانية الوصول', 'tour-detail', true),

-- Reviews Section
('reviews.excellent', 'ar', 'ممتاز', 'reviews', true),
('reviews.basedOn', 'ar', 'بناءً على', 'reviews', true),
('reviews.verified', 'ar', 'تقييمات موثقة', 'reviews', true),
('reviews.readAll', 'ar', 'اقرأ جميع التقييمات', 'reviews', true),

-- Navigation Breadcrumbs
('breadcrumb.home', 'ar', 'الرئيسية', 'navigation', true),
('breadcrumb.tours', 'ar', 'الجولات', 'navigation', true),

-- Form Labels
('form.adults', 'ar', 'البالغون', 'booking', true),
('form.children', 'ar', 'الأطفال', 'booking', true),
('form.date', 'ar', 'التاريخ', 'booking', true),
('form.time', 'ar', 'الوقت', 'booking', true),
('form.total', 'ar', 'المجموع', 'booking', true),

-- German translations for key sections
('tour.about.title', 'de', 'Über diese Erfahrung', 'tour-detail', true),
('tour.highlights.title', 'de', 'Höhepunkte', 'tour-detail', true),
('tour.journey.title', 'de', 'Ihre Reise', 'tour-detail', true),
('tour.inclusions.title', 'de', 'Einschlüsse & Ausschlüsse', 'tour-detail', true),
('tour.included.title', 'de', 'Inbegriffen', 'tour-detail', true),
('tour.excluded.title', 'de', 'Nicht inbegriffen', 'tour-detail', true),
('tour.important.title', 'de', 'Wichtige Informationen', 'tour-detail', true),
('tour.faqs.title', 'de', 'Häufig gestellte Fragen', 'tour-detail', true),
('tour.location.title', 'de', 'Tour-Standort', 'tour-detail', true),
('tour.reviews.title', 'de', 'Gästebewertungen', 'tour-detail', true),
('tour.book.title', 'de', 'Buchen Sie Ihre Tour', 'tour-detail', true),
('tour.book.button', 'de', 'Jetzt buchen - Sichere Zahlung', 'tour-detail', true),

-- French translations for key sections
('tour.about.title', 'fr', 'À propos de cette expérience', 'tour-detail', true),
('tour.highlights.title', 'fr', 'Points forts', 'tour-detail', true),
('tour.journey.title', 'fr', 'Votre voyage', 'tour-detail', true),
('tour.inclusions.title', 'fr', 'Inclusions et exclusions', 'tour-detail', true),
('tour.included.title', 'fr', 'Inclus', 'tour-detail', true),
('tour.excluded.title', 'fr', 'Non inclus', 'tour-detail', true),
('tour.important.title', 'fr', 'Informations importantes', 'tour-detail', true),
('tour.faqs.title', 'fr', 'Questions fréquemment posées', 'tour-detail', true),
('tour.location.title', 'fr', 'Lieu de la visite', 'tour-detail', true),
('tour.reviews.title', 'fr', 'Avis des clients', 'tour-detail', true),
('tour.book.title', 'fr', 'Réservez votre visite', 'tour-detail', true),
('tour.book.button', 'fr', 'Réserver maintenant - Paiement sécurisé', 'tour-detail', true),

-- Spanish translations for key sections
('tour.about.title', 'es', 'Acerca de esta experiencia', 'tour-detail', true),
('tour.highlights.title', 'es', 'Aspectos destacados', 'tour-detail', true),
('tour.journey.title', 'es', 'Tu viaje', 'tour-detail', true),
('tour.inclusions.title', 'es', 'Inclusiones y exclusiones', 'tour-detail', true),
('tour.included.title', 'es', 'Incluido', 'tour-detail', true),
('tour.excluded.title', 'es', 'No incluido', 'tour-detail', true),
('tour.important.title', 'es', 'Información importante', 'tour-detail', true),
('tour.faqs.title', 'es', 'Preguntas frecuentes', 'tour-detail', true),
('tour.location.title', 'es', 'Ubicación del tour', 'tour-detail', true),
('tour.reviews.title', 'es', 'Reseñas de huéspedes', 'tour-detail', true),
('tour.book.title', 'es', 'Reserva tu tour', 'tour-detail', true),
('tour.book.button', 'es', 'Reservar ahora - Pago seguro', 'tour-detail', true)

ON CONFLICT (key, locale) DO UPDATE SET 
  value = EXCLUDED.value,
  is_approved = EXCLUDED.is_approved,
  updated_at = NOW();

-- Verify the translations were added
SELECT key, locale, value, is_approved 
FROM static_translations 
WHERE locale IN ('ar', 'de', 'fr', 'es') 
  AND context = 'tour-detail'
ORDER BY locale, key;