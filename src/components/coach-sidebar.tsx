"use client"

import { useCoach } from "@/contexts/coach-context"
import { useAuth } from "@/contexts/auth-context"
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
  const { activeTab, setActiveTab } = useCoach()
  const { logout } = useAuth()

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

  return (
    <div className="flex h-full w-full flex-col gap-4 bg-gray-900/95 p-4">
      <div className="flex h-[60px] items-center justify-start px-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">Coach Dashboard</span>
        </div>
      </div>
      
      <Separator className="bg-gray-700" />
      
      <ScrollArea className="flex-1">
        <div className="space-y-1">
          {navigation.map((item) => (
            <Button
              key={item.name}
              variant={activeTab === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                activeTab === item.href 
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              )}
              onClick={() => setActiveTab(item.href as any)}
            >
              <item.icon className="h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-xs text-gray-400">{item.description}</span>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
      
      <Separator className="bg-gray-700" />
      
      <div className="flex flex-col gap-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-gray-800"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  )
} 