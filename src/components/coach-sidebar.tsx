"use client"

import { useCoach, type CoachTab } from "@/contexts/coach-context"
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
  const { activeTab, setActiveTab } = useCoach()
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
    router.push("/login")
  }

  return (
    <div className="flex h-full w-full flex-col bg-gray-900/95">
      {/* Header */}
      <div className="flex h-[60px] items-center justify-start px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">Coach Dashboard</span>
        </div>
      </div>
      
      <Separator className="bg-gray-700" />
      
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
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                )}
                onClick={() => setActiveTab(item.href as CoachTab)}
              >
                <item.icon className="h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="text-lg font-medium">{item.name}</span>
                  <span className="text-base text-gray-400">{item.description}</span>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Footer with Logout - Fixed at bottom */}
      <div className="mt-auto">
        <Separator className="bg-gray-700" />
        <div className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-gray-800"
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