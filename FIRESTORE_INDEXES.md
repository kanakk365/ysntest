# Firestore Index Deployment

This directory contains the Firestore indexes configuration for the chat functionality.

## Deploy Indexes

To deploy the indexes to your Firebase project, run:

```bash
# Install Firebase CLI if you haven't already
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init firestore

# Deploy the indexes
firebase deploy --only firestore:indexes
```

## Manual Index Creation

If you prefer to create indexes manually, you can:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to Firestore Database > Indexes
4. Click "Create Index"
5. Create a composite index for the `conversations` collection with:
   - Field: `memberIds` (Array-contains)
   - Field: `updatedAt` (Descending)

## Alternative: Use the Error Link

The simplest way is to click the link provided in the error message, which will automatically create the required index for you.

## Troubleshooting

If you continue to get indexing errors:

1. Check that your Firebase project is properly configured
2. Ensure the environment variables are set correctly
3. Verify that the Firestore database is created and accessible
4. Wait a few minutes after creating indexes for them to be built
