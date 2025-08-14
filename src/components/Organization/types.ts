export type OrganizationDetails = {
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

export type MatchSchedule = {
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

export type Team = {
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

export type OrganizationDetailsPayload = {
  organizationDetails: OrganizationDetails;
  matchSchedules: MatchSchedule[];
  teams: Team[];
  rosters: unknown;
};
