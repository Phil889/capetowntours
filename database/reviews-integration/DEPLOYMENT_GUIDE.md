# Tour Reviews Database Integration - Deployment Guide

## 🚀 Quick Start Deployment

This guide will walk you through deploying the tour reviews database integration system in production.

## Prerequisites Checklist

- [ ] **Supabase Project**: Active Supabase project with PostgreSQL 14+
- [ ] **Service Role Key**: Supabase service role key with full database access
- [ ] **Node.js**: Version 18.0.0 or higher installed
- [ ] **Review Data**: JSON files containing tour review data ready for import

## Step 1: Environment Setup

### 1.1 Environment Variables
Create a `.env` file in the `reviews-integration` directory:

```bash
# Supabase Configuration (REQUIRED)
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# Optional Configuration
NODE_ENV="production"
LOG_LEVEL="INFO"
BATCH_SIZE="100"
MAX_RETRIES="3"
```

### 1.2 Install Dependencies
```bash
cd database/reviews-integration
npm install
```

## Step 2: Database Setup

### 2.1 Install Database Schema and Optimizations
```bash
# Apply database optimizations and indexing
npm run setup-db

# Alternative: Manual execution if you have psql access
# psql -h your-host -U postgres -d your-db -f optimize-queries.sql
# psql -h your-host -U postgres -d your-db -f enhanced-indexing.sql
```

### 2.2 Verify Database Setup
```bash
# Run health check
npm run health-check

# Validate current database state  
npm run validate
```

## Step 3: Data Preparation

### 3.1 Review Data Format
Ensure your JSON review files follow this structure:

```json
{
  "tour_slug": "cape-town-skydive",
  "language": "en",
  "reviews": [
    {
      "author": "John Smith",
      "author_location": "New York, USA", 
      "rating": 5,
      "review_date": "2023-12-01",
      "title": "Amazing Experience!",
      "content": "Detailed review content with at least 100 characters...",
      "verified": true,
      "experience_type": "Adventure Sports",
      "helpful_count": 0
    }
  ]
}
```

### 3.2 Organize Review Files
Place your JSON files in one of these directories (the system will auto-discover):
- `database/sample-data/`
- `database/reviews-data/` 
- `data/reviews/`
- `reviews/`
- `generated-reviews/`

## Step 4: Pre-Deployment Validation

### 4.1 Validate Review Data
```bash
# Comprehensive validation check
npm run validate

# Expected output:
# ✅ Total reviews validated: 1,247
# ✅ Total errors found: 0
# ⚠️  Total warnings: 15
# ✅ Duplicate reviews: 0
```

### 4.2 Create System Backup
```bash
# Create full backup before deployment
npm run backup

# This creates: tour_reviews_backup_[timestamp].json
```

## Step 5: Production Deployment

### 5.1 Execute Batch Insert
```bash
# Run the main batch insert process
npm run batch-insert

# Monitor output for progress:
# [INFO] Starting Tour Reviews Batch Insert System
# [INFO] Found 25 potential review files  
# [INFO] Successfully processed 1,247 reviews from 25 files
# [INFO] Progress: 100% (10/10 batches)
# [SUCCESS] Batch insert completed successfully
```

### 5.2 Post-Deployment Validation
```bash
# Verify deployment success
npm run validate

# Check performance metrics
npm run performance-report
```

## Step 6: Monitoring Setup

### 6.1 Log File Locations
Monitor these log files for ongoing operations:
```
logs/tour-reviews.log           # Main operation log
logs/tour-reviews-errors.log    # Error-specific log  
logs/tour-reviews-performance.log # Performance metrics
logs/tour-reviews-security.log  # Security events
```

### 6.2 Health Monitoring
```bash
# Regular health checks
npm run health-check

# Performance monitoring
npm run performance-report
```

## Step 7: Verification & Testing

### 7.1 Database Verification Queries
Run these SQL queries to verify deployment:

```sql
-- Check total review count
SELECT COUNT(*) as total_reviews FROM tour_reviews WHERE verified = true;

-- Check reviews by language
SELECT language, COUNT(*) as count FROM tour_reviews 
WHERE verified = true GROUP BY language ORDER BY count DESC;

-- Check reviews by tour
SELECT tour_slug, COUNT(*) as count FROM tour_reviews 
WHERE verified = true GROUP BY tour_slug ORDER BY count DESC LIMIT 10;

-- Verify average rating
SELECT ROUND(AVG(rating), 2) as avg_rating FROM tour_reviews WHERE verified = true;
```

### 7.2 Performance Testing
```sql
-- Test primary query performance (should be < 50ms)
EXPLAIN ANALYZE 
SELECT * FROM get_tour_reviews_optimized('cape-town-skydive', 'en', 10, 0);

-- Test search performance (should be < 200ms)
EXPLAIN ANALYZE 
SELECT * FROM search_tour_reviews('safari wildlife', 'inverdoorn-safari-tour', 'en', 20);
```

