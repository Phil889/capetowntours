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

// GET /api/admin/tours/[tourId]
export async function GET(request: NextRequest, { params }: { params: { tourId: string } }) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { tourId } = await params;
  const { data, error } = await supabase.from("tours").select("*").eq("id", tourId).single();
  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Tour not found" }, { status: 404 });
  }
  return NextResponse.json(data);
}

// PUT /api/admin/tours/[tourId]
export async function PUT(request: NextRequest, { params }: { params: { tourId: string } }) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { tourId } = await params;
  const body = await request.json();
  // Basic validation
  if (!body.title || !body.description || !body.price) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const updateFields = {
    title: body.title,
    description: body.description,
    price: body.price,
    category: body.category,
    duration_days: body.duration_days,
    image_url: body.image_url,
    availability: body.availability,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("tours").update(updateFields).eq("id", tourId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
