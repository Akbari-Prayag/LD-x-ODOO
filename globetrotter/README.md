# 🌍 GlobeTrotter

> **Plan your perfect trip. Discover cities. Track your budget. Share your adventures.**

A full-stack MERN travel planning application built for college hackathon / portfolio demonstration.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local) running on port 27017

### Installation

```bash
# 1. Clone
git clone <your-repo-url>
cd globetrotter

# 2. Backend
cd server
npm install
# .env is already configured for local dev

# 3. Frontend
cd ../client
npm install

# 4. Seed database (important!)
cd ../seed
npm install
node seed.js

# 5. Run both servers
# Terminal 1:
cd server && npm run dev

# Terminal 2:
cd client && npm run dev
```

**App:** http://localhost:5173  
**API:** http://localhost:5000

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| User | `demo@globetrotter.com` | `demo123` |
| Admin | `admin@globetrotter.com` | `admin123` |

---

## ✨ Features

- 🔐 **Authentication** – Register, Login, Forgot/Reset Password (JWT)
- 🗺️ **Trip Management** – Create, Edit, Delete, Duplicate trips
- 📍 **Itinerary Builder** – Drag-and-drop cities and activities
- 🏙️ **City Discovery** – Search 20+ cities with filters
- 🎯 **Activity Search** – Filter by category, cost, duration
- 💰 **Budget Tracker** – Expense tracking with charts (Recharts)
- 📅 **Calendar View** – Timeline and calendar representation
- 🌐 **Public Sharing** – Share trips via unique public URL
- 👥 **Admin Dashboard** – User and trip analytics
- 📱 **Fully Responsive** – Mobile, tablet, desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| State | Redux Toolkit |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| DnD | @dnd-kit |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |

---

## 📁 Project Structure

```
globetrotter/
├── client/         → React frontend
├── server/         → Express backend  
├── seed/           → Database seed data
└── team_tasks.md   → Team assignments & navigation
```

See **[team_tasks.md](./team_tasks.md)** for full team guide.

---

## 👥 Team

| Member | Role |
|--------|------|
| Prayag | Lead · Dashboard · Profile · Admin |
| Raj | Trips · Create · Edit |
| Jinay | Itinerary · Cities · Activities |
| Kushal | Auth · Budget · Calendar |

---

## 📄 License

MIT – Built for educational purposes.
