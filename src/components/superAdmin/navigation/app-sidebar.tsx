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
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"

import { NavMain } from "@/components/superAdmin/navigation/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar-zustand"

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
      title: "Friends",
      url: "#friends",
      icon: IconUserCog,
    },
    {
      title: "Parents",
      url: "#parents",
      icon: IconUserCog,
    },
    {
      title: "Families",
      url: "#families",
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
  const { logout } = useAuthStore()
  const router = useRouter()
  
  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <Sidebar collapsible="offcanvas" className="w-60 md:w-72 shrink-0" {...props}>
      <SidebarContent className="px-4 py-2">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:!p-2 cursor-pointer"
              onClick={handleLogout}
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
