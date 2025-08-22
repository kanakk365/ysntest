"use client";

import { useState, useEffect } from "react";
import { Search, MessageSquare, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { startDirectChatByAppId } from "@/lib/chat-service";
import { useChatStore } from "@/lib/chat-store";
import { useAuthStore } from "@/lib/auth-store";
import api from "@/lib/fetch";

// User type mapping
const USER_TYPE_LABELS: Record<number, { label: string; colorClass: string; borderColor: string }> = {
  1: { label: "Super Admin", colorClass: "bg-red-500/10 text-red-700 dark:text-red-300", borderColor: "border-red-500" },
  2: { label: "Organization", colorClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300", borderColor: "border-blue-500" },
  3: { label: "Coach", colorClass: "bg-green-500/10 text-green-700 dark:text-green-300", borderColor: "border-green-500" },
  4: { label: "Outside Coach", colorClass: "bg-green-400/10 text-green-600 dark:text-green-400", borderColor: "border-green-400" },
  5: { label: "Player", colorClass: "bg-purple-500/10 text-purple-700 dark:text-purple-300", borderColor: "border-purple-500" },
  6: { label: "Parent", colorClass: "bg-orange-500/10 text-orange-700 dark:text-orange-300", borderColor: "border-orange-500" },
  7: { label: "College Coach", colorClass: "bg-teal-500/10 text-teal-700 dark:text-teal-300", borderColor: "border-teal-500" },
  8: { label: "Professional Scout", colorClass: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300", borderColor: "border-indigo-500" },
  9: { label: "Sub Admin", colorClass: "bg-red-400/10 text-red-600 dark:text-red-400", borderColor: "border-red-400" },
  10: { label: "Organization Sub Admin", colorClass: "bg-blue-400/10 text-blue-600 dark:text-blue-400", borderColor: "border-blue-400" },
  11: { label: "Organization Coach", colorClass: "bg-green-300/10 text-green-600 dark:text-green-400", borderColor: "border-green-300" },
  12: { label: "Organization Asst. Coach", colorClass: "bg-green-200/10 text-green-600 dark:text-green-400", borderColor: "border-green-200" },
  13: { label: "Family", colorClass: "bg-pink-500/10 text-pink-700 dark:text-pink-300", borderColor: "border-pink-500" },
  14: { label: "Friends", colorClass: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300", borderColor: "border-yellow-500" },
};

interface User {
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
}

interface ApiResponse {
  status: boolean;
  data: User[];
}

interface UserSearchPanelProps {
  onChatStarted?: () => void;
}

export default function UserSearchPanel({ onChatStarted }: UserSearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setActiveConversation } = useChatStore();
  const { user: currentUser } = useAuthStore();

  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if user is authenticated
      const { user } = useAuthStore.getState();
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      const response = await api.get('/user');
      const data: ApiResponse = response.data;
      
      if (data.status && data.data) {
        // Filter users based on search query
        const filteredUsers = data.data.filter(user => 
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.user_fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.user_lname.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setUsers(filteredUsers);
      } else {
        setUsers([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsers();
      } else {
        setUsers([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Group users by type
  const groupedUsers = users.reduce((acc, user) => {
    const userType = user.user_type;
    if (!acc[userType]) {
      acc[userType] = [];
    }
    acc[userType].push(user);
    return acc;
  }, {} as Record<number, User[]>);

  const handleStartChat = async (user: User) => {
    try {
      const conversationId = await startDirectChatByAppId(user.id, user.name);
      setActiveConversation(conversationId);
      onChatStarted?.();
    } catch (err) {
      console.error('Failed to start chat:', err);
      setError('Failed to start conversation');
    }
  };

  const getUserInitials = (user: User) => {
    return `${user.user_fname?.[0] || ''}${user.user_lname?.[0] || ''}`.toUpperCase() || user.name[0]?.toUpperCase() || 'U';
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4 text-muted-foreground">
          Searching users...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-4 text-destructive">
          {error}
        </div>
      )}

      {/* No Results */}
      {searchQuery && !loading && users.length === 0 && !error && (
        <div className="text-center py-4 text-muted-foreground">
          No users found matching "{searchQuery}"
        </div>
      )}

      {/* Results - Grouped by User Type */}
      {Object.keys(groupedUsers).length > 0 && (
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {Object.entries(groupedUsers)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([userTypeStr, usersInType]) => {
              const userType = parseInt(userTypeStr);
              const typeInfo = USER_TYPE_LABELS[userType] || { 
                label: `Type ${userType}`, 
                colorClass: "bg-gray-500/10 text-gray-700 dark:text-gray-300", 
                borderColor: "border-gray-500" 
              };
              
              return (
                <Card key={userType} className={`border-l-4 ${typeInfo.borderColor}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4" />
                      {typeInfo.label}
                      <Badge variant="secondary" className={`ml-auto ${typeInfo.colorClass}`}>
                        {usersInType.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {usersInType.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src="" />
                            <AvatarFallback className="text-xs">
                              {getUserInitials(user)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {user.name}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </div>
                            {user.user_college_name && (
                              <div className="text-xs text-muted-foreground truncate">
                                {user.user_college_name}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartChat(user)}
                          className="flex items-center gap-1 shrink-0"
                        >
                          <MessageSquare className="w-3 h-3" />
                          Chat
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
}
