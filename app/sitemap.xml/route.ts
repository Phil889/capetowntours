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

  const staticPages = [
    "",
    "about",
    "contact",
    "faq",
    "privacy-policy",
    "terms-of-service",
    "tours",
    "safari-tours",
    "cape-town-tours/table-mountain-tours",
  ];

  let urls = staticPages.map(
    (page) => `
      <url>
        <loc>${baseUrl}/${page}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `
  );

  if (data) {
    urls = urls.concat(
      data.map((tour: any) => `
        <url>
          <loc>${baseUrl}/tours/${tour.slug}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
          ${tour.updated_at ? `<lastmod>${new Date(tour.updated_at).toISOString()}</lastmod>` : ""}
        </url>
      `)
    );
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
