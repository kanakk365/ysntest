"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { api, UserProfile } from "@/lib/api"

export function ProfileTab() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState<Partial<UserProfile>>({})
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Password change state
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  })
  const [passwordErrors, setPasswordErrors] = useState<{
    current_password?: string
    new_password?: string
    confirm_password?: string
    general?: string
  }>({})
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  // Password visibility state
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  useEffect(() => {
    fetchUserProfile()
  }, [])

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email,
        user_mobile: profile.user_mobile,
        user_dob: profile.user_dob,
        user_college_name: profile.user_college_name,
        user_fname: profile.user_fname,
        user_lname: profile.user_lname,
      })
    }
  }, [profile])

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

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePasswordChange = (field: keyof typeof passwordData, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear field-specific error when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const validatePasswordForm = () => {
    const errors: typeof passwordErrors = {}

    if (!passwordData.current_password) {
      errors.current_password = "Current password is required"
    }

    if (!passwordData.new_password) {
      errors.new_password = "New password is required"
    } else if (passwordData.new_password.length < 8) {
      errors.new_password = "New password must be at least 8 characters long"
    }

    if (!passwordData.confirm_password) {
      errors.confirm_password = "Please confirm your new password"
    } else if (passwordData.new_password !== passwordData.confirm_password) {
      errors.confirm_password = "Passwords do not match"
    }

    if (passwordData.current_password === passwordData.new_password) {
      errors.new_password = "New password must be different from current password"
    }

    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handlePasswordSubmit = async () => {
    setPasswordErrors({})

    if (!validatePasswordForm()) {
      return
    }

    try {
      setIsChangingPassword(true)
      const response = await api.changePassword.change(passwordData)
      
      if (response.status) {
        toast.success("Password changed successfully!")
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: ""
        })
      } else {
        setPasswordErrors({ general: response.message || "Failed to change password" })
      }
    } catch (err) {
      console.error("Error changing password:", err)
      setPasswordErrors({ general: "Something went wrong while changing password" })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleSave = async () => {
    // Handle save logic here
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset form data to original profile values
    if (profile) {
      setFormData({
        email: profile.email,
        user_mobile: profile.user_mobile,
        user_dob: profile.user_dob,
        user_college_name: profile.user_college_name,
        user_fname: profile.user_fname,
        user_lname: profile.user_lname,
      })
    }
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="space-y-6 min-h-screen bg-card flex items-center justify-center">
        <Card className="shadow-none w-full flex flex-col rounded-none max-w-6xl border-none bg-card">
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
      <div className="space-y-6 min-h-screen bg-card flex items-center justify-center">
        <Card className="shadow-none w-full flex flex-col rounded-none max-w-6xl border-none bg-card">
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
      <div className="space-y-6 min-h-screen bg-card flex items-center justify-center">
        <Card className="shadow-none w-full flex flex-col rounded-none max-w-6xl border-none bg-card">
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
    <div className="space-y-6 min-h-screen bg-card flex items-center justify-center">
      <Card className="shadow-none w-full flex flex-col pt-20 rounded-none max-w-6xl m-auto border-none bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <Badge variant="secondary">
                {profile.user_type === 9 ? "Super Admin" : "User"}
              </Badge>
            </div>
          </CardTitle>
          <CardDescription>
            Manage your personal information and profile settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 flex-1">
          {/* Profile Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.user_mobile || ""}
                  onChange={(e) => handleInputChange("user_mobile", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.user_dob || ""}
                  onChange={(e) => handleInputChange("user_dob", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="college">College Name</Label>
                <Input
                  id="college"
                  value={formData.user_college_name || ""}
                  onChange={(e) => handleInputChange("user_college_name", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.user_fname || ""}
                  onChange={(e) => handleInputChange("user_fname", e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.user_lname || ""}
                  onChange={(e) => handleInputChange("user_lname", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <Button className="cursor-pointer" variant="outline" onClick={handleCancel}>
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
          </div>

          <Separator />

          {/* Change Password Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Change Password</h3>
            
            {passwordErrors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">{passwordErrors.general}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.current_password}
                    onChange={(e) => handlePasswordChange("current_password", e.target.value)}
                    placeholder="Enter your current password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordErrors.current_password && (
                  <p className="text-red-600 text-sm">{passwordErrors.current_password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.new_password}
                    onChange={(e) => handlePasswordChange("new_password", e.target.value)}
                    placeholder="Enter your new password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordErrors.new_password && (
                  <p className="text-red-600 text-sm">{passwordErrors.new_password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirm_password}
                    onChange={(e) => handlePasswordChange("confirm_password", e.target.value)}
                    placeholder="Confirm your new password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordErrors.confirm_password && (
                  <p className="text-red-600 text-sm">{passwordErrors.confirm_password}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handlePasswordSubmit}
                disabled={isChangingPassword}
                className="cursor-pointer"
              >
                {isChangingPassword ? "Changing Password..." : "Change Password"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
