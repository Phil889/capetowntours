import { Metadata } from 'next';
import { locales, defaultLocale, localeConfig, type Locale } from './config';
import { TranslationService } from './translation-service';

interface LocalizedMetadataOptions {
  locale: Locale;
  pathname: string;
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
}

export async function generateLocalizedMetadata({
  locale,
  pathname,
  title,
  description,
  keywords = [],
  ogImage,
  noIndex = false,
  canonicalUrl
}: LocalizedMetadataOptions): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://capetownsafaritours.com';
  const translationService = TranslationService.getInstance();
  
  // Get default translations if not provided
  const defaultTitle = title || await translationService.getStaticTranslation('meta.default.title', locale) || 'Cape Town Safari Tours';
  const defaultDescription = description || await translationService.getStaticTranslation('meta.default.description', locale) || 'Experience Cape Town\'s best private safari tours and wildlife adventures.';
  
  // Clean pathname (remove locale if present)
  const cleanPathname = pathname.startsWith(`/${locale}`) 
    ? pathname.replace(`/${locale}`, '') || '/'
    : pathname;
  
  // Generate alternate URLs for all locales
  const alternateUrls: Record<string, string> = {};
  locales.forEach(loc => {
    const url = loc === defaultLocale 
      ? `${baseUrl}${cleanPathname}`
      : `${baseUrl}/${loc}${cleanPathname}`;
    alternateUrls[loc] = url;
  });
  
  // Current page URL
  const currentUrl = locale === defaultLocale 
    ? `${baseUrl}${cleanPathname}`
    : `${baseUrl}/${locale}${cleanPathname}`;
  
  // Canonical URL (defaults to current URL)
  const canonical = canonicalUrl || currentUrl;
  
  // Default OG image
  const defaultOgImage = ogImage || `${baseUrl}/Best_Cape_Town_Safari_Tours_Logo.webp`;
  
  return {
    title: defaultTitle,
    description: defaultDescription,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    
    // Canonical and alternates
    alternates: {
      canonical,
      languages: alternateUrls
    },
    
    // Open Graph
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      url: currentUrl,
      siteName: await translationService.getStaticTranslation('site.name', locale) || 'Cape Town Safari Tours',
      locale: getOpenGraphLocale(locale),
      alternateLocale: locales.filter(l => l !== locale).map(getOpenGraphLocale),
      type: 'website',
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: defaultTitle,
        }
      ],
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDescription,
      images: [defaultOgImage],
      creator: '@capetownsafari',
    },
    
    // Robots
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Other meta tags
    other: {
      'og:locale': getOpenGraphLocale(locale),
      'og:locale:alternate': locales.filter(l => l !== locale).map(getOpenGraphLocale).join(','),
    }
  };
}

// Convert our locale codes to OpenGraph locale format
function getOpenGraphLocale(locale: Locale): string {
  const localeMap: Record<Locale, string> = {
    en: 'en_US',
    de: 'de_DE',
    fr: 'fr_FR',
    es: 'es_ES',
    ar: 'ar_SA'
  };
  
  return localeMap[locale] || 'en_US';
}

// Generate metadata for tour pages
export async function generateTourMetadata(
  tourId: string,
  locale: Locale,
  pathname: string
): Promise<Metadata> {
  const translationService = TranslationService.getInstance();
  
  try {
    const tourTranslation = await translationService.getTourTranslation(tourId, locale);
    
    if (!tourTranslation) {
      // Fallback to default metadata
      return generateLocalizedMetadata({ locale, pathname });
    }
    
    const title = tourTranslation.metaTitle || tourTranslation.title;
    const description = tourTranslation.metaDescription || tourTranslation.shortDescription || tourTranslation.description;
    const keywords = tourTranslation.metaKeywords || [];
    
    return generateLocalizedMetadata({
      locale,
      pathname,
      title,
      description,
      keywords
    });
  } catch (error) {
    console.error('Error generating tour metadata:', error);
    return generateLocalizedMetadata({ locale, pathname });
  }
}

// Generate metadata for blog posts
export async function generateBlogMetadata(
  postSlug: string,
  locale: Locale,
  pathname: string
): Promise<Metadata> {
  // This would fetch blog post data from Supabase
  // For now, return default metadata
  return generateLocalizedMetadata({ locale, pathname });
}

// Generate structured data for different content types
export function generateStructuredData(type: 'website' | 'article' | 'tour', data: any, locale: Locale) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://capetownsafaritours.com';
  
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'website' ? 'WebSite' : type === 'article' ? 'Article' : 'TouristTrip',
    url: data.url || baseUrl,
    name: data.name || data.title,
    description: data.description,
    inLanguage: locale,
  };
  
  if (type === 'website') {
    return {
      ...baseStructuredData,
      '@type': 'WebSite',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
  }
  
  if (type === 'article') {
    return {
      ...baseStructuredData,
      '@type': 'Article',
      headline: data.title,
      author: {
        '@type': 'Person',
        name: data.author || 'Cape Town Safari Tours'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Cape Town Safari Tours',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/Best_Cape_Town_Safari_Tours_Logo.webp`
        }
      },
      datePublished: data.publishedAt,
      dateModified: data.updatedAt || data.publishedAt,
      image: data.featuredImage || `${baseUrl}/Best_Cape_Town_Safari_Tours_Logo.webp`
    };
  }
  
  if (type === 'tour') {
    return {
      ...baseStructuredData,
      '@type': 'TouristTrip',
      touristType: 'Safari Enthusiast',
      offers: {
        '@type': 'Offer',
        price: data.price,
        priceCurrency: localeConfig[locale].currency,
        availability: 'https://schema.org/InStock'
      },
      provider: {
        '@type': 'Organization',
        name: 'Cape Town Safari Tours',
        url: baseUrl
      }
    };
  }
  
  return baseStructuredData;
}

// Helper to get page-specific translations
export async function getPageTranslations(page: string, locale: Locale): Promise<Record<string, string>> {
  const translationService = TranslationService.getInstance();
  return translationService.getStaticTranslations(locale, page);
}