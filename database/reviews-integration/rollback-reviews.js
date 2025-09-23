#!/usr/bin/env node

/**
 * Tour Reviews Rollback System
 * 
 * Provides comprehensive rollback capabilities for the tour reviews system.
 * Can restore the database to a previous state in case of issues.
 * 
 * Features:
 * - Complete table backup before operations
 * - Selective rollback by date range
 * - Rollback by batch operation
 * - Data integrity verification
 * - Automatic backup management
 * - Recovery validation
 */

const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Import configuration
const { CONFIG } = require('./batch-insert-reviews.js');

// Rollback configuration
const ROLLBACK_CONFIG = {
  BACKUP_DIR: 'backups',
  MAX_BACKUPS: 10, // Keep last 10 backups
  BATCH_SIZE: 100,
  VERIFICATION_SAMPLE_SIZE: 50,
  ALLOWED_OPERATIONS: ['full_rollback', 'selective_rollback', 'backup_only'],
  BACKUP_FILENAME_FORMAT: 'tour_reviews_backup_{timestamp}.json'
};

// Initialize Supabase client with service role
function initializeSupabase() {
  if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_SERVICE_KEY) {
    throw new Error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  }
  
  return createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Logging utilities
async function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${level}: ${message}`;
  console.log(logEntry);
  
  try {
    await fs.appendFile('rollback-log.txt', logEntry + '\n');
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

async function logError(message, error = null) {
  const timestamp = new Date().toISOString();
  const errorEntry = `[${timestamp}] ERROR: ${message}${error ? `\nStack: ${error.stack}` : ''}`;
  console.error(errorEntry);
  
  try {
    await fs.appendFile('rollback-errors.txt', errorEntry + '\n\n');
  } catch (writeError) {
    console.error('Failed to write to error file:', writeError);
  }
}

// Backup management functions
async function ensureBackupDirectory() {
  try {
    await fs.mkdir(ROLLBACK_CONFIG.BACKUP_DIR, { recursive: true });
  } catch (error) {
    await logError('Failed to create backup directory', error);
    throw error;
  }
}

async function generateBackupFilename() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return ROLLBACK_CONFIG.BACKUP_FILENAME_FORMAT.replace('{timestamp}', timestamp);
}

async function createFullBackup(supabase) {
  await log('Creating full backup of tour_reviews table');
  
  try {
    // Fetch all data
    const { data: reviews, error } = await supabase
      .from('tour_reviews')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      throw new Error(`Failed to fetch reviews for backup: ${error.message}`);
    }
    
    // Prepare backup metadata
    const backup = {
      metadata: {
        timestamp: new Date().toISOString(),
        total_records: reviews?.length || 0,
        table: 'tour_reviews',
        backup_type: 'full',
        schema_version: '1.0',
        supabase_url: CONFIG.SUPABASE_URL
      },
      data: reviews || []
    };
    
    // Save backup
    await ensureBackupDirectory();
    const filename = await generateBackupFilename();
    const filepath = path.join(ROLLBACK_CONFIG.BACKUP_DIR, filename);
    
    await fs.writeFile(filepath, JSON.stringify(backup, null, 2));
    
    await log(`Backup created successfully: ${filename} (${backup.metadata.total_records} records)`);
    
    // Clean up old backups
    await cleanupOldBackups();
    
    return { filepath, filename, recordCount: backup.metadata.total_records };
    
  } catch (error) {
    await logError('Failed to create backup', error);
    throw error;
  }
}

async function cleanupOldBackups() {
  try {
    const files = await fs.readdir(ROLLBACK_CONFIG.BACKUP_DIR);
    const backupFiles = files
      .filter(file => file.startsWith('tour_reviews_backup_') && file.endsWith('.json'))
      .map(file => ({
        name: file,
        path: path.join(ROLLBACK_CONFIG.BACKUP_DIR, file),
        timestamp: file.match(/tour_reviews_backup_(.+)\.json/)[1]
      }))
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp)); // Newest first
    
    if (backupFiles.length > ROLLBACK_CONFIG.MAX_BACKUPS) {
      const filesToDelete = backupFiles.slice(ROLLBACK_CONFIG.MAX_BACKUPS);
      
      for (const file of filesToDelete) {
        await fs.unlink(file.path);
        await log(`Deleted old backup: ${file.name}`);
      }
    }
  } catch (error) {
    await logError('Failed to cleanup old backups', error);
  }
}

// Rollback operations
async function performFullRollback(supabase, backupFile) {
  await log(`Starting full rollback from backup: ${backupFile}`);
  
  try {
    // Load backup data
    const backupPath = path.join(ROLLBACK_CONFIG.BACKUP_DIR, backupFile);
    const backupContent = await fs.readFile(backupPath, 'utf8');
    const backup = JSON.parse(backupContent);
    
    if (!backup.metadata || !backup.data) {
      throw new Error('Invalid backup file format');
    }
    
    await log(`Loaded backup with ${backup.data.length} records from ${backup.metadata.timestamp}`);
    
    // Create a new backup before rollback
    const preRollbackBackup = await createFullBackup(supabase);
    await log(`Pre-rollback backup created: ${preRollbackBackup.filename}`);
    
    // Clear current data
    await log('Clearing current tour_reviews data');
    const { error: deleteError } = await supabase
      .from('tour_reviews')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (deleteError) {
      throw new Error(`Failed to clear existing data: ${deleteError.message}`);
    }
    
    // Restore data in batches
    const totalRecords = backup.data.length;
    const totalBatches = Math.ceil(totalRecords / ROLLBACK_CONFIG.BATCH_SIZE);
    
    await log(`Restoring ${totalRecords} records in ${totalBatches} batches`);
    
    for (let i = 0; i < totalBatches; i++) {
      const start = i * ROLLBACK_CONFIG.BATCH_SIZE;
      const end = Math.min(start + ROLLBACK_CONFIG.BATCH_SIZE, totalRecords);
      const batch = backup.data.slice(start, end);
      
      const { error: insertError } = await supabase
        .from('tour_reviews')
        .insert(batch);
      
      if (insertError) {
        throw new Error(`Failed to insert batch ${i + 1}: ${insertError.message}`);
      }
      
      const progress = Math.round(((i + 1) / totalBatches) * 100);
      await log(`Restored batch ${i + 1}/${totalBatches} (${progress}%)`);
    }
    
    await log('Full rollback completed successfully');
    
    // Verify the rollback
    await verifyRollback(supabase, backup);
    
    return { success: true, recordsRestored: totalRecords };
    
  } catch (error) {
    await logError('Full rollback failed', error);
    throw error;
  }
}

async function performSelectiveRollback(supabase, criteria) {
  await log('Starting selective rollback');
  
  try {
    let query = supabase.from('tour_reviews').select('*');
    
    // Apply criteria
    if (criteria.after_date) {
      query = query.gte('created_at', criteria.after_date);
    }
    
    if (criteria.before_date) {
      query = query.lte('created_at', criteria.before_date);
    }
    
    if (criteria.tour_slugs && criteria.tour_slugs.length > 0) {
      query = query.in('tour_slug', criteria.tour_slugs);
    }
    
    if (criteria.languages && criteria.languages.length > 0) {
      query = query.in('language', criteria.languages);
    }
    
    // Fetch records to be deleted
    const { data: recordsToDelete, error: fetchError } = await query;
    
    if (fetchError) {
      throw new Error(`Failed to fetch records for selective rollback: ${fetchError.message}`);
    }
    
    if (!recordsToDelete || recordsToDelete.length === 0) {
      await log('No records found matching rollback criteria');
      return { success: true, recordsDeleted: 0 };
    }
    
    await log(`Found ${recordsToDelete.length} records matching rollback criteria`);
    
    // Create backup of records to be deleted
    const backupData = {
      metadata: {
        timestamp: new Date().toISOString(),
        total_records: recordsToDelete.length,
        rollback_criteria: criteria,
        backup_type: 'selective_rollback'
      },
      data: recordsToDelete
    };
    
    const backupFilename = `selective_rollback_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    const backupPath = path.join(ROLLBACK_CONFIG.BACKUP_DIR, backupFilename);
    
    await ensureBackupDirectory();
    await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2));
    await log(`Selective rollback backup created: ${backupFilename}`);
    
    // Delete records in batches
    const recordIds = recordsToDelete.map(record => record.id);
    const totalBatches = Math.ceil(recordIds.length / ROLLBACK_CONFIG.BATCH_SIZE);
    
    for (let i = 0; i < totalBatches; i++) {
      const start = i * ROLLBACK_CONFIG.BATCH_SIZE;
      const end = Math.min(start + ROLLBACK_CONFIG.BATCH_SIZE, recordIds.length);
      const batchIds = recordIds.slice(start, end);
      
      const { error: deleteError } = await supabase
        .from('tour_reviews')
        .delete()
        .in('id', batchIds);
      
      if (deleteError) {
        throw new Error(`Failed to delete batch ${i + 1}: ${deleteError.message}`);
      }
      
      await log(`Deleted batch ${i + 1}/${totalBatches}`);
    }
    
    await log(`Selective rollback completed. Deleted ${recordsToDelete.length} records`);
    
    return { success: true, recordsDeleted: recordsToDelete.length, backupFile: backupFilename };
    
  } catch (error) {
    await logError('Selective rollback failed', error);
    throw error;
  }
}

