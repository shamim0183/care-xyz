/**
 * Booking Page
 *
 * Protected page for creating a service booking.
 * Route: /booking/[service_id]
 *
 * Features:
 * - Service summary display
 * - Duration selection (hours/days toggle)
 * - Location form with cascading dropdowns (Division → District → City → Area)
 * - Real-time cost calculation
 * - Booking confirmation
 *
 * Requires authentication (protected by middleware)
 */

"use client"

import divisionsData from "@/data/divisions.json"
import locationsData from "@/data/locations.json"
import servicesData from "@/data/services.json"
import { calculateTotalCost, formatPrice } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { FiClock, FiDollarSign, FiMapPin } from "react-icons/fi"

export default function BookingPage({ params }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

  // Find the service
  const service = servicesData.find((s) => s.service_id === params.service_id)

  // Form state
  const [formData, setFormData] = useState({
    duration: {
      value: 1,
      unit: "hours",
    },
    location: {
      division: "",
      district: "",
      city: "",
      area: "",
      address: "",
    },
  })

  // Filtered location options
  const [filteredDistricts, setFilteredDistricts] = useState([])
  const [filteredCities, setFilteredCities] = useState([])

  /**
   * Calculate total cost based on duration
   */
  const totalCost = service
    ? calculateTotalCost(
        formData.duration.value,
        formData.duration.unit,
        service.chargePerHour,
        service.chargePerDay
      )
    : 0

  /**
   * Handle division change - update districts
   */
  useEffect(() => {
    if (formData.location.division) {
      const districtsForDivision = locationsData.filter(
        (loc) => loc.region === formData.location.division
      )
      setFilteredDistricts(districtsForDivision)

      // Reset district and city when division changes
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          district: "",
          city: "",
        },
      }))
    }
  }, [formData.location.division])

  /**
   * Handle district change - update cities
   */
  useEffect(() => {
    if (formData.location.district) {
      const location = locationsData.find(
        (loc) =>
          loc.region === formData.location.division &&
          loc.district === formData.location.district
      )

      if (location) {
        setFilteredCities(location.covered_area || [location.city])
      }

      // Reset city when district changes
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          city: "",
        },
      }))
    }
  }, [formData.location.district, formData.location.division])

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service._id || service.service_id, // Adjust based on your data structure
          duration: formData.duration,
          location: formData.location,
          totalCost,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Booking created successfully!")
        setTimeout(() => {
          router.push("/my-bookings")
        }, 1500)
      } else {
        toast.error(data.error || "Failed to create booking")
      }
    } catch (error) {
      console.error("Booking error:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg">Service not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Toaster position="top-center" />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Book Service</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Duration Section */}
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title">
                    <FiClock /> Duration
                  </h2>

                  {/* Unit Toggle */}
                  <div className="flex gap-2 mb-4">
                    <button
                      type="button"
                      className={`btn btn-sm flex-1 ${
                        formData.duration.unit === "hours"
                          ? "btn-primary"
                          : "btn-outline"
                      }`}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          duration: { ...formData.duration, unit: "hours" },
                        })
                      }
                    >
                      Hourly
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm flex-1 ${
                        formData.duration.unit === "days"
                          ? "btn-primary"
                          : "btn-outline"
                      }`}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          duration: { ...formData.duration, unit: "days" },
                        })
                      }
                    >
                      Daily
                    </button>
                  </div>

                  {/* Duration Value */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">
                        Number of {formData.duration.unit}
                      </span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.duration.value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: {
                            ...formData.duration,
                            value: parseInt(e.target.value),
                          },
                        })
                      }
                      className="input input-bordered"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title">
                    <FiMapPin /> Location
                  </h2>

                  {/* Division */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Division</span>
                    </label>
                    <select
                      value={formData.location.division}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            ...formData.location,
                            division: e.target.value,
                          },
                        })
                      }
                      className="select select-bordered"
                      required
                    >
                      <option value="">Select Division</option>
                      {divisionsData.map((div) => (
                        <option key={div} value={div}>
                          {div}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">District</span>
                    </label>
                    <select
                      value={formData.location.district}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            ...formData.location,
                            district: e.target.value,
                          },
                        })
                      }
                      className="select select-bordered"
                      required
                      disabled={!formData.location.division}
                    >
                      <option value="">Select District</option>
                      {filteredDistricts.map((loc) => (
                        <option key={loc.district} value={loc.district}>
                          {loc.district}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">City</span>
                    </label>
                    <select
                      value={formData.location.city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            ...formData.location,
                            city: e.target.value,
                          },
                        })
                      }
                      className="select select-bordered"
                      required
                      disabled={!formData.location.district}
                    >
                      <option value="">Select City</option>
                      {filteredCities.map((city, idx) => (
                        <option key={idx} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Area */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Area</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Uttara, Dhanmondi"
                      value={formData.location.area}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            ...formData.location,
                            area: e.target.value,
                          },
                        })
                      }
                      className="input input-bordered"
                      required
                    />
                  </div>

                  {/* Full Address */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Full Address</span>
                    </label>
                    <textarea
                      placeholder="House/flat number, street, landmarks"
                      value={formData.location.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            ...formData.location,
                            address: e.target.value,
                          },
                        })
                      }
                      className="textarea textarea-bordered h-24"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`btn btn-primary w-full btn-lg ${
                  loading ? "loading" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Creating Booking..." : "Confirm Booking"}
              </button>
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-lg sticky top-24">
              <div className="card-body">
                <h2 className="card-title">Booking Summary</h2>

                <div className="divider"></div>

                {/* Service Info */}
                <div className="space-y-2">
                  <div>
                    <p className="text-sm opacity-70">Service</p>
                    <p className="font-semibold">{service.name}</p>
                  </div>

                  <div>
                    <p className="text-sm opacity-70">Duration</p>
                    <p className="font-semibold">
                      {formData.duration.value} {formData.duration.unit}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm opacity-70">Rate</p>
                    <p className="font-semibold">
                      {formatPrice(
                        formData.duration.unit === "hours"
                          ? service.chargePerHour
                          : service.chargePerDay
                      )}{" "}
                      per {formData.duration.unit === "hours" ? "hour" : "day"}
                    </p>
                  </div>
                </div>

                <div className="divider"></div>

                {/* Total Cost */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiDollarSign className="text-primary" />
                    <span className="font-semibold">Total Cost</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(totalCost)}
                  </span>
                </div>

                <div className="alert alert-info mt-4">
                  <p className="text-xs">
                    You will receive a confirmation email after booking
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
