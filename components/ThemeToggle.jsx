"use client"

import { useEffect, useState } from "react"
import { FiMoon, FiSun } from "react-icons/fi"

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light")
  const [mounted, setMounted] = useState(false)

  // Only run on client side
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light"

    // Apply theme to DOM immediately (no React state involved)
    document.documentElement.setAttribute("data-theme", savedTheme)
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Defer all React state updates to avoid synchronous setState
    queueMicrotask(() => {
      setTheme(savedTheme)
      setMounted(true)
    })
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle"
      aria-label="Toggle theme"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <FiSun className="h-5 w-5 text-yellow-400" />
      ) : (
        <FiMoon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  )
}
