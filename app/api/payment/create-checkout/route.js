import { auth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Booking from "@/models/Booking"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { bookingId } = await req.json()

    await connectDB()

    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    if (booking.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (booking.paymentStatus === "Paid") {
      return NextResponse.json(
        { error: "Booking already paid" },
        { status: 400 }
      )
    }

    // Get service details from JSON file to display image in Stripe
    const servicesData = (await import("@/data/services.json")).default
    const service = servicesData.find((s) => s.service_id === booking.serviceId)

    // Create Stripe checkout session with service image and description
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: booking.serviceName,
              description:
                service?.shortDescription ||
                `${booking.duration.value} ${booking.duration.unit} - ${booking.location.city}, ${booking.location.area}`,
              images: service?.image ? [service.image] : [],
            },
            unit_amount: Math.round(booking.totalCost * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/my-bookings?payment=cancelled`,
      client_reference_id: bookingId,
      customer_email: session.user.email,
      metadata: {
        bookingId: bookingId,
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    })
  } catch (error) {
    console.error("Checkout session error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
