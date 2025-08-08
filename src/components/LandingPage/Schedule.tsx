"use client"

import React, { useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Users, CalendarDays } from "lucide-react"

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
  const scrollRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(
    () => (activeTab === "all" ? matches : matches.filter((m) => m.status === activeTab)),
    [activeTab]
  )

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -340, behavior: "smooth" })
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 340, behavior: "smooth" })

  const badgeClass = (status: MatchStatus) =>
    status === "live"
      ? "bg-red-600 text-white"
      : status === "upcoming"
      ? "bg-purple-600 text-white"
      : "bg-gray-600 text-white"

  return (
    <section className="py-12 md:py-16 bg-black" id="schedule_section">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Match Schedule</h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
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

        {/* Controls */}
        <div className="flex items-center justify-end gap-2 mb-3">
          <Button onClick={scrollLeft} size="icon" variant="outline" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button onClick={scrollRight} size="icon" variant="outline" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filtered.map((match) => (
            <div
              key={match.id}
              className="flex-shrink-0 w-80 max-w-[320px] rounded-xl overflow-hidden bg-gray-900 border border-gray-800 hover:scale-[1.01] transition-transform duration-200"
            >
              <div className="relative h-48">
                <Image src={match.image} alt={match.title} fill sizes="320px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


