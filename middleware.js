/**
 * Middleware for Route Protection
 *
 * Uses NextAuth's auth() function for proper session verification on Vercel.
 * This approach is more compatible with Edge Runtime and serverless environments.
 */

import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function middleware(request) {
  const session = await auth()
  const { pathname } = request.nextUrl

  // Check if user is authenticated
  if (!session || !session.user) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check admin routes
  if (pathname.startsWith("/admin") && session.user.role !== "admin") {
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
