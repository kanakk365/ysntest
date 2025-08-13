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

// Types for Coach Profile (from /api/suser endpoint)
export interface CoachProfile {
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
  coach_id: number
  coach_user_id: number
  coach_fname: string
  coach_lname: string
  coach_phone: string
  coach_email: string
  coach_type: number
  coach_team_id: number
  coach_profile_photo: string | null
  coach_high_school_address: string | null
}

export interface CoachProfileResponse {
  status: boolean
  data: CoachProfile
  message: string
}

// Types for Events
export interface Event {
  event_id: number
  event_user_id: number
  event_name: string
  event_enty_id: number
  event_start_date: string
  event_start_time: string
  event_end_date: string
  event_end_time: string
  event_is_recur: number
  event_is_allday: number
  event_url: string
  event_location: string
  event_desc: string
  event_created: string
  event_modified: string | null
  event_status: number
  event_type_name: string
  hash_id: string
  user_hash_id: string
}

export interface EventsResponse {
  status: boolean
  data: Event[]
  message: string
}

export interface EventCreateUpdateRequest {
  event_id?: number
  event_name: string
  event_enty_id: number
  event_start_date: string
  event_start_time: string
  event_end_date: string
  event_end_time: string
  event_is_recur: number
  event_is_allday: number
  event_url: string
  event_location: string
  event_desc: string
  event_status: number
}

export interface EventDeleteRequest {
  deletedId: string
}

// Types for Followed Players
export interface FollowedPlayer {
  kids_id: number
  kids_user_id: number
  kids_team_id: number
  kids_fname: string
  kids_lname: string
  kids_email: string
  kids_mobile: string | null
  kids_graduating_class: string | null
  kids_high_school: string | null
  kids_high_school_address: string | null
  kids_plps_id: number
  kids_dob: string
  kids_gender: number
  kids_stat_id: number
  kids_bio: string | null
  kids_avatar: string
  kids_gpa: number | null
  kids_act: number | null
  kids_sat: number | null
  kids_height: number | null
  kids_weight: number | null
  kids_youtube_url: string | null
  kids_fb_url: string | null
  kids_twitter_url: string | null
  kids_insta_url: string | null
  kids_twitch_id: string | null
  kids_gamereel_url: string | null
  kids_slug_name: string
  kids_created: string
  kids_modified: string | null
  kids_status: number
  kid_user_type: number
  logo: string
  hash_id: string
  user_hash_id: string
}

export interface FollowedPlayersResponse {
  status: boolean
  data: FollowedPlayer[]
  message: string
}

// Types for Player Search
export interface SearchPlayer {
  kids_id: number
  kids_user_id: number
  kids_fname: string
  kids_lname: string
  kids_email: string
  kids_mobile: string | null
  kids_graduating_class: string | null
  kids_dob: string
  kids_youtube_url: string | null
  kids_fb_url: string | null
  kids_twitter_url: string | null
  kids_insta_url: string | null
  main_position: string
  kids_slug_name: string
  kids_avatar: string
  kids_gpa: string | null
  kids_act: string | null
  kids_sat: string | null
  kids_height: string | null
  kids_weight: string | null
  kid_user_type: number
  graduating_year: string
  logo: string
  hash_id: string
  user_hash_id: string
}

export interface SearchPlayersResponse {
  status: boolean
  data: SearchPlayer[]
  message: string
}

// Types for Search Filters
export interface Position {
  plps_id: number
  plps_name: string
}

export interface State {
  stat_id: number
  stat_name: string
  stat_code: string
}

export interface SearchFilters {
  position: Position[]
  years: number[]
  states: State[]
}

