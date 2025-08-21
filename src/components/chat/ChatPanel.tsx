"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";
import ChatAuthGate from "@/components/chat/ChatAuthGate";
import { auth } from "@/lib/firebase";
import { useChatStore } from "@/lib/chat-store";
import {
  conversationsFor,
  messagesFor,
  sendMessage,
  startDirectChatByAppId,
  createGroupByAppIds,
} from "@/lib/chat-service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type Conversation = {
  id: string;
  type: "direct" | "group";
  name?: string;
  lastMessage?: { text: string; senderId: string };
  memberIds: string[];
  userNames?: Record<string, string>; // Add userNames field
};

type Message = { id: string; text: string; senderId: string; createdAt?: any };

export default function ChatPanel() {
  const { activeConversationId, closeChat, setActiveConversation } =
    useChatStore();
  const [uid, setUid] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(activeConversationId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [dmUserId, setDmUserId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupMemberIds, setGroupMemberIds] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUid(u?.uid ?? null));
    return () => unsub();
  }, []);

  // Sync with chat store
  useEffect(() => {
    setActiveId(activeConversationId);
  }, [activeConversationId]);

  // Update store when local active conversation changes
  useEffect(() => {
    if (activeId && activeId !== activeConversationId) {
      setActiveConversation(activeId);
    }
  }, [activeId, activeConversationId, setActiveConversation]);

  useEffect(() => {
    if (!uid) return;
    const q = conversationsFor(uid);
    const unsub = onSnapshot(q, (snap) => {
      setConversations(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
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
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Message[]
      );
    });
    return () => unsub();
  }, [activeId]);

  const activeConv = useMemo(
    () => conversations.find((c) => c.id === activeId) || null,
    [conversations, activeId]
  );

  // Function to get display name for a conversation
  const getConversationDisplayName = (conversation: Conversation | null): string => {
    if (!conversation) return "";
    
    if (conversation.type === "group") {
      return conversation.name || "Group Chat";
    }
    
    // For direct chats, try to get the other user's name
    if (conversation.userNames && uid) {
      // Find the other user's ID (not the current user)
      const otherUserId = conversation.memberIds.find(id => id !== uid);
      if (otherUserId && conversation.userNames[otherUserId]) {
        return conversation.userNames[otherUserId];
      }
    }
    
    return "Direct Chat";
  };

  return (
    <ChatAuthGate>
      <div className="bg-background border rounded-lg shadow-lg">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold">Chat</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeChat}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex h-[70vh]">
          <div className="w-64 border-r p-2 space-y-2 flex flex-col">
            <div className="space-y-2 flex-shrink-0">
              <div className="text-xs font-medium">New</div>
              <div className="space-y-1">
                <div className="flex gap-1">
                  <Input
                    placeholder="DM user id"
                    value={dmUserId}
                    onChange={(e) => setDmUserId(e.target.value)}
                  />
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      const id = dmUserId.trim();
                      if (!id) return;
                      const convId = await startDirectChatByAppId(id);
                      setActiveId(convId);
                      setDmUserId("");
                    }}
                  >
                    DM
                  </Button>
                </div>
                <Input
                  placeholder="Group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <div className="flex gap-1">
                  <Input
                    placeholder="Member ids (comma)"
                    value={groupMemberIds}
                    onChange={(e) => setGroupMemberIds(e.target.value)}
                  />
                  <Button
                    onClick={async () => {
                      const name = groupName.trim();
                      const ids = groupMemberIds
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      if (!name || ids.length === 0) return;
                      const convId = await createGroupByAppIds(name, ids);
                      setActiveId(convId);
                      setGroupName("");
                      setGroupMemberIds("");
                    }}
                  >
                    Create
                  </Button>
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mb-1 flex-shrink-0">
              Conversations
            </div>
            <div className="space-y-1 overflow-y-auto flex-1 min-h-0">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  className={`w-full text-left px-2 py-2 rounded ${
                    activeId === c.id ? "bg-accent" : "hover:bg-accent/50"
                  }`}
                  onClick={() => setActiveId(c.id)}
                >
                  <div className="font-medium text-sm">
                    {getConversationDisplayName(c)}
                  </div>
                  <div className="text-xs opacity-70 truncate">
                    {c.lastMessage?.text || "No messages"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {activeConv ? (
              <>
                <div className="border-b px-3 py-2">
                  <div className="font-medium">
                    {getConversationDisplayName(activeConv)}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`max-w-[70%] rounded px-3 py-2 ${
                        m.senderId === uid
                          ? "bg-primary/10 ml-auto"
                          : "bg-secondary/50"
                      }`}
                    >
                      <div className="text-sm">{m.text}</div>
                    </div>
                  ))}
                </div>
                <div className="border-t p-2 flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <Button
                    onClick={async () => {
                      const t = input.trim();
                      if (!t || !activeId) return;
                      await sendMessage(activeId, t);
                      setInput("");
                    }}
                  >
                    Send
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                Select a conversation
              </div>
            )}
          </div>
        </div>
      </div>
    </ChatAuthGate>
  );
}
