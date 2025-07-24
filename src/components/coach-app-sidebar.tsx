"use client"

import * as React from "react"
import {
  IconUsers,
  IconCalendar,
  IconUser,
  IconSearch,
  IconLogout,
} from "@tabler/icons-react"
import { useCoach } from "@/contexts/coach-context"
import { useAuth } from "@/contexts/auth-context"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const coachNavData = {
  navMain: [
    {
      title: "My Players",
      url: "#players",
      icon: IconUsers,
      tab: "players" as const,
    },
    {
      title: "Calendar",
      url: "#calendar",
      icon: IconCalendar,
      tab: "calendar" as const,
    },
    {
      title: "Profile",
      url: "#profile",
      icon: IconUser,
      tab: "profile" as const,
    },
    {
      title: "Search Players",
      url: "#search",
      icon: IconSearch,
      tab: "search" as const,
    },
  ],
}

export function CoachAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { activeTab, setActiveTab } = useCoach()
  const { logout } = useAuth()

  const handleItemClick = (tab: "players" | "calendar" | "profile" | "search") => {
    setActiveTab(tab)
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent className="px-4 py-2">
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
            </SidebarMenu>
            <SidebarMenu>
              {coachNavData.navMain.map((item) => {
                const isActive = activeTab === item.tab
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      tooltip={item.title}
                      onClick={() => handleItemClick(item.tab)}
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
      </SidebarContent>
      <SidebarFooter className="px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:!p-2 cursor-pointer"
              onClick={logout}
            >
              <IconLogout className="!size-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
} 