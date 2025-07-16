"use client"

import React, { createContext, useContext, useState } from "react"

type DashboardTab = "dashboard" | "profile" | "opponents" | "coaches" | "settings"

interface DashboardContextType {
  activeTab: DashboardTab
  setActiveTab: (tab: DashboardTab) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard")

  return (
    <DashboardContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}
