"use client"

import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AppSidebar } from "@/components/superAdmin/navigation/app-sidebar"
import { DashboardTabs } from "@/components/superAdmin/dashboard/dashboard-tabs"
import { Sidebar } from "@/components/ui/sidebar-zustand"
import { useSidebarMobileSync } from "@/lib/sidebar-store"
import { SiteHeader } from "@/components/superAdmin/navigation/site-header"

export default function Dashboard() {
  const { user, isAuthenticated, loading, hydrated } = useAuthStore()
  const router = useRouter()
  
  useSidebarMobileSync()

  useEffect(() => {
    // Only handle redirects after the store is properly hydrated
    if (!loading && hydrated) {
      if (!isAuthenticated && !user) {
        router.push("/login")
      } else if (user?.user_type === 3) {
        router.push("/dashboard/coach")
      } else if (user?.user_type === 9) {
        // Super admin stays on dashboard
        return
      }
    }
  }, [isAuthenticated, loading, hydrated, user, router])

  if (loading || !hydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Redirecting to login...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar className="w-64" />
      <div className="flex-1 flex flex-col">
        <SiteHeader />
        <main className="flex-1 overflow-auto">
          <DashboardTabs />
        </main>
      </div>
    </div>
  )
}
