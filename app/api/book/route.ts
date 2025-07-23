import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  const { tourId, date, guests, guest_email } = await req.json();

  if (!tourId || !date || !guests || !guest_email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Insert booking into the bookings table
  const { data, error } = await supabase
    .from("bookings")
    .insert([
      {
        tour_id: tourId,
        user_id: null, // Guest booking, no user_id
        date,
        status: "pending",
        guests,
        guest_email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ booking: data });
}
