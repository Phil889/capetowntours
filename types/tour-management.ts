// Enhanced type definitions for tour management system

export interface TourTemplate {
  id: string;
  name: string;
  description?: string;
  category?: string;
  templateData: {
    structure: TourStructure;
    defaults: Partial<EnhancedTour>;
    prompts?: AIPromptConfig;
  };
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TourStructure {
  sections: {
    overview: boolean;
    itinerary: boolean;
    highlights: boolean;
    includes: boolean;
    excludes: boolean;
    faqs: boolean;
    pricing: boolean;
    location: boolean;
    reviews: boolean;
  };
  requiredFields: string[];
  optionalFields: string[];
}

export interface AIPromptConfig {
  systemPrompt?: string;
  tourType?: string;
  targetAudience?: string;
  uniqueFeatures?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  duration?: string;
  keywords?: string[];
}

export interface EnhancedTour {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  version: number;
  templateId?: string;
  
  // Basic Info
  category?: string;
  durationDays?: number;
  duration?: string;
  departureTime?: string;
  pickup?: string;
  groupSizeMax?: number;
  
  // Structured Content
  structuredItinerary?: ItineraryItem[];
  structuredHighlights?: string[];
  structuredIncludes?: IncludeItem[];
  structuredExcludes?: IncludeItem[];
  structuredFaqs?: FAQItem[];
  
  // Pricing
  pricingTiers?: PricingTier[];
  
  // Images
  images?: TourImage[];
  
  // SEO
  seoData?: SEOData;
  
  // Metadata
  aiGenerated: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  
  // Legacy fields (for backward compatibility)
  price?: string;
  imageUrl?: string;
  itinerary?: string;
  highlights?: string;
  included?: string;
  excluded?: string;
  faqs?: string;
  
  // Additional Info
  cancellationPolicy?: string;
  seasonalNotes?: string;
  childPolicy?: string;
  accessibility?: string;
  mapEmbed?: string;
  reviewSnippet?: string;
}

export interface ItineraryItem {
  day?: number;
  time?: string;
  title: string;
  description: string;
  location?: string;
  duration?: string;
  highlights?: string[];
}

export interface IncludeItem {
  category: 'transport' | 'meal' | 'activity' | 'guide' | 'equipment' | 'other';
  item: string;
  description?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
  order?: number;
}

export interface PricingTier {
  id: string;
  name: string;
  description?: string;
  pricePerPerson: number;
  currency: string;
  minPeople?: number;
  maxPeople?: number;
  ageGroup?: 'adult' | 'child' | 'senior' | 'student';
  validFrom?: string;
  validUntil?: string;
  includes?: string[];
  excludes?: string[];
}

export interface TourImage {
  id?: string;
  url: string;
  altText?: string;
  caption?: string;
  isPrimary: boolean;
  orderIndex: number;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
    size?: number;
  };
}

export interface SEOData {
  titleTag?: string;
  metaDescription?: string;
  h1?: string;
  heroTagline?: string;
  shortOverview?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  schemaMarkup?: any;
}

export interface TourVersion {
  id: string;
  tourId: string;
  versionNumber: number;
  versionData: EnhancedTour;
  createdBy?: string;
  createdAt: string;
  changeNotes?: string;
}

export interface AIGenerationLog {
  id: string;
  tourId?: string;
  templateId?: string;
  prompt: string;
  response?: any;
  model?: string;
  tokensUsed?: number;
  generationType: 'full_tour' | 'description' | 'itinerary' | 'faqs' | 'enhancement';
  status: 'pending' | 'success' | 'failed';
  errorMessage?: string;
  createdAt: string;
}

// Form types for admin interface
export interface TourFormData {
  title: string;
  slug: string;
  description: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  
  // Basic Info
  durationDays: number;
  duration: string;
  departureTime: string;
  pickup: string;
  groupSizeMax: number;
  
  // Content sections
  itinerary: ItineraryItem[];
  highlights: string[];
  includes: IncludeItem[];
  excludes: IncludeItem[];
  faqs: FAQItem[];
  
  // Pricing
  pricingTiers: PricingTier[];
  
  // Images
  images: TourImage[];
  
  // SEO
  seoData: SEOData;
  
  // Additional Info
  cancellationPolicy: string;
  seasonalNotes: string;
  childPolicy: string;
  accessibility: string;
  mapEmbed: string;
}

// API Response types
export interface TourListResponse {
  tours: EnhancedTour[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TourResponse {
  tour: EnhancedTour;
  versions?: TourVersion[];
}

export interface TemplateListResponse {
  templates: TourTemplate[];
  total: number;
}

export interface AIGenerationRequest {
  templateId?: string;
  type: 'full_tour' | 'description' | 'itinerary' | 'faqs' | 'enhancement';
  input: {
    title?: string;
    category?: string;
    duration?: string;
    targetAudience?: string;
    uniqueFeatures?: string[];
    existingContent?: Partial<EnhancedTour>;
  };
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  };
}

export interface AIGenerationResponse {
  success: boolean;
  data?: Partial<EnhancedTour>;
  logId: string;
  tokensUsed?: number;
  error?: string;
}
