/**
 * Homepage
 *
 * Main landing page for Care.xyz platform.
 *
 * Sections:
 * - Hero carousel with CTA
 * - About section
 * - Services overview
 * - Testimonials/Reviews
 * - Call-to-action
 *
 * SEO optimized with metadata
 */

import Hero from "@/components/Hero"
import ServiceCard from "@/components/ServiceCard"
import reviewsData from "@/data/reviews.json"
import servicesData from "@/data/services.json"
import Link from "next/link"
import { FiArrowRight, FiStar } from "react-icons/fi"

export const metadata = {
  title: "Care.xyz - Professional Caregiving Services in Bangladesh",
  description:
    "Find trusted caregivers for babies, elderly, and sick family members. Book verified care services with flexible pricing across Bangladesh.",
  openGraph: {
    title: "Care.xyz - Trusted Caregiving Platform",
    description: "Professional care services for your loved ones",
  },
}

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <section className="py-20 bg-[#FFF0F3] dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6 text-gray-900 dark:text-white">
              Dedicated Care for Aging Adults
            </h2>
            <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
              At Care.xyz, we understand that your loved ones deserve the best
              care possible. Our platform connects you with verified,
              experienced caregivers who provide compassionate and professional
              services. Whether you need baby care, elderly support, or
              assistance for sick family members, we&apos;re here to help.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="card bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-shadow">
                <div className="card-body items-center text-center">
                  <h3 className="card-title text-[#C92C5C] font-serif">
                    Verified Caregivers
                  </h3>
                  <p className="text-sm opacity-70">
                    All our caregivers are background-checked and professionally
                    trained
                  </p>
                </div>
              </div>
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body items-center text-center">
                  <h3 className="card-title text-primary">Flexible Pricing</h3>
                  <p className="text-sm opacity-70">
                    Choose hourly or daily rates that fit your budget and needs
                  </p>
                </div>
              </div>
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body items-center text-center">
                  <h3 className="card-title text-primary">24/7 Support</h3>
                  <p className="text-sm opacity-70">
                    Our team is always available to assist you with any concerns
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-gray-900 dark:text-white">
              Our Services
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
              Choose from our range of professional caregiving services tailored
              to meet your family&apos;s unique needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {servicesData.map((service) => (
              <ServiceCard key={service.service_id} service={service} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="bg-[#C92C5C] hover:bg-[#A82349] text-white font-semibold py-4 px-8 rounded-lg inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              View All Services
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-neutral-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-gray-900 dark:text-white">
              Hear From Our Happy Families
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real stories from families who trust Care.xyz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {reviewsData.map((review) => (
              <div key={review.id} className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={
                          i < Math.round(review.rating)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm opacity-80 mb-4">
                    &quot;{review.review}&quot;
                  </p>

                  {/* Reviewer Info */}
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={review.photoURL} alt={review.userName} />
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">{review.userName}</p>
                      <p className="text-xs opacity-60">{review.serviceType}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#FFF0F3] to-[#FFE5EC] dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 relative isolate">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6 text-gray-900 dark:text-white">
            Ready to Find the Perfect Caregiver?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-700 dark:text-gray-200">
            Join hundreds of families who trust Care.xyz for their caregiving
            needs. Start your booking today!
          </p>
          <Link
            href="/services"
            className="bg-[#C92C5C] hover:bg-[#A82349] text-white font-semibold py-4 px-8 rounded-lg inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            Get Started Now
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </>
  )
}
