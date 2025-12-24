import { sendBookingConfirmationEmail } from "@/lib/email"
import connectDB from "@/lib/mongodb"
import Booking from "@/models/Booking"
import User from "@/models/User"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object

    await connectDB()

    const bookingId = session.metadata.bookingId

    // Update booking status and send receipt email
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: "Paid",
        stripeSessionId: session.id,
        paidAt: new Date(),
      },
      { new: true }
    )

    if (booking) {
      const user = await User.findById(booking.userId)

      if (user?.email) {
        await sendBookingConfirmationEmail({
          to: user.email,
          userName: user.name,
          bookingDetails: {
            serviceName: booking.serviceName,
            duration: booking.duration,
            location: booking.location,
            totalCost: booking.totalCost,
            bookingId: booking._id.toString(),
            status: "Paid",
            createdAt: booking.createdAt,
          },
        })
      }
    }

    console.log(`Payment successful for booking: ${bookingId}`)
  }

  return NextResponse.json({ received: true })
}
