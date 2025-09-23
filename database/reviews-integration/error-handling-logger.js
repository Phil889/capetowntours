#!/usr/bin/env node

/**
 * Advanced Error Handling and Logging System for Tour Reviews
 * 
 * Comprehensive logging and error management system designed for
 * production-grade tour reviews database operations.
 * 
 * Features:
 * - Structured logging with multiple levels
 * - Error categorization and analysis
 * - Performance monitoring and alerts
 * - Database error recovery
 * - Log rotation and archival
 * - Real-time monitoring dashboard data
 * - Integration with external monitoring services
 */

const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Error handling and logging configuration
const LOGGING_CONFIG = {
  LOG_LEVELS: {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    FATAL: 5
  },
  LOG_DESTINATIONS: {
    CONSOLE: true,
    FILE: true,
    DATABASE: true,
    EXTERNAL: false // Set to true for production monitoring
  },
  LOG_ROTATION: {
    MAX_SIZE_MB: 100,
    MAX_FILES: 10,
    COMPRESS_OLD: true
  },
  ERROR_CATEGORIES: [
    'DATABASE_ERROR',
    'VALIDATION_ERROR', 
    'NETWORK_ERROR',
    'FILE_ERROR',
    'BUSINESS_LOGIC_ERROR',
    'PERFORMANCE_ERROR',
    'SECURITY_ERROR',
    'CONFIGURATION_ERROR'
  ],
  PERFORMANCE_THRESHOLDS: {
    QUERY_TIME_MS: 1000,
    BATCH_SIZE_WARNING: 500,
    MEMORY_USAGE_MB: 512,
    ERROR_RATE_PERCENT: 5
  },
  RETRY_POLICIES: {
    DATABASE_RETRY: { attempts: 3, delay: 1000, backoff: 2.0 },
    FILE_RETRY: { attempts: 2, delay: 500, backoff: 1.5 },
    NETWORK_RETRY: { attempts: 5, delay: 2000, backoff: 1.8 }
  }
};

// Import configuration
const { CONFIG } = require('./batch-insert-reviews.js');

/**
 * Advanced Logger Class with multiple output destinations
 */
class TourReviewsLogger {
  constructor(options = {}) {
    this.logLevel = options.logLevel || LOGGING_CONFIG.LOG_LEVELS.INFO;
    this.component = options.component || 'TourReviews';
    this.sessionId = this.generateSessionId();
    this.logDirectory = options.logDirectory || 'logs';
    this.metricsCollector = new MetricsCollector();
    this.errorAnalyzer = new ErrorAnalyzer();
    
    this.initializeLogger();
  }
  
  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  async initializeLogger() {
    try {
      // Create log directory
      await fs.mkdir(this.logDirectory, { recursive: true });
      
      // Initialize log files
      this.logFiles = {
        main: path.join(this.logDirectory, 'tour-reviews.log'),
        error: path.join(this.logDirectory, 'tour-reviews-errors.log'),
        performance: path.join(this.logDirectory, 'tour-reviews-performance.log'),
        security: path.join(this.logDirectory, 'tour-reviews-security.log')
      };
      
      // Initialize database logging table if needed
      await this.initializeDatabaseLogging();
      
      // Start metrics collection
      this.metricsCollector.start();
      
    } catch (error) {
      console.error('Failed to initialize logger:', error);
    }
  }
  
  async initializeDatabaseLogging() {
    try {
      const supabase = this.getSupabaseClient();
      if (!supabase) return;
      
      // Check if logging table exists, create if not
      const { error } = await supabase
        .from('tour_review_logs')
        .select('id')
        .limit(1);
      
      if (error && error.code === 'PGRST116') {
        // Table doesn't exist, create it
        await this.createLogTable(supabase);
      }
    } catch (error) {
      console.error('Database logging initialization failed:', error);
    }
  }
  
