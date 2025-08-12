"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { useParams } from "next/navigation"
import Blog from "@/components/LandingPage/Blog"
import Contact from "@/components/LandingPage/Contact"
import TopCard from "@/components/Organization/TopCard"
import Teams from "@/components/Organization/Teams"
import MatchCard from "@/components/Organization/MatchCard"
import MatchSchedule from "@/components/Organization/MatchSchedule"
import UpcomingMatch from "@/components/Organization/UpcomingMatch"
import OrganizationSubscribers from "@/components/Organization/OrganizationSubscribers"
import { useAuthStore } from "@/lib/auth-store"
import Streaming from "@/components/LandingPage/Streaming"

type OrganizationDetails = {
  orgz_id?: number
  orgz_user_id?: number
  orgz_name?: string
  orgz_web_url?: string | null
  orgz_email?: string | null
  orgz_stat_id?: number | null
  orgz_year_founded?: number | null
  orgz_live_stream_url?: string | null
  orgz_svtm_id?: number | null
  orgz_logo?: string | null
  orgz_cover_photo?: string | null
  orgz_desc?: string | null
  orgz_wins?: number | null
  orgz_losses?: number | null
  orgz_ties?: number | null
  orgz_chat?: number | null
  orgz_pagm_id?: number | null
  orgz_national_rank?: number | null
  orgz_created?: string | null
  orgz_modified?: string | null
  orgz_status?: number | null
  orgz_slug_name?: string
  state_name?: string | null
  players_age_group?: string | null
  [key: string]: unknown
}

type ApiResponse<T> = {
  status: boolean
  data: T
  message: string
}

// helper removed; normalized via components when needed

type MatchSchedule = {
  match_id: number
  match_orgz_id: number
  organization_name: string
  your_team_id: number
  your_team_name: string
  team_logo: string | null
  opponent_team_id: number
  opponent_team_name: string
  opponent_team_logo: string | null
  your_team_score: number | null
  opponent_team_score: number | null
  match_played_date: string
  win_or_lose: string
}

type Team = {
  team_id: number
  team_orgz_id: number
  team_user_id: number
  team_sport_id: number | null
  team_timz_id: number | null
  team_name: string
  team_logo: string | null
  team_live_streaming_url: string | null
  team_svtm_id: number | null
  team_from_age_group: number | null
  team_to_age_group: number | null
  team_national_rank: number | null
  team_rank_url: string | null
  team_wins: number | null
  team_losses: number | null
  team_ties: number | null
  team_desc: string | null
  team_slug_name: string
  logo: string | null
}

type OrganizationDetailsPayload = {
  organizationDetails: OrganizationDetails
  matchSchedules: MatchSchedule[]
  teams: Team[]
  rosters: unknown
}

export default function OrganizationDetailsPage() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug
  const { user } = useAuthStore()

  const [org, setOrg] = useState<OrganizationDetails | null>(null)
  const [matchSchedules, setMatchSchedules] = useState<MatchSchedule[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [subscribers] = useState<
    { orgs_id: number; name: string; email: string; user_type?: number | null; user_mobile?: string | null }[]
  >([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    let isMounted = true
    const fetchDetails = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const headers = user?.token
          ? { Authorization: `Bearer ${user.token}` }
          : undefined
        const { data } = await axios.get<ApiResponse<OrganizationDetailsPayload>>(
          `https://beta.ysn.tv/api/organization-details/${encodeURIComponent(String(slug))}`,
          { headers }
        )
        if (isMounted && data?.status && data?.data?.organizationDetails) {
          setOrg(data.data.organizationDetails)
          setMatchSchedules(data.data.matchSchedules || [])
          setTeams(data.data.teams || [])
        } else if (isMounted) {
          setError("Organization not found")
        }
      } catch {
        if (isMounted) setError("Failed to load organization details")
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    fetchDetails()
    return () => {
      isMounted = false
    }
  }, [slug, user?.token])

  return (
    <div className="bg-black text-white min-h-screen">
      <div
        className="relative py-2 md:px-6  z-10 overflow-hidden"
      >
        <div
          className="relative flex flex-col md:flex-row items-end gap-3 border-b border-[#1C1A26] md:px-0 pt-[250px] md:pt-[185px]"
          style={{ justifyContent: "space-between" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-2xl">Organization Details</h1>
          </div>
          <div className="border-t border-[#1C1A26]" />
          <div className="flex items-center justify-center mb-5 w-full md:w-auto">
            <Link
              href="/organization"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-medium shadow hover:opacity-90 transition-opacity"
            >
              Back to Organizations
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-black text-white py-12 md:px-6 z-10">
        <div className="container m-auto flex flex-col items-center gap-10">
          {isLoading ? (
            <div className="flex mt-[120px] mb-[200px]">
              <h2 className="text-center">Loading...</h2>
            </div>
          ) : !org ? (
            <div className="flex mt-[120px] mb-[200px]">
              <h2 className="text-center">{error ?? "Organization not found"}</h2>
            </div>
          ) : (
            <div className="w-full max-w-7xl">
              <TopCard orgData={org} />
              <div className="mt-6">
                <MatchCard matchschedules={matchSchedules} />
              </div>
              <div className="mt-6">
                <Teams teams={teams} />
              </div>
              {user && !!subscribers.length && (
                <div className="mt-6">
                  <OrganizationSubscribers data={subscribers} />
                </div>
              )}
              <div className="mt-6">
                <Streaming/>
              </div>
              <div className="mt-6">
                <MatchSchedule />
              </div>
              <div className="mt-6">
                <UpcomingMatch
                  events={matchSchedules.map((m) => ({
                    event_id: m.match_id,
                    event_name: `${m.your_team_name} vs ${m.opponent_team_name}`,
                    state_date_time: m.match_played_date,
                    location: undefined,
                  }))}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <Blog />
      <Contact />
    </div>
  )
}


