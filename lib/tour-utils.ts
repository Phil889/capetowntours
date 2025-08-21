import { TourDatabase, Tour, FAQ } from "@/types/tour-detail";

/**
 * Normalizes database tour data to consistent Tour type
 * Handles both legacy and enhanced data formats
 */
export function normalizeTourData(data: any): Tour {
  // Handle structured highlights from enhanced format
  const highlights = data.structured_highlights 
    ? (Array.isArray(data.structured_highlights) ? data.structured_highlights : [])
    : parseDelimitedString(data.highlights);

  // Handle structured includes/excludes from enhanced format
  const included = data.structured_includes 
    ? (Array.isArray(data.structured_includes) 
        ? data.structured_includes.map((item: any) => 
            typeof item === 'string' ? item : item.item || '')
        : [])
    : parseDelimitedString(data.included);

  const excluded = data.structured_excludes 
    ? (Array.isArray(data.structured_excludes) 
        ? data.structured_excludes.map((item: any) => 
            typeof item === 'string' ? item : item.item || '')
        : [])
    : parseDelimitedString(data.excluded);

  // Handle structured FAQs from enhanced format
  const faqs = data.structured_faqs 
    ? (Array.isArray(data.structured_faqs) 
        ? data.structured_faqs.map((faq: any) => ({
            question: faq.question || '',
            answer: faq.answer || ''
          }))
        : [])
    : parseFAQs(data.faqs);

  // Handle structured itinerary from enhanced format
  // First check if we have the legacy itinerary format to display on frontend
  let itinerary: string[] = [];
  
  if (data.itinerary) {
    // Use legacy format if available for frontend display
    itinerary = parseDelimitedString(data.itinerary, ">");
  } else if (data.structured_itinerary && Array.isArray(data.structured_itinerary)) {
    // Fall back to structured format and convert it to display format
    itinerary = data.structured_itinerary.flatMap((item: any) => {
      if (typeof item === 'string') return [item];
      // Convert structured itinerary to simple string array
      if (item.highlights && Array.isArray(item.highlights)) {
        // Use the highlights as individual steps
        return item.highlights;
      }
      // Or create a simple description
      return [`${item.title}: ${item.description}`];
    });
  }

  // Handle pricing from enhanced format
  const price = data.pricing_tiers && Array.isArray(data.pricing_tiers) && data.pricing_tiers.length > 0
    ? String(data.pricing_tiers[0].pricePerPerson || data.pricing_tiers[0].price_per_person || 0)
    : (data.price || data.price_per_person_cents || "0");

  return {
    id: data.id,
    slug: data.slug,
    title: data.name || data.title || "",
    description: data.description,
    price: price,
    category: data.category,
    durationDays: data.duration_days || data.durationDays,
    imageUrl: resolveImageUrl(data),
    createdAt: data.created_at || data.createdAt,
    updatedAt: data.updated_at || data.updatedAt,
    highlights: highlights,
    itinerary: itinerary,
    included: included,
    excluded: excluded,
    mapEmbed: data.map_embed || data.mapEmbed,
    uniqueSellingPoints: parseDelimitedString(data.unique_selling_points),
    faqs: faqs,
    reviewSnippet: data.review_snippet || data.reviewSnippet,
    cancellationPolicy: data.cancellation_policy || data.cancellationPolicy,
    seasonalNotes: data.seasonal_notes || data.seasonalNotes,
    childPolicy: data.child_policy || data.childPolicy,
    accessibility: data.accessibility,
    groupSizeMax: data.group_size_max || data.groupSizeMax,
    duration: data.duration,
    departureTime: data.departure_time || data.departureTime,
    pickup: data.pickup,
  };
}

/**
 * Resolves image URL with proper fallback logic
 */
