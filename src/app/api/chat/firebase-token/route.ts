import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

async function getAppUserFromBackend(bearer: string) {
  const res = await fetch("https://beta.ysn.tv/api/user", {
    headers: { Authorization: `Bearer ${bearer}`, "Content-Type": "application/json" },
    cache: "no-store",
  })
  if (!res.ok) return null
  const json = await res.json()
  const u = json?.data ?? json
  if (!u?.id) return null
  return { id: String(u.id), name: u.name ?? "User", email: u.email ?? null }
}

export async function GET(req: NextRequest) {
  const h = req.headers.get("authorization") || ""
  const token = h.startsWith("Bearer ") ? h.slice(7) : null
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401 })

  const appUser = await getAppUserFromBackend(token)
  if (!appUser) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const uid = `app_${appUser.id}`
  const customToken = await adminAuth.createCustomToken(uid, {
    appUserId: appUser.id,
    email: appUser.email || undefined,
    name: appUser.name || undefined,
  })

  return NextResponse.json({ customToken })
}


