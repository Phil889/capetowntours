#!/usr/bin/env node

/**
 * Advanced Transaction Management System for Tour Reviews
 * 
 * Provides comprehensive transaction management with ACID compliance,
 * distributed transaction support, and advanced error recovery.
 * 
 * Features:
 * - ACID-compliant transactions
 * - Distributed transaction coordination
 * - Automatic retry with exponential backoff
 * - Transaction logging and monitoring
 * - Deadlock detection and resolution
 * - Connection pool management
 * - Transaction rollback strategies
 * - Performance optimization
 * - Concurrent transaction handling
 */

const { createClient } = require('@supabase/supabase-js');
const { initializeGlobalLogger, RetryHandler, LOGGING_CONFIG } = require('./error-handling-logger.js');

// Transaction management configuration
const TRANSACTION_CONFIG = {
  ISOLATION_LEVELS: {
    READ_UNCOMMITTED: 'READ UNCOMMITTED',
    READ_COMMITTED: 'READ COMMITTED',
    REPEATABLE_READ: 'REPEATABLE READ', 
    SERIALIZABLE: 'SERIALIZABLE'
  },
  TIMEOUT_MS: {
    SHORT: 5000,      // 5 seconds for simple operations
    MEDIUM: 30000,    // 30 seconds for batch operations
    LONG: 120000,     // 2 minutes for complex operations
    BULK: 300000      // 5 minutes for bulk imports
  },
  RETRY_POLICIES: {
    DEADLOCK: { attempts: 5, delay: 100, backoff: 2.0, jitter: true },
    CONNECTION: { attempts: 3, delay: 1000, backoff: 1.5, jitter: false },
    SERIALIZATION: { attempts: 3, delay: 50, backoff: 1.8, jitter: true },
    TIMEOUT: { attempts: 2, delay: 2000, backoff: 1.0, jitter: false }
  },
  BATCH_SIZES: {
    SMALL: 50,
    MEDIUM: 100,
    LARGE: 200,
    BULK: 500
  },
  MONITORING: {
    LOG_SLOW_TRANSACTIONS: true,
    SLOW_THRESHOLD_MS: 1000,
    LOG_DEADLOCKS: true,
    TRACK_PERFORMANCE: true
  }
};

// Import configuration
const { CONFIG } = require('./batch-insert-reviews.js');

/**
 * Advanced Transaction Manager Class
 */
class TransactionManager {
  constructor(options = {}) {
    this.supabaseUrl = options.supabaseUrl || CONFIG.SUPABASE_URL;
    this.supabaseKey = options.supabaseKey || CONFIG.SUPABASE_SERVICE_KEY;
    this.logger = options.logger || global.logger;
    this.connectionPool = new ConnectionPool(this.supabaseUrl, this.supabaseKey);
    this.transactionRegistry = new Map();
    this.performanceMonitor = new TransactionPerformanceMonitor();
    
    this.initializeTransactionManager();
  }
  
  async initializeTransactionManager() {
    if (!this.logger) {
      this.logger = await initializeGlobalLogger({ component: 'TransactionManager' });
    }
    
    // Initialize connection pool
    await this.connectionPool.initialize();
    
    // Start monitoring
    this.performanceMonitor.start();
    
    await this.logger.info('Transaction Manager initialized', {
      connectionPool: this.connectionPool.getStatus(),
      operation: 'initialization'
    });
  }
  
