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
import { NavUser } from "@/components/nav-user"
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
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/user.jpg",
  },
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
    {
      title: "Logout",
      url: "#logout",
      icon: IconLogout,
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
