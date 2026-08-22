# 🌍 GlobeTrotter

> **Plan your perfect trip. Discover cities. Track your budget. Share your adventures.**

A full-stack travel planning application built with React, Node.js, Express, and MySQL (Sequelize ORM).

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL Server (Local MySQL, XAMPP, Docker, or MySQL Workbench) running on port 3306

### Installation

```bash
# 1. Clone
git clone https://github.com/Akbari-Prayag/LD-x-ODOO.git
cd LD-x-ODOO

# 2. Backend Setup
cd globetrotter/server
npm install
cp .env.example .env
# Edit .env with your MySQL credentials (DB_USER, DB_PASSWORD)

# 3. Frontend Setup
cd ../client
npm install

# 4. Seed Database (Creates tables & demo data in MySQL automatically)
cd ../seed
npm install
node seed.js

# 5. Run both servers
# Terminal 1: Backend
cd ../server && npm run dev

# Terminal 2: Frontend
cd ../client && npm run dev
```

**Frontend:** http://localhost:5173  
**Backend API:** http://localhost:5000/api/health

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| User | `demo@globetrotter.com` | `demo123` |
| Admin | `admin@globetrotter.com` | `admin123` |

---

## ✨ Features

- 🔐 **Authentication** – Register, Login, Forgot/Reset Password (JWT + bcrypt)
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
| Database | MySQL (mysql2 + Sequelize ORM) |
| Auth | JWT + bcrypt |

---

## 📁 Project Structure

```
globetrotter/
├── client/                   → React frontend
├── server/                   → Express + MySQL backend  
│   ├── config/database.js    → Sequelize connection pool
│   ├── models/               → Sequelize models (User, Trip, City...)
│   ├── controllers/          → Business logic
│   └── routes/               → Express REST API routes
├── seed/                     → MySQL seed script
├── GIT_COLLABORATION_GUIDE.md→ Team git workflow
└── team_tasks.md             → Team assignments & navigation
```

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
