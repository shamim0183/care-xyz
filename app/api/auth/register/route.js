/**
 * Registration API Route
 * 
 * Handles user registration for the Care.xyz platform.
 * 
 * Flow:
 * 1. Validate input data
 * 2. Check if user already exists (email or NID)
 * 3. Hash password with bc rypt
 * 4. Create user in database
 * 5. Return success response
 * 
 * Request Body:
 * - nidNo: National ID number
 * - name: Full name
 * - email: Email address
 * - contact: Phone number
 * - password: Plain text password (will be hashed)
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    // Parse request body
    const { nidNo, name, email, contact, password } = await req.json();

    // Validate required fields
    if (!nidNo || !name || !email || !contact || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      return NextResponse.json(
        { error: "Password must contain at least one uppercase and one lowercase letter" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user already exists (by email or NID)
    const existingUser = await User.findOne({
      $or: [{ email }, { nidNo }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 409 }
        );
      }
      if (existingUser.nidNo === nidNo) {
        return NextResponse.json(
          { error: "NID already registered" },
          { status: 409 }
        );
      }
    }

    // Hash password (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      nidNo,
      name,
      email: email.toLowerCase(),
      contact,
      password: hashedPassword,
      role: "user", // Default role
    });

    // Return success response (don't send password)
    return NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Email or NID already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
