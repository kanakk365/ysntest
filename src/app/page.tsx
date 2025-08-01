"use client"

import { useAuthStore } from "@/lib/auth-store"
import { AppSidebar } from "@/components/superAdmin/navigation/app-sidebar"
import { DashboardTabs } from "@/components/superAdmin/dashboard/dashboard-tabs"
import { SiteHeader } from "@/components/superAdmin/navigation/site-header"
import { DashboardProvider } from "@/contexts/dashboard-context"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function Home() {
  const { user } = useAuthStore()

  return (
    <DashboardProvider>
      <div className="h-screen bg-background">
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
