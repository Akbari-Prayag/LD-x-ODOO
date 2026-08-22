# ✈️ Triply – Intelligent Multi-City Travel Planning & Expense Platform

[![Build Status](https://img.shields.io/badge/Build-Passing-emerald?style=flat-square&logo=vite)](http://localhost:5173/)
[![Frontend](https://img.shields.io/badge/Frontend-React_18_%7C_Redux_Toolkit_%7C_Tailwind_CSS-blue?style=flat-square&logo=react)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Node.js_%7C_Express_%7C_Sequelize-green?style=flat-square&logo=node.js)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-MySQL_%7C_TiDB_Cloud-orange?style=flat-square&logo=mysql)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)](LICENSE)

> **Plan Less. Experience More.**  
> Triply is an end-to-end travel operating system designed for modern travelers. Seamlessly craft multi-stop itineraries, schedule activities, convert multi-currency budgets in real-time, and share live interactive trip links.

---

## 📸 Core Highlights & Key Features

| Feature | Description |
| :--- | :--- |
| **🧭 Multi-City Route Planning** | Design multi-destination itineraries with interactive Leaflet maps, transit durations, and stop ordering. |
| **📅 Daily Itinerary Builder** | Organize activities, time windows, booking references, and custom notes per destination. |
| **💰 Real-Time Expense Ledger** | Track categorized expenses (stays, activities, transit, dining) with live multi-currency conversion. |
| **🌟 Curated Experiences Directory** | Search and filter 20+ world destinations and verified local tours by category, price, and duration. |
| **🔗 Public Trip Sharing** | Generate read-only public itinerary links with one-click cloning into personal travel dashboards. |
| **👤 Account & Security Suite** | Personal information management, password strength verification, wishlist bookmarking, and GDPR-compliant account controls. |
| **🛡️ Admin Analytics Dashboard** | Real-time system monitoring, traveler metrics, and exportable CSV itinerary reports. |

---

## 🏗️ System Architecture & Tech Stack

```
├── client/ (Vite + React 18 SPA)
│   ├── src/
│   │   ├── components/     # Reusable UI primitives, Modals, Navbar, Sidebar
│   │   ├── layouts/        # AppLayout, AuthLayout
│   │   ├── pages/          # Landing, Dashboard, Trips, Cities, Activities, Itinerary, Budget, Profile, Admin
│   │   ├── store/          # Redux Toolkit Slices (auth, trips, cities, activities, notifications, ui)
│   │   └── services/       # Axios API client with interceptors
└── server/ (Node.js Express REST API)
    ├── config/             # Database connection & Sequelize instance
    ├── controllers/        # Business logic for auth, trips, cities, activities, expenses, users, admin
    ├── middleware/         # JWT authentication, role-based authorization, error handlers
    ├── models/             # Sequelize ORM models with relational constraints
    └── routes/             # RESTful API route definitions
```

### Frontend Stack:
- **Framework**: React 18 + Vite
- **State Management**: Redux Toolkit (Thunks & Selectors)
- **Styling**: Tailwind CSS + Custom Design Tokens
- **Motion & Interactions**: Framer Motion
- **Maps**: React-Leaflet + OpenStreetMap TileLayer
- **Forms & Validation**: React Hook Form + Zod schemas
- **Notifications**: React Hot Toast

### Backend Stack:
- **Runtime**: Node.js (v18+)
- **Server Framework**: Express.js
- **ORM & Database**: Sequelize ORM on Cloud MySQL (TiDB Cloud)
- **Authentication**: JSON Web Tokens (JWT) + Bcrypt Password Hashing
- **Security**: CORS, Helmet, Input Sanitization

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 2. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/Akbari-Prayag/LD-x-ODOO.git
cd LD-x-ODOO

# Install Server Dependencies
npm --prefix "globetrotter/server" install

# Install Client Dependencies
npm --prefix "globetrotter/client" install
```

### 3. Environment Configuration
The application is pre-configured to connect to the cloud MySQL database.

Server configuration (`globetrotter/server/.env`):
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=globetrotter_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
DB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_USER=3J9AbTkXBLauhi9.root
DB_PASSWORD=mXudJe7cFkzPezU2
DB_NAME=test
DB_SSL=true
```

### 4. Running the Development Servers

```bash
# Start Backend API Server (Port 5000)
npm --prefix "globetrotter/server" run dev

# Start Frontend Client (Port 5173)
npm --prefix "globetrotter/client" run dev
```

- **Frontend Client**: [http://localhost:5173/](http://localhost:5173/)
- **Backend API Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Demo & Grading Credentials

For quick evaluation and testing, you can use either the pre-seeded demo accounts below or click **"Quick Fill"** on the login page:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Traveler** | `demo@globetrotter.com` | `demo123` | Personal Trips, Itineraries, Budget Ledger, Profile Settings |
| **Administrator** | `admin@globetrotter.com` | `admin123` | Full Access + Admin Dashboard Metrics & CSV Reports |

---

## 📡 REST API Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | No |
| `POST` | `/api/auth/register` | Register new traveler account | No |
| `GET` | `/api/trips` | Fetch all itineraries for logged-in user | Yes |
| `POST` | `/api/trips` | Create a new trip itinerary | Yes |
| `GET` | `/api/trips/:id` | Fetch complete trip with stops & activities | Yes |
| `GET` | `/api/cities` | List global destination cities with filters | No |
| `GET` | `/api/activities` | List verified experiences and tours | No |
| `GET` | `/api/public/trip/:slug` | Access public read-only itinerary link | No |
| `PUT` | `/api/users/profile` | Update profile info, currency, language | Yes |
| `PUT` | `/api/users/password` | Update account password securely | Yes |
| `GET` | `/api/admin/stats` | Retrieve platform-wide analytics | Admin Only |

---

## 🧪 Production Build & Verification

To verify production bundle compilation:
```bash
npm --prefix "globetrotter/client" run build
```
*(Build transforms 3,400+ modules with 0 errors).*

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
