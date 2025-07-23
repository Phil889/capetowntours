import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(request: NextRequest) {
  // Check for Supabase session cookie (set by login)
  const accessToken = request.cookies.get("sb-auth-token")?.value
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Optionally: verify the user is an admin (for now, just require login)
  // You can enhance this by checking user roles in Supabase

  const data = await request.json()
  const { title, description, price, category, duration_days, image_url } = data

  // Basic validation
  if (!title || !description || !price) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Insert into Supabase
  const { error } = await supabase
    .from("tours")
    .insert([
      { title, description, price, category, duration_days, image_url }
    ])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
