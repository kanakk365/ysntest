"use client"

import { useCoachStore, type CoachTab } from "@/lib/coach-store"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Users, 
  Calendar, 
  User, 
  Search, 
  LogOut,
  Star,
  Trophy
} from "lucide-react"
import { cn } from "@/lib/utils"

export function CoachSidebar() {
  const { activeTab, setActiveTab } = useCoachStore()
  const { logout } = useAuthStore()
  const router = useRouter()

  const navigation = [
    {
      name: "My Players",
      href: "players",
      icon: Users,
      description: "View and manage your players"
    },
    {
      name: "Calendar",
      href: "calendar", 
      icon: Calendar,
      description: "Schedule and events"
    },
    {
      name: "Profile",
      href: "profile",
      icon: User,
      description: "Your personal information"
    },
    {
      name: "Search Players",
      href: "search",
      icon: Search,
      description: "Find new players"
    }
  ]

  const handleLogout = async () => {
    await logout()
    window.location.href = "https://beta.ysn.tv/login"
  }

  return (
    <div className="flex h-full w-full flex-col bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="flex h-[60px] items-center justify-start px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Trophy className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">Coach Dashboard</span>
        </div>
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      {/* Navigation - Takes up remaining space */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4 py-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant={activeTab === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2 text-xl ",
                  activeTab === item.href 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" 
                    : "text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
                onClick={() => setActiveTab(item.href as CoachTab)}
              >
                <item.icon className="h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="text-lg font-medium">{item.name}</span>
                  <span className="text-base text-muted-foreground">{item.description}</span>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Footer with Logout - Fixed at bottom */}
      <div className="mt-auto">
        <Separator className="bg-sidebar-border" />
        <div className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="text-lg">Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  )
} 