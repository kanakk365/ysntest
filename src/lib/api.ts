import { useAuthStore } from './auth-store'

const BASE_URL = 'https://beta.ysn.tv/api'

// Types for Opponent Teams
export interface OpponentTeam {
  oppt_id: number
  oppt_team_id: number | null
  oppt_team_name: string
  oppt_team_logo: string
  logo: string
  hash_id: string
}

export interface OpponentTeamsResponse {
  status: boolean
  data: OpponentTeam[]
  message: string
}

export interface OpponentTeamResponse {
  status: boolean
  data: OpponentTeam
  message: string
}

// Types for Coaches
export interface Coach {
  coach_user_id: number
  coach_id: number
  coach_fname: string
  coach_lname: string
  coach_phone: string
  coach_email: string
  coach_type: number
  coach_status: number
  coach_profile_photo: string
  coach_hash_id: string
  coach_user_hash_id: string
}

export interface CoachType {
  id: number
  name: string
}

export interface CoachesResponse {
  status: boolean
  data: Coach[]
  message: string
}

export interface CoachTypesResponse {
  status: boolean
  data: CoachType[]
  message: string
}

export interface CoachFormData {
  coach_id?: string
  org_id: string
  coach_fname: string
  coach_lname: string
  coach_email: string
  coach_phone: string
  coach_type: string
  coach_team_id?: string
  logo?: File
}

export interface ApiResponse {
  status: boolean
  data: unknown
  message: string
}

export interface UserProfile {
  id: number
  name: string
  email: string
  user_type: number
  user_fname: string
  user_lname: string
  user_dob: string | null
  user_mobile: string | null
  user_college_name: string | null
  user_status: number
  user_slug_name: string
}

export interface UserProfileResponse {
  status: boolean
  data: UserProfile
  message: string
}

// Settings API Types
export interface SettingsData {
  live_id?: number
  live_orgz_id: number
  live_svtm_id: number
  live_video_id: string
  live_chat_flag: number // API format: 0 or 1
  live_twitch_flag: number // 0-Off, 1-On
  live_created?: string
  live_modified?: string
  live_status?: number
}

// UI format for frontend
export interface SettingsUI {
  live_id?: number
  live_orgz_id: number
  live_svtm_id: number
  live_video_id: string
  live_chat_flag: boolean // UI format: true/false
  live_twitch_flag: number // 0-Off, 1-On
  live_created?: string
  live_modified?: string
  live_status?: number
}

export interface SettingsResponse {
  status: boolean
  data: SettingsData
  message: string
}

export const api = {
  async fetch(url: string, options: RequestInit = {}) {
    const { user } = useAuthStore.getState()
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    }

    // Add authorization header if user is authenticated
    if (user?.token) {
      headers.Authorization = `Bearer ${user.token}`
    }

    return fetch(url, {
      ...options,
      headers,
    })
  },

  async get(url: string, options: RequestInit = {}) {
    return this.fetch(url, {
      method: 'GET',
      ...options,
    })
  },

  async post(url: string, data: unknown, options: RequestInit = {}) {
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    })
  },

  async put(url: string, data: unknown, options: RequestInit = {}) {
    return this.fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    })
  },

  async delete(url: string, options: RequestInit = {}) {
    return this.fetch(url, {
      method: 'DELETE',
      ...options,
    })
  },

  // Opponent Teams API
  opponentTeams: {
    async getList(): Promise<OpponentTeamsResponse> {
      const response = await api.get(`${BASE_URL}/opponent-teams`)
      return response.json()
    },

    async getById(hashId: string): Promise<OpponentTeamResponse> {
      const response = await api.get(`${BASE_URL}/opponent-team/${hashId}`)
      return response.json()
    },

    async storeUpdate(data: FormData): Promise<ApiResponse> {
      const { user } = useAuthStore.getState()
      
      const headers: Record<string, string> = {}
      if (user?.token) {
        headers.Authorization = `Bearer ${user.token}`
      }

      const response = await fetch(`${BASE_URL}/opponent-team/store-update`, {
        method: 'POST',
        headers,
        body: data, // FormData for file upload
      })
      return response.json()
    },

    async delete(hashId: string): Promise<ApiResponse> {
      const response = await api.post(`${BASE_URL}/opponent-team/delete`, {
        deletedId: hashId
      })
      return response.json()
    },
  },

  // Coaches API
  coaches: {
    async getList(): Promise<CoachesResponse> {
      const response = await api.get(`${BASE_URL}/coach/lists`)
      return response.json()
    },

    async getTypes(): Promise<CoachTypesResponse> {
      const response = await api.get(`${BASE_URL}/coach/types`)
      return response.json()
    },

    async storeUpdate(data: FormData): Promise<ApiResponse> {
      const { user } = useAuthStore.getState()
      
      const headers: Record<string, string> = {}
      if (user?.token) {
        headers.Authorization = `Bearer ${user.token}`
      }

      const response = await fetch(`${BASE_URL}/coach/store-update`, {
        method: 'POST',
        headers,
        body: data, // FormData for file upload
      })
      return response.json()
    },

    async delete(hashId: string): Promise<ApiResponse> {
      const response = await api.post(`${BASE_URL}/coach/delete`, {
        deletedId: hashId
      })
      return response.json()
    },
  },

  // User Profile API
  userProfile: {
    async get(): Promise<UserProfileResponse> {
      const response = await api.get(`${BASE_URL}/user`)
      return response.json()
    },
  },

  // Settings API
  settings: {
    async get(): Promise<SettingsResponse> {
      const response = await api.get(`${BASE_URL}/settings/admin`)
      return response.json()
    },

    async update(data: Partial<SettingsData>): Promise<SettingsResponse> {
      const response = await api.post(`${BASE_URL}/settings`, data)
      return response.json()
    },
  },
} 