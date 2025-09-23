# Cape Town Safari Tours - I18n Implementation Guide

## Architecture Overview

```mermaid
graph TB
    subgraph "User Request Flow"
        A[User Request] --> B[Middleware]
        B --> C{Locale Detected?}
        C -->|No| D[Detect from Headers/Cookie]
        C -->|Yes| E[Route to Locale]
        D --> E
        E --> F[App Router]
    end

    subgraph "App Router Structure"
        F --> G[app/[locale]/layout.tsx]
        G --> H[Localized Pages]
        H --> I[Components]
    end

    subgraph "Data Layer"
        I --> J[Translation Manager]
        J --> K[Cache Layer]
        K --> L{Cache Hit?}
        L -->|Yes| M[Return Cached]
        L -->|No| N[Database Query]
        N --> O[Supabase]
        O --> P[Cache & Return]
    end

    subgraph "SEO Layer"
        H --> Q[Metadata Generation]
        Q --> R[Hreflang Tags]
        Q --> S[Localized Sitemap]
        Q --> T[Structured Data]
    end
```

## Implementation Steps

### Step 1: Project Setup

#### 1.1 Install Dependencies
```bash
npm install next-intl
npm install @types/node --save-dev
```

#### 1.2 Update Next.js Configuration
```typescript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing config
  
  // Add experimental features for i18n
  experimental: {
    optimizePackageImports: ['next-intl']
  },
  
  // Webpack optimization for translations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups.translations = {
        name: 'translations',
        test: /[\\/]messages[\\/]/,
        chunks: 'all',
        priority: 10
      };
    }
    return config;
  }
}

export default nextConfig;
```

### Step 2: Core Configuration Files

#### 2.1 Create Locale Configuration
```typescript
// lib/i18n/config.ts
export const locales = ['en', 'de', 'fr', 'es', 'ar'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'en';

export const localeConfig = {
  en: { 
    name: 'English', 
    flag: '🇺🇸', 
    dir: 'ltr',
    currency: 'USD',
    region: 'US'
  },
  de: { 
    name: 'Deutsch', 
    flag: '🇩🇪', 
    dir: 'ltr',
    currency: 'EUR',
    region: 'DE'
  },
  fr: { 
    name: 'Français', 
    flag: '🇫🇷', 
    dir: 'ltr',
    currency: 'EUR',
    region: 'FR'
  },
  es: { 
    name: 'Español', 
    flag: '🇪🇸', 
    dir: 'ltr',
    currency: 'EUR',
    region: 'ES'
  },
  ar: { 
    name: 'العربية', 
    flag: '🇸🇦', 
    dir: 'rtl',
    currency: 'SAR',
    region: 'SA'
  }
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
```

#### 2.2 Create Middleware
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, isValidLocale } from './lib/i18n/config';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for API routes, static files, etc.
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Detect locale from various sources
  const detectedLocale = detectLocale(request);
  
  // For default locale, don't redirect (keep clean URLs)
  if (detectedLocale === defaultLocale) {
    return NextResponse.next();
  }

  // Redirect to localized URL for non-default locales
  const redirectUrl = new URL(`/${detectedLocale}${pathname}`, request.url);
  return NextResponse.redirect(redirectUrl);
}

function detectLocale(request: NextRequest): string {
  // 1. Check URL parameter (for manual switching)
  const urlLocale = request.nextUrl.searchParams.get('locale');
  if (urlLocale && isValidLocale(urlLocale)) {
    return urlLocale;
  }

  // 2. Check cookie
  const cookieLocale = request.cookies.get('locale')?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale;
  }

  // 3. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocales = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().toLowerCase());
    
    for (const preferred of preferredLocales) {
      // Check exact match
      if (isValidLocale(preferred)) {
        return preferred;
      }
      
      // Check language part (e.g., 'en-US' -> 'en')
      const langPart = preferred.split('-')[0];
      if (isValidLocale(langPart)) {
        return langPart;
      }
    }
  }

  return defaultLocale;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
