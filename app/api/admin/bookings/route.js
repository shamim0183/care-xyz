/**
 * Admin Bookings API
 *
 * GET /api/admin/bookings - Get all bookings (admin only)
 */

import { auth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Booking from "@/models/Booking"
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await connectDB()

    // Fetch all bookings with user details
    const bookings = await Booking.find({})
      .populate("userId", "name email contact")
      .populate("serviceId")
      .sort({ createdAt: -1 })

    return NextResponse.json({ success: true, bookings })
  } catch (error) {
    console.error("Admin fetch bookings error:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}
