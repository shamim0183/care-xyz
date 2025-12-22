/**
 * Root Layout
 *
 * This is the main layout component that wraps all pages.
 * It includes:
 * - Global styles
 * - Providers for NextAuth session
 * - Navbar and Footer
 * - Toast notifications
 *
 * All pages inherit this layout.
 */

import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import Providers from "@/components/Providers"
import { Toaster } from "react-hot-toast"
import "./globals.css"

export const metadata = {
  title: "Care.xyz - Trusted Caregiving Services in Bangladesh",
  description:
    "Professional and compassionate caregiving services for babies, elderly, and sick people. Book verified care services easily across Bangladesh.",
  keywords: "caregiving, baby care, elderly care, sick care, Bangladesh, Dhaka",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {/* Toast Notifications */}
          <Toaster position="top-center" />

          {/* Navigation Bar */}
          <Navbar />

          {/* Main Content */}
          <main className="min-h-screen">{children}</main>

          {/* Footer */}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
