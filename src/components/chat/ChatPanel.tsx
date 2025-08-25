"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import ChatAuthGate from "@/components/chat/ChatAuthGate";
import { auth } from "@/lib/firebase";
import { useChatStore } from "@/lib/chat-store";
import { useAuthStore } from "@/lib/auth-store";
import {
  conversationsFor,
  messagesFor,
  sendMessage,
  startDirectChatByAppId,
} from "@/lib/chat-service";
import { ChatHeader } from "./ChatHeader";
import { ChatSidebar, ChatSidebarTab } from "./ChatSidebar";
import { ActiveConversationArea } from "./ActiveConversation";
import { Conversation, Message } from "./types";

export default function ChatPanel({
  hideHeader = false,
  openChatWithUserId,
}: {
  hideHeader?: boolean;
  openChatWithUserId?: string;
}) {
  const { closeChat, openChatWithUserId: storeOpenChatWithUserId } =
    useChatStore();
  const { user } = useAuthStore();
  const [uid, setUid] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<ChatSidebarTab>("conversations");
  // Track which conversation IDs we've attempted to enrich with user display names
  const [enrichedConvIds, setEnrichedConvIds] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      console.log(
        "ChatPanel: Firebase auth state changed to UID:",
        u?.uid || "null"
      );
      setUid(u?.uid ?? null);
      // Clear conversations when Firebase user changes
      if (u?.uid !== uid) {
        console.log(
          "ChatPanel: Firebase UID changed, clearing conversations and active chat"
        );
        setConversations([]);
        setActiveId(null);
        setMessages([]);
      }
    });
    return () => unsub();
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    const q = conversationsFor(uid);
    const unsub = onSnapshot(q, (snap) => {
      setConversations(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Partial<Conversation>),
        })) as Conversation[]
      );
    });
    return () => unsub();
  }, [uid]);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    const q = messagesFor(activeId);
    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Partial<Message>),
        })) as Message[]
      );
    });
    return () => unsub();
  }, [activeId]);

  // Effect to handle opening chat with specific user ID
  useEffect(() => {
    const userIdToOpen = openChatWithUserId || storeOpenChatWithUserId;
    if (userIdToOpen && uid) {
      const openDirectChat = async () => {
        try {
          const convId = await startDirectChatByAppId(userIdToOpen);
          setActiveId(convId);
          setActiveTab("directMessages");
        } catch (error) {
          console.error("Error opening chat with user:", error);
        }
      };
      openDirectChat();
    }
  }, [openChatWithUserId, storeOpenChatWithUserId, uid]);

  // Filter conversations to only show those the current user is a member of
  const userConversations = useMemo(() => {
    if (!uid) return [];
    console.log("ChatPanel - Current Firebase UID:", uid);
    console.log("ChatPanel - App User ID:", user?.id);
    console.log(
      "ChatPanel - All conversations:",
      conversations.map((c) => ({ id: c.id, memberIds: c.memberIds }))
    );
    return conversations.filter(
      (c) => c.memberIds && c.memberIds.includes(uid)
    );
  }, [conversations, uid, user?.id]);

  // Filter direct messages for the current user
  const userDirectMessages = useMemo(() => {
    return userConversations.filter((c) => c.type === "direct");
  }, [userConversations]);

  // Filter group chats for the current user
  const userGroupChats = useMemo(() => {
    return userConversations.filter((c) => c.type === "group");
  }, [userConversations]);

  const activeConv = useMemo(
    () => userConversations.find((c) => c.id === activeId) || null,
    [userConversations, activeId]
  );

  const getConversationDisplayName = (
    conversation: Conversation | null
  ): string => {
    if (!conversation) return "";
    if (conversation.type === "group") {
      return conversation.name || "Group Chat";
    }
    if (conversation.userNames && uid) {
      const otherUserId = conversation.memberIds.find((id) => id !== uid);
      if (otherUserId && conversation.userNames[otherUserId]) {
        return conversation.userNames[otherUserId];
      }
    }
    return "Direct Chat";
  };

  // Enrich direct conversations missing the other user's displayName
  useEffect(() => {
    if (!uid || userConversations.length === 0) return;

    const toEnrich = userConversations.filter((c) => {
      if (c.type !== "direct") return false;
      const otherUid = c.memberIds.find((m) => m !== uid);
      if (!otherUid) return false;
      if (c.userNames && c.userNames[otherUid]) return false; // already have name
      if (enrichedConvIds.has(c.id)) return false; // already attempted
      return true;
    });

    if (toEnrich.length === 0) return;

    let cancelled = false;
    (async () => {
      const newlyEnriched = new Set(enrichedConvIds);
      for (const conv of toEnrich) {
        const otherUid = conv.memberIds.find((m) => m !== uid);
        if (!otherUid) continue;
        newlyEnriched.add(conv.id);
        try {
          const userRef = doc(db, "users", otherUid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const d = snap.data();
            const displayName: string =
              (d?.displayName as string) ||
              (d?.email as string) ||
              otherUid.replace("app_", "User ");
            const convRef = doc(db, "conversations", conv.id);
            await updateDoc(convRef, {
              userNames: { ...(conv.userNames || {}), [otherUid]: displayName },
              updatedAt: serverTimestamp(),
            });
          }
        } catch (err) {
          console.warn("Failed enriching conversation name", conv.id, err);
        }
      }
      if (!cancelled) setEnrichedConvIds(newlyEnriched);
    })();

    return () => {
      cancelled = true;
    };
  }, [uid, userConversations, enrichedConvIds]);

  const handleSendMessage = async () => {
    const text = input.trim();
    if (!text || !activeId) return;

    await sendMessage(activeId, text);
    setInput("");
  };

  return (
    <ChatAuthGate>
      <div className="bg-background border border-border/50 rounded-xl shadow-2xl h-full grid grid-rows-[auto,1fr] overflow-hidden">
        <ChatHeader hideHeader={hideHeader} closeChat={closeChat} uid={uid} />

        <div className="flex h-full min-h-0">
          <ChatSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeId={activeId}
            setActiveId={(id) => setActiveId(id)}
            userConversations={userConversations}
            userDirectMessages={userDirectMessages}
            userGroupChats={userGroupChats}
            getConversationDisplayName={(c) => getConversationDisplayName(c)}
          />
          <ActiveConversationArea
            activeConv={activeConv}
            messages={messages}
            uid={uid}
            input={input}
            setInput={setInput}
            handleSendMessage={handleSendMessage}
            getConversationDisplayName={getConversationDisplayName}
          />
        </div>
      </div>
    </ChatAuthGate>
  );
}
