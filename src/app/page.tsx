import Navbar from "@/components/Common/Navbar";
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardTabs } from "@/components/dashboard-tabs"
import { SiteHeader } from "@/components/site-header"
import { DashboardProvider } from "@/contexts/dashboard-context"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function Home() {
  return (
    <DashboardProvider>
      <div className="bg-black min-h-screen flex flex-col" >
        <Navbar/>
        <div className="dashboard-container -mt-20 overflow-hidden relative flex-1">
          <div className="flex h-screen">
            <SidebarProvider
              className="flex h-full"
              style={
                {
                  "--sidebar-width": "16rem",
                  "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
              }
            >
              <div className="flex h-full w-full">
                <AppSidebar variant="sidebar" />
                <SidebarInset className="flex-1 h-full flex flex-col overflow-hidden">
                  <SiteHeader />
                  <div className="flex-1 dashboard-scrollbar overflow-auto">
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
        </div>
      </div>
    </DashboardProvider>
  );
}
