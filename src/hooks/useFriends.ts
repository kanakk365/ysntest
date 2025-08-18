import fetch from "@/lib/fetch";
import { FriendPayload, Friends } from "@/types/friends";
import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export const useFriends = () => {
  const defaultFriendState: FriendPayload = {
    frnd_id: null,
    plyf_kids_id: null,
    frnd_fname: "",
    frnd_lname: "",
    frnd_social_link: "",
    frnd_email: "",
    frnd_phone: "",
    frnd_address: "",
  };

  const [kids, setKids] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [friends, setFriends] = useState<Friends[] | []>([]);
  const [deleteFriend, setDeleteFriend] = useState<Friends | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newFriend, setNewFriend] = useState<FriendPayload>(defaultFriendState);

  // function to fetch all the friends list
  const handleFetchFriends = async (): Promise<Friends[] | void> => {
    try {
      setLoading(true);
      const response: AxiosResponse<Friends[] | any> = await fetch.get(
        "/friend/lists"
      );
      setFriends(response?.data?.data);
    } catch (error) {
      console.log("error at fetching the friends list", error);
    } finally {
      setLoading(false);
    }
  };

  // function to filter the friends based on the frnd name
  const filteredFriends = friends?.filter((friend) => {
    if (!searchTerm.trim()) return true;
    return `${friend.frnd_fname ?? ""} ${friend.frnd_lname ?? ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  //  function to validate the friends
  const validateFriendForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const phonePattern = /^(?:\+91|91)?[6-9]\d{9}$|^(?:\+1|1)?\d{10}$/;

    if (!newFriend.frnd_fname.trim()) {
      newErrors.frnd_fname = "First name is required";
    }
    if (!newFriend.frnd_lname.trim()) {
      newErrors.frnd_lname = "Last name is required";
    }
    if (!newFriend.frnd_email.trim()) {
      newErrors.frnd_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newFriend.frnd_email)) {
      newErrors.frnd_email = "Enter a valid email address";
    }
    if (!newFriend.frnd_phone.trim()) {
      newErrors.frnd_phone = "Mobile number is required";
    } else if (!phonePattern.test(newFriend.frnd_phone.trim())) {
      newErrors.frnd_phone = "Enter a valid US or India mobile number";
    }
    if (!newFriend.frnd_social_link.trim()) {
      newErrors.frnd_social_link = "Social link is required";
    } else {
      try {
        new URL(newFriend.frnd_social_link.trim());
      } catch {
        newErrors.frnd_social_link =
          "Enter a valid URL (e.g., https://example.com)";
      }
    }
    if (!newFriend.frnd_address.trim()) {
      newErrors.frnd_address = "Address is required";
    }
    if (!newFriend?.plyf_kids_id) {
      newErrors.plyf_kids_id = "Please select a kid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // function to add new friend
  const handleAddFriend = async (
    handleCloseModal: (open: boolean) => void
  ): Promise<void> => {
    if (!validateFriendForm()) {
      return;
    }
    try {
      setSubmitting(true);
      const response = await fetch.post("/friend/store-update", newFriend);
      if (response.data.status) {
        const message =
          newFriend.frnd_id !== null
            ? "Friend edited successfully"
            : "Friend added successfully";
        setNewFriend(defaultFriendState);
        handleCloseModal(false);
        setErrors({});
        handleFetchFriends();
        toast.success(message);
      }
    } catch (error: any) {
      console.log("error at while posting the user", error);
      toast.error(error.response.data.message || "Failed to add friend");
    } finally {
      setSubmitting(false);
    }
  };

  // function to set the value with newFriends state
  const handleValueChange = <
    T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >(
    e: React.ChangeEvent<T>
  ) => {
    const { name, value } = e.target;
    setNewFriend((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // function to get all the friends
  const handleGetAllKids = async (): Promise<void> => {
    try {
      const response = await fetch.get("/players/search");
      setKids(response.data.data);
    } catch (error) {
      console.log("error at while fetching kids info", error);
    }
  };

  const handleSetFriend = (friend: Friends) => {
    if (friend !== null) {
      setNewFriend({
        frnd_id: friend?.frnd_id,
        plyf_kids_id: friend.plyf_kids_id,
        frnd_fname: friend.frnd_fname,
        frnd_lname: friend.frnd_lname,
        frnd_social_link: "hello",
        frnd_email: friend.frnd_email,
        frnd_phone: friend.frnd_phone,
        frnd_address: "",
      });
      // handleEditModal();
    }
  };

  useEffect(() => {
    handleGetAllKids();
    handleFetchFriends();
  }, []);

  const handleAddModal = () => {
    setNewFriend(defaultFriendState);
    setIsAddModalOpen(!isAddModalOpen);
  };

  const handleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const handleDeleteFriend = async () => {
    try {
      setDeleting(true);
      const response = await fetch.delete("friend/delete", {
        data: { deletedId: deleteFriend?.hash_id },
      });

      if (response.status) {
        toast.success("Friend deleted successfully");
        setIsDeleteModalOpen(false);
        handleFetchFriends();
      } else {
        toast.error(response.data.message || "Failed to delete friend");
      }
    } catch (error) {
      console.error("Error deleting friend:", error);
      toast.error("Failed to delete friend");
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenDeleteModal = (friend: Friends) => {
    setDeleteFriend(friend);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteFriend(null);
  };

  return {
    kids,
    errors,
    friends,
    loading,
    deleting,
    newFriend,
    submitting,
    searchTerm,
    setNewFriend,
    deleteFriend,
    setSearchTerm,
    isAddModalOpen,
    isEditModalOpen,
    filteredFriends,
    handleAddFriend,
    setIsAddModalOpen,
    setIsEditModalOpen,
    handleValueChange,
    handleSetFriend,
    handleAddModal,
    handleEditModal,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDeleteFriend,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
  };
};
