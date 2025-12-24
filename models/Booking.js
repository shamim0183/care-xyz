/**
 * Booking Model
 *
 * This model represents a service booking made by a user.
 * It stores all booking details including duration, location, cost, and payment status.
 *
 * Fields:
 * - userId: Reference to the User who made the booking
 * - serviceId: Reference to the Service being booked
 * - serviceName: Cached service name for easy display
 * - duration: Object with value and unit (hours/days)
 * - location: Nested object with full address details
 * - totalCost: Calculated total cost in BDT
 * - status: Booking status (Pending, Confirmed, Completed, Cancelled)
 * - paymentStatus: Payment status (Unpaid, Paid)
 * - paymentIntentId: Stripe payment ID (if payment made)
 */

import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    serviceId: {
      type: String,
      required: [true, "Service ID is required"],
    },
    serviceName: {
      type: String,
      required: [true, "Service name is required"],
    },
    duration: {
      value: {
        type: Number,
        required: [true, "Duration value is required"],
        min: [1, "Duration must be at least 1"],
      },
      unit: {
        type: String,
        enum: ["hours", "days"],
        required: [true, "Duration unit is required"],
      },
    },
    location: {
      division: {
        type: String,
        required: [true, "Division is required"],
      },
      district: {
        type: String,
        required: [true, "District is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      area: {
        type: String,
        required: [true, "Area is required"],
      },
      address: {
        type: String,
        required: [true, "Full address is required"],
      },
    },
    totalCost: {
      type: Number,
      required: [true, "Total cost is required"],
      min: [0, "Cost cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
    },
    paymentIntentId: {
      type: String,
      default: null,
    },
    stripeSessionId: {
      type: String,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

BookingSchema.index({ userId: 1, createdAt: -1 })
BookingSchema.index({ status: 1 })
BookingSchema.index({ paymentStatus: 1 })

// Force delete cached model to ensure schema changes are applied
if (mongoose.models.Booking) {
  delete mongoose.models.Booking
}

export default mongoose.model("Booking", BookingSchema)
