"use client"

import React, { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Users, CalendarDays } from "lucide-react"
import ImageSlider from "@/components/Organization/ImageSlider"
import { CarouselItem } from "@/components/ui/carousel"

type MatchStatus = "upcoming" | "live" | "past"

type MatchItem = {
  id: number
  title: string
  date: string
  image: string
  viewers: string
  sport: string
  status: MatchStatus
}

const matches: MatchItem[] = [
  { id: 1, title: "AZ vs. FC Twente", date: "15 May 2020 9:00 am", image: "/landing/banner.webp", viewers: "1.5M", sport: "Football", status: "upcoming" },
  { id: 2, title: "Portugal vs. Poland", date: "15 May 2020 9:30 am", image: "/landing/banner.webp", viewers: "1.5M", sport: "Boxing", status: "live" },
  { id: 3, title: "Florence vs. Shelton State", date: "15 May 2020 8:00 am", image: "/landing/banner.webp", viewers: "1.5M", sport: "Cricket", status: "past" },
  { id: 4, title: "WJF 20: The Championship", date: "15 May 2020 8:30 am", image: "/landing/banner.webp", viewers: "1.2M", sport: "Cricket", status: "upcoming" },
  { id: 5, title: "India vs Pakistan", date: "15 May 2020 8:30 am", image: "/landing/banner.webp", viewers: "1.9M", sport: "Cricket", status: "live" },
  { id: 6, title: "Man Utd vs Arsenal", date: "14 May 2020 7:00 pm", image: "/landing/banner.webp", viewers: "2.1M", sport: "Football", status: "past" },
]

const tabs = [
  { label: "All Matches", value: "all" as const },
  { label: "Past Matches", value: "past" as const },
  { label: "Live Streams", value: "live" as const },
  { label: "Upcoming Matches", value: "upcoming" as const },
]

export default function Schedule() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["value"]>("all")
  // Legacy ref removed; slider handled by ImageSlider

  const filtered = useMemo(
    () => (activeTab === "all" ? matches : matches.filter((m) => m.status === activeTab)),
    [activeTab]
  )

  // Carousel arrows are handled inside ImageSlider

  const badgeClass = (status: MatchStatus) =>
    status === "live"
      ? "bg-red-600 text-white"
      : status === "upcoming"
      ? "bg-purple-600 text-white"
      : "bg-gray-600 text-white"

  return (
    <section className="py-12 md:py-16 bg-black" id="schedule_section">
      <div className=" mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Match Schedule</h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6">
          {tabs.map((t) => (
            <Button
              key={t.value}
              onClick={() => setActiveTab(t.value)}
              variant={activeTab === t.value ? "default" : "outline"}
              className="h-9 rounded-full"
            >
              {t.label}
            </Button>
          ))}
        </div>

        {/* Cards using ImageSlider */}
        <ImageSlider className="md:gap-10 gap-10">
          {filtered.map((match) => (
            <CarouselItem
              key={match.id}
              className="flex-shrink-0 gap-5 w-80 max-w-[320px] p-0 bg-gray-900 rounded-xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <Image src={match.image} alt={match.title} fill sizes="320px" className="object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeClass(match.status)}`}>
                    {match.status === "live" ? "Live" : match.status === "upcoming" ? "Upcoming" : "Past"}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">{match.title}</h3>
                  <p className="text-gray-300 text-sm">{match.date}</p>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-300">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{match.viewers}</span>
                </div>
                <div className="text-xs text-gray-400">{match.sport}</div>
              </div>
            </CarouselItem>
          ))}
        </ImageSlider>
      </div>
    </section>
  );
}
