/**
 * Validation helpers for safe data type conversion
 */

/**
 * Safely convert string or number to number with fallback
 */
export const getNumericValue = (value: string | number | undefined | null, fallback = 0): number => {
  if (value === undefined || value === null) return fallback;
  const parsed = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * Safely parse integer with fallback
 */
export const getIntegerValue = (value: string | number | undefined | null, fallback = 0): number => {
  if (value === undefined || value === null) return fallback;
  const parsed = typeof value === 'string' ? parseInt(value, 10) : Math.floor(value);
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * Validate and sanitize string input
 */
export const getStringValue = (value: any, fallback = ''): string => {
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
};

/**
 * Validate price format and return formatted string
 */
export const formatPrice = (price: string | number | undefined | null): string => {
  const numericPrice = getNumericValue(price, 0);
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericPrice);
};

/**
 * Validate and parse duration string
 */
export const parseDuration = (duration: string | undefined | null): { hours: number; minutes: number } => {
  if (!duration) return { hours: 0, minutes: 0 };
  
  const hoursMatch = duration.match(/(\d+)\s*hour/i);
  const minutesMatch = duration.match(/(\d+)\s*minute/i);
  
  return {
    hours: hoursMatch ? parseInt(hoursMatch[1], 10) : 0,
    minutes: minutesMatch ? parseInt(minutesMatch[1], 10) : 0,
  };
};

/**
 * Validate array and ensure it's not empty
 */
export const getArrayValue = <T>(value: T[] | undefined | null, fallback: T[] = []): T[] => {
  if (!Array.isArray(value)) return fallback;
  return value;
};
