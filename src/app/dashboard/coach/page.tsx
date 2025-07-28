"use client"

import { CoachAppSidebar } from "@/components/coach/navigation/coach-app-sidebar"
import { CoachTabs } from "@/components/coach/dashboard/coach-tabs"
import { SiteHeader } from "@/components/superAdmin/navigation/site-header"
import { CoachProvider } from "@/contexts/coach-context"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function CoachDashboard() {
  const { user, isAuthenticated, loading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (user?.user_type !== 3) {
        router.push("/dashboard")
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

  if (!isAuthenticated || user?.user_type !== 3) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Access denied. Redirecting...</div>
      </div>
    )
  }

  return (
    <CoachProvider>
      <div className="h-screen">
        <SidebarProvider
          className="flex h-full"
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <div className="flex h-full w-full">
            <CoachAppSidebar variant="inset" />
            <SidebarInset className="flex-1 h-full flex flex-col">
              <SiteHeader />
              <div className="flex-1 p-4 lg:p-6">
                <CoachTabs />
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </CoachProvider>
  )
} 