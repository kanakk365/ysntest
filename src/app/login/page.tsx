"use client"

import { useState, useEffect } from "react"
import { useAuthStore, clearAuthStorage } from "@/lib/auth-store"
import { useSearchParams, useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [validationError, setValidationError] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const { login, loading, error, clearError } = useAuthStore()

  // Clear auth storage and localStorage when needed
  useEffect(() => {
    const status = searchParams.get('status')
    
    // Always clear storage for fresh state, but let AuthProvider handle successful logins
    if (!status || status === 'error') {
      clearAuthStorage()
      // Clear localStorage for fresh login attempts or errors
      if (typeof window !== 'undefined') {
        localStorage.clear()
        console.log('LoginPage: Cleared localStorage for fresh login state')
      }
    }
    // For successful logins, let AuthProvider handle the clearing and processing
  }, [searchParams])

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setValidationError("")

    // Client-side validation
    if (!email || !password) {
      setValidationError("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    const success = await login(email, password)
    
    if (success) {
      // Get the current user from the store
      const currentUser = useAuthStore.getState().user
      
      // Check if user is authorized (super admin or coach)
      if (currentUser && (currentUser.user_type === 9 || currentUser.user_type === 3)) {
        // User is authorized, AuthProvider will handle the redirect
        console.log('LoginPage: User authorized, AuthProvider will redirect')
      } else {
        // User is not authorized, redirect back to landing page
        console.log('LoginPage: User not authorized, redirecting to landing page')
        router.push('/')
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden w-full rounded-xl">
      {/* Centered glass card */}
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-gradient-to-r from-card/10 to-background backdrop-blur-sm shadow-2xl p-8 flex flex-col items-center border border-border">
        {/* Logo */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-6 shadow-lg">
          <Image src="/ysnlogo.webp" alt="YSN Logo" width={32} height={32} />
        </div>
        {/* Title */}
        <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
          YSN
        </h2>
        {/* Form */}
        <div className="flex flex-col w-full gap-4">
          <div className="w-full flex flex-col gap-3">
            <input
              placeholder="Email"
              type="email"
              value={email}
              className="w-full px-5 py-3 rounded-xl bg-card/10 text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring border border-border"
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                className="w-full px-5 py-3 rounded-xl bg-card/10 text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring border border-border pr-12"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {(validationError || error) && (
              <div className="text-sm text-destructive text-left">
                {validationError || error}
              </div>
            )}
          </div>
          <hr className="opacity-10 border-border" />
          <div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-primary/10 text-foreground font-medium px-5 py-3 rounded-full shadow hover:bg-primary/20 transition mb-3 text-sm border border-border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <div className="w-full text-center mt-2">
              <span className="text-xs text-muted-foreground">
                Don&apos;t have access?{" "}
                <button
                  onClick={() => router.push('/')}
                  className="underline text-foreground/80 hover:text-foreground"
                >
                  Return to home
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
     
    </div>
  )
} 