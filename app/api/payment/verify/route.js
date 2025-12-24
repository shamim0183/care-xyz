import { auth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Booking from "@/models/Booking"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

/**
 * Verify Stripe Payment and Update Booking
 *
 * This endpoint verifies a Stripe checkout session and updates
 * the booking status to "Paid" if payment was successful.
 *
 * This approach doesn't require webhooks!
 */
export async function POST(req) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId, bookingId } = await req.json()

    if (!sessionId || !bookingId) {
      return NextResponse.json(
        { error: "Missing sessionId or bookingId" },
        { status: 400 }
      )
    }

    // Verify the Stripe session
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId)

    if (stripeSession.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      )
    }

    await connectDB()

    // Update booking status to Paid
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: "Paid",
        stripeSessionId: sessionId,
        paidAt: new Date(),
      },
      { new: true }
    )

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Verify user owns this booking
    if (booking.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      booking: {
        _id: booking._id,
        serviceName: booking.serviceName,
        paymentStatus: booking.paymentStatus,
        totalCost: booking.totalCost,
      },
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    )
  }
}
