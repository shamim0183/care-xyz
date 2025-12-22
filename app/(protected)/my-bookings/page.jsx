/**
 * My Bookings Page
 *
 * Protected page showing user's booking history.
 *
 * Features:
 * - Display all user bookings
 * - Status badges (Pending, Confirmed, Completed, Cancelled)
 * - View booking details
 * - Cancel booking option
 * - Responsive table/card layout
 *
 * Requires authentication (protected by middleware)
 */

"use client"

import { formatDate, formatPrice, getStatusColor } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { FiCalendar, FiDollarSign, FiMapPin, FiX } from "react-icons/fi"

export default function MyBookingsPage() {
  const { data: session } = useSession()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  /**
   * Fetch user's bookings on page load
   */
  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch("/api/bookings")
        const data = await response.json()

        if (data.success) {
          setBookings(data.bookings)
        } else {
          toast.error("Failed to load bookings")
        }
      } catch (error) {
        console.error("Fetch bookings error:", error)
        toast.error("Error loading bookings")
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchBookings()
    }
  }, [session])

  /**
   * Handle booking cancellation
   */
  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      })

      if (response.ok) {
        toast.success("Booking cancelled successfully")
        // Update local state
        setBookings(
          bookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: "Cancelled" }
              : booking
          )
        )
      } else {
        toast.error("Failed to cancel booking")
      }
    } catch (error) {
      console.error("Cancel booking error:", error)
      toast.error("Error cancelling booking")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Toaster position="top-center" />

      <h1 className="text-3xl md:text-4xl font-bold mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body items-center text-center py-12">
            <p className="text-lg opacity-70 mb-4">
              You haven't made any bookings yet
            </p>
            <a href="/services" className="btn btn-primary">
              Browse Services
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  {/* Service Info */}
                  <div className="flex-1">
                    <h2 className="card-title text-xl mb-2">
                      {booking.serviceName}
                    </h2>

                    <div className="flex flex-wrap gap-4 text-sm opacity-70">
                      <div className="flex items-center gap-1">
                        <FiCalendar />
                        <span>
                          {booking.duration.value} {booking.duration.unit}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <FiMapPin />
                        <span>
                          {booking.location.city}, {booking.location.area}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <FiDollarSign />
                        <span className="font-semibold text-primary">
                          {formatPrice(booking.totalCost)}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs opacity-60 mt-2">
                      Booked on {formatDate(booking.createdAt)}
                    </p>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <span className={`badge ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>

                    {booking.paymentStatus === "Paid" && (
                      <span className="badge badge-success">Paid</span>
                    )}

                    {(booking.status === "Pending" ||
                      booking.status === "Confirmed") && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="btn btn-sm btn-error btn-outline gap-1"
                      >
                        <FiX /> Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Full Address - Collapsible */}
                <div className="collapse collapse-arrow bg-base-200 mt-4">
                  <input type="checkbox" />
                  <div className="collapse-title text-sm font-medium">
                    View Full Details
                  </div>
                  <div className="collapse-content">
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">Location:</span>
                        <p className="opacity-70">
                          {booking.location.address}, {booking.location.area}
                          <br />
                          {booking.location.city}, {booking.location.district}
                          <br />
                          {booking.location.division}
                        </p>
                      </div>

                      <div>
                        <span className="font-semibold">Duration:</span>
                        <p className="opacity-70">
                          {booking.duration.value} {booking.duration.unit}
                        </p>
                      </div>

                      <div>
                        <span className="font-semibold">Total Cost:</span>
                        <p className="opacity-70">
                          {formatPrice(booking.totalCost)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
