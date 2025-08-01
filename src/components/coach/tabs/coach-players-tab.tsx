"use client";

import { useState, useEffect } from "react";
import { useCoachStore } from "@/lib/coach-store";
import { useEventsStore } from "@/lib/events-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Star,
  Search,
  Edit,
  Calendar,
  MapPin,
  GraduationCap,
  BookOpen,
  Calculator,
  Award,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { FullScreenCalendar } from "@/components/coach/dashboard/full-screen-calendar";
import { MyCalender } from "@/components/coach/dashboard/MyCalender";
import { Event as ApiEvent } from "@/lib/api";
import type { EventClickArg } from "@fullcalendar/core";

interface Player {
  id: string;
  fullName: string;
  dob: string;
  grade: string;
  act: number | null;
  sat: number | null;
  gpa: number | null;
  position: string;
  state: string;
  rating: number;
  notes: string[];
  labels: string[];
  avatar?: string;
  email?: string;
  mobile?: string | null;
  highSchool?: string | null;
  graduatingClass?: string | null;
}

interface CalendarEvent {
  id: number;
  name: string;
  time: string;
  datetime: string;
  endDate?: string;
  endTime?: string;
  isRecur?: boolean;
  isAllDay?: boolean;
  eventUrl?: string;
  location?: string;
  description?: string;
}

interface CalendarData {
  day: Date;
  events: CalendarEvent[];
}

