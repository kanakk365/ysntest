"use client";

import { useState } from "react";
import { Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserSearchPanel from "./UserSearchPanel";

interface ChatSearchButtonProps {
  variant?: "icon" | "button";
  className?: string;
}

export default function ChatSearchButton({ 
  variant = "icon", 
  className = "" 
}: ChatSearchButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {variant === "icon" ? (
          <Button 
            variant="ghost" 
            size="icon" 
            className={`relative cursor-pointer ${className}`}
          >
            <Search className="h-5 w-5" />
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className={`flex items-center gap-2 ${className}`}
          >
            <Search className="h-4 w-4" />
            Search Users
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Find Users to Chat
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <UserSearchPanel onChatStarted={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
