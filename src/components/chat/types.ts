import { Timestamp } from "firebase/firestore";

export type Conversation = {
  id: string;
  type: "direct" | "group";
  name?: string;
  lastMessage?: { text: string; senderId: string; createdAt?: Timestamp | string };
  memberIds: string[];
  userNames?: Record<string, string>;
  avatar?: string;
};

export type Message = {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  createdAt?: Timestamp | string;
  avatar?: string;
};

export type ApiUser = {
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

export const formatTimestamp = (ts: Timestamp | string | undefined): string => {
  if (!ts) return "";
  if (typeof ts === "string") return ts;
  if (ts.seconds) {
    const date = new Date(ts.seconds * 1000);
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
