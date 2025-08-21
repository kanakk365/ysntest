"use client";

import { auth, db } from "@/lib/firebase";
import { toAppUid, directConvId } from "@/lib/chat-ids";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  serverTimestamp,
  DocumentData,
  Query,
} from "firebase/firestore";

export async function startDirectChatByAppId(
  targetAppId: number | string,
  targetUserName?: string
) {
  const me = auth.currentUser;
  if (!me) throw new Error("Not signed in");
  const myUid = me.uid;
  const targetUid = toAppUid(targetAppId);

  console.log("startDirectChatByAppId - myUid:", myUid);
  console.log("startDirectChatByAppId - targetUid:", targetUid);

  // Only ensure our own user exists (we can't create other users' documents)
  await ensureUserExists(myUid);

  const id = directConvId(myUid, targetUid);
  console.log("startDirectChatByAppId - conversationId:", id);

  const ref = doc(db, "conversations", id);
  console.log("startDirectChatByAppId - checking if conversation exists...");
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const conversationData = {
      type: "direct",
      members: { [myUid]: true, [targetUid]: true },
      memberIds: [myUid, targetUid],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: null,
      // Store user names for display purposes
      userNames: targetUserName ? { [targetUid]: targetUserName } : {},
    };

    console.log(
      "startDirectChatByAppId - creating conversation with data:",
      conversationData
    );
    console.log(
      "startDirectChatByAppId - members object:",
      conversationData.members
    );
    console.log(
      "startDirectChatByAppId - memberIds array:",
      conversationData.memberIds
    );
    console.log(
      "startDirectChatByAppId - current user in members:",
      conversationData.members[myUid]
    );

    try {
      await setDoc(ref, conversationData);
      console.log("startDirectChatByAppId - conversation created successfully");
    } catch (error) {
      console.error(
        "startDirectChatByAppId - failed to create conversation:",
        error
      );
      throw error;
    }
  } else {
    console.log("startDirectChatByAppId - conversation already exists");
    
    // If conversation exists and we have a target user name, update the userNames field
    if (targetUserName) {
      const existingData = snap.data();
      const currentUserNames = existingData?.userNames || {};
      
      // Only update if the name is not already stored or is different
      if (!currentUserNames[targetUid] || currentUserNames[targetUid] !== targetUserName) {
        const updatedUserNames = {
          ...currentUserNames,
          [targetUid]: targetUserName
        };
        
        try {
          await updateDoc(ref, {
            userNames: updatedUserNames,
            updatedAt: serverTimestamp()
          });
          console.log("startDirectChatByAppId - updated conversation with user name");
        } catch (error) {
          console.error("startDirectChatByAppId - failed to update user name:", error);
          // Don't throw error here, as the conversation still exists and can be used
        }
      }
    }
  }
  return ref.id;
}

async function ensureUserExists(uid: string) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    console.log("Creating user document for:", uid);
    await setDoc(userRef, {
      uid,
      createdAt: serverTimestamp(),
    });
  }
}

export async function createGroupByAppIds(
  name: string,
  memberAppIds: Array<number | string>
) {
  const me = auth.currentUser;
  if (!me) throw new Error("Not signed in");
  const myUid = me.uid;
  const memberUids = Array.from(
    new Set([myUid, ...memberAppIds.map(toAppUid)])
  );
  const membersMap = memberUids.reduce((acc: Record<string, true>, uid) => {
    acc[uid] = true;
    return acc;
  }, {} as Record<string, true>);
  const ref = await addDoc(collection(db, "conversations"), {
    type: "group",
    name,
    ownerId: myUid,
    members: membersMap,
    memberIds: memberUids,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastMessage: null,
  });
  return ref.id;
}

export async function addMembersByAppIds(
  conversationId: string,
  appIds: Array<number | string>
) {
  const ref = doc(db, "conversations", conversationId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Conversation not found");
  const data = snap.data();
  const toAdd = appIds.map(toAppUid);
  const memberIds = Array.from(
    new Set([...(data.memberIds || []), ...toAdd])
  ) as string[];
  const members = { ...(data.members || {}) } as Record<string, true>;
  memberIds.forEach((uid) => (members[uid] = true));
  await updateDoc(ref, { memberIds, members, updatedAt: serverTimestamp() });
}

export async function sendMessage(conversationId: string, text: string) {
  const me = auth.currentUser;
  if (!me) throw new Error("Not signed in");
  const msgCol = collection(db, "conversations", conversationId, "messages");
  await addDoc(msgCol, {
    text,
    senderId: me.uid,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "conversations", conversationId), {
    lastMessage: { text, senderId: me.uid, createdAt: serverTimestamp() },
    updatedAt: serverTimestamp(),
  });
}

export function conversationsFor(uid: string): Query<DocumentData> {
  // Use memberIds array instead of the members object to avoid complex indexing
  return query(
    collection(db, "conversations"),
    where("memberIds", "array-contains", uid),
    orderBy("updatedAt", "desc")
  );
}

export function messagesFor(conversationId: string): Query<DocumentData> {
  return query(
    collection(db, "conversations", conversationId, "messages"),
    orderBy("createdAt", "asc")
  );
}
