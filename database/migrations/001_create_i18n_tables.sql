-- =============================================
-- INTERNATIONALIZATION CORE TABLES
-- =============================================

-- Locales configuration table
CREATE TABLE IF NOT EXISTS locales (
  code VARCHAR(5) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  native_name VARCHAR(50) NOT NULL,
  flag_emoji VARCHAR(10),
  direction VARCHAR(3) DEFAULT 'ltr' CHECK (direction IN ('ltr', 'rtl')),
  currency VARCHAR(3),
  region VARCHAR(2),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert supported locales
INSERT INTO locales (code, name, native_name, flag_emoji, direction, currency, region, sort_order) VALUES
('en', 'English', 'English', '🇺🇸', 'ltr', 'USD', 'US', 1),
('de', 'German', 'Deutsch', '🇩🇪', 'ltr', 'EUR', 'DE', 2),
('fr', 'French', 'Français', '🇫🇷', 'ltr', 'EUR', 'FR', 3),
('es', 'Spanish', 'Español', '🇪🇸', 'ltr', 'EUR', 'ES', 4),
('ar', 'Arabic', 'العربية', '🇸🇦', 'rtl', 'SAR', 'SA', 5)
ON CONFLICT (code) DO NOTHING;

-- =============================================
-- ENHANCED TOURS TABLES
-- =============================================

-- Add i18n columns to existing tours table
ALTER TABLE tours ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT 'en' REFERENCES locales(code);
ALTER TABLE tours ADD COLUMN IF NOT EXISTS translated_from UUID REFERENCES tours(id);
ALTER TABLE tours ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT false;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS translation_status VARCHAR(20) DEFAULT 'original' 
  CHECK (translation_status IN ('original', 'translated', 'needs_update', 'draft'));

-- Tour content translations (detailed content)
CREATE TABLE IF NOT EXISTS tour_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  locale VARCHAR(5) NOT NULL REFERENCES locales(code),
  
  -- Basic info
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  short_description VARCHAR(500),
  
  -- Detailed content
  highlights TEXT[],
  inclusions TEXT[],
  exclusions TEXT[],
  important_info TEXT[],
  what_to_bring TEXT[],
  
  -- Structured content
  itinerary JSONB, -- Array of day objects with title, description, activities
  faqs JSONB,      -- Array of FAQ objects with question, answer
  
  -- SEO content
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  meta_keywords TEXT[],
  
  -- Content status
  translation_quality VARCHAR(20) DEFAULT 'draft' 
    CHECK (translation_quality IN ('draft', 'review', 'approved', 'published')),
  translated_by VARCHAR(100),
  reviewed_by VARCHAR(100),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(tour_id, locale)
);

-- =============================================
-- BLOG SYSTEM TABLES
-- =============================================

-- Blog categories
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) NOT NULL,
  locale VARCHAR(5) NOT NULL REFERENCES locales(code),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7), -- Hex color code
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(slug, locale)
);

-- Blog posts main table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(200) NOT NULL,
  locale VARCHAR(5) NOT NULL REFERENCES locales(code),
  translated_from UUID REFERENCES blog_posts(id),
  
  -- Content
  title VARCHAR(255) NOT NULL,
  excerpt VARCHAR(500),
  content TEXT NOT NULL,
  featured_image_url VARCHAR(500),
  featured_image_alt VARCHAR(255),
  
  -- Organization
  category_id UUID REFERENCES blog_categories(id),
  tags TEXT[],
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  meta_keywords TEXT[],
  
  -- Publishing
  status VARCHAR(20) DEFAULT 'draft' 
    CHECK (status IN ('draft', 'review', 'scheduled', 'published', 'archived')),
  published_at TIMESTAMP,
  scheduled_for TIMESTAMP,
  
  -- Author info
  author_name VARCHAR(100),
  author_email VARCHAR(255),
  author_bio TEXT,
  author_avatar_url VARCHAR(500),
  
  -- Engagement
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  
  -- Reading time estimation
  reading_time_minutes INTEGER,
  word_count INTEGER,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(slug, locale)
);

-- Blog comments
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES blog_comments(id), -- For nested comments
  
  -- Comment content
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  author_website VARCHAR(255),
  content TEXT NOT NULL,
  
  -- Moderation
  status VARCHAR(20) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'approved', 'spam', 'rejected')),
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- STATIC CONTENT TRANSLATIONS
-- =============================================

-- Static content translations (UI text, etc.)
CREATE TABLE IF NOT EXISTS static_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) NOT NULL,
  locale VARCHAR(5) NOT NULL REFERENCES locales(code),
  value TEXT NOT NULL,
  context VARCHAR(100), -- page, component, section
  description TEXT, -- For translators
  
  -- Translation management
  is_approved BOOLEAN DEFAULT false,
  translated_by VARCHAR(100),
  reviewed_by VARCHAR(100),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(key, locale)
);

-- Translation jobs for workflow management
CREATE TABLE IF NOT EXISTS translation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('tour', 'blog', 'static')),
  content_id VARCHAR(255) NOT NULL,
  source_locale VARCHAR(5) NOT NULL REFERENCES locales(code),
  target_locale VARCHAR(5) NOT NULL REFERENCES locales(code),
  status VARCHAR(20) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'in_progress', 'review', 'completed', 'rejected')),
  priority VARCHAR(10) DEFAULT 'medium' 
    CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to VARCHAR(100),
  due_date TIMESTAMP,
  completed_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);