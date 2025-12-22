/**
 * Navbar Component
 *
 * Responsive navigation bar with authentication awareness.
 * Shows different menu items based on user login status.
 */

"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { FiBriefcase, FiLogOut, FiMenu, FiUser, FiX } from "react-icons/fi"
import ThemeToggle from "./ThemeToggle"

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  /**
   * Navigation Links
   *
   * Public links available to all users
   */
  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
  ]

  /**
   * Check if link is active
   * Used for highlighting current page
   */
  const isActive = (path) => pathname === path

  /**
   * Handle Sign Out
   * Signs the user out and redirects to homepage
   */
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <nav className="navbar sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-lg border-b border-gray-200/20 dark:border-gray-700/20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between w-full">
        {/* Left side: Mobile menu + Logo */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <div className="dropdown lg:hidden">
            <button
              tabIndex={0}
              className="btn btn-ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[60] p-2 shadow-2xl bg-white dark:bg-gray-800 rounded-box w-52 absolute left-0"
              >
                {publicLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`${
                        isActive(link.href)
                          ? "active bg-primary text-white"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}

                {session ? (
                  <>
                    <li>
                      <Link
                        href="/my-bookings"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <FiBriefcase /> My Bookings
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleSignOut}>
                        <FiLogOut /> Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>

          {/* Logo */}
          <Link href="/" className="btn btn-ghost text-xl font-bold">
            <span className="text-primary">Care</span>.xyz
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden lg:flex flex-1 justify-center">
          <ul className="menu menu-horizontal px-1">
            {publicLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={isActive(link.href) ? "active" : ""}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right side: Theme + Auth */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Authentication Buttons */}
          {session ? (
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-ghost btn-circle">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                  <FiUser size={20} />
                </div>
              </button>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li className="px-4 py-2 font-semibold border-b">
                  {session.user.name}
                </li>
                <li>
                  <Link href="/my-bookings">
                    <FiBriefcase /> My Bookings
                  </Link>
                </li>
                <li>
                  <button onClick={handleSignOut}>
                    <FiLogOut /> Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="hidden lg:flex gap-3">
              <Link
                href="/login"
                className={`px-6 py-2.5 rounded-lg font-medium border-2 transition-all ${
                  pathname === "/login"
                    ? "bg-primary text-white border-primary"
                    : "bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary dark:hover:text-primary"
                }`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={`px-6 py-2.5 rounded-lg font-medium border-2 transition-all ${
                  pathname === "/register"
                    ? "bg-primary text-white border-primary"
                    : "bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary dark:hover:text-primary"
                }`}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
