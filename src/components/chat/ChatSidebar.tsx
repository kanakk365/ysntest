"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Conversation, ApiUser } from "./types";
import { formatTimestamp } from "./types";
import { Hash, MessageCircle, Plus, Users, X } from "lucide-react";
import { createGroupByAppIds, startDirectChatByAppId } from "@/lib/chat-service";
import { useAuthStore } from "@/lib/auth-store";

export type ChatSidebarTab = "conversations" | "directMessages" | "groupChats";

interface ChatSidebarProps {
  activeTab: ChatSidebarTab;
  setActiveTab: (t: ChatSidebarTab) => void;
  activeId: string | null;
  setActiveId: (id: string) => void;
  userConversations: Conversation[];
  userDirectMessages: Conversation[];
  userGroupChats: Conversation[];
  getConversationDisplayName: (c: Conversation) => string;
}

export function ChatSidebar(props: ChatSidebarProps) {
  const {
    activeTab,
    setActiveTab,
    activeId,
    setActiveId,
    userConversations,
    userDirectMessages,
    userGroupChats,
    getConversationDisplayName,
  } = props;
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [groupName, setGroupName] = useState("");
  const [apiUsers, setApiUsers] = useState<ApiUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<ApiUser[]>([]);
  const [showUserSearch, setShowUserSearch] = useState(false);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = user?.token;
      if (!token) return;
      const response = await fetch("https://beta.ysn.tv/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status && data.data) setApiUsers(data.data);
      }
    } catch (e) {
      console.error("Fetch users failed", e);
    } finally {
      setLoadingUsers(false);
    }
  };

  const startDirect = async (user: ApiUser) => {
    const convId = await startDirectChatByAppId(user.id.toString(), user.name);
    setActiveId(convId);
    setShowUserSearch(false);
    setSearchQuery("");
  };

  const createGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;
    const convId = await createGroupByAppIds(
      groupName,
      selectedUsers.map((u) => u.id.toString())
    );
    setActiveId(convId);
    setShowUserSearch(false);
    setSearchQuery("");
    setGroupName("");
    setSelectedUsers([]);
  };

  return (
    <div className="w-80 border-r border-border/50 flex flex-col min-w-0 bg-gradient-to-b from-muted/20 to-muted/10 min-h-0">
      <div className="border-b border-border/50 p-4 flex-shrink-0">
        <div className="flex bg-muted/50 rounded-lg p-1 shadow-sm">
          {(
            [
              ["conversations", <MessageCircle key="ic" className="w-3 h-3 mr-1" />, "All Chats"],
              ["directMessages", <Users key="iu" className="w-3 h-3 mr-1" />, "Direct"],
              ["groupChats", <Hash key="ih" className="w-3 h-3 mr-1" />, "Groups"],
            ] as const
          ).map(([key, icon, label]) => (
            <Button
              key={key}
              variant={activeTab === key ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(key)}
              className={`flex-1 justify-center rounded-md transition-all text-xs ${
                activeTab === key
                  ? "bg-background shadow-sm text-foreground"
                  : "hover:bg-background/50 text-muted-foreground"
              }`}
            >
              {icon}
              {label}
            </Button>
          ))}
        </div>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        {activeTab === "conversations" && (
          <div className="p-4 space-y-4 min-h-full">
            <div className="text-sm font-medium text-muted-foreground">Recent Conversations</div>
            <div className="space-y-2">
              {userConversations.length === 0 ? (
                <EmptyState message="No conversations yet" helper="Start a new chat using the Direct or Groups tabs" />
              ) : (
                userConversations.map((c) => (
                  <ConversationButton
                    key={c.id}
                    c={c}
                    active={activeId === c.id}
                    onClick={() => setActiveId(c.id)}
                    getConversationDisplayName={getConversationDisplayName}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "directMessages" && (
          <div className="p-4 space-y-4 min-h-full">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-muted-foreground">Direct Messages</div>
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
              <UserSearchCard
                mode="direct"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                loadingUsers={loadingUsers}
                apiUsers={apiUsers}
                onClose={() => {
                  setShowUserSearch(false);
                  setSearchQuery("");
                }}
                onSelectUser={(u) => startDirect(u)}
              />
            )}
            <div className="space-y-2">
              {userDirectMessages.length === 0 ? (
                <EmptyState message="No direct messages yet" helper="Click “New Chat” to start a conversation" />
              ) : (
                userDirectMessages.map((c) => (
                  <ConversationButton
                    key={c.id}
                    c={c}
                    active={activeId === c.id}
                    onClick={() => setActiveId(c.id)}
                    getConversationDisplayName={getConversationDisplayName}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "groupChats" && (
          <div className="p-4 space-y-4 min-h-full">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-muted-foreground">Group Chats</div>
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
              <UserSearchCard
                mode="group"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                loadingUsers={loadingUsers}
                apiUsers={apiUsers}
                groupName={groupName}
                setGroupName={setGroupName}
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
                onClose={() => {
                  setShowUserSearch(false);
                  setSearchQuery("");
                  setSelectedUsers([]);
                  setGroupName("");
                }}
                onCreateGroup={createGroup}
              />
            )}
            <div className="space-y-2">
              {userGroupChats.length === 0 ? (
                <EmptyState message="No group chats yet" helper="Click “Create Group” to start a conversation" />
              ) : (
                userGroupChats.map((c) => (
                  <ConversationButton
                    key={c.id}
                    c={c}
                    active={activeId === c.id}
                    onClick={() => setActiveId(c.id)}
                    getConversationDisplayName={getConversationDisplayName}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

function EmptyState({ message, helper }: { message: string; helper: string }) {
  return (
    <div className="text-center py-8">
      <div className="text-muted-foreground text-sm">{message}</div>
      <div className="text-muted-foreground text-xs mt-1">{helper}</div>
    </div>
  );
}

function ConversationButton({
  c,
  active,
  onClick,
  getConversationDisplayName,
}: {
  c: Conversation;
  active: boolean;
  onClick: () => void;
  getConversationDisplayName: (c: Conversation) => string;
}) {
  return (
    <button
      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
        active
          ? "bg-primary/10 border border-primary/20 shadow-sm"
          : "hover:bg-background/80 border border-transparent"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="w-10 h-10">
            <AvatarImage src={c.avatar || "/placeholder.svg"} />
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
                getConversationDisplayName(c).charAt(0).toUpperCase()
              )}
            </AvatarFallback>
          </Avatar>
          {c.type === "direct" && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
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
  );
}

interface UserSearchCardProps {
  mode: "group" | "direct";
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  loadingUsers: boolean;
  apiUsers: ApiUser[];
  onClose: () => void;
  onSelectUser?: (u: ApiUser) => void;
  groupName?: string;
  setGroupName?: (v: string) => void;
  selectedUsers?: ApiUser[];
  setSelectedUsers?: (users: ApiUser[]) => void;
  onCreateGroup?: () => void;
}

function UserSearchCard(props: UserSearchCardProps) {
  const {
    mode,
    searchQuery,
    setSearchQuery,
    loadingUsers,
    apiUsers,
    onClose,
    onSelectUser,
    groupName,
    setGroupName,
    selectedUsers,
    setSelectedUsers,
    onCreateGroup,
  } = props;
  const selected = selectedUsers || [];
  return (
    <div className="space-y-3 bg-background/50 rounded-lg p-3 border border-border/30 shadow-sm w-[18rem]">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {mode === "group" ? "Create Group Chat" : "Select User"}
        </span>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      {mode === "group" && (
        <Input
          placeholder="Group name..."
          value={groupName}
          onChange={(e) => setGroupName?.(e.target.value)}
          className="bg-background border-border/50"
        />
      )}
      <Input
        placeholder={mode === "group" ? "Search users to add..." : "Search users..."}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-background border-border/50"
      />
  {mode === "group" && selected.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">
    Selected ({selected.length}):
          </div>
          <div className="flex flex-wrap gap-1">
    {selected.map((u) => (
              <div key={u.id} className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                {u.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-primary/20"
      onClick={() => setSelectedUsers?.(selected.filter((su) => su.id !== u.id))}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            size="sm"
    onClick={onCreateGroup}
    disabled={!groupName?.trim() || selected.length === 0}
            className="w-full"
          >
    Create Group ({selected.length} members)
          </Button>
        </div>
      )}
      {loadingUsers ? (
        <div className="flex items-center justify-center p-4">
          <div className="text-sm text-muted-foreground">Loading users...</div>
        </div>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-2">
          {apiUsers
            .filter(
              (u) =>
                (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  u.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
                (!selected || !selected.some((s) => s.id === u.id))
            )
            .map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-3 p-2 rounded hover:bg-background/80 transition-colors cursor-pointer"
                onClick={() =>
                  mode === "group"
                    ? setSelectedUsers?.([...(selected || []), u])
                    : onSelectUser?.(u)
                }
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-muted text-xs">
                    {u.user_fname?.charAt(0).toUpperCase() || u.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{u.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                </div>
                {mode === "group" ? <Plus className="w-4 h-4 text-muted-foreground" /> : null}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
