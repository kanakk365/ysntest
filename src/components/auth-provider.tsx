"use client"

import { useAuthStore } from "@/lib/auth-store"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState, ReactNode } from "react"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, isAuthenticated, loading, hydrated, setUser } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isProcessingLogin, setIsProcessingLogin] = useState(false)

  // Clear localStorage for specific scenarios to ensure fresh state
  useEffect(() => {
    const status = searchParams.get('status')
    
    // Clear localStorage if:
    // 1. We're on the login page WITHOUT success status (regular login page)
    // 2. We have error status (failed login)
    // DON'T clear for success status here - handle it in the main processing logic
    if ((pathname === '/login' && !status) || status === 'error') {
      localStorage.clear()
      console.log('AuthProvider: Cleared localStorage for fresh login state, status:', status || 'none')
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

    // Clear authentication state only for error status to ensure clean state
    if (status === 'error') {
      localStorage.clear()
      console.log('AuthProvider: Cleared localStorage due to error status')
    }

    if (status === 'success' && dataParam) {
      setIsProcessingLogin(true) // Set flag to prevent normal auth flow
      
      try {        
        // Decode the URL-encoded data first
        const decodedData = decodeURIComponent(dataParam)
        const userData = JSON.parse(decodedData)
        
        // Validate the user data structure
        if (userData.token && userData.id && userData.name && userData.email && userData.user_type) {
          console.log('AuthProvider: Valid user data received, processing login', userData)
          
          // Clear only the auth storage key to remove old user data, but preserve other localStorage items
          // This ensures we don't interfere with other parts of the app while clearing stale auth data
          localStorage.removeItem('ysn-auth-storage')
          console.log('AuthProvider: Cleared old auth data before setting new user')
          
          // Set the user in the auth store
          setUser({
            id: userData.id,
            token: userData.token,
            name: userData.name,
            email: userData.email,
            user_type: userData.user_type
          })
          
          console.log('AuthProvider: User set, waiting before redirect...')
          
          // Add a delay to ensure the state is properly set and persisted
          setTimeout(() => {
            // Verify the auth state was updated
            const currentState = useAuthStore.getState()
            console.log('AuthProvider: Verifying auth state before redirect:', {
              isAuthenticated: currentState.isAuthenticated,
              hasUser: !!currentState.user,
              userType: currentState.user?.user_type
            })
            
            setIsProcessingLogin(false) // Clear flag before redirect
            
            if (currentState.isAuthenticated && currentState.user) {
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
            } else {
              console.error('AuthProvider: Auth state not properly set, retrying...')
              // Retry setting the user
              setUser({
                id: userData.id,
                token: userData.token,
                name: userData.name,
                email: userData.email,
                user_type: userData.user_type
              })
              
              setTimeout(() => {
                setIsProcessingLogin(false) // Clear flag
                if (userData.user_type === 9) {
                  router.replace('/dashboard')
                } else if (userData.user_type === 3) {
                  router.replace('/dashboard/coach')
                } else {
                  router.replace('/login')
                }
              }, 1000)
            }
          }, 800) // Increased delay to ensure proper state persistence
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
    // AND we're not currently processing a login
    const hasStatusParam = searchParams.get('status')
    
    if (!loading && hydrated && !hasStatusParam && !isProcessingLogin) {
      console.log('AuthProvider: Normal auth flow check', { 
        isAuthenticated, 
        pathname, 
        user: user ? { id: user.id, user_type: user.user_type, hasToken: !!user.token } : null,
        loading,
        hydrated,
        isProcessingLogin
      })
      
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
    } else if (hasStatusParam) {
      console.log('AuthProvider: Skipping normal auth flow - processing URL parameters')
    } else if (isProcessingLogin) {
      console.log('AuthProvider: Skipping normal auth flow - currently processing login')
    }
  }, [isAuthenticated, loading, hydrated, user, router, pathname, searchParams, setUser, isProcessingLogin])

  // Show loading screen while authentication state is being determined
  if (loading || !hydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  // If we have URL parameters for login or we're processing, show loading while processing
  if (searchParams.get('status') || isProcessingLogin) {
    console.log('AuthProvider: Showing processing screen for status:', searchParams.get('status'), 'isProcessingLogin:', isProcessingLogin)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Processing login...</div>
      </div>
    )
  }

  // If not authenticated and on login page, show login
  if (!isAuthenticated && pathname === "/login") {
    console.log('AuthProvider: Showing login page')
    return <>{children}</>
  }

  // If authenticated, show the appropriate dashboard
  if (isAuthenticated && user) {
    console.log('AuthProvider: Rendering check', { user_type: user.user_type, pathname, isAuthenticated, hasUser: !!user })
    if ((user.user_type === 9 && pathname === "/dashboard") || 
        (user.user_type === 3 && pathname === "/dashboard/coach")) {
      console.log('AuthProvider: Rendering children for authenticated user')
      return <>{children}</>
    } else {
      // User is authenticated but on wrong path - let the useEffect handle redirect
      console.log('AuthProvider: User authenticated but on wrong path, showing redirecting...')
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-foreground">Redirecting to dashboard...</div>
        </div>
      )
    }
  }

  // If we reach here, user is not authenticated and not on login page
  console.log('AuthProvider: Fallback - showing loading while determining auth state', { 
    isAuthenticated, 
    hasUser: !!user, 
    pathname, 
    loading, 
    hydrated 
  })
  
  // Show loading while redirecting or determining state
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-foreground">Loading...</div>
    </div>
  )
} 