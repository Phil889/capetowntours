import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  const { bookingId, customItineraryId, paymentDetails } = await req.json();

  if (!bookingId && !customItineraryId) {
    return NextResponse.json({ error: "Missing bookingId or customItineraryId" }, { status: 400 });
  }

  // Simulate payment processing (replace with Stripe integration in production)
  const paymentSuccess = true; // Simulate always successful

  if (!paymentSuccess) {
    return NextResponse.json({ error: "Payment failed" }, { status: 402 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  if (customItineraryId) {
    // Update custom_itineraries status to "paid"
    const { data, error } = await supabase
      .from("custom_itineraries")
      .update({ status: "paid", updated_at: new Date().toISOString() })
      .eq("id", customItineraryId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send confirmation email (fire and forget)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"}/api/send-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking: data }),
      });
    } catch (e) {
      // Log but do not block payment
      console.error("Failed to send confirmation email:", e);
    }

    return NextResponse.json({ booking: data });
  } else {
    // Update booking status to "confirmed"
    const { data, error } = await supabase
      .from("bookings")
      .update({ status: "confirmed", updated_at: new Date().toISOString() })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send confirmation email (fire and forget)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"}/api/send-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking: data }),
      });
    } catch (e) {
      // Log but do not block payment
      console.error("Failed to send confirmation email:", e);
    }

    return NextResponse.json({ booking: data });
  }
}
