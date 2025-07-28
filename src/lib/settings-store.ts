import { create } from 'zustand'
import { api } from './api'

interface SettingsData {
  live_id?: number
  live_orgz_id: number
  live_svtm_id: number
  live_video_id: string
  live_chat_flag: boolean
  live_twitch_flag: number // 0-Off, 1-On
  live_created?: string
  live_modified?: string
  live_status?: number
}

interface ApiResponse {
  status: boolean
  data?: SettingsData
  message: string
}

interface SettingsState {
  settings: SettingsData
  loading: boolean
  error: string | null
  
  // Actions
  fetchSettings: () => Promise<void>
  updateSettings: (settings: SettingsData) => Promise<boolean>
  setSettings: (settings: SettingsData) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const defaultSettings: SettingsData = {
  live_orgz_id: 1,
  live_svtm_id: 2,
  live_video_id: "ysnetwork",
  live_chat_flag: false,
  live_twitch_flag: 1
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: defaultSettings,
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true, error: null })
    
    try {
      const response = await api.get('https://beta.ysn.tv/api/settings')
      const data: ApiResponse = await response.json()

      if (data.status === true && data.data) {
        set({ settings: data.data, loading: false })
      } else {
        set({ 
          error: data.message || 'Failed to fetch settings', 
          loading: false 
        })
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      set({ 
        error: 'Network error. Please try again.', 
        loading: false 
      })
    }
  },

  updateSettings: async (settings: SettingsData) => {
    set({ loading: true, error: null })
    
    try {
      const response = await api.post('https://beta.ysn.tv/api/settings', settings)
      const data: ApiResponse = await response.json()

      if (data.status === true) {
        // Update with response data if available
        const updatedSettings = data.data || settings
        set({ settings: updatedSettings, loading: false })
        return true
      } else {
        set({ 
          error: data.message || 'Failed to update settings', 
          loading: false 
        })
        return false
      }
    } catch (error) {
      console.error('Settings update error:', error)
      set({ 
        error: 'Network error. Please try again.', 
        loading: false 
      })
      return false
    }
  },

  setSettings: (settings: SettingsData) => {
    set({ settings })
  },

  setLoading: (loading: boolean) => {
    set({ loading })
  },

  setError: (error: string | null) => {
    set({ error })
  },

  reset: () => {
    set({ 
      settings: defaultSettings, 
      loading: false, 
      error: null 
    })
  }
})) 