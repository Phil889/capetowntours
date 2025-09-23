# Translation Deployment Instructions

## Overview
This guide provides step-by-step instructions for deploying complete tour content translations for the Cape Town Safari Tours website. The system supports 4 languages: German (de), French (fr), Spanish (es), and Arabic (ar).

## What's Included

### 1. Static UI Translations
- **File**: `add_static_translations.sql` & `complete_static_translations.sql`
- **Content**: UI elements, navigation, form labels, common phrases
- **Languages**: All 4 supported languages
- **Status**: ✅ Ready for deployment

### 2. Tour Content Translations  
- **File**: `complete_all_tour_translations.sql`
- **Content**: Complete 1:1 translations for all 4 tours
- **Tours Included**:
  - Aquila Big 5 Day Safari (`aquila-big-5-day-safari`)
  - Inverdoorn Exclusive Day Safari (`inverdoorn-exclusive-day-safari`)
  - Boulders Beach Penguin Colony (`boulders-beach-penguin-colony`)
  - Hermanus Whale Watching Cruise (`hermanus-whale-watching-cruise`)
- **Languages**: German, French, Spanish, Arabic
- **Status**: ✅ Ready for deployment

## Deployment Steps

### Step 1: Deploy Static UI Translations
```sql
-- Execute in Supabase SQL Editor or via psql
-- File: complete_static_translations.sql
-- This adds all UI translations for forms, navigation, tour detail pages
```

### Step 2: Deploy Tour Content Translations
```sql
-- Execute in Supabase SQL Editor or via psql  
-- File: complete_all_tour_translations.sql
-- This adds comprehensive tour content translations
```

### Step 3: Verify Deployment
```sql
-- Check translation counts
SELECT 
  t.slug as tour_slug,
  COUNT(tt.id) as translation_count,
  ARRAY_AGG(tt.locale ORDER BY tt.locale) as languages
FROM tours t
LEFT JOIN tour_translations tt ON t.id = tt.tour_id AND tt.locale IN ('de', 'fr', 'es', 'ar')
GROUP BY t.id, t.slug
ORDER BY t.slug;

-- Expected result: Each tour should have 4 translations (de, fr, es, ar)
```

## Testing the Translations

### 1. Test URLs
After deployment, test these localized URLs:

**Aquila Safari:**
- German: `/de/tours/aquila-big-5-day-safari`
- French: `/fr/tours/aquila-big-5-day-safari`
- Spanish: `/es/tours/aquila-big-5-day-safari`
- Arabic: `/ar/tours/aquila-big-5-day-safari`

**Inverdoorn Safari:**
- German: `/de/tours/inverdoorn-exclusive-day-safari`
- French: `/fr/tours/inverdoorn-exclusive-day-safari`
- Spanish: `/es/tours/inverdoorn-exclusive-day-safari`
- Arabic: `/ar/tours/inverdoorn-exclusive-day-safari`

**Boulders Beach:**
- German: `/de/tours/boulders-beach-penguin-colony`
- French: `/fr/tours/boulders-beach-penguin-colony`
- Spanish: `/es/tours/boulders-beach-penguin-colony`
- Arabic: `/ar/tours/boulders-beach-penguin-colony`

**Hermanus Whale Watching:**
- German: `/de/tours/hermanus-whale-watching-cruise`
- French: `/fr/tours/hermanus-whale-watching-cruise`
- Spanish: `/es/tours/hermanus-whale-watching-cruise`
- Arabic: `/ar/tours/hermanus-whale-watching-cruise`

### 2. What Should Work
✅ **Translated Content**: All tour details, descriptions, highlights, itineraries, FAQs
✅ **Localized URLs**: SEO-friendly URLs with locale prefix
✅ **Fallback Behavior**: English fallback if translation missing
✅ **UI Translation**: Forms, navigation, buttons, labels
✅ **Metadata**: Localized page titles and meta descriptions
✅ **Schema Markup**: Properly localized breadcrumbs

### 3. Expected Behavior
- **German URLs**: Content in German, proper German formatting
- **French URLs**: Content in French, proper French formatting  
- **Spanish URLs**: Content in Spanish, proper Spanish formatting
- **Arabic URLs**: Content in Arabic, RTL layout, proper Arabic formatting
- **English URLs**: Original English content (no `/en` prefix needed)

