/**
 * Services API Route
 *
 * Handles retrieval of service data.
 *
 * GET /api/services - Returns all active services
 *
 * This API reads from the services.json file as a data source.
 * In production, this would query the MongoDB database.
 */

import servicesData from "@/data/services.json"
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    // Filter only active services
    const activeServices = servicesData.filter((service) => service.isActive)

    return NextResponse.json({
      success: true,
      services: activeServices,
    })
  } catch (error) {
    console.error("Services API error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    )
  }
}
