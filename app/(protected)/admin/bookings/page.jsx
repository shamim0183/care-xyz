/**
 * Admin Dashboard - Bookings Management
 *
 * Protected admin page showing all bookings across all users.
 * Allows admin to view, update statuses, and manage bookings.
 *
 * Route: /admin/bookings
 */

"use client"

import { formatDate, formatPrice, getStatusColor } from "@/lib/utils"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiUser,
} from "react-icons/fi"

export default function AdminBookingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    // Check if user is admin
    if (session && session.user.role !== "admin") {
      router.push("/")
      toast.error("Unauthorized access")
      return
    }

    if (session) {
      fetchBookings()
    }
  }, [session, router])

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get("/api/admin/bookings")
      setBookings(data.bookings)
    } catch (error) {
      console.error("Fetch bookings error:", error)
      toast.error(error.response?.data?.error || "Error loading bookings")
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(`/api/admin/bookings/${bookingId}`, {
        status: newStatus,
      })

      toast.success(`Booking status updated to ${newStatus}`)
      fetchBookings() // Refresh list
    } catch (error) {
      console.error("Update error:", error)
      toast.error(error.response?.data?.error || "Error updating booking")
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true
    if (filter === "paid") return booking.paymentStatus === "Paid"
    if (filter === "unpaid") return booking.paymentStatus === "Unpaid"
    return booking.status === filter
  })

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "Pending").length,
    confirmed: bookings.filter((b) => b.status === "Confirmed").length,
    completed: bookings.filter((b) => b.status === "Completed").length,
    paid: bookings.filter((b) => b.paymentStatus === "Paid").length,
    revenue: bookings
      .filter((b) => b.paymentStatus === "Paid")
      .reduce((sum, b) => sum + b.totalCost, 0),
  }

  if (!session || session.user.role !== "admin") {
    return null
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
    <div className="min-h-screen bg-[#FFF0F3] dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <Toaster position="top-center" />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2 text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="opacity-70">Manage all bookings and payments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="card bg-white dark:bg-gray-800 shadow-lg">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-70">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.total}
                  </p>
                </div>
                <FiClock className="text-[#C92C5C]" size={24} />
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-70">Pending</p>
                  <p className="text-2xl font-bold text-warning">
                    {stats.pending}
                  </p>
                </div>
                <FiClock className="text-warning" size={24} />
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-70">Confirmed</p>
                  <p className="text-2xl font-bold text-info">
                    {stats.confirmed}
                  </p>
                </div>
                <FiCheckCircle className="text-info" size={24} />
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-70">Completed</p>
                  <p className="text-2xl font-bold text-success">
                    {stats.completed}
                  </p>
                </div>
                <FiCheckCircle className="text-success" size={24} />
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-70">Paid</p>
                  <p className="text-2xl font-bold text-success">
                    {stats.paid}
                  </p>
                </div>
                <FiDollarSign className="text-success" size={24} />
              </div>
            </div>
          </div>

          <div className="card bg-white dark:bg-gray-800 shadow-lg">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-70">Revenue</p>
                  <p className="text-xl font-bold text-[#C92C5C]">
                    {formatPrice(stats.revenue)}
                  </p>
                </div>
                <FiDollarSign className="text-[#C92C5C]" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filter === "all"
                ? "bg-[#C92C5C] text-white shadow-md"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-[#C92C5C]"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("Pending")}
            className={`btn btn-sm ${
              filter === "Pending" ? "btn-warning" : "btn-outline"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("Confirmed")}
            className={`btn btn-sm ${
              filter === "Confirmed" ? "btn-info" : "btn-outline"
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setFilter("Completed")}
            className={`btn btn-sm ${
              filter === "Completed" ? "btn-success" : "btn-outline"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("paid")}
            className={`btn btn-sm ${
              filter === "paid" ? "btn-success" : "btn-outline"
            }`}
          >
            Paid
          </button>
          <button
            onClick={() => setFilter("unpaid")}
            className={`btn btn-sm ${
              filter === "unpaid" ? "btn-error" : "btn-outline"
            }`}
          >
            Unpaid
          </button>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="card bg-base-100 shadow">
              <div className="card-body text-center py-12">
                <p className="opacity-70">No bookings found</p>
              </div>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="card bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="card-body">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Booking Info */}
                    <div className="lg:col-span-2">
                      <h3 className="font-bold text-lg mb-2">
                        {booking.serviceName}
                      </h3>
                      <div className="space-y-1 text-sm opacity-70">
                        <div className="flex items-center gap-2">
                          <FiUser />
                          <span>
                            {booking.userId?.name || "Unknown"} (
                            {booking.userId?.email || "No email"})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiCalendar />
                          <span>
                            {booking.duration.value} {booking.duration.unit}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiMapPin />
                          <span>
                            {booking.location.city}, {booking.location.area}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiClock />
                          <span>Booked on {formatDate(booking.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div>
                      <p className="text-sm opacity-70 mb-1">Payment</p>
                      <p className="text-xl font-bold text-primary mb-2">
                        {formatPrice(booking.totalCost)}
                      </p>
                      <span
                        className={`badge ${
                          booking.paymentStatus === "Paid"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </div>

                    {/* Status & Actions */}
                    <div>
                      <p className="text-sm opacity-70 mb-2">Status</p>
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          updateBookingStatus(booking._id, e.target.value)
                        }
                        className="select select-bordered select-sm w-full mb-2"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <span
                        className={`badge ${getStatusColor(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
