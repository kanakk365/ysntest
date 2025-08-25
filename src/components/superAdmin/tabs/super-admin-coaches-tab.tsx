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
import { Badge } from "@/components/ui/badge";
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
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";
import { api, Coach, CoachType, CoachFormData } from "@/lib/api";
import { toast } from "sonner";
import { startDirectChatByAppId } from "@/lib/chat-service";
import { useChatStore } from "@/lib/chat-store";
import { auth } from "@/lib/firebase";

export function SuperAdminCoachesTab() {
  const { openChat } = useChatStore();
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [coachTypes, setCoachTypes] = useState<CoachType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCoach, setDeletingCoach] = useState<Coach | null>(null);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newCoach, setNewCoach] = useState<CoachFormData>({
    org_id: "1",
    coach_fname: "",
    coach_lname: "",
    coach_email: "",
    coach_phone: "",
    coach_type: "",
    coach_team_id: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const itemsPerPage = 5;

  // Fetch coaches and coach types on component mount
  useEffect(() => {
    fetchCoaches();
    fetchCoachTypes();
  }, []);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      const response = await api.coaches.getList();
      if (response.status) {
        setCoaches(response.data);
      } else {
        toast.error(response.message || "Failed to fetch coaches");
      }
    } catch (error) {
      console.error("Error fetching coaches:", error);
      toast.error("Failed to fetch coaches");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoachTypes = async () => {
    try {
      const response = await api.coaches.getTypes();
      if (response.status) {
        setCoachTypes(response.data);
      } else {
        toast.error(response.message || "Failed to fetch coach types");
      }
    } catch (error) {
      console.error("Error fetching coach types:", error);
      toast.error("Failed to fetch coach types");
    }
  };

  const filteredCoaches = coaches.filter(
    (coach) =>
      `${coach.coach_fname} ${coach.coach_lname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      coach.coach_email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCoaches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCoaches = filteredCoaches.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const createFormData = (
    coachData: CoachFormData,
    isEdit = false
  ): FormData => {
    const formData = new FormData();

    if (isEdit && coachData.coach_id) {
      formData.append("coach_id", coachData.coach_id);
    }

    formData.append("org_id", coachData.org_id);
    formData.append("coach_fname", coachData.coach_fname);
    formData.append("coach_lname", coachData.coach_lname);
    formData.append("coach_email", coachData.coach_email);
    formData.append("coach_phone", coachData.coach_phone);
    formData.append("coach_type", coachData.coach_type);

    if (coachData.coach_team_id) {
      formData.append("coach_team_id", coachData.coach_team_id);
    }

    if (selectedFile) {
      formData.append("logo", selectedFile);
    }

    return formData;
  };

  const handleAddCoach = async () => {
    if (
      newCoach.coach_fname.trim() &&
      newCoach.coach_lname.trim() &&
      newCoach.coach_email.trim() &&
      newCoach.coach_type
    ) {
      try {
        setSubmitting(true);
        const formData = createFormData(newCoach);
        const response = await api.coaches.storeUpdate(formData);

        if (response.status) {
          toast.success("Coach added successfully");
          setNewCoach({
            org_id: "1",
            coach_fname: "",
            coach_lname: "",
            coach_email: "",
            coach_phone: "",
            coach_type: "",
            coach_team_id: "",
          });
          setSelectedFile(null);
          setIsAddModalOpen(false);
          fetchCoaches(); // Refresh the list
        } else {
          toast.error(response.message || "Failed to add coach");
        }
      } catch (error) {
        console.error("Error adding coach:", error);
        toast.error("Failed to add coach");
      } finally {
        setSubmitting(false);
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleEditCoach = async () => {
    if (editingCoach) {
      try {
        setSubmitting(true);
        const formData = createFormData(
          {
            coach_id: editingCoach.coach_id.toString(),
            org_id: "1",
            coach_fname: editingCoach.coach_fname,
            coach_lname: editingCoach.coach_lname,
            coach_email: editingCoach.coach_email,
            coach_phone: editingCoach.coach_phone,
            coach_type: editingCoach.coach_type.toString(),
            coach_team_id: "",
          },
          true
        );

        const response = await api.coaches.storeUpdate(formData);

        if (response.status) {
          toast.success("Coach updated successfully");
          setIsEditModalOpen(false);
          setEditingCoach(null);
          setSelectedFile(null);
          fetchCoaches(); // Refresh the list
        } else {
          toast.error(response.message || "Failed to update coach");
        }
      } catch (error) {
        console.error("Error updating coach:", error);
        toast.error("Failed to update coach");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleDeleteCoach = async (hashId: string) => {
    setDeletingCoach(coaches.find((c) => c.coach_hash_id === hashId) || null);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingCoach) {
      try {
        setDeleting(true);
        const response = await api.coaches.delete(deletingCoach.coach_hash_id);
        if (response.status) {
          toast.success("Coach deleted successfully");
          setIsDeleteModalOpen(false);
          setDeletingCoach(null);
          fetchCoaches(); // Refresh the list
        } else {
          toast.error(response.message || "Failed to delete coach");
        }
      } catch (error) {
        console.error("Error deleting coach:", error);
        toast.error("Failed to delete coach");
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleMessageCoach = async (coach: Coach) => {
    try {
      console.log("Starting chat with coach:", coach);
      console.log("Current Firebase user:", auth.currentUser);

      if (!auth.currentUser) {
        toast.error("You must be logged in to start a chat");
        return;
      }

      if (coach.coach_id) {
        console.log("Calling startDirectChatByAppId with:", coach.coach_id);

        // Debug the UIDs that will be used
        const targetUid = `app_${coach.coach_id}`;
        const myUid = auth.currentUser.uid;
        console.log("My UID:", myUid);
        console.log("Target UID:", targetUid);
        console.log("Expected memberIds:", [myUid, targetUid]);

        const chatId = await startDirectChatByAppId(
          coach.coach_id,
          `${coach.coach_fname} ${coach.coach_lname}`
        );
        console.log("Chat created successfully:", chatId);

        // Open the chat panel with the conversation
        openChat(chatId);
        toast.success(
          `Chat opened with ${coach.coach_fname} ${coach.coach_lname}`
        );
      } else {
        toast.error("Unable to start chat - coach ID not found");
      }
    } catch (error: unknown) {
      console.error("Error starting chat:", error);
      if (typeof error === "object" && error !== null) {
        console.error("Error details:", {
          code: (error as { code?: string }).code,
          message: (error as { message?: string }).message,
          stack: (error as { stack?: string }).stack,
        });
      }
      toast.error("Failed to start chat");
    }
  };

  const getCoachTypeName = (typeId: number) => {
    const coachType = coachTypes.find((type) => type.id === typeId);
    return coachType?.name || `Type ${typeId}`;
  };

  const getStatusText = (status: number) => {
    return status === 1 ? "active" : "inactive";
  };

  const getStatusBadgeVariant = (status: number) => {
    return status === 1 ? "default" : "outline";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading coaches...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full">
      <Card className="h-full flex flex-col rounded-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Coaches</CardTitle>
              <CardDescription>
                Manage your coaches and their information
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search coaches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="cursor-pointer">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Coach
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Coach</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={newCoach.coach_fname}
                          onChange={(e) =>
                            setNewCoach({
                              ...newCoach,
                              coach_fname: e.target.value,
                            })
                          }
                          placeholder="First name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={newCoach.coach_lname}
                          onChange={(e) =>
                            setNewCoach({
                              ...newCoach,
                              coach_lname: e.target.value,
                            })
                          }
                          placeholder="Last name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newCoach.coach_email}
                        onChange={(e) =>
                          setNewCoach({
                            ...newCoach,
                            coach_email: e.target.value,
                          })
                        }
                        placeholder="Email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mobile">Mobile</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        value={newCoach.coach_phone}
                        onChange={(e) =>
                          setNewCoach({
                            ...newCoach,
                            coach_phone: e.target.value,
                          })
                        }
                        placeholder="Mobile number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="coachType">Coach Type</Label>
                      <select
                        id="coachType"
                        value={newCoach.coach_type}
                        onChange={(e) =>
                          setNewCoach({
                            ...newCoach,
                            coach_type: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        <option value="">Select coach type</option>
                        {coachTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="logo">Logo</Label>
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
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
                        onClick={handleAddCoach}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add Coach"
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
                  <TableHead>S.No.</TableHead>
                  <TableHead>Coach</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCoaches.map((coach, index) => (
                  <TableRow key={coach.coach_id}>
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={coach.coach_profile_photo}
                            alt={`${coach.coach_fname} ${coach.coach_lname}`}
                          />
                          <AvatarFallback>
                            {coach.coach_fname.charAt(0)}
                            {coach.coach_lname.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {coach.coach_fname} {coach.coach_lname}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ID: {coach.coach_id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{coach.coach_phone}</TableCell>
                    <TableCell>{coach.coach_email}</TableCell>
                    <TableCell>{getCoachTypeName(coach.coach_type)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(coach.coach_status)}
                        className={`cursor-pointer text-center w-16 justify-center ${
                          coach.coach_status === 0
                            ? "bg-gray-600 text-gray-300 border-gray-300 hover:bg-gray-500"
                            : ""
                        }`}
                      >
                        {getStatusText(coach.coach_status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          className="cursor-pointer"
                          variant="outline"
                          size="sm"
                          onClick={() => handleMessageCoach(coach)}
                          title="Send Message"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          className="cursor-pointer"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingCoach(coach);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          className="cursor-pointer bg-transparent hover:bg-transparent"
                          size="sm"
                          onClick={() => handleDeleteCoach(coach.coach_hash_id)}
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
              {Math.min(startIndex + itemsPerPage, filteredCoaches.length)} of{" "}
              {filteredCoaches.length} coaches
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Coach</DialogTitle>
          </DialogHeader>
          {editingCoach && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editFirstName">First Name</Label>
                  <Input
                    id="editFirstName"
                    value={editingCoach.coach_fname}
                    onChange={(e) =>
                      setEditingCoach({
                        ...editingCoach,
                        coach_fname: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editLastName">Last Name</Label>
                  <Input
                    id="editLastName"
                    value={editingCoach.coach_lname}
                    onChange={(e) =>
                      setEditingCoach({
                        ...editingCoach,
                        coach_lname: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editingCoach.coach_email}
                  onChange={(e) =>
                    setEditingCoach({
                      ...editingCoach,
                      coach_email: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editMobile">Mobile</Label>
                <Input
                  id="editMobile"
                  type="tel"
                  value={editingCoach.coach_phone}
                  onChange={(e) =>
                    setEditingCoach({
                      ...editingCoach,
                      coach_phone: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editCoachType">Coach Type</Label>
                <select
                  id="editCoachType"
                  value={editingCoach.coach_type}
                  onChange={(e) =>
                    setEditingCoach({
                      ...editingCoach,
                      coach_type: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  {coachTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="editLogo">Logo</Label>
                <Input
                  id="editLogo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
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
                  onClick={handleEditCoach}
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
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete coach{" "}
              <span className="font-semibold">
                {deletingCoach
                  ? `${deletingCoach.coach_fname} ${deletingCoach.coach_lname}`
                  : ""}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
