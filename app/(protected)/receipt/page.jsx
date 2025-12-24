/**
 * Receipt Page
 *
 * Professional printable invoice for paid bookings
 */

"use client"

import { formatDate, formatPrice } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { FiCheckCircle, FiPrinter } from "react-icons/fi"

function ReceiptContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("id")
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (bookingId) {
      fetch(`/api/bookings/${bookingId}`)
        .then((res) => res.json())
        .then((data) => setBooking(data.booking))
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [bookingId])

  const handlePrint = () => {
    window.print()
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

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Booking not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Print Button - Hidden when printing */}
          <div className="mb-6 no-print">
            <button
              onClick={handlePrint}
              className="bg-[#C92C5C] hover:bg-[#A82349] text-white font-semibold py-3 px-6 rounded-lg inline-flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <FiPrinter /> Print Receipt
            </button>
          </div>

          {/* Receipt Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden print:shadow-none">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#C92C5C] to-[#A82349] text-white px-8 py-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold font-serif mb-2">
                    Care.xyz
                  </h1>
                  <p className="text-white/90">
                    Professional Caregiving Services
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-2">
                    <FiCheckCircle size={24} />
                    <span className="text-lg font-semibold">PAID</span>
                  </div>
                  <p className="text-sm text-white/80">
                    #{booking._id.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    INVOICE DATE
                  </h3>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {formatDate(booking.createdAt)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    PAYMENT DATE
                  </h3>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {booking.paidAt ? formatDate(booking.paidAt) : "N/A"}
                  </p>
                </div>
              </div>

              {/* Service Details */}
              <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 mb-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  Service Details
                </h2>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 text-gray-600 dark:text-gray-400 font-semibold">
                        Description
                      </th>
                      <th className="text-right py-3 text-gray-600 dark:text-gray-400 font-semibold">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-4">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-lg">
                            {booking.serviceName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Duration: {booking.duration.value}{" "}
                            {booking.duration.unit}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Location: {booking.location.area},{" "}
                            {booking.location.city}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Address: {booking.location.address}
                          </p>
                        </div>
                      </td>
                      <td className="text-right py-4">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatPrice(booking.totalCost)}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    Total Amount Paid
                  </span>
                  <span className="text-3xl font-bold text-[#C92C5C]">
                    {formatPrice(booking.totalCost)}
                  </span>
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Thank you for choosing Care.xyz! For any questions or
                  concerns, please contact us at{" "}
                  <a
                    href="mailto:support@care.xyz"
                    className="text-[#C92C5C] hover:underline"
                  >
                    support@care.xyz
                  </a>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-4">
                  Invoice ID: {booking._id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          .dark\\:bg-gray-800,
          .dark\\:bg-gray-700,
          .dark\\:text-white,
          .dark\\:text-gray-400 {
            background: white !important;
            color: black !important;
          }
        }
      `}</style>
    </div>
  )
}
