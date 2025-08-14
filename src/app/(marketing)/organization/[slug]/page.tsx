"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Blog from "@/components/LandingPage/Blog";
import Contact from "@/components/ui/contact";
import TopCard from "@/components/Organization/TopCard";
import Teams from "@/components/Organization/Teams";
import MatchCard from "@/components/Organization/MatchCard";
import UpcomingMatch from "@/components/Organization/UpcomingMatch";
import OrganizationSubscribers from "@/components/Organization/OrganizationSubscribers";
import { useAuthStore } from "@/lib/auth-store";
import OrgService from "@/lib/orgservice";
import Streaming from "@/components/LandingPage/Streaming";
import Schedule from "@/components/LandingPage/Schedule";
import { TeamManagement } from "@/components/Organization/TeamManagement";
import { OrganizationDetails, MatchSchedule, Team, OrganizationDetailsPayload } from "@/components/Organization/types";

export default function OrganizationDetailsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const { user } = useAuthStore();

  const [org, setOrg] = useState<OrganizationDetails | null>(null);
  const [matchSchedules, setMatchSchedules] = useState<MatchSchedule[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [subscribers] = useState<
    {
      orgs_id: number;
      name: string;
      email: string;
      user_type?: number | null;
      user_mobile?: string | null;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reloadDetails = useCallback(async () => {
    try {
      const response = await OrgService.getDetails(String(slug));
      const payload = response as unknown as {
        status: boolean;
        data: OrganizationDetailsPayload;
      };
      if (payload?.status && payload?.data?.organizationDetails) {
        setOrg(payload.data.organizationDetails);
        setMatchSchedules(payload.data.matchSchedules || []);
        setTeams(payload.data.teams || []);
      }
    } catch (e) {
      console.error(e);
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await reloadDetails();
      } catch {
        if (isMounted) setError("Failed to load organization details");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [reloadDetails, slug]);

  if (isLoading) {
    return (
      <div className="bg-black text-white min-h-screen">
        <div className="bg-black text-white py-12 mt-20 md:px-6 z-10">
          <div className="container m-auto flex flex-col items-center gap-10">
            <div className="flex mt-[120px] mb-[200px]">
              <h2 className="text-center">Loading...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="bg-black text-white min-h-screen">
        <div className="bg-black text-white py-12 mt-20 md:px-6 z-10">
          <div className="container m-auto flex flex-col items-center gap-10">
            <div className="flex mt-[120px] mb-[200px]">
              <h2 className="text-center">
                {error ?? "Organization not found"}
              </h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="bg-black text-white py-12 mt-20 md:px-6 z-10">
        <div className="container m-auto flex flex-col items-center gap-10">
          <div className="w-full max-w-7xl">
            <TopCard orgData={org} />
            
            <TeamManagement 
              org={org} 
              teams={teams} 
              onTeamsUpdate={reloadDetails} 
            />
            
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
              <Streaming />
            </div>
            
            <div className="mt-6">
              <Schedule />
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
        </div>
      </div>

      <Blog />
      <Contact />
    </div>
  );
}
