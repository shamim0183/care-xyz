/**
 * Services Listing Page
 *
 * Displays all available caregiving services in a grid.
 * Shows service cards with filtering and search capabilities.
 */

import ServiceCard from "@/components/ServiceCard"
import servicesData from "@/data/services.json"

export const metadata = {
  title: "Our Services - Care.xyz",
  description:
    "Browse our professional caregiving services including baby care, elderly care, and sick people care across Bangladesh.",
}

export default function ServicesPage() {
  const activeServices = servicesData.filter((service) => service.isActive)

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Our Caregiving Services
        </h1>
        <p className="text-lg opacity-70 max-w-3xl mx-auto">
          Professional and compassionate care services tailored to meet your
          family's needs. Choose from our range of specialized caregiving
          options.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {activeServices.map((service) => (
          <ServiceCard key={service.service_id} service={service} />
        ))}
      </div>

      {/* No Services Message */}
      {activeServices.length === 0 && (
        <div className="text-center py-20">
          <p className="text-lg opacity-70">
            No services available at the moment.
          </p>
        </div>
      )}
    </div>
  )
}
