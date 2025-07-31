"use client"

import { useState, useEffect } from "react"
import { FullScreenCalendar } from "@/components/coach/dashboard/full-screen-calendar"
import { useEventsStore } from "@/lib/events-store"
import { Event as ApiEvent } from "@/lib/api"

interface CalendarEvent {
  id: number
  name: string
  time: string
  datetime: string
}

interface CalendarData {
  day: Date
  events: CalendarEvent[]
}

export function CoachCalendarTab() {
  const { events, loading, error, fetchEvents, createUpdateEvent, deleteEvent } = useEventsStore()
  const [data, setData] = useState<CalendarData[]>([])
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // Transform API events to calendar format
  useEffect(() => {
    if (events.length > 0) {
      const calendarData: CalendarData[] = []
      
      events.forEach((apiEvent: ApiEvent) => {
        const eventDate = new Date(`${apiEvent.event_start_date}T${apiEvent.event_start_time}`)
        const eventTime = new Date(`${apiEvent.event_start_date}T${apiEvent.event_start_time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
        
        const calendarEvent: CalendarEvent = {
          id: apiEvent.event_id,
          name: apiEvent.event_name,
          time: eventTime,
          datetime: `${apiEvent.event_start_date}T${apiEvent.event_start_time}`
        }

        const existingDay = calendarData.find(d => d.day.toDateString() === eventDate.toDateString())
        
        if (existingDay) {
          existingDay.events.push(calendarEvent)
        } else {
          calendarData.push({
            day: eventDate,
            events: [calendarEvent]
          })
        }
      })
      
      setData(calendarData)
    } else {
      setData([])
    }
  }, [events])

  const handleAddEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    const eventDate = new Date(event.datetime)
    
    // Create API event data
    const apiEventData = {
      event_name: event.name,
      event_enty_id: 1, // Default event type ID
      event_start_date: eventDate.toISOString().split('T')[0],
      event_start_time: eventDate.toTimeString().split(' ')[0],
      event_end_date: eventDate.toISOString().split('T')[0],
      event_end_time: eventDate.toTimeString().split(' ')[0],
      event_is_recur: 0,
      event_is_allday: 0,
      event_url: "",
      event_location: "",
      event_desc: "",
      event_status: 1
    }

    await createUpdateEvent(apiEventData)
  }

  const handleEditEvent = async (event: CalendarEvent) => {
    const eventDate = new Date(event.datetime)
    
    // Find the original API event to get the hash_id
    const originalEvent = events.find(e => e.event_id === event.id)
    if (!originalEvent) return
    
    // Update API event data
    const apiEventData = {
      event_id: event.id,
      event_name: event.name,
      event_enty_id: originalEvent.event_enty_id,
      event_start_date: eventDate.toISOString().split('T')[0],
      event_start_time: eventDate.toTimeString().split(' ')[0],
      event_end_date: eventDate.toISOString().split('T')[0],
      event_end_time: eventDate.toTimeString().split(' ')[0],
      event_is_recur: originalEvent.event_is_recur,
      event_is_allday: originalEvent.event_is_allday,
      event_url: originalEvent.event_url,
      event_location: originalEvent.event_location,
      event_desc: originalEvent.event_desc,
      event_status: originalEvent.event_status
    }

    await createUpdateEvent(apiEventData)
  }

  const handleDeleteEvent = async (eventId: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      // Find the original API event to get the hash_id
      const originalEvent = events.find(e => e.event_id === eventId)
      if (!originalEvent) return
      
      await deleteEvent({ deletedId: originalEvent.hash_id })
    }
  }

  if (loading && data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading events...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => fetchEvents()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <FullScreenCalendar 
      data={data} 
      onAddEvent={handleAddEvent}
      onEditEvent={handleEditEvent}
      onDeleteEvent={handleDeleteEvent}
    />
  )
}