# Supabase CLI Translation Setup Guide

## Overview
This guide explains how to use the Supabase CLI to execute database translations for the Cape Town Safari Tours internationalization system.

## Prerequisites
- Node.js 18+ installed
- Supabase project created
- Database schema deployed

## Step 1: Install Supabase CLI

### Install via npm (Recommended)
```bash
npm install -g supabase
```

### Alternative: Install via Homebrew (macOS)
```bash
brew install supabase/tap/supabase
```

### Alternative: Install via Scoop (Windows)
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

## Step 2: Login to Supabase

```bash
supabase login
```

This will open a browser window for authentication. Follow the prompts to log in.

## Step 3: Link to Your Project

```bash
supabase link --project-ref orogsbgpdvpzraujtekx
```

Replace `orogsbgpdvpzraujtekx` with your actual project reference ID if different.

## Step 4: Verify Connection

```bash
supabase status
```

This should show your project details and confirm the connection.

## Step 5: Execute Database Migrations

### Run the i18n schema migrations
```bash
supabase db push
```

Or execute specific migration files:
```bash
supabase db reset
```

## Step 6: Execute Translation Data

### Method 1: Using SQL Files Directly
```bash
# Execute the translation data
supabase db sql --file database/translations/execute-translations.sql
```

### Method 2: Interactive SQL Execution
```bash
# Open interactive SQL shell
supabase db sql

# Then paste and execute the translation queries
```

### Method 3: Execute Individual Queries
```bash
# Execute specific translation queries
supabase db sql --query "INSERT INTO translations (table_name, record_id, locale, field_name, translated_value) VALUES ('tours', 1, 'de', 'title', 'Tafelberg-Seilbahn Tour');"
```

## Step 7: Verify Translations

### Check translation completeness
```bash
supabase db sql --query "
SELECT 
    table_name,
    record_id,
    COUNT(DISTINCT locale) as translated_locales,
    array_agg(DISTINCT locale ORDER BY locale) as available_locales
FROM translations 
GROUP BY table_name, record_id
ORDER BY table_name, record_id;
"
```

### Check for missing translations
```bash
supabase db sql --file database/translations/database-translation-strategy.sql
```

## Step 8: Test Database Connection from Application

Create a simple test script to verify the translations are working:

```bash
# Create test script
cat > test-translations.js << 'EOF'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testTranslations() {
  // Test tours with translations
  const { data: tours, error } = await supabase
    .from('tours')
    .select(`
      *,
      translations!inner(
        locale,
        field_name,
        translated_value
      )
    `)
    .eq('translations.locale', 'de')
    .limit(1)

  if (error) {
    console.error('Error:', error)
  } else {
    console.log('German tour translation:', tours)
  }
}

testTranslations()
EOF

# Run the test
node test-translations.js
```

## Step 9: Batch Translation Execution

For executing all translations at once, use this approach:

```bash
# Execute all tour translations
supabase db sql --query "
-- Tour 1: Table Mountain Cable Car Tour
INSERT INTO translations (table_name, record_id, locale, field_name, translated_value) VALUES
('tours', 1, 'de', 'title', 'Tafelberg-Seilbahn Tour'),
('tours', 1, 'de', 'description', 'Erleben Sie atemberaubende Panoramablicke auf Kapstadt und die Umgebung mit der berühmten Tafelberg-Seilbahn.'),
('tours', 1, 'fr', 'title', 'Tour du Téléphérique de Table Mountain'),
('tours', 1, 'fr', 'description', 'Découvrez des vues panoramiques à couper le souffle sur Le Cap et ses environs.'),
('tours', 1, 'es', 'title', 'Tour del Teleférico de Table Mountain'),
('tours', 1, 'es', 'description', 'Experimenta vistas panorámicas impresionantes de Ciudad del Cabo.'),
('tours', 1, 'ar', 'title', 'جولة التلفريك في جبل الطاولة'),
('tours', 1, 'ar', 'description', 'استمتع بإطلالات بانورامية خلابة على كيب تاون والمناطق المحيطة بها.');
"
```

## Step 10: Database Backup Before Translation

Always backup before making major changes:

```bash
# Create a backup
supabase db dump --file backup-before-translations.sql

# If needed, restore from backup
supabase db reset --file backup-before-translations.sql
```

## Common Commands Reference

### Database Operations
```bash
# Check database status
supabase status

# Reset database (careful!)
supabase db reset

# Push local migrations
supabase db push

# Pull remote changes
supabase db pull

# Generate types
supabase gen types typescript --local > types/database.ts
```

### SQL Execution
```bash
# Execute SQL file
supabase db sql --file path/to/file.sql

# Execute inline query
supabase db sql --query "SELECT * FROM tours;"

# Interactive SQL shell
supabase db sql
```

### Project Management
```bash
# Link to project
supabase link --project-ref YOUR_PROJECT_REF

# Check project info
supabase projects list

# Switch projects
supabase link --project-ref DIFFERENT_PROJECT_REF
```

## Troubleshooting

### Connection Issues
```bash
# Check if logged in
supabase projects list

# Re-login if needed
supabase logout
supabase login
```

### Permission Issues
```bash
# Ensure you have the correct permissions
supabase projects list

# Check project access
supabase link --project-ref YOUR_PROJECT_REF
```

### SQL Execution Errors
```bash
# Check syntax in a SQL editor first
# Use --dry-run flag when available
# Execute small batches instead of large files
```

## Environment Variables

Make sure these are set in your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://orogsbgpdvpzraujtekx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Translation Execution Workflow

1. **Backup Database**
   ```bash
   supabase db dump --file backup-$(date +%Y%m%d).sql
   ```

2. **Execute Translations**
   ```bash
   supabase db sql --file database/translations/execute-translations.sql
   ```

3. **Verify Results**
   ```bash
   supabase db sql --query "SELECT COUNT(*) FROM translations;"
   ```

4. **Test Application**
   ```bash
   npm run dev
   # Test language switching in browser
   ```

## Performance Considerations

### Batch Size
- Execute translations in batches of 100-500 records
- Monitor database performance during execution
- Use transactions for consistency

### Indexing
```bash
# Ensure indexes are created
supabase db sql --query "
CREATE INDEX IF NOT EXISTS idx_translations_lookup 
ON translations(table_name, record_id, locale, field_name);
"
```

### Monitoring
```bash
# Check database size
supabase db sql --query "
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

## Next Steps

1. Install Supabase CLI
2. Login and link to project
3. Execute translation scripts
4. Verify translations in database
5. Test application functionality
6. Deploy to production

## Support Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/local-development/cli/getting-started)
- [Supabase SQL Reference](https://supabase.com/docs/guides/database)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

This approach is much more reliable than MCP and gives you direct control over the database operations.