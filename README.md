# YSN - Youth Sports Network Dashboard

A comprehensive role-based dashboard system for managing youth sports networks with different interfaces for Super Admins and Coaches.

## Features

### Role-Based Access
- **Super Admin Dashboard**: Full system management with overview of all data
- **Coach Dashboard**: Specialized interface for coaches to manage their players and activities

### Coach Dashboard Features
1. **Players Management**
   - Table view of followed players
   - Editable player ratings
   - Player information: Full name, DOB, Grade, ACT, SAT, GPA, Position, State
   - Add notes and labels to players
   - Multiple notes per player

2. **Calendar Management**
   - Calendar view of events
   - Add new events (practice, game, meeting, other)
   - Event details: title, date, time, location, description
   - Event type categorization

3. **Profile Management**
   - Personal information editing
   - Photo upload capability
   - Contact information: name, mobile, email
   - Education details: university/college
   - Bio and experience information

4. **Player Search**
   - Advanced search with filters
   - Filter by: grade, position, graduation year, state
   - Search results with player ratings
   - Follow/unfollow players

### Authentication
- Dummy login system with role-based routing
- Demo accounts for testing:
  - **Super Admin**: admin@ysn.com / password
  - **Coach**: coach@ysn.com / password

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

4. Use the demo accounts to test different roles:
   - Login as coach to see the coach dashboard
   - Login as admin to see the super admin dashboard

## Project Structure

```
src/
├── app/
│   ├── login/           # Login page
│   ├── dashboard/       # Dashboard routing
│   │   └── coach/      # Coach-specific dashboard
│   └── page.tsx        # Main page (super admin)
├── components/
│   ├── coach-*.tsx     # Coach dashboard components
│   ├── ui/             # Reusable UI components
│   └── ...             # Other components
├── contexts/
│   ├── auth-context.tsx    # Authentication context
│   ├── coach-context.tsx   # Coach-specific context
│   └── dashboard-context.tsx # Super admin context
└── ...
```

## Technology Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Lucide React** - Icons
- **Recharts** - Charts and data visualization

## Development Notes

- The system uses dummy data for demonstration
- Authentication is client-side only (for demo purposes)
- Backend integration points are commented for future implementation
- All components are fully responsive and accessible

## Future Enhancements

- Backend API integration
- Real authentication system
- Database integration
- Real-time updates
- Advanced calendar integration
- File upload functionality
- Advanced search and filtering
