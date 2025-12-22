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
      className="bg-slate-800 dark:bg-slate-900 text-gray-100"
      style={{ outline: "1px solid rgb(30, 41, 59)", willChange: "transform" }}
    >
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
          {/* Brand Section */}
          <div className="text-left">
            <h3 className="font-bold text-lg mb-3">
              <span className="text-primary">Care</span>.xyz
            </h3>
            <p className="text-sm">
              Professional and compassionate caregiving services for your loved
              ones. Trusted care, anytime, anywhere.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-primary transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/my-bookings"
                  className="hover:text-primary transition-colors"
                >
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="text-left">
            <h4 className="font-semibold mb-3">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/service/baby-care"
                  className="hover:text-primary transition-colors"
                >
                  Baby Care
                </Link>
              </li>
              <li>
                <Link
                  href="/service/elderly-care"
                  className="hover:text-primary transition-colors"
                >
                  Elderly Care
                </Link>
              </li>
              <li>
                <Link
                  href="/service/sick-care"
                  className="hover:text-primary transition-colors"
                >
                  Sick Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-left">
            <h4 className="font-semibold mb-3">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <FiMail />
                <a
                  href="mailto:info@care.xyz"
                  className="hover:text-primary transition-colors"
                >
                  info@care.xyz
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone />
                <span>+880 1234-567890</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMapPin />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex gap-4 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-700 dark:bg-gray-600 hover:bg-primary dark:hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook size={20} className="text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-700 dark:bg-gray-600 hover:bg-primary dark:hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter size={20} className="text-white" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-700 dark:bg-gray-600 hover:bg-primary dark:hover:bg-primary flex items-center justify-center transition-colors"
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
