import React from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  tourTitle: string;
  tourUrl: string;
  faqs: FAQ[];
}

function decodeFaqs(faqs: string): FAQ[] {
  if (!faqs) return [];
  
  const decoded = faqs
    .replace(/&#124;/g, "|")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
    
  return decoded
    .split("||")
    .map((pair) => {
      const [q, a] = pair.split("A:");
      return {
        question: q ? q.replace(/^Q:/, "").trim() : "",
        answer: a ? a.trim() : "",
      };
    })
    .filter((faq) => faq.question && faq.answer);
}

export default function FAQSchema({ tourTitle, tourUrl, faqs }: FAQSchemaProps) {
  // Parse FAQs if they come as a string
  const parsedFaqs = typeof faqs === 'string' ? decodeFaqs(faqs) : faqs;
  
  if (!parsedFaqs || parsedFaqs.length === 0) return null;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": parsedFaqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Also add TouristAttraction schema for better context
  const touristAttractionSchema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": tourTitle,
    "url": tourUrl,
    "description": parsedFaqs[0]?.answer || `Information about ${tourTitle} in Cape Town`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cape Town",
      "addressRegion": "Western Cape",
      "addressCountry": "South Africa"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -33.9249,
      "longitude": 18.4241
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "ZAR",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristAttractionSchema) }}
      />
    </>
  );
}
