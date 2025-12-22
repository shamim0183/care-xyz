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
    // User who made the booking (foreign key)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },

    // Service being booked (foreign key)
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service ID is required"],
    },

    // Cached service name for convenience
    serviceName: {
      type: String,
      required: [true, "Service name is required"],
    },

    // Duration of service
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

    // Service location details
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

    // Total cost calculation
    totalCost: {
      type: Number,
      required: [true, "Total cost is required"],
      min: [0, "Cost cannot be negative"],
    },

    // Booking status
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },

    // Payment status
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
    },

    // Stripe payment intent ID
    paymentIntentId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for common queries
BookingSchema.index({ userId: 1, createdAt: -1 }) // User's bookings by date
BookingSchema.index({ status: 1 }) // Filter by status
BookingSchema.index({ paymentStatus: 1 }) // Filter by payment

// Export the model
export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema)