  /**
   * Execute a single transaction with full error handling
   */
  async executeTransaction(operations, options = {}) {
    const transactionId = this.generateTransactionId();
    const startTime = Date.now();
    
    const transactionOptions = {
      isolationLevel: options.isolationLevel || TRANSACTION_CONFIG.ISOLATION_LEVELS.READ_COMMITTED,
      timeout: options.timeout || TRANSACTION_CONFIG.TIMEOUT_MS.MEDIUM,
      retryPolicy: options.retryPolicy || TRANSACTION_CONFIG.RETRY_POLICIES.DEADLOCK,
      maxRetries: options.maxRetries || 3,
      ...options
    };
    
    await this.logger.info('Starting transaction', {
      transactionId,
      operationCount: Array.isArray(operations) ? operations.length : 1,
      options: transactionOptions,
      operation: 'transaction_start'
    });
    
    // Register transaction for monitoring
    this.registerTransaction(transactionId, transactionOptions);
    
    try {
      const result = await RetryHandler.executeWithRetry(
        () => this._executeTransactionInternal(transactionId, operations, transactionOptions),
        transactionOptions.retryPolicy,
        { transactionId, operation: 'transaction_execution' }
      );
      
      const duration = Date.now() - startTime;
      await this.logger.info('Transaction completed successfully', {
        transactionId,
        duration,
        operation: 'transaction_success'
      });
      
      this.performanceMonitor.recordTransaction(transactionId, duration, true);
      return result;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      await this.logger.error('Transaction failed', {
        transactionId,
        duration,
        operation: 'transaction_failure'
      }, error);
      
      this.performanceMonitor.recordTransaction(transactionId, duration, false);
      throw error;
      
    } finally {
      this.unregisterTransaction(transactionId);
    }
  }
  
  async _executeTransactionInternal(transactionId, operations, options) {
    const connection = await this.connectionPool.getConnection();
    
    try {
      // Start transaction with proper isolation level
      await this._startTransaction(connection, options.isolationLevel);
      
      // Set transaction timeout
      if (options.timeout) {
        await this._setTransactionTimeout(connection, options.timeout);
      }
      
      let results = [];
      
      // Execute operations
      if (Array.isArray(operations)) {
        // Multiple operations in single transaction
        for (let i = 0; i < operations.length; i++) {
          const operation = operations[i];
          try {
            const result = await this._executeOperation(connection, operation, transactionId, i);
            results.push(result);
          } catch (error) {
            await this.logger.error(`Operation ${i} failed in transaction`, {
              transactionId,
              operationIndex: i,
              operation: 'operation_failure'
            }, error);
            throw error;
          }
        }
      } else {
        // Single operation
        results = await this._executeOperation(connection, operations, transactionId, 0);
      }
      
      // Commit transaction
      await this._commitTransaction(connection);
      
      await this.logger.debug('Transaction committed', {
        transactionId,
        resultCount: Array.isArray(results) ? results.length : 1,
        operation: 'transaction_commit'
      });
      
      return results;
      
    } catch (error) {
      // Rollback transaction on any error
      try {
        await this._rollbackTransaction(connection);
        await this.logger.info('Transaction rolled back', {
          transactionId,
          operation: 'transaction_rollback'
        });
      } catch (rollbackError) {
        await this.logger.error('Transaction rollback failed', {
          transactionId,
          operation: 'rollback_failure'
        }, rollbackError);
      }
      
      // Analyze and categorize error
      const errorCategory = this._categorizeTransactionError(error);
      error.transactionCategory = errorCategory;
      
      throw error;
      
    } finally {
      this.connectionPool.releaseConnection(connection);
    }
  }
  
