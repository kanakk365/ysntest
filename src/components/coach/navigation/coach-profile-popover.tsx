"use client"

import { useAuthStore } from "@/lib/auth-store"
import { useCoachStore } from "@/lib/coach-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { User, Settings, LogOut, Sun, Moon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

export function CoachProfilePopover() {
  const { user , logout } = useAuthStore()
  const { setActiveTab } = useCoachStore()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  
  const handleProfileClick = () => {
    setActiveTab("profile")
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-8 w-8 rounded-full cursor-pointer border border-gray-100">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/coach-avatar.jpg" alt={user?.name || "Coach"} />
            <AvatarFallback>{user?.name?.split(' ').map(n => n[0]).join('') || "C"}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "Coach"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || "coach@ysn.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfileClick}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleTheme}>
          {theme === "light" ? (
            <Moon className="mr-2 h-4 w-4" />
          ) : (
            <Sun className="mr-2 h-4 w-4" />
          )}
          <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 