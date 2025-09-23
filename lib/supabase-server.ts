import { createClient } from "@supabase/supabase-js";
import { cache } from "react";
import { TourDatabase } from "@/types/tour-detail";
import { Locale } from "@/lib/i18n/config";
import { TranslationService } from "@/lib/i18n/translation-service";
import { logError, logInfo } from '@/lib/error-logger';

// Singleton Supabase client for server-side operations
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    });
  }

  return supabaseInstance;
}

// Cache the database queries at the request level
export const getTourBySlug = cache(async (slug: string): Promise<TourDatabase | null> => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    logError('Error fetching tour by slug from database', error, {
      component: 'SupabaseServer',
      function: 'getTourBySlug',
      slug,
      action: 'fetch_tour'
    });
    return null;
  }

  return data as unknown as TourDatabase;
});

// Get tour with locale support and translations
export const getTourBySlugAndLocale = cache(async (slug: string, locale: Locale): Promise<TourDatabase | null> => {
  const supabase = getSupabaseClient();
  
  // First get the base tour
  const { data: baseTour, error: tourError } = await supabase
    .from("tours")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (tourError) {
    logError('Error fetching base tour for locale translation', tourError, {
      component: 'SupabaseServer',
      function: 'getTourBySlugAndLocale',
      slug,
      locale,
      action: 'fetch_base_tour'
    });
    return null;
  }

  if (!baseTour) {
    return null;
  }

  // If requesting English or no translation needed, return base tour
  if (locale === 'en') {
    return baseTour as unknown as TourDatabase;
  }

  // Try to get translation
  try {
    const translationService = TranslationService.getInstance();
    const translation = await translationService.getTourTranslation(baseTour.id as string, locale);
    
    if (translation) {
      // Merge base tour with translation - map all translated fields properly
      const translatedTour = {
        ...baseTour,
        // Basic info
        title: translation.title,
        name: translation.title, // Some components use 'name'
        description: translation.description,
        short_overview: translation.shortDescription,
        
        // Content arrays - convert back to pipe-delimited strings for compatibility
        highlights: translation.highlights?.join('|') || baseTour.highlights,
        included: translation.inclusions?.join('|') || baseTour.included,
        excluded: translation.exclusions?.join('|') || baseTour.excluded,
        important_info: translation.importantInfo?.join('|') || baseTour.important_info,
        
        // Structured content - keep as JSON strings
        itinerary: translation.itinerary ? JSON.stringify(translation.itinerary) : baseTour.itinerary,
        faqs: translation.faqs ? JSON.stringify(translation.faqs) : baseTour.faqs,
        
        // SEO fields
        title_tag: translation.metaTitle || translation.title,
        meta_description: translation.metaDescription || translation.description,
        
        // Keep original non-translatable fields
        slug: baseTour.slug,
        id: baseTour.id,
        price: baseTour.price,
        price_per_person_cents: baseTour.price_per_person_cents,
        category: baseTour.category,
        duration_days: baseTour.duration_days,
        image_url: baseTour.image_url,
        main_image_url: baseTour.main_image_url,
        map_embed: baseTour.map_embed,
        created_at: baseTour.created_at,
        updated_at: baseTour.updated_at,
        duration: baseTour.duration,
        departure_time: baseTour.departure_time,
        pickup: baseTour.pickup,
        group_size_max: baseTour.group_size_max,
        accessibility: baseTour.accessibility,
        cancellation_policy: baseTour.cancellation_policy,
        seasonal_notes: baseTour.seasonal_notes,
        child_policy: baseTour.child_policy,
      };
      
      return translatedTour as unknown as TourDatabase;
    }
  } catch (error) {
    logError('Error fetching tour translation from service', error, {
      component: 'SupabaseServer',
      function: 'getTourBySlugAndLocale',
      slug,
      locale,
      tourId: baseTour.id,
      action: 'fetch_translation'
    });
  }

  // Fallback to base tour if translation not available
  return baseTour as unknown as TourDatabase;
});