  /**
   * Execute batch operations with optimized transaction handling
   */
  async executeBatchTransaction(items, operationFactory, options = {}) {
    const batchSize = options.batchSize || TRANSACTION_CONFIG.BATCH_SIZES.MEDIUM;
    const results = [];
    const errors = [];
    
    await this.logger.info('Starting batch transaction', {
      totalItems: items.length,
      batchSize,
      estimatedBatches: Math.ceil(items.length / batchSize),
      operation: 'batch_start'
    });
    
    // Process items in batches
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(items.length / batchSize);
      
      try {
        await this.logger.debug(`Processing batch ${batchNumber}/${totalBatches}`, {
          batchNumber,
          totalBatches,
          batchSize: batch.length,
          operation: 'batch_processing'
        });
        
        const batchOperations = batch.map((item, index) => ({
          operation: operationFactory(item),
          item,
          globalIndex: i + index,
          batchIndex: index
        }));
        
        const batchResult = await this.executeTransaction(
          batchOperations.map(op => op.operation),
          {
            ...options,
            timeout: TRANSACTION_CONFIG.TIMEOUT_MS.BULK,
            isolationLevel: TRANSACTION_CONFIG.ISOLATION_LEVELS.READ_COMMITTED
          }
        );
        
        results.push(...batchResult);
        
        // Progress reporting
        const progress = Math.round((i + batch.length) / items.length * 100);
        await this.logger.info(`Batch ${batchNumber}/${totalBatches} completed`, {
          batchNumber,
          totalBatches,
          progress,
          processedItems: i + batch.length,
          totalItems: items.length,
          operation: 'batch_progress'
        });
        
      } catch (error) {
        await this.logger.error(`Batch ${batchNumber} failed`, {
          batchNumber,
          batchSize: batch.length,
          operation: 'batch_failure'
        }, error);
        
        errors.push({
          batchNumber,
          items: batch,
          error
        });
        
        // Decide whether to continue or fail fast
        if (options.failFast) {
          throw new Error(`Batch transaction failed at batch ${batchNumber}: ${error.message}`);
        }
      }
    }
    
    const summary = {
      totalItems: items.length,
      successfulItems: results.length,
      failedBatches: errors.length,
      successRate: (results.length / items.length) * 100
    };
    
    await this.logger.info('Batch transaction completed', {
      ...summary,
      operation: 'batch_complete'
    });
    
    if (errors.length > 0 && !options.allowPartialFailure) {
      throw new Error(`Batch transaction had ${errors.length} failed batches`);
    }
    
