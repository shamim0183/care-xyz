"use client"

/**
 * Service Card Component
 *
 * Displays a service in a card format with image, title, description, price, and action button.
 * Inspired by Welleden design with hover effects and clean layout.
 *
 * Props:
 * - service: Service object with id, name, description, price, image
 *
 * Features:
 * - Hover lift effect
 * - Image zoom on hover
 * - Price badge
 * - Responsive design
 */

import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { FiArrowRight } from "react-icons/fi"

export default function ServiceCard({ service }) {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      {/* Service Image */}
      <figure className="relative h-48 overflow-hidden">
        <Image
          src={
            service.image ||
            service.imageUrl ||
            "/images/placeholder-service.jpg"
          }
          alt={service.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
        />

        {/* Price Badge */}
        <div className="absolute top-4 right-4 badge badge-primary badge-lg">
          From {formatPrice(service.chargePerHour)}/hr
        </div>
      </figure>

      {/* Card Body */}
      <div className="card-body">
        {/* Service Name */}
        <h2 className="card-title">{service.name}</h2>

        {/* Short Description */}
        <p className="text-sm opacity-70 line-clamp-3">
          {service.shortDescription}
        </p>

        {/* Pricing Info */}
        <div className="flex gap-4 text-sm my-2">
          <div>
            <span className="font-semibold">Hourly:</span>{" "}
            {formatPrice(service.chargePerHour)}
          </div>
          <div>
            <span className="font-semibold">Daily:</span>{" "}
            {formatPrice(service.chargePerDay)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card-actions justify-end mt-4">
          <Link
            href={`/service/${service.service_id}`}
            className="btn btn-primary btn-sm"
          >
            View Details
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  )
}
