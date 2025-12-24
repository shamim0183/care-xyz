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
import { useEffect, useRef, useState } from "react"
import {
  FiBriefcase,
  FiLogOut,
  FiMenu,
  FiShield,
  FiUser,
  FiX,
} from "react-icons/fi"
import ThemeToggle from "./ThemeToggle"

export default function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const dropdownRef = useRef(null)
  const isLoading = status === "loading"

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

  /**
   * Click Outside Handler
   * Closes dropdown when clicking outside of it
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [userMenuOpen])

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
                          ? "active bg-[#C92C5C] text-white"
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
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <FiUser /> My Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/my-bookings"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <FiBriefcase /> My Bookings
                      </Link>
                    </li>
                    {session.user.role === "admin" && (
                      <li>
                        <Link
                          href="/admin/bookings"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <FiShield /> Admin Dashboard
                        </Link>
                      </li>
                    )}
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

          {/* Logo - Burgundy */}
          <Link href="/" className="btn btn-ghost text-xl font-bold">
            <span className="text-[#C92C5C]">Care</span>.xyz
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden lg:flex flex-1 justify-center">
          <ul className="menu menu-horizontal px-1">
            {publicLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={
                    isActive(link.href) ? "active bg-[#C92C5C] text-white" : ""
                  }
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
            <div className="dropdown dropdown-end" ref={dropdownRef}>
              <button
                tabIndex={0}
                className="btn btn-ghost hover:bg-[#C92C5C]/10 transition-all hover:scale-105"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="w-12 h-12 aspect-square rounded-full bg-gradient-to-br from-[#C92C5C] to-[#A82349] text-white flex items-center justify-center overflow-hidden ring-2 ring-[#C92C5C]/30 shadow-lg hover:shadow-xl transition-all">
                  {session.user.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <FiUser size={24} />
                  )}
                </div>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 z-[1] shadow-xl rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-64">
                  {/* User Info Header */}
                  <div className="px-4 py-4 bg-gradient-to-r from-[#C92C5C] to-[#A82349] text-white">
                    <p className="font-semibold text-lg">{session.user.name}</p>
                    <p className="text-sm opacity-90">{session.user.email}</p>
                    {session.user.role === "admin" && (
                      <span className="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                        Administrator
                      </span>
                    )}
                  </div>

                  {/* Menu Items */}
                  <ul className="py-2">
                    <li>
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#FFF0F3] dark:hover:bg-gray-700 transition-colors group"
                      >
                        <FiUser
                          className="text-gray-500 dark:text-gray-400 group-hover:text-[#C92C5C]"
                          size={18}
                        />
                        <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#C92C5C]">
                          My Profile
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/my-bookings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#FFF0F3] dark:hover:bg-gray-700 transition-colors group"
                      >
                        <FiBriefcase
                          className="text-gray-500 dark:text-gray-400 group-hover:text-[#C92C5C]"
                          size={18}
                        />
                        <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#C92C5C]">
                          My Bookings
                        </span>
                      </Link>
                    </li>
                    {session.user.role === "admin" && (
                      <li>
                        <Link
                          href="/admin/bookings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-[#FFF0F3] dark:hover:bg-gray-700 transition-colors group"
                        >
                          <FiShield
                            className="text-gray-500 dark:text-gray-400 group-hover:text-[#C92C5C]"
                            size={18}
                          />
                          <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#C92C5C]">
                            Admin Dashboard
                          </span>
                        </Link>
                      </li>
                    )}

                    {/* Divider */}
                    <li className="my-2 border-t border-gray-200 dark:border-gray-700"></li>

                    <li>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group w-full text-left"
                      >
                        <FiLogOut
                          className="text-gray-500 dark:text-gray-400 group-hover:text-red-600"
                          size={18}
                        />
                        <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-red-600">
                          Logout
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : isLoading ? (
            <div className="hidden lg:flex items-center gap-3">
              <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
              <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
            </div>
          ) : (
            <div className="hidden lg:flex gap-3">
              <Link
                href="/login"
                className={`px-6 py-2.5 rounded-lg font-medium border-2 transition-all ${
                  pathname === "/login"
                    ? "bg-[#C92C5C] text-white border-[#C92C5C] shadow-md"
                    : "bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-[#C92C5C] hover:text-[#C92C5C] dark:hover:text-[#C92C5C]"
                }`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={`px-6 py-2.5 rounded-lg font-medium border-2 transition-all ${
                  pathname === "/register"
                    ? "bg-[#C92C5C] text-white border-[#C92C5C] shadow-md"
                    : "bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-[#C92C5C] hover:text-[#C92C5C] dark:hover:text-[#C92C5C]"
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
