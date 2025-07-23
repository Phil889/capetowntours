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

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  const user = await isAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = params;
  const { role } = await req.json();

  if (!role) {
    return NextResponse.json({ error: "Missing role" }, { status: 400 });
  }

  // Use service role key to update user role
  const supabase = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Upsert user role
  const { error } = await supabase
    .from("user_roles")
    .upsert([{ user_id: userId, role }], { onConflict: "user_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