// Verification functions
async function verifyRollback(supabase, originalBackup) {
  await log('Verifying rollback integrity');
  
  try {
    // Get current record count
    const { count: currentCount, error: countError } = await supabase
      .from('tour_reviews')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      throw new Error(`Failed to count current records: ${countError.message}`);
    }
    
    const expectedCount = originalBackup.data.length;
    
    if (currentCount !== expectedCount) {
      throw new Error(`Record count mismatch. Expected: ${expectedCount}, Found: ${currentCount}`);
    }
    
    await log(`Record count verification passed: ${currentCount} records`);
    
    // Sample verification
    const sampleSize = Math.min(ROLLBACK_CONFIG.VERIFICATION_SAMPLE_SIZE, originalBackup.data.length);
    const sampleRecords = originalBackup.data
      .sort(() => 0.5 - Math.random())
      .slice(0, sampleSize);
    
    let verificationErrors = 0;
    
    for (const originalRecord of sampleRecords) {
      const { data: currentRecord, error } = await supabase
        .from('tour_reviews')
        .select('*')
        .eq('tour_slug', originalRecord.tour_slug)
        .eq('author', originalRecord.author)
        .eq('language', originalRecord.language)
        .single();
      
      if (error || !currentRecord) {
        verificationErrors++;
        await logError(`Sample verification failed for record: ${originalRecord.author} - ${originalRecord.title}`);
        continue;
      }
      
      // Compare key fields
      const fieldsToCompare = ['title', 'content', 'rating', 'experience_type'];
      for (const field of fieldsToCompare) {
        if (currentRecord[field] !== originalRecord[field]) {
          verificationErrors++;
          await logError(`Field mismatch for ${originalRecord.author}: ${field}`);
          break;
        }
      }
    }
    
    const verificationRate = ((sampleSize - verificationErrors) / sampleSize) * 100;
    await log(`Sample verification completed: ${verificationRate.toFixed(1)}% accuracy (${sampleSize - verificationErrors}/${sampleSize})`);
    
    if (verificationErrors > sampleSize * 0.1) { // More than 10% errors
      throw new Error(`High verification error rate: ${verificationErrors}/${sampleSize} records failed`);
    }
    
    await log('Rollback verification completed successfully');
    
    return { success: true, verificationRate, sampleSize, errors: verificationErrors };
    
  } catch (error) {
    await logError('Rollback verification failed', error);
    throw error;
  }
}

