"use client"

import { useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { useCoach } from "@/contexts/coach-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Save, User, Mail, Phone, GraduationCap, MapPin, ArrowLeft } from "lucide-react"

export function CoachProfileTab() {
  const { user } = useAuthStore()
  const { setActiveTab } = useCoach()
  const [profile, setProfile] = useState({
    name: user?.name || "Coach John",
    email: user?.email || "coach@ysn.com",
    mobile: "+1 (555) 123-4567",
    photo: "/coach-avatar.jpg",
    university: "University of Texas",
    college: "Texas State University",
    bio: "Experienced football coach with over 10 years of experience in high school athletics. Specialized in quarterback development and team strategy.",
    location: "Austin, Texas",
    experience: "10+ years",
    certifications: ["NFHS Certified Coach", "First Aid & CPR", "Concussion Protocol"]
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false)
  }

  const handleBackToPlayers = () => {
    setActiveTab("players")
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToPlayers}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Players
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your personal information</p>
          </div>
        </div>
        <Button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          <Save className="h-4 w-4 mr-2" />
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Photo Section */}
        <Card className="bg-card border-border md:col-span-1">
          <CardHeader>
            <CardTitle className="text-card-foreground">Profile Photo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile.photo} alt={profile.name} />
                <AvatarFallback className="text-2xl">
                  {profile.name.split(' ').map(n => n[0]).join('')}
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
              <h3 className="text-lg font-semibold">{profile.name}</h3>
              <p className="text-muted-foreground">Coach</p>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="bg-card border-border md:col-span-2">
          <CardHeader>
            <CardTitle className="text-card-foreground">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
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
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
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
                    value={profile.mobile}
                    onChange={(e) => setProfile({...profile, mobile: e.target.value})}
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
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
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
                  value={profile.university}
                  onChange={(e) => setProfile({...profile, university: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Input
                  value={profile.experience}
                  onChange={(e) => setProfile({...profile, experience: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Certifications</Label>
              <div className="space-y-2">
                {profile.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="bg-card border-border md:col-span-1">
          <CardHeader>
            <CardTitle className="text-card-foreground">Change Password</CardTitle>
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
  )
}