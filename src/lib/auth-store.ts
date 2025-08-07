import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  token: string
  name: string
  email: string
  user_type: number
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  hydrated: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<boolean>
  clearError: () => void
  setHydrated: () => void
  setUser: (user: User) => void
  clearAllStorage: () => void
}

// Function to clear all localStorage data
const clearAllLocalStorage = () => {
  try {
    // Log what's being cleared for debugging
    const keys = Object.keys(localStorage)
    console.log('AuthStore: Clearing localStorage keys:', keys)
    
    // Clear all localStorage items
    localStorage.clear()
    console.log('AuthStore: All localStorage data cleared successfully')
  } catch (error) {
    console.warn('AuthStore: Error clearing localStorage:', error)
  }
}

// Function to clear localStorage before auth store rehydrates
export const clearAuthStorage = () => {
  try {
    // Clear all localStorage data, not just the auth storage
    localStorage.clear()
    console.log('AuthStore: All localStorage data cleared before rehydration')
  } catch (error) {
    console.warn('AuthStore: Error clearing auth storage:', error)
  }
}

// Function to check and clear localStorage if on login page or has login URL parameters
export const checkAndClearStorage = () => {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname
    const urlParams = new URLSearchParams(window.location.search)
    const status = urlParams.get('status')
    
    // Clear localStorage if:
    // 1. We're on the login page WITHOUT any status (regular login page)
    // 2. We have error status
    // 3. We have success status (new successful login - always clear old data first)
    // 4. We're on the root path with error status
    if ((pathname === '/login' && !status) || 
        status === 'error' || 
        status === 'success' ||
        (pathname === '/' && status === 'error')) {
      console.log('AuthStore: Clearing localStorage for fresh state, status:', status || 'none')
      localStorage.clear()
    }
  }
}

// Call this immediately when the module loads
checkAndClearStorage()

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: true, // Start with loading true
      hydrated: false, // Start with hydrated false
      error: null,

      clearAllStorage: () => {
        clearAllLocalStorage()
        // Reset the store state
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
          hydrated: false,
          error: null,
        })
      },

      login: async (email: string, password: string) => {
        // Always clear localStorage before login to ensure fresh state
        clearAllLocalStorage()
        
        set({ loading: true, error: null })

        try {
          const response = await fetch('https://beta.ysn.tv/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
            }),
          })

          const data = await response.json()

          if (data.status === true) {
            set({
              user: data.data,
              isAuthenticated: true,
              loading: false,
              error: null,
            })
            return true
          } else {
            set({
              loading: false,
              error: data.message || 'Login failed',
            })
            return false
          }
        } catch {
          set({
            loading: false,
            error: 'Network error. Please try again.',
          })
          return false
        }
      },

      logout: async () => {
        const { user } = get()
        
        // Clear all localStorage data when logging out
        clearAllLocalStorage()
        
        if (!user?.token) {
          // If no token, just clear local state
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          })
          return true
        }

        try {
          const response = await fetch('https://beta.ysn.tv/api/logout', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json',
            },
          })

          const data = await response.json()

          // Clear local state regardless of API response
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          })

          if (data.status === true) {
            return true
          } else {
            // Log the error but don't show it to user since we've already logged out locally
            console.warn('Logout API error:', data.message)
            return true
          }
        } catch (error) {
          // Even if API call fails, clear local state
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          })
          console.warn('Logout network error:', error)
          return true
        }
      },

      clearError: () => {
        set({ error: null })
      },

      setHydrated: () => {
        set({ loading: false, hydrated: true })
      },

      setUser: (user: User) => {
        console.log('AuthStore: setUser called with', user)
        // Don't clear localStorage here - let it be handled by the persistence mechanism
        set({
          user,
          isAuthenticated: true,
          loading: false,
          hydrated: true,
          error: null,
        })
        console.log('AuthStore: User state set successfully')
      },
    }),
    {
      name: 'ysn-auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      skipHydration: false,
      onRehydrateStorage: () => (state) => {
        console.log('AuthStore: Rehydrating state', state)
        
        if (typeof window !== 'undefined') {
          const pathname = window.location.pathname
          const urlParams = new URLSearchParams(window.location.search)
          const status = urlParams.get('status')
          
          // Check if we should clear storage 
          const shouldClearStorage = (pathname === '/login' && !status) || 
                                   status === 'error' || 
                                   status === 'success' ||
                                   (pathname === '/' && status === 'error')
          
          if (state) {
            // If we should clear storage, reset state completely
            if (shouldClearStorage) {
              console.log('AuthStore: Clearing localStorage and resetting state for fresh login, status:', status || 'none')
              clearAllLocalStorage()
              // Reset the state completely
              state.user = null
              state.isAuthenticated = false
              state.loading = false
              state.hydrated = false
              state.error = null
              return
            }
            
            // Ensure isAuthenticated is properly set based on user data
            if (state.user && state.user.token && !state.isAuthenticated) {
              console.log('AuthStore: User data found but not authenticated, fixing state')
              state.isAuthenticated = true
            }
            
            state.setHydrated()
            console.log('AuthStore: State hydrated successfully', { 
              hasUser: !!state.user, 
              isAuthenticated: state.isAuthenticated 
            })
          }
        }
      },
    }
  )
) 