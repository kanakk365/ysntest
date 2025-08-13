"use client"

import { useAuthStore, USER_TYPE } from "@/lib/auth-store"
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
  const [processedUrlParams, setProcessedUrlParams] = useState<string | null>(null)

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
      hasStatusParam: !!searchParams.get('status'),
      isProcessingLogin
    })

    // Don't run if we're still loading or not hydrated
    if (loading || !hydrated) {
      console.log('AuthProvider: Skipping useEffect - loading or not hydrated')
      return
    }

    // Handle login redirect with URL parameters
    const status = searchParams.get('status')
    const dataParam = searchParams.get('data')

    // Clear authentication state only for error status to ensure clean state
    if (status === 'error' && !isProcessingLogin) {
      localStorage.clear()
      console.log('AuthProvider: Cleared localStorage due to error status')
      return // Early return to prevent further processing
    }

    if (status === 'success' && dataParam && !isProcessingLogin) {
      // Create a unique key for this URL parameter set to prevent duplicate processing
      const urlParamKey = `${status}-${dataParam.substring(0, 50)}`
      
      if (processedUrlParams === urlParamKey) {
        console.log('AuthProvider: URL parameters already processed, skipping')
        return
      }
      
      setProcessedUrlParams(urlParamKey)
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
            
            if (currentState.isAuthenticated && currentState.user) {
              console.log('AuthProvider: Redirecting based on user type:', userData.user_type)
              // Clear the URL parameters by redirecting to the appropriate dashboard
              if (userData.user_type === USER_TYPE.SUPER_ADMIN) {
                // Super Admin
                router.replace('/dashboard')
              } else if (userData.user_type === USER_TYPE.COACH) {
                // Coach
                router.replace('/dashboard/coach')
              } else if (
                userData.user_type === USER_TYPE.ORGANIZATION ||
                userData.user_type === USER_TYPE.PLAYER
              ) {
                // Organization or Player → Home
                router.replace('/')
              } else {
                // Unknown user type, redirect to landing page
                router.replace('/')
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
                if (userData.user_type === USER_TYPE.SUPER_ADMIN) {
                  router.replace('/dashboard')
                } else if (userData.user_type === USER_TYPE.COACH) {
                  router.replace('/dashboard/coach')
                } else if (
                  userData.user_type === USER_TYPE.ORGANIZATION ||
                  userData.user_type === USER_TYPE.PLAYER
                ) {
                  router.replace('/')
                } else {
                  router.replace('/')
                }
              }, 1000)
            }
            
            // Always clear the processing flag after redirect
            setIsProcessingLogin(false)
          }, 800) // Increased delay to ensure proper state persistence
          return
        } else {
          console.error('Invalid user data structure:', userData)
          setIsProcessingLogin(false)
        }
              } catch (error) {
          console.error('Error parsing login data:', error)
          setIsProcessingLogin(false)
          // If there's an error parsing the data, redirect to landing page
          router.push('/')
          return
        }
    }

    // Only handle normal authentication flow if we're not processing URL parameters
    // AND we're properly hydrated (to avoid redirecting during rehydration)
    // AND we're not currently processing a login
    const hasStatusParam = !!searchParams.get('status')
    
    if (!hasStatusParam && !isProcessingLogin) {
      console.log('AuthProvider: Normal auth flow check', { 
        isAuthenticated, 
        pathname, 
        user: user ? { id: user.id, user_type: user.user_type, hasToken: !!user.token } : null,
        loading,
        hydrated,
        isProcessingLogin
      })
      
      // If authenticated, redirect only when needed
      if (isAuthenticated && user) {
        console.log('AuthProvider: User authenticated, checking user type and pathname', { user_type: user.user_type, pathname })
        // Super admin → ensure on /dashboard when accessing restricted routes or login
        if (user.user_type === USER_TYPE.SUPER_ADMIN && (pathname === "/login" || pathname.startsWith("/dashboard/coach"))) {
          console.log('AuthProvider: Redirecting super admin to dashboard')
          router.push("/dashboard")
        // Coach → ensure on /dashboard/coach when accessing restricted routes or login
        } else if (user.user_type === USER_TYPE.COACH && (pathname === "/login" || pathname === "/dashboard")) {
          console.log('AuthProvider: Redirecting coach to coach dashboard')
          router.push("/dashboard/coach")
        // Org/Player → send to home if on login or restricted dashboards
        } else if (
          (user.user_type === USER_TYPE.ORGANIZATION || user.user_type === USER_TYPE.PLAYER) &&
          (pathname === "/login" || pathname.startsWith("/dashboard"))
        ) {
          console.log('AuthProvider: Redirecting organization/player to home')
          router.push("/")
        }
      }
    } else if (hasStatusParam) {
      console.log('AuthProvider: Skipping normal auth flow - processing URL parameters')
    } else if (isProcessingLogin) {
      console.log('AuthProvider: Skipping normal auth flow - currently processing login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hydrated, pathname, searchParams, isProcessingLogin, processedUrlParams]) // Removed user, isAuthenticated, setUser from deps to prevent loops

  // Reset processed URL params when search params change
  useEffect(() => {
    if (!searchParams.get('status')) {
      setProcessedUrlParams(null)
      setIsProcessingLogin(false)
    }
  }, [searchParams])

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

  // If authenticated
  if (isAuthenticated && user) {
    console.log('AuthProvider: Rendering check', { user_type: user.user_type, pathname, isAuthenticated, hasUser: !!user })
    // Guard restricted areas
    if (pathname === "/dashboard" && user.user_type !== USER_TYPE.SUPER_ADMIN) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-foreground">Redirecting...</div>
        </div>
      )
    }
    if (pathname.startsWith("/dashboard/coach") && user.user_type !== USER_TYPE.COACH) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-foreground">Redirecting...</div>
        </div>
      )
    }
    if (pathname === "/login") {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-foreground">Redirecting...</div>
        </div>
      )
    }
    // Otherwise, render the app normally (marketing pages, home, etc.)
    return <>{children}</>
  }

  // For all other cases (including unauthenticated users on main page), render children
  console.log('AuthProvider: Rendering children for all other cases', { 
    isAuthenticated, 
    hasUser: !!user, 
    pathname, 
    loading, 
    hydrated 
  })
  
  return <>{children}</>
} 