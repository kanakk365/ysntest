"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar-zustand"
import { NavUser } from "@/components/superAdmin/navigation/nav-user"
import { CoachProfilePopover } from "@/components/coach/navigation/coach-profile-popover"
import { NotificationIcon, MessageIcon } from "@/components/superAdmin/navigation/header-notifications"
// Removed ChatSearchButton from header
import { useIsMobile } from "@/hooks/use-mobile"
import { useAuthStore } from "@/lib/auth-store"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  const isMobile = useIsMobile()
  const { user } = useAuthStore()
  
  const userData = {
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    avatar: "/avatars/user.jpg",
  }
  
  // Check if user is a coach (user_type === 3)
  const isCoach = user?.user_type === 3
  
  return (
    <header className="flex h-(--header-height) pt-4 pr-4 pb-2 shrink-0 items-center gap-2 border-b bg-background border-border transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
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
          <ThemeToggle />
          {isCoach ? <CoachProfilePopover /> : <NavUser user={userData} />}
        </div>
      </div>
    </header>
  )
}
