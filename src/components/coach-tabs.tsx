"use client"

import { useCoach } from "@/contexts/coach-context"
import { CoachesTab } from "./coach-players-tab"
import { CoachCalendarTab } from "./coach-calendar-tab"
import { CoachProfileTab } from "./coach-profile-tab"
import { CoachSearchTab } from "./coach-search-tab"

export function CoachTabs() {
  const { activeTab } = useCoach()

  return (
    <div className="h-full">
      {activeTab === "players" && <CoachesTab />}
      {activeTab === "calendar" && <CoachCalendarTab />}
      {activeTab === "profile" && <CoachProfileTab />}
      {activeTab === "search" && <CoachSearchTab />}
    </div>
  )
} 