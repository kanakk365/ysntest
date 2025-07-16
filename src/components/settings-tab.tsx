"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

export function SettingsTab() {
  const [settings, setSettings] = useState({
    orgName: "YSN Sports Organization",
    streamVideoType: "twitch",
    chatEnabled: true,
    twitchEnabled: true,
    liveStreamOrganization: "ESPN"
  })

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const handleSaveSettings = () => {
    // Handle save settings logic
    console.log("Settings saved:", settings)
  }

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!")
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
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
          <CardDescription>
            Manage your organization preferences and streaming settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input
              id="orgName"
              value={settings.orgName}
              onChange={(e) => setSettings({...settings, orgName: e.target.value})}
              placeholder="Enter organization name"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Streaming Settings</h3>
            
            <div className="space-y-2">
              <Label htmlFor="streamType">Stream Video Type</Label>
              <Select 
                value={settings.streamVideoType} 
                onValueChange={(value) => setSettings({...settings, streamVideoType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stream type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twitch">Twitch</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="liveStreamOrg">Live Stream Organization</Label>
              <Select 
                value={settings.liveStreamOrganization} 
                onValueChange={(value) => setSettings({...settings, liveStreamOrganization: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ESPN">ESPN</SelectItem>
                  <SelectItem value="Fox Sports">Fox Sports</SelectItem>
                  <SelectItem value="NBC Sports">NBC Sports</SelectItem>
                  <SelectItem value="CBS Sports">CBS Sports</SelectItem>
                  <SelectItem value="Turner Sports">Turner Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="chatToggle">Chat</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable chat functionality
                </p>
              </div>
              <Switch
                id="chatToggle"
                checked={settings.chatEnabled}
                onCheckedChange={(checked) => setSettings({...settings, chatEnabled: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="twitchToggle">Twitch Integration</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable Twitch integration
                </p>
              </div>
              <Switch
                id="twitchToggle"
                checked={settings.twitchEnabled}
                onCheckedChange={(checked) => setSettings({...settings, twitchEnabled: checked})}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Security</h3>
            
            <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Change Password</Button>
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
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleChangePassword}>
                      Change Password
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