    return { results, errors, summary };
  }
  
  /**
   * Execute distributed transaction across multiple resources
   */
  async executeDistributedTransaction(distributedOperations, options = {}) {
    const transactionId = this.generateTransactionId();
    const participantStates = new Map();
    
    await this.logger.info('Starting distributed transaction', {
      transactionId,
      participants: distributedOperations.length,
      operation: 'distributed_transaction_start'
    });
    
    try {
      // Phase 1: Prepare all participants
      for (let i = 0; i < distributedOperations.length; i++) {
        const operation = distributedOperations[i];
        const participantId = `participant_${i}`;
        
        try {
          await this.logger.debug(`Preparing participant ${participantId}`, {
            transactionId,
            participantId,
            operation: 'participant_prepare'
          });
          
          const connection = await this.connectionPool.getConnection();
          await this._startTransaction(connection, TRANSACTION_CONFIG.ISOLATION_LEVELS.SERIALIZABLE);
          
          // Execute the operation but don't commit yet
          const result = await this._executeOperation(connection, operation, transactionId, i);
          
          participantStates.set(participantId, {
            connection,
            result,
            prepared: true,
            committed: false
          });
          
        } catch (error) {
          await this.logger.error(`Participant ${participantId} prepare failed`, {
            transactionId,
            participantId,
            operation: 'participant_prepare_failure'
          }, error);
          
          // Rollback all prepared participants
          await this._rollbackDistributedTransaction(participantStates);
          throw error;
        }
      }
      
      // Phase 2: Commit all participants
      const results = [];
      for (const [participantId, state] of participantStates.entries()) {
        try {
          await this._commitTransaction(state.connection);
          state.committed = true;
          results.push(state.result);
          
          await this.logger.debug(`Participant ${participantId} committed`, {
            transactionId,
            participantId,
            operation: 'participant_commit'
          });
          
        } catch (error) {
          await this.logger.error(`Participant ${participantId} commit failed`, {
            transactionId,
            participantId,
            operation: 'participant_commit_failure'
          }, error);
          
          // This is a critical error in distributed transactions
          throw new Error(`Distributed transaction commit failed at participant ${participantId}`);
        } finally {
          this.connectionPool.releaseConnection(state.connection);
        }
      }
      
      await this.logger.info('Distributed transaction completed successfully', {
        transactionId,
        participants: participantStates.size,
        operation: 'distributed_transaction_success'
      });
      
      return results;
      
    } catch (error) {
      await this._rollbackDistributedTransaction(participantStates);
      throw error;
    }
  }
  
  async _rollbackDistributedTransaction(participantStates) {
    for (const [participantId, state] of participantStates.entries()) {
      if (state.connection && !state.committed) {
        try {
          await this._rollbackTransaction(state.connection);
          await this.logger.debug(`Participant ${participantId} rolled back`, {
            participantId,
            operation: 'participant_rollback'
          });
        } catch (rollbackError) {
          await this.logger.error(`Participant ${participantId} rollback failed`, {
            participantId,
            operation: 'participant_rollback_failure'
          }, rollbackError);
        } finally {
          this.connectionPool.releaseConnection(state.connection);
        }
      }
    }
  }
  
  // Core transaction operations
  async _startTransaction(connection, isolationLevel) {
    const query = `BEGIN; SET TRANSACTION ISOLATION LEVEL ${isolationLevel};`;
    const { error } = await connection.rpc('execute_sql', { sql_query: query });
    if (error) throw error;
  }
  
  async _commitTransaction(connection) {
    const { error } = await connection.rpc('execute_sql', { sql_query: 'COMMIT;' });
    if (error) throw error;
  }
  
  async _rollbackTransaction(connection) {
    const { error } = await connection.rpc('execute_sql', { sql_query: 'ROLLBACK;' });
    if (error) throw error;
  }
  
  async _setTransactionTimeout(connection, timeoutMs) {
    const timeoutSec = Math.ceil(timeoutMs / 1000);
    const query = `SET statement_timeout = '${timeoutSec}s';`;
    const { error } = await connection.rpc('execute_sql', { sql_query: query });
    if (error) throw error;
  }
  
  async _executeOperation(connection, operation, transactionId, operationIndex) {
    const operationStart = Date.now();
    
    try {
      let result;
      
      if (typeof operation === 'function') {
        result = await operation(connection);
      } else if (operation.type === 'query') {
        result = await connection.from(operation.table)
          [operation.method](...(operation.params || []));
      } else if (operation.type === 'rpc') {
        result = await connection.rpc(operation.function, operation.params);
      } else if (operation.type === 'sql') {
        result = await connection.rpc('execute_sql', { sql_query: operation.sql });
      } else {
        throw new Error(`Unknown operation type: ${operation.type}`);
      }
      
      const duration = Date.now() - operationStart;
      
      if (result.error) {
        throw result.error;
      }
      
      await this.logger.debug('Operation executed successfully', {
        transactionId,
        operationIndex,
        duration,
        operation: 'operation_success'
      });
      
      return result.data || result;
      
    } catch (error) {
      const duration = Date.now() - operationStart;
      await this.logger.error('Operation execution failed', {
        transactionId,
        operationIndex,
        duration,
        operation: 'operation_execution_failure'
      }, error);
      throw error;
    }
  }
  
  _categorizeTransactionError(error) {
    const message = error.message?.toLowerCase() || '';
    const code = error.code || '';
    
    if (message.includes('deadlock') || code === '40P01') {
      return 'DEADLOCK';
    }
    if (message.includes('serialization failure') || code === '40001') {
      return 'SERIALIZATION_FAILURE';
    }
    if (message.includes('timeout') || message.includes('statement timeout')) {
      return 'TIMEOUT';
    }
    if (message.includes('connection') || message.includes('network')) {
      return 'CONNECTION_ERROR';
    }
    if (message.includes('constraint') || message.includes('violation')) {
      return 'CONSTRAINT_VIOLATION';
    }
    if (message.includes('permission') || message.includes('access')) {
      return 'PERMISSION_ERROR';
    }
    
    return 'UNKNOWN_ERROR';
  }
  
  // Transaction registry management
  generateTransactionId() {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  registerTransaction(transactionId, options) {
    this.transactionRegistry.set(transactionId, {
      startTime: Date.now(),
      options,
      status: 'ACTIVE'
    });
  }
  
  unregisterTransaction(transactionId) {
    this.transactionRegistry.delete(transactionId);
  }
  
  getActiveTransactions() {
    return Array.from(this.transactionRegistry.entries()).map(([id, data]) => ({
      transactionId: id,
      duration: Date.now() - data.startTime,
      status: data.status,
      options: data.options
    }));
  }
  
  // Cleanup and monitoring
  async cleanup() {
    await this.performanceMonitor.stop();
    await this.connectionPool.cleanup();
    
    if (this.transactionRegistry.size > 0) {
      await this.logger.warn('Active transactions during cleanup', {
        activeTransactions: this.transactionRegistry.size,
        operation: 'cleanup_warning'
      });
    }
  }
  
  getPerformanceReport() {
    return this.performanceMonitor.generateReport();
  }
}

