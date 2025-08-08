"use client"

import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { CoachTabs } from "@/components/coach/dashboard/coach-tabs"
import { SiteHeader } from "@/components/superAdmin/navigation/site-header"

export default function CoachDashboard() {
  const { user, isAuthenticated, loading, hydrated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // If not authenticated, redirect to landing page
    if (!loading && hydrated && (!isAuthenticated || !user)) {
      router.push('/')
      return
    }

    // If authenticated but not coach, redirect to appropriate page
    if (!loading && hydrated && isAuthenticated && user) {
      if (user.user_type === 9) {
        // Super admin - redirect to super admin dashboard
        router.push('/dashboard')
        return
      } else if (user.user_type !== 3) {
        // Not coach - redirect to landing page
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

  // If not authenticated or not coach, show loading while redirecting
  if (!isAuthenticated || !user || user.user_type !== 3) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Redirecting...</div>
      </div>
    )
  }

  // Show coach dashboard
  return (
    <div className="h-screen flex flex-col bg-background">
      <SiteHeader />
      <div className="flex-1 p-4 lg:p-6 overflow-auto">
        <CoachTabs />
      </div>
    </div>
  )
} 