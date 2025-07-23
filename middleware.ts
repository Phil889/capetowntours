import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Protect all /admin routes except /admin/login
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public access to /admin/login
  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  // Only run on /admin and subroutes
  if (pathname.startsWith("/admin")) {
    // Check for HTTP-only auth cookie set after login
    const hasSession = request.cookies.has("sb-auth-token")
    if (!hasSession) {
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("redirected", "1")
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// Apply middleware only to /admin routes
export const config = {
  matcher: ["/admin/:path*"],
}
