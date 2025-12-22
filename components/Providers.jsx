/**
 * Providers Component
 *
 * Client-side wrapper for NextAuth SessionProvider.
 * This component wraps the app in NextAuth session context.
 *
 * Must be a client component because SessionProvider uses React hooks.
 */

"use client"

import { SessionProvider } from "next-auth/react"

export default function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>
}
