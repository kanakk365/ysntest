"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

type TeamCardData = {
  team_id: number
  team_name: string
  team_logo?: string | null
}

type PlayerCardProps = {
  className?: string
  isOrganization?: boolean
  isOrganisation?: boolean
  team?: TeamCardData
}

export const PlayerCard = ({ className = "", isOrganization, isOrganisation, team }: PlayerCardProps) => {
  const hasTeam = Boolean(team)
  const isOrg = isOrganization ?? isOrganisation ?? false

  return (
    <div
      className={cn(
        "bg-gradient-to-b from-[#0F0B23] to-[#2B2647] flex flex-col items-center justify-between rounded-[113px] transition-all duration-500 ease-in-out",
        isOrg || hasTeam
          ? "h-[300px] lg:h-[350px] gap-4 py-5 p-4 w-[150px] lg:w-[180px]"
          : "gap-5 py-10 p-6 w-[216px]",
        className
      )}
    >
      <div className="p-4 pt-0 bg-[#0404043B] rounded-full">
        <div
          className={cn(
            "rounded-full bg-gradient-to-b from-[#7940D7] to-[#2D09A3] flex items-center justify-center p-1",
            isOrg || hasTeam ? "w-[100px] h-[100px] lg:w-[140px] lg:h-[140px]" : "w-[140px] h-[140px]"
          )}
        >
          <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
            <Image
              src={team?.team_logo || "/ysnlogo.webp"}
              alt={team?.team_name || "avatar"}
              width={200}
              height={200}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {hasTeam && (
        <div className="text-center flex items-center justify-center">
          <p className="text-[16px] lg:text-[20px] text-center w-[80%] font-bold line-clamp-2">
            {team?.team_name}
          </p>
        </div>
      )}
      {hasTeam && <p className="text-white opacity-50 text-[13px]">View</p>}
    </div>
  )
}