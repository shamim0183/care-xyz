"use client"

import servicesData from "@/data/services.json"
import { formatDate, formatPrice } from "@/lib/utils"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import {
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiX,
} from "react-icons/fi"

export default function MyBookingsPage() {
  const { data: session } = useSession()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const { data } = await axios.get("/api/bookings")
        setBookings(data.bookings)
      } catch (error) {
        console.error("Fetch bookings error:", error)
        toast.error(error.response?.data?.error || "Error loading bookings")
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchBookings()
    }
  }, [session])

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return
    }

    try {
      await axios.put(`/api/bookings/${bookingId}`, {
        status: "Cancelled",
      })

      toast.success("Booking cancelled successfully")
      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "Cancelled" }
            : booking
        )
      )
    } catch (error) {
      console.error("Cancel booking error:", error)
      toast.error(error.response?.data?.error || "Error cancelling booking")
    }
  }

  const handlePayment = async (bookingId) => {
    try {
      toast.loading("Creating payment session...")

      const response = await fetch("/api/payment/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error("Failed to create payment session")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("Error processing payment")
    }
  }

  // Get service details by serviceId
  const getServiceDetails = (serviceId) => {
    return servicesData.find((s) => s.service_id === serviceId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-[#C92C5C]"></span>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading your bookings...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <Toaster position="top-center" />

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2 text-gray-900 dark:text-white">
            My Bookings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track all your care service bookings
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-[#FFF0F3] dark:bg-[#C92C5C]/20 rounded-full flex items-center justify-center">
              <FiClock className="text-[#C92C5C]" size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              No bookings yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't made any bookings yet. Browse our services to get
              started!
            </p>
            <a
              href="/services"
              className="inline-block bg-[#C92C5C] hover:bg-[#A82349] text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Browse Services
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking) => {
              const service = getServiceDetails(booking.serviceId)

              return (
                <div
                  key={booking._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div className="md:flex">
                    {/* Service Image */}
                    <div className="md:w-1/3 lg:w-1/4 relative">
                      <div className="aspect-[4/3] md:aspect-[3/4] relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={service?.image || "/placeholder-service.jpg"}
                          alt={booking.serviceName}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                        {/* Status Badge on Image */}
                        <div className="absolute top-4 left-4">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm ${
                              booking.status === "Pending"
                                ? "bg-orange-500/90 text-white"
                                : booking.status === "Confirmed"
                                ? "bg-blue-500/90 text-white"
                                : booking.status === "Completed"
                                ? "bg-green-500/90 text-white"
                                : "bg-gray-500/90 text-white"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>

                        {/* Payment Status Badge */}
                        {booking.paymentStatus === "Paid" && (
                          <div className="absolute top-4 right-4">
                            <span className="px-4 py-2 rounded-full text-sm font-bold bg-emerald-500 text-white shadow-lg backdrop-blur-sm inline-flex items-center gap-2">
                              <FiCheckCircle /> Paid
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="md:w-2/3 lg:w-3/4 p-6 md:p-8">
                      <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="mb-4">
                          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                            {booking.serviceName}
                          </h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Booked on {formatDate(booking.createdAt)}
                          </p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                              <FiClock
                                className="text-blue-600 dark:text-blue-400"
                                size={20}
                              />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Duration
                              </p>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {booking.duration.value} {booking.duration.unit}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                              <FiMapPin
                                className="text-purple-600 dark:text-purple-400"
                                size={20}
                              />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Location
                              </p>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {booking.location.city}, {booking.location.area}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                              <FiDollarSign
                                className="text-green-600 dark:text-green-400"
                                size={20}
                              />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Total Cost
                              </p>
                              <p className="text-2xl font-bold text-[#C92C5C]">
                                {formatPrice(booking.totalCost)}
                              </p>
                            </div>
                          </div>

                          {booking.paidAt && (
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                                <FiCheckCircle
                                  className="text-emerald-600 dark:text-emerald-400"
                                  size={20}
                                />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Payment Date
                                </p>
                                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                                  {formatDate(booking.paidAt)}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Full Address */}
                        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Full Address:
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.location.address}, {booking.location.area}
                            <br />
                            {booking.location.city}, {booking.location.district}
                            <br />
                            {booking.location.division}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 mt-auto">
                          {booking.paymentStatus === "Unpaid" &&
                            booking.status !== "Cancelled" && (
                              <button
                                onClick={() => handlePayment(booking._id)}
                                className="flex-1 min-w-[150px] bg-[#C92C5C] hover:bg-[#A82349] text-white font-semibold py-3 px-6 rounded-lg inline-flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                              >
                                <FiDollarSign size={20} /> Pay Now
                              </button>
                            )}

                          {(booking.status === "Pending" ||
                            booking.status === "Confirmed") && (
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              className="flex-1 min-w-[150px] border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold py-3 px-6 rounded-lg inline-flex items-center justify-center gap-2 transition-all"
                            >
                              <FiX size={20} /> Cancel Booking
                            </button>
                          )}

                          {booking.paymentStatus === "Paid" &&
                            booking.status !== "Cancelled" && (
                              <div className="flex-1 min-w-[150px] bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold py-3 px-6 rounded-lg inline-flex items-center justify-center gap-2">
                                <FiCheckCircle size={20} />
                                Payment Completed
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
