import { Locale } from '@/lib/i18n/config';

// Core translation types
export interface TranslationEntry {
  key: string;
  locale: Locale;
  value: string;
  context?: string;
  description?: string;
  isApproved: boolean;
  translatedBy?: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Tour translation types
export interface TourTranslation {
  id: string;
  tourId: string;
  locale: Locale;
  title: string;
  description: string;
  shortDescription?: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  importantInfo: string[];
  whatToBring: string[];
  itinerary: ItineraryDay[];
  faqs: FAQ[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  translationQuality: 'draft' | 'review' | 'approved' | 'published';
  translatedBy?: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals?: string[];
  accommodation?: string;
  highlights?: string[];
}

export interface FAQ {
  question: string;
  answer: string;
  order?: number;
  category?: string;
}

// Blog types
export interface BlogPost {
  id: string;
  slug: string;
  locale: Locale;
  translatedFrom?: string;
  title: string;
  excerpt?: string;
  content: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  categoryId?: string;
  category?: BlogCategory;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  status: 'draft' | 'review' | 'scheduled' | 'published' | 'archived';
  publishedAt?: string;
  scheduledFor?: string;
  authorName?: string;
  authorEmail?: string;
  authorBio?: string;
  authorAvatarUrl?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  readingTimeMinutes?: number;
  wordCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: string;
  slug: string;
  locale: Locale;
  name: string;
  description?: string;
  color?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  parentId?: string;
  authorName: string;
  authorEmail: string;
  authorWebsite?: string;
  content: string;
  status: 'pending' | 'approved' | 'spam' | 'rejected';
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
  replies?: BlogComment[];
}

// Translation management types
export interface TranslationJob {
  id: string;
  contentType: 'tour' | 'blog' | 'static';
  contentId: string;
  sourceLocale: Locale;
  targetLocale: Locale;
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  dueDate?: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// SEO and metadata types
export interface LocalizedMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  alternateUrls?: Record<Locale, string>;
}

// Navigation and UI types
export interface NavigationItem {
  key: string;
  href: string;
  label: string;
  children?: NavigationItem[];
}

export interface LocalizedNavigation {
  [key: string]: NavigationItem[];
}

// Content status types
export type ContentStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived';
export type TranslationQuality = 'draft' | 'review' | 'approved' | 'published';

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Search and filtering types
export interface SearchFilters {
  locale?: Locale;
  status?: ContentStatus;
  category?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  author?: string;
}

export interface SearchResult<T> {
  item: T;
  score: number;
  highlights?: string[];
}

// Cache types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface TranslationCache {
  [key: string]: CacheEntry<string>;
}

// Form types for admin interfaces
export interface TourTranslationForm {
  title: string;
  description: string;
  shortDescription?: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  importantInfo: string[];
  whatToBring: string[];
  itinerary: ItineraryDay[];
  faqs: FAQ[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
}

export interface BlogPostForm {
  title: string;
  excerpt?: string;
  content: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  categoryId?: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  status: ContentStatus;
  publishedAt?: string;
  scheduledFor?: string;
  authorName?: string;
  authorEmail?: string;
  authorBio?: string;
  authorAvatarUrl?: string;
}

// Utility types
export type LocaleDirection = 'ltr' | 'rtl';
export type Currency = 'USD' | 'EUR' | 'SAR';
export type Region = 'US' | 'DE' | 'FR' | 'ES' | 'SA';