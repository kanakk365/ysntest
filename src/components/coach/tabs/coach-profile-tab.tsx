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
} from "lucide-react";

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

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false);
  };

  const handleBackToPlayers = () => {
    setActiveTab("players");
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
        <Button onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
          <Save className="h-4 w-4 mr-2" />
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
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
                <AvatarImage src={localProfile.photo} alt={localProfile.name} />
                <AvatarFallback className="text-2xl">
                  {localProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{localProfile.name}</h3>
              <p className="text-muted-foreground">Coach</p>
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                disabled={!isEditing}
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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
              <Label>Current Password</Label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" />
            </div>
            <Button className="w-full">Update Password</Button>
          </CardContent>
        </Card>


      </div>
    </div>
  );
}
