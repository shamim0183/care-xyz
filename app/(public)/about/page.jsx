/**
 * About Us Page
 *
 * Information about Care.xyz platform, mission, and values.
 * Inspired by Welleden design.
 */

import { FiClock, FiHeart, FiShield, FiUsers } from "react-icons/fi"

export const metadata = {
  title: "About Us - Care.xyz",
  description:
    "Learn about Care.xyz - Bangladesh's trusted caregiving service platform connecting families with professional caregivers.",
}

export default function AboutPage() {
  const values = [
    {
      icon: FiHeart,
      title: "Compassionate Care",
      description:
        "We believe every family member deserves love, dignity, and professional care.",
    },
    {
      icon: FiShield,
      title: "Trusted & Verified",
      description:
        "All our caregivers undergo thorough background checks and training.",
    },
    {
      icon: FiClock,
      title: "24/7 Availability",
      description:
        "Care services available round the clock to meet your family's needs.",
    },
    {
      icon: FiUsers,
      title: "Family First",
      description:
        "We treat your loved ones like our own family with utmost care and respect.",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">
          About Care.xyz
        </h1>
        <p className="text-lg opacity-80 max-w-3xl mx-auto">
          Professional and Compassionate Senior Assistance
        </p>
      </div>

      {/* Mission Section */}
      <section className="mb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold font-serif mb-6 text-center">
            Our Mission
          </h2>
          <p className="text-lg opacity-80 leading-relaxed text-center">
            At Care.xyz, our mission is to provide families across Bangladesh
            with access to professional, compassionate, and reliable caregiving
            services. We understand that finding the right care for your loved
            ones is crucial, which is why we connect you with verified,
            experienced caregivers who share our commitment to excellence.
          </p>
        </div>
      </section>

      {/* Values Section - Burgundy Icons */}
      <section className="mb-20 bg-[#FFF0F3] dark:bg-gray-800 py-16 -mx-4 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold font-serif mb-12 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="card bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="card-body items-center text-center">
                  <value.icon className="w-12 h-12 text-[#C92C5C] mb-4" />
                  <h3 className="card-title text-lg">{value.title}</h3>
                  <p className="text-sm opacity-70">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold font-serif mb-12 text-center">
            How It Works
          </h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C92C5C] text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Browse Services</h3>
                <p className="opacity-70">
                  Explore our range of professional caregiving services
                  including baby care, elderly care, and sick people care.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C92C5C] text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Book Online</h3>
                <p className="opacity-70">
                  Select your preferred service, choose duration (hourly or
                  daily), and provide location details through our easy booking
                  form.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C92C5C] text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
                <p className="opacity-70">
                  We match you with a verified caregiver based on your needs and
                  location.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C92C5C] text-white flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Receive Care</h3>
                <p className="opacity-70">
                  Our professional caregiver arrives at your location to provide
                  compassionate, high-quality care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Burgundy */}
      <section className="text-center">
        <div className="card bg-[#C92C5C] text-white shadow-xl">
          <div className="card-body items-center">
            <h2 className="card-title text-3xl font-serif mb-4">
              Ready to Get Started?
            </h2>
            <p className="mb-6 max-w-xl">
              Join hundreds of families who trust Care.xyz for their caregiving
              needs. Book your first service today!
            </p>
            <a
              href="/services"
              className="btn bg-white text-[#C92C5C] hover:bg-gray-100 border-0"
            >
              Explore Services
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
