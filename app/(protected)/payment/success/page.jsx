/**
 * Payment Success Page
 *
 * Displays payment confirmation after successful Stripe checkout.
 * Shows booking details and next steps.
 *
 * Route: /payment/success
 */

"use client"

import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { FiCheckCircle, FiHome } from "react-icons/fi"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const bookingId = searchParams.get("booking_id")
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyAndUpdatePayment = async () => {
      if (sessionId && bookingId) {
        try {
          // Verify payment and update booking status
          const response = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, bookingId }),
          })

          if (response.ok) {
            // Payment verified, fetch updated booking
            const bookingResponse = await fetch(`/api/bookings/${bookingId}`)
            const data = await bookingResponse.json()
            setBooking(data.booking)
          }
        } catch (error) {
          console.error("Payment verification error:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    verifyAndUpdatePayment()
  }, [bookingId, sessionId])

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
        <div className="max-w-2xl mx-auto">
          {/* Success Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header with Icon */}
            <div className="bg-gradient-to-r from-[#C92C5C] to-[#A82349] text-white text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                  <FiCheckCircle size={64} className="text-white" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">
                Payment Successful!
              </h1>
              <p className="text-lg opacity-90">
                Your booking has been confirmed and paid.
              </p>
            </div>

            <div className="p-8">
              {booking && (
                <>
                  {/* Booking Details */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                      📋 Booking Details
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-600">
                        <span className="text-gray-600 dark:text-gray-400">
                          Service
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {booking.serviceName}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-600">
                        <span className="text-gray-600 dark:text-gray-400">
                          Duration
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {booking.duration.value} {booking.duration.unit}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-600">
                        <span className="text-gray-600 dark:text-gray-400">
                          Location
                        </span>
                        <span className="font-semibold text-right text-gray-900 dark:text-white">
                          {booking.location.city}, {booking.location.area}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-3 bg-[#C92C5C]/5 dark:bg-[#C92C5C]/10 rounded-lg p-4 mt-4">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          Amount Paid
                        </span>
                        <span className="text-2xl font-bold text-[#C92C5C]">
                          {formatPrice(booking.totalCost)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* What's Next Info */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="text-blue-600 dark:text-blue-400 mt-1">
                        <FiCheckCircle size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          What&apos;s Next?
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          You will receive a confirmation email shortly. Our
                          team will contact you within 24 hours to schedule your
                          care service.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <Link
                  href="/my-bookings"
                  className="bg-[#C92C5C] hover:bg-[#A82349] text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg text-center"
                >
                  View My Bookings
                </Link>
                <Link
                  href="/"
                  className="border-2 border-gray-300 dark:border-gray-600 hover:border-[#C92C5C] dark:hover:border-[#C92C5C] text-gray-700 dark:text-gray-300 hover:text-[#C92C5C] font-semibold py-4 px-6 rounded-lg transition-all text-center inline-flex items-center justify-center gap-2"
                >
                  <FiHome />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  )
}
