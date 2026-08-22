# 🌍 GlobeTrotter – Team Tasks & Navigation Guide

> **Read this file before opening any code!**
> This is your map to the project. Every team member's work is listed here.

---

## 🏗️ Project Structure (Quick Map)

```
globetrotter/
├── client/                   ← React + Vite frontend
│   └── src/
│       ├── components/       ← Reusable UI components
│       │   ├── ui/           ← Buttons, Inputs, Modals, Cards...
│       │   └── layout/       ← Sidebar, Navbar, BottomNav
│       ├── pages/            ← One folder per route
│       ├── layouts/          ← AppLayout, AuthLayout
│       ├── store/slices/     ← Redux state slices
│       ├── services/api.js   ← Axios instance
│       ├── routes/           ← React Router config
│       └── utils/            ← cn(), dates, formatting, validation
│
├── server/                   ← Express + MongoDB backend
│   ├── models/               ← Mongoose models
│   ├── controllers/          ← Business logic
│   ├── routes/               ← API route definitions
│   ├── middleware/           ← JWT auth, error handler
│   └── server.js             ← Entry point
│
└── seed/
    └── seed.js               ← Demo data (20 cities, activities, trips)
```

---

## 👥 Team Assignment

| Member | Phases | Screens |
|--------|--------|---------|
| **Prayag** (Lead) | 1, 3, 9, 10 | Setup · Dashboard · Public Trip · Profile · Admin |
| **Raj** | 4 | My Trips · Create Trip · Trip Detail · Edit Trip |
| **Jinay** | 5, 6 | Itinerary Builder · City Search · Activity Search |
| **Kushal** | 2, 7, 8 | Auth (Login/Register) · Budget · Calendar |

---

## 👤 PRAYAG – Team Lead

### Phase 1 (Project Base Architecture Setup ✅)
- Project structure, base files, server skeleton, models, routing

### Phase 3 – Dashboard
**File:** `client/src/pages/dashboard/DashboardPage.jsx`

Build:
- Welcome message with user's name
- Stats cards: Total Trips, Cities Visited, Total Budget Spent
- Recent trips grid (last 3 trips from API)
- "Plan New Trip" CTA button → `/trips/create`
- Recommended destinations (popular cities from API)
- Budget highlights (quick summary)

**APIs to call:**
- `GET /api/trips` – list user's trips
- `GET /api/cities/popular` – for recommendations

---

### Phase 9 – Public Trip
**File:** `client/src/pages/public/PublicTripPage.jsx`

Build:
- Read-only itinerary view (no auth required)
- Trip header with cover photo, name, dates, destinations
- City-by-city itinerary sections
- Activities per day
- "Copy Trip" button (requires login) → calls `POST /api/public/trip/:slug/copy`
- Share URL: `/trip/public/:slug`

---

### Phase 10 – Profile
**File:** `client/src/pages/profile/ProfilePage.jsx`

Tabs:
1. **Personal Info** – Name, avatar, email (read-only)
2. **Security** – Change password
3. **Preferences** – Currency, Language dropdowns
4. **Saved Destinations** – list of bookmarked cities
5. **Danger Zone** – Delete account button

**API:** `GET/PUT /api/users/profile`, `PUT /api/users/password`

---

### Phase 10 – Admin Dashboard
**File:** `client/src/pages/admin/AdminDashboard.jsx`

Build:
- Stats cards: Total Users, Total Trips, Total Cities, Total Activities
- Bar chart: Trips by status (Recharts)
- Recent trips table
- Popular cities list

**API:** `GET /api/admin/stats`

---

## 👤 RAJ – Trips

### Phase 4 – My Trips
**File:** `client/src/pages/trips/TripsPage.jsx`

Build:
- Search bar to filter trips
- Filter chips: All / Planning / Upcoming / Completed
- Grid of TripCards (responsive: 3col → 2col → 1col)
- Empty state: "No trips yet" + CTA
- Each card shows: Cover image, Name, Dates, # Cities, Budget status badge

