/**
 * Footer Component
 *
 * Site footer with links, contact info, and social media.
 * Responsive design with DaisyUI components.
 *
 * Sections:
 * - Brand info and tagline
 * - Quick links (navigation)
 * - Services links
 * - Contact information
 * - Copyright notice
 */
"use client"

import Link from "next/link"
import {
  FiFacebook,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiPhone,
  FiTwitter,
} from "react-icons/fi"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-gray-900 dark:to-black text-gray-100 border-t border-[#C92C5C]/20"
      style={{ willChange: "transform" }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
          {/* Brand Section */}
          <div className="text-left">
            <h3 className="font-bold text-xl mb-3 font-serif">
              <span className="text-[#C92C5C]">Care</span>.xyz
            </h3>
            <p className="text-sm">
              Professional and compassionate caregiving services for your loved
              ones. Trusted care, anytime, anywhere.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h4 className="font-semibold mb-4 text-[#C92C5C] uppercase tracking-wide text-sm">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#C92C5C] transition-colors text-gray-300 hover:translate-x-1 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-[#C92C5C] transition-colors text-gray-300 hover:translate-x-1 inline-block"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#C92C5C] transition-colors text-gray-300 hover:translate-x-1 inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/my-bookings"
                  className="hover:text-[#C92C5C] transition-colors text-gray-300 hover:translate-x-1 inline-block"
                >
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="text-left">
            <h4 className="font-semibold mb-4 text-[#C92C5C] uppercase tracking-wide text-sm">
              Our Services
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/service/baby-care"
                  className="hover:text-[#C92C5C] transition-colors text-gray-300 hover:translate-x-1 inline-block"
                >
                  Baby Care
                </Link>
              </li>
              <li>
                <Link
                  href="/service/elderly-care"
                  className="hover:text-[#C92C5C] transition-colors text-gray-300 hover:translate-x-1 inline-block"
                >
                  Elderly Care
                </Link>
              </li>
              <li>
                <Link
                  href="/service/sick-care"
                  className="hover:text-[#C92C5C] transition-colors text-gray-300 hover:translate-x-1 inline-block"
                >
                  Sick Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-left">
            <h4 className="font-semibold mb-4 text-[#C92C5C] uppercase tracking-wide text-sm">
              Contact Us
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-gray-300">
                <FiMail className="text-[#C92C5C]" />
                <a
                  href="mailto:info@care.xyz"
                  className="hover:text-[#C92C5C] transition-colors"
                >
                  info@care.xyz
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <FiPhone className="text-[#C92C5C]" />
                <span>+880 1234-567890</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <FiMapPin className="text-[#C92C5C]" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex gap-3 mt-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-700/50 hover:bg-[#C92C5C] dark:bg-gray-600 dark:hover:bg-[#C92C5C] flex items-center justify-center transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <FiFacebook size={20} className="text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-700/50 hover:bg-[#C92C5C] dark:bg-gray-600 dark:hover:bg-[#C92C5C] flex items-center justify-center transition-all hover:scale-110"
                aria-label="Twitter"
              >
                <FiTwitter size={20} className="text-white" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-700/50 hover:bg-[#C92C5C] dark:bg-gray-600 dark:hover:bg-[#C92C5C] flex items-center justify-center transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <FiInstagram size={20} className="text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 dark:border-gray-800 w-full mt-8 pt-6 text-center">
          <p className="text-sm text-gray-300">
            © {currentYear} Care.xyz. All rights reserved. | Providing trusted
            care services across Bangladesh.
          </p>
        </div>
      </div>
    </footer>
  )
}
