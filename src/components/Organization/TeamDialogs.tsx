"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { OrganizationDetails, Team } from "./types";

interface TeamDialogsProps {
  org: OrganizationDetails | null;
  teams: Team[];
  isAddOpen: boolean;
  isEditOpen: boolean;
  isDeleteOpen: boolean;
  submitting: boolean;
  onAddOpenChange: (open: boolean) => void;
  onEditOpenChange: (open: boolean) => void;
  onDeleteOpenChange: (open: boolean) => void;
  onSubmitAdd: (formData: FormData) => Promise<void>;
  onSubmitEdit: (formData: FormData) => Promise<void>;
  onSubmitDelete: (teamId: number) => Promise<void>;
}

export function TeamDialogs({
  org,
  teams,
  isAddOpen,
  isEditOpen,
  isDeleteOpen,
  submitting,
  onAddOpenChange,
  onEditOpenChange,
  onDeleteOpenChange,
  onSubmitAdd,
  onSubmitEdit,
  onSubmitDelete,
}: TeamDialogsProps) {
  // Add team form state
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamLogo, setNewTeamLogo] = useState<File | null>(null);
  const [newTeamStreamUrl, setNewTeamStreamUrl] = useState("");
  const [newTeamSvtmId, setNewTeamSvtmId] = useState("");
  const [newTeamFromAge, setNewTeamFromAge] = useState("");
  const [newTeamToAge, setNewTeamToAge] = useState("");
  const [newTeamNationalRank, setNewTeamNationalRank] = useState("");
  const [newTeamRankUrl, setNewTeamRankUrl] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");

  // Edit team form state
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

  // Delete team form state
  const [selectedTeamId, setSelectedTeamId] = useState<number | "">("");

  // Reset add form when dialog closes
  useEffect(() => {
    if (!isAddOpen) {
      setNewTeamName("");
      setNewTeamLogo(null);
      setNewTeamStreamUrl("");
      setNewTeamSvtmId("");
      setNewTeamFromAge("");
      setNewTeamToAge("");
      setNewTeamNationalRank("");
      setNewTeamRankUrl("");
      setNewTeamDesc("");
    }
  }, [isAddOpen]);

  // Reset edit form when dialog closes
  useEffect(() => {
    if (!isEditOpen) {
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
  }, [isEditOpen]);

  // Reset delete form when dialog closes
  useEffect(() => {
    if (!isDeleteOpen) {
      setSelectedTeamId("");
    }
  }, [isDeleteOpen]);

  const handleAddSubmit = () => {
    if (!org?.orgz_id || !newTeamName.trim()) return;
    
    const formData = new FormData();
    formData.append("team_id", "");
    formData.append("team_orgz_id", String(org.orgz_id));
    formData.append("team_name", newTeamName.trim());
    if (newTeamLogo) formData.append("logo", newTeamLogo);
    if (newTeamStreamUrl) formData.append("team_live_streaming_url", newTeamStreamUrl);
    if (newTeamSvtmId) formData.append("team_svtm_id", newTeamSvtmId);
    if (newTeamFromAge) formData.append("team_from_age_group", newTeamFromAge);
    if (newTeamToAge) formData.append("team_to_age_group", newTeamToAge);
    if (newTeamNationalRank) formData.append("team_national_rank", newTeamNationalRank);
    if (newTeamRankUrl) formData.append("team_rank_url", newTeamRankUrl);
    if (newTeamDesc) formData.append("team_desc", newTeamDesc);

    onSubmitAdd(formData);
  };

  const handleEditSubmit = () => {
    if (!org?.orgz_id || !editTeamId || !editTeamName.trim()) return;
    
    const formData = new FormData();
    formData.append("team_id", String(editTeamId));
    formData.append("team_orgz_id", String(org.orgz_id));
    formData.append("team_name", editTeamName.trim());
    if (editTeamLogo) formData.append("logo", editTeamLogo);
    if (editTeamStreamUrl) formData.append("team_live_streaming_url", editTeamStreamUrl);
    if (editTeamSvtmId) formData.append("team_svtm_id", editTeamSvtmId);
    if (editTeamFromAge) formData.append("team_from_age_group", editTeamFromAge);
    if (editTeamToAge) formData.append("team_to_age_group", editTeamToAge);
    if (editTeamNationalRank) formData.append("team_national_rank", editTeamNationalRank);
    if (editTeamRankUrl) formData.append("team_rank_url", editTeamRankUrl);
    if (editTeamDesc) formData.append("team_desc", editTeamDesc);

    onSubmitEdit(formData);
  };

  const handleDeleteSubmit = () => {
    if (!selectedTeamId) return;
    onSubmitDelete(selectedTeamId);
  };

  const handleEditTeamSelect = (teamId: string) => {
    if (teamId === "") {
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
      const idNum = Number(teamId);
      setEditTeamId(idNum);
      const team = teams.find((t) => t.team_id === idNum);
      if (team) {
        setEditTeamName(team.team_name);
        setEditTeamStreamUrl(team.team_live_streaming_url ?? "");
        setEditTeamSvtmId(team.team_svtm_id != null ? String(team.team_svtm_id) : "");
        setEditTeamFromAge(team.team_from_age_group != null ? String(team.team_from_age_group) : "");
        setEditTeamToAge(team.team_to_age_group != null ? String(team.team_to_age_group) : "");
        setEditTeamNationalRank(team.team_national_rank != null ? String(team.team_national_rank) : "");
        setEditTeamRankUrl(team.team_rank_url ?? "");
        setEditTeamDesc(team.team_desc ?? "");
      }
    }
  };

  return (
    <>
      {/* Add Team Dialog */}
      <Dialog open={isAddOpen} onOpenChange={onAddOpenChange}>
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
                  onChange={(e) => setNewTeamNationalRank(e.target.value)}
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
                onChange={(e) => setNewTeamLogo(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => onAddOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSubmit}
              disabled={!newTeamName.trim() || submitting}
            >
              {submitting ? "Adding..." : "Add Team"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog open={isEditOpen} onOpenChange={onEditOpenChange}>
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
                onChange={(e) => handleEditTeamSelect(e.target.value)}
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
                  onChange={(e) => setEditTeamNationalRank(e.target.value)}
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
                onChange={(e) => setEditTeamLogo(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => onEditOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              disabled={!editTeamId || !editTeamName.trim() || submitting}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Team Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
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
              onClick={() => onDeleteOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSubmit}
              disabled={!selectedTeamId || submitting}
            >
              {submitting ? "Deleting..." : "Delete Team"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
