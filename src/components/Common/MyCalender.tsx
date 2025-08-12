"use client";

import React, { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg } from "@fullcalendar/core";
import ViewEventModal from "@/components/coach/dashboard/ViewEventModal";

type BasicEvent = {
  id?: string | number;
  event_id?: string | number;
  title?: string;
  event_name?: string;
  start?: string;
  end?: string;
  state_date_time?: string;
  end_date_time?: string;
  description?: string;
  location?: string;
  className?: string;
  [key: string]: unknown;
};

type CalendarEventData = {
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
  [key: string]: unknown;
};

interface Props {
  events: BasicEvent[];
  setModalOpen: (open: boolean) => void;
  modalOpen: boolean;
  handleEventClick: (eventInfo: EventClickArg) => void;
  selectedEvent: CalendarEventData | null;
  handleDelete: (eventId: string | number) => void;
  handleEdit: (eventData: CalendarEventData) => void;
}

export const MyCalender: React.FC<Props> = ({
  events,
  modalOpen,
  setModalOpen,
  handleEventClick,
  selectedEvent,
  handleDelete,
  handleEdit,
}) => {
  const calendarRef = useRef<FullCalendar>(null);

  const moreLinkDidMount = (args: { el: HTMLElement }) => {
    const el = args.el as HTMLElement;

    let popoverCheckInterval: ReturnType<typeof setInterval>;

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

  const getColorClass = (color?: string) => {
    if (!color) return "";
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
    <div className="h-full xl:min-h-screen bg-[#0B0B18] md:p-6 text-white rounded-2xl">
      <div className="custom-dark-calendar">
        <FullCalendar
          ref={calendarRef}
          dayMaxEvents={1}
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          height="auto"
          events={events.map((e) => ({
            ...e,
            className: getColorClass(String(e.className || "")),
            // Ensure id is a string for FullCalendar
            id: String(e.id ?? e.event_id ?? ""),
            start: e.start ?? e.state_date_time,
            end: e.end ?? e.end_date_time,
            title: e.title ?? e.event_name,
          }))}
          editable={false}
          selectable={true}
          showNonCurrentDates={false}
          fixedWeekCount={false}
          eventClick={handleEventClick}
          moreLinkDidMount={moreLinkDidMount}
        />
        {selectedEvent && (
          <ViewEventModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            eventData={selectedEvent}
            handleDelete={(eventId) => handleDelete(eventId)}
            handleEdit={(eventData) => handleEdit(eventData)}
          />
        )}
      </div>
    </div>
  );
};
