/**
 * Centralized Error Logging Service
 * Replaces console.log statements with structured logging
 */

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface LogContext {
  component?: string;
  function?: string;
  userId?: string;
  tourId?: string;
  bookingId?: string;
  locale?: string;
  action?: string;
  metadata?: Record<string, any>;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
  stack?: string;
}

class ErrorLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isServer = typeof window === 'undefined';

  /**
   * Log error messages with context
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, error, context);
  }

  /**
   * Log warning messages with context
   */
  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, undefined, context);
  }

  /**
   * Log informational messages (development only)
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.log(LogLevel.INFO, message, undefined, context);
    }
  }

  /**
   * Log debug messages (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, undefined, context);
    }
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, error?: Error | unknown, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    
    const logEntry: LogEntry = {
      timestamp,
      level,
      message,
      context,
    };

    // Handle error objects
    if (error) {
      if (error instanceof Error) {
        logEntry.error = error;
        logEntry.stack = error.stack;
      } else {
        // Handle non-Error objects
        logEntry.metadata = { error: error };
      }
    }

    // In development, use console for immediate feedback
    if (this.isDevelopment) {
      this.logToConsole(logEntry);
    }

    // In production, send to external service
    if (!this.isDevelopment) {
      this.logToExternalService(logEntry);
    }

    // Always store critical errors
    if (level === LogLevel.ERROR) {
      this.storeErrorLocally(logEntry);
    }
  }

  /**
   * Development console logging with formatting
   */
  private logToConsole(entry: LogEntry): void {
    const prefix = `[${entry.level.toUpperCase()}] ${entry.timestamp}`;
    const contextStr = entry.context ? ` [${this.formatContext(entry.context)}]` : '';
    
    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(`${prefix}${contextStr}: ${entry.message}`, entry.error || '');
        if (entry.stack) console.error(entry.stack);
        break;
      case LogLevel.WARN:
        console.warn(`${prefix}${contextStr}: ${entry.message}`);
        break;
      case LogLevel.INFO:
        console.info(`${prefix}${contextStr}: ${entry.message}`);
        break;
      case LogLevel.DEBUG:
        console.debug(`${prefix}${contextStr}: ${entry.message}`);
        break;
    }
  }

  /**
   * Production external service logging (placeholder for integration)
   */
  private async logToExternalService(entry: LogEntry): Promise<void> {
    try {
      // TODO: Integrate with external logging service (e.g., Sentry, LogRocket, DataDog)
      // Example for Sentry integration:
      /*
      if (typeof window !== 'undefined' && window.Sentry) {
        if (entry.level === LogLevel.ERROR) {
          window.Sentry.captureException(entry.error || new Error(entry.message), {
            contexts: {
              logger: entry.context
            }
          });
        } else {
          window.Sentry.captureMessage(entry.message, entry.level as any);
        }
      }
      */

      // For now, send to custom API endpoint for collection
      if (this.isServer) {
        // Server-side logging could be sent to logging service
        // await fetch('/api/internal/logs', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(entry)
        // });
      }
    } catch (logError) {
      // Fallback: if external logging fails, at least log to console in dev
      if (this.isDevelopment) {
        console.error('Failed to log to external service:', logError);
      }
    }
  }

  /**
   * Store critical errors locally for recovery
   */
  private storeErrorLocally(entry: LogEntry): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const key = `error_log_${Date.now()}`;
        localStorage.setItem(key, JSON.stringify(entry));

        // Clean up old entries (keep last 10)
        this.cleanupLocalLogs();
      }
    } catch (storageError) {
      // Ignore storage errors
    }
  }

  /**
   * Clean up old local error logs
   */
  private cleanupLocalLogs(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const keys = Object.keys(localStorage)
          .filter(key => key.startsWith('error_log_'))
          .sort()
          .reverse();

        // Keep only the 10 most recent
        keys.slice(10).forEach(key => localStorage.removeItem(key));
      }
    } catch {
      // Ignore cleanup errors
    }
  }

  /**
   * Format context for readable logging
   */
  private formatContext(context: LogContext): string {
    const parts: string[] = [];
    
    if (context.component) parts.push(`Component: ${context.component}`);
    if (context.function) parts.push(`Function: ${context.function}`);
    if (context.action) parts.push(`Action: ${context.action}`);
    if (context.tourId) parts.push(`Tour: ${context.tourId}`);
    if (context.bookingId) parts.push(`Booking: ${context.bookingId}`);
    if (context.locale) parts.push(`Locale: ${context.locale}`);
    if (context.userId) parts.push(`User: ${context.userId}`);

    return parts.join(', ');
  }

  /**
   * Get recent error logs (for debugging)
   */
  getRecentErrors(): LogEntry[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const keys = Object.keys(localStorage)
          .filter(key => key.startsWith('error_log_'))
          .sort()
          .reverse()
          .slice(0, 10);

        return keys.map(key => JSON.parse(localStorage.getItem(key) || '{}'));
      }
    } catch {
      // Ignore storage errors
    }
    return [];
  }
}

// Singleton instance
const logger = new ErrorLogger();

export default logger;

// Convenience exports
export const logError = (message: string, error?: Error | unknown, context?: LogContext) => 
  logger.error(message, error, context);

export const logWarn = (message: string, context?: LogContext) => 
  logger.warn(message, context);

export const logInfo = (message: string, context?: LogContext) => 
  logger.info(message, context);

export const logDebug = (message: string, context?: LogContext) => 
  logger.debug(message, context);