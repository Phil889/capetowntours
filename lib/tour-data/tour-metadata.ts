import { Metadata } from 'next';
import { Tour } from '@/types/tour-detail';
import { TOUR_SEO_CONFIG, DEFAULT_TOUR_IMAGES } from './tour-constants';
import { Locale, localeConfig } from '@/lib/i18n/config';

export class TourMetadataGenerator {
  /**
   * Generate metadata for a tour page
   */
  static generate(tour: Tour | null, slug: string): Metadata {
    if (!tour) {
      return this.generateNotFoundMetadata();
    }

    const imageUrl = tour.imageUrl || DEFAULT_TOUR_IMAGES.logo;
    const canonicalUrl = `${TOUR_SEO_CONFIG.siteUrl}/tours/${slug}`;

    return {
      title: `${tour.title} | ${TOUR_SEO_CONFIG.siteName}`,
      description: tour.description,
      keywords: this.generateKeywords(tour),
      openGraph: {
        title: tour.title,
        description: tour.description,
        images: [
          {
            url: imageUrl,
            width: DEFAULT_TOUR_IMAGES.mainImageSize.width,
            height: DEFAULT_TOUR_IMAGES.mainImageSize.height,
            alt: tour.title,
          }
        ],
        type: "website",
        siteName: TOUR_SEO_CONFIG.siteName,
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title: tour.title,
        description: tour.description,
        images: [imageUrl],
        creator: TOUR_SEO_CONFIG.twitterHandle,
      },
      alternates: {
        canonical: canonicalUrl,
      },
      robots: TOUR_SEO_CONFIG.robots,
    };
  }

  /**
   * Generate localized metadata for a tour page
   */
  static generateLocalized(tour: Tour | null, slug: string, locale: Locale): Metadata {
    if (!tour) {
      return this.generateNotFoundMetadata();
    }

    const imageUrl = tour.imageUrl || DEFAULT_TOUR_IMAGES.logo;
    const localePath = locale === 'en' ? '' : `/${locale}`;
    const canonicalUrl = `${TOUR_SEO_CONFIG.siteUrl}${localePath}/tours/${slug}`;
    
    // Get locale-specific configuration
    const localeInfo = localeConfig[locale];
    const ogLocale = this.getOpenGraphLocale(locale);

    // Generate alternate language links
    const alternateLanguages: Record<string, string> = {};
    Object.keys(localeConfig).forEach(loc => {
      const localeKey = loc as Locale;
      const path = localeKey === 'en' ? '' : `/${localeKey}`;
      alternateLanguages[localeKey] = `${TOUR_SEO_CONFIG.siteUrl}${path}/tours/${slug}`;
    });

    return {
      title: `${tour.title} | ${TOUR_SEO_CONFIG.siteName}`,
      description: tour.description,
      keywords: this.generateKeywords(tour),
      openGraph: {
        title: tour.title,
        description: tour.description,
        images: [
          {
            url: imageUrl,
            width: DEFAULT_TOUR_IMAGES.mainImageSize.width,
            height: DEFAULT_TOUR_IMAGES.mainImageSize.height,
            alt: tour.title,
          }
        ],
        type: "website",
        siteName: TOUR_SEO_CONFIG.siteName,
        locale: ogLocale,
      },
      twitter: {
        card: "summary_large_image",
        title: tour.title,
        description: tour.description,
        images: [imageUrl],
        creator: TOUR_SEO_CONFIG.twitterHandle,
      },
      alternates: {
        canonical: canonicalUrl,
        languages: alternateLanguages,
      },
      robots: TOUR_SEO_CONFIG.robots,
    };
  }

  /**
   * Convert locale to OpenGraph locale format
   */
  private static getOpenGraphLocale(locale: Locale): string {
    const localeMap: Record<Locale, string> = {
      'en': 'en_US',
      'de': 'de_DE',
      'fr': 'fr_FR',
      'es': 'es_ES',
      'ar': 'ar_SA',
    };
    return localeMap[locale] || 'en_US';
  }

  /**
   * Generate keywords for SEO
   */
  private static generateKeywords(tour: Tour): string {
    const tourKeywords = tour.title
      .split(' ')
      .filter(word => word.length > 3)
      .map(word => word.toLowerCase());
    
    // Add category-based keywords if available
    const categoryKeywords: string[] = [];
    if (tour.category) {
      categoryKeywords.push(tour.category.toLowerCase());
    }
    
    // Add highlight-based keywords if available
    const highlightKeywords: string[] = [];
    if (tour.highlights && tour.highlights.length > 0) {
      tour.highlights.forEach(highlight => {
        const words = highlight.split(' ')
          .filter(word => word.length > 4)
          .map(word => word.toLowerCase());
        highlightKeywords.push(...words);
      });
    }
    
    // Combine all keywords and remove duplicates
    const allKeywords = [
      ...new Set([
        ...tourKeywords,
        ...categoryKeywords,
        ...highlightKeywords,
        ...TOUR_SEO_CONFIG.defaultKeywords
      ])
    ];
    
    return allKeywords.slice(0, 20).join(', '); // Limit to 20 keywords
  }

  /**
   * Generate metadata for not found page
   */
  private static generateNotFoundMetadata(): Metadata {
    return {
      title: `Tour Not Found | ${TOUR_SEO_CONFIG.siteName}`,
      description: "The requested tour could not be found. Browse our collection of amazing Cape Town tours and safari experiences.",
      openGraph: {
        title: "Tour Not Found",
        description: "Browse our collection of amazing Cape Town tours and safari experiences.",
        images: [
          {
            url: DEFAULT_TOUR_IMAGES.logo,
            width: DEFAULT_TOUR_IMAGES.mainImageSize.width,
            height: DEFAULT_TOUR_IMAGES.mainImageSize.height,
            alt: TOUR_SEO_CONFIG.siteName,
          }
        ],
        type: "website",
        siteName: TOUR_SEO_CONFIG.siteName,
        locale: "en_US",
      },
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  /**
   * Generate structured data for tour pages
   */
  static generateStructuredData(tour: Tour): object {
    const baseUrl = TOUR_SEO_CONFIG.siteUrl;
    
    return {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      "name": tour.title,
      "description": tour.description,
      "url": `${baseUrl}/tours/${tour.slug}`,
      "image": tour.imageUrl || DEFAULT_TOUR_IMAGES.logo,
      "provider": {
        "@type": "Organization",
        "name": TOUR_SEO_CONFIG.siteName,
        "url": baseUrl,
      },
      "offers": {
        "@type": "Offer",
        "price": tour.price,
        "priceCurrency": "ZAR",
        "availability": "https://schema.org/InStock",
        "validFrom": "2024-01-01T00:00:00Z", // Fixed date to avoid hydration mismatch
      },
      "duration": tour.duration,
      "itinerary": tour.itinerary?.map((stop, index) => ({
        "@type": "TouristTripItinerary",
        "position": index + 1,
        "description": stop,
      })),
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "2847",
        "bestRating": "5",
        "worstRating": "1",
      },
    };
  }
}
