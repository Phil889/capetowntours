// Enhanced Error Types for Tour Pages

export interface TourError extends Error {
  code?: string;
  context?: string;
  timestamp?: Date;
  userId?: string;
  tourId?: string;
  severity?: "low" | "medium" | "high" | "critical";
}

export class TourNotFoundError extends Error implements TourError {
  code = "TOUR_NOT_FOUND";
  context = "Tour Detail Page";
  severity: "low" | "medium" | "high" | "critical" = "medium";
  timestamp: Date;
  
  constructor(public tourId: string, message?: string) {
    super(message || `Tour with slug ${tourId} not found`);
    this.name = "TourNotFoundError";
    this.timestamp = new Date();
  }
}

export class TourDataError extends Error implements TourError {
  code = "TOUR_DATA_ERROR";
  context = "Tour Data Processing";
  severity: "low" | "medium" | "high" | "critical" = "high";
  timestamp: Date;
  
  constructor(public tourId: string, public field: string, message?: string) {
    super(message || `Invalid data in field ${field} for tour ${tourId}`);
    this.name = "TourDataError";
    this.timestamp = new Date();
  }
}

export class BookingError extends Error implements TourError {
  code = "BOOKING_ERROR";
  context = "Booking Widget";
  severity: "low" | "medium" | "high" | "critical" = "critical";
  timestamp: Date;
  
  constructor(public tourId: string, public reason: string, message?: string) {
    super(message || `Booking failed for tour ${tourId}: ${reason}`);
    this.name = "BookingError";
    this.timestamp = new Date();
  }
}

export class ImageLoadError extends Error implements TourError {
  code = "IMAGE_LOAD_ERROR";
  context = "Tour Gallery";
  severity: "low" | "medium" | "high" | "critical" = "low";
  timestamp: Date;
  
  constructor(public imageUrl: string, public tourId?: string, message?: string) {
    super(message || `Failed to load image: ${imageUrl}`);
    this.name = "ImageLoadError";
    this.timestamp = new Date();
    this.tourId = tourId;
  }
}

// Error logging helper with enhanced tracking
export const logTourError = (error: TourError | Error, context: string) => {
  const tourError: TourError = {
    ...error,
    context: (error as TourError).context || context,
    timestamp: (error as TourError).timestamp || new Date(),
    severity: (error as TourError).severity || "medium",
  };
  
  console.error(`[Tour Error - ${tourError.context}]:`, {
    message: tourError.message,
    code: tourError.code,
    severity: tourError.severity,
    timestamp: tourError.timestamp,
    stack: tourError.stack,
  });
  
  // In production, send to error tracking service
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Example: Send to Sentry, LogRocket, etc.
    // window.Sentry?.captureException(tourError);
  }
  
  return tourError;
};
