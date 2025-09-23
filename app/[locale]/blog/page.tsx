import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/lib/i18n/config';
import { generateLocalizedMetadata } from '@/lib/i18n/metadata';
import { BlogService } from '@/lib/blog/blog-service';

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    return {};
  }

  return generateLocalizedMetadata({
    locale,
    pathname: '/blog',
    title: 'Safari Blog | Cape Town Safari Tours',
    description: 'Discover expert safari tips, wildlife stories, and travel guides for your Cape Town adventure.'
  });
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    notFound();
  }

  const blogService = BlogService.getInstance();
  const [posts, categories] = await Promise.all([
    blogService.getPublishedPosts(locale, 12),
    blogService.getCategories(locale)
  ]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Safari Blog</h1>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/${locale}/blog/category/${category.slug}`}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
              style={{ backgroundColor: category.color + '20', color: category.color }}
            >
              {category.name}
            </a>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {post.featuredImageUrl && (
                <img
                  src={post.featuredImageUrl}
                  alt={post.featuredImageAlt || post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  {post.category && (
                    <span 
                      className="px-2 py-1 text-xs font-medium rounded"
                      style={{ backgroundColor: post.category.color + '20', color: post.category.color }}
                    >
                      {post.category.name}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {post.readingTimeMinutes} min read
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-2 line-clamp-2">
                  <a href={`/${locale}/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                    {post.title}
                  </a>
                </h2>
                {post.excerpt && (
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{post.authorName}</span>
                  <span>{new Date(post.publishedAt!).toLocaleDateString()}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}