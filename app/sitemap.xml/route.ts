import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://capetownsafaritours.com";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Fetch all tours to get their slugs
  const { data, error } = await supabase
    .from("tours")
    .select("slug,updated_at");

  // Supported locales
  const locales = ['en', 'de', 'fr', 'es', 'ar'];

  // Pages that are now in [locale] structure
  const localizedPages = [
    "",
    "about",
    "contact",
    "faq",
    "tours",
  ];

  // Pages that remain in root structure
  const staticPages = [
    "privacy-policy",
    "terms-of-service",
    "safari-tours",
    "cape-town-tours/table-mountain-tours",
  ];

  let urls: string[] = [];

  // Generate URLs for localized pages
  locales.forEach(locale => {
    localizedPages.forEach(page => {
      // Set priority based on page importance
      let priority = "0.8";
      let changefreq = "weekly";
      
      if (page === "") {
        priority = "1.0"; // Homepage highest priority
        changefreq = "daily";
      } else if (page === "tours") {
        priority = "0.9"; // Tours page high priority
        changefreq = "daily";
      }

      // Generate URL with locale prefix (except for English)
      const urlPath = locale === 'en' ? page : `${locale}/${page}`;
      const fullUrl = page === "" ? (locale === 'en' ? baseUrl : `${baseUrl}/${locale}`) : `${baseUrl}/${urlPath}`;
      
      urls.push(`
        <url>
          <loc>${fullUrl}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>${changefreq}</changefreq>
          <priority>${priority}</priority>
        </url>
      `);
    });
  });

  // Generate URLs for static pages (non-localized)
  staticPages.forEach(page => {
    let priority = "0.8";
    let changefreq = "weekly";
    
    if (page.startsWith("safari-tours") || page.startsWith("cape-town-tours")) {
      priority = "0.9"; // High-value landing pages
      changefreq = "weekly";
    }
    
    urls.push(`
      <url>
        <loc>${baseUrl}/${page}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
      </url>
    `);
  });

  // Generate URLs for tours (localized)
  if (data) {
    locales.forEach(locale => {
      data.forEach((tour: any) => {
        const urlPath = locale === 'en' ? `tours/${tour.slug}` : `${locale}/tours/${tour.slug}`;
        urls.push(`
          <url>
            <loc>${baseUrl}/${urlPath}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.9</priority>
            ${tour.updated_at ? `<lastmod>${new Date(tour.updated_at).toISOString()}</lastmod>` : ""}
          </url>
        `);
      });
    });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
  ${urls.join("\n")}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
