import { create } from 'zustand'
import { api, Event, EventCreateUpdateRequest, EventDeleteRequest } from './api'

interface EventsState {
  events: Event[]
  loading: boolean
  error: string | null
  fetchEvents: () => Promise<void>
  createUpdateEvent: (data: EventCreateUpdateRequest) => Promise<void>
  deleteEvent: (data: EventDeleteRequest) => Promise<void>
  clearError: () => void
}

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async () => {
    set({ loading: true, error: null })
    
    try {
      const response = await api.coaches.getEvents()
      if (response.status) {
        set({
          events: response.data,
          loading: false,
          error: null,
        })
      } else {
        set({
          loading: false,
          error: response.message || "Failed to fetch events",
        })
      }
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch events",
      })
    }
  },

  createUpdateEvent: async (data: EventCreateUpdateRequest) => {
    set({ loading: true, error: null })
    
    try {
      const response = await api.coaches.createUpdateEvent(data)
      if (response.status) {
        // Refresh events after creating/updating
        await get().fetchEvents()
      } else {
        set({
          loading: false,
          error: response.message || "Failed to save event",
        })
      }
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to save event",
      })
    }
  },

  deleteEvent: async (data: EventDeleteRequest) => {
    set({ loading: true, error: null })
    
    try {
      const response = await api.coaches.deleteEvent(data)
      if (response.status) {
        // Refresh events after deleting
        await get().fetchEvents()
      } else {
        set({
          loading: false,
          error: response.message || "Failed to delete event",
        })
      }
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to delete event",
      })
    }
  },

  clearError: () => {
    set({ error: null })
  },
})) 