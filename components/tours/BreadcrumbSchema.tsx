"use client";

interface BreadcrumbSchemaProps {
  tourTitle: string;
  tourSlug: string;
}

export default function BreadcrumbSchema({ tourTitle, tourSlug }: BreadcrumbSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://capetownsafaritours.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tours",
        "item": "https://capetownsafaritours.com/tours"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": tourTitle,
        "item": `https://capetownsafaritours.com/tours/${tourSlug}`
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
