"use client"

import { useEffect, useState } from "react"
import { signInWithCustomToken, signOut, onAuthStateChanged } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { useAuthStore } from "@/lib/auth-store"
import { toAppUid } from "@/lib/chat-ids"

export default function ChatAuthGate({ children }: { children: React.ReactNode }) {
  const appUser = useAuthStore((s) => s.user)
  const [ready, setReady] = useState(false)
  const [currentAppUserId, setCurrentAppUserId] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    
    if (!appUser) {
      console.log('ChatAuthGate: No app user, signing out from Firebase')
      setReady(false)
      setCurrentAppUserId(null)
      signOut(auth).catch(() => {})
      return
    }

    // Check if the app user has changed
    if (currentAppUserId !== null && currentAppUserId !== appUser.id) {
      console.log('ChatAuthGate: App user changed from', currentAppUserId, 'to', appUser.id, '- forcing Firebase signout')
      setReady(false)
      setCurrentAppUserId(appUser.id)
      // Force Firebase signout when app user changes
      signOut(auth).then(() => {
        console.log('ChatAuthGate: Firebase signout completed, will create new user')
      }).catch((error) => {
        console.error('ChatAuthGate: Error signing out from Firebase:', error)
      })
      return
    }

    // Set current app user ID if not set
    if (currentAppUserId === null) {
      setCurrentAppUserId(appUser.id)
    }

    // Expected Firebase UID based on persisted Zustand user id
    const expectedUid = toAppUid(appUser.id)

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      // If a different Firebase user is signed in, sign out to switch
      if (fbUser && fbUser.uid !== expectedUid) {
        console.log('ChatAuthGate: UID mismatch, expected', expectedUid, 'got', fbUser.uid, '- signing out')
        setReady(false)
        await signOut(auth).catch(() => {})
        return
      }
      if (!fbUser) {
        console.log('ChatAuthGate: Creating Firebase token for user:', appUser.id)
        
        const res = await fetch("/api/chat/firebase-token", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: appUser.id,
            name: appUser.name,
            email: appUser.email,
            token: appUser.token
          }),
          cache: "no-store",
        })
        
        if (!res.ok) {
          console.error('ChatAuthGate: Failed to get Firebase token:', res.status)
          if (!cancelled) setReady(false)
          return
        }
        
        const { customToken } = await res.json()
        console.log('ChatAuthGate: Got custom token, signing in to Firebase')
        await signInWithCustomToken(auth, customToken)
        return
      }

      console.log('ChatAuthGate: Firebase user signed in with UID:', fbUser.uid)
      console.log('ChatAuthGate: Updating Firestore user document for app user:', appUser?.id)
      
      await setDoc(
        doc(db, "users", fbUser.uid),
        {
          uid: fbUser.uid,
          displayName: appUser?.name ?? "User",
          email: appUser?.email ?? null,
          appUserId: appUser?.id ?? null,
          searchable: (appUser?.name || "User").toLowerCase(),
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      )
      
      console.log('ChatAuthGate: User document updated, chat ready for app user:', appUser?.id, 'Firebase UID:', fbUser.uid)
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
      unsub()
    }
  }, [appUser, currentAppUserId])

  if (!appUser) return null
  if (!ready) return null
  return <>{children}</>
}


