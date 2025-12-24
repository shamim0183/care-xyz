import { auth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    console.log("=== TEST API START ===")

    const session = await auth()
    console.log("Session:", session)

    await connectDB()
    console.log("Database connected successfully")

    return NextResponse.json({
      success: true,
      message: "Database connection test successful",
      user: session?.user || null,
    })
  } catch (error) {
    console.error("Test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    )
  }
}