export interface SearchFiltersResponse {
  status: boolean
  data: SearchFilters
  message: string
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

// Types for Follow Player API
export interface FollowPlayerRequest {
  usfl_following_user_id: number
  usfl_user_id: number
  usfl_following_user_type: number
}

export interface FollowedPlayerData {
  kids_id: number
  kids_user_id: number
  kids_fname: string
  kids_lname: string
  kids_email: string
  kids_mobile: string | null
  kids_graduating_class: string | null
  kids_dob: string
  kids_youtube_url: string | null
  kids_fb_url: string | null
  kids_twitter_url: string | null
  kids_insta_url: string | null
  main_position: string
  kids_slug_name: string
  kids_avatar: string
  kids_gpa: string | null
  kids_act: string | null
  kids_sat: string | null
  kids_height: string | null
  kids_weight: string | null
  kid_user_type: number
  graduating_year: string
  logo: string
  hash_id: string
  user_hash_id: string
}

export interface GetFollowedPlayersResponse {
  status: boolean
  data: FollowedPlayerData[]
  message: string
}

export const api = {
  async fetch(url: string, options: RequestInit = {}) {
    const { user } = useAuthStore.getState()
    
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    }

    // Only set Content-Type for JSON, not for FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
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
        console.log('Token being sent:', user.token.substring(0, 20) + '...')
      } else {
        console.warn('No token found in auth store')
      }

