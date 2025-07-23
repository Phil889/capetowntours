import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// CSV utility
function toCSV(rows: any[]): string {
  if (!rows.length) return "";
  const header = Object.keys(rows[0]).join(",");
  const data = rows.map(row =>
    Object.values(row)
      .map(v => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header, ...data].join("\r\n");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function isAuthenticatedUser() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("sb-auth-token")?.value;
  if (!access_token) return null;
  // Pass the access token as a Bearer token in the global headers
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${access_token}` } }
  });
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET(req: NextRequest) {
  const user = await isAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { searchParams } = new URL(req.url);

  // Filters: date range, tour, status
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const tour_id = searchParams.get("tour_id");
  const status = searchParams.get("status");

  let query = supabase.from("bookings").select("id, tour_id, user_id, date, status, created_at, updated_at");

  if (from) query = query.gte("date", from);
  if (to) query = query.lte("date", to);
  if (tour_id) query = query.eq("tour_id", tour_id);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const csv = toCSV(data || []);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=bookings.csv"
    }
  });
}
