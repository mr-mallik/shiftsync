# Multi-Tenant ShiftSync System - Architecture Proposal

## Overview
Transform ShiftSync from a static single-user application into a multi-tenant SaaS platform where users can register, manage their own shift schedules, and customize routines.

---

## 1. Architecture Stack

### Frontend (Current + Enhancements)
- **React.js** (existing)
- **React Router** - for navigation between pages
- **Context API / Redux** - global state management for auth and user data
- **Axios / Fetch API** - HTTP client for backend communication
- **React Hook Form** - form validation and management
- **JWT Token Storage** - localStorage/sessionStorage for authentication

### Backend Options

#### Option A: Node.js/Express (Recommended for React developers)
```
- Express.js REST API
- PostgreSQL / MongoDB for database
- JWT for authentication
- bcrypt for password hashing
- Prisma ORM (PostgreSQL) or Mongoose (MongoDB)
```

#### Option B: Firebase (Fastest MVP)
```
- Firebase Authentication
- Cloud Firestore for database
- Firebase Hosting
- Serverless functions
```

#### Option C: Supabase (Modern alternative to Firebase)
```
- Built-in PostgreSQL database
- Real-time subscriptions
- Row-level security
- Built-in authentication
- RESTful API auto-generated
```

---

## 2. Database Schema

### Users Table
```sql
users
├── id (UUID, Primary Key)
├── email (String, Unique, Required)
├── password_hash (String, Required)
├── full_name (String)
├── created_at (Timestamp)
├── updated_at (Timestamp)
└── timezone (String, Default: UTC)
```

### Shifts Table
```sql
shifts
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key → users.id)
├── date (Date, Required)
├── shift_type_id (UUID, Foreign Key → shift_types.id)
├── notes (Text, Optional)
├── created_at (Timestamp)
└── updated_at (Timestamp)

UNIQUE CONSTRAINT: (user_id, date)
INDEX: (user_id, date)
```

### Shift Types Table
```sql
shift_types
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key → users.id)
├── name (String, Required) // e.g., "00-08", "Morning Shift", "Night Shift"
├── start_time (Time, Required)
├── end_time (Time, Required)
├── color (String) // hex color for UI
├── is_day_off (Boolean, Default: false)
├── created_at (Timestamp)
└── updated_at (Timestamp)

INDEX: (user_id)
```

### Routines Table
```sql
routines
├── id (UUID, Primary Key)
├── shift_type_id (UUID, Foreign Key → shift_types.id)
├── time_label (String, Required) // e.g., "21:15 – 23:15"
├── activity (String, Required) // e.g., "Commute to work"
├── order (Integer) // for sorting
├── created_at (Timestamp)
└── updated_at (Timestamp)

INDEX: (shift_type_id, order)
```

### Optional: Templates Table (for sharing/presets)
```sql
templates
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key → users.id, Nullable for public templates)
├── name (String)
├── description (Text)
├── is_public (Boolean)
├── category (String) // "Warehouse", "Healthcare", "Retail", etc.
├── shift_types_json (JSONB) // serialized shift types
├── routines_json (JSONB) // serialized routines
├── downloads_count (Integer)
└── created_at (Timestamp)
```

---

## 3. API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login and get JWT token
POST   /api/auth/logout            - Logout (invalidate token)
POST   /api/auth/refresh           - Refresh JWT token
GET    /api/auth/me                - Get current user profile
PUT    /api/auth/me                - Update user profile
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset password with token
```

### Shift Types Management
```
GET    /api/shift-types            - Get all shift types for current user
POST   /api/shift-types            - Create new shift type
GET    /api/shift-types/:id        - Get specific shift type
PUT    /api/shift-types/:id        - Update shift type
DELETE /api/shift-types/:id        - Delete shift type
```

### Routines Management
```
GET    /api/shift-types/:id/routines        - Get routines for shift type
POST   /api/shift-types/:id/routines        - Add routine to shift type
PUT    /api/routines/:id                    - Update routine
DELETE /api/routines/:id                    - Delete routine
PUT    /api/shift-types/:id/routines/reorder - Reorder routines
```

### Shifts/Calendar Management
```
GET    /api/shifts?month=12&year=2025   - Get shifts for month
POST   /api/shifts                      - Create shift assignment
PUT    /api/shifts/:id                  - Update shift assignment
DELETE /api/shifts/:id                  - Delete shift assignment
POST   /api/shifts/bulk                 - Bulk create shifts (pattern)
GET    /api/shifts/export               - Export to .ics
```

### Templates (Optional)
```
GET    /api/templates                   - Browse public templates
GET    /api/templates/:id               - Get template details
POST   /api/templates                   - Create template from current setup
POST   /api/templates/:id/apply         - Apply template to user account
```

---

## 4. Frontend Structure

### New Pages/Routes
```
/                        - Landing page (public)
/login                   - Login page
/register                - Registration page
/forgot-password         - Password reset request
/dashboard               - Main calendar view (protected)
/shift-types             - Manage shift types (protected)
/shift-types/:id/edit    - Edit shift type and routines (protected)
/templates               - Browse/apply templates (protected)
/settings                - User settings (protected)
/export                  - Export options (protected)
```

### Component Hierarchy
```
App.js
├── AuthProvider (Context)
├── Router
    ├── PublicRoute
    │   ├── LandingPage
    │   ├── LoginPage
    │   ├── RegisterPage
    │   └── ForgotPasswordPage
    └── PrivateRoute (requires auth)
        ├── DashboardLayout
        │   ├── Header (with logout)
        │   ├── Sidebar/Navigation
        │   └── Outlet
        │       ├── CalendarView (current App.js)
        │       ├── ShiftTypesManager
        │       ├── ShiftTypeEditor
        │       ├── TemplatesGallery
        │       └── SettingsPage
