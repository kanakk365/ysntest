"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"
import { useDashboardStore } from "@/lib/dashboard-store"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar-zustand"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    isActive?: boolean
  }[]
}) {
  const { activeTab, setActiveTab } = useDashboardStore()

  const handleItemClick = (item: { title: string; url: string }) => {
    // Handle logout separately
    if (item.title === "Logout") {
      // Add logout logic here
      console.log("Logging out...")
      // You can add your logout logic here
      return
    }
    
    // Map sidebar items to tab names
    const tabMap: { [key: string]: "dashboard" | "profile" | "opponents" | "coaches" | "settings" } = {
      "Dashboard": "dashboard",
      "My Profile": "profile",
      "Opponent Teams": "opponents",
      "Coaches": "coaches",
      "Settings": "settings"
    }
    
    const tabName = tabMap[item.title]
    if (tabName) {
      setActiveTab(tabName)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const tabMap: { [key: string]: string } = {
              "Dashboard": "dashboard",
              "My Profile": "profile",
              "Opponent Teams": "opponents",
              "Coaches": "coaches",
              "Settings": "settings"
            }
            const tabName = tabMap[item.title]
            const isActive = activeTab === tabName
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  onClick={() => handleItemClick(item)}
                  className={isActive ? "bg-accent text-accent-foreground cursor-pointer " : "cursor-pointer"}
                >
                  {item.icon && <item.icon className="size-5" />}
                  <span className="text-base font-medium">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