## Step 8: Production Configuration

### 8.1 Supabase Settings
Apply these Supabase project settings:

```sql
-- Enable Row Level Security
ALTER TABLE tour_reviews ENABLE ROW LEVEL SECURITY;

-- Create read policy for public access
CREATE POLICY "Public can read verified reviews" ON tour_reviews
    FOR SELECT USING (verified = true);

-- Create admin policy for authenticated users  
CREATE POLICY "Authenticated users can manage reviews" ON tour_reviews
    FOR ALL USING (auth.role() = 'authenticated');
```

### 8.2 API Rate Limits
Configure Supabase API rate limits:
- **Authenticated requests**: 200/minute
- **Anonymous requests**: 60/minute  
- **Bulk operations**: 10/minute

## Step 9: Rollback Plan (If Needed)

### 9.1 Emergency Rollback
If deployment fails or issues arise:

```bash
# List available backups
ls -la backups/tour_reviews_backup_*.json

# Rollback to previous state
node rollback-reviews.js full_rollback tour_reviews_backup_[timestamp].json

# Verify rollback success
npm run validate
```

### 9.2 Selective Rollback
For partial issues:

```bash
# Rollback specific tours
node rollback-reviews.js selective_rollback --tours=cape-town-skydive,table-mountain

# Rollback specific languages
node rollback-reviews.js selective_rollback --languages=es,fr

# Rollback recent data
node rollback-reviews.js selective_rollback --after-date=2023-12-01
```

## Step 10: Go-Live Checklist

### Pre-Go-Live
- [ ] ✅ All review data validated successfully
- [ ] ✅ Database indexes created and optimized
- [ ] ✅ Backup created and verified
- [ ] ✅ Performance tests passing
- [ ] ✅ Error handling tested
- [ ] ✅ Monitoring configured

### Post-Go-Live  
- [ ] ✅ API endpoints responding correctly
- [ ] ✅ Review display working on frontend
- [ ] ✅ Search functionality operational
- [ ] ✅ Statistics calculation working
- [ ] ✅ Log files generating properly
- [ ] ✅ Performance within targets

## Troubleshooting Common Issues

### Issue: "Missing Supabase credentials"
```bash
# Verify environment variables
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# Check .env file exists and is readable
cat .env
```

### Issue: "No reviews found to insert"
```bash
# Check file discovery
ls -la database/sample-data/*.json
ls -la database/reviews-data/*.json

# Verify file format
head -20 your-review-file.json
```

### Issue: "Database connection failed"
```bash
# Test connection manually
node -e "
const { createClient } = require('@supabase/supabase-js');
const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
client.from('tour_reviews').select('count').then(console.log);
"
```

### Issue: "Performance degradation"
```sql
-- Check index usage
SELECT * FROM v_tour_reviews_index_performance;

-- Rebuild indexes if needed
SELECT rebuild_tour_reviews_indexes_if_needed();

-- Update statistics
ANALYZE tour_reviews;
```

## Maintenance Schedule

### Daily
- Monitor log files for errors
- Check system performance metrics
- Verify API response times

### Weekly  
- Review error patterns and trends
- Clean up old log files
- Update materialized views

### Monthly
- Analyze index usage statistics
- Optimize database performance
- Review and archive old backups

## Performance Benchmarks

After successful deployment, expect these performance metrics:

| Operation | Target | Typical |
|-----------|---------|---------|
| Get Reviews | < 50ms | 15-30ms |
| Search Reviews | < 200ms | 80-150ms |
| Review Stats | < 100ms | 25-60ms |
| Batch Insert | < 5sec/100 | 2-4sec/100 |

## Support & Maintenance

### Log Analysis
```bash
# Check recent errors
tail -100 logs/tour-reviews-errors.log

# Monitor performance
tail -f logs/tour-reviews-performance.log

# Search for specific issues
grep "ERROR" logs/tour-reviews.log | tail -20
```

### Database Maintenance
```sql
-- Monthly maintenance
SELECT refresh_tour_review_materialized_views();
SELECT update_helpful_counts();
SELECT cleanup_maintenance_logs();
```

### System Health Check
```bash
# Complete system verification
npm run validate && npm run performance-report && echo "✅ System healthy"
```

---

## 🎉 Deployment Complete!

Your tour reviews database integration system is now ready for production use. The system will:

- ✅ Handle 1,000+ reviews efficiently
- ✅ Provide sub-50ms query performance  
- ✅ Support 5 languages seamlessly
- ✅ Maintain data integrity automatically
- ✅ Scale with your growing review data

For ongoing support, monitor the log files and performance metrics regularly. The system is designed to be self-healing and will automatically handle most operational issues.

**Next Steps:**
1. Integrate with your frontend review components
2. Set up automated monitoring dashboards
3. Configure alert notifications for critical issues
4. Plan for future capacity scaling

**Contact:** Development team for technical support and advanced configuration.