**TripCard component:** `client/src/components/features/TripCard.jsx`
- Dropdown menu: View · Edit · Delete · Duplicate · Share

---

### Phase 4 – Create Trip
**File:** `client/src/pages/trips/CreateTripPage.jsx`

Form fields (use React Hook Form + Zod):
- Trip Name (required)
- Description (optional)
- Start Date (required)
- End Date (required, must be ≥ start)
- Budget (optional, number ≥ 0)
- Cover Photo URL (optional)
- Currency selector

On success → redirect to `/trips/:id/itinerary`

**API:** `POST /api/trips`
**Validation schema:** `client/src/utils/validationSchemas.js → createTripSchema`

---

### Phase 4 – Edit Trip
**File:** `client/src/pages/trips/EditTripPage.jsx`

Same form as Create Trip, pre-filled with existing data.
**API:** `PUT /api/trips/:id`

---

### Phase 4 – Trip Detail
**File:** `client/src/pages/trips/TripDetailPage.jsx`

Overview page showing:
- Cover image hero
- Trip stats: Duration, # Cities, Budget vs Spent
- Tabs: Itinerary · Budget · Calendar
- Share button (copy public URL to clipboard)

---

## 👤 JINAY – Itinerary + Discovery

### Phase 5 – Itinerary Builder
**File:** `client/src/pages/itinerary/ItineraryPage.jsx`

Build:
1. **Sidebar** (left panel):
   - List of stops (cities) with drag handles
   - "Add Stop" button → opens city search modal
   - Each stop: City name, Dates, # Activities
2. **Main area** (right panel):
   - Selected stop's activities by day
   - DnD reordering of activities within a stop
   - "Add Activity" button → opens activity search modal
3. **Activity card in builder**:
   - Name, Time, Cost, Status badge
   - Edit/Delete buttons

**DnD:** Use `@dnd-kit/core` + `@dnd-kit/sortable`
- Drag stops to reorder → `PATCH /api/trips/:id/stops/reorder`
- Drag activities → `PATCH /api/trips/:id/stops/:stopId/activities/reorder`

---

### Phase 6 – City Search
**File:** `client/src/pages/cities/CitiesPage.jsx`

Build:
- Hero search bar at top
- Filter sidebar:
  - Country dropdown
  - Region
  - Cost index slider (1–5)
  - Sort: Popularity / Name / Cost
- City cards grid (responsive)
- Each card: Image, City name, Country, Cost index badge, Popularity bar
- "Add to Trip" button → opens "select trip + stop" modal

**CityCard component:** `client/src/components/features/CityCard.jsx`
**API:** `GET /api/cities?search=&country=&page=`

---

### Phase 6 – Activity Search
**File:** `client/src/pages/activities/ActivitiesPage.jsx`

Build:
- Search bar
- Category filter chips: Sightseeing · Food · Adventure · Culture · Shopping · Nature · Entertainment · Nightlife
- Cost range filter
- Duration filter
- Activity cards grid
- Each card: Image, Name, Category badge, Duration, Cost, Rating stars
- "Add to Stop" button → opens stop selector modal

**ActivityCard component:** `client/src/components/features/ActivityCard.jsx`
**API:** `GET /api/activities?category=&cityId=&search=`

---

## 👤 KUSHAL – Auth + Budget + Calendar

### Phase 2 – Login
**File:** `client/src/pages/auth/LoginPage.jsx`

Form fields (React Hook Form + Zod):
- Email
- Password (with show/hide toggle)
- Remember Me checkbox
- Forgot Password link → `/forgot-password`
- Submit button with loading state
- "Don't have account?" → `/register`

**Redux action:** `dispatch(loginUser({ email, password }))`
On success → navigate to `/dashboard`

---

### Phase 2 – Register
**File:** `client/src/pages/auth/RegisterPage.jsx`

Fields:
- Name
- Email
- Password (show/hide)
- Confirm Password
- Submit
- "Already have account?" → `/login`

