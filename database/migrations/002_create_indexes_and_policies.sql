-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Tours indexes
CREATE INDEX IF NOT EXISTS idx_tours_locale ON tours(locale);
CREATE INDEX IF NOT EXISTS idx_tours_slug_locale ON tours(slug, locale);
CREATE INDEX IF NOT EXISTS idx_tours_status ON tours(translation_status);
CREATE INDEX IF NOT EXISTS idx_tours_template ON tours(is_template);
CREATE INDEX IF NOT EXISTS idx_tour_translations_tour_locale ON tour_translations(tour_id, locale);
CREATE INDEX IF NOT EXISTS idx_tour_translations_quality ON tour_translations(translation_quality);

-- Blog indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_locale ON blog_posts(locale);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug_locale ON blog_posts(slug, locale);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_categories_locale ON blog_categories(locale);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);

-- Static translations indexes
CREATE INDEX IF NOT EXISTS idx_static_translations_key_locale ON static_translations(key, locale);
CREATE INDEX IF NOT EXISTS idx_static_translations_context ON static_translations(context);
CREATE INDEX IF NOT EXISTS idx_static_translations_approved ON static_translations(is_approved);

-- Translation jobs indexes
CREATE INDEX IF NOT EXISTS idx_translation_jobs_status ON translation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_translation_jobs_priority ON translation_jobs(priority);
CREATE INDEX IF NOT EXISTS idx_translation_jobs_assigned ON translation_jobs(assigned_to);
CREATE INDEX IF NOT EXISTS idx_translation_jobs_due_date ON translation_jobs(due_date);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
DROP TRIGGER IF EXISTS update_tours_updated_at ON tours;
CREATE TRIGGER update_tours_updated_at
  BEFORE UPDATE ON tours
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tour_translations_updated_at ON tour_translations;
CREATE TRIGGER update_tour_translations_updated_at
  BEFORE UPDATE ON tour_translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON blog_categories;
CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_comments_updated_at ON blog_comments;
CREATE TRIGGER update_blog_comments_updated_at
  BEFORE UPDATE ON blog_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_static_translations_updated_at ON static_translations;
CREATE TRIGGER update_static_translations_updated_at
  BEFORE UPDATE ON static_translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_translation_jobs_updated_at ON translation_jobs;
CREATE TRIGGER update_translation_jobs_updated_at
  BEFORE UPDATE ON translation_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update comment count
CREATE OR REPLACE FUNCTION update_blog_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE blog_posts 
    SET comment_count = comment_count + 1 
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE blog_posts 
    SET comment_count = comment_count - 1 
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_comment_count_trigger ON blog_comments;
CREATE TRIGGER update_comment_count_trigger
  AFTER INSERT OR DELETE ON blog_comments
  FOR EACH ROW EXECUTE FUNCTION update_blog_comment_count();

-- Function to calculate reading time
CREATE OR REPLACE FUNCTION calculate_reading_time(content_text TEXT)
RETURNS INTEGER AS $$
DECLARE
  word_count INTEGER;
  reading_time INTEGER;
BEGIN
  -- Count words (approximate)
  word_count := array_length(string_to_array(content_text, ' '), 1);
  
  -- Average reading speed: 200 words per minute
  reading_time := CEIL(word_count::FLOAT / 200);
  
  -- Minimum 1 minute
  IF reading_time < 1 THEN
    reading_time := 1;
  END IF;
  
  RETURN reading_time;
END;
$$ language 'plpgsql';

-- Trigger to auto-calculate reading time and word count
CREATE OR REPLACE FUNCTION update_blog_post_stats()
RETURNS TRIGGER AS $$
BEGIN
  NEW.word_count := array_length(string_to_array(NEW.content, ' '), 1);
  NEW.reading_time_minutes := calculate_reading_time(NEW.content);
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_blog_stats_trigger ON blog_posts;
CREATE TRIGGER update_blog_stats_trigger
  BEFORE INSERT OR UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_blog_post_stats();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts 
  SET view_count = view_count + 1 
  WHERE id = post_id;
END;
$$ language 'plpgsql';

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on tables
ALTER TABLE tour_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE static_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_jobs ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
DROP POLICY IF EXISTS "Public can read published tour translations" ON tour_translations;
CREATE POLICY "Public can read published tour translations" ON tour_translations
  FOR SELECT USING (translation_quality = 'published');

