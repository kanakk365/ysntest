"use client"

import { create } from "zustand"

interface ChatState {
  isOpen: boolean
  activeConversationId: string | null
  openChat: (conversationId?: string) => void
  closeChat: () => void
  setActiveConversation: (conversationId: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  activeConversationId: null,
  openChat: (conversationId) =>
    set({
      isOpen: true,
      activeConversationId: conversationId || null,
    }),
  closeChat: () =>
    set({
      isOpen: false,
      activeConversationId: null,
    }),
  setActiveConversation: (conversationId) =>
    set({
      activeConversationId: conversationId,
    }),
}))
