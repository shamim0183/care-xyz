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
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          await connectDB()

          const user = await User.findOne({ email: credentials.email }).select(
            "+password"
          )

          if (!user) {
            throw new Error("Invalid email or password")
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            throw new Error("Invalid email or password")
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.profileImage || null,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

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
        token.image = user.image
      }

      if (account?.provider === "google") {
        await connectDB()

        let dbUser = await User.findOne({ email: token.email })

        if (!dbUser) {
          dbUser = await User.create({
            email: token.email,
            name: token.name,
            profileImage: token.picture || null,
            nidNo: `GOOGLE_${Date.now()}`,
            contact: "N/A",
            password: await bcrypt.hash(Math.random().toString(36), 10),
            role: "user",
          })
        } else if (!dbUser.profileImage && token.picture) {
          // Update existing Google user with profile picture
          await User.findByIdAndUpdate(dbUser._id, {
            profileImage: token.picture,
          })
          dbUser.profileImage = token.picture
        }

        token.id = dbUser._id.toString()
        token.role = dbUser.role
        token.image = dbUser.profileImage || token.picture || null
      } else {
        // For credential login, fetch latest profile image from DB
        if (token.id) {
          await connectDB()
          const dbUser = await User.findById(token.id)
          if (dbUser) {
            token.image = dbUser.profileImage || null
          }
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.image = token.image || null
      }
      return session
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
})
