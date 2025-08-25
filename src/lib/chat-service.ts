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

  // Only ensure our own user exists (we can't create other users' documents)
  await ensureUserExists(myUid);

  // Fetch the target user's displayName from Firebase
  let displayName = targetUserName;
  try {
    const targetUserRef = doc(db, "users", targetUid);
    const targetUserSnap = await getDoc(targetUserRef);
    if (targetUserSnap.exists()) {
      const userData = targetUserSnap.data();
      displayName = userData?.displayName || targetUserName;
    }
  } catch (error) {
    console.log("Could not fetch target user displayName, using fallback:", error);
  }

  const id = directConvId(myUid, targetUid);

  const ref = doc(db, "conversations", id);
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
      userNames: displayName ? { [targetUid]: displayName } : {},
    };

    try {
      await setDoc(ref, conversationData);
    } catch (error) {
      throw error;
    }
  } else {
    // If conversation exists and we have a display name, update the userNames field
    if (displayName) {
      const existingData = snap.data();
      const currentUserNames = existingData?.userNames || {};
      
      // Only update if the name is not already stored or is different
      if (!currentUserNames[targetUid] || currentUserNames[targetUid] !== displayName) {
        const updatedUserNames = {
          ...currentUserNames,
          [targetUid]: displayName
        };
        
        try {
          await updateDoc(ref, {
            userNames: updatedUserNames,
            updatedAt: serverTimestamp()
          });
        } catch {
          // Swallow error: conversation exists; name update is non-critical
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
