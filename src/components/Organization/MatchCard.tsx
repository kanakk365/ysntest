"use client"

import Image from "next/image"
import React from "react"
import { Star } from "lucide-react"
import { ImageSlider } from "./ImageSlider"
import { CarouselItem } from "../ui/carousel"

type MatchScheduleItem = {
  match_id: number
  your_team_name: string
  team_logo: string | null
  opponent_team_name: string
  opponent_team_logo: string | null
  match_played_date: string
}

type MatchCardProps = {
  matchschedules: MatchScheduleItem[]
}

export default function MatchCard({ matchschedules }: MatchCardProps) {
  return (
    <div className="container mx-auto md:p-6">
      <div className="flex justify-between items-center gap-3 mt-20">
        <div className="flex items-center gap-3">
          <Star className="w-[30px] h-[30px] md:w-[35px] md:h-[35px] text-white" />
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-white">Match Schedules</h1>
        </div>
      </div>
      <div className="border-t border-[#1C1A26] mt-4 mb-10" />
      {matchschedules?.length ? (
        <ImageSlider>
          {matchschedules.map((m) => (
            <CarouselItem
              key={m.match_id}
              className="max-w-[325px] xs:max-w-[360px] lg:max-w-[450px]"
            >
              <div className="rounded-xl bg-[#161227] bg-opacity-40 p-4 text-white hover:bg-opacity-60 transition-colors">
                <div className="flex items-center gap-3">
                  <Image
                    src={m.team_logo || "/ysnlogo.webp"}
                    alt={m.your_team_name}
                    width={40}
                    height={40}
                    className="rounded object-contain"
                  />
                  <div className="font-semibold">{m.your_team_name}</div>
                </div>
                <div className="mt-2 text-sm text-white/70">vs {m.opponent_team_name}</div>
                <div className="text-xs text-white/60 mt-1">{m.match_played_date}</div>
              </div>
            </CarouselItem>
          ))}
        </ImageSlider>
      ) : (
        <div className="flex justify-center">
          <p className="text-white">There are no past matches yet.</p>
        </div>
      )}
    </div>
  )
}