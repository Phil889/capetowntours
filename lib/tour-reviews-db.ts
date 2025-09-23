import { getSupabaseClient } from '@/lib/supabase-server';
import { cache } from 'react';
import { logError, logInfo } from '@/lib/error-logger';
import { Locale } from '@/lib/i18n/config';

// Updated Review interface to match database schema
export interface DatabaseReview {
  id: string;
  tour_slug: string;
  language: string;
  author: string;
  author_location: string;
  rating: number;
  review_date: string;
  title: string;
  content: string;
  verified: boolean;
  experience_type: string;
  helpful_count: number;
  created_at?: string;
  updated_at?: string;
}

// Legacy Review interface for backward compatibility
export interface Review {
  id: string;
  name: string;
  location: string;
  flag: string;
  date: string;
  rating: number;
  text: string;
  countryCode?: string; // Optional for backward compatibility
}

// Convert database review to legacy format for component compatibility
function convertToLegacyReview(dbReview: DatabaseReview): Review {
  // Map country codes to flag emojis
  const getFlag = (location: string): string => {
    const flagMap: Record<string, string> = {
      'uk': '🇬🇧', 'united kingdom': '🇬🇧', 'london': '🇬🇧', 'england': '🇬🇧', 'scotland': '🇬🇧', 'manchester': '🇬🇧', 'edinburgh': '🇬🇧',
      'usa': '🇺🇸', 'united states': '🇺🇸', 'america': '🇺🇸', 'california': '🇺🇸', 'new york': '🇺🇸', 'texas': '🇺🇸', 'chicago': '🇺🇸', 'miami': '🇺🇸', 'denver': '🇺🇸', 'phoenix': '🇺🇸', 'dallas': '🇺🇸', 'los angeles': '🇺🇸', 'san diego': '🇺🇸',
      'australia': '🇦🇺', 'sydney': '🇦🇺', 'melbourne': '🇦🇺', 'brisbane': '🇦🇺',
      'canada': '🇨🇦', 'toronto': '🇨🇦', 'vancouver': '🇨🇦',
      'germany': '🇩🇪', 'berlin': '🇩🇪', 'munich': '🇩🇪',
      'france': '🇫🇷', 'paris': '🇫🇷', 'bordeaux': '🇫🇷',
      'spain': '🇪🇸', 'madrid': '🇪🇸', 'barcelona': '🇪🇸',
      'italy': '🇮🇹', 'rome': '🇮🇹', 'milan': '🇮🇹',
      'netherlands': '🇳🇱', 'amsterdam': '🇳🇱',
      'portugal': '🇵🇹', 'lisbon': '🇵🇹',
      'brazil': '🇧🇷', 'rio de janeiro': '🇧🇷', 'sao paulo': '🇧🇷',
      'argentina': '🇦🇷', 'buenos aires': '🇦🇷',
      'mexico': '🇲🇽', 'mexico city': '🇲🇽',
      'south africa': '🇿🇦', 'cape town': '🇿🇦', 'johannesburg': '🇿🇦',
      'nigeria': '🇳🇬', 'lagos': '🇳🇬',
      'india': '🇮🇳', 'mumbai': '🇮🇳', 'delhi': '🇮🇳',
      'china': '🇨🇳', 'beijing': '🇨🇳', 'shanghai': '🇨🇳',
      'japan': '🇯🇵', 'tokyo': '🇯🇵', 'osaka': '🇯🇵',
      'hong kong': '🇭🇰',
      'singapore': '🇸🇬',
      'uae': '🇦🇪', 'emirates': '🇦🇪', 'dubai': '🇦🇪', 'abu dhabi': '🇦🇪',
      'saudi arabia': '🇸🇦', 'riyadh': '🇸🇦',
      'kuwait': '🇰🇼',
      'denmark': '🇩🇰', 'copenhagen': '🇩🇰',
      'sweden': '🇸🇪', 'stockholm': '🇸🇪',
      'norway': '🇳🇴', 'oslo': '🇳🇴',
      'peru': '🇵🇪', 'lima': '🇵🇪',
    };
    
    const locationLower = location.toLowerCase();
    for (const [key, flag] of Object.entries(flagMap)) {
      if (locationLower.includes(key)) {
        return flag;
      }
    }
    return '🌍'; // Default world flag
  };

  // Format date to relative format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'Today';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 14) return `${Math.floor(diffDays / 7)} week ago`;
    if (diffDays <= 28) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays <= 60) return '1 month ago';
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Get country code for countryCode property
  const getCountryCode = (location: string): string => {
    const locationLower = location.toLowerCase();
    if (locationLower.includes('uk') || locationLower.includes('united kingdom') || locationLower.includes('london') || locationLower.includes('england') || locationLower.includes('scotland') || locationLower.includes('manchester') || locationLower.includes('edinburgh')) return 'GB';
    if (locationLower.includes('usa') || locationLower.includes('united states') || locationLower.includes('america') || locationLower.includes('california') || locationLower.includes('new york') || locationLower.includes('texas') || locationLower.includes('chicago') || locationLower.includes('miami') || locationLower.includes('denver') || locationLower.includes('phoenix') || locationLower.includes('dallas') || locationLower.includes('los angeles') || locationLower.includes('san diego')) return 'US';
    if (locationLower.includes('australia') || locationLower.includes('sydney') || locationLower.includes('melbourne') || locationLower.includes('brisbane')) return 'AU';
    if (locationLower.includes('canada') || locationLower.includes('toronto') || locationLower.includes('vancouver')) return 'CA';
    if (locationLower.includes('germany') || locationLower.includes('berlin') || locationLower.includes('munich')) return 'DE';
    if (locationLower.includes('france') || locationLower.includes('paris') || locationLower.includes('bordeaux')) return 'FR';
    if (locationLower.includes('spain') || locationLower.includes('madrid') || locationLower.includes('barcelona')) return 'ES';
    if (locationLower.includes('italy') || locationLower.includes('rome') || locationLower.includes('milan')) return 'IT';
    return 'GB'; // Default
  };

  return {
    id: dbReview.id,
    name: dbReview.author,
    location: dbReview.author_location,
    flag: getFlag(dbReview.author_location),
    date: formatDate(dbReview.review_date),
    rating: dbReview.rating,
    text: dbReview.content,
    countryCode: getCountryCode(dbReview.author_location)
  };
}

