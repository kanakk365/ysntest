"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Blog from "@/components/LandingPage/Blog";
import Contact from "@/components/LandingPage/Contact";
import TopCard from "@/components/Organization/TopCard";
import Teams from "@/components/Organization/Teams";
import MatchCard from "@/components/Organization/MatchCard";
import MatchSchedule from "@/components/Organization/MatchSchedule";
import UpcomingMatch from "@/components/Organization/UpcomingMatch";
import OrganizationSubscribers from "@/components/Organization/OrganizationSubscribers";
import { useAuthStore, USER_TYPE } from "@/lib/auth-store";
import OrgService from "@/lib/orgservice";
import Streaming from "@/components/LandingPage/Streaming";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

type OrganizationDetails = {
  orgz_id?: number;
  orgz_user_id?: number;
  orgz_name?: string;
  orgz_web_url?: string | null;
  orgz_email?: string | null;
  orgz_stat_id?: number | null;
  orgz_year_founded?: number | null;
  orgz_live_stream_url?: string | null;
  orgz_svtm_id?: number | null;
  orgz_logo?: string | null;
  orgz_cover_photo?: string | null;
  orgz_desc?: string | null;
  orgz_wins?: number | null;
  orgz_losses?: number | null;
  orgz_ties?: number | null;
  orgz_chat?: number | null;
  orgz_pagm_id?: number | null;
  orgz_national_rank?: number | null;
  orgz_created?: string | null;
  orgz_modified?: string | null;
  orgz_status?: number | null;
  orgz_slug_name?: string;
  state_name?: string | null;
  players_age_group?: string | null;
  [key: string]: unknown;
};

// ApiResponse type now provided by api layer where needed

// helper removed; normalized via components when needed

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

type Team = {
  team_id: number;
  team_orgz_id: number;
  team_user_id: number;
  team_sport_id: number | null;
  team_timz_id: number | null;
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
  logo: string | null;
};

