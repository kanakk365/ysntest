"use client"

import { useEffect, useState } from "react"
import { signInWithCustomToken, signOut, onAuthStateChanged } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { useAuthStore } from "@/lib/auth-store"

export default function ChatAuthGate({ children }: { children: React.ReactNode }) {
  const appUser = useAuthStore((s) => s.user)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!appUser) {
      setReady(false)
      signOut(auth).catch(() => {})
      return
    }
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        const res = await fetch("/api/chat/firebase-token", {
          headers: { Authorization: `Bearer ${appUser.token}` },
          cache: "no-store",
        })
        if (!res.ok) {
          if (!cancelled) setReady(false)
          return
        }
        const { customToken } = await res.json()
        await signInWithCustomToken(auth, customToken)
        return
      }

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
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
      unsub()
    }
  }, [appUser])

  if (!appUser) return null
  if (!ready) return null
  return <>{children}</>
}


