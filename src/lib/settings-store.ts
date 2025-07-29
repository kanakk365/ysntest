import { create } from 'zustand'
import { api, SettingsData, SettingsUI, SettingsResponse } from './api'

interface SettingsState {
  settings: SettingsUI
  loading: boolean
  error: string | null
  
  // Actions
  fetchSettings: () => Promise<void>
  updateSettings: (apiData: {
    live_orgz_id: number
    live_svtm_id: number
    live_video_id: string
    live_chat_flag: number
    live_twitch_flag: number
  }) => Promise<boolean>
  setSettings: (settings: SettingsUI) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const defaultSettings: SettingsUI = {
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
      const response: SettingsResponse = await api.settings.get()

      if (response.status === true && response.data) {
        // Convert API response to UI format
        const settings: SettingsUI = {
          ...response.data,
          live_chat_flag: response.data.live_chat_flag === 1
        }
        set({ settings, loading: false })
      } else {
        set({ 
          error: response.message || 'Failed to fetch settings', 
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

  updateSettings: async (apiData: {
    live_orgz_id: number
    live_svtm_id: number
    live_video_id: string
    live_chat_flag: number
    live_twitch_flag: number
  }) => {
    set({ loading: true, error: null })
    
    try {
      const response: SettingsResponse = await api.settings.update(apiData)

      if (response.status === true) {
        // Convert the response data back to UI format
        const updatedSettings: SettingsUI = {
          ...response.data,
          live_chat_flag: response.data.live_chat_flag === 1
        }
        set({ settings: updatedSettings, loading: false })
        return true
      } else {
        set({ 
          error: response.message || 'Failed to update settings', 
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

  setSettings: (settings: SettingsUI) => {
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