**Redux action:** `dispatch(registerUser(...))`

---

### Phase 2 – Forgot Password
**File:** `client/src/pages/auth/ForgotPasswordPage.jsx`

Field: Email
On submit → show "Check your email" success state
**API:** `POST /api/auth/forgot-password`

---

### Phase 2 – Reset Password
**File:** `client/src/pages/auth/ResetPasswordPage.jsx`

Fields: New Password, Confirm Password
Token from URL params: `/reset-password/:token`
**API:** `POST /api/auth/reset-password/:token`

---

### Phase 7 – Budget
**File:** `client/src/pages/budget/BudgetPage.jsx`

Sections:
1. **Summary bar**: Total budget vs Spent vs Remaining (progress bar)
2. **Over-budget warning** (if spent > budget)
3. **Category breakdown** (pie/donut chart with Recharts)
4. **Expense list** (table: Date · Description · Category · Amount)
5. **Add Expense** button → modal form
6. **Bar chart** – daily spending over trip dates

**Components to build:**
- `ExpenseFormModal.jsx` – create/edit expense
- `BudgetSummaryCard.jsx` – the top summary
- `ExpenseCategoryChart.jsx` – Recharts pie chart
- `DailySpendChart.jsx` – Recharts bar chart

**APIs:**
- `GET /api/expenses/trip/:tripId`
- `POST /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`

---

### Phase 8 – Calendar / Timeline
**File:** `client/src/pages/calendar/CalendarPage.jsx`

Build TWO views (toggle button):
1. **Timeline view** – vertical day-by-day list with activity cards per day
2. **Calendar view** – monthly grid with colored activity dots

Features:
- Day header: Date, City name
- Activity blocks: Time range, Name, Category color
- Click activity → quick edit modal
- Drag to reorder within a day (dnd-kit)

---

## 🔗 Shared Components (ALL TEAM)

These are already scaffolded in `client/src/components/ui/`:
- `Button.jsx` – variants: primary, secondary, outline, accent, danger, ghost
- `Input.jsx` – with label, error, hint, left/right icons
- `Modal.jsx` – with escape-to-close, overlay click
- `SearchBar.jsx` – with clear button
- `EmptyState.jsx` – icon, title, description, action
- `ErrorState.jsx` – retry button
- `LoadingSpinner.jsx` – 4 sizes

**To build (any team member can create these):**
- `TripCard.jsx` – `client/src/components/features/`
- `CityCard.jsx` – `client/src/components/features/`
- `ActivityCard.jsx` – `client/src/components/features/`
- `BudgetCard.jsx` – `client/src/components/features/`

---

## 🚀 How to Run

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017
- Git

### 1. Clone & install

```bash
# Clone the repo
git clone <repo-url>
cd globetrotter

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Install seed dependencies (optional, for seeding)
cd ../seed && npm install
```

### 2. Setup environment

```bash
# Server .env is already created at server/.env
# Verify MONGO_URI points to your local MongoDB
```

### 3. Seed database (IMPORTANT – do this first!)

```bash
cd seed
node seed.js
```

This creates:
- 20 cities (Indian + International)
- Activities for each city
- Demo user: `demo@globetrotter.com` / `demo123`
- Admin user: `admin@globetrotter.com` / `admin123`
- 1 demo public trip

### 4. Start backend

```bash
cd server
npm run dev     # starts on http://localhost:5000
```

### 5. Start frontend

```bash
cd client
npm run dev     # starts on http://localhost:5173
```

### 6. Open browser

- **App:** http://localhost:5173
- **API:** http://localhost:5000/api/health

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register user |
| POST | `/api/auth/login` | ❌ | Login |
| GET  | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/auth/forgot-password` | ❌ | Request reset link |
| POST | `/api/auth/reset-password/:token` | ❌ | Reset password |

### Trips
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/trips` | ✅ | Get all user trips |
| POST | `/api/trips` | ✅ | Create trip |
| GET | `/api/trips/:id` | ✅ | Get trip detail |
| PUT | `/api/trips/:id` | ✅ | Update trip |
| DELETE | `/api/trips/:id` | ✅ | Delete trip |
| POST | `/api/trips/:id/duplicate` | ✅ | Duplicate trip |
| PATCH | `/api/trips/:id/publish` | ✅ | Toggle public |

