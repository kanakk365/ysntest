"use client";

import React from "react";
import { useDashboardStore } from "@/lib/dashboard-store";
import { DashboardContent } from "@/components/dashboard-content";
import { ProfileTab } from "@/components/profile-tab";
import { OpponentTeamsTab } from "@/components/opponent-teams-tab";
import { SuperAdminCoachesTab } from "@/components/super-admin-coaches-tab";
import { SettingsTab } from "@/components/settings-tab";

export function DashboardTabs() {
  const { activeTab } = useDashboardStore();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />;
      case "profile":
        return <ProfileTab />;
      case "opponents":
        return <OpponentTeamsTab />;
      case "coaches":
        return <SuperAdminCoachesTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <DashboardContent />;
    }
  };

  return <div className="w-full h-full">{renderContent()}</div>;
}
