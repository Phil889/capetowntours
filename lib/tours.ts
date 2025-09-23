import { createClient } from "@supabase/supabase-js";
import { Tour, TourApiResponse } from "@/types/tour";
import { tours as placeholderTours } from "@/lib/placeholder-data";
import { Locale } from "@/lib/i18n/config";
import { TranslationService } from "@/lib/i18n/translation-service";

// Initialize Supabase client (server-side only)
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials not found");
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Transform API response to standardized Tour format
function transformTourData(tour: TourApiResponse): Tour {
  // Handle price variations
  let price = 0;
  if (typeof tour.price === 'number') {
    price = tour.price;
  } else if (typeof tour.price === 'string') {
    // Extract number from string like "R1000" or "1000 ZAR"
    const numericPrice = parseFloat(tour.price.replace(/[^\d.-]/g, ''));
    price = isNaN(numericPrice) ? 0 : numericPrice;
  } else if (tour.price_per_person_cents) {
    price = tour.price_per_person_cents / 100;
  }

  return {
    id: tour.id,
    slug: tour.slug,
    title: tour.title || tour.name || 'Untitled Tour',
    description: tour.description,
    price,
    currency: tour.currency || 'ZAR',
    category: tour.category,
    duration_days: tour.duration_days,
    image_url: tour.image_url || tour.main_image_url,
    image_alt: `${tour.title || tour.name || 'Tour'} in Cape Town`,
    highlights: tour.highlights,
    max_group_size: tour.max_group_size,
    created_at: tour.created_at,
    updated_at: tour.updated_at,
  };
}

// Transform placeholder data to Tour format
function transformPlaceholderData(): Tour[] {
  return placeholderTours.map(tour => ({
    id: tour.id,
    slug: tour.slug,
    title: tour.name,
    description: tour.description,
    price: tour.price_per_person_cents / 100,
    currency: 'ZAR',
    category: tour.category,
    duration_days: tour.duration_days,
    image_url: tour.main_image_url,
    image_alt: tour.main_image_alt || `${tour.name} in Cape Town`,
    highlights: undefined,
    max_group_size: undefined,
    created_at: undefined,
    updated_at: undefined,
  }));
}

// Format price for display
export function formatPrice(price: number, currency: string = 'ZAR'): string {
  const formatter = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(price);
}

// Fetch tours with error handling and fallback
export async function getTours(): Promise<Tour[]> {
  try {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      logInfo('Using placeholder data: Supabase not configured', {
        component: 'ToursLib',
        function: 'getTours',
        action: 'fallback_to_placeholder'
      });
      return transformPlaceholderData();
    }

    const { data, error } = await supabase
      .from("tours")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error, using placeholder data:", error.message);
      return transformPlaceholderData();
    }

    if (!data || data.length === 0) {
      console.log("No tours found, using placeholder data");
      return transformPlaceholderData();
    }

    return data.map(transformTourData);
  } catch (error) {
    console.error("Error fetching tours, using placeholder data:", error);
    return transformPlaceholderData();
  }
}

// Fetch tours with locale support and translations
export async function getToursWithLocale(locale: Locale = 'en'): Promise<Tour[]> {
  try {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      logInfo('Using placeholder data for locale tours: Supabase not configured', {
        component: 'ToursLib',
        function: 'getToursWithLocale',
        locale,
        action: 'fallback_to_placeholder'
      });
      return transformPlaceholderData();
    }

    const { data, error } = await supabase
      .from("tours")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error, using placeholder data:", error.message);
      return transformPlaceholderData();
    }

    if (!data || data.length === 0) {
      console.log("No tours found, using placeholder data");
      return transformPlaceholderData();
    }

    // If requesting English, return base tours
    if (locale === 'en') {
      return data.map(transformTourData);
    }

    // For other locales, try to get translations
    const translationService = TranslationService.getInstance();
    const translatedTours: Tour[] = [];

    for (const tour of data) {
      try {
        const translation = await translationService.getTourTranslation(tour.id, locale);
        
        if (translation) {
          // Merge base tour with translation
          const baseTourData = transformTourData(tour);
          const translatedTour = {
            ...baseTourData,
            title: translation.title,
            description: translation.description,
            highlights: translation.highlights || baseTourData.highlights,
          };
          translatedTours.push(translatedTour);
        } else {
          // Fallback to English
          translatedTours.push(transformTourData(tour));
        }
      } catch (translationError) {
        console.error(`Error getting translation for tour ${tour.id}:`, translationError);
        // Fallback to English
        translatedTours.push(transformTourData(tour));
      }
    }

    return translatedTours;
  } catch (error) {
    console.error("Error fetching tours with locale, using placeholder data:", error);
    return transformPlaceholderData();
  }
}

// Get a single tour by slug
export async function getTourBySlug(slug: string): Promise<Tour | null> {
  try {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      const placeholderTour = placeholderTours.find(t => t.slug === slug);
      return placeholderTour ? transformPlaceholderData().find(t => t.slug === slug) || null : null;
    }

    const { data, error } = await supabase
      .from("tours")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("Error fetching tour:", error.message);
      return null;
    }

    return data ? transformTourData(data) : null;
  } catch (error) {
    console.error("Error fetching tour:", error);
    return null;
  }
}
