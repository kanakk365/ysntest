"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar-zustand"
import { NavUser } from "@/components/nav-user"
import { NotificationIcon, MessageIcon } from "@/components/header-notifications"
import { useIsMobile } from "@/hooks/use-mobile"
import { useAuthStore } from "@/lib/auth-store"

export function SiteHeader() {
  const isMobile = useIsMobile()
  const { user } = useAuthStore()
  
  const userData = {
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    avatar: "/avatars/user.jpg",
  }
  
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {isMobile && <SidebarTrigger className="-ml-1" />}
        {isMobile && (
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
        )}
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <NotificationIcon />
          <MessageIcon />
          <NavUser user={userData} />
        </div>
      </div>
    </header>
  )
}
