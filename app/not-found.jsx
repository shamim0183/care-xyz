/**
 * Custom 404 Not Found Page
 *
 * Displayed when user navigates to a non-existent page.
 * Inspired by Welleden template design.
 */

import Link from "next/link"
import { FiArrowLeft, FiHome } from "react-icons/fi"

export const metadata = {
  title: "404 - Page Not Found | Care.xyz",
  description: "The page you're looking for doesn't exist.",
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Number */}
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h2>
        <p className="text-lg opacity-70 mb-8">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="btn btn-primary gap-2">
            <FiHome />
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline gap-2"
          >
            <FiArrowLeft />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12">
          <p className="text-sm opacity-70 mb-4">Helpful links:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/services" className="link link-primary">
              Browse Services
            </Link>
            <Link href="/about" className="link link-primary">
              About Us
            </Link>
            <Link href="/my-bookings" className="link link-primary">
              My Bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
