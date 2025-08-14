import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg } from "@fullcalendar/core";
import ViewEventModal from "./ViewEventModal";
import { Event as ApiEvent } from "@/lib/api";

interface Event {
  id?: string | number;
  title?: string;
  event_name?: string;
  start?: string;
  end?: string;
  description?: string;
  location?: string;
  className?: string;
  [key: string]: unknown;
}

interface CalendarEventData {
  id?: string | number;
  event_id?: string | number;
  title?: string;
  event_name?: string;
  start?: string;
  end?: string;
  description?: string;
  location?: string;
  className?: string;
  isRecurring?: boolean;
  isAllDay?: boolean;
  originalEvent?: ApiEvent;
  [key: string]: unknown;
}

interface Props {
  events: Event[];
  setModalOpen: (open: boolean) => void;
  modalOpen: boolean;
  handleEventClick: (eventInfo: EventClickArg) => void;
  selectedEvent: CalendarEventData | null;
  handleDelete: (eventId: string | number) => void;
  handleEdit: (eventData: CalendarEventData) => void;
}

export const MyCalender = ({
  events,
  modalOpen,
  setModalOpen,
  handleEventClick,
  selectedEvent,
  handleDelete,
  handleEdit,
}: Props) => {
  
  const [currentView, setCurrentView] = useState<
    "dayGridMonth" | "timeGridWeek"
  >("dayGridMonth");
  const calendarRef = useRef<FullCalendar>(null);

  const moreLinkDidMount = (args: { el: HTMLElement }) => {
    const el = args.el as HTMLElement;

    let popoverCheckInterval: NodeJS.Timeout;

    const dayCell = el.closest(".fc-daygrid-day");
    const eventEls = dayCell?.querySelectorAll(".fc-event") || [];

    const classList = Array.from(eventEls).map((e) => e.className);

    const colorClass = classList.find(
      (cls) =>
        cls.includes("green") || cls.includes("blue") || cls.includes("orange")
    );

    if (colorClass?.includes("green")) el.classList.add("green");
    else if (colorClass?.includes("blue")) el.classList.add("blue");
    else if (colorClass?.includes("orange")) el.classList.add("orange");

    // Show popover on hover
    const tryAttachPopoverListener = () => {
      const popover = document.querySelector(".fc-popover");
      if (popover) {
        popover.addEventListener("mouseleave", () => {
          const closeBtn = popover.querySelector(
            ".fc-popover-close"
          ) as HTMLElement;
          closeBtn?.click();
        });
        clearInterval(popoverCheckInterval);
      }
    };

    el.addEventListener("mouseenter", () => {
      setTimeout(() => {
        el.click();
        popoverCheckInterval = setInterval(tryAttachPopoverListener, 100);
      }, 100);
    });

    el.addEventListener("mouseleave", () => {
      setTimeout(() => {
        const popover = document.querySelector(".fc-popover");
        if (popover && !popover.matches(":hover")) {
          const closeBtn = popover.querySelector(
            ".fc-popover-close"
          ) as HTMLElement;
          closeBtn?.click();
        }
      }, 300);
    });
  };

  const getColorClass = (color: string) => {
    switch (color.toLowerCase()) {
      case "#28a745":
      case "green":
        return "green";
      case "#007bff":
      case "blue":
        return "blue";
      case "#f25822":
      case "orange":
        return "orange";
      case "yellow":
        return "yellow";
      case "red":
        return "red";
      default:
        return "";
    }
  };



  return (
    <>
      <div className="h-full bg-background text-foreground rounded-lg border border-border">
        <div className="custom-dark-calendar p-4">
         

          <FullCalendar
            ref={calendarRef}
            dayMaxEvents={currentView === "dayGridMonth" ? 1 : undefined}
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            initialView={currentView}
            height="auto"
            events={events.map((e: Event) => {
              console.log('Processing event for calendar:', e);
              return {
                ...e,
                className: getColorClass(e.className || ""),
                // Ensure the ID is preserved as a string
                id: String(e.id),
              };
            })}
            editable={false}
            selectable={true}
            showNonCurrentDates={false}
            fixedWeekCount={false}
            eventClick={handleEventClick}
            moreLinkDidMount={moreLinkDidMount}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={true}
            slotDuration="00:30:00"
          />
          {selectedEvent && (
            <ViewEventModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              eventData={selectedEvent}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          )}
        </div>
      </div>
    </>
  );
};
