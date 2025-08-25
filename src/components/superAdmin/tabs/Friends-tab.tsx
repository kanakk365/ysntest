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
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useFriends } from "@/hooks/useFriends";
import { FriendForm } from "@/components/friends/FriendForm";
import { Friends } from "@/types/friends";
import { startDirectChatByAppId } from "@/lib/chat-service";
import { useChatStore } from "@/lib/chat-store";
import { toast } from "sonner";

export function FriendsTab() {
  const { openChat } = useChatStore();
  const {
    kids,
    errors,
    loading,
    submitting,
    handleValueChange,
    setIsEditModalOpen,
    handleSetFriend,
    deleteFriend,
    isAddModalOpen,
    isEditModalOpen,
    handleAddFriend,
    newFriend,
    deleting,
    setIsDeleteModalOpen,
    isDeleteModalOpen,
    filteredFriends,
    searchTerm,
    setSearchTerm,
    handleAddModal,
    handleEditModal,
    handleDeleteFriend,
    handleOpenDeleteModal,
  } = useFriends();
  const [currentPage, setCurrentPage] = useState(1);
  const [editFriend, setEditFriend] = useState<Friends | null>(null);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredFriends.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFriends = filteredFriends.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleEditFriend = (friend: Friends) => {
    setEditFriend(friend);
    setIsEditModalOpen(true);
    // handleEditModal()
  };

  const handleMessageFriend = async (friend: Friends) => {
    try {
      // Assuming friend has a user ID that can be used for chat
      if (friend.frnd_id) {
        const chatId = await startDirectChatByAppId(
          friend.frnd_id,
          `${friend.frnd_fname} ${friend.frnd_lname}`
        );
        openChat(chatId);
        toast.success(
          `Chat opened with ${friend.frnd_fname} ${friend.frnd_lname}`
        );
      } else {
        toast.error("Unable to start chat - friend ID not found");
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error("Failed to start chat");
    }
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
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full ">
      <Card className="h-full flex flex-col rounded-none ">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle>Friends</CardTitle>
              <CardDescription>
                Manage the friends and their information
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search friends name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Dialog open={isAddModalOpen} onOpenChange={handleAddModal}>
                <DialogTrigger asChild>
                  <Button className="cursor-pointer">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Friend
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Friend</DialogTitle>
                  </DialogHeader>
                  <FriendForm
                    handleCloseModel={handleAddModal}
                    handleAddFriend={handleAddFriend}
                    newFriend={newFriend}
                    kids={kids}
                    errors={errors}
                    submitting={submitting}
                    handleValueChange={handleValueChange}
                    handleSetFriend={handleSetFriend}
                  />
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
                  <TableHead className="text-center">Friend Name</TableHead>
                  <TableHead className="flex-1">Kid Name</TableHead>
                  <TableHead className="flex-1">Email</TableHead>
                  <TableHead className="flex-1">Phone</TableHead>
                  <TableHead className="flex-1">Status</TableHead>
                  <TableHead className="w-32 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedFriends.length > 0 ? (
                  paginatedFriends.map((friend, index) => (
                    <TableRow key={friend.plyf_id}>
                      <TableCell className="text-center font-medium">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="font-medium text-center">{`${friend.frnd_fname} ${friend.frnd_lname}`}</TableCell>
                      <TableCell className="font-medium text-left">
                        {friend.kids_name}
                      </TableCell>
                      <TableCell className="font-medium text-left">
                        {friend.frnd_email}
                      </TableCell>
                      <TableCell className="font-medium text-left">
                        {friend.frnd_phone}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(friend.frnd_status)}
                          className={`cursor-pointer text-center w-16 justify-center ${
                            friend.frnd_status === 0
                              ? "bg-gray-600 text-gray-300 border-gray-300 hover:bg-gray-500"
                              : ""
                          }`}
                        >
                          {getStatusText(friend.frnd_status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-2 justify-center">
                          <Button
                            className="cursor-pointer"
                            variant="outline"
                            size="sm"
                            onClick={() => handleMessageFriend(friend)}
                            title="Send Message"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            className="cursor-pointer"
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditFriend(friend)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            className="cursor-pointer bg-transparent hover:bg-transparent"
                            size="sm"
                            onClick={() => handleOpenDeleteModal(friend)}
                          >
                            <Trash2 className="h-4 w-4 text-red-700" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-5">
                      No Friend Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredFriends.length)} of{" "}
              {filteredFriends.length} friends
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
      <Dialog open={isEditModalOpen} onOpenChange={handleEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Friend</DialogTitle>
          </DialogHeader>
          <FriendForm
            isEdit={true}
            handleCloseModel={handleEditModal}
            editFriend={editFriend}
            handleAddFriend={handleAddFriend}
            newFriend={newFriend}
            kids={kids}
            errors={errors}
            submitting={submitting}
            handleValueChange={handleValueChange}
            handleSetFriend={handleSetFriend}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Delete Friend
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{`${deleteFriend?.frnd_fname} ${deleteFriend?.frnd_lname}`}</strong>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {}} disabled={deleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteFriend}
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
                  Delete Friend
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
