"use client"

import Link from "next/link"
import React from "react"
import { Star } from "lucide-react"
import { ImageSlider } from "@/components/Organization/ImageSlider"
import { CarouselItem } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { PlayerCard } from "@/components/Common/PlayerCard"

type TeamItem = {
  team_id: number
  team_name: string
  logo: string | null
  team_slug_name: string
}

type TeamsProps = {
  teams: TeamItem[]
  className?: string
}

export default function Teams({ teams, className }: TeamsProps) {
  return (
    <div className={cn("container mx-auto md:p-6 text-white", className)}>
      <div className="flex justify-between items-center gap-3 mt-20">
        <div className="flex items-center gap-3">
          <Star className="w-[30px] h-[30px] md:w-[35px] md:h-[35px] text-white" />
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-white">Teams</h1>
        </div>
      </div>
      <div className="border-t border-[#1C1A26] mt-4 mb-10" />

      {teams?.length ? (
        <ImageSlider>
          {teams.map((team) => (
            <CarouselItem
              key={team.team_id}
              className="max-w-[180px] xs:max-w-[200px] lg:max-w-[220px]"
            >
              <Link href={`/team/${encodeURIComponent(team.team_slug_name)}`} className="block">
                <PlayerCard team={{
                  team_id: team.team_id,
                  team_name: team.team_name,
                  team_logo: team.logo ?? null,
                }} isOrganization className="w-full" />
              </Link>
            </CarouselItem>
          ))}
        </ImageSlider>
      ) : (
        <div className="flex justify-center">
          <p className="text-white">No Teams Available</p>
        </div>
      )}
    </div>
  )
}