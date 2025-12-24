"use client"

import { calculateTotalCost, formatPrice } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { FiClock, FiDollarSign, FiMapPin } from "react-icons/fi"

export default function BookingPageClient({
  service,
  divisionsData,
  locationsData,
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

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

  const [filteredDistricts, setFilteredDistricts] = useState([])
  const [filteredCities, setFilteredCities] = useState([])

  const totalCost = calculateTotalCost(
    formData.duration.value,
    formData.duration.unit,
    service.chargePerHour,
    service.chargePerDay
  )

  // Update districts when division changes
  useEffect(() => {
    if (formData.location.division) {
      const districtsInDivision = locationsData
        .filter((loc) => loc.region === formData.location.division)
        .map((loc) => loc.district)

      const uniqueDistricts = [...new Set(districtsInDivision)]
      setFilteredDistricts(uniqueDistricts)

      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          district: "",
          city: "",
        },
      }))
      setFilteredCities([])
    } else {
      setFilteredDistricts([])
      setFilteredCities([])
    }
  }, [formData.location.division, locationsData])

  // Update cities when district changes
  useEffect(() => {
    if (formData.location.district && formData.location.division) {
      const location = locationsData.find(
        (loc) =>
          loc.region === formData.location.division &&
          loc.district === formData.location.district
      )

      if (location) {
        const cities = [location.city, ...(location.covered_area || [])]
        setFilteredCities(cities)
      } else {
        setFilteredCities([])
      }

      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          city: "",
        },
      }))
    } else {
      setFilteredCities([])
    }
  }, [formData.location.district, formData.location.division, locationsData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service._id || service.service_id,
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

  return (
    <div className="min-h-screen bg-[#FFF0F3] dark:bg-gray-900 py-12">
      <Toaster position="top-center" />

      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2 text-gray-900 dark:text-white">
          Book Service
        </h1>
        <p className="text-lg opacity-70 mb-8">
          Complete the form below to book your service
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Duration Card */}
              <div className="card bg-white dark:bg-gray-800 shadow-xl border-0">
                <div className="card-body">
                  <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
                    <FiClock className="text-[#C92C5C]" />
                    Duration
                  </h2>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      type="button"
                      className={`py-3 px-4 rounded-lg font-medium transition-all ${
                        formData.duration.unit === "hours"
                          ? "bg-[#C92C5C] text-white shadow-md"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
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
                      className={`py-3 px-4 rounded-lg font-medium transition-all ${
                        formData.duration.unit === "days"
                          ? "bg-[#C92C5C] text-white shadow-md"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
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

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Number of {formData.duration.unit}
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
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#C92C5C] focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location Card */}
              <div className="card bg-white dark:bg-gray-800 shadow-xl border-0">
                <div className="card-body">
                  <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
                    <FiMapPin className="text-[#C92C5C]" />
                    Location
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Division
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
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#C92C5C] focus:border-transparent"
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

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        District
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
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#C92C5C] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                        disabled={!formData.location.division}
                      >
                        <option value="">Select District</option>
                        {filteredDistricts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        City
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
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#C92C5C] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Area
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
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#C92C5C] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">
                      Full Address
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
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#C92C5C] focus:border-transparent h-24 resize-none"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#C92C5C] hover:bg-[#A82349] text-white shadow-lg hover:shadow-xl"
                }`}
                disabled={loading}
              >
                {loading ? "Creating Booking..." : "Confirm Booking"}
              </button>
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card bg-white dark:bg-gray-800 shadow-xl border-0 sticky top-24">
              <div className="card-body">
                <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Service
                    </p>
                    <p className="font-semibold text-lg">{service.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Duration
                    </p>
                    <p className="font-semibold">
                      {formData.duration.value} {formData.duration.unit}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Rate
                    </p>
                    <p className="font-semibold">
                      {formatPrice(
                        formData.duration.unit === "hours"
                          ? service.chargePerHour
                          : service.chargePerDay
                      )}{" "}
                      per {formData.duration.unit === "hours" ? "hour" : "day"}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FiDollarSign className="text-[#C92C5C]" />
                        <span className="font-semibold">Total Cost</span>
                      </div>
                      <span className="text-2xl font-bold text-[#C92C5C]">
                        {formatPrice(totalCost)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#FFF0F3] dark:bg-gray-700 p-4 rounded-lg mt-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      You will receive a confirmation email after booking
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
