/**
 * Middleware for Route Protection
 *
 * This middleware runs on every request and protects routes that require authentication.
 * If a user tries to access a protected route without being logged in, they are
 * redirected to the login page with a callback URL to return after login.
 *
 * Protected Routes:
 * - /booking/* - Booking pages (requires login)
 * - /my-bookings - User's bookings page (requires login)
 * - /payment/* - Payment pages (requires login)
 */

export { auth as middleware } from "@/lib/auth"

/**
 * Matcher Configuration
 *
 * Specify which routes this middleware should run on.
 * This prevents unnecessary middleware execution on public routes.
 */
export const config = {
  matcher: [
    "/booking/:path*", // All booking routes
    "/my-bookings", // My bookings page
    "/payment/:path*", // Payment routes
  ],
}
