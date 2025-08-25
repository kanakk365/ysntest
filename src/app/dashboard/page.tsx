"use client"

import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AppSidebar } from "@/components/superAdmin/navigation/app-sidebar"
import { DashboardTabs } from "@/components/superAdmin/dashboard/dashboard-tabs"
import { SiteHeader } from "@/components/superAdmin/navigation/site-header"
import ChatAuthGate from "@/components/chat/ChatAuthGate"


export default function DashboardPage() {
  const { user, isAuthenticated, loading, hydrated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // If not authenticated, redirect to landing page
    if (!loading && hydrated && (!isAuthenticated || !user)) {
      router.push('/')
      return
    }

    // If authenticated but not super admin, redirect to appropriate page
    if (!loading && hydrated && isAuthenticated && user) {
      if (user.user_type === 3) {
        // Coach - redirect to coach dashboard
        router.push('/dashboard/coach')
        return
      } else if (user.user_type !== 9) {
        // Not super admin - redirect to landing page
        router.push('/')
        return
      }
    }
  }, [user, isAuthenticated, loading, hydrated, router])

  // Show loading while authentication state is being determined
  if (loading || !hydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  // If not authenticated or not super admin, show loading while redirecting
  if (!isAuthenticated || !user || user.user_type !== 9) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Redirecting...</div>
      </div>
    )
  }

  // Show super admin dashboard
  return (
    <ChatAuthGate>
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
    </ChatAuthGate>
  )
}
