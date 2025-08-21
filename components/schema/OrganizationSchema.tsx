export default function OrganizationSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://capetownsafaritours.com/#organization",
    "name": "Cape Town Safari Tours",
    "url": "https://capetownsafaritours.com",
    "logo": "https://capetownsafaritours.com/Best_Cape_Town_Safari_Tours_Logo.webp",
    "description": "Cape Town's premier private safari and wine tour operator, offering luxury wildlife experiences and bespoke adventure tours since 2015.",
    "foundingDate": "2015",
    "slogan": "Your adventure, perfectly crafted",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+27-21-424-5215",
        "contactType": "customer service",
        "availableLanguage": ["English", "Afrikaans"],
        "areaServed": "ZA"
      },
      {
        "@type": "ContactPoint",
        "email": "info@capetownsafaritours.com",
        "contactType": "customer service"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cape Town",
      "addressRegion": "Western Cape",
      "addressCountry": "ZA"
    },
    "award": [
      "TripAdvisor Certificate of Excellence 2024",
      "Viator Experience Awards Winner 2024",
      "Best Safari Tour Operator Cape Town 2024"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2847",
      "bestRating": "5",
      "worstRating": "1"
    },
    "sameAs": [
      "https://www.tripadvisor.com/capetownsafaritours",
      "https://www.viator.com/capetownsafaritours",
      "https://www.facebook.com/capetownsafaritours",
      "https://www.instagram.com/capetownsafaritours"
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