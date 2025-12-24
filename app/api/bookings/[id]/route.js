/**
 * Get Single Booking by ID
 *
 * GET /api/bookings/[id]
 * PUT /api/bookings/[id] - Update booking status
 */

import { auth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Booking from "@/models/Booking"
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const booking = await Booking.findById(params.id)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check if booking belongs to user
    if (booking.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error("Get booking error:", error)
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    )
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status } = await req.json()

    await connectDB()

    const booking = await Booking.findById(params.id)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check if booking belongs to user
    if (booking.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update booking status
    booking.status = status
    await booking.save()

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error("Update booking error:", error)
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    )
  }
}
