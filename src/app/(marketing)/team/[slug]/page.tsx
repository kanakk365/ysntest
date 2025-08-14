"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Blog from "@/components/LandingPage/Blog";
import Contact from "@/components/ui/contact";
import TopCard from "@/components/Organization/TopCard";
import MatchCard from "@/components/Organization/MatchCard";
import UpcomingMatch from "@/components/Organization/UpcomingMatch";
import { useAuthStore } from "@/lib/auth-store";
import Streaming from "@/components/LandingPage/Streaming";
import Players from "@/components/Team/Players";

type ApiResponse<T> = {
  status: boolean;
  data: T;
  message: string;
};

type TeamDetails = {
  team_id: number;
  team_user_id: number;
  team_sport_id: number | null;
  team_stat_id?: number | null;
  team_timz_id?: number | null;
  team_name: string;
  team_logo: string | null;
  team_live_streaming_url: string | null;
  team_svtm_id: number | null;
  team_from_age_group: number | null;
  team_to_age_group: number | null;
  team_national_rank: number | null;
  team_rank_url: string | null;
  team_wins: number | null;
  team_losses: number | null;
  team_ties: number | null;
  team_desc: string | null;
  team_slug_name: string;
  team_created?: string | null;
  team_modified?: string | null;
  team_status?: number | null;
  team_orgz_id?: number | null;
  logo?: string | null;
};

type MatchSchedule = {
  match_id: number;
  match_orgz_id: number;
  organization_name: string;
  your_team_id: number;
  your_team_name: string;
  team_logo: string | null;
  opponent_team_id: number;
  opponent_team_name: string;
  opponent_team_logo: string | null;
  your_team_score: number | null;
  opponent_team_score: number | null;
  match_played_date: string;
  win_or_lose: string;
};

type TeamDetailsPayload = {
  teamDetails: TeamDetails;
  matchSchedules: MatchSchedule[];
  teamPlayers?: unknown[];
  streamUrl?: string | null;
  rosters?: unknown;
};

export default function TeamDetailsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const { user, hydrated, loading } = useAuthStore();

  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [matchSchedules, setMatchSchedules] = useState<MatchSchedule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<{ id: number; name: string; logo: string | null; slug?: string }[]>([]);

  useEffect(() => {
    if (!slug) return;
    if (loading || !hydrated) return;
    const controller = new AbortController();

    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const headers = user?.token
          ? { Authorization: `Bearer ${user.token}` }
          : undefined;
        const { data } = await axios.get<ApiResponse<TeamDetailsPayload>>(
          `https://beta.ysn.tv/api/team-details/${encodeURIComponent(
            String(slug)
          )}`,
          { headers, signal: controller.signal }
        );
        console.log("team-details meta", {
          status: (data as Record<string, unknown>)?.status,
          statusType: typeof (data as Record<string, unknown>)?.status,
          hasData: Boolean((data as Record<string, unknown>)?.data)
        });

        // Parse payload regardless of status value
        const raw = (data?.data ?? null) as {
          teamDetails?: TeamDetails;
          team_detail?: TeamDetails;
          team?: TeamDetails;
          matchSchedules?: MatchSchedule[];
        } | null;

        const details: TeamDetails | null = raw?.teamDetails ?? raw?.team_detail ?? raw?.team ?? null;
        const schedules: MatchSchedule[] = Array.isArray(raw?.matchSchedules) ? (raw!.matchSchedules as MatchSchedule[]) : [];

        if (details) {
          setTeam(details);
          setMatchSchedules(schedules);
          // Map team players into lightweight card items
          const rawPlayers = (raw as { teamPlayers?: Array<{
            kids_id: number;
            kids_fname: string;
            kids_lname: string;
            kids_avatar?: string | null;
            logo?: string | null;
            kids_slug_name?: string;
          }> }).teamPlayers || [];

          const mappedPlayers = rawPlayers.map((p) => ({
            id: p.kids_id,
            name: `${p.kids_fname ?? ""} ${p.kids_lname ?? ""}`.trim(),
            logo: (p.kids_avatar && p.kids_avatar.startsWith("http")) ? p.kids_avatar : (p.logo ?? null),
            slug: p.kids_slug_name,
          }));
          setPlayers(mappedPlayers);
          setError(null);
        } else {
          setError((data as Record<string, unknown>)?.message as string || "Team not found");
        }
      } catch (err) {
        const errorObj = err as unknown as { code?: string; name?: string };
        const isCanceled =
          // axios cancel helper when available
          (axios as unknown as { isCancel?: (e: unknown) => boolean }).isCancel?.(err) === true ||
          errorObj?.code === "ERR_CANCELED" ||
          errorObj?.name === "CanceledError";
        if (isCanceled) {
          return;
        }
        setError("Failed to load team details");
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      controller.abort();
    };
  }, [slug, user?.token, hydrated, loading]);

  const mappedTopCardData = useMemo(() => {
    if (!team) return null;
    const ageGroup =
      team.team_from_age_group != null && team.team_to_age_group != null
        ? `${team.team_from_age_group}-${team.team_to_age_group}`
        : null;
    return {
      orgz_name: team.team_name,
      orgz_logo: team.team_logo ?? team.logo ?? null,
      orgz_wins: team.team_wins ?? 0,
      orgz_losses: team.team_losses ?? 0,
      orgz_ties: team.team_ties ?? 0,
      state_name: null as string | null,
      players_age_group: ageGroup,
      orgz_national_rank: team.team_national_rank ?? null,
    };
  }, [team]);

  return (
    <div className="bg-black text-white min-h-screen">
     
      <div className="bg-black text-white mt-20 py-12 md:px-6 z-10">
        <div className="container m-auto flex flex-col items-center gap-10">
          {isLoading ? (
            <div className="flex mt-[120px] mb-[200px]">
              <h2 className="text-center">Loading...</h2>
            </div>
          ) : !team ? (
            <div className="flex mt-[120px] mb-[200px]">
              <h2 className="text-center">{error ?? "Team not found"}</h2>
            </div>
          ) : (
            <div className="w-full max-w-7xl">
              <TopCard orgData={mappedTopCardData} />

              <div className="mt-6">
                <MatchCard matchschedules={matchSchedules} />
              </div>

              <div className="mt-6">
                <Players players={players} />
              </div>

              <div className="mt-6">
                <Streaming />
              </div>

              {/* Keep schedules and calendar view similar to organization page */}
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
  );
}
