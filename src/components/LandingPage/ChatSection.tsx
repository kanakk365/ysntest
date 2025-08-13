"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";
import ChatContent from "./ChatContent";
import RoosterContent from "./RoosterContent";
import ShopTab from "./Shoptab";
import ConnectedAthelete from "./ConnectedAthelete";
import { MessageSquare, X } from "lucide-react";
import ChatTabsNav, { ChatTabId } from "@/components/ui/chat-tabs-nav";

type Props = {
  className?: string;
  isChat?: boolean;
  setIsChatClicked?: Dispatch<SetStateAction<boolean>>; // add ?
};

export default function ChatSection({
  className = "",
  isChat = false,
  setIsChatClicked,
}: Props) {
  const [activeTab, setActiveTab] = useState<ChatTabId>("chat");
  const renderTabContent = () => {
    switch (activeTab) {
      case "chat":
        return <ChatContent />;
      case "shop":
        return <ShopTab />;
      case "rooster":
        return <RoosterContent />;
      case "sports":
        return <ConnectedAthelete />;
      default:
        return null;
    }
  };

  const TabsNav = () => (
    <ChatTabsNav activeTab={activeTab} setActiveTab={setActiveTab} />
  );
  return (
    <div className={`lg:col-span-2 xl:col-span-1 overflow-hidden ${className}`}>
      <div
        className={`p-[1px] shadow-inner backdrop-blur-2xl  bg-[linear-gradient(159.82deg,#A785DE_-7.46%,#252237_46.27%,#A785DE_100%)] h-full relative overflow-hidden ${
          isChat ? "rounded-l-2xl" : "rounded-2xl"
        }`}
      >
        <div
          className={cn(
            "flex flex-col gap-4 p-4 h-full",
            isChat ? "rounded-l-2xl" : "rounded-2xl"
          )}
          style={{
            background: "linear-gradient(199.3deg, #0F0B23 0%, #302A4E 100%)",
          }}
        >
          {!isChat ? (
            <TabsNav />
          ) : (
            <div className="h-[50px] px-5 py-3 border-b-[2px] border-purple-500 border-opacity-50 flex justify-between items-center">
              <div className="flex gap-2 items-center text-white ">
                <MessageSquare size={22} />
                <p className="text-[18px] font-semibold">Chat</p>
              </div>
              <X
                className="text-white cursor-pointer"
                size={22}
                onClick={() => setIsChatClicked?.(false)}
              />
            </div>
          )}
          {/* Content area */}
          <div className="flex-1 min-h-0">
            {!isChat ? renderTabContent() : <ChatContent />}
          </div>
        </div>
      </div>
    </div>
  );
}