## Architecture Overview

### Translation System Components
1. **Database Schema**: `tour_translations` table with comprehensive content fields
2. **Frontend Integration**: `getTourBySlugAndLocale()` function merges translations
3. **Translation Service**: Handles fallback logic and caching
4. **Localized Routing**: `app/[locale]/tours/[slug]/page.tsx` for each language
5. **SEO Integration**: Localized metadata and schema markup

### Translation Quality Levels
- `published`: Production-ready translations (what we've provided)
- `draft`: Work-in-progress translations  
- `review`: Awaiting review translations

## Database Schema Reference

### tour_translations Table Structure
```sql
- tour_id: UUID (references tours.id)
- locale: VARCHAR(2) ('de', 'fr', 'es', 'ar')
- title: VARCHAR(255)
- description: TEXT
- short_description: TEXT
- highlights: TEXT[] (array)
- inclusions: TEXT[] (array)
- exclusions: TEXT[] (array)
- important_info: TEXT[] (array)
- what_to_bring: TEXT[] (array)
- itinerary: JSONB[] (array of JSON objects)
- faqs: JSONB[] (array of JSON objects)
- meta_title: VARCHAR(255)
- meta_description: TEXT
- meta_keywords: TEXT[] (array)
- translation_quality: ENUM ('draft', 'review', 'published')
- translator_notes: TEXT
```

### static_translations Table Structure
```sql
- key: VARCHAR(100) (translation key)
- locale: VARCHAR(2) ('en', 'de', 'fr', 'es', 'ar')
- value: TEXT (translated text)
- context: VARCHAR(50) (usage context)
- description: TEXT (for translators)
- is_approved: BOOLEAN
```

## Adding More Tours

### 1. For New Tours
When adding new tours, create translation entries following this pattern:
```sql
INSERT INTO tour_translations (
  tour_id, locale, title, description, short_description,
  highlights, inclusions, exclusions, important_info,
  what_to_bring, itinerary, faqs, meta_title, 
  meta_description, meta_keywords, translation_quality
) VALUES (
  (SELECT id FROM tours WHERE slug = 'new-tour-slug'),
  'de', -- language code
  'German Title',
  'German Description...',
  -- ... all other fields
  'published'
);
```

### 2. Translation Template
Use the existing comprehensive translations as templates. Each tour should have:
- Complete title and descriptions
- All arrays (highlights, inclusions, etc.) fully translated
- Itinerary with time/activity/description in JSON format
- FAQs with question/answer in JSON format
- SEO metadata (title, description, keywords)
- Professional translator notes

## Troubleshooting

### Common Issues
1. **No translations showing**: Check `translation_quality = 'published'`
2. **Fallback to English**: Verify tour_id matches correctly
3. **Missing UI elements**: Check static_translations deployment
4. **Arabic layout issues**: Ensure RTL styles are properly applied

### Debug Queries
```sql
-- Check if tour exists
SELECT * FROM tours WHERE slug = 'tour-slug-here';

-- Check translation status  
SELECT locale, translation_quality, created_at 
FROM tour_translations 
WHERE tour_id = (SELECT id FROM tours WHERE slug = 'tour-slug-here');

-- Check static translations
SELECT key, locale, value 
FROM static_translations 
WHERE locale = 'de' AND context = 'tour-detail'
ORDER BY key;
```

## Performance Considerations
- ✅ Translations are cached in TourRepository
- ✅ Database queries are optimized with proper indexes
- ✅ Fallback logic minimizes database calls
- ✅ Static translations are preloaded

## SEO Benefits
- ✅ Localized URLs for each language
- ✅ Proper hreflang tags (if implemented in layout)
- ✅ Language-specific metadata
- ✅ Culturally appropriate content
- ✅ Schema markup in local language

## Maintenance
- Monitor translation quality and user feedback
- Update translations based on seasonal changes
- Add new tours following established patterns
- Keep static translations updated with UI changes

---

**Status**: ✅ READY FOR PRODUCTION DEPLOYMENT

The internationalization system is now complete with comprehensive translations for all 4 tours in 4 languages, providing a full localized experience for German, French, Spanish, and Arabic-speaking users.