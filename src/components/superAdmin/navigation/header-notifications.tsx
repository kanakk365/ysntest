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
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ChatPanel from "@/components/chat/ChatPanel"

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

// Dummy message data
const messages = [
  {
    id: 1,
    sender: "Alex Thompson",
    message: "Hey, are we still on for practice tomorrow?",
    time: "5 minutes ago",
    avatar: "/avatars/alex.jpg",
    read: false,
  },
  {
    id: 2,
    sender: "Sarah Williams",
    message: "The new training equipment has arrived. Can you check it out?",
    time: "30 minutes ago",
    avatar: "/avatars/sarah.jpg",
    read: false,
  },
  {
    id: 3,
    sender: "Mike Johnson",
    message: "Great game yesterday! The team really showed improvement.",
    time: "2 hours ago",
    avatar: "/avatars/mike.jpg",
    read: true,
  },
  {
    id: 4,
    sender: "Lisa Chen",
    message: "I've updated the tournament schedule. Please review when you get a chance.",
    time: "4 hours ago",
    avatar: "/avatars/lisa.jpg",
    read: true,
  },
  {
    id: 5,
    sender: "David Park",
    message: "Thanks for organizing the coaching session. Very helpful!",
    time: "1 day ago",
    avatar: "/avatars/david.jpg",
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

  return (
    <Sheet>
      <SheetTrigger asChild>
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
      </SheetTrigger>
      <SheetContent className="w-[420px] sm:w-[520px] p-0">
        <div className="border-b px-4 py-3 flex items-center gap-2">
          <IconMessage className="size-5" />
          <span className="font-medium">Messages</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-auto">{unreadCount} new</Badge>
          )}
        </div>
        <div className="p-0">
          <ChatPanel />
        </div>
      </SheetContent>
    </Sheet>
  )
}
