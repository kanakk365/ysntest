"use client"

import { useEffect } from "react"
import { ChartAreaInteractive } from "@/components/superAdmin/charts/chart-area-interactive"
import { SectionCards } from "@/components/superAdmin/dashboard/section-cards"
import { ChartBarDefault } from "@/components/ui/bar-chart"
import { ChartPieSimple } from "../../ui/pie-chart"
import { useDashboardStore } from "@/lib/dashboard-store"
import { useAuthStore } from "@/lib/auth-store"

export function DashboardContent() {
  const { dashboardData, loading, error, fetchDashboardData } = useDashboardStore()
  const { user } = useAuthStore()

  useEffect(() => {
    console.log('DashboardContent: useEffect triggered', { 
      user: user ? { id: user.id, hasToken: !!user.token, user_type: user.user_type } : null 
    })
    
    // Only fetch dashboard data if user is authenticated and has a valid token
    if (user?.token && user?.id) {
      console.log('DashboardContent: User authenticated, fetching dashboard data')
      fetchDashboardData()
    } else {
      console.log('DashboardContent: User not authenticated yet, skipping dashboard data fetch')
    }
  }, [fetchDashboardData, user?.token, user?.id])

  if (loading) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="text-white text-center">Loading dashboard data...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="text-red-500 text-center">Error: {error}</div>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="text-white text-center">No dashboard data available</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards dashboardData={dashboardData} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <div className="px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <ChartBarDefault />
          <ChartPieSimple/>
        </div>
      </div>
     
    </div>
  )
}
