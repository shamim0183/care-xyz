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
import { sendBookingConfirmationEmail } from "@/lib/email"
import connectDB from "@/lib/mongodb"
import Booking from "@/models/Booking"
import User from "@/models/User"
import { NextResponse } from "next/server"

/**
 * POST - Create New Booking
 */
export async function POST(req) {
  try {
    console.log("=== BOOKING API START ===")

    // Check authentication
    const session = await auth()
    console.log("Session:", session ? "Authenticated" : "Not authenticated")
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await req.json()
    console.log("Request body:", JSON.stringify(body, null, 2))
    const { serviceId, duration, location, totalCost } = body

    // Validate required fields
    if (!serviceId || !duration || !location || !totalCost) {
      console.log("Missing fields:", {
        serviceId,
        duration,
        location,
        totalCost,
      })
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Connect to database
    console.log("Connecting to database...")
    await connectDB()
    console.log("Database connected")

    // Get service details from JSON file (services are not in database)
    console.log("Importing services.json...")
    const servicesData = (await import("@/data/services.json")).default
    console.log("Services imported, total:", servicesData.length)

    const service = servicesData.find((s) => s.service_id === serviceId)
    console.log("Service found:", service ? service.name : "NOT FOUND")

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    // Check for duplicate booking - same service on the same day
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const existingBooking = await Booking.findOne({
      userId: session.user.id,
      serviceId: service.service_id,
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
      status: { $ne: "Cancelled" },
    })

    if (existingBooking) {
      return NextResponse.json(
        {
          error:
            "You already have a booking for this service today. Please try again tomorrow or cancel your existing booking.",
        },
        { status: 400 }
      )
    }

    // Create booking
    console.log("Creating booking with data:", {
      userId: session.user.id,
      serviceId: service.service_id,
      serviceName: service.name,
      duration,
      location,
      totalCost,
      status: "Pending",
      paymentStatus: "Unpaid",
    })

    const booking = await Booking.create({
      userId: session.user.id,
      serviceId: service.service_id,
      serviceName: service.name,
      duration,
      location,
      totalCost,
      status: "Pending",
      paymentStatus: "Unpaid",
    })
    console.log("Booking created successfully:", booking._id)

    // Send email invoice to user
    try {
      console.log("Attempting to send email...")
      const user = await User.findById(session.user.id)
      if (user && user.email) {
        await sendBookingConfirmationEmail({
          to: user.email,
          userName: user.name,
          bookingDetails: {
            serviceName: booking.serviceName,
            duration: booking.duration,
            location: booking.location,
            totalCost: booking.totalCost,
            bookingId: booking._id.toString(),
            status: booking.status,
            createdAt: booking.createdAt,
          },
        })
        console.log("Email sent successfully")
      }
    } catch (emailError) {
      // Log email error but don't fail the booking
      console.error("Email send failed:", emailError)
    }

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
    console.error("=== BOOKING ERROR ===")
    console.error("Error name:", error.name)
    console.error("Error message:", error.message)
    console.error("Error stack:", error.stack)
    return NextResponse.json(
      { error: "Failed to create booking", details: error.message },
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
