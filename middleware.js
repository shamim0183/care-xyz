/**
 * Middleware for Route Protection
 *
 * Uses getToken() for Edge Runtime compatibility.
 * Configured for NextAuth v5 with proper environment variable handling.
 */

import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function middleware(request) {
  // Use AUTH_SECRET (NextAuth v5) or fallback to NEXTAUTH_SECRET
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET

  const token = await getToken({
    req: request,
    secret: secret,
    secureCookie: process.env.NODE_ENV === "production",
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
