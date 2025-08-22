"use client";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";

export function ChatHeader({
  hideHeader,
  closeChat,
  uid,
}: {
  hideHeader?: boolean;
  closeChat: () => void;
  uid: string | null;
}) {
  const { user } = useAuthStore();
  if (hideHeader) return null;
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-background via-muted/10 to-background border-b border-border/50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-1 ring-primary/20">
          <MessageCircle className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-foreground">Messages</h3>
          <div className="text-xs text-muted-foreground">
            App: {user?.id} | Firebase: {uid?.replace("app_", "") || "none"}
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
  );
}
