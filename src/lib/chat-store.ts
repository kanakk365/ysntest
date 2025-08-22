"use client"

import { create } from "zustand"

interface ChatState {
  isOpen: boolean
  openChatWithUserId: string | null
  openChat: (conversationId?: string) => void
  openChatWithUser: (userId: string) => void
  closeChat: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  openChatWithUserId: null,
  openChat: () =>
    set({
      isOpen: true,
      openChatWithUserId: null,
    }),
  openChatWithUser: (userId) =>
    set({
      isOpen: true,
      openChatWithUserId: userId,
    }),
  closeChat: () =>
    set({
      isOpen: false,
      openChatWithUserId: null,
    }),
}))
