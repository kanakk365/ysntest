"use client"

import Image from "next/image"
import React, { useCallback } from "react"
import { Share2 } from "lucide-react"

type OrganizationTopCardProps = {
  orgData: {
    orgz_name?: string
    orgz_logo?: string | null
    orgz_wins?: number | null
    orgz_losses?: number | null
    orgz_ties?: number | null
    state_name?: string | null
    players_age_group?: string | null
    orgz_national_rank?: number | null
  } | null
}

export default function TopCard({ orgData }: OrganizationTopCardProps) {
  const handleShare = useCallback(async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : ""
      if (navigator.share) {
        await navigator.share({ title: orgData?.orgz_name || "YSN", url })
        return
      }
      await navigator.clipboard.writeText(url)
      console.info("Link copied to clipboard")
    } catch {
      console.warn("Unable to share")
    }
  }, [orgData?.orgz_name])

  return (
    <div
      className="relative w-full text-white md:px-4 overflow-visible font-sans pt-[30px] pb-[120px] lg:pb-[30px]"
      style={{
        background:
          "linear-gradient(180deg, #0F0B23 0%, #2A2545 100%), linear-gradient(0deg, rgba(0,0,0,0.45), rgba(0,0,0,0.45))",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Hexagon line pattern overlay */}
      <svg
        className="absolute inset-0 w-full h-full text-[#5C2CCB] opacity-10"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="hexPattern" width="36" height="42" patternUnits="userSpaceOnUse">
            <path
              d="M18 0 L36 10.5 L36 31.5 L18 42 L0 31.5 L0 10.5 Z"
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexPattern)" />
      </svg>

      <div className="relative z-10 mx-auto flex flex-col items-center" style={{ maxWidth: "90rem" }}>
        {/* Centered logo, slightly overlapping top edge */}
        <div className="absolute w-[270px] h-[150px] -top-[110px] left-1/2 -translate-x-1/2 z-20 overflow-hidden flex items-center justify-center">
          <Image
            src={orgData?.orgz_logo || "/ysnlogo.webp"}
            alt={orgData?.orgz_name || "Organization"}
            width={140}
            height={100}
            className="object-contain"
          />
        </div>

        <h1
          className="text-white mb-4 font-bold text-xl w-full text-center pt-[48px] uppercase"
        >
          {orgData?.orgz_name || "Organization"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 w-full text-center text-sm border-[#ffffff20]">
          <div className="px-2">
            <p className="text-[#A0A0A0] mb-5 text-[18px]">Wins</p>
            <p className="font-bold text-[20px]">{orgData?.orgz_wins ?? 0}</p>
          </div>
          <div className="px-2 relative">
            <p className="text-[#A0A0A0] mb-5 text-[18px]">Losses</p>
            <p className="font-bold text-[20px]">{orgData?.orgz_losses ?? 0}</p>
            <div className="hidden lg:block bg-gradient-to-b from-[#3D167C] to-[#3705DC] w-0.5 absolute top-5 right-0 h-1/2" />
          </div>
          <div className="px-2 relative">
            <p className="text-[#A0A0A0] mb-5 text-[18px]">Ties</p>
            <p className="font-bold text-[20px]">{orgData?.orgz_ties ?? 0}</p>
            <div className="hidden lg:block bg-gradient-to-b from-[#3D167C] to-[#3705DC] w-0.5 absolute top-5 right-0 h-1/2" />
          </div>
          <div className="px-2">
            <p className="text-[#A0A0A0] mb-5 text-[18px]">State</p>
            <p className="font-bold text-[18px]">{orgData?.state_name || "-"}</p>
          </div>
          <div className="px-2 relative">
            <p className="text-[#A0A0A0] mb-5 text-[18px]">Age Group</p>
            <p className="font-bold text-[20px]">{orgData?.players_age_group || "-"}</p>
            <div className="hidden lg:block bg-gradient-to-b from-[#3D167C] to-[#3705DC] w-0.5 absolute top-5 right-0 h-1/2" />
          </div>
          <div className="px-2">
            <p className="text-[#A0A0A0] mb-5 text-[18px]">National Rank</p>
            <p className="font-bold text-[20px]">{orgData?.orgz_national_rank ?? "-"}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={handleShare}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full h-[40px] px-4 text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/20 transition-all text-white"
          >
            <Share2 className="mr-2 h-4 w-4" /> Share
          </button>
        </div>
      </div>
    </div>
  )
}