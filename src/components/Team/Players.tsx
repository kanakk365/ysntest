"use client"

import React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { ImageSlider } from "@/components/Organization/ImageSlider"
import { CarouselItem } from "@/components/ui/carousel"
import { PlayerCard } from "@/components/Common/PlayerCard"

type PlayerItem = {
  id: number
  name: string
  logo: string | null
  slug?: string
}

type PlayersProps = {
  players: PlayerItem[]
  className?: string
}

export default function Players({ players, className }: PlayersProps) {
  return (
    <div className={cn("container mx-auto md:p-6 text-white", className)}>
      <div className="flex justify-between items-center gap-3 mt-20">
        <div className="flex items-center gap-3">
          <Star className="w-[30px] h-[30px] md:w-[35px] md:h-[35px] text-white" />
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-white">Players</h1>
        </div>
      </div>
      <div className="border-t border-[#1C1A26] mt-4 mb-10" />

      {players?.length ? (
        <ImageSlider className="md:gap-0 gap-0">
          {players.map((player) => (
            <CarouselItem
              key={player.id}
              className="max-w-[180px] xs:max-w-[200px] lg:max-w-[220px]"
            >
              <div className="block">
                <PlayerCard
                  team={{
                    team_id: player.id,
                    team_name: player.name,
                    team_logo: player.logo ?? null,
                  }}
                  isOrganization
                  className="w-full"
                />
              </div>
            </CarouselItem>
          ))}
        </ImageSlider>
      ) : (
        <div className="flex justify-center">
          <p className="text-white">No Players Available</p>
        </div>
      )}
    </div>
  )
}


