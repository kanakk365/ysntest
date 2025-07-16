"use client"

import React from "react"
import { useDashboard } from "@/contexts/dashboard-context"
import { DashboardContent } from "@/components/dashboard-content"
import { ProfileTab } from "@/components/profile-tab"
import { OpponentTeamsTab } from "@/components/opponent-teams-tab"
import { CoachesTab } from "@/components/coaches-tab"
import { SettingsTab } from "@/components/settings-tab"

export function DashboardTabs() {
  const { activeTab } = useDashboard()

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />
      case "profile":
        return <ProfileTab />
      case "opponents":
        return <OpponentTeamsTab />
      case "coaches":
        return <CoachesTab />
      case "settings":
        return <SettingsTab />
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="w-full h-full">
      {renderContent()}
    </div>
  )
}
