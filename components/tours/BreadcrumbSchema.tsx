"use client";

import { Locale } from '@/lib/i18n/config';

interface BreadcrumbSchemaProps {
  tourTitle: string;
  tourSlug: string;
  locale?: Locale;
}

export default function BreadcrumbSchema({ tourTitle, tourSlug, locale = 'en' }: BreadcrumbSchemaProps) {
  const baseUrl = "https://capetownsafaritours.com";
  const localePath = locale === 'en' ? '' : `/${locale}`;
  
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${baseUrl}${localePath}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tours",
        "item": `${baseUrl}${localePath}/tours`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": tourTitle,
        "item": `${baseUrl}${localePath}/tours/${tourSlug}`
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData)
      }}
    />
  );
}
