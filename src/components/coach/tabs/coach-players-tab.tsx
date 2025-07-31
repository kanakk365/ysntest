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
import { Event as ApiEvent } from "@/lib/api";

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

  // Transform API events to calendar format
  useEffect(() => {
    if (events.length > 0) {
      const calendarData: CalendarData[] = [];
      
      events.forEach((apiEvent: ApiEvent) => {
        try {
          // Create a proper datetime string
          const dateTimeString = `${apiEvent.event_start_date}T${apiEvent.event_start_time}`;
          const eventDate = new Date(dateTimeString);
          
          // Validate the date
          if (isNaN(eventDate.getTime())) {
            console.warn('Invalid date for event:', apiEvent.event_id, dateTimeString);
            return;
          }
          
          const eventTime = eventDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
          
          const calendarEvent: CalendarEvent = {
            id: apiEvent.event_id,
            name: apiEvent.event_name,
            time: eventTime,
            datetime: dateTimeString
          };

          const existingDay = calendarData.find(d => d.day.toDateString() === eventDate.toDateString());
          
          if (existingDay) {
            existingDay.events.push(calendarEvent);
          } else {
            calendarData.push({
              day: eventDate,
              events: [calendarEvent]
            });
          }
        } catch (error) {
          console.error('Error processing event:', apiEvent.event_id, error);
        }
      });
      
      setCalendarData(calendarData);
    } else {
      setCalendarData([]);
    }
  }, [events]);

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

  const handleEditEvent = async (event: CalendarEvent) => {
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
    
    // Find the original API event to get the hash_id
    const originalEvent = events.find(e => e.event_id === event.id);
    if (!originalEvent) return;
    
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
     
     // Update API event data
     const apiEventData = {
       event_id: event.id,
       event_name: event.name,
       event_enty_id: originalEvent.event_enty_id,
       event_start_date: formattedDate,
       event_start_time: formattedTime,
       event_end_date: endFormattedDate,
       event_end_time: endFormattedTime,
       event_is_recur: event.isRecur ? 1 : 0,
       event_is_allday: event.isAllDay ? 1 : 0,
       event_url: event.eventUrl || originalEvent.event_url,
       event_location: event.location || originalEvent.event_location,
       event_desc: event.description || originalEvent.event_desc,
       event_status: originalEvent.event_status
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
        <Card className="bg-card border-border h-screen">
          <CardContent className="h-full">
            {eventsLoading && calendarData.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Loading events...</span>
              </div>
            ) : eventsError ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <p className="text-red-500">{eventsError}</p>
                <button 
                  onClick={() => fetchEvents()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <FullScreenCalendar
                data={calendarData}
                onAddEvent={handleAddEvent}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