      try {
        console.log('Making request to:', `${BASE_URL}/opponent-team/store-update`)
        const response = await api.fetch(`${BASE_URL}/opponent-team/store-update`, {
          method: 'POST',
          headers,
          body: data, // FormData for file upload
        })

        console.log('Response status:', response.status)
        console.log('Response headers:', Object.fromEntries(response.headers.entries()))

        if (!response.ok) {
          console.error('API Error:', response.status, response.statusText)
          const errorText = await response.text()
          console.error('Error response:', errorText)
          throw new Error(`API request failed: ${response.status} ${response.statusText}`)
        }

        return response.json()
      } catch (error) {
        console.error('storeUpdate error:', error)
        throw error
      }
    },

    async delete(hashId: string): Promise<ApiResponse> {
      const response = await api.delete(`${BASE_URL}/opponent-team/delete`, {
        body: JSON.stringify({ deletedId: hashId })
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

    async getFollowedPlayers(): Promise<FollowedPlayersResponse> {
      const response = await api.get(`${BASE_URL}/coach/followed-players`)
      return response.json()
    },

    async getProfile(): Promise<CoachProfileResponse> {
      const response = await api.get(`${BASE_URL}/user`)
      return response.json()
    },

    async getEvents(): Promise<EventsResponse> {
      const response = await api.get(`${BASE_URL}/event/lists`)
      return response.json()
    },

    async createUpdateEvent(data: EventCreateUpdateRequest): Promise<ApiResponse> {
      const response = await api.post(`${BASE_URL}/event/store-update`, data)
      return response.json()
    },

    async deleteEvent(data: EventDeleteRequest): Promise<ApiResponse> {
      const response = await api.delete(`${BASE_URL}/event/delete`, {
        body: JSON.stringify(data)
      })
      return response.json()
    },

    async storeUpdate(data: FormData): Promise<ApiResponse> {
      const { user } = useAuthStore.getState()
      
      const headers: Record<string, string> = {}
      if (user?.token) {
        headers.Authorization = `Bearer ${user.token}`
        console.log('Token being sent:', user.token.substring(0, 20) + '...')
      } else {
        console.warn('No token found in auth store')
      }

      try {
        console.log('Making request to:', `${BASE_URL}/coach/store-update`)
        const response = await api.fetch(`${BASE_URL}/coach/store-update`, {
          method: 'POST',
          headers,
          body: data, // FormData for file upload
        })

        console.log('Response status:', response.status)
        console.log('Response headers:', Object.fromEntries(response.headers.entries()))

        if (!response.ok) {
          console.error('API Error:', response.status, response.statusText)
          const errorText = await response.text()
          console.error('Error response:', errorText)
          throw new Error(`API request failed: ${response.status} ${response.statusText}`)
        }

        return response.json()
      } catch (error) {
        console.error('storeUpdate error:', error)
        throw error
      }
    },

    async delete(hashId: string): Promise<ApiResponse> {
      const response = await api.delete(`${BASE_URL}/coach/delete`, {
        body: JSON.stringify({ deletedId: hashId })
      })
      return response.json()
    },
  },

  // Players API
  players: {
    async search(params?: {
      search?: string
      grade?: string
      position?: string
      year?: string
      state?: string
    }): Promise<SearchPlayersResponse> {
      const searchParams = new URLSearchParams()
      
      if (params?.search) searchParams.append('search', params.search)
      if (params?.grade && params.grade !== 'all') searchParams.append('grade', params.grade)
      if (params?.position && params.position !== 'all') searchParams.append('position', params.position)
      if (params?.year && params.year !== 'all') searchParams.append('year', params.year)
      if (params?.state && params.state !== 'all') searchParams.append('state', params.state)
      
      const queryString = searchParams.toString()
      const url = queryString ? `${BASE_URL}/players/search?${queryString}` : `${BASE_URL}/players/search`
      
      const response = await api.get(url)
      return response.json()
    },

    async getSearchFilters(): Promise<SearchFiltersResponse> {
      const response = await api.get(`${BASE_URL}/players/search-filters`)
      return response.json()
    },

    async followPlayer(data: FollowPlayerRequest): Promise<ApiResponse> {
      const response = await api.post(`${BASE_URL}/player/follow`, data)
      return response.json()
    },

    async getFollowedPlayers(): Promise<GetFollowedPlayersResponse> {
      const response = await api.get(`${BASE_URL}/player/get-follow`)
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

  changePassword: {
    async change(data: {
      current_password: string
      new_password: string
      confirm_password: string
    }): Promise<ApiResponse> {
      const response = await api.post(`${BASE_URL}/change-password`, data)
      return response.json()
    },
  },

  // Coach Profile Update API
  coachProfile: {
    async update(data: FormData): Promise<ApiResponse> {
      const { user } = useAuthStore.getState()
      
      const headers: Record<string, string> = {}
      if (user?.token) {
        headers.Authorization = `Bearer ${user.token}`
      } else {
        console.warn('No token found in auth store')
      }

      try {
        const response = await api.fetch(`${BASE_URL}/coach/profile-update`, {
          method: 'POST',
          headers,
          body: data, // FormData for file upload
        })

        if (!response.ok) {
          console.error('API Error:', response.status, response.statusText)
          const errorText = await response.text()
          console.error('Error response:', errorText)
          throw new Error(`API request failed: ${response.status} ${response.statusText}`)
        }

        return response.json()
      } catch (error) {
        console.error('coachProfile update error:', error)
        throw error
      }
    },
  },

  // Organizations & Teams API
  organizations: {
    async getDetails(slug: string): Promise<ApiResponse> {
      const response = await api.get(`${BASE_URL}/organization-details/${encodeURIComponent(slug)}`)
      return response.json()
    },

    teams: {
      async storeUpdate(data: FormData): Promise<ApiResponse> {
        const { user } = useAuthStore.getState()

        const headers: Record<string, string> = {}
        if (user?.token) {
          headers.Authorization = `Bearer ${user.token}`
        }

        const response = await api.fetch(`${BASE_URL}/team/store-update`, {
          method: 'POST',
          headers,
          body: data,
        })

        if (!response.ok) {
          const errText = await response.text()
          throw new Error(errText || 'Failed to create/update team')
        }
        return response.json()
      },

      async delete(payload: { deletedId: string }): Promise<ApiResponse> {
        const { user } = useAuthStore.getState()
        const headers: Record<string, string> = {}
        if (user?.token) {
          headers.Authorization = `Bearer ${user.token}`
        }
        const response = await api.delete(`${BASE_URL}/team/delete`, {
          headers,
          body: JSON.stringify(payload),
        })
        if (!response.ok) {
          const errText = await response.text()
          throw new Error(errText || 'Failed to delete team')
        }
        return response.json()
      },
    },
  },
} 