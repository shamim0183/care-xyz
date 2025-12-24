/**
 * Admin Dashboard - Bookings Management
 *
 * Professional admin interface with real-time updates
 */

"use client"

import { formatDate, formatPrice } from "@/lib/utils"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiRefreshCw,
  FiUser,
} from "react-icons/fi"

export default function AdminBookingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
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
      setRefreshing(true)
      const { data } = await axios.get("/api/admin/bookings")
      setBookings(data.bookings)
    } catch (error) {
      console.error("Fetch bookings error:", error)
      toast.error(error.response?.data?.error || "Error loading bookings")
    } finally {
      setLoading(false)
      setRefreshing(false)
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-[#C92C5C]"></span>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <Toaster position="top-center" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all bookings and payments
            </p>
          </div>
          <button
            onClick={fetchBookings}
            disabled={refreshing}
            className="bg-[#C92C5C] hover:bg-[#A82349] text-white font-semibold py-3 px-6 rounded-lg inline-flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {/* Total Bookings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 border-[#C92C5C]">
            <div className="flex items-center justify-between mb-2">
              <FiClock className="text-[#C92C5C]" size={24} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total Bookings
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </p>
          </div>

          {/* Pending */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <FiAlertCircle className="text-orange-500" size={24} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Pending
            </p>
            <p className="text-3xl font-bold text-orange-500">
              {stats.pending}
            </p>
          </div>

          {/* Confirmed */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <FiCheckCircle className="text-blue-500" size={24} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Confirmed
            </p>
            <p className="text-3xl font-bold text-blue-500">
              {stats.confirmed}
            </p>
          </div>

          {/* Completed */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <FiCheckCircle className="text-green-500" size={24} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Completed
            </p>
            <p className="text-3xl font-bold text-green-500">
              {stats.completed}
            </p>
          </div>

          {/* Paid */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between mb-2">
              <FiDollarSign className="text-emerald-500" size={24} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Paid
            </p>
            <p className="text-3xl font-bold text-emerald-500">{stats.paid}</p>
          </div>

          {/* Revenue */}
          <div className="bg-gradient-to-r from-[#C92C5C] to-[#A82349] rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between mb-2">
              <FiDollarSign className="text-white" size={24} />
            </div>
            <p className="text-sm text-white/80 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-white">
              {formatPrice(stats.revenue)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                filter === "all"
                  ? "bg-[#C92C5C] text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setFilter("Pending")}
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                filter === "Pending"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter("Confirmed")}
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                filter === "Confirmed"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Confirmed ({stats.confirmed})
            </button>
            <button
              onClick={() => setFilter("Completed")}
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                filter === "Completed"
                  ? "bg-green-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Completed ({stats.completed})
            </button>
            <button
              onClick={() => setFilter("paid")}
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                filter === "paid"
                  ? "bg-emerald-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Paid ({stats.paid})
            </button>
            <button
              onClick={() => setFilter("unpaid")}
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                filter === "unpaid"
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Unpaid (
              {bookings.filter((b) => b.paymentStatus === "Unpaid").length})
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
              <FiAlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No bookings found
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Booking Info - 5 columns */}
                    <div className="lg:col-span-5">
                      <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">
                        {booking.serviceName}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <FiUser className="flex-shrink-0" />
                          <span className="truncate">
                            <strong>{booking.userId?.name || "Unknown"}</strong>
                            <br />
                            <span className="text-xs">
                              {booking.userId?.email || "No email"}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <FiCalendar className="flex-shrink-0" />
                          <span>
                            {booking.duration.value} {booking.duration.unit}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <FiMapPin className="flex-shrink-0" />
                          <span>
                            {booking.location.city}, {booking.location.area}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <FiClock className="flex-shrink-0" />
                          <span>Booked: {formatDate(booking.createdAt)}</span>
                        </div>
                        {booking.paidAt && (
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <FiCheckCircle className="flex-shrink-0" />
                            <span>Paid: {formatDate(booking.paidAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Info - 3 columns */}
                    <div className="lg:col-span-3 flex flex-col justify-center border-l border-gray-200 dark:border-gray-700 pl-6">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Payment Status
                      </p>
                      <p className="text-3xl font-bold text-[#C92C5C] mb-3">
                        {formatPrice(booking.totalCost)}
                      </p>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.paymentStatus === "Paid"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {booking.paymentStatus === "Paid" ? (
                          <>
                            <FiCheckCircle className="mr-1" /> Paid
                          </>
                        ) : (
                          <>
                            <FiAlertCircle className="mr-1" /> Unpaid
                          </>
                        )}
                      </span>
                    </div>

                    {/* Status & Actions - 4 columns */}
                    <div className="lg:col-span-4 flex flex-col justify-center border-l border-gray-200 dark:border-gray-700 pl-6">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Booking Status
                      </p>
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          updateBookingStatus(booking._id, e.target.value)
                        }
                        className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-semibold focus:border-[#C92C5C] focus:outline-none transition-colors mb-3"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <span
                        className={`inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-bold ${
                          booking.status === "Pending"
                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                            : booking.status === "Confirmed"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : booking.status === "Completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        }`}
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
