import { create } from 'zustand'
import { api, FollowedPlayer, CoachProfile } from './api'

export type CoachTab = "players" | "profile" | "search"

export interface Player {
  id: string
  fullName: string
  dob: string
  grade: string
  act: number | null
  sat: number | null
  gpa: number | null
  position: string
  state: string
  rating: number
  notes: string[]
  labels: string[]
  avatar?: string
  email?: string
  mobile?: string | null
  highSchool?: string | null
  graduatingClass?: string | null
}

interface CoachState {
  activeTab: CoachTab
  players: Player[]
  profile: CoachProfile | null
  profileLoading: boolean
  profileError: string | null
  loading: boolean
  error: string | null
  setActiveTab: (tab: CoachTab) => void
  fetchPlayers: () => Promise<void>
  fetchProfile: () => Promise<void>
  addPlayer: (player: Player) => void
  updatePlayerRating: (playerId: string, rating: number) => void
  addPlayerNote: (playerId: string, note: string) => void
  addPlayerLabel: (playerId: string, label: string) => void
  clearError: () => void
  clearProfileError: () => void
}

export const useCoachStore = create<CoachState>((set, get) => ({
  activeTab: "players",
  players: [],
  profile: null,
  profileLoading: false,
  profileError: null,
  loading: false,
  error: null,

  setActiveTab: (tab: CoachTab) => {
    set({ activeTab: tab })
  },

  fetchPlayers: async () => {
    set({ loading: true, error: null })
    
    try {
      const response = await api.coaches.getFollowedPlayers()
      if (response.status) {
        const transformedPlayers: Player[] = response.data.map((player: FollowedPlayer) => ({
          id: player.hash_id,
          fullName: `${player.kids_fname} ${player.kids_lname}`,
          dob: player.kids_dob,
          grade: player.kids_graduating_class || "N/A",
          act: player.kids_act,
          sat: player.kids_sat,
          gpa: player.kids_gpa,
          position: "N/A", // This field is not in the API response
          state: "N/A", // This field is not in the API response
          rating: 0, // Default rating
          notes: [], // Default empty notes
          labels: [], // Default empty labels
          avatar: player.kids_avatar,
          email: player.kids_email,
          mobile: player.kids_mobile,
          highSchool: player.kids_high_school,
          graduatingClass: player.kids_graduating_class
        }))
        set({
          players: transformedPlayers,
          loading: false,
          error: null,
        })
      } else {
        set({
          loading: false,
          error: response.message || "Failed to fetch players",
        })
      }
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch players",
      })
    }
  },

  fetchProfile: async () => {
    set({ profileLoading: true, profileError: null })
    
    try {
      const response = await api.coaches.getProfile()
      if (response.status) {
        set({
          profile: response.data,
          profileLoading: false,
          profileError: null,
        })
      } else {
        set({
          profileLoading: false,
          profileError: response.message || "Failed to fetch profile",
        })
      }
    } catch (error) {
      set({
        profileLoading: false,
        profileError: error instanceof Error ? error.message : "Failed to fetch profile",
      })
    }
  },

  addPlayer: (player: Player) => {
    set((state) => ({
      players: [...state.players, player]
    }))
  },

  updatePlayerRating: (playerId: string, rating: number) => {
    set((state) => ({
      players: state.players.map(player => 
        player.id === playerId ? { ...player, rating } : player
      )
    }))
  },

  addPlayerNote: (playerId: string, note: string) => {
    set((state) => ({
      players: state.players.map(player => 
        player.id === playerId 
          ? { ...player, notes: [...player.notes, note] }
          : player
      )
    }))
  },

  addPlayerLabel: (playerId: string, label: string) => {
    set((state) => ({
      players: state.players.map(player => 
        player.id === playerId 
          ? { ...player, labels: [...player.labels, label] }
          : player
      )
    }))
  },

  clearError: () => {
    set({ error: null })
  },

  clearProfileError: () => {
    set({ profileError: null })
  },
})) 