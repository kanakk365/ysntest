"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function ProfileTab() {
  const [profile, setProfile] = useState({
    email: "john.doe@example.com",
    mobile: "+1 (555) 123-4567",
    dob: "1990-01-15",
    graduatingClass: "2024",
    headCoach: "Coach Smith",
    avatar: "/avatars/user.jpg"
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    // Handle save logic here
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatar} alt="Profile" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">John Doe</h2>
              <Badge variant="secondary">Player</Badge>
            </div>
          </CardTitle>
          <CardDescription>
            Manage your personal information and profile settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                type="tel"
                value={profile.mobile}
                onChange={(e) => setProfile({...profile, mobile: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={profile.dob}
                onChange={(e) => setProfile({...profile, dob: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="graduatingClass">Graduating Class</Label>
              <Input
                id="graduatingClass"
                value={profile.graduatingClass}
                onChange={(e) => setProfile({...profile, graduatingClass: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="headCoach">Head Coach</Label>
              <Input
                id="headCoach"
                value={profile.headCoach}
                onChange={(e) => setProfile({...profile, headCoach: e.target.value})}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
