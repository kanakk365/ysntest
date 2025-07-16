import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { DashboardProvider } from "@/contexts/dashboard-context"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"

export default function Page() {
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
                  <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <SectionCards />
                    <div className="px-4 lg:px-6">
                      <ChartAreaInteractive />
                    </div>
                    <DataTable data={data} />
                  </div>
                </div>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </DashboardProvider>
  )
}