export function CoachesTab() {
  const {
    players,
    loading,
    error,
    fetchPlayers,
    updatePlayerRating,
    addPlayerNote,
    addPlayerLabel,
    setActiveTab,
  } = useCoachStore();

  const { events, loading: eventsLoading, error: eventsError, fetchEvents, createUpdateEvent, deleteEvent } = useEventsStore();

  // Calendar state for MyCalender component
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
    location: "",
    className: "blue"
  });

  // Fetch players and events on component mount
  useEffect(() => {
    fetchPlayers();
    fetchEvents();
  }, [fetchPlayers, fetchEvents]);

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [newNote, setNewNote] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [showLabelDialog, setShowLabelDialog] = useState(false);
  const [calendarData, setCalendarData] = useState<CalendarData[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleRatingChange = (playerId: string, newRating: number) => {
    updatePlayerRating(playerId, newRating);
  };

  const handleAddNote = (playerId: string) => {
    if (newNote.trim()) {
      addPlayerNote(playerId, newNote.trim());
      setNewNote("");
      setShowNoteDialog(false);
    }
  };

  const handleAddLabel = (playerId: string) => {
    if (newLabel.trim()) {
      addPlayerLabel(playerId, newLabel.trim());
      setNewLabel("");
      setShowLabelDialog(false);
    }
  };

  const handleSearchPlayers = () => {
    setActiveTab("search");
  };

  // Transform API events to MyCalender format
  const transformEventsForCalendar = () => {
    return events.map((apiEvent: ApiEvent) => {
      try {
        // Create start datetime string
        const startDateTime = `${apiEvent.event_start_date}T${apiEvent.event_start_time}`;
        const endDateTime = `${apiEvent.event_end_date}T${apiEvent.event_end_time}`;
        
        // Determine color class based on event type or use default
        let className = "blue";
        if (apiEvent.event_type_name) {
          const typeName = apiEvent.event_type_name.toLowerCase();
          if (typeName.includes('game') || typeName.includes('match')) className = "red";
          else if (typeName.includes('practice') || typeName.includes('training')) className = "blue";
          else if (typeName.includes('meeting')) className = "green";
          else if (typeName.includes('workshop')) className = "orange";
        }

        // Ensure consistent ID type - convert to string to avoid type mismatches
        const eventId = String(apiEvent.event_id);

        return {
          id: eventId,
          title: apiEvent.event_name,
          start: startDateTime,
          end: endDateTime,
          description: apiEvent.event_desc || "",
          location: apiEvent.event_location || "",
          className: className,
          // Store original API event for reference
          originalEvent: apiEvent
        };
      } catch (error) {
        console.error('Error transforming event:', apiEvent.event_id, error);
        return null;
      }
    }).filter((event): event is NonNullable<typeof event> => event !== null); // Remove any null events
  };

  const handleAddEvent = async (event: Omit<CalendarEvent, "id">) => {
    // Parse the datetime string more safely
    let eventDate: Date;
    try {
      // Clean up the datetime string to handle potential format issues
      let cleanDateTime = event.datetime;
      
      // Remove any extra colons in the time part
      if (cleanDateTime.includes('::')) {
        cleanDateTime = cleanDateTime.replace('::', ':');
      }
      
      // Handle both formats: YYYY-MM-DDTHH:MM:SS.000Z and YYYY-MM-DDTHH:MM.000Z
      const dateTimeMatch = cleanDateTime.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::(\d{2}))?\.000Z$/);
      if (dateTimeMatch) {
        const [, date, time, seconds] = dateTimeMatch;
        // If seconds are missing, add :00
        cleanDateTime = `${date}T${time}:${seconds || '00'}.000Z`;
      }
      
      eventDate = new Date(cleanDateTime);
      if (isNaN(eventDate.getTime())) {
        throw new Error('Invalid date after cleanup');
      }
    } catch (error) {
      console.error('Error parsing date:', event.datetime, error);
      return;
    }
    
    // Format date and time safely
    const year = eventDate.getFullYear();
    const month = String(eventDate.getMonth() + 1).padStart(2, '0');
    const day = String(eventDate.getDate()).padStart(2, '0');
    const hours = String(eventDate.getHours()).padStart(2, '0');
    const minutes = String(eventDate.getMinutes()).padStart(2, '0');
    const seconds = String(eventDate.getSeconds()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    
         // Format end date and time if provided, otherwise use start date/time
     let endFormattedDate = formattedDate;
     let endFormattedTime = formattedTime;
     
     if (event.endDate && event.endTime) {
       try {
         const endDateTime = new Date(`${event.endDate}T${event.endTime}`);
         if (!isNaN(endDateTime.getTime())) {
           const endYear = endDateTime.getFullYear();
           const endMonth = String(endDateTime.getMonth() + 1).padStart(2, '0');
           const endDay = String(endDateTime.getDate()).padStart(2, '0');
           const endHours = String(endDateTime.getHours()).padStart(2, '0');
           const endMinutes = String(endDateTime.getMinutes()).padStart(2, '0');
           const endSeconds = String(endDateTime.getSeconds()).padStart(2, '0');
           
           endFormattedDate = `${endYear}-${endMonth}-${endDay}`;
           endFormattedTime = `${endHours}:${endMinutes}:${endSeconds}`;
         }
       } catch (error) {
         console.error('Error parsing end date/time:', error);
       }
     }
     
     // Create API event data
     const apiEventData = {
       event_name: event.name,
       event_enty_id: 1, // Default event type ID
       event_start_date: formattedDate,
       event_start_time: formattedTime,
       event_end_date: endFormattedDate,
       event_end_time: endFormattedTime,
       event_is_recur: event.isRecur ? 1 : 0,
       event_is_allday: event.isAllDay ? 1 : 0,
       event_url: event.eventUrl || "",
       event_location: event.location || "",
       event_desc: event.description || "",
       event_status: 1
     };

    await createUpdateEvent(apiEventData);
  };

  

  const handleDeleteEvent = async (eventId: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      // Find the original API event to get the hash_id
      const originalEvent = events.find(e => e.event_id === eventId);
      if (!originalEvent) return;
      
      await deleteEvent({ deletedId: originalEvent.hash_id });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Pagination calculations
  const totalPages = Math.ceil(players.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlayers = players.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Calendar event handlers for MyCalender
  const handleEventClick = (eventInfo: EventClickArg) => {
    console.log('=== Event Click Debug ===');
    console.log('Clicked event:', eventInfo.event);
    console.log('Clicked event ID:', eventInfo.event.id);
    console.log('Clicked event ID type:', typeof eventInfo.event.id);
    console.log('Clicked event title:', eventInfo.event.title);
    console.log('Clicked event extendedProps:', eventInfo.event.extendedProps);
    
    // Find the transformed event that contains the originalEvent property
    const transformedEvents = transformEventsForCalendar();
    console.log('All transformed events:', transformedEvents);
    console.log('Transformed event IDs:', transformedEvents.map(e => ({ id: e.id, idType: typeof e.id, title: e.title })));
    
    // Convert clicked event ID to string for consistent comparison
    const clickedEventId = String(eventInfo.event.id);
    console.log('Looking for event with ID:', clickedEventId);
    
    // Try to find the event by ID
    let transformedEvent = transformedEvents.find(e => String(e.id) === clickedEventId);
    console.log('Found by ID match:', transformedEvent);
    
    // If still not found, try by title
    if (!transformedEvent) {
      transformedEvent = transformedEvents.find(e => 
        e.title === eventInfo.event.title
      );
      console.log('Found by title match:', transformedEvent);
    }
    
    // If still not found, try by extendedProps
    if (!transformedEvent && eventInfo.event.extendedProps) {
      transformedEvent = transformedEvents.find(e => 
        e.id === eventInfo.event.extendedProps.id ||
        String(e.id) === String(eventInfo.event.extendedProps.id)
      );
      console.log('Found by extendedProps match:', transformedEvent);
    }
    
    console.log('Final transformed event:', transformedEvent);
    
    if (transformedEvent) {
      setSelectedEvent(transformedEvent);
      setModalOpen(true);
    } else {
      console.error('❌ Transformed event not found for:', eventInfo.event.id);
      console.error('Available event IDs:', transformedEvents.map(e => ({ id: e.id, title: e.title })));
    }
    console.log('=== End Event Click Debug ===');
  };

  const handleDelete = async (eventId: string | number) => {
    try {
      // Find the transformed event that contains the originalEvent property
      const transformedEvents = transformEventsForCalendar();
      
      // Convert eventId to string for consistent comparison
      const eventIdString = String(eventId);
      
      // Try to find the event by ID
      const transformedEvent = transformedEvents.find(e => String(e.id) === eventIdString);
      
      if (!transformedEvent || !transformedEvent.originalEvent) {
        console.error('Event not found for deletion:', eventId);
        console.error('Available event IDs:', transformedEvents.map(e => ({ id: e.id, title: e.title })));
        return;
      }
      
      await deleteEvent({ deletedId: transformedEvent.originalEvent.hash_id });
      setModalOpen(false);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleOpenModal = () => {
    // This would typically open an edit modal
    console.log("Edit event:", selectedEvent);
  };

  // Add edit event handler
  const handleEditEvent = async (eventData: any) => {
    try {
      // Check if we have the originalEvent property (from calendar click) or updated data (from modal edit)
      const originalEvent = eventData.originalEvent;
      
      if (!originalEvent) {
        console.error('Original event data not found for editing:', eventData.id);
        return;
      }

      // Parse the datetime strings
      const startDate = new Date(eventData.start);
      const endDate = new Date(eventData.end);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        alert('Please enter valid dates');
        return;
      }

      // Format dates for API
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formatTime = (date: Date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      };

      const apiEventData = {
        event_id: eventData.id,
        event_name: eventData.title,
        event_enty_id: originalEvent.event_enty_id,
        event_start_date: formatDate(startDate),
        event_start_time: formatTime(startDate),
        event_end_date: formatDate(endDate),
        event_end_time: formatTime(endDate),
        event_is_recur: originalEvent.event_is_recur,
        event_is_allday: originalEvent.event_is_allday,
        event_url: originalEvent.event_url,
        event_location: eventData.location || originalEvent.event_location,
        event_desc: eventData.description || originalEvent.event_desc,
        event_status: originalEvent.event_status
      };

      await createUpdateEvent(apiEventData);
      setModalOpen(false);
    } catch (error) {
      console.error('Error editing event:', error);
    }
  };

  // Add new event handler
  const handleAddNewEvent = async () => {
    try {
      // Parse the datetime strings
      const startDate = new Date(newEvent.start);
      const endDate = new Date(newEvent.end);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        alert('Please enter valid dates');
        return;
      }

      // Format dates for API
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formatTime = (date: Date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      };

      const apiEventData = {
        event_name: newEvent.title,
        event_enty_id: 1, // Default event type ID
        event_start_date: formatDate(startDate),
        event_start_time: formatTime(startDate),
        event_end_date: formatDate(endDate),
        event_end_time: formatTime(endDate),
        event_is_recur: 0,
        event_is_allday: 0,
        event_url: "",
        event_location: newEvent.location,
        event_desc: newEvent.description,
        event_status: 1
      };

      await createUpdateEvent(apiEventData);
      
      // Reset form
      setNewEvent({
        title: "",
        start: "",
        end: "",
        description: "",
        location: "",
        className: "blue"
      });
      setShowAddEventModal(false);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };



  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mt-5">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Players</h1>
          <p className="text-muted-foreground">Manage and track your players</p>
        </div>
        <Button onClick={handleSearchPlayers}>
          <Search className="h-4 w-4 mr-2" />
          Search Players
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">
            Players Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading players...</div>
            </div>
          )}
          
          {error && (
            <div className="flex items-center justify-center py-8">
              <div className="text-red-500">
                Error: {error}
                <Button 
                  onClick={fetchPlayers} 
                  variant="outline" 
                  className="ml-4"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}
          
          {!loading && !error && players.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">No players found</div>
            </div>
          )}
          
                    {!loading && !error && players.length > 0 && (
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rating</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>DOB</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>ACT</TableHead>
                    <TableHead>SAT</TableHead>
                    <TableHead>GPA</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPlayers.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={player.rating}
                            onChange={(e) =>
                              handleRatingChange(
                                player.id,
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-16 h-8 text-center"
                          />
                          <Star className="h-4 w-4 text-yellow-500" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {player.fullName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(player.dob)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {player.grade}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {player.act || "N/A"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {player.sat || "N/A"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {player.gpa || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{player.position}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {player.state}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog
                            open={showNoteDialog}
                            onOpenChange={setShowNoteDialog}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedPlayer(player)}
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Note
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Add Note for {player.fullName}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Note</Label>
                                  <Textarea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="Enter your note..."
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Previous Notes:</Label>
                                  <div className="space-y-1">
                                    {player.notes.map((note, index) => (
                                      <div
                                        key={index}
                                        className="p-2 bg-muted rounded text-sm text-muted-foreground"
                                      >
                                        {note}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <Button
                                  onClick={() => handleAddNote(player.id)}
                                  className="w-full"
                                >
                                  Add Note
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog
                            open={showLabelDialog}
                            onOpenChange={setShowLabelDialog}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedPlayer(player)}
                              >
                                <Award className="h-3 w-3 mr-1" />
                                Label
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Add Label for {player.fullName}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Label</Label>
                                  <Input
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)}
                                    placeholder="Enter label..."
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Current Labels:</Label>
                                  <div className="flex flex-wrap gap-2">
                                    {player.labels.map((label, index) => (
                                      <Badge key={index} variant="secondary">
                                        {label}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <Button
                                  onClick={() => handleAddLabel(player.id)}
                                  className="w-full"
                                >
                                  Add Label
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && !error && players.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, players.length)}{" "}
                of {players.length} players
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 mt-10 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Manage and track your Events</p>
        </div>

        {/* Calendar Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                My Schedule
              </CardTitle>
              <Button 
                onClick={() => setShowAddEventModal(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Add Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {eventsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Loading events...</div>
              </div>
            ) : eventsError ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-red-500">
                  Error: {eventsError}
                  <Button 
                    onClick={fetchEvents} 
                    variant="outline" 
                    className="ml-4"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            ) : (
                             <MyCalender
                 events={transformEventsForCalendar()}
                 modalOpen={modalOpen}
                 setModalOpen={setModalOpen}
                 handleEventClick={handleEventClick}
                 selectedEvent={selectedEvent}
                 handleDelete={handleDelete}
                 handleEdit={handleEditEvent}
                 handleOpenModal={handleOpenModal}
               />
            )}
          </CardContent>
        </Card>

        {/* Add Event Modal */}
        <Dialog open={showAddEventModal} onOpenChange={setShowAddEventModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Enter event title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="start">Start Date & Time</Label>
                <Input
                  id="start"
                  type="datetime-local"
                  value={newEvent.start}
                  onChange={(e) => setNewEvent({...newEvent, start: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end">End Date & Time</Label>
                <Input
                  id="end"
                  type="datetime-local"
                  value={newEvent.end}
                  onChange={(e) => setNewEvent({...newEvent, end: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  placeholder="Enter location"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Enter event description"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="className">Event Type</Label>
                <select
                  id="className"
                  value={newEvent.className}
                  onChange={(e) => setNewEvent({...newEvent, className: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="blue">Practice/Training</option>
                  <option value="green">Meeting</option>
                  <option value="red">Game/Match</option>
                  <option value="orange">Workshop</option>
                  <option value="yellow">Other</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddEventModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNewEvent} disabled={!newEvent.title || !newEvent.start || !newEvent.end}>
                Add Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