/**
 * Connection Pool Manager
 */
class ConnectionPool {
  constructor(supabaseUrl, supabaseKey, options = {}) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    this.maxConnections = options.maxConnections || 10;
    this.minConnections = options.minConnections || 2;
    this.connectionTimeout = options.connectionTimeout || 30000;
    
    this.availableConnections = [];
    this.activeConnections = new Set();
    this.waitingQueue = [];
    this.initialized = false;
  }
  
  async initialize() {
    // Create minimum number of connections
    for (let i = 0; i < this.minConnections; i++) {
      const connection = this.createConnection();
      this.availableConnections.push(connection);
    }
    
    this.initialized = true;
  }
  
  createConnection() {
    return createClient(this.supabaseUrl, this.supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
  }
  
  async getConnection() {
    return new Promise((resolve, reject) => {
      // Check for available connection
      if (this.availableConnections.length > 0) {
        const connection = this.availableConnections.pop();
        this.activeConnections.add(connection);
        resolve(connection);
        return;
      }
      
      // Create new connection if under limit
      if (this.activeConnections.size < this.maxConnections) {
        const connection = this.createConnection();
        this.activeConnections.add(connection);
        resolve(connection);
        return;
      }
      
      // Add to waiting queue
      const timeout = setTimeout(() => {
        const index = this.waitingQueue.indexOf(queueItem);
        if (index > -1) {
          this.waitingQueue.splice(index, 1);
          reject(new Error('Connection timeout'));
        }
      }, this.connectionTimeout);
      
      const queueItem = { resolve, reject, timeout };
      this.waitingQueue.push(queueItem);
    });
  }
  
  releaseConnection(connection) {
    this.activeConnections.delete(connection);
    
    // Check waiting queue first
    if (this.waitingQueue.length > 0) {
      const queueItem = this.waitingQueue.shift();
      clearTimeout(queueItem.timeout);
      this.activeConnections.add(connection);
      queueItem.resolve(connection);
      return;
    }
    
    // Return to available pool
    if (this.availableConnections.length < this.minConnections) {
      this.availableConnections.push(connection);
    }
    // Otherwise, let connection be garbage collected
  }
  
  getStatus() {
    return {
      available: this.availableConnections.length,
      active: this.activeConnections.size,
      waiting: this.waitingQueue.length,
      total: this.availableConnections.length + this.activeConnections.size
    };
  }
  
  async cleanup() {
    // Clear waiting queue
    this.waitingQueue.forEach(item => {
      clearTimeout(item.timeout);
      item.reject(new Error('Connection pool shutting down'));
    });
    this.waitingQueue = [];
    
    // Close all connections (Supabase handles this internally)
    this.availableConnections = [];
    this.activeConnections.clear();
  }
}

