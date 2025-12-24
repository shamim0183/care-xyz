/**
 * Hero Component
 *
 * Homepage hero section with carousel and Unsplash background images.
 */

"use client"

import Link from "next/link"
import { FiArrowRight, FiCheckCircle, FiHeart, FiUsers } from "react-icons/fi"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"

export default function Hero() {
  const slides = [
    {
      title: "Personalized Care for Your Loved Ones",
      subtitle: "Professional and compassionate caregiving services",
      description:
        "Trusted care for babies, elderly, and sick family members across Bangladesh",
      image:
        "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=1920&h=1080&fit=crop&q=80",
    },
    {
      title: "Experienced Caregivers You Can Trust",
      subtitle: "Verified professionals dedicated to quality care",
      description:
        "Background-checked caregivers providing compassionate support 24/7",
      image:
        "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1920&h=1080&fit=crop&q=80",
    },
    {
      title: "Book Care Services in Minutes",
      subtitle: "Easy online booking with flexible pricing",
      description: "Hourly or daily rates to fit your needs and budget",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1920&h=1080&fit=crop&q=80",
    },
  ]

  const stats = [
    { icon: FiUsers, value: "500+", label: "Happy Families" },
    { icon: FiCheckCircle, value: "50+", label: "Verified Caregivers" },
    { icon: FiHeart, value: "98%", label: "Satisfaction Rate" },
  ]

  return (
    <div className="relative">
      {/* Hero Carousel */}
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="h-[600px] lg:h-[700px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="min-h-[600px] lg:min-h-[700px] flex items-center justify-center relative bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Gradient overlay for professional look and text readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70"></div>

              <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                  {/* Subtitle Badge - Burgundy for Welleden theme */}
                  <div className="inline-block mb-4 px-6 py-2.5 bg-[#C92C5C] rounded-full text-white font-semibold shadow-2xl">
                    {slide.subtitle}
                  </div>

                  {/* Main Title - Serif font with strong shadow */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif mb-6 text-white drop-shadow-2xl leading-tight">
                    {slide.title}
                  </h1>

                  {/* Description - Pure white for contrast */}
                  <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white drop-shadow-lg font-medium">
                    {slide.description}
                  </p>

                  {/* CTA Button - Burgundy */}
                  <Link
                    href="/services"
                    className="bg-[#C92C5C] hover:bg-[#A82349] text-white font-semibold py-4 px-8 rounded-lg gap-2 inline-flex shadow-2xl hover:shadow-lg transition-all hover:scale-105"
                  >
                    Find Care Services
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Statistics Section */}
      <div className="bg-base-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="w-12 h-12 text-[#C92C5C]" />
                </div>
                <div className="text-4xl font-bold text-[#C92C5C] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm opacity-70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
