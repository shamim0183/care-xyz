/**
 * Middleware for Route Protection
 *
 * Simple middleware that redirects unauthenticated users to login.
 * Does NOT import MongoDB - uses only NextAuth session checking.
 */

import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = request.nextUrl

  // Check if user is authenticated
  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check admin routes
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/booking/:path*",
    "/my-bookings",
    "/payment/:path*",
    "/profile",
    "/admin/:path*",
  ],
}
