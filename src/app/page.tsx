"use client"

import { useAuthStore } from "@/lib/auth-store"
import { LandingPage } from "@/components/LandingPage/landing-page"
import { AppSidebar } from "@/components/superAdmin/navigation/app-sidebar"
import { DashboardTabs } from "@/components/superAdmin/dashboard/dashboard-tabs"
import { SiteHeader } from "@/components/superAdmin/navigation/site-header"

export default function Home() {
  const { user, isAuthenticated, loading, hydrated } = useAuthStore()

  if (loading || !hydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <LandingPage />
  }

  if (user.user_type === 9) {
    return (
      <div className="h-screen bg-background flex">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <SiteHeader />
          <div className="flex-1 overflow-auto">
            <div className="@container/main">
              <div className="px-4 lg:px-6 py-4">
                <DashboardTabs />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (user.user_type === 3) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Redirecting to coach dashboard...</div>
      </div>
    )
  }

  return <LandingPage />
}
