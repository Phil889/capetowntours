// Standardized Tour type definition
export interface Tour {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number; // Store as number, format on display
  currency: string;
  category?: string;
  duration_days?: number;
  image_url?: string;
  image_alt?: string;
  highlights?: string[];
  max_group_size?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TourApiResponse {
  id: string;
  slug: string;
  name?: string;
  title?: string;
  description: string;
  price?: string | number;
  price_per_person_cents?: number;
  currency?: string;
  category?: string;
  duration_days?: number;
  image_url?: string;
  main_image_url?: string;
  highlights?: string[];
  max_group_size?: number;
  created_at?: string;
  updated_at?: string;
}
