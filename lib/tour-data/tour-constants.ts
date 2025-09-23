import React from 'react';
import { Star, Award, Shield, Heart, TrendingUp, Zap, Users, Calendar, Clock, MapPin, Navigation, CheckCircle, XCircle, Info, Sun, Compass, HelpCircle, Sparkles } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

/**
 * Tour badge configurations for hero section
 */
export const TOUR_BADGES = [
  { icon: React.createElement(Award, { className: "w-4 h-4" }), label: "Best", value: "Seller" },
  { icon: React.createElement(Shield, { className: "w-4 h-4" }), label: "Verified", value: "Tour" },
  { icon: React.createElement(Star, { className: "w-4 h-4" }), label: "4.9", value: "Rating" },
  { icon: React.createElement(Heart, { className: "w-4 h-4" }), label: "Guest", value: "Favorite" },
];

/**
 * Trust indicators displayed on tour pages
 */
export const TRUST_INDICATORS = {
  rating: { 
    value: "4.9/5", 
    numericValue: 4.9,
    max: 5, 
    label: "Guest Rating",
    icon: Star
  },
  reviews: { 
    value: "100%", 
    numericValue: 100,
    label: "Verified Reviews",
    icon: Shield
  },
  guests: { 
    value: "2,847", 
    numericValue: 2847,
    label: "Happy Guests",
    icon: TrendingUp
  },
  ranking: { 
    value: "#1", 
    label: "Tour Operator",
    icon: Award
  }
};

/**
 * Popular tour slugs for static generation (updated with actual database slugs)
 */
export const POPULAR_TOUR_SLUGS = [
  "inverdoorn-safari-tour",
  "cape-town-skydive", 
  "simon-s-town",
  "chapman-s-peak-drive",
  "table-mountain-cableway",
];

/**
 * Section icons mapping
 */
export const SECTION_ICONS: Record<string, LucideIcon> = {
  overview: Sparkles,
  itinerary: Navigation,
  inclusions: CheckCircle,
  exclusions: XCircle,
  info: Info,
  seasonal: Sun,
  childPolicy: Users,
  accessibility: Info,
  cancellation: Calendar,
  faq: HelpCircle,
  location: Compass,
  departure: Clock,
  pickup: Users,
  meetingPoint: MapPin
};

/**
 * Tour page configuration
 */
export const TOUR_PAGE_CONFIG = {
  cacheRevalidate: 3600, // 1 hour
  sections: {
    overview: { enabled: true, order: 1 },
    itinerary: { enabled: true, order: 2 },
    inclusions: { enabled: true, order: 3 },
    importantInfo: { enabled: true, order: 4 },
    faq: { enabled: true, order: 5 },
    location: { enabled: true, order: 6 },
    reviews: { enabled: true, order: 7 }
  },
  reviewsConfig: {
    initialDisplayCount: 5,
    loadMoreIncrement: 10,
    maxDisplayCount: 50
  },
  bookingWidget: {
    stickyOffset: 100,
    mobileBreakpoint: 1024
  }
};

/**
 * Default tour images configuration
 */
export const DEFAULT_TOUR_IMAGES = {
  placeholder: '/placeholder.jpg',
  logo: '/Best_Cape_Town_Safari_Tours_Logo.webp',
  maxGalleryImages: 10,
  thumbnailSize: { width: 200, height: 150 },
  mainImageSize: { width: 1200, height: 630 }
};

/**
 * SEO configuration for tour pages
 */
export const TOUR_SEO_CONFIG = {
  siteName: "Cape Town Safari Tours",
  siteUrl: "https://capetownsafaritours.com",
  twitterHandle: "@capetownsafari",
  defaultKeywords: [
    "Cape Town tours",
    "safari",
    "wildlife",
    "South Africa",
    "tourism",
    "adventure",
    "travel"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
};
