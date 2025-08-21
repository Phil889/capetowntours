import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(req: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Optional: Add filtering, pagination, etc.
  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map DB fields to frontend fields
  const tours = (data || []).map((tour: any) => ({
    id: tour.id,
    slug: tour.slug,
    title: tour.name || tour.title,
    description: tour.description,
    price: tour.price || tour.price_per_person_cents,
    category: tour.category,
    duration_days: tour.duration_days,
    image_url: tour.image_url || tour.main_image_url,
    created_at: tour.created_at,
    updated_at: tour.updated_at,
  }));

  return NextResponse.json({ tours });
}
