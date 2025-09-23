// Google Analytics 4 configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// SEO-specific tracking events
export const trackTourView = (tourName: string, tourCategory: string) => {
  event({
    action: 'view_tour',
    category: 'Tours',
    label: `${tourCategory}: ${tourName}`,
  });
};

export const trackBookingStart = (tourName: string, price?: number) => {
  event({
    action: 'begin_checkout',
    category: 'Booking',
    label: tourName,
    value: price,
  });
};

export const trackSearchQuery = (searchTerm: string) => {
  event({
    action: 'search',
    category: 'Site Search',
    label: searchTerm,
  });
};

export const trackPhoneClick = () => {
  event({
    action: 'click_phone',
    category: 'Contact',
    label: 'Phone Number',
  });
};

export const trackEmailClick = () => {
  event({
    action: 'click_email',
    category: 'Contact',
    label: 'Email Address',
  });
};

export const trackSocialClick = (platform: string) => {
  event({
    action: 'click_social',
    category: 'Social Media',
    label: platform,
  });
};

export const trackDownload = (fileName: string) => {
  event({
    action: 'download',
    category: 'Downloads',
    label: fileName,
  });
};

export const trackOutboundLink = (url: string) => {
  event({
    action: 'click_outbound',
    category: 'Outbound Links',
    label: url,
  });
};

// Core Web Vitals tracking (simplified)
export const trackWebVitals = (metricName: string, value: number) => {
  event({
    action: metricName,
    category: 'Web Vitals',
    label: 'performance',
    value: Math.round(value),
  });
};

// Scroll depth tracking
export const trackScrollDepth = (percentage: number) => {
  event({
    action: 'scroll_depth',
    category: 'Engagement',
    label: `${percentage}%`,
    value: percentage,
  });
};

// Form tracking
export const trackFormStart = (formName: string) => {
  event({
    action: 'form_start',
    category: 'Forms',
    label: formName,
  });
};

export const trackFormComplete = (formName: string) => {
  event({
    action: 'form_complete',
    category: 'Forms',
    label: formName,
  });
};

// Enhanced ecommerce tracking
export const trackPurchase = (transactionId: string, value: number, items: any[]) => {
  if (typeof window !== 'undefined') {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'ZAR',
      items: items,
    });
  }
};

export const trackAddToCart = (itemId: string, itemName: string, price: number) => {
  if (typeof window !== 'undefined') {
    window.gtag('event', 'add_to_cart', {
      currency: 'ZAR',
      value: price,
      items: [{
        item_id: itemId,
        item_name: itemName,
        price: price,
        quantity: 1,
      }],
    });
  }
};