"use client"

import { create } from "zustand"

interface ChatState {
  isOpen: boolean
  activeConversationId: string | null
  openChatWithUserId: string | null
  openChat: (conversationId?: string) => void
  openChatWithUser: (userId: string) => void
  closeChat: () => void
  setActiveConversation: (conversationId: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  activeConversationId: null,
  openChatWithUserId: null,
  openChat: (conversationId) =>
    set({
      isOpen: true,
      activeConversationId: conversationId || null,
      openChatWithUserId: null,
    }),
  openChatWithUser: (userId) =>
    set({
      isOpen: true,
      activeConversationId: null,
      openChatWithUserId: userId,
    }),
  closeChat: () =>
    set({
      isOpen: false,
      activeConversationId: null,
      openChatWithUserId: null,
    }),
  setActiveConversation: (conversationId) =>
    set({
      activeConversationId: conversationId,
      openChatWithUserId: null,
    }),
}))