// Cache the database queries at the request level
export const getTourReviews = cache(async (
  tourSlug: string,
  locale: Locale = 'en',
  limit: number = 3
): Promise<Review[]> => {
  const supabase = getSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('tour_reviews')
      .select('*')
      .eq('tour_slug', tourSlug)
      .eq('language', locale)
      .eq('verified', true)
      .order('helpful_count', { ascending: false })
      .order('review_date', { ascending: false })
      .limit(limit);

    if (error) {
      logError('Error fetching tour reviews from database', error, {
        component: 'TourReviewsDB',
        function: 'getTourReviews',
        tourSlug,
        locale,
        limit,
        action: 'fetch_reviews'
      });
      return [];
    }

    if (!data || data.length === 0) {
      logInfo('No reviews found for tour, falling back to default', {
        tourSlug,
        locale,
        action: 'no_reviews_found'
      });
      return [];
    }

    return data.map(convertToLegacyReview);
  } catch (error) {
    logError('Unexpected error fetching tour reviews', error, {
      component: 'TourReviewsDB',
      function: 'getTourReviews',
      tourSlug,
      locale,
      action: 'fetch_reviews_exception'
    });
    return [];
  }
});

// Get reviews with fallback to other languages if needed
export const getTourReviewsWithFallback = cache(async (
  tourSlug: string,
  locale: Locale = 'en',
  limit: number = 3
): Promise<Review[]> => {
  // Try to get reviews in requested language first
  let reviews = await getTourReviews(tourSlug, locale, limit);
  
  // If we don't have enough reviews in the requested language, try English
  if (reviews.length < limit && locale !== 'en') {
    const englishReviews = await getTourReviews(tourSlug, 'en', limit - reviews.length);
    reviews = [...reviews, ...englishReviews];
  }
  
  // If still not enough reviews, try other languages to fill up
  if (reviews.length < limit) {
    const supabase = getSupabaseClient();
    
    try {
      const { data, error } = await supabase
        .from('tour_reviews')
        .select('*')
        .eq('tour_slug', tourSlug)
        .eq('verified', true)
        .not('language', 'in', `(${locale},en)`)
        .order('helpful_count', { ascending: false })
        .order('review_date', { ascending: false })
        .limit(limit - reviews.length);

      if (!error && data) {
        const additionalReviews = data.map(convertToLegacyReview);
        reviews = [...reviews, ...additionalReviews];
      }
    } catch (error) {
      logError('Error fetching fallback reviews', error, {
        component: 'TourReviewsDB',
        function: 'getTourReviewsWithFallback',
        tourSlug,
        locale,
        action: 'fetch_fallback_reviews'
      });
    }
  }
  
  return reviews.slice(0, limit);
});

// Get all reviews for a tour (for show more functionality)
export const getAllTourReviews = cache(async (
  tourSlug: string,
  locale: Locale = 'en'
): Promise<Review[]> => {
  const supabase = getSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('tour_reviews')
      .select('*')
      .eq('tour_slug', tourSlug)
      .eq('language', locale)
      .eq('verified', true)
      .order('helpful_count', { ascending: false })
      .order('review_date', { ascending: false });

    if (error) {
      logError('Error fetching all tour reviews from database', error, {
        component: 'TourReviewsDB',
        function: 'getAllTourReviews',
        tourSlug,
        locale,
        action: 'fetch_all_reviews'
      });
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(convertToLegacyReview);
  } catch (error) {
    logError('Unexpected error fetching all tour reviews', error, {
      component: 'TourReviewsDB',
      function: 'getAllTourReviews',
      tourSlug,
      locale,
      action: 'fetch_all_reviews_exception'
    });
    return [];
  }
});

// Get review statistics for a tour
export const getTourReviewStats = cache(async (
  tourSlug: string,
  locale: Locale = 'en'
): Promise<{
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
}> => {
  const supabase = getSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('tour_reviews')
      .select('rating')
      .eq('tour_slug', tourSlug)
      .eq('language', locale)
      .eq('verified', true);

    if (error || !data) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: {}
      };
    }

    const totalReviews = data.length;
    const averageRating = totalReviews > 0 ? 
      data.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;
    
    const ratingDistribution = data.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      ratingDistribution
    };
  } catch (error) {
    logError('Error fetching tour review stats', error, {
      component: 'TourReviewsDB',
      function: 'getTourReviewStats',
      tourSlug,
      locale,
      action: 'fetch_review_stats'
    });
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: {}
    };
  }
});

// Legacy function for backward compatibility
export function getReviewsForTour(tourSlug: string): Review[] {
  // This is now a synchronous wrapper that should be replaced
  // with async getTourReviews in components
  logInfo('Legacy getReviewsForTour called - should be replaced with async getTourReviews', {
    tourSlug,
    action: 'legacy_function_call'
  });
  return [];
}