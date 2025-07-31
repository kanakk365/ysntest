"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, Edit, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { api, OpponentTeam } from "@/lib/api";
import { toast } from "sonner";

export function OpponentTeamsTab() {
  const [teams, setTeams] = useState<OpponentTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<OpponentTeam | null>(null);
  const [deletingTeam, setDeletingTeam] = useState<OpponentTeam | null>(null);
  const [newTeam, setNewTeam] = useState({ 
    oppt_team_name: "", 
    logo: null as File | null 
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const itemsPerPage = 5;

  // Fetch teams on component mount
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await api.opponentTeams.getList();
      
      if (response.status) {
        setTeams(response.data);
      } else {
        toast.error(response.message || "Failed to fetch teams");
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter((team) =>
    team.oppt_team_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTeams = filteredTeams.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleAddTeam = async () => {
    if (!newTeam.oppt_team_name.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("oppt_team_name", newTeam.oppt_team_name);
      if (newTeam.logo) {
        formData.append("logo", newTeam.logo);
      }

      const response = await api.opponentTeams.storeUpdate(formData);
      
      if (response.status) {
        toast.success("Team added successfully");
        setNewTeam({ oppt_team_name: "", logo: null });
        setIsAddModalOpen(false);
        fetchTeams(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to add team");
      }
    } catch (error) {
      console.error("Error adding team:", error);
      toast.error("Failed to add team");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTeam = async () => {
    if (!editingTeam || !editingTeam.oppt_team_name.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("oppt_id", editingTeam.oppt_id.toString()); // Add team ID for update
      formData.append("oppt_team_name", editingTeam.oppt_team_name);
      if (editingTeam.oppt_team_logo) {
        // If there's a new logo file, add it
        // For now, we'll just update the name
      }

      const response = await api.opponentTeams.storeUpdate(formData);
      
      if (response.status) {
        toast.success("Team updated successfully");
        setIsEditModalOpen(false);
        setEditingTeam(null);
        fetchTeams(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to update team");
      }
    } catch (error) {
      console.error("Error updating team:", error);
      toast.error("Failed to update team");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!deletingTeam) return;

    try {
      setDeleting(true);
      const response = await api.opponentTeams.delete(deletingTeam.hash_id);
      
      if (response.status) {
        toast.success("Team deleted successfully");
        setIsDeleteModalOpen(false);
        setDeletingTeam(null);
        fetchTeams(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete team");
      }
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("Failed to delete team");
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (team: OpponentTeam) => {
    setDeletingTeam(team);
    setIsDeleteModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isEdit && editingTeam) {
        setEditingTeam({ ...editingTeam, oppt_team_logo: file.name });
      } else {
        setNewTeam({ ...newTeam, logo: file });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full ">
      <Card className="h-full flex flex-col rounded-none ">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Opponent Teams</CardTitle>
              <CardDescription>
                Manage your opponent teams and their information
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="cursor-pointer">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Team</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="teamName">Team Name</Label>
                      <Input
                        id="teamName"
                        value={newTeam.oppt_team_name}
                        onChange={(e) =>
                          setNewTeam({ ...newTeam, oppt_team_name: e.target.value })
                        }
                        placeholder="Enter team name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="teamLogo">Team Logo</Label>
                      <Input
                        id="teamLogo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e)}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        onClick={() => setIsAddModalOpen(false)}
                        disabled={submitting}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="cursor-pointer" 
                        onClick={handleAddTeam}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add Team"
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center">S.No.</TableHead>
                  <TableHead className="w-20 text-center">Logo</TableHead>
                  <TableHead className="flex-1">Team Name</TableHead>
                  <TableHead className="w-32 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTeams.map((team, index) => (
                  <TableRow key={team.oppt_id}>
                    <TableCell className="text-center font-medium">{startIndex + index + 1}</TableCell>
                    <TableCell className="text-center">
                      <Avatar className="h-10 w-10 mx-auto">
                        <AvatarImage src={team.logo} alt={team.oppt_team_name} />
                        <AvatarFallback className="text-sm font-medium">{team.oppt_team_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium text-left">{team.oppt_team_name}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        <Button
                          className="cursor-pointer"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingTeam(team);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          className="cursor-pointer bg-transparent hover:bg-transparent"
                          size="sm"
                          onClick={() => openDeleteModal(team)}
                        >
                          <Trash2 className="h-4 w-4 text-red-700" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredTeams.length)} of{" "}
              {filteredTeams.length} teams
            </div>
            <div className="flex gap-2">
              <Button
                className="cursor-pointer"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <Button
                className="cursor-pointer"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
          </DialogHeader>
          {editingTeam && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editTeamName">Team Name</Label>
                <Input
                  id="editTeamName"
                  value={editingTeam.oppt_team_name}
                  onChange={(e) =>
                    setEditingTeam({ ...editingTeam, oppt_team_name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editTeamLogo">Team Logo</Label>
                <Input
                  id="editTeamLogo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, true)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  className="cursor-pointer" 
                  onClick={handleEditTeam}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Delete Team
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deletingTeam?.oppt_team_name}</strong>? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeletingTeam(null);
              }}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTeam}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Team
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
