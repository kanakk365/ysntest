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

  // Immediately clear localStorage if on login page or if we have URL parameters indicating a new login
  useEffect(() => {
    const status = searchParams.get('status')
    const dataParam = searchParams.get('data')
    
    // Clear localStorage if:
    // 1. We're on the login page
    // 2. We have URL parameters indicating a new login attempt (success or error)
    // 3. We're on the root path with login parameters
    if (pathname === '/login' || 
        (status && dataParam) || 
        (pathname === '/' && status)) {
      localStorage.clear()
      console.log('AuthProvider: Cleared localStorage due to login page or URL parameters')
    }
  }, [pathname, searchParams])

  // Debug localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ysn-auth-storage')
      const urlParams = new URLSearchParams(window.location.search)
      const status = urlParams.get('status')
      const dataParam = urlParams.get('data')
      
      console.log('AuthProvider: Initial localStorage check:', stored ? 'Data found' : 'No data found')
      console.log('AuthProvider: URL parameters:', { status, hasData: !!dataParam, pathname })
      
      if (stored) {
        console.log('AuthProvider: Stored data preview:', stored.substring(0, 100) + '...')
      }
    }
  }, [pathname, searchParams])

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

    // Clear authentication state for both error and success status to ensure clean state
    if (status === 'error' || status === 'success') {
      localStorage.clear()
      console.log('AuthProvider: Cleared localStorage due to login status:', status)
    }

    if (status === 'success' && dataParam) {
      try {        
        // Decode the URL-encoded data
        const decodedData = decodeURIComponent(dataParam)
        const userData = JSON.parse(decodedData)
        
        // Validate the user data structure
        if (userData.token && userData.id && userData.name && userData.email && userData.user_type) {
          console.log('AuthProvider: Setting user in auth store', userData)
          
          // Set the user in the auth store (regardless of current authentication state)
          setUser({
            id: userData.id,
            token: userData.token,
            name: userData.name,
            email: userData.email,
            user_type: userData.user_type
          })
          
          console.log('AuthProvider: User set, waiting before redirect...')
          
          // Verify the data was persisted to localStorage
          setTimeout(() => {
            const stored = localStorage.getItem('ysn-auth-storage')
            console.log('AuthProvider: Checking localStorage after setUser:', stored ? 'Data found' : 'No data found')
          }, 100)
          
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
          }, 1000) // Increased delay to ensure proper state persistence
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
      // BUT only if we're sure there's no user data (check both isAuthenticated and user)
      if (!isAuthenticated && !user && pathname !== "/login") {
        console.log('AuthProvider: Not authenticated and no user data, redirecting to external login')
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

  // If we have URL parameters for login, show loading while processing
  if (searchParams.get('status')) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Processing login...</div>
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