# Authentication Implementation

## Overview

This project has been updated to use Zustand for state management instead of React Context, and integrates with the YSN API for authentication.

## Key Changes

### 1. Zustand Auth Store (`src/lib/auth-store.ts`)

- **State Management**: Replaced React Context with Zustand for better performance and simpler state management
- **Persistence**: Uses Zustand's persist middleware to maintain authentication state across browser sessions
- **API Integration**: Direct integration with the YSN login and logout API endpoints

### 2. API Integration

#### Login Endpoint
**URL**: `https://beta.ysn.tv/api/login`

**Request Format**:
```json
{
  "email": "info@ysn.tv",
  "password": "admin@123"
}
```

**Success Response**:
```json
{
  "status": true,
  "data": {
    "token": "5|mFEcO2Z9Of6XLyclsk0OoAz26Dg8oVrqBX9MvUpta0bf36d4",
    "name": "Super Admin",
    "email": "info@ysn.tv",
    "user_type": 1
  },
  "message": "User login successfully"
}
```

**Error Responses**:
- Invalid credentials: `"Invalid credentials"`
- Wrong password: `"Wrong Password"`
- Empty username: `"username is not allowed to be empty"`
- Empty password: `"password is not allowed to be empty"`

#### Logout Endpoint
**URL**: `https://beta.ysn.tv/api/logout`

**Request Method**: `GET`

**Headers**:
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Success Response**:
```json
{
  "status": true,
  "data": [],
  "message": "Logged out successfully"
}
```

**Error Response**:
```json
{
  "status": false,
  "data": [],
  "message": "Something went wrong"
}
```

### 3. User Type Routing

- **user_type: 1** → Super Admin Dashboard (`/dashboard`)
- **user_type: 3** → Coach Dashboard (`/dashboard/coach`)

### 4. Components Updated

All components have been updated to use the Zustand store:

- `src/app/login/page.tsx` - Login form with API integration
- `src/app/page.tsx` - Main dashboard with routing logic
- `src/app/dashboard/page.tsx` - Dashboard routing
- `src/app/dashboard/coach/page.tsx` - Coach dashboard
- `src/components/app-sidebar.tsx` - Sidebar with logout
- `src/components/coach-app-sidebar.tsx` - Coach sidebar
- `src/components/coach-sidebar.tsx` - Coach navigation
- `src/components/coach-profile-tab.tsx` - Profile management

### 5. API Utility (`src/lib/api.ts`)

Created a utility for making authenticated API calls that automatically includes the authorization header.

## Usage

### Login
```typescript
import { useAuthStore } from '@/lib/auth-store'

const { login, loading, error } = useAuthStore()

const handleLogin = async () => {
  const success = await login(email, password)
  if (success) {
    // User will be automatically redirected based on user_type
  }
}
```

### Check Authentication
```typescript
const { isAuthenticated, user } = useAuthStore()

if (isAuthenticated) {
  console.log('User:', user.name, 'Type:', user.user_type)
}
```

### Logout
```typescript
import { useAuthStore } from '@/lib/auth-store'
import { useRouter } from 'next/navigation'

const { logout } = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await logout() // Calls API and clears local state
  router.push("/login") // Redirect to login page
}
```

## Testing

Use the provided test credentials:
- **Email**: `info@ysn.tv`
- **Password**: `admin@123`

The system will automatically route users based on their `user_type`:
- `user_type: 1` → Super Admin Dashboard
- `user_type: 3` → Coach Dashboard

## Security Features

- **Token Persistence**: Authentication tokens are persisted in localStorage
- **Automatic Authorization**: API utility automatically includes Bearer token in requests
- **Route Protection**: Unauthenticated users are redirected to login
- **Role-based Access**: Users are redirected to appropriate dashboards based on user_type
- **Secure Logout**: Logout calls the API to invalidate the token server-side before clearing local state 