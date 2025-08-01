"use client"

import { useAuthStore } from "@/lib/auth-store"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, ReactNode } from "react"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, isAuthenticated, loading } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      // If not authenticated and not on login page, redirect to login
      if (!isAuthenticated && pathname !== "/login") {
        router.push("/login")
        return
      }

      // If authenticated, redirect based on user type
      if (isAuthenticated && user) {
        if (user.user_type === 1 && pathname !== "/dashboard") {
          router.push("/dashboard")
        } else if (user.user_type === 3 && pathname !== "/dashboard/coach") {
          router.push("/dashboard/coach")
        }
      }
    }
  }, [isAuthenticated, loading, user, router, pathname])

  // Show loading screen while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  // If not authenticated and on login page, show login
  if (!isAuthenticated && pathname === "/login") {
    return <>{children}</>
  }

  // If authenticated, show the appropriate dashboard
  if (isAuthenticated && user) {
    if (user.user_type === 1 && pathname === "/dashboard") {
      return <>{children}</>
    } else if (user.user_type === 3 && pathname === "/dashboard/coach") {
      return <>{children}</>
    }
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-foreground">Redirecting...</div>
    </div>
  )
} 