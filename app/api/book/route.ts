import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  const { tourId, date, guests, guest_email, guest_name, guest_phone, pickup_location, special_requirements } = await req.json();

  if (!tourId || !date || !guests || !guest_email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Generate booking reference
  const generateBookingReference = () => {
    const date = new Date();
    const year = date.getFullYear();
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CTT-${year}-${randomId}`;
  };

  const bookingReference = generateBookingReference();

  // Insert booking into the bookings table
  const { data, error } = await supabase
    .from("bookings")
    .insert([
      {
        tour_id: tourId,
        user_id: null, // Guest booking, no user_id
        date,
        status: "confirmed", // Set to confirmed since payment is on-site
        guests,
        guest_email,
        guest_name: guest_name || null,
        guest_phone: guest_phone || null,
        pickup_location: pickup_location || null,
        special_requirements: special_requirements || null,
        booking_reference: bookingReference,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Booking API error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send confirmation email immediately
  try {
    // Fetch tour details for the email
    const { data: tourData } = await supabase
      .from("tours")
      .select("*")
      .eq("id", tourId)
      .single();

    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/send-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        booking: data,
        tour: tourData 
      }),
    });

    if (!emailResponse.ok) {
      console.error('Failed to send confirmation email, but booking was successful');
    }
  } catch (emailError) {
    console.error('Error sending confirmation email:', emailError);
    // Don't fail the booking if email fails
  }

  return NextResponse.json({ booking: data });
}
