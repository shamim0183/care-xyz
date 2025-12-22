/**
 * Bookings API Route
 *
 * Handles booking operations.
 *
 * POST /api/bookings - Create a new booking
 * GET /api/bookings - Get user's bookings
 *
 * Requires authentication via NextAuth
 */

import { auth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Booking from "@/models/Booking"
import Service from "@/models/Service"
import { NextResponse } from "next/server"

/**
 * POST - Create New Booking
 */
export async function POST(req) {
  try {
    // Check authentication
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      )
    }

    // Parse request body
    const { serviceId, duration, location, totalCost } = await req.json()

    // Validate required fields
    if (!serviceId || !duration || !location || !totalCost) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Connect to database
    await connectDB()

    // Get service details
    const service = await Service.findById(serviceId)
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    // Create booking
    const booking = await Booking.create({
      userId: session.user.id,
      serviceId: service._id,
      serviceName: service.name,
      duration,
      location,
      totalCost,
      status: "Pending",
      paymentStatus: "Unpaid",
    })

    // TODO: Send email invoice here
    // await sendBookingEmail(booking);

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully",
        booking: {
          id: booking._id,
          serviceName: booking.serviceName,
          totalCost: booking.totalCost,
          status: booking.status,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Booking creation error:", error)
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}

/**
 * GET - Fetch User's Bookings
 */
export async function GET(req) {
  try {
    // Check authentication
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      )
    }

    // Connect to database
    await connectDB()

    // Fetch user's bookings
    const bookings = await Booking.find({ userId: session.user.id })
      .populate("serviceId")
      .sort({ createdAt: -1 }) // Most recent first

    return NextResponse.json({
      success: true,
      bookings,
    })
  } catch (error) {
    console.error("Fetch bookings error:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}