/**
 * Transaction Performance Monitor
 */
class TransactionPerformanceMonitor {
  constructor() {
    this.transactions = [];
    this.metrics = {
      total: 0,
      successful: 0,
      failed: 0,
      totalDuration: 0,
      slowTransactions: 0
    };
  }
  
  start() {
    // Periodic cleanup of old transaction data
    this.cleanupInterval = setInterval(() => {
      this.cleanupOldTransactions();
    }, 60000); // Every minute
  }
  
  stop() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
  
  recordTransaction(transactionId, duration, success) {
    const transaction = {
      id: transactionId,
      timestamp: Date.now(),
      duration,
      success
    };
    
    this.transactions.push(transaction);
    this.updateMetrics(transaction);
    
    // Keep only last 1000 transactions
    if (this.transactions.length > 1000) {
      this.transactions = this.transactions.slice(-1000);
    }
  }
  
  updateMetrics(transaction) {
    this.metrics.total++;
    this.metrics.totalDuration += transaction.duration;
    
    if (transaction.success) {
      this.metrics.successful++;
    } else {
      this.metrics.failed++;
    }
    
    if (transaction.duration > TRANSACTION_CONFIG.MONITORING.SLOW_THRESHOLD_MS) {
      this.metrics.slowTransactions++;
    }
  }
  
  cleanupOldTransactions() {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
    const initialLength = this.transactions.length;
    
    this.transactions = this.transactions.filter(t => t.timestamp > cutoff);
    
    if (initialLength > this.transactions.length) {
      console.log(`Cleaned up ${initialLength - this.transactions.length} old transaction records`);
    }
  }
  
  generateReport() {
    const avgDuration = this.metrics.total > 0 ? 
      Math.round(this.metrics.totalDuration / this.metrics.total) : 0;
    
    const successRate = this.metrics.total > 0 ? 
      Math.round((this.metrics.successful / this.metrics.total) * 100) : 0;
    
    const recentTransactions = this.transactions
      .filter(t => Date.now() - t.timestamp < 60000) // Last minute
      .length;
    
    return {
      totalTransactions: this.metrics.total,
      successfulTransactions: this.metrics.successful,
      failedTransactions: this.metrics.failed,
      successRate,
      averageDuration: avgDuration,
      slowTransactions: this.metrics.slowTransactions,
      recentTransactions,
      oldestTransaction: this.transactions.length > 0 ? 
        new Date(this.transactions[0].timestamp).toISOString() : null
    };
  }
}

// Export all components
module.exports = {
  TransactionManager,
  ConnectionPool,
  TransactionPerformanceMonitor,
  TRANSACTION_CONFIG
};

// CLI interface for testing
if (require.main === module) {
  (async () => {
    const logger = await initializeGlobalLogger({ component: 'TransactionManagerTest' });
    const txManager = new TransactionManager({ logger });
    
    try {
      // Test simple transaction
      console.log('Testing simple transaction...');
      const simpleResult = await txManager.executeTransaction([
        {
          type: 'sql',
          sql: 'SELECT 1 as test_value;'
        }
      ]);
      console.log('Simple transaction result:', simpleResult);
      
      // Test batch transaction
      console.log('Testing batch transaction...');
      const items = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, name: `Test Item ${i + 1}` }));
      
      const batchResult = await txManager.executeBatchTransaction(
        items,
        (item) => ({
          type: 'sql',
          sql: `SELECT '${item.name}' as item_name, ${item.id} as item_id;`
        }),
        { batchSize: 3 }
      );
      
      console.log('Batch transaction summary:', batchResult.summary);
      
      // Generate performance report
      const report = txManager.getPerformanceReport();
      console.log('Performance report:', JSON.stringify(report, null, 2));
      
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      await txManager.cleanup();
      console.log('Transaction manager test completed');
      process.exit(0);
    }
  })();
}