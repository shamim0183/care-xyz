/**
 * Service Detail Page
 *
 * Dynamic page showing detailed information about a specific service.
 *
 * Route: /service/[service_id]
 *
 * Features:
 * - Service description and features
 * - Pricing information
 * - Book button (redirects to booking page)
 * - Related services
 * - Authentication check before booking
 */

import servicesData from "@/data/services.json"
import { auth } from "@/lib/auth"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FiCheckCircle, FiClock, FiDollarSign } from "react-icons/fi"

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const service = servicesData.find((s) => s.service_id === params.service_id)

  if (!service) {
    return {
      title: "Service Not Found - Care.xyz",
    }
  }

  return {
    title: `${service.name} - Care.xyz`,
    description: service.description,
    openGraph: {
      title: service.name,
      description: service.shortDescription,
    },
  }
}

export default async function ServiceDetailPage({ params }) {
  // Get session
  const session = await auth()

  // Find the service
  const service = servicesData.find((s) => s.service_id === params.service_id)

  // If service not found, show 404
  if (!service) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Service Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
        {/* Image */}
        <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
          <Image
            src={service.image || "/images/placeholder-service.jpg"}
            alt={service.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Service Info */}
        <div>
          <div className="badge badge-primary mb-4">{service.category}</div>
          <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
          <p className="text-lg opacity-80 mb-6">{service.shortDescription}</p>

          {/* Pricing */}
          <div className="card bg-base-200 mb-6">
            <div className="card-body">
              <h3 className="card-title text-lg mb-3">
                <FiDollarSign /> Pricing
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm opacity-70">Hourly Rate</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(service.chargePerHour)}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Daily Rate</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(service.chargePerDay)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Book Button */}
          {session ? (
            <Link
              href={`/booking/${service.service_id}`}
              className="btn btn-primary btn-lg w-full gap-2"
            >
              <FiClock /> Book This Service
            </Link>
          ) : (
            <Link
              href={`/login?callbackUrl=/booking/${service.service_id}`}
              className="btn btn-primary btn-lg w-full gap-2"
            >
              Login to Book Service
            </Link>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-6">About This Service</h2>
        <p className="text-lg opacity-80 leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">What's Included</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {service.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-base-200 rounded-lg"
            >
              <FiCheckCircle
                className="text-primary mt-1 flex-shrink-0"
                size={20}
              />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16 p-8 bg-primary text-primary-content rounded-lg max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">Ready to Book?</h3>
        <p className="mb-6">
          Get started today and provide your loved ones with the care they
          deserve.
        </p>
        {session ? (
          <Link
            href={`/booking/${service.service_id}`}
            className="btn btn-secondary btn-lg"
          >
            Book Now
          </Link>
        ) : (
          <Link
            href={`/login?callbackUrl=/booking/${service.service_id}`}
            className="btn btn-secondary btn-lg"
          >
            Login to Book
          </Link>
        )}
      </div>
    </div>
  )
}
