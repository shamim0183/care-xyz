import { auth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Booking from "@/models/Booking"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    console.log("=== TEST BOOKING CREATE ===")

    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    await connectDB()
    console.log("Database connected")

    const testData = {
      userId: session.user.id,
      serviceId: "elderly-care",
      serviceName: "Elderly Care Service",
      duration: {
        value: 1,
        unit: "hours",
      },
      location: {
        division: "Dhaka",
        district: "Dhaka",
        city: "Dhaka",
        area: "Uttara",
        address: "Test address 123",
      },
      totalCost: 250,
      status: "Pending",
      paymentStatus: "Unpaid",
    }

    console.log("Test data:", JSON.stringify(testData, null, 2))

    const booking = await Booking.create(testData)
    console.log("Booking created:", booking._id)

    return NextResponse.json({
      success: true,
      booking: {
        id: booking._id,
        serviceName: booking.serviceName,
        totalCost: booking.totalCost,
      },
    })
  } catch (error) {
    console.error("=== BOOKING CREATE ERROR ===")
    console.error("Name:", error.name)
    console.error("Message:", error.message)
    console.error("Errors:", error.errors)
    console.error("Stack:", error.stack)

    return NextResponse.json(
      {
        error: error.message,
        name: error.name,
        errors: error.errors,
        stack: error.stack,
      },
      { status: 500 }
    )
  }
}
