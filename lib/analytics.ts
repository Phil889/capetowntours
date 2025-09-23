// Analytics tracking utility for tour pages
import { logError, logInfo } from '@/lib/error-logger';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

interface TourViewEvent extends AnalyticsEvent {
  name: "tour_viewed";
  properties: {
    tourId: string;
    tourName: string;
    tourSlug: string;
    price: number;
    referrer?: string;
  };
}

interface BookingEvent extends AnalyticsEvent {
  properties: {
    tourId: string;
    tourName: string;
    tourPrice: number;
    selectedDate?: string;
    numberOfGuests?: number;
    source: "desktop" | "mobile";
  };
}

interface InteractionEvent extends AnalyticsEvent {
  properties: {
    tourId: string;
    elementType: string;
    elementValue?: string;
    position?: number;
  };
}

class Analytics {
  private queue: AnalyticsEvent[] = [];
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = typeof window !== "undefined" && process.env.NODE_ENV === "production";
  }

  // Track page view
  trackTourView(tourId: string, tourName: string, tourSlug: string, price: number) {
    const event: TourViewEvent = {
      name: "tour_viewed",
      properties: {
        tourId,
        tourName,
        tourSlug,
        price,
        referrer: typeof document !== "undefined" ? document.referrer : undefined,
      },
      timestamp: new Date(),
    };
    this.track(event);
  }

  // Track booking widget interactions
  trackBookingWidgetOpened(tourId: string, tourName: string, source: "desktop" | "mobile") {
    this.track({
      name: "booking_widget_opened",
      properties: {
        tourId,
        tourName,
        source,
      },
    });
  }

  trackBookingStarted(
    tourId: string,
    tourName: string,
    tourPrice: number,
    selectedDate: string,
    numberOfGuests: number,
    source: "desktop" | "mobile"
  ) {
    const event: BookingEvent = {
      name: "booking_started",
      properties: {
        tourId,
        tourName,
        tourPrice,
        selectedDate,
        numberOfGuests,
        source,
      },
    };
    this.track(event);
  }

  // Track FAQ interactions
  trackFAQExpanded(tourId: string, question: string, position: number) {
    this.track({
      name: "faq_expanded",
      properties: {
        tourId,
        question,
        position,
      },
    });
  }

  // Track reviews section
  trackReviewsViewed(tourId: string, numberOfReviews: number) {
    this.track({
      name: "reviews_viewed",
      properties: {
        tourId,
        numberOfReviews,
      },
    });
  }

  trackReviewsExpanded(tourId: string, expandedCount: number) {
    this.track({
      name: "reviews_expanded",
      properties: {
        tourId,
        expandedCount,
      },
    });
  }

  // Track map interactions
  trackMapClicked(tourId: string, location: string) {
    this.track({
      name: "map_clicked",
      properties: {
        tourId,
        location,
      },
    });
  }

  // Track gallery interactions
  trackGalleryImageViewed(tourId: string, imageIndex: number, imageUrl: string) {
    this.track({
      name: "gallery_image_viewed",
      properties: {
        tourId,
        imageIndex,
        imageUrl,
      },
    });
  }

  // Track trust indicators clicked
  trackTrustIndicatorClicked(indicator: string, value: string) {
    this.track({
      name: "trust_indicator_clicked",
      properties: {
        indicator,
        value,
      },
    });
  }

  // Generic track method
  private track(event: AnalyticsEvent) {
    if (!this.isEnabled) {
      // In development, log to console
      if (process.env.NODE_ENV === "development") {
        logInfo('Analytics event tracked in development', {
          component: 'Analytics',
          function: 'track',
          eventName: event.name,
          action: 'development_tracking'
        });
      }
      return;
    }

    // Add to queue for batch sending
    this.queue.push({
      ...event,
      timestamp: event.timestamp || new Date(),
    });

    // Send to analytics service
    this.sendToService(event);
  }

  private sendToService(event: AnalyticsEvent) {
    // Google Analytics 4
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", event.name, event.properties);
    }

    // Facebook Pixel
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("trackCustom", event.name, event.properties);
    }

    // Custom analytics endpoint
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }).catch((error) => {
        logError('Failed to send analytics event to custom endpoint', error, {
          component: 'Analytics',
          function: 'sendToService',
          eventName: event.name,
          action: 'custom_endpoint_send'
        });
      });
    }
  }

  // Batch send queued events (for performance)
  flushQueue() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    // Send batch to analytics service
    if (process.env.NEXT_PUBLIC_ANALYTICS_BATCH_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_BATCH_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ events }),
      }).catch((error) => {
        logError('Failed to send analytics batch to endpoint', error, {
          component: 'Analytics',
          function: 'flushQueue',
          eventCount: events.length,
          action: 'batch_send_error'
        });
        // Re-queue events on failure
        this.queue.unshift(...events);
      });
    }
  }
}

// Singleton instance
const analytics = new Analytics();

// Auto-flush queue before page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    analytics.flushQueue();
  });
}

export default analytics;

// Export specific tracking functions for easy use
export const trackTourView = analytics.trackTourView.bind(analytics);
export const trackBookingWidgetOpened = analytics.trackBookingWidgetOpened.bind(analytics);
export const trackBookingStarted = analytics.trackBookingStarted.bind(analytics);
export const trackFAQExpanded = analytics.trackFAQExpanded.bind(analytics);
export const trackReviewsViewed = analytics.trackReviewsViewed.bind(analytics);
export const trackReviewsExpanded = analytics.trackReviewsExpanded.bind(analytics);
export const trackMapClicked = analytics.trackMapClicked.bind(analytics);
export const trackGalleryImageViewed = analytics.trackGalleryImageViewed.bind(analytics);
export const trackTrustIndicatorClicked = analytics.trackTrustIndicatorClicked.bind(analytics);
