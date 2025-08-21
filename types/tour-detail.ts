// Strict type definitions for tour data
export interface TourDatabase {
  id: string;
  slug: string;
  name?: string;
  title?: string;
  description: string;
  price?: string;
  price_per_person_cents?: string;
  category?: string;
  duration_days?: number;
  image_url?: string;
  main_image_url?: string;
  created_at?: string;
  updated_at?: string;
  highlights?: string;
  itinerary?: string;
  included?: string;
  excluded?: string;
  map_embed?: string;
  unique_selling_points?: string;
  faqs?: string | FAQ[];
  review_snippet?: string;
  cancellation_policy?: string;
  seasonal_notes?: string;
  child_policy?: string;
  accessibility?: string;
  group_size_max?: number;
  duration?: string;
  departure_time?: string;
  pickup?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

// Normalized tour type with consistent naming
export interface Tour {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: string;
  category?: string;
  durationDays?: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  highlights?: string[];
  itinerary?: string[];
  included?: string[];
  excluded?: string[];
  mapEmbed?: string;
  uniqueSellingPoints?: string[];
  faqs?: FAQ[];
  reviewSnippet?: string;
  cancellationPolicy?: string;
  seasonalNotes?: string;
  childPolicy?: string;
  accessibility?: string;
  groupSizeMax?: number;
  duration?: string;
  departureTime?: string;
  pickup?: string;
}

// Badge type for hero section
export interface TourBadge {
  icon: React.ReactNode;
  label: string;
  value: string;
}

// Trust indicator type
export interface TrustIndicator {
  icon: React.ReactNode;
  value: string;
  label: string;
}
