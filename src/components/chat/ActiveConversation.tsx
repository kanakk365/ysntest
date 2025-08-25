"use client";
import { useEffect, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hash, MessageCircle, Send, Users } from "lucide-react";
import { Conversation, Message } from "./types";
import { formatTimestamp } from "./types";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface ActiveConversationProps {
  activeConv: Conversation | null;
  messages: Message[];
  uid: string | null;
  input: string;
  setInput: (v: string) => void;
  handleSendMessage: () => void;
  getConversationDisplayName: (c: Conversation | null) => string;
}

export function ActiveConversationArea({
  activeConv,
  messages,
  uid,
  input,
  setInput,
  handleSendMessage,
  getConversationDisplayName,
}: ActiveConversationProps) {
  const [nameCache, setNameCache] = useState<Record<string, string>>({});

  // Derive list of senderIds needing resolution (excluding self and ones already named)
  useEffect(() => {
    if (!activeConv) return;
    const missingIds = new Set<string>();
    messages.forEach((m) => {
      if (m.senderId === uid) return;
      if (m.senderName && m.senderName.trim() !== "") return;
      if (nameCache[m.senderId]) return;
      // If conversation already has a userNames mapping, prefer that
      const convName = activeConv.userNames?.[m.senderId];
      if (convName) {
        missingIds.delete(m.senderId); // ensure not fetched
        setNameCache((prev) => ({ ...prev, [m.senderId]: convName }));
      } else {
        missingIds.add(m.senderId);
      }
    });

    if (missingIds.size === 0) return;
    let cancelled = false;
    (async () => {
      for (const id of missingIds) {
        try {
          const ref = doc(db, "users", id);
          const snap = await getDoc(ref);
          if (!snap.exists()) continue;
          const data = snap.data();
          const resolved = (data?.displayName as string) || (data?.email as string) || id.replace("app_", "User ");
          if (!cancelled) {
            setNameCache((prev) => ({ ...prev, [id]: resolved }));
          }
        } catch {
          // Silent fail; keep default fallback
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [messages, activeConv, uid, nameCache]);

  const resolveSenderName = useCallback(
    (m: Message): string => {
      if (m.senderName && m.senderName.trim() !== "") return m.senderName;
      if (activeConv?.userNames && activeConv.userNames[m.senderId])
        return activeConv.userNames[m.senderId];
      if (nameCache[m.senderId]) return nameCache[m.senderId];
      // Derive simple placeholder from id while fetching
      if (m.senderId.startsWith("app_")) {
        const num = m.senderId.substring(4);
        return `User ${num}`;
      }
      return "User";
    },
    [activeConv?.userNames, nameCache]
  );

  if (!activeConv) {
    return (
      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-background">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4 max-w-xs">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center mx-auto">
              <MessageCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <div className="text-lg font-medium text-foreground mb-2">No conversation selected</div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                Choose a conversation from the sidebar to start messaging
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-background">
      <div className="border-b border-border/50 px-6 py-4 bg-gradient-to-r from-muted/10 to-background flex-shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={activeConv.avatar || "/placeholder.svg"} />
            <AvatarFallback
              className={`${
                activeConv.type === "group"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {activeConv.type === "group" ? (
                <Users className="w-4 h-4" />
              ) : (
                getConversationDisplayName(activeConv).charAt(0).toUpperCase()
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-foreground">
              {getConversationDisplayName(activeConv)}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              {activeConv.type === "group" ? (
                <>
                  <Hash className="w-3 h-3" />
                  {activeConv.memberIds.length} members
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Online
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 min-h-0 p-6">
        <div className="space-y-4">
          {messages.map((m) => {
            const display = resolveSenderName(m);
            return (
              <div key={m.id} className={`flex gap-3 ${m.senderId === uid ? "flex-row-reverse" : ""}`}>
                {m.senderId !== uid && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={m.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-muted text-xs">
                      {display.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-[75%] ${m.senderId === uid ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  {m.senderId !== uid && (
                    <div className="text-xs text-muted-foreground font-medium">{display}</div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      m.senderId === uid
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted/50 border border-border/50 rounded-bl-md"
                    }`}
                  >
                    <div className="text-sm leading-relaxed">{m.text}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{formatTimestamp(m.createdAt)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <div className="border-t border-border/50 p-4 bg-gradient-to-r from-muted/10 to-background flex-shrink-0">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="bg-background border-border/50 rounded-xl px-4 py-3 text-sm resize-none"
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            className="rounded-xl px-4 py-3 h-auto shadow-sm"
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