export function resolveImageUrl(data: any): string {
  // Handle enhanced format with images array
  if (data.images && Array.isArray(data.images) && data.images.length > 0) {
    const primaryImage = data.images.find((img: any) => img.is_primary || img.isPrimary);
    const firstImage = primaryImage || data.images[0];
    if (firstImage && firstImage.url) {
      return firstImage.url;
    }
  }
  
  const imageUrl = data.image_url || data.main_image_url || data.imageUrl;
  
  if (!imageUrl) {
    return `/images/${data.slug}.webp`;
  }
  
  // If it's already a full URL, return as-is
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }
  
  // If it starts with /, assume it's already a proper path
  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }
  
  // Otherwise, assume it's in the images folder
  return `/images/${imageUrl}`;
}

/**
 * Gets an array of possible image URLs for the gallery
 */
export function getTourImages(tour: Tour): string[] {
  const images: string[] = [];
  
  if (tour.imageUrl) {
    // If we have an actual image URL, use only that
    images.push(tour.imageUrl);
  } else {
    // Only use placeholder if no image URL exists
    images.push("/placeholder.jpg");
  }
  
  return images;
}

/**
 * Parses pipe-delimited strings into arrays
 */
export function parseDelimitedString(
  str: string | undefined,
  delimiter: string = "|"
): string[] {
  if (!str) return [];
  
  return str
    .split(delimiter)
    .map(item => item.trim())
    .filter(item => item.length > 0)
    .map(item => item.replace(/^-\s*/, "")); // Remove leading dashes
}

/**
 * Safely decodes HTML entities
 */
export function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  
  const htmlEntities: Record<string, string> = {
    "&#124;": "|",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&#x27;": "'",
    "&nbsp;": " ",
  };
  
  let decoded = str;
  Object.entries(htmlEntities).forEach(([entity, char]) => {
    decoded = decoded.replace(new RegExp(entity, "g"), char);
  });
  
  return decoded;
}

/**
 * Parses FAQs from string or returns array as-is
 */
export function parseFAQs(faqs: string | FAQ[] | undefined): FAQ[] {
  if (!faqs) return [];
  
  // If already an array, return as-is
  if (Array.isArray(faqs)) {
    return faqs;
  }
  
  // Try to parse as JSON first
  try {
    const parsed = JSON.parse(faqs);
    if (Array.isArray(parsed)) {
      return parsed.map(item => ({
        question: item.question || item.q || "",
        answer: item.answer || item.a || "",
      }));
    }
  } catch {
    // Not JSON, continue with string parsing
  }
  
  // Parse pipe-delimited format
  const decoded = decodeHtmlEntities(faqs);
  const faqPairs: FAQ[] = [];
  
  // Split by Q: to find each question-answer pair
  const parts = decoded.split(/Q:\s*/);
  
  for (const part of parts) {
    if (!part.trim()) continue;
    
    // Split each part into question and answer
    const [questionPart, ...answerParts] = part.split(/A:\s*/);
    
    if (questionPart && answerParts.length > 0) {
      const question = questionPart.replace(/\|\|?$/, "").trim();
      const answer = answerParts.join("A:").replace(/\|\|?$/, "").trim();
      
      // Only add if we have both question and answer
      if (question && answer) {
        faqPairs.push({ question, answer });
      }
    }
  }
  
  return faqPairs;
}

/**
 * Gets location information for display
 */
export function getLocationInfo(tour: Tour) {
  const isTokaraWineEstate = tour.title === "Tokara Wine Estate";
  
  return {
    name: isTokaraWineEstate ? "Tokara Wine Estate" : "Tour Meeting Point",
    address: isTokaraWineEstate
      ? "Helshoogte Pass Road, Stellenbosch, 7600, South Africa"
      : tour.pickup || "Cape Town, South Africa",
    mapsQuery: isTokaraWineEstate
      ? "Tokara Wine Estate Stellenbosch"
      : `${tour.title} Cape Town`,
    departureTime: tour.departureTime || "09:00 AM",
    pickup: tour.pickup || "Hotel pickup included",
    duration: tour.duration || "Full day experience",
  };
}