```

### New Components Needed
```
components/
├── auth/
│   ├── LoginForm.js
│   ├── RegisterForm.js
│   ├── PrivateRoute.js
│   └── AuthContext.js
├── shiftTypes/
│   ├── ShiftTypeList.js
│   ├── ShiftTypeCard.js
│   ├── ShiftTypeForm.js
│   └── RoutineEditor.js
├── calendar/
│   ├── Calendar.js (existing, modified)
│   ├── Schedule.js (existing, modified)
│   └── ShiftAssignmentModal.js (new)
├── templates/
│   ├── TemplateGallery.js
│   ├── TemplateCard.js
│   └── TemplatePreview.js
└── layout/
    ├── DashboardLayout.js
    ├── Sidebar.js
    └── UserMenu.js
```

---

## 5. Key Features to Implement

### Phase 1: MVP (Core Multi-Tenant)
1. **User Authentication**
   - Email/password registration and login
   - JWT token-based authentication
   - Protected routes

2. **Shift Type Management**
   - Create custom shift types with start/end times
   - Define routines for each shift type
   - Edit and delete shift types

3. **Calendar Management**
   - Assign shift types to specific dates
   - View monthly calendar with assigned shifts
   - Click date to assign/change shift

4. **Basic Export**
   - Export personal calendar to .ics

### Phase 2: Enhanced Features
1. **Pattern-Based Scheduling**
   - Create repeating patterns (e.g., 2 days on, 2 days off)
   - Apply patterns to date ranges
   - Rotation templates (e.g., 4-week rotating schedule)

2. **Visual Customization**
   - Color coding for shift types
   - Custom icons or emojis
   - Dark/light theme toggle

3. **Statistics Dashboard**
   - Total hours worked per month
   - Shift distribution charts
   - Sleep pattern analysis
   - Work-life balance metrics

### Phase 3: Advanced Features
1. **Team Collaboration** (Optional)
   - Create workspaces/teams
   - Share schedules with team members
   - Shift swap requests
   - Manager approval workflows

2. **Mobile App**
   - React Native mobile application
   - Push notifications for upcoming shifts
   - Quick shift logging

3. **Integrations**
   - Google Calendar sync (bidirectional)
   - Slack/Discord notifications
   - Time tracking apps (Toggl, Harvest)

4. **AI Features**
   - Smart routine suggestions based on shift type
   - Optimal sleep schedule recommendations
   - Workload balance suggestions

---

## 6. Migration Strategy

### Step 1: Backend Setup
1. Choose and set up backend (recommend Supabase for fastest start)
2. Create database schema
3. Implement authentication endpoints
4. Build CRUD APIs for shift types, routines, and shifts

### Step 2: Frontend Auth Layer
1. Add React Router
2. Create authentication context
3. Build login/register pages
4. Implement protected routes
5. Add token management

### Step 3: Data Management UI
1. Create shift type management interface
2. Build routine editor
3. Add shift assignment modal to calendar
4. Migrate existing static data as default templates

### Step 4: User Migration
1. Keep existing static version as "demo mode"
2. Add "Sign up to save your schedule" CTA
3. Provide import functionality for demo data

---

## 7. Data Migration from Static to Dynamic

### Current Static Data → User's Default Setup
```javascript
// On user registration, seed their account with default shift types
const defaultShiftTypes = [
  {
    name: "00-08",
    start_time: "00:00",
    end_time: "08:00",
    color: "#3B82F6",
    routines: [
      { time_label: "21:15 – 23:15", activity: "Commute to work...", order: 1 },
      // ... more routines
    ]
  },
  {
    name: "22-08",
    start_time: "22:00",
    end_time: "08:00",
    color: "#8B5CF6",
    routines: [...]
  },
  {
    name: "OFF",
    is_day_off: true,
    routines: [...]
  }
];
```

---

## 8. Security Considerations

1. **Authentication**
   - Password requirements (min 8 chars, complexity)
   - Rate limiting on login attempts
   - Email verification
   - 2FA (optional, future)

2. **Authorization**
   - Row-level security (users can only access their data)
   - JWT token expiration and refresh
   - CORS configuration

3. **Data Protection**
   - HTTPS only
   - Environment variables for secrets
   - SQL injection prevention (ORM/parameterized queries)
   - XSS protection

4. **Privacy**
   - GDPR compliance
   - Data export feature
   - Account deletion option
   - Privacy policy and terms of service

---

## 9. Estimated Development Timeline

### With Supabase (Fastest)
- **Week 1-2**: Backend setup, database schema, auth implementation
- **Week 3-4**: Frontend auth layer, protected routes, user management
- **Week 5-6**: Shift type and routine management UI
- **Week 7-8**: Calendar integration with dynamic data
- **Week 9-10**: Testing, bug fixes, polish, deployment

**Total: 10 weeks for MVP**

### With Custom Node.js Backend
- **Week 1-3**: Backend setup, database, auth, API development
- **Week 4-5**: Frontend auth layer
- **Week 6-8**: Data management UI
- **Week 9-10**: Calendar integration
- **Week 11-12**: Testing and deployment

**Total: 12 weeks for MVP**

---

## 10. Hosting & Deployment

### Frontend
- **Vercel** (recommended) - Free tier, automatic deployments
- **Netlify** - Alternative, similar features
- **AWS Amplify** - If using AWS backend

### Backend Options
- **Supabase** - Hosted, free tier generous
- **Railway** / **Render** - For Node.js backend
- **Heroku** - Simple deployment (paid)
- **DigitalOcean** / **AWS** - More control, requires DevOps

### Database
- **Supabase** (PostgreSQL) - Included
- **MongoDB Atlas** - Free tier available
- **PlanetScale** - MySQL alternative
- **Neon** - Serverless PostgreSQL

---

## 11. Cost Estimation (Monthly)

### Supabase Stack (Recommended for MVP)
- Supabase Free Tier: $0 (up to 500MB database, 2GB bandwidth)
- Vercel Free Tier: $0 (hobby projects)
- **Total: $0/month** (scales to ~$25/month for paid tiers)

### Custom Backend
- Backend Hosting (Render): $7-25/month
- Database (MongoDB Atlas): $0-9/month
- Frontend (Vercel): $0/month
- **Total: $7-34/month**

### Production/Scale
- Supabase Pro: $25/month
- Domain: $12/year
- Email service (SendGrid): $15/month
- **Total: ~$50-60/month**

---

## 12. Monetization Options (Future)

1. **Freemium Model**
   - Free: 3 shift types, 1 month history
   - Pro ($5-10/month): Unlimited shifts, full history, export, templates
   - Team ($20-30/month): Collaboration features

2. **One-Time Purchase**
   - Lifetime access: $49-99

3. **Template Marketplace**
   - Premium templates: $2-5 each
   - Creator revenue share

---

## 13. Technology Recommendations

### For Fastest MVP (Recommended)
```
Frontend:  React + React Router + Context API
Backend:   Supabase (Auth + Database + Storage)
Hosting:   Vercel (Frontend) + Supabase (Backend)
Styling:   Tailwind CSS (already using)
```

### For Most Scalable
```
Frontend:  React + React Router + Redux Toolkit
Backend:   Node.js + Express + PostgreSQL + Prisma
Hosting:   AWS (S3 + CloudFront + ECS + RDS)
Cache:     Redis
Queue:     Bull/BullMQ
```

---

## 14. Next Steps

1. **Decision**: Choose backend architecture (Supabase recommended for speed)
2. **Setup**: Initialize backend project and database
3. **Auth**: Implement authentication flow
4. **Prototype**: Build one complete feature flow (e.g., shift type CRUD)
5. **Iterate**: Gradually migrate existing features to dynamic system
6. **Test**: With real users (yourself first, then beta testers)
7. **Launch**: Deploy MVP and gather feedback

---

## Conclusion

The multi-tenant transformation is very achievable. The recommended path is:

**Phase 1**: Supabase + React (2-3 months for solid MVP)
**Phase 2**: Add advanced features based on user feedback
**Phase 3**: Consider custom backend if scaling needs require it

The current codebase is well-structured for this migration - the component architecture is already separated, making it straightforward to swap static data with API calls.
