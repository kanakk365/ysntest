"use client"

import * as React from "react"
import { IconBell, IconMessage } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ChatPanel from "@/components/chat/ChatPanel"
import { useChatStore } from "@/lib/chat-store"

// Dummy notification data
const notifications = [
  {
    id: 1,
    title: "New Team Registration",
    message: "The Wildcats team has registered for the Spring Championship.",
    time: "2 minutes ago",
    type: "team",
    read: false,
  },
  {
    id: 2,
    title: "Match Schedule Update",
    message: "Your match against Thunder Bolts has been rescheduled to tomorrow at 3 PM.",
    time: "1 hour ago",
    type: "match",
    read: false,
  },
  {
    id: 3,
    title: "Payment Received",
    message: "Payment of $150 received from Phoenix Basketball Club.",
    time: "3 hours ago",
    type: "payment",
    read: true,
  },
  {
    id: 4,
    title: "New Coach Application",
    message: "Sarah Johnson has applied to become a certified coach.",
    time: "1 day ago",
    type: "application",
    read: true,
  },
  {
    id: 5,
    title: "Tournament Results",
    message: "Championship tournament results are now available for download.",
    time: "2 days ago",
    type: "results",
    read: true,
  },
]



export function NotificationIcon() {
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative cursor-pointer">
          <IconBell className="size-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <IconBell className="size-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {unreadCount} new
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={`${notification.read ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-medium">
                    {notification.title}
                    {!notification.read && (
                      <span className="ml-2 h-2 w-2 bg-primary rounded-full inline-block" />
                    )}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {notification.time}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  {notification.message}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full">
            View All Notifications
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function MessageIcon() {
  const unreadCount = 0
  const { isOpen, openChat, closeChat, openChatWithUserId } = useChatStore()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? openChat() : closeChat())}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative cursor-pointer">
          <IconMessage className="size-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-none sm:max-w-none h-[90vh] p-0 flex flex-col">
        <DialogHeader className="border-b px-4 py-3 flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <IconMessage className="size-5" />
            Messages
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-auto">{unreadCount} new</Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden min-h-0">
          <ChatPanel hideHeader openChatWithUserId={openChatWithUserId || undefined} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
