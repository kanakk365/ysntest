"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { MyCalender } from "@/components/Common/MyCalender";
import ShareModal from "@/components/Common/ShareModal";
import type { EventClickArg, EventApi } from "@fullcalendar/core";
import { cn } from "@/lib/utils";
import { EllipsisVertical, Pencil, Trash2, Share2 } from "lucide-react";

interface UpcomingMatchEvent {
  event_id?: string | number;
  id?: string | number;
  event_name?: string;
  title?: string;
  state_date_time?: string;
  end_date_time?: string;
  location?: string;
  time?: string;
  description?: string;
  className?: string;
  [key: string]: unknown;
}

interface UpcomingMatchProps {
  events?: UpcomingMatchEvent[];
  title?: string;
}

const UpcomingMatch: React.FC<UpcomingMatchProps> = ({
  events = [],
  title,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<UpcomingMatchEvent | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );
  const leftColRef = useRef<HTMLDivElement>(null);
  const [leftHeight, setLeftHeight] = useState<number | undefined>(undefined);

  const handleEventClick = (info: EventClickArg | UpcomingMatchEvent) => {
    const isFcArg = (i: unknown): i is EventClickArg =>
      !!i && typeof i === "object" && "event" in (i as Record<string, unknown>);

    if (isFcArg(info)) {
      const apiEvent: EventApi = info.event;
      const props = apiEvent.extendedProps as Record<string, unknown>;
      setSelectedEvent({
        title: apiEvent.title || (props["event_name"] as string | undefined),
        state_date_time: props["state_date_time"] as string | undefined,
        end_date_time: props["end_date_time"] as string | undefined,
        location: props["location"] as string | undefined,
        time: props["time"] as string | undefined,
        description: props["description"] as string | undefined,
        className: props["className"] as string | undefined,
        id: apiEvent.id as string | number | undefined,
        event_id: props["event_id"] as string | number | undefined,
      });
    } else {
      const evt = info as UpcomingMatchEvent;
      setSelectedEvent({
        title: evt.title || evt.event_name,
        state_date_time: evt.state_date_time,
        end_date_time: evt.end_date_time,
        location: evt.location,
        time: evt.time,
        description: evt.description,
        className: evt.className,
        id: evt.id ?? evt.event_id,
        event_id: evt.event_id,
      });
    }
    setModalOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!leftColRef.current) return;
    const element = leftColRef.current;
    const measure = () => setLeftHeight(element.offsetHeight);
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(element);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const handleDelete = (id: string | number) => {
    void id;
    // Placeholder: integrate with your events store/API if needed
    // No setter since events are props; in real usage, call a callback or store action
    setOpenDropdownIndex(null);
    setModalOpen(false);
  };

  const handleEdit = (evt: unknown) => {
    void evt;
    // Hook into your store update here; keeping noop for now
    setOpenDropdownIndex(null);
  };

  return (
    <div className="relative ">
      <div
        className="h-full xl:min-h-screen bg-black text-white font-sans"
        id="events_section"
      >
        {/* Header */}
        <div className="flex justify-between items-center md:p-4 mb-6 border-b border-[#1C1A26]">
          <div className="flex gap-2 items-center">
            <Image
              src="/ysnlogo.webp"
              alt="YSN Logo"
              width={35}
              height={35}
              className="size-[25px] md:size-[30px] lg:size-[35px] object-contain"
            />
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">
              Upcoming Matches
            </h2>
          </div>
          {/* {
                            isOrganisation &&
                            <div className="flex items-center gap-5">
                                {
                                    items.map((item) => (
                                        <div key={item} className={`${selectedCategory === item ? "bg-[#3705DC]" : ""} px-4 py-1 rounded-full transition-all duration-500 ease-in-out cursor-pointer`} onClick={() => setSelectedCategory(item)}>
                                            <p className="font-semibold text-sm ">{item}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        } */}
          <div className="flex items-center gap-2 md:gap-4 transition-all duration-500 ease-in-out">
            {/* <ShareEventModal/> */}
            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex text-[10px] md:text-[14px] items-center justify-center whitespace-nowrap text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 md:py-2  h-8 md:h-10 px-2 md:px-4  bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium transition-all duration-200 group rounded-full "
            >
              <Share2 className="size-4 mr-2" />
              Share
            </button>

            {/* <AddEventModal/> */}
          </div>
        </div>
        {/* Weekdays */}
          <div
            className="flex flex-col lg:flex-row gap-2 h-full xl:min-h-[500px]"
          id="events_section_demo"
        >
            <div ref={leftColRef} className="flex flex-col h-full w-full lg:w-[65%]">
            <MyCalender
              events={events}
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              selectedEvent={
                selectedEvent
                  ? {
                      id: selectedEvent.id ?? selectedEvent.event_id,
                      event_id: selectedEvent.event_id,
                      title: selectedEvent.title ?? selectedEvent.event_name,
                      start: selectedEvent.state_date_time,
                      end: selectedEvent.end_date_time,
                      description: selectedEvent.description,
                      location: selectedEvent.location,
                      className: selectedEvent.className,
                    }
                  : null
              }
              handleEventClick={handleEventClick}
              handleDelete={(id) => handleDelete(id)}
              handleEdit={(e) => handleEdit(e)}
            />
          </div>
            <div
              className="relative md:p-4 pt-0 w-full lg:w-[35%] bg-gradient-to-b from-[#0d0c12] to-[#0d0918] rounded-2xl flex flex-col h-full"
              style={{ height: leftHeight ? `${leftHeight}px` : undefined }}
            >
            <div className="flex items-center justify-between">
              <p className="bg-transparent top-0 w-full  p-4 text-lg font-semibold h-[40px] mb-4">
                {format(new Date(), "MMMM yyyy")}
              </p>
              <div>{/* Placeholder for future export button */}</div>
            </div>
              <div className="flex flex-col gap-5 custom-scrollbar flex-1 min-h-0 overflow-y-auto">
              {events.length > 0 &&
                events.map((event, index: number) => (
                  <div
                    key={index}
                    className="border-l-[4px] bg-[#161227] bg-opacity-40 text-white text-xs rounded-lg px-4 py-2 flex flex-col gap-3 "
                    style={{
                      borderColor: String(event.className || "#7042e0"),
                    }}
                  >
                    <div className="flex justify-between items-center relative">
                      <div
                        className="font-medium truncate cursor-pointer"
                        onClick={() => handleEventClick(event)}
                      >
                        {event.event_name || event.title}
                      </div>
                      <EllipsisVertical
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setOpenDropdownIndex((prev) =>
                            prev === index ? null : index
                          );
                        }}
                        className="text-[#7042e0] size-4 z-10 cursor-pointer transition-all duration-500 ease-in-out"
                      />
                      <div
                        ref={dropdownRef}
                        style={{
                          background:
                            "linear-gradient(199.3deg, #0F0B23 0%, #302A4E 100%)",
                        }}
                        className={cn(
                          "absolute top-5 right-0 border border-purple-800 rounded-md flex gap-2 shadow-md px-2 py-1 z-20 transition-all duration-500 ease-linear",
                          openDropdownIndex === index
                            ? "top-5 visible opacity-100"
                            : "top-10 invisible opacity-0"
                        )}
                      >
                        <Pencil
                          className="text-purple-400 size-5 cursor-pointer"
                          onClick={() => handleEdit(event)}
                        />
                        <Trash2
                          className="text-red-500 size-5 cursor-pointer"
                          onClick={() =>
                            handleDelete(
                              String(event.event_id ?? event.id ?? "")
                            )
                          }
                        />
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-2 cursor-pointer text-white/50 text-[12px]"
                      onClick={() => handleEventClick(event)}
                    >
                      <p>{event?.location || "-"}</p>
                      <div className="h-full w-[1px] bg-white/50" />
                      <div className="text-xs">{event.state_date_time}</div>
                    </div>
                  </div>
                ))}
              {events.length === 0 && (
                <p className="text-center pt-4">No events available!</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <ShareModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        url={
          typeof window !== "undefined"
            ? `${window.location.href}#events_section`
            : ""
        }
        title={title}
      />
    </div>
  );
};

export default UpcomingMatch;
