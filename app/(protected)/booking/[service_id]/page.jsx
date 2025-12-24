import divisionsData from "@/data/divisions.json"
import locationsData from "@/data/locations.json"
import servicesData from "@/data/services.json"
import BookingPageClient from "./BookingPageClient"

export default async function BookingPage({ params }) {
  const { service_id } = await params
  const service = servicesData.find((s) => s.service_id === service_id)

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg">Service not found</p>
      </div>
    )
  }

  return (
    <BookingPageClient
      service={service}
      divisionsData={divisionsData}
      locationsData={locationsData}
    />
  )
}
