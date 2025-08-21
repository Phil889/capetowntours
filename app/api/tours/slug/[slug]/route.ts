import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(
  req: NextRequest,
  context: { params: { slug: string } }
) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Await params for dynamic API routes in Next.js 15+
  const { slug } = await Promise.resolve(context.params);

  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Tour not found" }, { status: 404 });
  }

  // Map DB fields to frontend fields
  const tour = {
    id: data.id,
    slug: data.slug,
    title: data.name || data.title,
    description: data.description,
    price: data.price || data.price_per_person_cents,
    category: data.category,
    duration_days: data.duration_days,
    image_url: data.image_url || data.main_image_url,
    created_at: data.created_at,
    updated_at: data.updated_at,
    highlights: data.highlights,
    itinerary: data.itinerary,
    included: data.included,
    excluded: data.excluded,
    map_embed: data.map_embed,
    unique_selling_points: data.unique_selling_points,
    faqs: data.faqs,
    review_snippet: data.review_snippet,
    cancellation_policy: data.cancellation_policy,
    seasonal_notes: data.seasonal_notes,
    child_policy: data.child_policy,
    accessibility: data.accessibility,
    group_size_max: data.group_size_max,
    duration: data.duration,
    departure_time: data.departure_time,
    pickup: data.pickup,
  };

  return NextResponse.json({ tour });
}
