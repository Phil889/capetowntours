import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Helper to check admin auth (reuse logic from other admin routes)
function getAccessToken(request: NextRequest) {
  return request.cookies.get("sb-auth-token")?.value;
}

async function isAdmin(request: NextRequest) {
  const accessToken = getAccessToken(request);
  if (!accessToken) return false;
  // Optionally: check user role in Supabase
  // For now, just require login
  return true;
}

// GET /api/admin/tours/[tourId]/availability?date=YYYY-MM-DD
export async function GET(request: NextRequest, { params }: { params: { tourId: string } }) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { tourId } = params;
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  let query = supabase.from("tour_availability").select("*").eq("tour_id", tourId);
  if (date) {
    query = query.eq("date", date);
  }
  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST /api/admin/tours/[tourId]/availability
export async function POST(request: NextRequest, { params }: { params: { tourId: string } }) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { tourId } = params;
  const body = await request.json();
  const { date, available_slots } = body;
  if (!date || typeof available_slots !== "number") {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  // Upsert (insert or update) availability for the given tour/date
  const { error } = await supabase
    .from("tour_availability")
    .upsert([{ tour_id: tourId, date, available_slots }], { onConflict: "tour_id,date" });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
