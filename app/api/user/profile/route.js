/**
 * User Profile API
 *
 * GET /api/user/profile - Get current user profile
 * PUT /api/user/profile - Update user profile (including profile image)
 */

import { auth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findById(session.user.id).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

export async function PUT(req) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { profileImage, name, contact } = await req.json()

    await connectDB()

    const updateData = {}
    if (profileImage !== undefined) updateData.profileImage = profileImage
    if (name) updateData.name = name
    if (contact) updateData.contact = contact

    const user = await User.findByIdAndUpdate(session.user.id, updateData, {
      new: true,
    }).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}
