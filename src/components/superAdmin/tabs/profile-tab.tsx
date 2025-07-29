"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { api, UserProfile } from "@/lib/api"

export function ProfileTab() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.userProfile.get()
      
      if (response.status) {
        setProfile(response.data)
      } else {
        setError(response.message || "Failed to fetch profile")
      }
    } catch (err) {
      setError("Something went wrong!")
      console.error("Error fetching profile:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    // Handle save logic here
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="space-y-6 h-full bg-card flex items-center justify-center">
        <Card className="h-full flex flex-col rounded-none max-w-6xl border-none">
          <CardContent className="flex items-center justify-center flex-1">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading profile...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 h-full bg-card flex items-center justify-center">
        <Card className="h-full flex flex-col rounded-none max-w-6xl border-none">
          <CardContent className="flex items-center justify-center flex-1">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={fetchUserProfile}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="space-y-6 h-full bg-card flex items-center justify-center">
        <Card className="h-full flex flex-col rounded-none max-w-6xl border-none">
          <CardContent className="flex items-center justify-center flex-1">
            <div className="text-center">
              <p>No profile data available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 h-full bg-card flex items-center">
      <Card className="h-full w-full flex flex-col pt-20 rounded-none max-w-6xl m-auto border-none bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/avatars/user.jpg" alt="Profile" />
              <AvatarFallback>{profile.user_fname?.[0]}{profile.user_lname?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <Badge variant="secondary">
                {profile.user_type === 1 ? "Super Admin" : "User"}
              </Badge>
            </div>
          </CardTitle>
          <CardDescription>
            Manage your personal information and profile settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                type="tel"
                value={profile.user_mobile || ""}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={profile.user_dob || ""}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="college">College Name</Label>
              <Input
                id="college"
                value={profile.user_college_name || ""}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profile.user_fname}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profile.user_lname}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <Button className="cursor-pointer" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button className="cursor-pointer" onClick={handleSave}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button className="cursor-pointer" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
