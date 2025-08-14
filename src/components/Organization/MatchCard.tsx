"use client"

import React from "react"
import { Star } from "lucide-react"
import ImageSlider from "./ImageSlider"
import { CarouselItem } from "../ui/carousel"
import MatchBgCard from "./MatchBgCard"

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
            <CarouselItem key={m.match_id} className="basis-full sm:basis-1/2 xl:basis-1/3">
              <MatchBgCard
                item={{
                  id: m.match_id,
                  match_played_date: m.match_played_date,
                  your_team_name: m.your_team_name,
                  team_logo: m.team_logo,
                  opponent_team_name: m.opponent_team_name,
                  opponent_team_logo: m.opponent_team_logo,
                }}
              />
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