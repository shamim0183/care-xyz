/**
 * Admin Booking Management API
 *
 * PUT /api/admin/bookings/[id] - Update booking status (admin only)
 */

import { auth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Booking from "@/models/Booking"
import { NextResponse } from "next/server"

export async function PUT(req, { params }) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { status } = await req.json()

    if (!["Pending", "Confirmed", "Completed", "Cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    await connectDB()

    const booking = await Booking.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    )

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error("Admin update booking error:", error)
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    )
  }
}
