"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Users, Send, Plus, MessageCircle, Hash } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { onSnapshot, Timestamp } from "firebase/firestore";
import ChatAuthGate from "@/components/chat/ChatAuthGate";
import { auth } from "@/lib/firebase";
import { useChatStore } from "@/lib/chat-store";
import { useAuthStore } from "@/lib/auth-store";
import {
  conversationsFor,
  messagesFor,
  sendMessage,
  startDirectChatByAppId,
  createGroupByAppIds,
} from "@/lib/chat-service";

type Conversation = {
  id: string;
  type: "direct" | "group";
  name?: string;
  // Firestore stores lastMessage.createdAt as a Firestore Timestamp
  lastMessage?: { text: string; senderId: string; createdAt?: Timestamp | string };
  memberIds: string[];
  userNames?: Record<string, string>;
  avatar?: string;
};

type Message = {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  createdAt?: Timestamp | string; // Firestore Timestamp or string
  avatar?: string;
};


type ApiUser = {
  id: number;
  name: string;
  email: string;
  user_type: number;
  user_fname: string;
  user_lname: string;
  user_dob: string | null;
  user_otp: string | null;
  user_mobile: string | null;
  user_college_name: string | null;
  user_status: number;
  user_slug_name: string;
};

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
  const [groupName, setGroupName] = useState("");
  const [activeTab, setActiveTab] = useState<
    "conversations" | "directMessages" | "groupChats"
  >("conversations");
  const [searchQuery, setSearchQuery] = useState("");
  const [apiUsers, setApiUsers] = useState<ApiUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<ApiUser[]>([]);
  const [showUserSearch, setShowUserSearch] = useState(false);

  const formatTimestamp = (ts: Timestamp | string | undefined): string => {
    if (!ts) return "";
    if (typeof ts === "string") return ts;
    // Firestore Timestamp has seconds & nanoseconds
    if (ts.seconds) {
      const date = new Date(ts.seconds * 1000);
      // Today show time only; otherwise show date
      const now = new Date();
      const sameDay =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();
      return sameDay
        ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : date.toLocaleDateString();
    }
    return "";
  };

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

  const handleSendMessage = async () => {
    const text = input.trim();
    if (!text || !activeId) return;

    await sendMessage(activeId, text);
    setInput("");
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      // Get auth token from auth store
      const token = user?.token;
      if (!token) {
        console.error("No auth token available");
        return;
      }

      const response = await fetch("https://beta.ysn.tv/api/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status && data.data) {
          setApiUsers(data.data);
        } else {
          console.error("API returned error:", data.message || "Unknown error");
        }
      } else {
        console.error(
          "Failed to fetch users:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  return (
    <ChatAuthGate>
      <div className="bg-background border border-border/50 rounded-xl shadow-2xl h-full grid grid-rows-[auto,1fr] overflow-hidden">
        {!hideHeader && (
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-background via-muted/10 to-background border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                <MessageCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">
                  Messages
                </h3>
                {/* Temporary debugging info */}
                <div className="text-xs text-muted-foreground">
                  App: {user?.id} | Firebase:{" "}
                  {uid?.replace("app_", "") || "none"}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeChat}
              className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex h-full min-h-0">
          <div className="w-80 border-r border-border/50 flex flex-col min-w-0 bg-gradient-to-b from-muted/20 to-muted/10 min-h-0">
            <div className="border-b border-border/50 p-4 flex-shrink-0">
              <div className="flex bg-muted/50 rounded-lg p-1 shadow-sm">
                <Button
                  variant={activeTab === "conversations" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("conversations")}
                  className={`flex-1 justify-center rounded-md transition-all text-xs ${
                    activeTab === "conversations"
                      ? "bg-background shadow-sm text-foreground"
                      : "hover:bg-background/50 text-muted-foreground"
                  }`}
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  All Chats
                </Button>
                <Button
                  variant={activeTab === "directMessages" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("directMessages")}
                  className={`flex-1 justify-center rounded-md transition-all text-xs ${
                    activeTab === "directMessages"
                      ? "bg-background shadow-sm text-foreground"
                      : "hover:bg-background/50 text-muted-foreground"
                  }`}
                >
                  <Users className="w-3 h-3 mr-1" />
                  Direct
                </Button>
                <Button
                  variant={activeTab === "groupChats" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("groupChats")}
                  className={`flex-1 justify-center rounded-md transition-all text-xs ${
                    activeTab === "groupChats"
                      ? "bg-background shadow-sm text-foreground"
                      : "hover:bg-background/50 text-muted-foreground"
                  }`}
                >
                  <Hash className="w-3 h-3 mr-1" />
                  Groups
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 min-h-0">
              {activeTab === "conversations" && (
                <div className="p-4 space-y-4 min-h-full">
                  <div className="text-sm font-medium text-muted-foreground">
                    Recent Conversations
                  </div>
                  <div className="space-y-2">
                    {userConversations.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-muted-foreground text-sm">
                          No conversations yet
                        </div>
                        <div className="text-muted-foreground text-xs mt-1">
                          Start a new chat using the Direct or Groups tabs
                        </div>
                      </div>
                    ) : (
                      userConversations.map((c) => (
                        <button
                          key={c.id}
                          className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                            activeId === c.id
                              ? "bg-primary/10 border border-primary/20 shadow-sm"
                              : "hover:bg-background/80 border border-transparent"
                          }`}
                          onClick={() => setActiveId(c.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={c.avatar || "/placeholder.svg"}
                                />
                                <AvatarFallback
                                  className={`${
                                    c.type === "group"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-green-100 text-green-700"
                                  }`}
                                >
                                  {c.type === "group" ? (
                                    <Users className="w-4 h-4" />
                                  ) : (
                                    getConversationDisplayName(c)
                                      .charAt(0)
                                      .toUpperCase()
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              {c.type === "direct" && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-foreground truncate">
                                {getConversationDisplayName(c)}
                              </div>
                              <div className="text-xs text-muted-foreground truncate mt-1">
                                {c.lastMessage?.text || "No messages yet"}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatTimestamp(c.lastMessage?.createdAt)}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === "directMessages" && (
                <div className="p-4 space-y-4 min-h-full">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-muted-foreground">
                      Direct Messages
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setShowUserSearch(true);
                        fetchUsers();
                      }}
                      className="gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      New Chat
                    </Button>
                  </div>

                  {showUserSearch && (
                    <div className="space-y-3 bg-background/50 rounded-lg p-3 border border-border/30 shadow-sm w-[18rem]">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Select User</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowUserSearch(false);
                            setSearchQuery("");
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-background border-border/50"
                      />
                      {loadingUsers ? (
                        <div className="flex items-center justify-center p-4">
                          <div className="text-sm text-muted-foreground">
                            Loading users...
                          </div>
                        </div>
                      ) : (
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {apiUsers
                            .filter(
                              (user) =>
                                user.name
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase()) ||
                                user.email
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase())
                            )
                            .map((user) => (
                              <div
                                key={user.id}
                                className="flex items-center gap-3 p-2 rounded hover:bg-background/80 transition-colors cursor-pointer"
                                onClick={async () => {
                                  const convId = await startDirectChatByAppId(
                                    user.id.toString()
                                  );
                                  setActiveId(convId);
                                  setShowUserSearch(false);
                                  setSearchQuery("");
                                }}
                              >
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="bg-muted text-xs">
                                    {user.user_fname?.charAt(0).toUpperCase() ||
                                      user.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">
                                    {user.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground truncate">
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    {userDirectMessages.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-muted-foreground text-sm">
                          No direct messages yet
                        </div>
                        <div className="text-muted-foreground text-xs mt-1">
                          Click &ldquo;New Chat&rdquo; to start a conversation
                        </div>
                      </div>
                    ) : (
                      userDirectMessages.map((c) => (
                        <button
                          key={c.id}
                          className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                            activeId === c.id
                              ? "bg-primary/10 border border-primary/20 shadow-sm"
                              : "hover:bg-background/80 border border-transparent"
                          }`}
                          onClick={() => setActiveId(c.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={c.avatar || "/placeholder.svg"}
                                />
                                <AvatarFallback className="bg-green-100 text-green-700">
                                  {getConversationDisplayName(c)
                                    .charAt(0)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-foreground truncate">
                                {getConversationDisplayName(c)}
                              </div>
                              <div className="text-xs text-muted-foreground truncate mt-1">
                                {c.lastMessage?.text || "No messages yet"}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatTimestamp(c.lastMessage?.createdAt)}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === "groupChats" && (
                <div className="p-4 space-y-4 min-h-full">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-muted-foreground">
                      Group Chats
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setShowUserSearch(true);
                        fetchUsers();
                      }}
                      className="gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Create Group
                    </Button>
                  </div>

                  {showUserSearch && (
                    <div className="space-y-3 bg-background/50 rounded-lg p-3 border border-border/30 shadow-sm w-[18rem]">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Create Group Chat
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowUserSearch(false);
                            setSearchQuery("");
                            setSelectedUsers([]);
                            setGroupName("");
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <Input
                        placeholder="Group name..."
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="bg-background border-border/50"
                      />

                      <Input
                        placeholder="Search users to add..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-background border-border/50"
                      />

                      {selectedUsers.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-muted-foreground">
                            Selected ({selectedUsers.length}):
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {selectedUsers.map((user) => (
                              <div
                                key={user.id}
                                className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs"
                              >
                                {user.name}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 hover:bg-primary/20"
                                  onClick={() => {
                                    setSelectedUsers(
                                      selectedUsers.filter(
                                        (u) => u.id !== user.id
                                      )
                                    );
                                  }}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <Button
                            size="sm"
                            onClick={async () => {
                              if (
                                !groupName.trim() ||
                                selectedUsers.length === 0
                              )
                                return;
                              const memberIds = selectedUsers.map((u) =>
                                u.id.toString()
                              );
                              const convId = await createGroupByAppIds(
                                groupName,
                                memberIds
                              );
                              setActiveId(convId);
                              setShowUserSearch(false);
                              setSearchQuery("");
                              setSelectedUsers([]);
                              setGroupName("");
                            }}
                            disabled={
                              !groupName.trim() || selectedUsers.length === 0
                            }
                            className="w-full"
                          >
                            Create Group ({selectedUsers.length} members)
                          </Button>
                        </div>
                      )}

                      {loadingUsers ? (
                        <div className="flex items-center justify-center p-4">
                          <div className="text-sm text-muted-foreground">
                            Loading users...
                          </div>
                        </div>
                      ) : (
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {apiUsers
                            .filter(
                              (user) =>
                                (user.name
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase()) ||
                                  user.email
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase())) &&
                                !selectedUsers.some(
                                  (selected) => selected.id === user.id
                                )
                            )
                            .map((user) => (
                              <div
                                key={user.id}
                                className="flex items-center gap-3 p-2 rounded hover:bg-background/80 transition-colors cursor-pointer"
                                onClick={() => {
                                  setSelectedUsers([...selectedUsers, user]);
                                }}
                              >
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="bg-muted text-xs">
                                    {user.user_fname?.charAt(0).toUpperCase() ||
                                      user.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">
                                    {user.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground truncate">
                                    {user.email}
                                  </div>
                                </div>
                                <Plus className="w-4 h-4 text-muted-foreground" />
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    {userGroupChats.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-muted-foreground text-sm">
                          No group chats yet
                        </div>
                        <div className="text-muted-foreground text-xs mt-1">
                          Click &ldquo;Create Group&rdquo; to start a group
                          conversation
                        </div>
                      </div>
                    ) : (
                      userGroupChats.map((c) => (
                        <button
                          key={c.id}
                          className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                            activeId === c.id
                              ? "bg-primary/10 border border-primary/20 shadow-sm"
                              : "hover:bg-background/80 border border-transparent"
                          }`}
                          onClick={() => setActiveId(c.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={c.avatar || "/placeholder.svg"}
                                />
                                <AvatarFallback className="bg-blue-100 text-blue-700">
                                  <Users className="w-4 h-4" />
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-foreground truncate">
                                {getConversationDisplayName(c)}
                              </div>
                              <div className="text-xs text-muted-foreground truncate mt-1">
                                {c.lastMessage?.text || "No messages yet"}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatTimestamp(c.lastMessage?.createdAt)}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-background">
            {activeConv ? (
              <>
                <div className="border-b border-border/50 px-6 py-4 bg-gradient-to-r from-muted/10 to-background flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={activeConv.avatar || "/placeholder.svg"}
                      />
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
                          getConversationDisplayName(activeConv)
                            .charAt(0)
                            .toUpperCase()
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
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Online
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1 min-h-0 p-6">
                  <div className="space-y-4">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex gap-3 ${
                          m.senderId === uid ? "flex-row-reverse" : ""
                        }`}
                      >
                        {m.senderId !== uid && (
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarImage src={m.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-muted text-xs">
                              {m.senderName?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[75%] ${
                            m.senderId === uid ? "items-end" : "items-start"
                          } flex flex-col gap-1`}
                        >
                          {m.senderId !== uid && (
                            <div className="text-xs text-muted-foreground font-medium">
                              {m.senderName || "Unknown"}
                            </div>
                          )}
                          <div
                            className={`rounded-2xl px-4 py-3 shadow-sm ${
                              m.senderId === uid
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-muted/50 border border-border/50 rounded-bl-md"
                            }`}
                          >
                            <div className="text-sm leading-relaxed">
                              {m.text}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatTimestamp(m.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
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
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center mx-auto">
                    <MessageCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-lg font-medium text-foreground mb-2">
                      No conversation selected
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Choose a conversation from the sidebar to start messaging
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ChatAuthGate>
  );
}
