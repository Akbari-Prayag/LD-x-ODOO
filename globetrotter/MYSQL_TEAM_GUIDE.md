# 🐬 MySQL Migration & Database Guide for Team (Prayag, Raj, Jinay, Kushal)

> **IMPORTANT**: The backend has been migrated from MongoDB to **MySQL with Sequelize ORM**.
> We are all using a **shared Cloud MySQL database (TiDB Cloud)**, so you do **NOT** need to install MySQL locally!

---

## ⚡ 1. Setup Your `.env` (Same for all 4 team members)

Create or open `globetrotter/server/.env` and paste this exact content:

```env
PORT=5000

# ── Shared Cloud MySQL Database (TiDB Cloud) ──
DB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_USER=3J9AbTkXBLauhi9.root
DB_PASSWORD=mXudJe7cFkzPezU2
DB_NAME=test
DB_SSL=true

JWT_SECRET=8933213426263c2cd541d9b32fa1ac95c491ebcc0704cffd7f6a166fc6db5808ee9a30b787abad7ed3a7fb94547bb2644714c10d40629c995fe175e1998ac33d
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 🔄 2. Key Differences: Mongoose vs Sequelize

If you write backend code or query the database, remember these changes:

| Concept | MongoDB / Mongoose | MySQL / Sequelize |
|---|---|---|
| **Primary Key** | `_id` (ObjectId string) | `id` (Integer: `1, 2, 3...`) |
| **Find by ID** | `Model.findById(id)` | `Model.findByPk(id)` |
| **Find One** | `Model.findOne({ email })` | `Model.findOne({ where: { email } })` |
| **Find Many** | `Model.find({ category })` | `Model.findAll({ where: { category } })` |
| **Populate / Joins** | `.populate('city')` | `include: [{ model: City, as: 'city' }]` |
| **Delete** | `Model.findByIdAndDelete(id)` | `record.destroy()` or `Model.destroy({ where: { id } })` |
| **Update** | `Model.findByIdAndUpdate(id, data)` | `record.update(data)` or `Model.update(data, { where: { id } })` |
| **Text Search** | `$regex: /pattern/i` | `[Op.like]: '%pattern%'` |
| **Array Filters** | `$gte`, `$lte` | `[Op.gte]`, `[Op.lte]` from `sequelize` |

---

## 🗄️ 3. Complete MySQL Tables & Relationships Reference

All models are exported from `globetrotter/server/models/index.js`:
```js
const { User, City, Activity, Trip, TripStop, TripActivity, Expense } = require('../models')
```

### 👤 `Users` Table
| Column | Type | Description |
|---|---|---|
| `id` | INTEGER (PK, Auto) | User ID |
| `name` | VARCHAR(50) | Full Name |
| `email` | VARCHAR(100) (Unique) | Login Email |
| `password` | VARCHAR(255) | Hashed password (bcrypt) |
| `avatar` | VARCHAR(500) | Profile picture URL |
| `role` | ENUM('user', 'admin') | Role |
| `currency` | VARCHAR(10) | Default `INR` |
| `language` | VARCHAR(10) | Default `en` |
| `isActive` | BOOLEAN | Account active status |

---

### 🏙️ `Cities` Table
| Column | Type | Description |
|---|---|---|
| `id` | INTEGER (PK, Auto) | City ID |
| `name` | VARCHAR(100) | e.g. "Paris", "Goa", "Tokyo" |
| `country` | VARCHAR(100) | e.g. "France", "India", "Japan" |
| `region` | VARCHAR(100) | State / Region |
| `description` | TEXT | City overview |
| `image` | VARCHAR(500) | Hero image URL |
| `images` | JSON | Array of image URLs |
| `costIndex` | INTEGER (1–5) | 1=Budget, 5=Luxury |
| `popularity` | INTEGER (0–100) | Popularity ranking score |
| `avgDailyCost` | FLOAT | Estimated daily expense |
| `bestMonths` | JSON | e.g. `["Nov", "Dec", "Jan"]` |
| `tags` | JSON | e.g. `["beach", "nightlife"]` |

---

### 🎯 `Activities` Table
| Column | Type | Description |
|---|---|---|
| `id` | INTEGER (PK, Auto) | Activity ID |
| `name` | VARCHAR(150) | Activity Name |
| `description` | TEXT | Activity details |
| `image` | VARCHAR(500) | Photo URL |
| `cityId` | INTEGER (FK $\rightarrow$ Cities) | Associated city |
| `category` | ENUM | `sightseeing`, `food`, `adventure`, `culture`, `shopping`, `nature`, `entertainment`, `nightlife`, `other` |
| `estimatedCost` | FLOAT | Cost in INR |
| `durationValue`| FLOAT | e.g. `2`, `4` |
| `durationUnit` | ENUM | `hours`, `minutes`, `days` |
| `ratingAverage`| FLOAT | e.g. `4.8` |
| `ratingCount`  | INTEGER | Number of reviews |

---

### 🗺️ `Trips` Table
| Column | Type | Description |
|---|---|---|
| `id` | INTEGER (PK, Auto) | Trip ID |
| `name` | VARCHAR(100) | Trip title |
| `description` | TEXT | Trip notes |
| `coverPhoto` | VARCHAR(500) | Header image |
| `startDate` | DATEONLY | e.g. `2025-01-15` |
| `endDate` | DATEONLY | e.g. `2025-01-21` |
| `budget` | FLOAT | Total budget |
| `currency` | VARCHAR(10) | `INR` |
| `status` | ENUM | `planning`, `upcoming`, `ongoing`, `completed` |
| `isPublic` | BOOLEAN | Shared publicly or private |
| `publicSlug` | VARCHAR(150) (Unique) | Unique URL slug for sharing |
| `ownerId` | INTEGER (FK $\rightarrow$ Users) | User who created the trip |
| `totalSpent` | FLOAT | Auto-calculated from expenses |

---

### 📍 `TripStops` Table (Cities visited in a trip)
| Column | Type | Description |
|---|---|---|
| `id` | INTEGER (PK, Auto) | Stop ID |
| `tripId` | INTEGER (FK $\rightarrow$ Trips) | Trip reference (Cascade on delete) |
| `cityId` | INTEGER (FK $\rightarrow$ Cities) | City reference |
| `customCityName` | VARCHAR(100) | For custom cities |
| `arrivalDate` | DATEONLY | Date arriving in city |
| `departureDate` | DATEONLY | Date leaving city |
| `notes` | TEXT | Accommodation / notes |
| `order` | INTEGER | Sorting order in itinerary |
| `accommodationName` | VARCHAR(150) | Hotel / Airbnb name |
| `accommodationCost` | FLOAT | Stay cost |

---

### 🕒 `TripActivities` Table (Scheduled activities within a stop)
| Column | Type | Description |
|---|---|---|
| `id` | INTEGER (PK, Auto) | Scheduled activity ID |
| `tripStopId` | INTEGER (FK $\rightarrow$ TripStops) | Stop reference |
| `tripId` | INTEGER (FK $\rightarrow$ Trips) | Trip reference |
| `activityId` | INTEGER (FK $\rightarrow$ Activities) | Activity reference (nullable) |
| `customName` | VARCHAR(150) | If manually entered |
| `customCost` | FLOAT | Cost |
| `scheduledDate` | DATEONLY | Scheduled date |
| `startTime` | VARCHAR(20) | e.g. `10:00` |
| `endTime` | VARCHAR(20) | e.g. `12:30` |
| `status` | ENUM | `planned`, `booked`, `completed`, `cancelled` |
| `order` | INTEGER | Order within the day |

---

### 💰 `Expenses` Table
| Column | Type | Description |
|---|---|---|
| `id` | INTEGER (PK, Auto) | Expense ID |
| `tripId` | INTEGER (FK $\rightarrow$ Trips) | Trip reference |
| `tripStopId` | INTEGER (FK $\rightarrow$ TripStops) | Stop reference (optional) |
| `userId` | INTEGER (FK $\rightarrow$ Users) | User who paid |
| `description` | VARCHAR(200) | Expense description |
| `amount` | FLOAT | Amount spent |
| `category` | ENUM | `transport`, `stay`, `activities`, `meals`, `other` |
| `date` | DATEONLY | Date spent |
| `receipt` | VARCHAR(500) | Receipt photo URL (optional) |

---

## 💻 4. Frontend Tips: Working with MySQL Data

In React components:
1. **IDs**: Always access item IDs using `item.id` (e.g. `trip.id`, `city.id`, `activity.id`).
2. **Foreign Keys**: Associated models come nested in JSON responses:
   - Trip stops: `trip.stops`
   - Stop city: `stop.city.name`
   - Stop activities: `stop.activities`
   - Activity details: `tripActivity.activity.name`

---

## 🚀 5. How to Start Working

```bash
# Pull the latest changes
git checkout feature/<your-branch-name>
git pull origin main

# Start Backend
cd globetrotter/server
npm run dev

# Start Frontend (in separate terminal)
cd globetrotter/client
npm run dev
```

* **Frontend**: http://localhost:5173
* **Demo Logins**:
  - `demo@globetrotter.com` / `demo123`
  - `admin@globetrotter.com` / `admin123`
