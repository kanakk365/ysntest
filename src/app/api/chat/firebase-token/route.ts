import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, name, email, token } = body

    console.log('Firebase token request for user:', { userId, name, email })

    // Validate required fields
    if (!userId || !token) {
      console.log('Missing required fields:', { userId: !!userId, token: !!token })
      return NextResponse.json({ error: "Missing userId or token" }, { status: 400 })
    }

    // Generate Firebase UID from app user ID
    const uid = `app_${userId}`
    console.log('Generated Firebase UID:', uid)

    // Create custom token with user data
    const customToken = await adminAuth.createCustomToken(uid, {
      appUserId: String(userId),
      email: email || undefined,
      name: name || undefined,
    })

    console.log('Custom token created successfully for UID:', uid)

    return NextResponse.json({ customToken })
  } catch (error) {
    console.error('Error creating Firebase token:', error)
    return NextResponse.json({ error: "Failed to create token" }, { status: 500 })
  }
}


