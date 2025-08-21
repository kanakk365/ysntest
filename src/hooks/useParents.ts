import fetch from "@/lib/fetch";
import { FriendPayload, Friends } from "@/types/friends";
import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export const useParents = () => {
  const defaultParentState: FriendPayload = {
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
  const [parents, setParents] = useState<Friends[] | []>([]);
  const [deleteParent, setDeleteParent] = useState<Friends | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newParent, setNewParent] = useState<FriendPayload>(defaultParentState);

  // function to fetch all the parents list
  const handleFetchParents = async (): Promise<Friends[] | void> => {
    try {
      setLoading(true);
      const response: AxiosResponse<Friends[] | any> = await fetch.get(
        "/parent/lists"
      );
      setParents(response?.data?.data);
    } catch (error) {
      console.log("error at fetching the parents list", error);
    } finally {
      setLoading(false);
    }
  };

  // function to filter the parents based on the parent name
  const filteredParents = parents?.filter((parent) => {
    if (!searchTerm.trim()) return true;
    return `${parent.frnd_fname ?? ""} ${parent.frnd_lname ?? ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  // validate the parent fields data
  const validateParent = () => {
    const newErrors: Record<string, string> = {};

    if (!newParent.frnd_fname?.trim()) {
      newErrors.frnd_fname = "First name is required";
    }

    if (!newParent.frnd_lname?.trim()) {
      newErrors.frnd_lname = "Last name is required";
    }

    if (!newParent.frnd_email?.trim()) {
      newErrors.frnd_email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newParent.frnd_email)) {
      newErrors.frnd_email = "Email is invalid";
    }

    if (!newParent.frnd_phone?.trim()) {
      newErrors.frnd_phone = "Phone number is required";
    } else if (!/^\d{10,}$/.test(newParent.frnd_phone.replace(/\D/g, ""))) {
      newErrors.frnd_phone = "Phone number must be at least 10 digits";
    }

    if (!newParent.plyf_kids_id) {
      newErrors.plyf_kids_id = "Please select a kid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // function to handle the parent form field data changes
  const handleValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewParent((prev) => ({
      ...prev,
      [name]: name === "plyf_kids_id" ? Number(value) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // function to handle the add parent form submission
  const handleAddParent = async () => {
    if (!validateParent()) return;

    try {
      setSubmitting(true);
      const response: AxiosResponse = await fetch.post("/parent/create", newParent);
      if (response.status === 201) {
        toast.success("Parent added successfully!");
        handleFetchParents();
        handleResetModal();
      } else {
        toast.error("Failed to add parent. Please try again.");
      }
    } catch (error: any) {
      console.error("Error adding parent:", error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while adding the parent.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // function to handle the edit parent functionality
  const handleSetParent = (parent: Friends | null) => {
    if (parent) {
      setNewParent({
        frnd_id: parent.frnd_id,
        plyf_kids_id: parent.plyf_kids_id,
        frnd_fname: parent.frnd_fname,
        frnd_lname: parent.frnd_lname,
        frnd_social_link: "",
        frnd_email: parent.frnd_email,
        frnd_phone: parent.frnd_phone,
        frnd_address: "",
      });
    } else {
      setNewParent(defaultParentState);
    }
    setErrors({});
  };

  // function to reset the add modal state
  const handleResetModal = () => {
    setNewParent(defaultParentState);
    setErrors({});
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  // function to handle add modal
  const handleAddModal = () => {
    setIsAddModalOpen((prev) => !prev);
    if (!isAddModalOpen) {
      setNewParent(defaultParentState);
      setErrors({});
    }
  };

  // function to handle edit modal
  const handleEditModal = () => {
    setIsEditModalOpen((prev) => !prev);
    if (!isEditModalOpen) {
      setNewParent(defaultParentState);
      setErrors({});
    }
  };

  // function to handle open delete confirmation modal
  const handleOpenDeleteModal = (parent: Friends) => {
    setDeleteParent(parent);
    setIsDeleteModalOpen(true);
  };

  // function to handle parent deletion
  const handleDeleteParent = async () => {
    if (!deleteParent) return;

    try {
      setDeleting(true);
      const response: AxiosResponse = await fetch.delete(
        `/parent/delete/${deleteParent.plyf_id}`
      );
      if (response.status === 200) {
        toast.success("Parent deleted successfully!");
        handleFetchParents();
        setIsDeleteModalOpen(false);
        setDeleteParent(null);
      } else {
        toast.error("Failed to delete parent. Please try again.");
      }
    } catch (error: any) {
      console.error("Error deleting parent:", error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while deleting the parent.");
      }
    } finally {
      setDeleting(false);
    }
  };

  // fetch all parents and kids on component mount
  useEffect(() => {
    handleFetchParents();
    // Fetch kids list if needed
  }, []);

  return {
    kids,
    errors,
    loading,
    parents,
    deleting,
    newParent,
    searchTerm,
    submitting,
    deleteParent,
    isAddModalOpen,
    isEditModalOpen,
    filteredParents,
    isDeleteModalOpen,
    handleAddModal,
    setSearchTerm,
    handleAddParent,
    handleEditModal,
    handleSetParent,
    handleValueChange,
    handleDeleteParent,
    setIsEditModalOpen,
    setIsDeleteModalOpen,
    handleOpenDeleteModal,
  };
};