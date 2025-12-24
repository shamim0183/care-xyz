/**
 * Upload Image to ImgBB
 *
 * POST /api/upload/image
 * Uploads image to ImgBB and returns the hosted URL
 */

import { NextResponse } from "next/server"

const IMGBB_API_KEY = process.env.IMGBB_API_KEY

export async function POST(req) {
  try {
    // Allow uploads without authentication for registration
    // Session check removed to support profile image upload during registration

    const formData = await req.formData()
    const image = formData.get("image")

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString("base64")

    // Upload to ImgBB
    const imgbbFormData = new FormData()
    imgbbFormData.append("image", base64Image)

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body: imgbbFormData,
      }
    )

    const data = await response.json()

    if (data.success) {
      return NextResponse.json({
        success: true,
        url: data.data.url,
        deleteUrl: data.data.delete_url,
      })
    } else {
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Image upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    )
  }
}
