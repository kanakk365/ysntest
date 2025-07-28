"use client"

import { useCoach } from "@/contexts/coach-context"
import { CoachesTab } from "../tabs/coach-players-tab"
import { CoachCalendarTab } from "../tabs/coach-calendar-tab"
import { CoachProfileTab } from "../tabs/coach-profile-tab"
import { CoachSearchTab } from "../tabs/coach-search-tab"

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