```

### Step 3: Directory Structure Setup

#### 3.1 Create App Router Structure
```bash
mkdir -p app/[locale]
mkdir -p app/[locale]/about
mkdir -p app/[locale]/contact
mkdir -p app/[locale]/tours/[slug]
mkdir -p app/[locale]/faq
mkdir -p messages
mkdir -p lib/i18n
```

#### 3.2 Move Existing Pages
```bash
# Move existing pages to locale-specific directories
mv app/page.tsx app/[locale]/page.tsx
mv app/about/page.tsx app/[locale]/about/page.tsx
mv app/contact/page.tsx app/[locale]/contact/page.tsx
mv app/tours/[slug]/page.tsx app/[locale]/tours/[slug]/page.tsx
# ... continue for all pages
```

### Step 4: Translation Files Structure

#### 4.1 Create Message Files
```json
// messages/en.json
{
  "navigation": {
    "tours": "Tours",
    "customTours": "Custom Tours",
    "about": "About",
    "contact": "Contact",
    "bookNow": "Book Now"
  },
  "homepage": {
    "hero": {
      "title": "Cape Town Safari Tours: #1 Private Wildlife & Luxury Safari Experiences",
      "subtitle": "Unforgettable adventures, handpicked by local experts. Experience the best safaris, wine tours, and cultural journeys in South Africa—guaranteed.",
      "cta": "Explore Top Rated Tours & Safaris"
    },
    "signatureSafaris": {
      "title": "Our Signature Safaris",
      "subtitle": "Start your adventure with one of our most popular, hand-crafted tours. Each one is a private experience, designed to create memories that last a lifetime."
    }
  },
  "meta": {
    "homepage": {
      "title": "Cape Town Safari Tours | #1 Private Wildlife & Wine Tours 2025",
      "description": "Experience Cape Town's best private safari tours, wine tastings & Big 5 wildlife adventures. 4.9★ rated with 2,847+ happy guests. Book your luxury tour today!"
    }
  }
}
```

```json
// messages/de.json
{
  "navigation": {
    "tours": "Touren",
    "customTours": "Individuelle Touren",
    "about": "Über uns",
    "contact": "Kontakt",
    "bookNow": "Jetzt buchen"
  },
  "homepage": {
    "hero": {
      "title": "Kapstadt Safari Touren: #1 Private Wildlife & Luxus Safari Erlebnisse",
      "subtitle": "Unvergessliche Abenteuer, handverlesen von lokalen Experten. Erleben Sie die besten Safaris, Weintouren und kulturellen Reisen in Südafrika—garantiert.",
      "cta": "Top bewertete Touren & Safaris entdecken"
    },
    "signatureSafaris": {
      "title": "Unsere Signature Safaris",
      "subtitle": "Beginnen Sie Ihr Abenteuer mit einer unserer beliebtesten, handgefertigten Touren. Jede ist ein privates Erlebnis, das darauf ausgelegt ist, Erinnerungen fürs Leben zu schaffen."
    }
  },
  "meta": {
    "homepage": {
      "title": "Kapstadt Safari Touren | #1 Private Wildlife & Wein Touren 2025",
      "description": "Erleben Sie Kapstadts beste private Safari-Touren, Weinverkostungen und Big 5 Wildlife-Abenteuer. 4,9★ bewertet mit 2.847+ zufriedenen Gästen. Buchen Sie heute Ihre Luxustour!"
    }
  }
}
```

### Step 5: Database Schema Implementation

#### 5.1 Create Migration Script
```sql
-- migrations/add_i18n_support.sql

-- Add locale support to tours table
ALTER TABLE tours ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT 'en';
ALTER TABLE tours ADD COLUMN IF NOT EXISTS translated_from UUID REFERENCES tours(id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tours_locale ON tours(locale);
CREATE INDEX IF NOT EXISTS idx_tours_slug_locale ON tours(slug, locale);

-- Tour translations table
CREATE TABLE IF NOT EXISTS tour_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  locale VARCHAR(5) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  highlights TEXT[],
  inclusions TEXT[],
  important_info TEXT[],
  itinerary JSONB,
  faqs JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tour_id, locale)
);

-- Static content translations
CREATE TABLE IF NOT EXISTS static_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) NOT NULL,
  locale VARCHAR(5) NOT NULL,
  value TEXT NOT NULL,
  context VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(key, locale)
);

