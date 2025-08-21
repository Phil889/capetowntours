export default function LocalBusinessSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://capetownsafaritours.com/#business",
    "name": "Cape Town Safari Tours",
    "alternateName": "Cape Town Safari Tours & Wine Experiences",
    "description": "Premier private safari and wine tour operator in Cape Town, South Africa. Specializing in Big 5 wildlife safaris, luxury wine tours, and bespoke Cape Peninsula experiences.",
    "url": "https://capetownsafaritours.com",
    "telephone": "+27-21-424-5215",
    "email": "info@capetownsafaritours.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "V&A Waterfront",
      "addressLocality": "Cape Town",
      "addressRegion": "Western Cape",
      "postalCode": "8001",
      "addressCountry": "ZA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -33.9249,
      "longitude": 18.4241
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2847",
      "bestRating": "5",
      "worstRating": "1"
    },
    "priceRange": "$$$$",
    "currenciesAccepted": "ZAR, USD, EUR, GBP",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer",
    "areaServed": [
      {
        "@type": "City",
        "name": "Cape Town"
      },
      {
        "@type": "State",
        "name": "Western Cape"
      },
      {
        "@type": "Country",
        "name": "South Africa"
      }
    ],
    "serviceType": "Safari Tours, Wine Tours, Adventure Tours",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Cape Town Tour Packages",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Big 5 Safari Tours",
            "description": "Private wildlife safari experiences to see Africa's Big 5 animals"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Cape Winelands Tours",
            "description": "Luxury wine tasting tours in Stellenbosch and Franschhoek"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Cape Peninsula Tours",
            "description": "Scenic tours to Cape Point, Boulders Beach, and coastal attractions"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Table Mountain Tours",
            "description": "Cable car and hiking experiences on iconic Table Mountain"
          }
        }
      ]
    },
    "openingHours": "Mo-Su 06:00-22:00",
    "sameAs": [
      "https://www.tripadvisor.com/capetownsafaritours",
      "https://www.viator.com/capetownsafaritours",
      "https://www.facebook.com/capetownsafaritours",
      "https://www.instagram.com/capetownsafaritours"
    ],
    "logo": "https://capetownsafaritours.com/Best_Cape_Town_Safari_Tours_Logo.webp",
    "image": [
      "https://capetownsafaritours.com/Best_Cape_Town_Safari_Tours_Logo.webp",
      "https://capetownsafaritours.com/safari-elephants-river.png",
      "https://capetownsafaritours.com/safari-giraffe-sunset.webp"
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