# Chat Functionality Integration

This document outlines the Firebase-based chat functionality that has been integrated into the YSN Dashboard application.

## Overview

The chat system uses Firebase Firestore for real-time messaging and Firebase Authentication for user management. It supports:
- Direct messaging between users
- Group conversations
- Real-time message synchronization
- User presence and status

## Files Added/Modified

### Firebase Configuration
- `src/lib/firebase.ts` - Client-side Firebase configuration
- `src/lib/firebase-admin.ts` - Server-side Firebase Admin configuration
- `src/lib/chat-service.ts` - Chat-related Firebase operations
- `src/lib/chat-ids.ts` - Utility functions for chat IDs
- `src/lib/chat-firestore-rules.txt` - Firestore security rules

### Chat Components
- `src/components/chat/ChatAuthGate.tsx` - Authentication wrapper for chat
- `src/components/chat/ChatPanel.tsx` - Main chat interface component
- `src/app/api/chat/firebase-token/route.ts` - API route for Firebase token generation

### Integration with Admin Tabs
- `src/components/superAdmin/tabs/Friends-tab.tsx` - Added message functionality ✅
- `src/components/superAdmin/tabs/parents-tab.tsx` - Added message functionality ✅ 
- `src/components/superAdmin/tabs/families-tab.tsx` - Added message functionality ✅
- `src/components/superAdmin/tabs/super-admin-coaches-tab.tsx` - Added message functionality ✅
- `src/hooks/useParents.ts` - Complete implementation for parent management

### Environment Configuration
- `.env.example` - Required environment variables for Firebase
- `firestore.indexes.json` - Firestore indexes configuration
- `FIRESTORE_INDEXES.md` - Index deployment instructions

## Chat Integration Status

### ✅ Integrated Tabs
- **Friends Tab** - Message button available for each friend
- **Parents Tab** - Message button available for each parent
- **Families Tab** - Message button available for each family member
- **Coaches Tab** - Message button available for each coach

### ❌ Not Integrated
- **Opponent Teams Tab** - No chat integration (teams don't have individual contact info)
- **Profile Tab** - No chat needed (user's own profile)
- **Settings Tab** - No chat needed (configuration page)
- **Dashboard Content** - Overview page, chat available in header

## Environment Variables Required

```bash
# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Firebase Admin Configuration (Server-side)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_admin_client_email
FIREBASE_PRIVATE_KEY="your_firebase_admin_private_key"
```

## Features

### Chat Integration
- **Message Button**: Added to Friends, Parents, Families, and Coaches tabs
- **Real-time Chat**: Messages sync across all connected clients
- **User Authentication**: Automatic Firebase authentication using app tokens
- **Group Creation**: Support for creating group conversations
- **Toast Notifications**: Success/error feedback when starting chats

### User Management Integration
- **Enhanced Lists**: All management tabs now include messaging capabilities
- **Direct Messaging**: Click the message icon to start a chat with any contact
- **Status Indicators**: Visual status badges for active/inactive contacts

## Usage

1. **Set up Firebase Project**: Create a Firebase project and obtain the configuration values
2. **Configure Environment**: Set all required environment variables
3. **Deploy Firestore Rules**: Apply the updated security rules for memberIds array
4. **Deploy Firestore Indexes**: Create required composite indexes
5. **Start Application**: Run `npm run dev` to start the development server

## Firestore Setup Requirements

### Security Rules
Update Firestore rules to use `memberIds` array:
```plaintext
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /conversations/{cid} {
      allow read: if signedIn() && (request.auth.uid in resource.data.memberIds);
      allow create: if signedIn() && (request.auth.uid in request.resource.data.memberIds);
      allow update: if signedIn() && (request.auth.uid in resource.data.memberIds);
      // ... other rules
    }
  }
}
```

### Required Indexes
Deploy the composite index for conversations:
- Collection: `conversations`
- Fields: `memberIds` (Array-contains) + `updatedAt` (Descending)

## Security

The chat system implements proper security through:
- Firebase Authentication for user verification
- Firestore security rules for data access control
- Server-side token validation for chat authentication

## Chat Panel Access

The chat panel is accessible through:
- Super admin navigation header (message icon)
- Direct message buttons in Friends/Parents/Families/Coaches tabs
- Can be embedded in any component wrapped with `ChatAuthGate`