// Utility functions
async function listBackups() {
  try {
    await ensureBackupDirectory();
    const files = await fs.readdir(ROLLBACK_CONFIG.BACKUP_DIR);
    
    const backupFiles = files
      .filter(file => file.startsWith('tour_reviews_backup_') && file.endsWith('.json'))
      .map(file => ({
        name: file,
        path: path.join(ROLLBACK_CONFIG.BACKUP_DIR, file)
      }));
    
    const backupInfo = [];
    
    for (const backup of backupFiles) {
      try {
        const stats = await fs.stat(backup.path);
        const content = await fs.readFile(backup.path, 'utf8');
        const data = JSON.parse(content);
        
        backupInfo.push({
          filename: backup.name,
          timestamp: data.metadata?.timestamp || stats.mtime.toISOString(),
          recordCount: data.metadata?.total_records || 0,
          size: Math.round(stats.size / 1024) + ' KB',
          type: data.metadata?.backup_type || 'unknown'
        });
      } catch (error) {
        await logError(`Failed to read backup file: ${backup.name}`, error);
      }
    }
    
    return backupInfo.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    
  } catch (error) {
    await logError('Failed to list backups', error);
    throw error;
  }
}

async function generateRollbackReport(operation, result) {
  const report = [
    '='.repeat(60),
    'TOUR REVIEWS ROLLBACK REPORT',
    '='.repeat(60),
    `Date: ${new Date().toISOString()}`,
    `Operation: ${operation}`,
    `Status: ${result.success ? 'SUCCESS' : 'FAILED'}`,
    '',
    'RESULTS:',
    `- Records processed: ${result.recordsRestored || result.recordsDeleted || 0}`,
    `- Verification rate: ${result.verificationRate ? result.verificationRate.toFixed(1) + '%' : 'N/A'}`,
    `- Backup file: ${result.backupFile || 'N/A'}`,
    '',
    'CONFIGURATION:',
    `- Batch size: ${ROLLBACK_CONFIG.BATCH_SIZE}`,
    `- Max backups: ${ROLLBACK_CONFIG.MAX_BACKUPS}`,
    `- Backup directory: ${ROLLBACK_CONFIG.BACKUP_DIR}`,
    '='.repeat(60)
  ].join('\n');
  
  console.log(report);
  
  const reportFilename = `rollback-report-${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
  await fs.writeFile(reportFilename, report);
  
  return report;
}

// Main CLI interface
async function main() {
  const args = process.argv.slice(2);
  const operation = args[0];
  
  if (!operation || !ROLLBACK_CONFIG.ALLOWED_OPERATIONS.includes(operation)) {
    console.log('Usage: node rollback-reviews.js <operation> [options]');
    console.log('');
    console.log('Operations:');
    console.log('  backup_only              - Create backup without rollback');
    console.log('  full_rollback <file>     - Restore from backup file');
    console.log('  selective_rollback       - Delete records by criteria');
    console.log('');
    console.log('Examples:');
    console.log('  node rollback-reviews.js backup_only');
    console.log('  node rollback-reviews.js full_rollback tour_reviews_backup_2023-12-01.json');
    console.log('  node rollback-reviews.js selective_rollback --after-date=2023-12-01');
    process.exit(1);
  }
  
  try {
    const supabase = initializeSupabase();
    let result = { success: false };
    
    switch (operation) {
      case 'backup_only':
        const backup = await createFullBackup(supabase);
        result = { success: true, backupFile: backup.filename, recordsRestored: backup.recordCount };
        await log('Backup operation completed');
        break;
        
      case 'full_rollback':
        const backupFile = args[1];
        if (!backupFile) {
          throw new Error('Backup file not specified');
        }
        result = await performFullRollback(supabase, backupFile);
        break;
        
      case 'selective_rollback':
        // Parse command line criteria
        const criteria = {};
        
        for (let i = 1; i < args.length; i++) {
          const arg = args[i];
          if (arg.startsWith('--after-date=')) {
            criteria.after_date = arg.split('=')[1];
          } else if (arg.startsWith('--before-date=')) {
            criteria.before_date = arg.split('=')[1];
          } else if (arg.startsWith('--tours=')) {
            criteria.tour_slugs = arg.split('=')[1].split(',');
          } else if (arg.startsWith('--languages=')) {
            criteria.languages = arg.split('=')[1].split(',');
          }
        }
        
        if (Object.keys(criteria).length === 0) {
          throw new Error('No rollback criteria specified');
        }
        
        result = await performSelectiveRollback(supabase, criteria);
        break;
    }
    
    // Generate report
    await generateRollbackReport(operation, result);
    
    if (result.success) {
      await log('Rollback operation completed successfully');
      process.exit(0);
    } else {
      await log('Rollback operation failed');
      process.exit(1);
    }
    
  } catch (error) {
    await logError('Critical rollback error', error);
    console.error('Critical rollback error:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = {
  main,
  createFullBackup,
  performFullRollback,
  performSelectiveRollback,
  verifyRollback,
  listBackups,
  ROLLBACK_CONFIG
};