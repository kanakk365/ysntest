import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  token: string
  name: string
  email: string
  user_type: number
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<boolean>
  clearError: () => void
  setHydrated: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: true, // Start with loading true
      error: null,

      login: async (email: string, password: string) => {
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
        } catch (error) {
          set({
            loading: false,
            error: 'Network error. Please try again.',
          })
          return false
        }
      },

      logout: async () => {
        const { user } = get()
        
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
        set({ loading: false })
      },
    }),
    {
      name: 'ysn-auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        // Set loading to false after hydration is complete
        if (state) {
          state.setHydrated()
        }
      },
    }
  )
) 