### Cities
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cities` | ❌ | List with filters |
| GET | `/api/cities/popular` | ❌ | Top 12 popular |
| GET | `/api/cities/:id` | ❌ | City detail |

### Activities
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/activities` | ❌ | List with filters |
| GET | `/api/activities/city/:cityId` | ❌ | Activities by city |
| GET | `/api/activities/:id` | ❌ | Activity detail |

### Expenses
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/expenses/trip/:tripId` | ✅ | Trip expenses |
| POST | `/api/expenses` | ✅ | Add expense |
| PUT | `/api/expenses/:id` | ✅ | Update expense |
| DELETE | `/api/expenses/:id` | ✅ | Delete expense |

### Public
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/public/trip/:slug` | ❌ | View public trip |
| POST | `/api/public/trip/:slug/copy` | ✅ | Copy to my trips |

---

## 🎨 Design System

All shared styles are in `client/src/index.css`.

### Color Classes
```
Primary: primary-{50-950}    (indigo/violet)
Accent:  accent-{50-900}     (orange)
Surface: surface-{50-950}    (slate grays)
Success: success-{50-700}    (green)
Danger:  danger-{50-700}     (red)
Warning: warning-{50-600}    (amber)
```

### Component Classes
```css
.card              → white rounded-2xl with shadow
.card-hover        → card + hover lift animation
.btn               → base button
.btn-primary       → indigo filled button
.btn-outline       → bordered button
.input             → form input field
.badge-{variant}   → status badges
.sidebar-item      → nav link in sidebar
.empty-state       → centered empty state container
.stat-card         → stats card with icon
.modal-overlay     → full-screen modal backdrop
.chip              → filter pill/tag
```

### Typography
```css
font-sans    → Inter (body text)
font-display → Poppins (headings)
```

---

## 📋 Git Workflow

```bash
# Create your feature branch
git checkout -b feature/raj-trips

# Work on your feature
# Commit often!
git add .
git commit -m "feat: add trip card component"

# Push and create PR
git push origin feature/raj-trips
```

### Branch naming
- `feature/prayag-dashboard-profile`
- `feature/raj-trips`
- `feature/jinay-itinerary-discovery`
- `feature/kushal-auth-budget`

---

## ✅ Phase Checklist

- [x] **Phase 1** – Project structure & base architecture setup
- [ ] **Phase 2** – Auth (Kushal)
- [ ] **Phase 3** – Dashboard (Prayag)
- [ ] **Phase 4** – Trips CRUD (Raj)
- [ ] **Phase 5** – Itinerary Builder (Jinay)
- [ ] **Phase 6** – City + Activity Search (Jinay)
- [ ] **Phase 7** – Budget (Kushal)
- [ ] **Phase 8** – Calendar (Kushal)
- [ ] **Phase 9** – Public Sharing (Prayag)
- [ ] **Phase 10** – Profile + Admin (Prayag)
- [ ] **Phase 11** – Responsive polish (All)
- [ ] **Phase 12** – Final README + cleanup (All)

---

## 🆘 Common Issues

**MongoDB not connecting?**
```bash
# Start MongoDB service
mongod --dbpath /data/db
# Or on Windows:
net start MongoDB
```

**Port already in use?**
```bash
# Kill port 5000
npx kill-port 5000
# Kill port 5173
npx kill-port 5173
```

**Vite can't find modules?**
```bash
cd client && npm install
```

**API calls failing?**
- Check server is running on port 5000
- Check MongoDB is running
- Check `.env` has correct `MONGO_URI`

---

*GlobeTrotter – Built by Prayag, Raj, Jinay, and Kushal*