DROP POLICY IF EXISTS "Public can read published blog posts" ON blog_posts;
CREATE POLICY "Public can read published blog posts" ON blog_posts
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public can read active blog categories" ON blog_categories;
CREATE POLICY "Public can read active blog categories" ON blog_categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can read approved comments" ON blog_comments;
CREATE POLICY "Public can read approved comments" ON blog_comments
  FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Public can read approved static translations" ON static_translations;
CREATE POLICY "Public can read approved static translations" ON static_translations
  FOR SELECT USING (is_approved = true);

-- Admin policies (these will need to be updated based on your auth system)
-- For now, allowing all operations for authenticated users with admin role
DROP POLICY IF EXISTS "Admins can manage tour translations" ON tour_translations;
CREATE POLICY "Admins can manage tour translations" ON tour_translations
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'translator')
  );

DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;
CREATE POLICY "Admins can manage blog posts" ON blog_posts
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'editor')
  );

DROP POLICY IF EXISTS "Admins can manage blog categories" ON blog_categories;
CREATE POLICY "Admins can manage blog categories" ON blog_categories
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    auth.jwt() ->> 'role' = 'admin'
  );

DROP POLICY IF EXISTS "Users can insert comments" ON blog_comments;
CREATE POLICY "Users can insert comments" ON blog_comments
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage comments" ON blog_comments;
CREATE POLICY "Admins can manage comments" ON blog_comments
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'moderator')
  );

DROP POLICY IF EXISTS "Translators can manage static translations" ON static_translations;
CREATE POLICY "Translators can manage static translations" ON static_translations
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'translator')
  );

DROP POLICY IF EXISTS "Admins can manage translation jobs" ON translation_jobs;
CREATE POLICY "Admins can manage translation jobs" ON translation_jobs
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'translator')
  );

-- =============================================
-- INITIAL DATA
-- =============================================

-- Insert some default blog categories for each locale
INSERT INTO blog_categories (slug, locale, name, description, color, sort_order) VALUES
-- English categories
('safari-tips', 'en', 'Safari Tips', 'Expert advice for your safari adventure', '#10B981', 1),
('wildlife', 'en', 'Wildlife', 'Amazing wildlife stories and facts', '#F59E0B', 2),
('travel-guides', 'en', 'Travel Guides', 'Comprehensive travel guides for South Africa', '#3B82F6', 3),
('conservation', 'en', 'Conservation', 'Wildlife conservation and sustainability', '#059669', 4),

-- German categories
('safari-tipps', 'de', 'Safari Tipps', 'Expertenrat für Ihr Safari-Abenteuer', '#10B981', 1),
('wildtiere', 'de', 'Wildtiere', 'Erstaunliche Wildtiergeschichten und Fakten', '#F59E0B', 2),
('reiseführer', 'de', 'Reiseführer', 'Umfassende Reiseführer für Südafrika', '#3B82F6', 3),
('naturschutz', 'de', 'Naturschutz', 'Wildtierschutz und Nachhaltigkeit', '#059669', 4),

-- French categories
('conseils-safari', 'fr', 'Conseils Safari', 'Conseils d''experts pour votre aventure safari', '#10B981', 1),
('faune', 'fr', 'Faune', 'Histoires et faits incroyables sur la faune', '#F59E0B', 2),
('guides-voyage', 'fr', 'Guides de Voyage', 'Guides de voyage complets pour l''Afrique du Sud', '#3B82F6', 3),
('conservation', 'fr', 'Conservation', 'Conservation de la faune et durabilité', '#059669', 4),

-- Spanish categories
('consejos-safari', 'es', 'Consejos Safari', 'Consejos de expertos para tu aventura safari', '#10B981', 1),
('vida-silvestre', 'es', 'Vida Silvestre', 'Historias y datos increíbles sobre la vida silvestre', '#F59E0B', 2),
('guias-viaje', 'es', 'Guías de Viaje', 'Guías de viaje completas para Sudáfrica', '#3B82F6', 3),
('conservacion', 'es', 'Conservación', 'Conservación de vida silvestre y sostenibilidad', '#059669', 4),

-- Arabic categories
('نصائح-السفاري', 'ar', 'نصائح السفاري', 'نصائح الخبراء لمغامرة السفاري الخاصة بك', '#10B981', 1),
('الحياة-البرية', 'ar', 'الحياة البرية', 'قصص وحقائق مذهلة عن الحياة البرية', '#F59E0B', 2),
('أدلة-السفر', 'ar', 'أدلة السفر', 'أدلة سفر شاملة لجنوب أفريقيا', '#3B82F6', 3),
('المحافظة', 'ar', 'المحافظة على البيئة', 'حفظ الحياة البرية والاستدامة', '#059669', 4)

ON CONFLICT (slug, locale) DO NOTHING;