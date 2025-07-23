import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getSupabaseAdminClient() {
  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

async function isAdmin(req: NextRequest) {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("sb-access-token")?.value;
  if (!access_token) return false;
  const supabase = createClient(supabaseUrl, access_token);
  const { data: { user } } = await supabase.auth.getUser();
  return user && user.role === "admin";
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("id, tour_id, user_id, date, status, created_at, updated_at");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ bookings: data });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = getSupabaseAdminClient();
  const body = await req.json();
  const { bookingId, status } = body;
  if (!bookingId || !status) {
    return NextResponse.json({ error: "Missing bookingId or status" }, { status: 400 });
  }
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
