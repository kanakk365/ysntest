"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { useCoachStore } from "@/lib/coach-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  Save,
  User,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function CoachProfileTab() {
  const { user } = useAuthStore();
  const {
    setActiveTab,
    profile,
    profileLoading,
    profileError,
    fetchProfile,
    clearProfileError,
  } = useCoachStore();

  const [localProfile, setLocalProfile] = useState({
    name: "",
    email: "",
    mobile: "",
    photo: "",
    university: "",
    college: "",
    bio: "",
    location: "",
    experience: "",
    certifications: [
      "NFHS Certified Coach",
      "First Aid & CPR",
      "Concussion Protocol",
    ],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState<File | null>(null);
  const [selectedCertificates, setSelectedCertificates] = useState<File[]>([]);

  // Change password state
  const [changePasswordData, setChangePasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  
  // Password visibility state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Update local profile when API data is loaded
  useEffect(() => {
    if (profile) {
      setLocalProfile({
        name: `${profile.coach_fname} ${profile.coach_lname}`,
        email: profile.coach_email,
        mobile: profile.coach_phone,
        photo: profile.coach_profile_photo || "",
        university: profile.user_college_name || "",
        college: profile.user_college_name || "",
        bio: "Experienced football coach with over 10 years of experience in high school athletics. Specialized in quarterback development and team strategy.",
        location: profile.coach_high_school_address || "",
        experience: "10+ years",
        certifications: [
          "NFHS Certified Coach",
          "First Aid & CPR",
          "Concussion Protocol",
        ],
      });
    }
  }, [profile]);

  // Cleanup object URLs when component unmounts or selected photo changes
  useEffect(() => {
    return () => {
      if (selectedProfilePhoto) {
        URL.revokeObjectURL(URL.createObjectURL(selectedProfilePhoto));
      }
    };
  }, [selectedProfilePhoto]);

  const handleSave = async () => {
    if (!profile) {
      toast.error("Profile data not available");
      return;
    }

    // Validate required fields
    if (!localProfile.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!localProfile.mobile.trim()) {
      toast.error("Mobile number is required");
      return;
    }

    if (!localProfile.location.trim()) {
      toast.error("Location is required");
      return;
    }

    setIsUpdating(true);

    try {
      const formData = new FormData();
      
      // Add coach_id
      formData.append('coach_id', profile.coach_id.toString());
      
      // Split name into first and last name
      const nameParts = localProfile.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      formData.append('coach_fname', firstName);
      formData.append('coach_lname', lastName);
      formData.append('coach_phone', localProfile.mobile);
      formData.append('coach_location', localProfile.location);
      formData.append('coach_bio', localProfile.bio);
      formData.append('coach_high_school_address', localProfile.location);
      formData.append('coach_experienc', localProfile.experience);
      
      // Add profile photo if selected
      if (selectedProfilePhoto) {
        formData.append('coach_profile', selectedProfilePhoto);
      }
      
      // Add certificates if selected
      selectedCertificates.forEach((certificate, index) => {
        formData.append('coach_certificates[]', certificate);
      });

      const response = await api.coachProfile.update(formData);

      if (response.status) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        // Refresh profile data
        fetchProfile();
        // Clear selected files
        setSelectedProfilePhoto(null);
        setSelectedCertificates([]);
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("An error occurred while updating profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBackToPlayers = () => {
    setActiveTab("players");
  };

  // File input handlers
  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedProfilePhoto(file);
    }
  };

  const handleCertificatesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedCertificates(files);
  };

  // Change password handler
  const handleChangePassword = async () => {
    // Validate passwords
    if (!changePasswordData.current_password || !changePasswordData.new_password || !changePasswordData.confirm_password) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (changePasswordData.new_password !== changePasswordData.confirm_password) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (changePasswordData.new_password.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    setChangePasswordLoading(true);

    try {
      const response = await api.changePassword.change({
        current_password: changePasswordData.current_password,
        new_password: changePasswordData.new_password,
        confirm_password: changePasswordData.confirm_password
      });

      if (response.status) {
        toast.success("Password changed successfully");
        setChangePasswordData({
          current_password: "",
          new_password: "",
          confirm_password: ""
        });
      } else {
        toast.error(response.message || "Failed to change password");
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error("An error occurred while changing password");
    } finally {
      setChangePasswordLoading(false);
    }
  };

  // Show loading state
  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  // Show error state
  if (profileError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-500">{profileError}</p>
        <Button
          onClick={() => {
            clearProfileError();
            fetchProfile();
          }}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Button
        className="mb-8"
        variant="outline"
        size="sm"
        onClick={handleBackToPlayers}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal information
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing && (
            <Button 
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setSelectedProfilePhoto(null);
                setSelectedCertificates([]);
                // Reset local profile to original data
                if (profile) {
                  setLocalProfile({
                    name: `${profile.coach_fname} ${profile.coach_lname}`,
                    email: profile.coach_email,
                    mobile: profile.coach_phone,
                    photo: profile.coach_profile_photo || "",
                    university: profile.user_college_name || "",
                    college: profile.user_college_name || "",
                    bio: "Experienced football coach with over 10 years of experience in high school athletics. Specialized in quarterback development and team strategy.",
                    location: profile.coach_high_school_address || "",
                    experience: "10+ years",
                    certifications: [
                      "NFHS Certified Coach",
                      "First Aid & CPR",
                      "Concussion Protocol",
                    ],
                  });
                }
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
          )}
          <Button 
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isUpdating ? "Updating..." : (isEditing ? "Save Changes" : "Edit Profile")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Photo Section */}
        <Card className="bg-card border-border md:col-span-1">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Profile Photo
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage 
                  src={selectedProfilePhoto ? URL.createObjectURL(selectedProfilePhoto) : localProfile.photo} 
                  alt={localProfile.name} 
                />
                <AvatarFallback className="text-2xl">
                  {localProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute -bottom-2 -right-2">
                  <input
                    type="file"
                    id="profile-photo-input"
                    accept="image/*"
                    onChange={handleProfilePhotoChange}
                    disabled={isUpdating}
                    className="hidden"
                  />
                  <label htmlFor="profile-photo-input">
                    <Button
                      size="sm"
                      className="rounded-full h-8 w-8 p-0 cursor-pointer"
                      asChild
                    >
                      <span>
                        <Camera className="h-4 w-4" />
                      </span>
                    </Button>
                  </label>
                </div>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{localProfile.name}</h3>
              <p className="text-muted-foreground">Coach</p>
              {selectedProfilePhoto && (
                <div className="mt-2 text-xs text-muted-foreground">
                  New photo: {selectedProfilePhoto.name}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="bg-card border-border md:col-span-2">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={localProfile.name}
                    onChange={(e) =>
                      setLocalProfile({ ...localProfile, name: e.target.value })
                    }
                    disabled={!isEditing || isUpdating}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={localProfile.email}
                    onChange={(e) =>
                      setLocalProfile({
                        ...localProfile,
                        email: e.target.value,
                      })
                    }
                    disabled={!isEditing || isUpdating}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mobile</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    value={localProfile.mobile}
                    onChange={(e) =>
                      setLocalProfile({
                        ...localProfile,
                        mobile: e.target.value,
                      })
                    }
                    disabled={!isEditing || isUpdating}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={localProfile.location}
                    onChange={(e) =>
                      setLocalProfile({
                        ...localProfile,
                        location: e.target.value,
                      })
                    }
                    disabled={!isEditing || isUpdating}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={localProfile.bio}
                onChange={(e) =>
                  setLocalProfile({ ...localProfile, bio: e.target.value })
                }
                disabled={!isEditing || isUpdating}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Education & Experience */}
        <Card className="bg-card border-border md:col-span-2">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Education & Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>University/College</Label>
                <Input
                  value={localProfile.university}
                  onChange={(e) =>
                    setLocalProfile({
                      ...localProfile,
                      university: e.target.value,
                    })
                  }
                  disabled={!isEditing || isUpdating}
                />
              </div>

              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Input
                  value={localProfile.experience}
                  onChange={(e) =>
                    setLocalProfile({
                      ...localProfile,
                      experience: e.target.value,
                    })
                  }
                  disabled={!isEditing || isUpdating}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Certifications</Label>
              <div className="space-y-2">
                {localProfile.certifications.map(
                  (cert: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">{cert}</span>
                    </div>
                  )
                )}
              </div>
              {isEditing && (
                <div className="space-y-2">
                  <Label htmlFor="certificates-input">Upload Certificates</Label>
                  <input
                    type="file"
                    id="certificates-input"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    multiple
                    onChange={handleCertificatesChange}
                    disabled={isUpdating}
                    className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  {selectedCertificates.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Selected files: {selectedCertificates.map(f => f.name).join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="bg-card border-border md:col-span-1">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={changePasswordData.current_password}
                  onChange={(e) => setChangePasswordData({
                    ...changePasswordData,
                    current_password: e.target.value
                  })}
                  placeholder="Enter current password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={changePasswordData.new_password}
                  onChange={(e) => setChangePasswordData({
                    ...changePasswordData,
                    new_password: e.target.value
                  })}
                  placeholder="Enter new password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={changePasswordData.confirm_password}
                  onChange={(e) => setChangePasswordData({
                    ...changePasswordData,
                    confirm_password: e.target.value
                  })}
                  placeholder="Confirm new password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={handleChangePassword}
              disabled={changePasswordLoading || !changePasswordData.current_password || !changePasswordData.new_password || !changePasswordData.confirm_password}
            >
              {changePasswordLoading ? "Changing..." : "Update Password"}
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
