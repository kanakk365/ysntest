"use client"

import { CoachAppSidebar } from "@/components/coach-app-sidebar"
import { CoachTabs } from "@/components/coach-tabs"
import { SiteHeader } from "@/components/site-header"
import { CoachProvider } from "@/contexts/coach-context"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function CoachDashboard() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (user?.role !== "coach") {
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

  if (!isAuthenticated || user?.role !== "coach") {
    return null
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