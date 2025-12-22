/**
 * Service Model
 *
 * This model defines the caregiving services offered on the platform.
 * Services include Baby Care, Elderly Care, and Sick People Care.
 *
 * Fields:
 * - service_id: Unique identifier (slug) for the service
 * - name: Display name of the service
 * - description: Detailed description of what the service includes
 * - shortDescription: Brief summary for service cards
 * - features: Array of service features/benefits
 * - chargePerHour: Hourly rate in BDT
 * - chargePerDay: Daily rate in BDT
 * - imageUrl: Path to service image
 * - category: Type of care (child, elderly, sick)
 * - isActive: Whether the service is currently available
 */

import mongoose from "mongoose"

const ServiceSchema = new mongoose.Schema(
  {
    // Unique service identifier (e.g., "baby-care")
    service_id: {
      type: String,
      required: [true, "Service ID is required"],
      unique: true,
      trim: true,
    },

    // Service display name
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },

    // Detailed description
    description: {
      type: String,
      required: [true, "Description is required"],
    },

    // Short description for cards
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      maxlength: [200, "Short description must be less than 200 characters"],
    },

    // Array of service features
    features: {
      type: [String],
      required: [true, "Features are required"],
      validate: {
        validator: function (v) {
          return v && v.length > 0
        },
        message: "At least one feature is required",
      },
    },

    // Pricing - hourly rate
    chargePerHour: {
      type: Number,
      required: [true, "Hourly charge is required"],
      min: [0, "Charge cannot be negative"],
    },

    // Pricing - daily rate
    chargePerDay: {
      type: Number,
      required: [true, "Daily charge is required"],
      min: [0, "Charge cannot be negative"],
    },

    // Image URL or path
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },

    // Category of care
    category: {
      type: String,
      enum: ["child", "elderly", "sick"],
      required: [true, "Category is required"],
    },

    // Active status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Index for faster queries
ServiceSchema.index({ service_id: 1 })
ServiceSchema.index({ category: 1 })
ServiceSchema.index({ isActive: 1 })

// Export the model
export default mongoose.models.Service ||
  mongoose.model("Service", ServiceSchema)