-- Create indexes for translations
CREATE INDEX IF NOT EXISTS idx_tour_translations_tour_locale ON tour_translations(tour_id, locale);
CREATE INDEX IF NOT EXISTS idx_static_translations_key_locale ON static_translations(key, locale);
```

### Step 6: Core Components Implementation

#### 6.1 Translation Hook
```typescript
// lib/i18n/hooks.ts
import { useParams } from 'next/navigation';
import { Locale, defaultLocale, isValidLocale } from './config';

export function useLocale(): Locale {
  const params = useParams();
  const locale = params?.locale as string;
  
  if (locale && isValidLocale(locale)) {
    return locale;
  }
  
  return defaultLocale;
}

export function useTranslations() {
  const locale = useLocale();
  
  return {
    t: (key: string, values?: Record<string, string>) => {
      return getTranslation(key, locale, values);
    },
    locale
  };
}

// Simple translation function (can be enhanced with next-intl)
function getTranslation(key: string, locale: Locale, values?: Record<string, string>): string {
  // This would typically load from your message files
  // For now, return the key as fallback
  let translation = key; // Implement actual translation loading
  
  if (values) {
    Object.entries(values).forEach(([k, v]) => {
      translation = translation.replace(`{${k}}`, v);
    });
  }
  
  return translation;
}
```

#### 6.2 Language Switcher Component
```typescript
// components/i18n/LanguageSwitcher.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, localeConfig, defaultLocale, type Locale } from '@/lib/i18n/config';
import { useState } from 'react';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  className?: string;
}

