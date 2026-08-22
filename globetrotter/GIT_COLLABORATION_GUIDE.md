# 🚀 GlobeTrotter – Git Collaboration & Branching Guide

This guide explains how **Prayag, Raj, Jinay, and Kushal** will collaborate on this repository smoothly without conflicts.

Repository: **`https://github.com/Akbari-Prayag/LD-x-ODOO.git`**

---

## 🌿 Branch Structure

| Branch | Assigned To | Features / Modules |
|---|---|---|
| **`main`** | **All (Production Base)** | Stable codebase — all completed features merge here |
| **`feature/prayag-dashboard-profile`** | **Prayag** | Setup, Dashboard, Public Trip View, Profile, Admin |
| **`feature/raj-trips`** | **Raj** | My Trips, Create Trip, Edit Trip, Trip Detail |
| **`feature/jinay-itinerary-discovery`** | **Jinay** | Itinerary Builder (DnD), City Search, Activity Search |
| **`feature/kushal-auth-budget`** | **Kushal** | Auth (Login, Register, Forgot Password), Budget & Charts, Calendar |

---

## 👑 Part 1: First-Time Setup for PRAYAG (Repository Owner)

The repository has already been initialized and committed on your machine with all 4 branches created locally!

To push `main` and all feature branches to GitHub, run these commands in your PowerShell / Terminal:

```powershell
# 1. Push main branch to GitHub
git push -u origin main

# 2. Push all 4 feature branches to GitHub
git push -u origin feature/prayag-dashboard-profile
git push -u origin feature/raj-trips
git push -u origin feature/jinay-itinerary-discovery
git push -u origin feature/kushal-auth-budget
```

*(If you ever want to push all branches in one shot: `git push --all origin`)*

---

## 👥 Part 2: Step-by-Step Guide for RAJ, JINAY, and KUSHAL

### Step 1: Clone the repository to your computer
Open your terminal (or VS Code) in your workspace folder and run:

```bash
# Clone the repository
git clone https://github.com/Akbari-Prayag/LD-x-ODOO.git
cd LD-x-ODOO
```

### Step 2: Install dependencies (one-time)
```bash
# Install backend packages
cd globetrotter/server
npm install

# Setup .env file
cp .env.example .env

# Install frontend packages
cd ../client
npm install

# (Optional) Seed the database
cd ../seed
npm install
node seed.js
```

### Step 3: Switch to YOUR assigned feature branch

#### 👤 If you are **Raj**:
```bash
git checkout feature/raj-trips
```

#### 👤 If you are **Jinay**:
```bash
git checkout feature/jinay-itinerary-discovery
```

#### 👤 If you are **Kushal**:
```bash
git checkout feature/kushal-auth-budget
```

#### 👤 If you are **Prayag**:
```bash
git checkout feature/prayag-dashboard-profile
```

Check your active branch with:
```bash
git branch
```

---

## 🔄 Part 3: Daily Coding & Commit Workflow

Follow these 4 steps every time you work on a feature:

### 1. Always pull latest updates from `main` before starting
Before you start coding for the day, make sure you have the newest shared code from `main`:

```bash
# Make sure you are on your feature branch
git checkout feature/<your-branch-name>

# Fetch and merge latest main into your branch
git pull origin main
```

### 2. Make your code changes
Edit your assigned files (refer to `globetrotter/team_tasks.md` for exact file assignments).

### 3. Stage and commit your changes
```bash
# Check modified files
git status

# Stage changes
git add .

# Commit with a clear descriptive message
git commit -m "feat(trips): implement trip creation form with zod validation"
```

### 4. Push your changes to your feature branch on GitHub
```bash
git push origin feature/<your-branch-name>
```

> ⚠️ **NEVER** run `git push origin main` directly from your local branch. Always push to your `feature/...` branch!

---

## 🔀 Part 4: Merging Your Code into `main` (Pull Request)

Once your feature or phase is working and tested:

### Method A: Via GitHub Pull Request (Recommended for Teamwork)
1. Go to repository on GitHub: [https://github.com/Akbari-Prayag/LD-x-ODOO](https://github.com/Akbari-Prayag/LD-x-ODOO)
2. Click **"Pull requests"** → **"New pull request"**.
3. Set **base: `main`** and **compare: `feature/<your-branch-name>`**.
4. Click **"Create pull request"**, add a title like *"feat: Raj - Trip CRUD complete"*.
5. Prayag (or team) reviews the code and clicks **"Merge pull request"** → **"Confirm merge"**.

### Method B: If merging locally on Prayag's machine
```bash
# Switch to main
git checkout main

# Pull latest main
git pull origin main

# Merge the teammate's branch
git merge feature/raj-trips

# Push merged main to GitHub
git push origin main
```

---

## 🛡️ Best Practices to Prevent Merge Conflicts

1. **Strict File Ownership**: Stick to the files assigned in `globetrotter/team_tasks.md`.
2. **Never edit `package.json` simultaneously**: If you need a new npm package, tell the team first.
3. **Commit often**: Small, frequent commits are much easier to merge than one huge commit at the end.
4. **Pull `main` regularly**:
   ```bash
   git checkout feature/<your-branch>
   git pull origin main
   ```
5. **Never commit `.env` or `node_modules`**: Both are already excluded by `.gitignore`.

---

## 🧪 Quick Test: Running Frontend and Backend

```bash
# Terminal 1: Backend (Express + MongoDB)
cd globetrotter/server
npm run dev

# Terminal 2: Frontend (React + Vite)
cd globetrotter/client
npm run dev
```

- **Frontend URL:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/health
- **Demo User:** `demo@globetrotter.com` / `demo123`
- **Admin User:** `admin@globetrotter.com` / `admin123`
