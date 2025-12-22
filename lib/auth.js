/**
 * NextAuth Configuration
 *
 * This file configures authentication for the Care.xyz platform using NextAuth.js v5.
 *
 * Features:
 * - Email/Password authentication (Credentials provider)
 * - Google OAuth authentication
 * - Custom login and signup pages
 * - JWT-based sessions
 *
 * Environment Variables Required:
 * - NEXTAUTH_SECRET: Secret key for encrypting tokens
 * - NEXTAUTH_URL: Base URL of the application
 * - GOOGLE_CLIENT_ID: Google OAuth client ID
 * - GOOGLE_CLIENT_SECRET: Google OAuth client secret
 */

import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Configure authentication providers
  providers: [
    /**
     * Credentials Provider - Email & Password Login
     *
     * This provider handles traditional email/password authentication.
     * Passwords are hashed using bcrypt for security.
     */
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          // Connect to database
          await connectDB()

          // Find user by email
          const user = await User.findOne({ email: credentials.email }).select(
            "+password"
          )

          if (!user) {
            throw new Error("Invalid email or password")
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            throw new Error("Invalid email or password")
          }

          // Return user object (without password)
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),

    /**
     * Google OAuth Provider
     *
     * Allows users to sign in with their Google account.
     * User data is automatically synced to the database.
     */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  /**
   * Custom Pages
   *
   * Override default NextAuth pages with custom designs
   */
  pages: {
    signIn: "/login",
    error: "/login", // Redirect errors to login page
  },

  /**
   * Callbacks
   *
   * Customize the behavior of NextAuth
   */
  callbacks: {
    /**
     * JWT Callback
     *
     * Called whenever a JWT is created or updated.
     * Add user info to the token.
     */
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      // Handle Google OAuth sign-in
      if (account?.provider === "google") {
        await connectDB()

        // Check if user exists
        let dbUser = await User.findOne({ email: token.email })

        // If not, create a new user
        if (!dbUser) {
          dbUser = await User.create({
            email: token.email,
            name: token.name,
            nidNo: `GOOGLE_${Date.now()}`, // Temporary NID for OAuth users
            contact: "N/A",
            password: await bcrypt.hash(Math.random().toString(36), 10), // Random password
            role: "user",
          })
        }

        token.id = dbUser._id.toString()
        token.role = dbUser.role
      }

      return token
    },

    /**
     * Session Callback
     *
     * Called whenever a session is checked.
     * Add user info from token to session.
     */
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },

  /**
   * Session Strategy
   *
   * Use JWT for stateless sessions (better for serverless)
   */
  session: {
    strategy: "jwt",
  },

  /**
   * Secret Key
   *
   * Used to encrypt JWT tokens
   */
  secret: process.env.NEXTAUTH_SECRET,
})
