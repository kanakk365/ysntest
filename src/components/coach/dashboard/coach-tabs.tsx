"use client"

import { useCoachStore } from "@/lib/coach-store"
import { CoachesTab } from "../tabs/coach-players-tab"
import { CoachProfileTab } from "../tabs/coach-profile-tab"
import { CoachSearchTab } from "../tabs/coach-search-tab"

export function CoachTabs() {
  const { activeTab } = useCoachStore()

  return (
    <div className="h-full">
      {activeTab === "players" && <CoachesTab />}
      {activeTab === "profile" && <CoachProfileTab />}
      {activeTab === "search" && <CoachSearchTab />}
    </div>
  )
} 