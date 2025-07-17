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
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">YSN Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
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
