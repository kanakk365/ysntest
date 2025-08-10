"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "motion/react"
import { Monitor, Calendar, Share2, Building, Users, Eye, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface AdvertisingPackage {
  id: string
  title: string
  price: string
  period: string
  description: string
  features: string[]
  reach: string
  icon: React.ReactNode
  image: string
  highlighted?: boolean
}

const advertisingPackages: AdvertisingPackage[] = [
  {
    id: "digital-display",
    title: "Digital Display Ads",
    price: "$2,500",
    period: "/month",
    description: "Premium digital advertising space across our platform and facilities",
    features: [
      "Website banner placements",
      "Mobile app advertisements",
      "Digital facility displays",
      "Performance analytics",
      "A/B testing included",
    ],
    reach: "50K+ monthly impressions",
    icon: <Monitor className="h-6 w-6" />,
    image: "/landing/battle-lounge-homepage.webp",
    highlighted: true,
  },
  {
    id: "event-sponsorship",
    title: "Event Sponsorship",
    price: "$5,000",
    period: "/event",
    description: "Sponsor our premier sporting events and tournaments",
    features: [
      "Logo on event materials",
      "Booth space at venue",
      "PA announcements",
      "Social media mentions",
      "Photo opportunities",
    ],
    reach: "1K+ event attendees",
    icon: <Calendar className="h-6 w-6" />,
    image: "/landing/battle-lounge-tournament.webp",
  },
  {
    id: "social-media",
    title: "Social Media Promotion",
    price: "$1,200",
    period: "/month",
    description: "Comprehensive social media advertising across all our channels",
    features: [
      "Instagram story features",
      "Facebook post promotions",
      "YouTube video integrations",
      "Influencer partnerships",
      "Content creation support",
    ],
    reach: "25K+ social followers",
    icon: <Share2 className="h-6 w-6" />,
    image: "/landing/myreels-football.webp",
  },
  {
    id: "facility-branding",
    title: "Facility Branding",
    price: "$10,000",
    period: "/year",
    description: "Year-round branding opportunities throughout our sports complex",
    features: [
      "Permanent signage placement",
      "Court/field naming rights",
      "Locker room branding",
      "Equipment sponsorship",
      "VIP hospitality access",
    ],
    reach: "100K+ annual visitors",
    icon: <Building className="h-6 w-6" />,
    image: "/landing/playhub-2.webp",
  },
]

export default function AdvertisingPage() {
  const [selectedPackage, setSelectedPackage] = useState<AdvertisingPackage>(advertisingPackages[0])
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      ref={ref}
      className="py-20 pt-[150px] bg-black"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">Advertising</span>{" "}
            <span className="text-foreground">Opportunities</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Partner with YSN to reach athletes, families, and sports enthusiasts. Choose from our premium advertising
            packages designed to maximize your brand exposure.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Package Cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {advertisingPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className={`relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                  selectedPackage.id === pkg.id
                    ? "bg-card/60 border-purple-500/30 shadow-lg ring-2 ring-purple-500/20"
                    : "bg-card/20 border-border hover:border-purple-500/30 hover:shadow-md"
                } ${pkg.highlighted ? "ring-2 ring-blue-500/20" : ""}`}
                onClick={() => setSelectedPackage(pkg)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {pkg.highlighted && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                        selectedPackage.id === pkg.id
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}>
                      {pkg.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{pkg.title}</h3>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {pkg.description}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">
                    {pkg.reach}
                  </span>
                </div>

                {selectedPackage.id === pkg.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }} className="space-y-3">
                    <div className="space-y-2">
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="#contact">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Right Side - Image Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:sticky lg:top-24 self-start"
          >
            <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-card/40">
              <Image
                src={selectedPackage.image}
                alt={selectedPackage.title}
                width={1200}
                height={800}
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-800">{selectedPackage.title}</h4>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-600">{selectedPackage.reach}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-0">{selectedPackage.description}</p>
                </div>
              </div>
            </div>

            {/* Mobile navigation dots */}
            <div className="flex justify-center gap-2 mt-6 lg:hidden">
              {advertisingPackages.map((pkg) => {
                const index = advertisingPackages.findIndex((p) => p.id === selectedPackage.id)
                const pkgIndex = advertisingPackages.findIndex((p) => p.id === pkg.id)
                return (
                  <button
                    key={pkg.id}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === pkgIndex ? "bg-gradient-to-r from-purple-600 to-blue-600 w-6" : "bg-muted"
                    }`}
                    onClick={() => setSelectedPackage(pkg)}
                    aria-label={`Show ${pkg.title}`}
                  />
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-20"
        >
          <div className="bg-card/50 backdrop-blur-lg border border-border rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-foreground">Ready to partner with</span>{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">YSN?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join leading brands who trust us to deliver exceptional results. We will work with you to create a custom
              advertising solution that meets your specific goals and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#contact">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg">
                  Contact Our Team
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#">
                <Button variant="outline" className="h-10 px-8 py-3 text-lg">
                  View Our Facilities
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}



