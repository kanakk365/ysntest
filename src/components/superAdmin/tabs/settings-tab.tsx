"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/lib/auth-store"
import { useSettingsStore } from "@/lib/settings-store"
import { toast } from "sonner"

export function SettingsTab() {
  const { user } = useAuthStore()
  const { 
    settings, 
    loading, 
    error, 
    fetchSettings, 
    updateSettings, 
    setSettings 
  } = useSettingsStore()

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  // Load current settings on component mount
  useEffect(() => {
    if (user?.token) {
      fetchSettings()
    }
  }, [user?.token, fetchSettings])

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleSaveSettings = async () => {
    if (!user?.token) {
      toast.error("Authentication required")
      return
    }

    // Validate required fields
    if (!settings.live_video_id.trim()) {
      toast.error("Video ID is required")
      return
    }

    if (settings.live_orgz_id <= 0) {
      toast.error("Organization ID must be greater than 0")
      return
    }

    if (settings.live_svtm_id <= 0) {
      toast.error("SVT Management ID must be greater than 0")
      return
    }

    // Prepare data for API (convert boolean to number for live_chat_flag)
    const apiData = {
      live_orgz_id: settings.live_orgz_id,
      live_svtm_id: settings.live_svtm_id,
      live_video_id: settings.live_video_id,
      live_chat_flag: settings.live_chat_flag ? 1 : 0, // Convert boolean to number
      live_twitch_flag: settings.live_twitch_flag
    }

    const success = await updateSettings(apiData)
    
    if (success) {
      toast.success("Settings saved successfully!")
    }
  }

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match!")
      return
    }
    // Handle password change logic
    console.log("Password change requested")
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
    setIsPasswordModalOpen(false)
    toast.success("Password changed successfully!")
  }

  return (
    <div className="space-y-6 h-full bg-card">
      <Card className="h-full flex flex-col rounded-none max-w-6xl m-auto border-none">
        <CardHeader>
          <CardTitle>Super Admin Settings</CardTitle>
          <CardDescription>
            Manage organization preferences and streaming settings
          </CardDescription>
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fetchSettings()}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 flex-1">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Organization Settings</h3>
            
            <div className="space-y-2">
              <Label htmlFor="live_orgz_id">Organization ID</Label>
              <Input
                id="live_orgz_id"
                type="number"
                value={settings.live_orgz_id}
                onChange={(e) => setSettings({...settings, live_orgz_id: parseInt(e.target.value) || 1})}
                placeholder="Enter organization ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="live_svtm_id">SVT Management ID</Label>
              <Input
                id="live_svtm_id"
                type="number"
                value={settings.live_svtm_id}
                onChange={(e) => setSettings({...settings, live_svtm_id: parseInt(e.target.value) || 2})}
                placeholder="Enter SVT management ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="live_video_id">Video ID</Label>
              <Input
                id="live_video_id"
                value={settings.live_video_id}
                onChange={(e) => setSettings({...settings, live_video_id: e.target.value})}
                placeholder="Enter video ID (e.g., ysnetwork)"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Streaming Settings</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="chatToggle">Chat Flag</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable chat functionality
                </p>
              </div>
              <Switch
                id="chatToggle"
                checked={settings.live_chat_flag}
                onCheckedChange={(checked) => setSettings({...settings, live_chat_flag: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="twitchToggle">Twitch Flag</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable Twitch integration (0-Off, 1-On)
                </p>
              </div>
              <Switch
                id="twitchToggle"
                checked={settings.live_twitch_flag === 1}
                onCheckedChange={(checked) => setSettings({...settings, live_twitch_flag: checked ? 1 : 0})}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Security</h3>
            
            <div className="flex justify-between items-center">
              <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground border-primary" 
                    variant="default"
                  >
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        placeholder="Confirm new password"
                      />
                    </div>
                    <div className="flex  gap-2">
                      <Button className="cursor-pointer" variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button className="cursor-pointer" onClick={handleChangePassword}>
                        Change Password
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                className="cursor-pointer" 
                onClick={handleSaveSettings}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </div>

    
        </CardContent>
      </Card>
    </div>
  )
}
