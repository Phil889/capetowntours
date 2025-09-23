# Database Setup - Final Steps

## Overview
The i18n database schema needs to be set up manually in the Supabase dashboard. This guide provides the exact steps to complete the setup.

## Step 1: Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project: `orogsbgpdvpzraujtekx`

## Step 2: Open SQL Editor

1. In the left sidebar, click on **SQL Editor**
2. Click **New Query** to create a new SQL query

## Step 3: Execute Database Schema

Copy and paste the following SQL into the query editor and click **Run**:

```sql
-- Create locales table
CREATE TABLE IF NOT EXISTS locales (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    native_name TEXT NOT NULL,
    direction TEXT DEFAULT 'ltr' CHECK (direction IN ('ltr', 'rtl')),
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id INTEGER NOT NULL,
    locale TEXT NOT NULL REFERENCES locales(code) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    translated_value TEXT NOT NULL,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'approved', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(table_name, record_id, locale, field_name)
);

-- Insert default locales
INSERT INTO locales (code, name, native_name, direction) VALUES
    ('en', 'English', 'English', 'ltr'),
    ('de', 'German', 'Deutsch', 'ltr'),
    ('fr', 'French', 'Français', 'ltr'),
    ('es', 'Spanish', 'Español', 'ltr'),
    ('ar', 'Arabic', 'العربية', 'rtl')
ON CONFLICT (code) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_translations_lookup ON translations(table_name, record_id, locale, field_name);
CREATE INDEX IF NOT EXISTS idx_translations_locale ON translations(locale);
CREATE INDEX IF NOT EXISTS idx_translations_table_record ON translations(table_name, record_id);

-- Create blog_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    meta_description TEXT,
    featured_image TEXT,
    author_id UUID,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample blog posts if they don't exist
INSERT INTO blog_posts (title, slug, content, excerpt, meta_description) VALUES
    (
        'Top 10 Must-Visit Attractions in Cape Town',
        'top-10-attractions-cape-town',
        'Cape Town is one of the world''s most beautiful cities, offering a perfect blend of natural wonders, rich history, and vibrant culture. From the iconic Table Mountain to the charming penguins at Boulders Beach, here are the top 10 attractions you absolutely cannot miss when visiting the Mother City.',
        'Discover the best attractions that make Cape Town one of the world''s most popular destinations.',
        'Discover the top 10 must-visit attractions in Cape Town, from Table Mountain Cable Car to Boulders Beach penguins. Your ultimate Cape Town travel guide.'
    ),
    (
        'Best Time to Visit Cape Town',
        'best-time-visit-cape-town',
        'Planning your trip to Cape Town? Understanding the city''s seasons and weather patterns is crucial for making the most of your visit. Cape Town enjoys a Mediterranean climate with warm, dry summers and mild, wet winters.',
        'Plan your Cape Town trip with our comprehensive guide to weather, seasons, and special events.',
        'Discover the best time to visit Cape Town. Comprehensive guide to weather, seasons, and activities for your perfect South Africa trip.'
    )
ON CONFLICT (slug) DO NOTHING;
```

## Step 4: Verify Tables Created

After running the SQL, verify the tables were created:

1. In the left sidebar, click on **Table Editor**
2. You should see the following new tables:
   - `locales` (with 5 language entries)
   - `translations` (empty, ready for data)
   - `blog_posts` (with 2 sample posts)

## Step 5: Execute Translations

Once the database schema is set up, run the translation script:

```bash
npm run translate
```

This will populate the `translations` table with German, French, Spanish, and Arabic translations for:
- 3 sample tours
- 2 blog posts

## Step 6: Test the Application

Start the development server and test the internationalization:

```bash
npm run dev
```

Visit these URLs to test different languages:
- http://localhost:3000/en (English)
- http://localhost:3000/de (German)
- http://localhost:3000/fr (French)
- http://localhost:3000/es (Spanish)
- http://localhost:3000/ar (Arabic)

## Expected Results

After completing these steps:

1. **Database**: 5 locales, translations table ready, sample blog posts
2. **Translations**: All tour and blog content translated into 4 languages
3. **Frontend**: Language switching works, content displays in selected language
4. **SEO**: Hreflang tags, localized metadata, multilingual sitemaps

## Troubleshooting

### If SQL execution fails:
- Check that you're using the correct project
- Ensure you have admin permissions
- Try running each CREATE TABLE statement individually

### If translations don't appear:
- Verify the translations table has data: `SELECT COUNT(*) FROM translations;`
- Check that the translation service is working
- Ensure middleware is detecting locales correctly

### If language switching doesn't work:
- Check browser console for JavaScript errors
- Verify middleware.ts is properly configured
- Test with different browsers

## Next Steps

1. **Content Expansion**: Add more tours and blog posts
2. **Translation Quality**: Review and improve translations
3. **SEO Testing**: Verify search engine indexing
4. **Performance**: Monitor page load times
5. **User Testing**: Get feedback from native speakers

## Support

If you encounter issues:
1. Check the browser console for errors
2. Review Supabase logs in the dashboard
3. Test database connections
4. Verify environment variables are set correctly

The internationalization system is now ready for production use!