"use client";

import React, { Dispatch, SetStateAction, useMemo } from "react";
import { cn } from "@/lib/utils";
import { MessageSquare, ShoppingBag, User, Dumbbell } from "lucide-react";

export type ChatTabId = "chat" | "shop" | "rooster" | "sports";

type ChatTabsNavProps = {
  activeTab: ChatTabId;
  setActiveTab: Dispatch<SetStateAction<ChatTabId>>;
  className?: string;
  labels?: Partial<Record<ChatTabId, string>>;
  orgDetails?: { orgz_chat?: boolean } | null;
};

export default function ChatTabsNav({
  activeTab,
  setActiveTab,
  className,
  labels,
  orgDetails,
}: ChatTabsNavProps) {
  const showChat = orgDetails?.orgz_chat !== false;

  const tabs = useMemo(() => {
    const base = [
      {
        id: "shop" as const,
        label: labels?.shop ?? "Shop",
        icon: <ShoppingBag size={20} />,
      },
      {
        id: "rooster" as const,
        label: labels?.rooster ?? "Roster",
        icon: <User size={20} />,
      },
      {
        id: "sports" as const,
        label: labels?.sports ?? "Sports",
        icon: <Dumbbell size={20} />,
      },
    ];
    return showChat
      ? [
          {
            id: "chat" as const,
            label: labels?.chat ?? "Chat",
            icon: <MessageSquare size={20} />,
          },
          ...base,
        ]
      : base;
  }, [labels, showChat]);

  return (
    <div
      className={cn(
        "relative flex bg-[#0F0C2D] items-center gap-3 px-4 py-3 rounded-t-3xl text-white border-b border-[#251F42]",
        className
      )}
    >
      {tabs.map(({ id, label, icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            type="button"
            className={cn(
              "group relative cursor-pointer flex-1 flex items-center gap-2 py-1 transition-colors duration-300 w-auto",
              isActive ? "text-white w-[100%]" : "width-0 text-gray-400 hover:text-purple-500"
            )}
          >
            {icon}
            <span
              className={cn(
                "whitespace-nowrap overflow-hidden text-[14px] transition-[max-width,opacity] duration-300 ease-out",
                isActive ? "opacity-100 visible" : "opacity-0 invisible"
              )}
              style={{ maxWidth: isActive ? 160 : 0 }}
            >
              {label}
            </span>
            <span
              className="absolute left-0 -bottom-3 rounded-t-md h-0.5 w-full bg-purple-500 origin-left transition-transform duration-700 ease-out"
              style={{ transform: `scaleX(${isActive ? 1 : 0})`, willChange: "transform" }}
            />
          </button>
        );
      })}
    </div>
  );
}
