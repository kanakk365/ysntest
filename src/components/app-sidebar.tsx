"use client"

import * as React from "react"
import {
  IconDashboard,
  IconUser,
  IconUsers,
  IconUserCog,
  IconSettings,
  IconLogout,
  IconInnerShadowTop,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#dashboard",
      icon: IconDashboard,
      isActive: true,
    },
    {
      title: "My Profile",
      url: "#profile",
      icon: IconUser,
    },
    {
      title: "Opponent Teams",
      url: "#opponents",
      icon: IconUsers,
    },
    {
      title: "Coaches",
      url: "#coaches",
      icon: IconUserCog,
    },
    {
      title: "Settings",
      url: "#settings",
      icon: IconSettings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent className="px-4 py-2">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:!p-2"
              onClick={() => {
                // Handle logout logic here
                console.log("Logout clicked")
              }}
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