export function LanguageSwitcher({ currentLocale, className = '' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = (newLocale: Locale) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
    
    // Build new path
    const newPath = newLocale === defaultLocale 
      ? pathWithoutLocale 
      : `/${newLocale}${pathWithoutLocale}`;
    
    // Set cookie for persistence
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`; // 1 year
    
    // Navigate to new locale
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Switch language"
      >
        <span className="text-lg">{localeConfig[currentLocale].flag}</span>
        <span className="text-sm font-medium text-white">
          {localeConfig[currentLocale].name}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 min-w-[150px] z-50">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => switchLanguage(locale)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-md last:rounded-b-md ${
                locale === currentLocale ? 'bg-gray-100' : ''
              }`}
            >
              <span className="text-lg">{localeConfig[locale].flag}</span>
              <span className="text-sm font-medium text-gray-900">
                {localeConfig[locale].name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

#### 6.3 Localized Layout
```typescript
// app/[locale]/layout.tsx
import { notFound } from 'next/navigation';
import { locales, localeConfig, isValidLocale, type Locale } from '@/lib/i18n/config';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { HreflangLinks } from '@/components/i18n/HreflangLinks';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    return {};
  }

  return generateLocalizedMetadata(locale, 'homepage');
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    notFound();
  }

  const direction = localeConfig[locale].dir;

  return (
    <html lang={locale} dir={direction}>
      <head>
        <HreflangLinks currentLocale={locale} pathname="/" />
      </head>
      <body className={`locale-${locale} ${direction}`}>
        <div className="min-h-screen flex flex-col">
          <Header locale={locale} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer locale={locale} />
        </div>
      </body>
    </html>
  );
}
```

### Step 7: SEO Implementation

#### 7.1 Hreflang Component
```typescript
// components/i18n/HreflangLinks.tsx
import { locales, defaultLocale, type Locale } from '@/lib/i18n/config';

interface HreflangLinksProps {
  currentLocale: Locale;
  pathname: string;
}

export function HreflangLinks({ currentLocale, pathname }: HreflangLinksProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://capetownsafaritours.com';
  
  return (
    <>
      {locales.map(locale => {
        const href = locale === defaultLocale 
          ? `${baseUrl}${pathname}`
          : `${baseUrl}/${locale}${pathname}`;
          
        return (
          <link
            key={locale}
            rel="alternate"
            hrefLang={locale}
            href={href}
          />
        );
      })}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}${pathname}`}
      />
    </>
  );
}
```

#### 7.2 Enhanced Sitemap
```typescript
// app/sitemap.xml/route.ts
import { NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/lib/i18n/config';
import { getToursByLocale } from '@/lib/tours';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://capetownsafaritours.com';
  
  const staticPages = [
    '',
    'about',
    'contact',
    'faq',
    'tours',
    'safari-tours'
  ];

  let urls: string[] = [];

  // Generate URLs for each locale
  for (const locale of locales) {
    const localePath = locale === defaultLocale ? '' : `/${locale}`;
    
    // Static pages
    for (const page of staticPages) {
      const url = `${baseUrl}${localePath}${page ? `/${page}` : ''}`;
      const priority = page === '' ? '1.0' : '0.8';
      
      urls.push(`
        <url>
          <loc>${url}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>${priority}</priority>
          ${generateHreflangTags(baseUrl, page, locale)}
        </url>
      `);
    }
    
    // Dynamic tour pages
    try {
      const tours = await getToursByLocale(locale);
      for (const tour of tours) {
        const url = `${baseUrl}${localePath}/tours/${tour.slug}`;
        urls.push(`
          <url>
            <loc>${url}</loc>
            <lastmod>${tour.updated_at || new Date().toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.9</priority>
            ${generateHreflangTags(baseUrl, `tours/${tour.slug}`, locale)}
          </url>
        `);
      }
    } catch (error) {
      console.error(`Error fetching tours for locale ${locale}:`, error);
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xhtml="http://www.w3.org/1999/xhtml">
      ${urls.join('')}
    </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

function generateHreflangTags(baseUrl: string, page: string, currentLocale: string): string {
  return locales.map(locale => {
    const href = locale === defaultLocale 
      ? `${baseUrl}${page ? `/${page}` : ''}`
      : `${baseUrl}/${locale}${page ? `/${page}` : ''}`;
    
    return `<xhtml:link rel="alternate" hreflang="${locale}" href="${href}"/>`;
  }).join('\n          ');
}
```

## Testing Strategy

### Unit Tests
```typescript
// __tests__/i18n/middleware.test.ts
import { middleware } from '../../middleware';
import { NextRequest } from 'next/server';

describe('i18n middleware', () => {
  it('should redirect to German locale for German Accept-Language', () => {
    const request = new NextRequest('http://localhost:3000/tours', {
      headers: {
        'accept-language': 'de-DE,de;q=0.9,en;q=0.8'
      }
    });
    
    const response = middleware(request);
    expect(response?.headers.get('location')).toBe('http://localhost:3000/de/tours');
  });
  
  it('should not redirect for default locale', () => {
    const request = new NextRequest('http://localhost:3000/tours', {
      headers: {
        'accept-language': 'en-US,en;q=0.9'
      }
    });
    
    const response = middleware(request);
    expect(response).toBeUndefined();
  });
});
```

### Integration Tests
```typescript
// __tests__/i18n/pages.test.ts
import { render, screen } from '@testing-library/react';
import HomePage from '../../app/[locale]/page';

describe('Localized Pages', () => {
  it('should render German homepage correctly', async () => {
    const params = Promise.resolve({ locale: 'de' });
    render(<HomePage params={params} />);
    
    expect(screen.getByText(/Kapstadt Safari Touren/)).toBeInTheDocument();
  });
});
```

## Deployment Checklist

### Pre-deployment
- [ ] All translation files created and reviewed
- [ ] Database migrations applied
- [ ] Middleware configuration tested
- [ ] SEO tags validated
- [ ] Performance benchmarks established

### Post-deployment
- [ ] Verify hreflang tags in search console
- [ ] Test language switching functionality
- [ ] Monitor Core Web Vitals for each locale
- [ ] Set up analytics tracking for language usage
- [ ] Submit localized sitemaps to search engines

## Monitoring & Maintenance

### Analytics Setup
```typescript
// lib/analytics/i18n-tracking.ts
export function trackLanguageSwitch(fromLocale: string, toLocale: string) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'language_switch', {
      from_language: fromLocale,
      to_language: toLocale,
      page_path: window.location.pathname
    });
  }
}

export function trackLocalizedPageView(locale: string) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
      language: locale,
      page_title: document.title,
      page_location: window.location.href
    });
  }
}
```

### Performance Monitoring
- Monitor bundle sizes for each locale
- Track translation loading times
- Monitor search rankings in different regions
- Analyze conversion rates by language

This implementation guide provides a step-by-step approach to implementing the internationalization architecture while maintaining SEO best practices and optimal performance.