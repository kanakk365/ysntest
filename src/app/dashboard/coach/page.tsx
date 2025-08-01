"use client"

import { CoachTabs } from "@/components/coach/dashboard/coach-tabs"
import { SiteHeader } from "@/components/superAdmin/navigation/site-header"

export default function CoachDashboard() {

  return (
    <div className="h-screen flex flex-col bg-background">
      <SiteHeader />
      <div className="flex-1 p-4 lg:p-6 overflow-auto">
        <CoachTabs />
      </div>
    </div>
  )
} 