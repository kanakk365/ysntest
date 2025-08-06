"use client"

import { useAuthStore } from "@/lib/auth-store"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useEffect, ReactNode } from "react"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, isAuthenticated, loading, hydrated, setUser } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    console.log('AuthProvider: useEffect triggered', { 
      isAuthenticated, 
      loading, 
      hydrated,
      user: user ? { id: user.id, hasToken: !!user.token, user_type: user.user_type } : null,
      pathname,
      hasStatusParam: !!searchParams.get('status')
    })

    // Handle login redirect with URL parameters
    const status = searchParams.get('status')
    const dataParam = searchParams.get('data')

    // Clear authentication state for any external redirect (success or failure)
    if (status && (status === 'success' || status === 'error')) {
      localStorage.removeItem('ysn-auth-storage')
    }

    if (status === 'success' && dataParam && !isAuthenticated) {
      try {        
        // Decode the URL-encoded data
        const decodedData = decodeURIComponent(dataParam)
        const userData = JSON.parse(decodedData)
        
        // Validate the user data structure
        if (userData.token && userData.id && userData.name && userData.email && userData.user_type) {
          console.log('AuthProvider: Setting user in auth store', userData)
          
          // Set the user in the auth store
          setUser({
            id: userData.id,
            token: userData.token,
            name: userData.name,
            email: userData.email,
            user_type: userData.user_type
          })
          
          console.log('AuthProvider: User set, waiting before redirect...')
          
          // Add a longer delay to ensure the state is properly set and persisted
          setTimeout(() => {
            console.log('AuthProvider: Redirecting based on user type:', userData.user_type)
            // Clear the URL parameters by redirecting to the appropriate dashboard
            if (userData.user_type === 9) {
              // Super Admin
              router.replace('/dashboard')
            } else if (userData.user_type === 3) {
              // Coach
              router.replace('/dashboard/coach')
            } else {
              // Unknown user type, redirect to login
              router.replace('/login')
            }
          }, 500)
          return
        } else {
          console.error('Invalid user data structure:', userData)
        }
      } catch (error) {
        console.error('Error parsing login data:', error)
        // If there's an error parsing the data, redirect to external login
        window.location.href = 'https://beta.ysn.tv/login'
        return
      }
    }

    // Only handle normal authentication flow if we're not processing URL parameters
    // AND we're properly hydrated (to avoid redirecting during rehydration)
    if (!loading && hydrated && !searchParams.get('status')) {
      console.log('AuthProvider: Normal auth flow check', { isAuthenticated, pathname, user })
      
      // If not authenticated and not on login page, redirect to external login
      if (!isAuthenticated && pathname !== "/login") {
        console.log('AuthProvider: Not authenticated, redirecting to external login')
        window.location.href = "https://beta.ysn.tv/login"
        return
      }

      // If authenticated, redirect based on user type
      if (isAuthenticated && user) {
        console.log('AuthProvider: User authenticated, checking user type and pathname', { user_type: user.user_type, pathname })
        if (user.user_type === 9 && pathname !== "/dashboard") {
          console.log('AuthProvider: Redirecting super admin to dashboard')
          router.push("/dashboard")
        } else if (user.user_type === 3 && pathname !== "/dashboard/coach") {
          console.log('AuthProvider: Redirecting coach to coach dashboard')
          router.push("/dashboard/coach")
        }
      }
    }
  }, [isAuthenticated, loading, hydrated, user, router, pathname, searchParams, setUser])

  // Show loading screen while authentication state is being determined
  if (loading || !hydrated) {
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
    console.log('AuthProvider: Rendering check', { user_type: user.user_type, pathname })
    if ((user.user_type === 9 && pathname === "/dashboard") || 
        (user.user_type === 3 && pathname === "/dashboard/coach")) {
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