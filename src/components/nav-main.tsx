"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"
import { useDashboard } from "@/contexts/dashboard-context"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

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
  const { activeTab, setActiveTab } = useDashboard()

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
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
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
                  tooltip={item.title}
                  onClick={() => handleItemClick(item)}
                  className={isActive ? "bg-accent text-accent-foreground" : ""}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
