"use client"

import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { DashboardTabs } from "@/components/dashboard-tabs"
import { SiteHeader } from "@/components/site-header"
import { DashboardProvider } from "@/contexts/dashboard-context"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function Home() {
  const { user, isAuthenticated, loading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (user?.user_type === 3) {
        router.push("/dashboard/coach")
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

  // Only show super admin dashboard
  if (user?.user_type !== 1) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Access denied. Redirecting...</div>
      </div>
    )
  }

  return (
    <DashboardProvider>
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
            <AppSidebar variant="inset" />
            <SidebarInset className="flex-1 h-full flex flex-col overflow-hidden">
              <SiteHeader />
              <div className="flex-1 overflow-auto">
                <div className="@container/main">
                  <div className="px-4 lg:px-6 py-4">
                    <DashboardTabs />
                  </div>
                </div>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </DashboardProvider>
  );
}
