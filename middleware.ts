import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, isValidLocale, type Locale } from './lib/i18n/config';

// Cache for faster middleware performance
const skipPaths = new Set([
  '/api/',
  '/_next/',
  '/images/',
  '/favicon',
  '/robots.txt',
  '/sitemap.xml'
]);

function shouldSkipMiddleware(pathname: string): boolean {
  // Fast path checks
  if (pathname.includes('.')) return true;
  
  // Use cached set for O(1) lookups
  for (const skipPath of skipPaths) {
    if (pathname.startsWith(skipPath)) return true;
  }
  
  return false;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for API routes, static files, and special Next.js paths
  if (shouldSkipMiddleware(pathname)) {
    return NextResponse.next();
  }

  // Optimized locale detection with early return
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  const pathnameHasLocale = firstSegment && isValidLocale(firstSegment);

  if (pathnameHasLocale) {
    // Use already parsed first segment for better performance
    const locale = firstSegment as Locale;
    const response = NextResponse.next();
    response.cookies.set('locale', locale, {
      path: '/',
      maxAge: 31536000, // 1 year
      sameSite: 'lax'
    });
    return response;
  }

  // Detect locale from various sources
  const detectedLocale = detectLocale(request);
  
  // For the default locale, rewrite the URL to include the locale prefix
  if (detectedLocale === defaultLocale) {
    const newUrl = new URL(`/${defaultLocale}${pathname}${request.nextUrl.search}`, request.url);
    const response = NextResponse.rewrite(newUrl);
    response.cookies.set('locale', defaultLocale, {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax'
    });
    return response;
  }

  // Redirect to the localized URL for non-default locales
  const redirectUrl = new URL(`/${detectedLocale}${pathname}${request.nextUrl.search}`, request.url);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set('locale', detectedLocale, {
    path: '/',
    maxAge: 31536000,
    sameSite: 'lax'
  });
  
  return response;
}

function detectLocale(request: NextRequest): Locale {
  // 1. Check URL parameter (for manual switching via ?locale=de)
  const urlLocale = request.nextUrl.searchParams.get('locale');
  if (urlLocale && isValidLocale(urlLocale)) {
    return urlLocale;
  }

  // 2. Check cookie (user's previous preference)
  const cookieLocale = request.cookies.get('locale')?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale;
  }

  // 3. Check Accept-Language header (browser preference)
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocales = acceptLanguage
      .split(',')
      .map(lang => {
        const [locale, quality] = lang.split(';');
        return {
          locale: locale.trim().toLowerCase(),
          quality: quality ? parseFloat(quality.split('=')[1]) : 1.0
        };
      })
      .sort((a, b) => b.quality - a.quality);
    
    for (const { locale: preferred } of preferredLocales) {
      // Check exact match (e.g., 'de')
      if (isValidLocale(preferred)) {
        return preferred;
      }
      
      // Check language part (e.g., 'de-DE' -> 'de')
      const langPart = preferred.split('-')[0];
      if (isValidLocale(langPart)) {
        return langPart;
      }
    }
  }

  // 4. Check geographic location via Cloudflare headers (if available)
  const country = request.headers.get('cf-ipcountry')?.toLowerCase();
  if (country) {
    const countryToLocale: Record<string, Locale> = {
      'de': 'de',
      'at': 'de', // Austria -> German
      'ch': 'de', // Switzerland -> German (could also be French)
      'fr': 'fr',
      'be': 'fr', // Belgium -> French (could also be Dutch)
      'es': 'es',
      'mx': 'es', // Mexico -> Spanish
      'ar': 'es', // Argentina -> Spanish
      'sa': 'ar', // Saudi Arabia -> Arabic
      'ae': 'ar', // UAE -> Arabic
      'eg': 'ar', // Egypt -> Arabic
      'ma': 'ar', // Morocco -> Arabic
    };
    
    const localeFromCountry = countryToLocale[country];
    if (localeFromCountry) {
      return localeFromCountry;
    }
  }

  // 5. Default fallback
  return defaultLocale;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt
     * - sitemap.xml
     * - images (public images)
     * - Any file with an extension
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images|.*\\..*).*)',
  ],
};
