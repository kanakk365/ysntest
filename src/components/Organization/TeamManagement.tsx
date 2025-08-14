"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore, USER_TYPE } from "@/lib/auth-store";
import OrgService from "@/lib/orgservice";
import { TeamDialogs } from "./TeamDialogs";
import { OrganizationDetails, Team } from "./types";

interface TeamManagementProps {
  org: OrganizationDetails | null;
  teams: Team[];
  onTeamsUpdate: () => void;
}

export function TeamManagement({ org, teams, onTeamsUpdate }: TeamManagementProps) {
  const { user } = useAuthStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canManageTeams = user?.user_type === USER_TYPE.ORGANIZATION;

  const submitAddTeam = async (formData: FormData) => {
    if (!org?.orgz_id) return;
    if (!user?.token) {
      toast.error("You must be logged in");
      return;
    }
    setSubmitting(true);
    try {
      const data = await OrgService.teams.storeUpdate(formData);

      if (data?.status) {
        toast.success(data?.message || "Team created successfully");
        setIsAddOpen(false);
        onTeamsUpdate();
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

  const submitDeleteTeam = async (teamId: number) => {
    if (!user?.token) {
      toast.error("You must be logged in");
      return;
    }
    setSubmitting(true);
    try {
      const payload = { deletedId: String(teamId) };
      const data = await OrgService.teams.delete(payload);
      if (data?.status) {
        toast.success(data?.message || "Team deleted successfully");
        setIsDeleteOpen(false);
        onTeamsUpdate();
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

  const submitEditTeam = async (formData: FormData) => {
    if (!org?.orgz_id) return;
    if (!user?.token) {
      toast.error("You must be logged in");
      return;
    }
    setSubmitting(true);
    try {
      const data = await OrgService.teams.storeUpdate(formData);
      if (data?.status) {
        toast.success(data?.message || "Team updated successfully");
        setIsEditOpen(false);
        onTeamsUpdate();
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

  if (!canManageTeams) {
    return null;
  }

  return (
    <>
      <div className="mt-6 flex justify-end gap-3">
        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
        >
          <Plus className="w-4 h-4" /> Add Team
        </Button>
        <Button
          onClick={() => setIsEditOpen(true)}
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

      <TeamDialogs
        org={org}
        teams={teams}
        isAddOpen={isAddOpen}
        isEditOpen={isEditOpen}
        isDeleteOpen={isDeleteOpen}
        submitting={submitting}
        onAddOpenChange={setIsAddOpen}
        onEditOpenChange={setIsEditOpen}
        onDeleteOpenChange={setIsDeleteOpen}
        onSubmitAdd={submitAddTeam}
        onSubmitEdit={submitEditTeam}
        onSubmitDelete={submitDeleteTeam}
      />
    </>
  );
}
