import { createClient } from '@supabase/supabase-js';
import { BlogPost, BlogCategory } from '@/types/i18n';
import { Locale } from '@/lib/i18n/config';

export class BlogService {
  private static instance: BlogService;
  private supabase;

  private constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  async getPublishedPosts(locale: Locale, limit = 10, offset = 0): Promise<BlogPost[]> {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(*)
      `)
      .eq('locale', locale)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  }

  async getPostBySlug(slug: string, locale: Locale): Promise<BlogPost | null> {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(*)
      `)
      .eq('slug', slug)
      .eq('locale', locale)
      .eq('status', 'published')
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    // Increment view count
    await this.supabase.rpc('increment_view_count', { post_id: data.id });
    return data;
  }

  async getCategories(locale: Locale): Promise<BlogCategory[]> {
    const { data, error } = await this.supabase
      .from('blog_categories')
      .select('*')
      .eq('locale', locale)
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  }
}