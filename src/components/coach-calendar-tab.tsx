"use client"

import { useState } from "react"
import { FullScreenCalendar } from "@/components/full-screen-calendar"

interface Event {
  id: number
  name: string
  time: string
  datetime: string
}

interface CalendarData {
  day: Date
  events: Event[]
}

const initialData: CalendarData[] = [
  {
    day: new Date("2024-07-28T10:00:00.000Z"),
    events: [
      { id: 1, name: "Design Review", time: "10:00 AM", datetime: "2024-07-28T10:00:00.000Z" },
      { id: 2, name: "Team Sync", time: "2:00 PM", datetime: "2024-07-28T14:00:00.000Z" },
    ],
  },
  {
    day: new Date("2024-07-12T10:00:00.000Z"),
    events: [{ id: 3, name: "Product Demo", time: "1:00 PM", datetime: "2024-07-12T13:00:00.000Z" }],
  },
  // Add more data as needed
]

export function CoachCalendarTab() {
  const [data, setData] = useState(initialData)

  const handleAddEvent = (event: Omit<Event, 'id'>) => {
    const newEvent = { ...event, id: Date.now() }
    const eventDate = new Date(newEvent.datetime)
    const existingDay = data.find(d => d.day.toDateString() === eventDate.toDateString())

    if (existingDay) {
      setData(data.map(d => d.day.toDateString() === eventDate.toDateString() ? { ...d, events: [...d.events, newEvent] } : d))
    } else {
      setData([...data, { day: eventDate, events: [newEvent] }])
    }
  }

  return <FullScreenCalendar data={data} onAddEvent={handleAddEvent} />
}