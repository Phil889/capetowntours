import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { access_token } = await request.json()
  if (!access_token) {
    return NextResponse.json({ error: "Missing access_token" }, { status: 400 })
  }

  // Set the HTTP-only cookie for 7 days
  const response = NextResponse.json({ success: true })
  response.cookies.set("sb-auth-token", access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
  return response
}
