# MCP Translation Setup Guide

## Overview
This guide explains how to set up the Supabase MCP server connection and execute database translations for the Cape Town Safari Tours internationalization system.

## Prerequisites
- Supabase project with the i18n database schema deployed
- Supabase service role key with appropriate permissions
- MCP server configuration in `.roo/mcp.json`

## Step 1: Environment Setup

### 1.1 Get Supabase Service Role Key
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the "service_role" key (not the "anon" key)
4. This key has full database access and bypasses RLS policies

### 1.2 Set Environment Variable
Set the environment variable in your system:

**Windows (PowerShell):**
```powershell
$env:SUPABASE_ACCESS_TOKEN="your_service_role_key_here"
```

**Windows (Command Prompt):**
```cmd
set SUPABASE_ACCESS_TOKEN=your_service_role_key_here
```

**macOS/Linux:**
```bash
export SUPABASE_ACCESS_TOKEN="your_service_role_key_here"
```

### 1.3 Verify MCP Configuration
The `.roo/mcp.json` file should contain:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@supabase/mcp-server-supabase@latest", "--project-ref=orogsbgpdvpzraujtekx"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}"
      }
    }
  }
}
```

## Step 2: Database Schema Verification

### 2.1 Verify Tables Exist
Use MCP to check that all required tables are present:
- `tours`
- `blog_posts` 
- `translations`
- `locales`

### 2.2 Check Sample Data
Verify that sample tours and blog posts exist in the database.

## Step 3: Translation Execution Strategy

### 3.1 Translation Workflow
1. **Extract Content**: Get all tours and blog posts that need translation
2. **Generate Translations**: Use AI to translate content into target languages
3. **Insert Translations**: Store translations in the `translations` table
4. **Validate**: Verify translation completeness and quality

### 3.2 Target Languages
- German (de)
- French (fr) 
- Spanish (es)
- Arabic (ar)

### 3.3 Content to Translate

**Tours Table:**
- `title` - Tour name
- `description` - Detailed description
- `location` - Location name
- `highlights` - JSON array of highlights
- `included` - JSON array of included items
- `not_included` - JSON array of excluded items

**Blog Posts Table:**
- `title` - Post title
- `content` - Full article content
- `excerpt` - Short summary
- `meta_description` - SEO description

## Step 4: MCP Commands for Translation

### 4.1 List All Tables
```
use_mcp_tool:
  server_name: supabase
  tool_name: list_tables
  arguments: {"schemas": ["public"]}
```

### 4.2 Get Tours Data
```
use_mcp_tool:
  server_name: supabase
  tool_name: execute_sql
  arguments: {
    "query": "SELECT id, title, description, location, highlights, included, not_included FROM tours ORDER BY id"
  }
```

### 4.3 Get Blog Posts Data
```
use_mcp_tool:
  server_name: supabase
  tool_name: execute_sql
  arguments: {
    "query": "SELECT id, title, content, excerpt, meta_description FROM blog_posts ORDER BY created_at DESC"
  }
```

### 4.4 Insert Translation Example
```
use_mcp_tool:
  server_name: supabase
  tool_name: execute_sql
  arguments: {
    "query": "INSERT INTO translations (table_name, record_id, locale, field_name, translated_value) VALUES ('tours', 1, 'de', 'title', 'Tafelberg-Seilbahn Tour')"
  }
```

## Step 5: Translation Quality Guidelines

### 5.1 Translation Standards
- **Accuracy**: Maintain original meaning and context
- **Cultural Adaptation**: Adapt content for local markets
- **SEO Optimization**: Keep keywords relevant for each language
- **Consistency**: Use consistent terminology across all content

### 5.2 Language-Specific Considerations

**German (DE):**
- Use formal language (Sie form)
- Compound words for technical terms
- Clear, structured sentences

**French (FR):**
- Formal register for business content
- Proper use of accents and special characters
- Cultural references adapted for French-speaking markets

**Spanish (ES):**
- International Spanish (not region-specific)
- Formal business tone
- Proper use of tildes and special characters

**Arabic (AR):**
- Right-to-left (RTL) text direction
- Formal Modern Standard Arabic
- Cultural sensitivity for Islamic markets

## Step 6: Validation and Testing

### 6.1 Translation Completeness Check
```sql
SELECT 
    table_name,
    record_id,
    COUNT(DISTINCT locale) as translated_locales,
    array_agg(DISTINCT locale) as available_locales
FROM translations 
GROUP BY table_name, record_id
HAVING COUNT(DISTINCT locale) < 4;
```

### 6.2 Frontend Testing
1. Test language switching functionality
2. Verify translations display correctly
3. Check RTL layout for Arabic
4. Validate SEO metadata in each language

## Step 7: Troubleshooting

### 7.1 Common Issues

**MCP Connection Failed:**
- Verify environment variable is set correctly
- Check Supabase project reference ID
- Ensure service role key has proper permissions

**Translation Not Displaying:**
- Check translation service cache
- Verify locale routing in middleware
- Confirm translation exists in database

**Performance Issues:**
- Check database indexes on translations table
- Verify translation caching is working
- Monitor query performance

### 7.2 Debug Commands

**Check Environment Variable:**
```powershell
echo $env:SUPABASE_ACCESS_TOKEN
```

**Test Database Connection:**
```sql
SELECT current_database(), current_user, version();
```

**Check Translation Coverage:**
```sql
SELECT 
    t.title,
    COUNT(tr.id) as translation_count
FROM tours t
LEFT JOIN translations tr ON t.id = tr.record_id AND tr.table_name = 'tours'
GROUP BY t.id, t.title;
```

## Step 8: Automation Scripts

### 8.1 Batch Translation Script
Create a script to automate the translation process for all content at once.

### 8.2 Translation Validation Script  
Automated checks to ensure all content has complete translations.

### 8.3 Performance Monitoring
Scripts to monitor translation query performance and cache hit rates.

## Next Steps

1. Set up the environment variable
2. Test MCP connection
3. Execute translation strategy from `database/translations/database-translation-strategy.sql`
4. Validate translations
5. Test frontend functionality
6. Deploy to production

## Support

For issues with this setup:
1. Check the database migration logs
2. Verify Supabase project configuration
3. Test MCP connection independently
4. Review translation service logs