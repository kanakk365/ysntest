"use client";

import React from "react";
import { useDashboardStore } from "@/lib/dashboard-store";
import { DashboardContent } from "@/components/superAdmin/dashboard/dashboard-content";
import { ProfileTab } from "@/components/superAdmin/tabs/profile-tab";
import { OpponentTeamsTab } from "@/components/superAdmin/tabs/opponent-teams-tab";
import { SuperAdminCoachesTab } from "@/components/superAdmin/tabs/super-admin-coaches-tab";
import { SettingsTab } from "@/components/superAdmin/tabs/settings-tab";
import { FriendsTab } from "../tabs/Friends-tab";
import {ParentsTab} from "../tabs/parents-tab";
import { FamiliesTab } from "../tabs/families-tab";

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
      case "friends":
        return <FriendsTab />;
      case "parents":
        return <ParentsTab />;
      case "families":
        return <FamiliesTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <DashboardContent />;
    }
  };

  return <div className="w-full h-full">{renderContent()}</div>;
}
