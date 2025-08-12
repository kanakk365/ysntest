"use client"

import { Users } from "lucide-react"
import Image from "next/image"
import { useMemo, useState } from "react"

const allMatches = [
  {
    id: 1,
    title: "AZ vs. FC Twente",
    date: "15 May 2020 9:00 am",
    image: "/assets/match1.webp",
    viewers: "1.5M",
    sport: "Football",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Portugal vs. Poland",
    date: "15 May 2020 9:30 am",
    image: "/assets/match1.webp",
    viewers: "1.5M",
    sport: "Boxing",
    status: "live",
  },
  {
    id: 3,
    title: "Florence vs. Shelton state",
    date: "15 May 2020 8:00 am",
    image: "/assets/match1.webp",
    viewers: "1.5M",
    sport: "Cricket",
    status: "past",
  },
  {
    id: 4,
    title: "WJF 20 : The ultimate championship",
    date: "15 May 2020 8:30 am",
    image: "/assets/match1.webp",
    viewers: "1.5M",
    sport: "Cricket",
    status: "upcoming",
  },
  {
    id: 5,
    title: "India vs Pakistan",
    date: "15 May 2020 8:30 am",
    image: "/assets/match1.webp",
    viewers: "1.5M",
    sport: "Cricket",
    status: "live",
  },
  {
    id: 6,
    title: "Manchester United vs Arsenal",
    date: "14 May 2020 7:00 pm",
    image: "/assets/match1.webp",
    viewers: "2.1M",
    sport: "Football",
    status: "past",
  },
]

const tabs = [
  { name: "All Matches", filter: "all" },
  { name: "Past Matches", filter: "past" },
  { name: "Live Streams", filter: "live" },
  { name: "Upcoming Matches", filter: "upcoming" },
]

export default function MatchSchedule() {
  const [activeTab, setActiveTab] = useState("all")
  const filteredMatches = useMemo(
    () => (activeTab === "all" ? allMatches : allMatches.filter((m) => m.status === activeTab)),
    [activeTab]
  )

  return (
    <div className="bg-black text-white h-full md:px-6 py-[5%] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded flex items-center justify-center">
          <Image src="/assets/star.webp" alt="asterisk-icon" width={28} height={28} />
        </div>
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold">Match Schedule</h1>
      </div>
      <div className='border-t border-[#1C1A26] mb-4'></div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t.filter}
            onClick={() => setActiveTab(t.filter)}
            className={`px-4 py-1 rounded-full text-sm ${
              activeTab === t.filter ? "bg-[#3705DC] text-white" : "bg-[#1C1A26] text-white/80"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Match Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMatches.map((match, index) => (
          <div
            key={index}
            className="gap-5 p-0 bg-gray-900 rounded-xl overflow-hidden group cursor-pointer hover:scale-[1.01] transition-transform duration-300"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={match.image}
                alt={match.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    match.status === "live"
                      ? "bg-red-600 text-white"
                      : match.status === "upcoming"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {match.status === "live" ? "Live" : match.status === "upcoming" ? "Upcoming" : "Past"}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg mb-1">{match.title}</h3>
                <p className="text-gray-300 text-sm">{match.date}</p>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="w-4 h-4" />
                <span className="text-sm">{match.viewers}</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
