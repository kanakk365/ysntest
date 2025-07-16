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
      <div className="bg-black min-h-screen" >
        <Navbar/>
        <div className="dashboard-container -mt-20 overflow-hidden relative  ">
          <div className="flex h-full">
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
                <SidebarInset className="flex-1 h-full overflow-auto">
                  <SiteHeader />
                  <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
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
