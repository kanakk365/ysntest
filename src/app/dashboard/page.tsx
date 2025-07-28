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
  const { user, isAuthenticated, loading } = useAuthStore()
  const router = useRouter()
  
  useSidebarMobileSync()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (user?.user_type === 3) {
        router.push("/dashboard/coach")
      } else if (user?.user_type === 1) {
        // Super admin stays on dashboard
        return
      }
    }
  }, [isAuthenticated, loading, user, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Redirecting to login...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-black">
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
