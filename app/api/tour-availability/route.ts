import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET /api/tour-availability?tourId=...&date=YYYY-MM-DD
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tourId = searchParams.get("tourId");
  const date = searchParams.get("date");

  if (!tourId || !date) {
    return NextResponse.json({ error: "Missing tourId or date" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("tour_availability")
    .select("available_slots")
    .eq("tour_id", tourId)
    .eq("date", date)
    .single();

  if (error && error.code !== "PGRST116") { // PGRST116: No rows found
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If no row, treat as unavailable (0 slots)
  const availableSlots = data?.available_slots ?? 0;

  return NextResponse.json({ availableSlots });
}