type OrganizationDetailsPayload = {
  organizationDetails: OrganizationDetails;
  matchSchedules: MatchSchedule[];
  teams: Team[];
  rosters: unknown;
};

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

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamLogo, setNewTeamLogo] = useState<File | null>(null);
  const [newTeamStreamUrl, setNewTeamStreamUrl] = useState("");
  const [newTeamSvtmId, setNewTeamSvtmId] = useState("");
  const [newTeamFromAge, setNewTeamFromAge] = useState("");
  const [newTeamToAge, setNewTeamToAge] = useState("");
  const [newTeamNationalRank, setNewTeamNationalRank] = useState("");
  const [newTeamRankUrl, setNewTeamRankUrl] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState<number | "">("");
  const [editTeamId, setEditTeamId] = useState<number | "">("");
  const [editTeamName, setEditTeamName] = useState("");
  const [editTeamLogo, setEditTeamLogo] = useState<File | null>(null);
  const [editTeamStreamUrl, setEditTeamStreamUrl] = useState("");
  const [editTeamSvtmId, setEditTeamSvtmId] = useState("");
  const [editTeamFromAge, setEditTeamFromAge] = useState("");
  const [editTeamToAge, setEditTeamToAge] = useState("");
  const [editTeamNationalRank, setEditTeamNationalRank] = useState("");
  const [editTeamRankUrl, setEditTeamRankUrl] = useState("");
  const [editTeamDesc, setEditTeamDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const canManageTeams = user?.user_type === USER_TYPE.ORGANIZATION;

  const submitAddTeam = async () => {
    if (!org?.orgz_id || !newTeamName.trim()) return;
    if (!user?.token) {
      toast.error("You must be logged in");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("team_id", "");
      formData.append("team_orgz_id", String(org.orgz_id));
      formData.append("team_name", newTeamName.trim());
      if (newTeamLogo) formData.append("logo", newTeamLogo);
      if (newTeamStreamUrl)
        formData.append("team_live_streaming_url", newTeamStreamUrl);
      if (newTeamSvtmId) formData.append("team_svtm_id", newTeamSvtmId);
      if (newTeamFromAge)
        formData.append("team_from_age_group", newTeamFromAge);
      if (newTeamToAge) formData.append("team_to_age_group", newTeamToAge);
      if (newTeamNationalRank)
        formData.append("team_national_rank", newTeamNationalRank);
      if (newTeamRankUrl) formData.append("team_rank_url", newTeamRankUrl);
      if (newTeamDesc) formData.append("team_desc", newTeamDesc);

      const data = await OrgService.teams.storeUpdate(formData);

      if (data?.status) {
        toast.success(data?.message || "Team created successfully");
        setIsAddOpen(false);
        setNewTeamName("");
        setNewTeamLogo(null);
        await reloadDetails();
      } else {
        toast.error(data?.message || "Failed to create team");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to create team");
    } finally {
      setSubmitting(false);
    }
  };

  const submitDeleteTeam = async () => {
    if (!selectedTeamId) return;
    if (!user?.token) {
      toast.error("You must be logged in");
      return;
    }
    setSubmitting(true);
    try {
      const payload = { deletedId: String(selectedTeamId) };
      const data = await OrgService.teams.delete(payload);
      if (data?.status) {
        toast.success(data?.message || "Team deleted successfully");
        setIsDeleteOpen(false);
        setSelectedTeamId("");
        await reloadDetails();
      } else {
        toast.error(data?.message || "Failed to delete team");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete team");
    } finally {
      setSubmitting(false);
    }
  };

  const submitEditTeam = async () => {
    if (!org?.orgz_id || !editTeamId || !editTeamName.trim()) return;
    if (!user?.token) {
      toast.error("You must be logged in");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("team_id", String(editTeamId));
      formData.append("team_orgz_id", String(org.orgz_id));
      formData.append("team_name", editTeamName.trim());
      if (editTeamLogo) formData.append("logo", editTeamLogo);
      if (editTeamStreamUrl)
        formData.append("team_live_streaming_url", editTeamStreamUrl);
      if (editTeamSvtmId) formData.append("team_svtm_id", editTeamSvtmId);
      if (editTeamFromAge)
        formData.append("team_from_age_group", editTeamFromAge);
      if (editTeamToAge) formData.append("team_to_age_group", editTeamToAge);
      if (editTeamNationalRank)
        formData.append("team_national_rank", editTeamNationalRank);
      if (editTeamRankUrl) formData.append("team_rank_url", editTeamRankUrl);
      if (editTeamDesc) formData.append("team_desc", editTeamDesc);

      const data = await OrgService.teams.storeUpdate(formData);
      if (data?.status) {
        toast.success(data?.message || "Team updated successfully");
        setIsEditOpen(false);
        setEditTeamId("");
        setEditTeamName("");
        setEditTeamLogo(null);
        await reloadDetails();
      } else {
        toast.error(data?.message || "Failed to update team");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to update team");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen ">
      <div className="bg-black text-white py-12 mt-20 md:px-6 z-10">
        <div className="container m-auto flex flex-col items-center gap-10">
          {isLoading ? (
            <div className="flex mt-[120px] mb-[200px]">
              <h2 className="text-center">Loading...</h2>
            </div>
          ) : !org ? (
            <div className="flex mt-[120px] mb-[200px]">
              <h2 className="text-center">
                {error ?? "Organization not found"}
              </h2>
            </div>
          ) : (
            <div className="w-full max-w-7xl">
              <TopCard orgData={org} />
              {canManageTeams && (
                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  >
                    <Plus className="w-4 h-4" /> Add Team
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditOpen(true);
                      if (teams.length > 0) {
                        setEditTeamId(teams[0].team_id);
                        setEditTeamName(teams[0].team_name);
                        setEditTeamStreamUrl(
                          teams[0].team_live_streaming_url ?? ""
                        );
                        setEditTeamSvtmId(
                          teams[0].team_svtm_id != null
                            ? String(teams[0].team_svtm_id)
                            : ""
                        );
                        setEditTeamFromAge(
                          teams[0].team_from_age_group != null
                            ? String(teams[0].team_from_age_group)
                            : ""
                        );
                        setEditTeamToAge(
                          teams[0].team_to_age_group != null
                            ? String(teams[0].team_to_age_group)
                            : ""
                        );
                        setEditTeamNationalRank(
                          teams[0].team_national_rank != null
                            ? String(teams[0].team_national_rank)
                            : ""
                        );
                        setEditTeamRankUrl(teams[0].team_rank_url ?? "");
                        setEditTeamDesc(teams[0].team_desc ?? "");
                      }
                    }}
                    disabled={teams.length === 0}
                  >
                    <Pencil className="w-4 h-4" /> Edit Team
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteOpen(true)}
                    disabled={teams.length === 0}
                  >
                    <Trash2 className="w-4 h-4" /> Delete Team
                  </Button>
                </div>
              )}
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
              <Dialog
                open={isAddOpen}
                onOpenChange={(open) => {
                  setIsAddOpen(open);
                  if (!open) {
                    setNewTeamLogo(null);
                    setNewTeamName("");
                    setNewTeamStreamUrl("");
                    setNewTeamSvtmId("");
                    setNewTeamFromAge("");
                    setNewTeamToAge("");
                    setNewTeamNationalRank("");
                    setNewTeamRankUrl("");
                    setNewTeamDesc("");
                  }
                }}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Team</DialogTitle>
                    <DialogDescription>
                      Create a new team for this organization.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                      <Label htmlFor="teamName">Team Name</Label>
                      <Input
                        id="teamName"
                        placeholder="Enter team name"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="teamStream">Live Streaming URL</Label>
                      <Input
                        id="teamStream"
                        placeholder="https://..."
                        value={newTeamStreamUrl}
                        onChange={(e) => setNewTeamStreamUrl(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="svtmId">SVTM ID</Label>
                        <Input
                          id="svtmId"
                          type="number"
                          placeholder="1"
                          value={newTeamSvtmId}
                          onChange={(e) => setNewTeamSvtmId(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="nationalRank">National Rank</Label>
                        <Input
                          id="nationalRank"
                          type="number"
                          placeholder="4"
                          value={newTeamNationalRank}
                          onChange={(e) =>
                            setNewTeamNationalRank(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="fromAge">From Age</Label>
                        <Input
                          id="fromAge"
                          type="number"
                          placeholder="10"
                          value={newTeamFromAge}
                          onChange={(e) => setNewTeamFromAge(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="toAge">To Age</Label>
                        <Input
                          id="toAge"
                          type="number"
                          placeholder="15"
                          value={newTeamToAge}
                          onChange={(e) => setNewTeamToAge(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="rankUrl">Rank URL</Label>
                      <Input
                        id="rankUrl"
                        placeholder="https://..."
                        value={newTeamRankUrl}
                        onChange={(e) => setNewTeamRankUrl(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="teamDesc">Description</Label>
                      <Textarea
                        id="teamDesc"
                        placeholder="Write something..."
                        value={newTeamDesc}
                        onChange={(e) => setNewTeamDesc(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="teamLogo">Logo (optional)</Label>
                      <Input
                        id="teamLogo"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setNewTeamLogo(e.target.files?.[0] || null)
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setIsAddOpen(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={submitAddTeam}
                      disabled={!newTeamName.trim() || submitting}
                    >
                      {submitting ? "Adding..." : "Add Team"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={isEditOpen}
                onOpenChange={(open) => {
                  setIsEditOpen(open);
                  if (!open) {
                    setEditTeamId("");
                    setEditTeamName("");
                    setEditTeamLogo(null);
                    setEditTeamStreamUrl("");
                    setEditTeamSvtmId("");
                    setEditTeamFromAge("");
                    setEditTeamToAge("");
                    setEditTeamNationalRank("");
                    setEditTeamRankUrl("");
                    setEditTeamDesc("");
                  }
                }}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Team</DialogTitle>
                    <DialogDescription>
                      Update an existing team.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                      <Label htmlFor="editTeamSelect">Select Team</Label>
                      <select
                        id="editTeamSelect"
                        className="bg-black text-gray-200 border border-gray-700 rounded-md p-2"
                        value={editTeamId}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "") {
                            setEditTeamId("");
                            setEditTeamName("");
                            setEditTeamStreamUrl("");
                            setEditTeamSvtmId("");
                            setEditTeamFromAge("");
                            setEditTeamToAge("");
                            setEditTeamNationalRank("");
                            setEditTeamRankUrl("");
                            setEditTeamDesc("");
                          } else {
                            const idNum = Number(val);
                            setEditTeamId(idNum);
                            const t = teams.find((tt) => tt.team_id === idNum);
                            setEditTeamName(t?.team_name || "");
                            setEditTeamStreamUrl(
                              t?.team_live_streaming_url ?? ""
                            );
                            setEditTeamSvtmId(
                              t?.team_svtm_id != null
                                ? String(t.team_svtm_id)
                                : ""
                            );
                            setEditTeamFromAge(
                              t?.team_from_age_group != null
                                ? String(t.team_from_age_group)
                                : ""
                            );
                            setEditTeamToAge(
                              t?.team_to_age_group != null
                                ? String(t.team_to_age_group)
                                : ""
                            );
                            setEditTeamNationalRank(
                              t?.team_national_rank != null
                                ? String(t.team_national_rank)
                                : ""
                            );
                            setEditTeamRankUrl(t?.team_rank_url ?? "");
                            setEditTeamDesc(t?.team_desc ?? "");
                          }
                        }}
                      >
                        <option value="">Select team</option>
                        {teams.map((t) => (
                          <option key={t.team_id} value={t.team_id}>
                            {t.team_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="editTeamName">Team Name</Label>
                      <Input
                        id="editTeamName"
                        placeholder="Enter team name"
                        value={editTeamName}
                        onChange={(e) => setEditTeamName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="editTeamStream">Live Streaming URL</Label>
                      <Input
                        id="editTeamStream"
                        placeholder="https://..."
                        value={editTeamStreamUrl}
                        onChange={(e) => setEditTeamStreamUrl(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="editSvtmId">SVTM ID</Label>
                        <Input
                          id="editSvtmId"
                          type="number"
                          placeholder="1"
                          value={editTeamSvtmId}
                          onChange={(e) => setEditTeamSvtmId(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="editNationalRank">National Rank</Label>
                        <Input
                          id="editNationalRank"
                          type="number"
                          placeholder="4"
                          value={editTeamNationalRank}
                          onChange={(e) =>
                            setEditTeamNationalRank(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="editFromAge">From Age</Label>
                        <Input
                          id="editFromAge"
                          type="number"
                          placeholder="10"
                          value={editTeamFromAge}
                          onChange={(e) => setEditTeamFromAge(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="editToAge">To Age</Label>
                        <Input
                          id="editToAge"
                          type="number"
                          placeholder="15"
                          value={editTeamToAge}
                          onChange={(e) => setEditTeamToAge(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="editRankUrl">Rank URL</Label>
                      <Input
                        id="editRankUrl"
                        placeholder="https://..."
                        value={editTeamRankUrl}
                        onChange={(e) => setEditTeamRankUrl(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="editTeamDesc">Description</Label>
                      <Textarea
                        id="editTeamDesc"
                        placeholder="Write something..."
                        value={editTeamDesc}
                        onChange={(e) => setEditTeamDesc(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="editTeamLogo">Logo (optional)</Label>
                      <Input
                        id="editTeamLogo"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setEditTeamLogo(e.target.files?.[0] || null)
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditOpen(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={submitEditTeam}
                      disabled={
                        !editTeamId || !editTeamName.trim() || submitting
                      }
                    >
                      {submitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Team</DialogTitle>
                    <DialogDescription>
                      Select a team to delete from this organization.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                      <Label htmlFor="teamSelect">Team</Label>
                      <select
                        id="teamSelect"
                        className="bg-black text-gray-200 border border-gray-700 rounded-md p-2"
                        value={selectedTeamId}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "") setSelectedTeamId("");
                          else setSelectedTeamId(Number(val));
                        }}
                      >
                        <option value="">Select team</option>
                        {teams.map((t) => (
                          <option key={t.team_id} value={t.team_id}>
                            {t.team_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setIsDeleteOpen(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={submitDeleteTeam}
                      disabled={!selectedTeamId || submitting}
                    >
                      {submitting ? "Deleting..." : "Delete Team"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>

      <Blog />
      <Contact />
    </div>
  );
}
