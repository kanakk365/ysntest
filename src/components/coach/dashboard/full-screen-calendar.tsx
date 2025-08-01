"use client"

import * as React from "react"
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns"
import { ChevronLeftIcon, ChevronRightIcon, Plus, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

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

interface FullScreenCalendarProps {
  data: CalendarData[],
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (eventId: number) => void;
}

const colStartClasses = ["", "col-start-2", "col-start-3", "col-start-4", "col-start-5", "col-start-6", "col-start-7"]

export function FullScreenCalendar({ data, onAddEvent, onEditEvent, onDeleteEvent }: FullScreenCalendarProps) {
  const today = startOfToday()
  const [selectedDay, setSelectedDay] = React.useState(today)
  const [currentMonth, setCurrentMonth] = React.useState(format(today, "MMM-yyyy"))
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    isRecur: false,
    isAllDay: false,
    eventUrl: "",
    location: "",
    description: ""
  })

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  })

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function goToToday() {
    setCurrentMonth(format(today, "MMM-yyyy"))
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    const eventDate = new Date(event.datetime)
    setFormData({
      name: event.name,
      startDate: eventDate.toISOString().split('T')[0],
      startTime: eventDate.toTimeString().split(' ')[0],
      endDate: eventDate.toISOString().split('T')[0], // Default to same date
      endTime: eventDate.toTimeString().split(' ')[0], // Default to same time
      isRecur: false,
      isAllDay: false,
      eventUrl: "",
      location: "",
      description: ""
    })
    setIsDialogOpen(true)
  }

  const handleSaveEvent = () => {
    if (formData.name && formData.startDate && formData.startTime) {
      // Create a proper datetime string without the extra :00
      const eventData = {
        name: formData.name,
        time: new Date(`${formData.startDate}T${formData.startTime}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        datetime: `${formData.startDate}T${formData.startTime}.000Z`,
        // Additional event data
        endDate: formData.endDate || formData.startDate,
        endTime: formData.endTime || formData.startTime,
        isRecur: formData.isRecur,
        isAllDay: formData.isAllDay,
        eventUrl: formData.eventUrl,
        location: formData.location,
        description: formData.description
      }

      if (editingEvent) {
        onEditEvent?.({ ...eventData, id: editingEvent.id })
      } else {
        onAddEvent(eventData)
      }

      // Reset form
      setFormData({ 
        name: "", 
        startDate: "", 
        startTime: "", 
        endDate: "", 
        endTime: "", 
        isRecur: false, 
        isAllDay: false, 
        eventUrl: "", 
        location: "", 
        description: "" 
      })
      setEditingEvent(null)
      setIsDialogOpen(false)
    }
  }

  const handleOpenAddDialog = () => {
    setEditingEvent(null)
    setFormData({ 
      name: "", 
      startDate: "", 
      startTime: "", 
      endDate: "", 
      endTime: "", 
      isRecur: false, 
      isAllDay: false, 
      eventUrl: "", 
      location: "", 
      description: "" 
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="flex flex-1 w-full h-full flex-col max-w-7xl mx-auto">
      {/* Calendar Header */}
      <div className="flex flex-col space-y-4 p-4 md:flex-row md:items-center md:justify-between md:space-y-0 lg:flex-none">
        <div className="flex flex-auto">
          <div className="flex items-center gap-4">
            <div className="hidden w-20 flex-col items-center justify-center rounded-lg border bg-muted p-0.5 md:flex">
              <h1 className="p-1 text-xs uppercase text-muted-foreground">{format(today, "MMM")}</h1>
              <div className="flex w-full items-center justify-center rounded-lg border bg-background p-0.5 text-lg font-bold">
                <span>{format(today, "d")}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-foreground">{format(firstDayCurrentMonth, "MMMM, yyyy")}</h2>
              <p className="text-sm text-muted-foreground">
                {format(firstDayCurrentMonth, "MMM d, yyyy")} -{" "}
                {format(endOfMonth(firstDayCurrentMonth), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <Button variant="outline" size="icon" className="hidden lg:flex">
            <Search size={16} strokeWidth={2} aria-hidden="true" />
          </Button>

          <Separator orientation="vertical" className="hidden h-6 lg:block" />

          <div className="inline-flex w-full -space-x-px rounded-lg shadow-sm shadow-black/5 md:w-auto rtl:space-x-reverse">
            <Button
              onClick={previousMonth}
              className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
              variant="outline"
              size="icon"
              aria-label="Navigate to previous month"
            >
              <ChevronLeftIcon size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
            <Button
              onClick={goToToday}
              className="w-full rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 md:w-auto"
              variant="outline"
            >
              Today
            </Button>
            <Button
              onClick={nextMonth}
              className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
              variant="outline"
              size="icon"
              aria-label="Navigate to next month"
            >
              <ChevronRightIcon size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>

          <Separator orientation="vertical" className="hidden h-6 md:block" />
          <Separator orientation="horizontal" className="block w-full md:hidden" />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
                         <DialogContent className="max-w-md">
               <DialogHeader>
                 <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
               </DialogHeader>
               <div className="space-y-4">
                 <div>
                   <Label>Event Name *</Label>
                   <Input
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                     placeholder="Enter event name"
                   />
                 </div>
                 
                 <div className="grid grid-cols-4 gap-4">
                   <div>
                     <Label>Start Date *</Label>
                     <Input
                       type="date"
                       value={formData.startDate}
                       onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                     />
                   </div>
                   <div>
                     <Label>Start Time *</Label>
                     <Input
                       type="time"
                       value={formData.startTime}
                       onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                     />
                   </div>
                   <div>
                     <Label>End Date</Label>
                     <Input
                       type="date"
                       value={formData.endDate}
                       onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                     />
                   </div>
                   <div>
                     <Label>End Time</Label>
                     <Input
                       type="time"
                       value={formData.endTime}
                       onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                     />
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       id="isRecur"
                       checked={formData.isRecur}
                       onChange={(e) => setFormData({...formData, isRecur: e.target.checked})}
                       className="rounded border-gray-300"
                     />
                     <Label htmlFor="isRecur">Recurring Event</Label>
                   </div>
                   <div className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       id="isAllDay"
                       checked={formData.isAllDay}
                       onChange={(e) => setFormData({...formData, isAllDay: e.target.checked})}
                       className="rounded border-gray-300"
                     />
                     <Label htmlFor="isAllDay">All Day Event</Label>
                   </div>
                 </div>
                 
                 <div>
                   <Label>Event URL</Label>
                   <Input
                     value={formData.eventUrl}
                     onChange={(e) => setFormData({...formData, eventUrl: e.target.value})}
                     placeholder="https://example.com"
                     type="url"
                   />
                 </div>
                 
                 <div>
                   <Label>Location</Label>
                   <Input
                     value={formData.location}
                     onChange={(e) => setFormData({...formData, location: e.target.value})}
                     placeholder="Enter event location"
                   />
                 </div>
                 
                 <div>
                   <Label>Description</Label>
                   <Textarea
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     placeholder="Enter event description"
                     rows={3}
                   />
                 </div>
                 
                 <Button onClick={handleSaveEvent} className="w-full">
                   {editingEvent ? 'Update Event' : 'Add Event'}
                 </Button>
               </div>
             </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="lg:flex lg:flex-auto lg:flex-col">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 border text-center text-xs font-semibold leading-6 lg:flex-none">
          <div className="border-r py-2.5">Sun</div>
          <div className="border-r py-2.5">Mon</div>
          <div className="border-r py-2.5">Tue</div>
          <div className="border-r py-2.5">Wed</div>
          <div className="border-r py-2.5">Thu</div>
          <div className="border-r py-2.5">Fri</div>
          <div className="py-2.5">Sat</div>
        </div>

        {/* Calendar Days */}
        <div className="flex text-xs leading-6 lg:flex-auto">
          <div className="hidden w-full border-x lg:grid lg:grid-cols-7 lg:grid-rows-5">
            {days.map((day, dayIdx) =>
              !isDesktop ? (
                <button
                  onClick={() => setSelectedDay(day)}
                  key={dayIdx}
                  type="button"
                  className={cn(
                    isEqual(day, selectedDay) && "text-primary-foreground",
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      isSameMonth(day, firstDayCurrentMonth) &&
                      "text-foreground",
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      !isSameMonth(day, firstDayCurrentMonth) &&
                      "text-muted-foreground",
                    (isEqual(day, selectedDay) || isToday(day)) && "font-semibold",
                    "flex h-14 flex-col border-b border-r px-3 py-2 hover:bg-muted focus:z-10",
                  )}
                >
                  <time
                    dateTime={format(day, "yyyy-MM-dd")}
                    className={cn(
                      "ml-auto flex size-6 items-center justify-center rounded-full",
                      isEqual(day, selectedDay) && isToday(day) && "bg-primary text-primary-foreground",
                      isEqual(day, selectedDay) && !isToday(day) && "bg-primary text-primary-foreground",
                    )}
                  >
                    {format(day, "d")}
                  </time>
                  {data.filter((date) => isSameDay(date.day, day)).length > 0 && (
                    <div>
                      {data
                        .filter((date) => isSameDay(date.day, day))
                        .map((date) => (
                          <div key={date.day.toString()} className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                            {date.events.map((event) => (
                              <span
                                key={event.id}
                                className="mx-0.5 mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground"
                              />
                            ))}
                          </div>
                        ))}
                    </div>
                  )}
                </button>
              ) : (
                <div
                  key={dayIdx}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    dayIdx === 0 && colStartClasses[getDay(day)],
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      !isSameMonth(day, firstDayCurrentMonth) &&
                      "bg-accent/50 text-muted-foreground",
                    "relative flex flex-col border-b border-r hover:bg-muted focus:z-10",
                    !isEqual(day, selectedDay) && "hover:bg-accent/75",
                  )}
                >
                  <header className="flex items-center justify-between p-2.5">
                    <button
                      type="button"
                      className={cn(
                        isEqual(day, selectedDay) && "text-primary-foreground",
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          isSameMonth(day, firstDayCurrentMonth) &&
                          "text-foreground",
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          !isSameMonth(day, firstDayCurrentMonth) &&
                          "text-muted-foreground",
                        isEqual(day, selectedDay) && isToday(day) && "border-none bg-primary",
                        isEqual(day, selectedDay) && !isToday(day) && "bg-foreground",
                        (isEqual(day, selectedDay) || isToday(day)) && "font-semibold",
                        "flex h-7 w-7 items-center justify-center rounded-full text-xs hover:border",
                      )}
                    >
                      <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
                    </button>
                  </header>
                  <div className="flex-1 p-2.5">
                    {data
                      .filter((event) => isSameDay(event.day, day))
                      .map((day) => (
                        <div key={day.day.toString()} className="space-y-1.5">
                          {day.events.slice(0, 1).map((event) => (
                            <div
                              key={event.id}
                              className="flex flex-col items-start gap-1 rounded-lg border bg-muted/50 p-2 text-xs leading-tight hover:bg-muted/75 cursor-pointer group"
                              onClick={() => handleEditEvent(event)}
                            >
                              <div className="flex items-center justify-between w-full">
                                <p className="font-medium leading-none">{event.name}</p>
                                {onDeleteEvent && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onDeleteEvent(event.id)
                                    }}
                                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                              <p className="leading-none text-muted-foreground">{event.time}</p>
                            </div>
                          ))}
                          {day.events.length > 1 && (
                            <div className="text-xs text-muted-foreground">+ {day.events.length - 1} more</div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="isolate grid w-full grid-cols-7 grid-rows-5 border-x lg:hidden">
            {days.map((day, dayIdx) => (
              <button
                onClick={() => setSelectedDay(day)}
                key={dayIdx}
                type="button"
                className={cn(
                  isEqual(day, selectedDay) && "text-primary-foreground",
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    isSameMonth(day, firstDayCurrentMonth) &&
                    "text-foreground",
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    !isSameMonth(day, firstDayCurrentMonth) &&
                    "text-muted-foreground",
                  (isEqual(day, selectedDay) || isToday(day)) && "font-semibold",
                  "flex h-14 flex-col border-b border-r px-3 py-2 hover:bg-muted focus:z-10",
                )}
              >
                <time
                  dateTime={format(day, "yyyy-MM-dd")}
                  className={cn(
                    "ml-auto flex size-6 items-center justify-center rounded-full",
                    isEqual(day, selectedDay) && isToday(day) && "bg-primary text-primary-foreground",
                    isEqual(day, selectedDay) && !isToday(day) && "bg-primary text-primary-foreground",
                  )}
                >
                  {format(day, "d")}
                </time>
                {data.filter((date) => isSameDay(date.day, day)).length > 0 && (
                  <div>
                    {data
                      .filter((date) => isSameDay(date.day, day))
                      .map((date) => (
                        <div key={date.day.toString()} className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                          {date.events.map((event) => (
                            <span key={event.id} className="mx-0.5 mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                          ))}
                        </div>
                      ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}