  async createLogTable(supabase) {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS tour_review_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        level VARCHAR(10) NOT NULL,
        component VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        context JSONB,
        error_details JSONB,
        performance_data JSONB,
        user_id VARCHAR(100),
        request_id VARCHAR(100),
        trace_id VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_tour_review_logs_timestamp 
      ON tour_review_logs (timestamp DESC);
      
      CREATE INDEX IF NOT EXISTS idx_tour_review_logs_level 
      ON tour_review_logs (level, timestamp DESC);
      
      CREATE INDEX IF NOT EXISTS idx_tour_review_logs_component 
      ON tour_review_logs (component, timestamp DESC);
      
      CREATE INDEX IF NOT EXISTS idx_tour_review_logs_session 
      ON tour_review_logs (session_id, timestamp DESC);
    `;
    
    // Note: This would need to be executed through a database admin connection
    console.log('Database logging table creation query prepared');
  }
  
  getSupabaseClient() {
    try {
      if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_SERVICE_KEY) {
        return null;
      }
      return createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_KEY);
    } catch (error) {
      return null;
    }
  }
  
  // Core logging methods
  async log(level, message, context = {}, error = null) {
    const logEntry = this.createLogEntry(level, message, context, error);
    
    // Skip if log level is below threshold
    if (LOGGING_CONFIG.LOG_LEVELS[level] < this.logLevel) {
      return;
    }
    
    // Output to different destinations
    await Promise.all([
      this.logToConsole(logEntry),
      this.logToFile(logEntry),
      this.logToDatabase(logEntry),
      this.logToExternal(logEntry)
    ]);
    
    // Update metrics
    this.metricsCollector.recordLog(level, logEntry);
    
    // Analyze errors
    if (level === 'ERROR' || level === 'FATAL') {
      await this.errorAnalyzer.analyzeError(logEntry);
    }
    
    // Check for log rotation
    await this.checkLogRotation();
  }
  
  createLogEntry(level, message, context, error) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      sessionId: this.sessionId,
      component: this.component,
      message,
      context,
      pid: process.pid,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    };
    
    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code,
        category: this.categorizeError(error)
      };
    }
    
    return entry;
  }
  
  categorizeError(error) {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';
    
    if (message.includes('connection') || message.includes('network') || message.includes('timeout')) {
      return 'NETWORK_ERROR';
    }
    if (message.includes('permission') || message.includes('unauthorized') || message.includes('forbidden')) {
      return 'SECURITY_ERROR';
    }
    if (message.includes('validation') || message.includes('invalid') || message.includes('constraint')) {
      return 'VALIDATION_ERROR';
    }
    if (stack.includes('supabase') || message.includes('database') || message.includes('sql')) {
      return 'DATABASE_ERROR';
    }
    if (message.includes('file') || message.includes('enoent') || message.includes('eacces')) {
      return 'FILE_ERROR';
    }
    if (message.includes('memory') || message.includes('heap') || message.includes('performance')) {
      return 'PERFORMANCE_ERROR';
    }
    if (message.includes('config') || message.includes('environment') || message.includes('missing')) {
      return 'CONFIGURATION_ERROR';
    }
    
    return 'BUSINESS_LOGIC_ERROR';
  }
  
  async logToConsole(entry) {
    if (!LOGGING_CONFIG.LOG_DESTINATIONS.CONSOLE) return;
    
    const colors = {
      TRACE: '\x1b[37m', // White
      DEBUG: '\x1b[36m', // Cyan  
      INFO: '\x1b[32m',  // Green
      WARN: '\x1b[33m',  // Yellow
      ERROR: '\x1b[31m', // Red
      FATAL: '\x1b[35m'  // Magenta
    };
    
    const reset = '\x1b[0m';
    const color = colors[entry.level] || colors.INFO;
    
    const formattedMessage = `${color}[${entry.timestamp}] ${entry.level} [${entry.component}:${entry.sessionId.slice(-8)}] ${entry.message}${reset}`;
    
    console.log(formattedMessage);
    
    if (entry.context && Object.keys(entry.context).length > 0) {
      console.log('  Context:', entry.context);
    }
    
    if (entry.error) {
      console.error('  Error:', entry.error.message);
      if (entry.level === 'FATAL') {
        console.error('  Stack:', entry.error.stack);
      }
    }
  }
  
  async logToFile(entry) {
    if (!LOGGING_CONFIG.LOG_DESTINATIONS.FILE) return;
    
    try {
      const logLine = JSON.stringify(entry) + '\n';
      const logFile = this.determineLogFile(entry);
      
      await fs.appendFile(logFile, logLine);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }
  
  determineLogFile(entry) {
    if (entry.level === 'ERROR' || entry.level === 'FATAL') {
      return this.logFiles.error;
    }
    if (entry.context.performance || entry.context.timing) {
      return this.logFiles.performance;
    }
    if (entry.error?.category === 'SECURITY_ERROR') {
      return this.logFiles.security;
    }
    return this.logFiles.main;
  }
  
  async logToDatabase(entry) {
    if (!LOGGING_CONFIG.LOG_DESTINATIONS.DATABASE) return;
    
    try {
      const supabase = this.getSupabaseClient();
      if (!supabase) return;
      
      const { error } = await supabase
        .from('tour_review_logs')
        .insert({
          session_id: entry.sessionId,
          timestamp: entry.timestamp,
          level: entry.level,
          component: entry.component,
          message: entry.message,
          context: entry.context,
          error_details: entry.error,
          performance_data: {
            memory: entry.memory,
            uptime: entry.uptime,
            pid: entry.pid
          }
        });
      
      if (error) {
        console.error('Database logging failed:', error);
      }
    } catch (error) {
      console.error('Database logging exception:', error);
    }
  }
  
  async logToExternal(entry) {
    if (!LOGGING_CONFIG.LOG_DESTINATIONS.EXTERNAL) return;
    
    // Integration points for external services like:
    // - Sentry for error tracking
    // - DataDog for monitoring
    // - LogDNA for log aggregation
    // - Slack for critical alerts
    
    if (entry.level === 'FATAL' || entry.level === 'ERROR') {
      await this.sendCriticalAlert(entry);
    }
  }
  
  async sendCriticalAlert(entry) {
    // Placeholder for critical alert integration
    console.log(`CRITICAL ALERT: ${entry.message}`);
  }
  
  async checkLogRotation() {
    try {
      for (const [type, filePath] of Object.entries(this.logFiles)) {
        const stats = await fs.stat(filePath).catch(() => null);
        if (stats && stats.size > LOGGING_CONFIG.LOG_ROTATION.MAX_SIZE_MB * 1024 * 1024) {
          await this.rotateLogFile(filePath, type);
        }
      }
    } catch (error) {
      console.error('Log rotation failed:', error);
    }
  }
  
  async rotateLogFile(filePath, type) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const rotatedPath = `${filePath}.${timestamp}`;
    
    try {
      await fs.rename(filePath, rotatedPath);
      
      if (LOGGING_CONFIG.LOG_ROTATION.COMPRESS_OLD) {
        // Compress old log (would need zlib integration)
        console.log(`Log rotated: ${type} -> ${rotatedPath}`);
      }
      
      // Clean up old rotated files
      await this.cleanupOldLogs(path.dirname(filePath), type);
      
    } catch (error) {
      console.error(`Log rotation failed for ${type}:`, error);
    }
  }
  
  async cleanupOldLogs(directory, type) {
    try {
      const files = await fs.readdir(directory);
      const logFiles = files
        .filter(file => file.includes(`${type}.log.`))
        .map(file => ({
          name: file,
          path: path.join(directory, file),
          timestamp: file.split('.').pop()
        }))
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
      
      if (logFiles.length > LOGGING_CONFIG.LOG_ROTATION.MAX_FILES) {
        const filesToDelete = logFiles.slice(LOGGING_CONFIG.LOG_ROTATION.MAX_FILES);
        
        for (const file of filesToDelete) {
          await fs.unlink(file.path);
          console.log(`Deleted old log file: ${file.name}`);
        }
      }
    } catch (error) {
      console.error('Log cleanup failed:', error);
    }
  }
  
  // Convenience methods for different log levels
  trace(message, context = {}) { return this.log('TRACE', message, context); }
  debug(message, context = {}) { return this.log('DEBUG', message, context); }
  info(message, context = {}) { return this.log('INFO', message, context); }
  warn(message, context = {}) { return this.log('WARN', message, context); }
  error(message, context = {}, error = null) { return this.log('ERROR', message, context, error); }
  fatal(message, context = {}, error = null) { return this.log('FATAL', message, context, error); }
}

/**
 * Metrics Collection System
 */
class MetricsCollector {
  constructor() {
    this.metrics = {
      logs: { total: 0, byLevel: {} },
      errors: { total: 0, byCategory: {} },
      performance: { queries: [], operations: [] },
      system: { memory: [], cpu: [] }
    };
    
    this.startTime = Date.now();
  }
  
  start() {
    // Collect system metrics every 30 seconds
    this.metricsInterval = setInterval(() => {
      this.collectSystemMetrics();
    }, 30000);
  }
  
  stop() {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
  }
  
  recordLog(level, entry) {
    this.metrics.logs.total++;
    this.metrics.logs.byLevel[level] = (this.metrics.logs.byLevel[level] || 0) + 1;
    
    if (entry.error) {
      this.metrics.errors.total++;
      const category = entry.error.category || 'UNKNOWN';
      this.metrics.errors.byCategory[category] = (this.metrics.errors.byCategory[category] || 0) + 1;
    }
    
    if (entry.context.performance) {
      this.metrics.performance.operations.push({
        timestamp: Date.now(),
        operation: entry.context.operation,
        duration: entry.context.duration,
        success: !entry.error
      });
    }
  }
  
  collectSystemMetrics() {
    const memUsage = process.memoryUsage();
    this.metrics.system.memory.push({
      timestamp: Date.now(),
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      rss: memUsage.rss
    });
    
    // Keep only last 100 measurements
    if (this.metrics.system.memory.length > 100) {
      this.metrics.system.memory = this.metrics.system.memory.slice(-100);
    }
  }
  
  generateReport() {
    const uptime = Date.now() - this.startTime;
    const errorRate = this.metrics.logs.total > 0 ? 
      (this.metrics.errors.total / this.metrics.logs.total) * 100 : 0;
    
    return {
      uptime_ms: uptime,
      total_logs: this.metrics.logs.total,
      error_rate_percent: Math.round(errorRate * 100) / 100,
      logs_by_level: this.metrics.logs.byLevel,
      errors_by_category: this.metrics.errors.byCategory,
      recent_memory_mb: this.metrics.system.memory.length > 0 ? 
        Math.round(this.metrics.system.memory.slice(-1)[0].heapUsed / 1024 / 1024) : 0,
      performance_summary: {
        total_operations: this.metrics.performance.operations.length,
        avg_operation_time: this.calculateAverageOperationTime(),
        success_rate: this.calculateSuccessRate()
      }
    };
  }
  
  calculateAverageOperationTime() {
    if (this.metrics.performance.operations.length === 0) return 0;
    
    const total = this.metrics.performance.operations.reduce((sum, op) => sum + (op.duration || 0), 0);
    return Math.round(total / this.metrics.performance.operations.length);
  }
  
  calculateSuccessRate() {
    if (this.metrics.performance.operations.length === 0) return 100;
    
    const successful = this.metrics.performance.operations.filter(op => op.success).length;
    return Math.round((successful / this.metrics.performance.operations.length) * 100);
  }
}

/**
 * Error Analysis System
 */
class ErrorAnalyzer {
  constructor() {
    this.errorPatterns = new Map();
    this.recentErrors = [];
    this.errorTrends = {};
  }
  
  async analyzeError(logEntry) {
    if (!logEntry.error) return;
    
    const errorSignature = this.createErrorSignature(logEntry.error);
    
    // Track error patterns
    const existing = this.errorPatterns.get(errorSignature) || { count: 0, firstSeen: Date.now(), lastSeen: Date.now() };
    existing.count++;
    existing.lastSeen = Date.now();
    this.errorPatterns.set(errorSignature, existing);
    
    // Track recent errors
    this.recentErrors.push({
      timestamp: Date.now(),
      signature: errorSignature,
      category: logEntry.error.category,
      message: logEntry.error.message
    });
    
    // Keep only last 100 errors
    if (this.recentErrors.length > 100) {
      this.recentErrors = this.recentErrors.slice(-100);
    }
    
    // Check for error spikes
    await this.checkErrorSpikes();
    
    // Suggest solutions
    const solution = this.suggestSolution(logEntry.error);
    if (solution) {
      console.log(`ERROR SOLUTION SUGGESTED: ${solution}`);
    }
  }
  
  createErrorSignature(error) {
    // Create a unique signature for similar errors
    const normalizedMessage = error.message
      .replace(/\d+/g, 'NUM')
      .replace(/[a-f0-9-]{36}/g, 'UUID')
      .replace(/['"]/g, '')
      .toLowerCase();
    
    return `${error.category}:${normalizedMessage.substring(0, 100)}`;
  }
  
  async checkErrorSpikes() {
    const now = Date.now();
    const recentWindow = 5 * 60 * 1000; // 5 minutes
    const recentErrorCount = this.recentErrors.filter(e => now - e.timestamp < recentWindow).length;
    
    if (recentErrorCount > 10) {
      console.warn(`ERROR SPIKE DETECTED: ${recentErrorCount} errors in the last 5 minutes`);
    }
  }
  
  suggestSolution(error) {
    const category = error.category;
    const message = error.message.toLowerCase();
    
    const solutions = {
      'DATABASE_ERROR': {
        'connection': 'Check database connection settings and network connectivity',
        'timeout': 'Increase connection timeout or optimize query performance',
        'constraint': 'Validate data before insertion to avoid constraint violations',
        'permission': 'Verify database user permissions and RLS policies'
      },
      'VALIDATION_ERROR': {
        'required': 'Ensure all required fields are provided before processing',
        'invalid': 'Implement proper input validation and sanitization',
        'format': 'Check data format requirements and transform accordingly'
      },
      'NETWORK_ERROR': {
        'timeout': 'Implement retry logic with exponential backoff',
        'connection refused': 'Verify service availability and network configuration',
        'dns': 'Check DNS settings and service endpoints'
      },
      'FILE_ERROR': {
        'enoent': 'Verify file paths and ensure files exist before processing',
        'eacces': 'Check file permissions and user access rights',
        'emfile': 'Implement proper file handle management and cleanup'
      }
    };
    
    const categorysolutions = solutions[category];
    if (!categoryolutions) return null;
    
    for (const [keyword, solution] of Object.entries(categoryolutions)) {
      if (message.includes(keyword)) {
        return solution;
      }
    }
    
    return null;
  }
  
  generateErrorReport() {
    const topErrors = Array.from(this.errorPatterns.entries())
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 10)
      .map(([signature, data]) => ({
        signature: signature.substring(0, 80),
        count: data.count,
        firstSeen: new Date(data.firstSeen).toISOString(),
        lastSeen: new Date(data.lastSeen).toISOString()
      }));
    
    const errorsByCategory = this.recentErrors.reduce((acc, error) => {
      acc[error.category] = (acc[error.category] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalUniqueErrors: this.errorPatterns.size,
      topErrors,
      recentErrorsByCategory: errorsByCategory,
      recentErrorCount: this.recentErrors.length
    };
  }
}

/**
 * Retry Handler with configurable policies
 */
class RetryHandler {
  static async executeWithRetry(operation, policy, context = {}) {
    let lastError;
    
    for (let attempt = 1; attempt <= policy.attempts; attempt++) {
      try {
        const startTime = Date.now();
        const result = await operation();
        const duration = Date.now() - startTime;
        
        // Log successful operation
        if (global.logger) {
          await global.logger.debug('Operation succeeded', {
            ...context,
            attempt,
            duration,
            operation: 'retry_success'
          });
        }
        
        return result;
        
      } catch (error) {
        lastError = error;
        
        if (global.logger) {
          await global.logger.warn('Operation failed, retrying', {
            ...context,
            attempt,
            totalAttempts: policy.attempts,
            error: error.message,
            operation: 'retry_attempt'
          });
        }
        
        if (attempt < policy.attempts) {
          const delay = policy.delay * Math.pow(policy.backoff, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // All attempts failed
    if (global.logger) {
      await global.logger.error('All retry attempts failed', {
        ...context,
        totalAttempts: policy.attempts,
        operation: 'retry_exhausted'
      }, lastError);
    }
    
    throw lastError;
  }
}

// Global logger instance
let globalLogger = null;

/**
 * Initialize global logger
 */
async function initializeGlobalLogger(options = {}) {
  globalLogger = new TourReviewsLogger(options);
  global.logger = globalLogger;
  
  // Set up process error handlers
  process.on('uncaughtException', async (error) => {
    await globalLogger.fatal('Uncaught exception', { operation: 'uncaught_exception' }, error);
    process.exit(1);
  });
  
  process.on('unhandledRejection', async (reason, promise) => {
    await globalLogger.fatal('Unhandled promise rejection', { 
      operation: 'unhandled_rejection',
      promise: promise.toString()
    }, reason);
    process.exit(1);
  });
  
  return globalLogger;
}

/**
 * Performance monitoring wrapper
 */
function monitorPerformance(operationName) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args) {
      const startTime = Date.now();
      let success = true;
      let error = null;
      
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (err) {
        success = false;
        error = err;
        throw err;
      } finally {
        const duration = Date.now() - startTime;
        
        if (global.logger) {
          const level = success ? 'INFO' : 'ERROR';
          const message = `Operation ${operationName} ${success ? 'completed' : 'failed'}`;
          
          global.logger.log(level, message, {
            operation: operationName,
            duration,
            success,
            performance: true
          }, error);
        }
        
        // Check performance thresholds
        if (duration > LOGGING_CONFIG.PERFORMANCE_THRESHOLDS.QUERY_TIME_MS) {
          console.warn(`SLOW OPERATION: ${operationName} took ${duration}ms`);
        }
      }
    };
    
    return descriptor;
  };
}

// Export all components
module.exports = {
  TourReviewsLogger,
  MetricsCollector,
  ErrorAnalyzer,
  RetryHandler,
  initializeGlobalLogger,
  monitorPerformance,
  LOGGING_CONFIG
};

// CLI interface for testing
if (require.main === module) {
  (async () => {
    const logger = await initializeGlobalLogger({ component: 'ErrorHandlerTest' });
    
    // Test all log levels
    await logger.trace('Trace message for debugging');
    await logger.debug('Debug information');
    await logger.info('General information');
    await logger.warn('Warning message');
    await logger.error('Error occurred', { context: 'test' }, new Error('Test error'));
    
    // Test performance monitoring
    const testOperation = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return 'success';
    };
    
    const result = await RetryHandler.executeWithRetry(
      testOperation,
      LOGGING_CONFIG.RETRY_POLICIES.DATABASE_RETRY,
      { operation: 'test_operation' }
    );
    
    // Generate metrics report
    const report = logger.metricsCollector.generateReport();
    console.log('Metrics Report:', JSON.stringify(report, null, 2));
    
    // Generate error report
    const errorReport = logger.errorAnalyzer.generateErrorReport();
    console.log('Error Report:', JSON.stringify(errorReport, null, 2));
    
    console.log('Error handling system test completed');
    process.exit(0);
  })();
}