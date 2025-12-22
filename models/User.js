/**
 * User Model
 *
 * This model defines the schema for users in the Care.xyz platform.
 * Users can register with their NID, email, and password, and can have
 * different roles (user or admin).
 *
 * Fields:
 * - nidNo: National ID number (unique identifier for Bangladesh citizens)
 * - name: Full name of the user
 * - email: Email address (used for login and communication)
 * - contact: Phone number for contact
 * - password: Hashed password (never store plain text passwords!)
 * - role: 'user' or 'admin' (determines access level)
 */

import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    // National ID Number - unique identifier
    nidNo: {
      type: String,
      required: [true, "NID number is required"],
      unique: true,
      trim: true,
    },

    // Full name of the user
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    // Email address - must be unique
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    // Contact number
    contact: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },

    // Hashed password (bcrypt)
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password in queries by default
    },

    // User role - determines permissions
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
)

// Index for faster queries on email
UserSchema.index({ email: 1 })

// Export the model
// Check if model already exists to prevent OverwriteModelError during hot reload
export default mongoose.models.User || mongoose.model("User", UserSchema)
