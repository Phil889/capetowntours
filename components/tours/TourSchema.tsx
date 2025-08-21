import { Tour } from "@/types/tour-detail";

interface TourSchemaProps {
  tour: Tour;
  tourImages: string[];
  locationInfo: {
    name: string;
    address: string;
    departureTime: string;
    pickup: string;
    duration: string;
    mapsQuery: string;
  };
}

// Use fixed dates to avoid hydration mismatch
const VALID_FROM = "2024-01-01T00:00:00Z";
const VALID_UNTIL = "2025-12-31T23:59:59Z";

export default function TourSchema({ tour, tourImages, locationInfo }: TourSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": tour.title,
    "description": tour.description,
    "image": tourImages,
    "offers": {
      "@type": "Offer",
      "url": `https://capetownsafaritours.com/tours/${tour.slug}`,
      "priceCurrency": "ZAR",
      "price": tour.price,
      "availability": "https://schema.org/InStock",
      "validFrom": VALID_FROM,
      "priceValidUntil": VALID_UNTIL,
      "seller": {
        "@type": "Organization",
        "name": "Cape Town Safari Tours",
        "url": "https://capetownsafaritours.com"
      }
    },
    "provider": {
      "@type": "Organization",
      "name": "Cape Town Safari Tours",
      "url": "https://capetownsafaritours.com",
      "logo": "https://capetownsafaritours.com/Best_Cape_Town_Safari_Tours_Logo.webp",
      "sameAs": [
        "https://www.tripadvisor.com/capetownsafaritours",
        "https://www.viator.com/capetownsafaritours"
      ]
    },
    "touristType": "Sightseeing",
    "itinerary": tour.itinerary ? {
      "@type": "ItemList",
      "numberOfItems": tour.itinerary.length,
      "itemListElement": tour.itinerary.map((step, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": `Stop ${idx + 1}`,
        "description": step
      }))
    } : undefined,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2847",
      "bestRating": "5",
      "worstRating": "1"
    },
    "duration": tour.duration,
    "departureTime": tour.departureTime,
    "includes": tour.included?.join(", "),
    "location": {
      "@type": "Place",
      "name": locationInfo.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cape Town",
        "addressRegion": "Western Cape",
        "addressCountry": "ZA",
        "streetAddress": locationInfo.address
      }
    },
    "maximumAttendeeCapacity": tour.groupSizeMax,
    "audience": {
      "@type": "PeopleAudience",
      "audienceType": tour.childPolicy ? "Families" : "General"
    }
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
