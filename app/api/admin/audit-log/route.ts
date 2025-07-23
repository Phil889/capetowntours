import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function isAuthenticatedUser() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("sb-auth-token")?.value;
  if (!access_token) return null;
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

  // Use service role key to list audit log entries
  const supabase = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Optional: Add filtering by user, action, date range
  const { searchParams } = new URL(req.url);
  let query = supabase.from("audit_log").select("*").order("timestamp", { ascending: false });

  const userId = searchParams.get("user_id");
  const action = searchParams.get("action");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (userId) query = query.eq("user_id", userId);
  if (action) query = query.eq("action", action);
  if (from) query = query.gte("timestamp", from);
  if (to) query = query.lte("timestamp", to);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entries: data || [] });
}
