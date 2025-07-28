import { create } from 'zustand'
import { api } from './api'

export type DashboardTab = "dashboard" | "profile" | "opponents" | "coaches" | "settings"

interface DashboardData {
  totalRevenue: {
    count: number
    labelCount: number
    monthlyTarget: number
    contentCount: number
  }
  activePlayers: {
    count: number
    labelCount: number
    dailyActive: number
    weeklyActive: number
  }
  newUsers: {
    count: number
    labelCount: number
    thisMonth: number
    avergare: number
  }
  totalTeams: {
    count: number
    labelCount: number
  }
  totalStreamedVideos: {
    count: number
    labelCount: number
    avgWatchTime: number
    totalViews: number
    engagement: number
    completionRate: number
  }
  totalAccounts: {
    totalUsers: number
    admins: number
    orgAdmins: number
    totalPlayers: number
    totalCoaches: number
    totalProScouts: number
    totalGuestUsers: number
  }
  totalMatches: {
    count: number
    labelCount: number
    Completed: number
    inProgress: number
    winRate: number
  }
  organizations: {
    count: number
    labelCount: number
  }
  totalCoaches: {
    count: number
    labelCount: number
  }
}

interface DashboardState {
  activeTab: DashboardTab
  dashboardData: DashboardData | null
  loading: boolean
  error: string | null
  setActiveTab: (tab: DashboardTab) => void
  fetchDashboardData: () => Promise<void>
  clearError: () => void
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  activeTab: "dashboard",
  dashboardData: null,
  loading: false,
  error: null,

  setActiveTab: (tab: DashboardTab) => {
    set({ activeTab: tab })
  },

  fetchDashboardData: async () => {
    set({ loading: true, error: null })

    try {
      const response = await api.get('https://beta.ysn.tv/api/dashboard')
      const data = await response.json()

      if (data.status === true) {
        set({
          dashboardData: data.data,
          loading: false,
          error: null,
        })
      } else {
        set({
          loading: false,
          error: data.message || 'Failed to fetch dashboard data',
        })
      }
    } catch (error) {
      set({
        loading: false,
        error: 'Network error. Please try again.',
      })
    }
  },

  clearError: () => {
    set({ error: null })
  },
})) 