"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "super_admin" | "coach"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Dummy users for demo
const dummyUsers = [
  {
    id: "1",
    name: "Super Admin",
    email: "admin@ysn.com",
    role: "super_admin" as UserRole,
    avatar: "/admin-avatar.jpg"
  },
  {
    id: "2", 
    name: "Coach John",
    email: "coach@ysn.com",
    role: "coach" as UserRole,
    avatar: "/coach-avatar.jpg"
  }
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem("ysn-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Dummy login logic
    const foundUser = dummyUsers.find(u => u.email === email)
    
    if (foundUser && password === "password") {
      setUser(foundUser)
      localStorage.setItem("ysn-user", JSON.stringify(foundUser))
      return true
    }
    
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("ysn-user")
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 