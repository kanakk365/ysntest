"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, VariantProps } from "class-variance-authority"
import { PanelLeftIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSidebarStore } from "@/lib/sidebar-store"

const sidebarVariants = cva(
  "group relative flex h-full w-full flex-col gap-4 border-r bg-background",
  {
    variants: {
      variant: {
        default: "border-border",
        floating: "border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        inset: "border-0",
        sidebar: "border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const sidebarMenuButtonVariants = cva(
  "group relative flex w-full items-center justify-start rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground [&[data-state=open]>svg]:rotate-90",
  {
    variants: {
      variant: {
        default: "hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-8 px-2 py-1",
        lg: "h-12 px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Sidebar({
  side = "left",
  variant = "default",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right"
  variant?: "default" | "floating" | "inset" | "sidebar"
  collapsible?: "offcanvas" | "icon" | "none"
}) {
  const { isOpen, isMobile, openMobile } = useSidebarStore()

  if (isMobile && collapsible === "offcanvas") {
    return (
      <Sheet open={openMobile} onOpenChange={(open) => useSidebarStore.getState().setOpenMobile(open)}>
        <SheetContent side={side} className="p-0">
          <div className={cn(sidebarVariants({ variant }), className)} {...props}>
            {children}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  if (collapsible === "icon" && !isOpen) {
    return (
      <div className={cn(sidebarVariants({ variant }), "w-12", className)} {...props}>
        {children}
      </div>
    )
  }

  return (
    <div className={cn(sidebarVariants({ variant }), className)} {...props}>
      {children}
    </div>
  )
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebarStore()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-6 w-6", className)}
      onClick={onClick || toggleSidebar}
      {...props}
    >
      <PanelLeftIcon className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-1 flex-col gap-2", className)} {...props} />
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-4", className)} {...props} />
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1", className)} {...props} />
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cn("flex flex-col gap-1", className)} {...props} />
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("", className)} {...props} />
}

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot : "button"

  const content = (
    <Comp
      className={cn(
        sidebarMenuButtonVariants({ variant, size }),
        isActive && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    />
  )

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {typeof tooltip === "string" ? tooltip : tooltip.children}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return content
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />
}

export {
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} 