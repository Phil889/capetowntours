# Database Scripts - Guest Reviews Insertion

This directory contains comprehensive SQL scripts for inserting multi-language guest reviews into the Cape Town Safari Tours website database.

## 📁 File Structure

```
database-scripts/
├── README.md                          # This file - usage instructions
├── master-reviews-insertion.sql       # Master schema and setup script
├── execute-all-insertions.sql        # Execute all languages in sequence
├── insert-german-reviews.sql         # German reviews (45 reviews)
├── insert-french-reviews.sql         # French reviews (84 reviews)  
├── insert-spanish-reviews.sql        # Spanish reviews (36 reviews)
├── insert-arabic-reviews.sql         # Arabic reviews (61 reviews)
└── verification-queries.sql          # Post-insertion verification
```

## 🚀 Quick Start

### Option 1: Execute All at Once (Recommended)
```sql
-- Run from psql command line
\i execute-all-insertions.sql
```

### Option 2: Individual Language Scripts
```sql
-- Setup database schema first
\i master-reviews-insertion.sql

-- Then run individual language scripts
\i insert-german-reviews.sql
\i insert-french-reviews.sql  
\i insert-spanish-reviews.sql
\i insert-arabic-reviews.sql
```

## 📊 Database Schema

The scripts create/use the following table structure:

```sql
CREATE TABLE guest_reviews (
    id UUID PRIMARY KEY,
    tour_slug TEXT NOT NULL,
    language TEXT NOT NULL CHECK (language IN ('en', 'de', 'fr', 'es', 'ar')),
    reviewer_name TEXT NOT NULL,
    reviewer_location TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    review_date DATE,
    experience_type TEXT,
    is_verified BOOLEAN DEFAULT true,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🌍 Language Coverage

| Language | Reviews | Regional Variants | File |
|----------|---------|------------------|------|
| German (de) | 45 | German, Austrian | `insert-german-reviews.sql` |
| French (fr) | 84 | French, Belgian, Swiss | `insert-french-reviews.sql` |
| Spanish (es) | 36 | Iberian, Latin American | `insert-spanish-reviews.sql` |
| Arabic (ar) | 61 | Gulf, Levant, North Africa | `insert-arabic-reviews.sql` |
| **TOTAL** | **226** | **Multi-regional** | - |

## 🎯 Tour Coverage

All scripts insert reviews for these tours:
- aquila-safari-tour
- boulders-beach-penguin-colony
- cape-town-skydive
- hermanus-whale-watching-tour
- shark-cage-diving-gansbaai
- tokara-wine-estate
- cape-point-lighthouse
- bo-kaap-heritage-quarter
- inverdoorn-safari-tour
- cape-of-good-hope
- chapman-s-peak-drive
- cape-town-paragliding
- atlantis-sand-dunes-adventure
- babylonstoren-wine-estate
- delaire-graff-estate
- hout-bay-harbour
- maiden-s-cove
- muizenberg-beach
- simon-s-town
- v-a-waterfront
- table-mountain-cableway

## ⚙️ Script Features

### Error Handling
- Transaction-based operations with rollback on failure
- Comprehensive error logging and reporting
- UTF-8 character handling for international content
- Duplicate detection and prevention

### Validation
- Rating constraints (1-5 stars)
- Date validation (no future dates)
- Language code validation
- UUID generation and uniqueness checks

### Performance Optimizations
- Batch insertions with proper indexing
- Full-text search index for review content
- Composite indexes for common queries
- Statement timeouts for large operations

### Monitoring & Logging
- Execution timing for each step
- Success/failure status reporting
- Record count validation
- Regional distribution analysis

## 🔧 Prerequisites

- PostgreSQL 12+ database
- `uuid-ossp` extension enabled
- UTF-8 database encoding
- Sufficient privileges for table creation and data insertion

## 🚦 Execution Steps

1. **Backup your database** (recommended)
   ```bash
   pg_dump your_database > backup_before_reviews.sql
   ```

2. **Set connection parameters**
   ```bash
   export PGUSER=your_user
   export PGPASSWORD=your_password  
   export PGDATABASE=your_database
   export PGHOST=your_host
   ```

3. **Execute the scripts**
   ```bash
   psql -f execute-all-insertions.sql
   ```

4. **Verify the results**
   ```sql
   SELECT language, COUNT(*) FROM guest_reviews GROUP BY language;
   ```

## 📈 Verification Queries

After insertion, run these queries to verify data integrity:

```sql
-- Overall statistics
SELECT 
    COUNT(*) as total_reviews,
    COUNT(DISTINCT language) as languages,
    COUNT(DISTINCT tour_slug) as tours,
    ROUND(AVG(rating), 2) as avg_rating
FROM guest_reviews;

-- Per-language breakdown  
SELECT 
    language,
    COUNT(*) as review_count,
    ROUND(AVG(rating), 2) as avg_rating,
    COUNT(DISTINCT tour_slug) as tours_covered
FROM guest_reviews 
GROUP BY language 
ORDER BY language;

-- Rating distribution
SELECT 
    rating,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM guest_reviews 
GROUP BY rating 
ORDER BY rating DESC;
```

## 🔍 Troubleshooting

### Common Issues

**UTF-8 Encoding Errors**
```sql
-- Check database encoding
SHOW server_encoding;

-- Set client encoding  
SET client_encoding = 'UTF8';
```

**Permission Errors**
```sql
-- Grant necessary permissions
GRANT CREATE ON SCHEMA public TO your_user;
GRANT USAGE ON SCHEMA public TO your_user;
```

**Memory/Timeout Issues**
```sql
-- Increase timeouts for large insertions
SET statement_timeout = '30min';
SET lock_timeout = '5min';
```

### Rollback on Error
If insertion fails, the transaction will automatically rollback. You can also manually rollback:
```sql
BEGIN;
-- Run insertion scripts
-- If error occurs:
ROLLBACK;
```

## 📞 Support

For issues with these scripts:
1. Check the execution logs for specific error messages
2. Verify database permissions and encoding
3. Ensure all prerequisite extensions are installed
4. Review the troubleshooting section above

## 🚀 Production Deployment

1. Test scripts in staging environment first
2. Schedule during low-traffic periods
3. Monitor database performance during insertion
4. Verify frontend application can read the new data
5. Update search indexes if using external search engines

---

**Generated by:** Cape Town Safari Tours Backend API Development Team  
**Last Updated:** 2024-08-24  
**Version:** 1.0.0