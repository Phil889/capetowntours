// Tour Page Configuration
export const tourPageConfig = {
  // Popular tours for static generation
  popularTourSlugs: [
    "table-mountain-cable-car-tickets",
    "cape-peninsula-tour",
    "cape-winelands-tour",
    "aquila-game-reserve-safari",
    "robben-island-tour",
  ],
  
  // Revalidation time in seconds
  revalidateTime: 3600, // 1 hour
  
  // Image configuration
  images: {
    blur: {
      enabled: true,
      placeholder: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...", // Base64 blur placeholder
    },
    sizes: {
      gallery: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      thumbnail: "(max-width: 640px) 100vw, 200px",
    },
    quality: 90,
  },
  
  // Analytics events
  analytics: {
    events: {
      tourViewed: "tour_viewed",
      bookingWidgetOpened: "booking_widget_opened",
      bookingStarted: "booking_started",
      faqExpanded: "faq_expanded",
      reviewsViewed: "reviews_viewed",
      mapClicked: "map_clicked",
      galleryImageViewed: "gallery_image_viewed",
    },
  },
  
  // Error tracking
  errorTracking: {
    enabled: process.env.NODE_ENV === "production",
    service: process.env.NEXT_PUBLIC_ERROR_TRACKING_SERVICE || "sentry",
  },
  
  // SEO defaults
  seo: {
    defaultImage: "/Best_Cape_Town_Safari_Tours_Logo.webp",
    twitterHandle: "@capetownsafari",
    siteName: "Cape Town Safari Tours",
    siteUrl: "https://capetownsafaritours.com",
  },
};

// Trust indicators configuration
export const trustIndicators = {
  rating: "4.9/5",
  verifiedReviews: "100%",
  happyGuests: "2,847",
  ranking: "#1",
};
