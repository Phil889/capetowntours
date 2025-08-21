// Helper to map emoji flags to country codes
export const flagToCountryCode: Record<string, string> = {
  "🇩🇪": "DE", // Germany
  "🇺🇸": "US", // USA
  "🇨🇳": "CN", // China
  "🇫🇷": "FR", // France
  "🇦🇺": "AU", // Australia
  "🇦🇪": "AE", // UAE
  "🇪🇸": "ES", // Spain
  "🇯🇵": "JP", // Japan
  "🇮🇹": "IT", // Italy
  "🇬🇧": "GB", // UK
  "🇰🇼": "KW", // Kuwait
  "🇧🇷": "BR", // Brazil
  "🇸🇪": "SE", // Sweden
  "🇮🇳": "IN", // India
  "🇷🇺": "RU", // Russia
  "🇰🇷": "KR", // South Korea
  "🇩🇰": "DK", // Denmark
  "🇵🇹": "PT", // Portugal
  "🇨🇦": "CA", // Canada
  "🇳🇴": "NO", // Norway
  "🇿🇦": "ZA", // South Africa
};

// Helper function to add country codes to reviews
export function addCountryCodesToReviews(reviews: any[]): any[] {
  return reviews.map(review => ({
    ...review,
    countryCode: flagToCountryCode[review.flag] || "GB"
  }));
}
