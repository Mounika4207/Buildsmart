# PlayArena — Sports Turf & Court Booking System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application designed for athletes and venue operators to discover, reserve, and manage cricket pitches, football astro-turfs, badminton courts, basketball arenas, and pickleball courts in real time.

---

## 📑 Table of Contents
1. [System Architecture](#system-architecture)
2. [Key Features](#key-features)
3. [Repository Structure](#repository-structure)
4. [Prerequisites](#prerequisites)
5. [Environment Variables](#environment-variables)
6. [Local Installation & Setup](#local-installation--setup)
7. [Database Seeding & Demo Accounts](#database-seeding--demo-accounts)
8. [Automated Testing](#automated-testing)
9. [REST API Documentation](#rest-api-documentation)
10. [Booking Conflict & Concurrency Prevention](#booking-conflict--concurrency-prevention)
11. [Deployment Guide](#deployment-guide)
12. [Limitations & Future Improvements](#limitations--future-improvements)

---

## 🏛️ System Architecture

PlayArena operates as a decoupled client-server architecture:

```
┌──────────────────────────────────────────────────────────┐
│              Client Layer (Vite + React 19)              │
│   • React Router v7 (Client SPA routing & role guards)   │
│   • Axios (HTTP client with JWT Bearer interceptor)      │
│   • Tailwind CSS + Lucide Icons (Responsive UI / UX)     │
└────────────────────────────┬─────────────────────────────┘
                             │ REST API (JSON / HTTP)
                             ▼
┌──────────────────────────────────────────────────────────┐
│          Backend Application Layer (Node + Express)       │
│   • Express.js 4 (Routing, Controller orchestration)     │
│   • Security: Helmet headers, Rate limiting, CORS        │
│   • Auth: JWT Token verification & Role-based middleware │
│   • Validators: Joi/Regex request body sanity checks     │
└────────────────────────────┬─────────────────────────────┘
                             │ Mongoose ODM (BSON)
                             ▼
┌──────────────────────────────────────────────────────────┐
│           Database Layer (MongoDB v8.0+ / Atlas)         │
│   • Users collection (bcrypt-hashed passwords)           │
│   • Turfs collection (Text index on name/city/area)      │
│   • Bookings collection (Compound index on turf+date+slot│
│   • Reviews collection (Venue ratings & comments)        │
└──────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

- **Public Marketplace**: Search by sport category (Cricket, Football, Badminton, Tennis, Basketball, Pickleball), city, area, price range, and sorting.
- **Real-Time Slot Engine**: Dynamic availability matrix showing open, booked, and maintenance-blocked slots for any selected date and duration.
- **Double-Booking Shield**: Server-side transactional conflict prevention and MongoDB compound index stopping concurrent reservations for the same court slot.
- **Authoritative Server Pricing**: Client calculations are strictly advisory; the backend recalculates price from turf base rates, duration, and taxes.
- **Multi-Role Authentication**:
  - **Customer**: Book slots, view upcoming matches, download reservation receipts, and cancel eligible bookings.
  - **Turf Owner**: Create and manage venue listings, view booking rosters, track venue revenue, and block maintenance slots.
  - **Super Admin**: Audit registered venues, approve/reject platform verification badges, and inspect user directory.

---

## 📁 Repository Structure

```
sports-turf-booking/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection handler
│   │   ├── controllers/
│   │   │   ├── adminController.js    # Super Admin management endpoints
│   │   │   ├── authController.js     # Register, Login, Me, Password reset
│   │   │   ├── bookingController.js  # Booking creation, conflict checks, cancellation
│   │   │   ├── ownerController.js    # Owner venue CRUD, schedule, & analytics
│   │   │   ├── reviewController.js   # Venue customer reviews
│   │   │   └── turfController.js     # Public turf exploration & slot availability
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT verification & authorizeRoles() guard
│   │   │   ├── errorHandler.js       # Centralized error handler & status mapper
│   │   │   └── rateLimiter.js        # Express rate-limiter for auth endpoints
│   │   ├── models/
│   │   │   ├── Booking.js            # Booking schema with reference code & status
│   │   │   ├── Review.js             # Customer review & rating schema
│   │   │   ├── Turf.js               # Facility listing schema with sports & hours
│   │   │   └── User.js               # User schema with bcrypt (10 rounds) hashing
│   │   ├── routes/
│   │   │   ├── adminRoutes.js        # Admin protected routes
│   │   │   ├── authRoutes.js         # Public authentication routes
│   │   │   ├── bookingRoutes.js      # Customer booking routes
│   │   │   ├── index.js              # Aggregated API router mounted at /api
│   │   │   ├── ownerRoutes.js        # Owner protected routes
│   │   │   └── turfRoutes.js         # Turf discovery & slot routes
│   │   ├── scripts/
│   │   │   └── seed.js               # Database seeder with sample accounts & turfs
│   │   ├── validators/
│   │   │   ├── authValidator.js      # Auth body validation schemas
│   │   │   ├── bookingValidator.js   # Slot booking validation rules
│   │   │   └── turfValidator.js      # Turf creation & update validations
│   │   └── app.js                    # Express app configuration & middleware
│   ├── tests/
│   │   └── api.test.js               # Automated integration tests (Supertest + Jest)
│   ├── .env.example                  # Backend environment variable template
│   ├── package.json
│   └── server.js                     # HTTP server entry point (PORT 5000)
├── frontend/
│   ├── src/
│   │   ├── components/               # Common UI, layouts, turf cards, booking grid
│   │   ├── context/                  # AuthContext & ToastContext
│   │   ├── layouts/                  # MainLayout, AuthLayout, DashboardLayout
│   │   ├── pages/                    # 18 Application pages (Marketplace, Dashboards, etc.)
│   │   ├── services/                 # Axios service modules (api, auth, turf, booking, admin)
│   │   ├── utils/                    # Currency, date, and status formatters
│   │   ├── App.jsx                   # Route hierarchy with role protection
│   │   ├── index.css                 # Dark theme CSS tokens
│   │   └── main.jsx
│   ├── public/
│   │   └── _redirects                # Netlify/SPA static rewrite
│   ├── .env.example                  # Frontend environment variable template
│   ├── package.json
│   ├── vercel.json                   # Vercel SPA rewrite configuration
│   └── vite.config.js
└── README.md                         # Project documentation
```

---

## ⚙️ Prerequisites

- **Node.js**: `v18.x` or `v20.x` or `v22.x` (LTS recommended)
- **npm**: `v9.x` or `v10.x`
- **MongoDB**: 
  - **Option A (Local)**: Community Server v7.0+ running locally on `mongodb://127.0.0.1:27017`
  - **Option B (Cloud)**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier cluster M0

---

## 🔐 Environment Variables

### 1. Backend (`backend/.env`)

Copy the template from `backend/.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/sports_turf_booking
JWT_SECRET=super_secret_playarena_jwt_key_2026_dev
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

| Variable | Description |
| :--- | :--- |
| `PORT` | The port Express listens on (default: `5000`) |
| `NODE_ENV` | `development`, `test`, or `production` |
| `MONGODB_URI` | MongoDB connection string (local or Atlas URI) |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens |
| `JWT_EXPIRES_IN` | Token lifespan (e.g. `7d`, `24h`) |
| `FRONTEND_URL` | Allowed origin for CORS requests from the React client |

### 2. Frontend (`frontend/.env`)

Copy the template from `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ENABLE_MOCK_FALLBACK=false
```

| Variable | Description |
| :--- | :--- |
| `VITE_API_BASE_URL` | Base URL pointing to the running backend Express API |
| `VITE_ENABLE_MOCK_FALLBACK` | Set to `false` when connecting to live backend, `true` for standalone offline demo |

---

## 🚀 Local Installation & Setup

Open two separate Windows PowerShell / Terminal windows to run both services.

### Window 1: Backend Setup & Launch

```powershell
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env

# 4. Seed the database with sample data & accounts
npm run seed

# 5. Start the backend development server
npm run dev
```

The Express API will be running at:
👉 **`http://localhost:5000`** (Health check: `http://localhost:5000/api/health`)

---

### Window 2: Frontend Setup & Launch

```powershell
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env

# 4. Start the Vite React development server
npm run dev
```

The React frontend will be running at:
👉 **`http://localhost:5173`**

---

## 👥 Database Seeding & Demo Accounts

Running `npm run seed` in the `backend/` directory populates MongoDB with 3 verified users with distinct roles, 6 realistic sports facilities across Mumbai and Bangalore, verified reviews, and sample bookings.

You can sign in immediately on the `/login` page using any of these preset accounts:

| Role | Email | Password | Allowed Capabilities |
| :--- | :--- | :--- | :--- |
| **Customer** | `aditya@example.com` | `password123` | Browse turfs, book slots, view `/dashboard`, manage `/my-bookings`, cancel bookings |
| **Turf Owner** | `rajesh.owner@playarena.example` | `password123` | Access `/owner/dashboard`, create/edit venues at `/owner/turfs`, block slots at `/owner/schedule` |
| **Super Admin** | `admin@playarena.example` | `password123` | Access `/admin/dashboard`, verify venues at `/admin/turfs`, view directory at `/admin/users` |

> [!NOTE]
> For security, the public registration endpoint `/api/auth/register` only permits registration of `customer` and `owner` accounts. Admin accounts cannot be self-registered and must be seeded or assigned directly in the database.

---

## 🧪 Automated Testing

The backend includes a comprehensive test suite built with **Jest** and **Supertest** running against an in-memory or dedicated test database.

```powershell
cd backend
npm test
```

### Test Coverage Highlights:
- **Auth Flow**: Registration, password hashing, login token issuance, role self-elevation prevention (403 for admin).
- **Turf Exploration**: Public listing, filter queries, turf detail lookup, and dynamic slot availability calculation.
- **Double-Booking Shield**: Tests 409 Conflict rejection when attempting to book an overlapping slot.
- **Authorization Guards**: Verifies that regular customers cannot perform owner or admin operations (403 Forbidden).

---

## 📡 REST API Documentation

Base URL: `http://localhost:5000/api`

### 1. Authentication (`/api/auth`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | None | Public | Register new customer or owner (`name`, `email`, `password`, `phone`, `role`) |
| `POST` | `/auth/login` | None | Public | Authenticate user; returns JWT token and sanitized user profile |
| `GET` | `/auth/me` | Bearer JWT | Any | Get currently authenticated user session |
| `POST` | `/auth/forgot-password` | None | Public | Request password reset token / link |

### 2. Turf Discovery (`/api/turfs`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/turfs` | None | Public | Filtered search (`search`, `sport`, `city`, `minPrice`, `maxPrice`, `sort`, `page`) |
| `GET` | `/turfs/featured` | None | Public | Returns top 3 rated & verified venues for home showcase |
| `GET` | `/turfs/:id` | None | Public | Get comprehensive venue details, amenities, sports, and pricing |
| `GET` | `/turfs/:id/availability` | None | Public | Calculate slot matrix for `?date=YYYY-MM-DD` and `?duration=1` |
| `GET` | `/turfs/:id/reviews` | None | Public | Get customer reviews and ratings for a venue |
| `POST` | `/turfs/:id/reviews` | Bearer JWT | Customer | Post a new rating (1–5 stars) and comment for a venue |

### 3. Bookings (`/api/bookings`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/bookings` | Bearer JWT | Customer | Reserve a slot with conflict check and authoritative price calculation |
| `GET` | `/bookings/my` | Bearer JWT | Customer | Retrieve personal booking history |
| `GET` | `/bookings/:id` | Bearer JWT | Customer / Owner / Admin | Retrieve detailed booking receipt by ID |
| `PATCH` | `/bookings/:id/cancel` | Bearer JWT | Customer / Owner / Admin | Cancel booking (frees slot, marks status as `cancelled`) |

### 4. Turf Owner Portal (`/api/owner`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/owner/turfs` | Bearer JWT | Owner / Admin | Retrieve all venues belonging to the logged-in owner |
| `POST` | `/owner/turfs` | Bearer JWT | Owner / Admin | Register a new sports facility |
| `PATCH` | `/owner/turfs/:id` | Bearer JWT | Owner / Admin | Update venue details, pricing, or operating hours |
| `DELETE` | `/owner/turfs/:id` | Bearer JWT | Owner / Admin | Delete venue listing |
| `GET` | `/owner/bookings` | Bearer JWT | Owner / Admin | Retrieve all bookings across owner-managed venues |
| `GET` | `/owner/schedule/:turfId` | Bearer JWT | Owner / Admin | Hourly schedule matrix for an owner's venue on a given date |
| `POST` | `/owner/schedule/:turfId/block` | Bearer JWT | Owner / Admin | Manually block slots for routine turf maintenance |
| `DELETE` | `/owner/schedule/:turfId/block` | Bearer JWT | Owner / Admin | Unblock maintenance slots |

### 5. Super Admin (`/api/admin`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/admin/turfs` | Bearer JWT | Admin | List all venues with verification status filter |
| `PATCH` | `/admin/turfs/:id/verification`| Bearer JWT | Admin | Set venue status to `verified` or `rejected` |
| `GET` | `/admin/users` | Bearer JWT | Admin | List registered platform users with search and role filters |

---

## 🛡️ Booking Conflict & Concurrency Prevention

Double-booking is the single most critical failure mode in ground reservation systems. PlayArena prevents double-booking through three synchronized layers:

1. **Pre-Flight Conflict Inspection (`bookingController.js`)**:
   Before a reservation is saved, the server evaluates all non-cancelled bookings for the exact same `turf` and `date`:
   ```javascript
   // Overlap check: new slot overlaps if (reqStart < existingEnd && reqEnd > existingStart)
   const hasOverlap = existingBookings.some((b) => {
     const bStart = timeStringToHours(b.startTime);
     const bEnd = timeStringToHours(b.endTime);
     return reqStart < bEnd && reqEnd > bStart;
   });
   if (hasOverlap) {
     return res.status(409).json({ message: "Selected time slot is already booked." });
   }
   ```
2. **Maintenance Block Validation**:
   Checks whether the owner marked the requested hours under `turf.blockedSlots`.
3. **Database Unique Compound Index**:
   A MongoDB compound index on `{ turf: 1, date: 1, startTime: 1, status: 1 }` prevents concurrent parallel requests from saving duplicate confirmed slots.

---

## 🚢 Deployment Guide

### Deploying Frontend to Vercel

1. Push your code to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and import your repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable in Vercel:
   - `VITE_API_BASE_URL`: `https://your-backend-app.onrender.com/api` (URL of your deployed backend)
   - `VITE_ENABLE_MOCK_FALLBACK`: `false`
5. Click **Deploy**. The `frontend/vercel.json` file ensures that all React Router routes rewrite cleanly to `/index.html` without 404 errors on browser refresh.

---

### Deploying Backend to Render / Railway

1. In the [Render Dashboard](https://render.com), create a new **Web Service** connected to your GitHub repository.
2. Configure service settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or leave default assigned by Render)
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/sports_turf_booking?retryWrites=true&w=majority` (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: A strong 64-character random string
   - `JWT_EXPIRES_IN`: `7d`
   - `FRONTEND_URL`: `https://your-project.vercel.app` (Your production Vercel frontend domain)
4. Deploy the service.

> [!TIP]
> **CORS Handling**: The backend in `backend/src/app.js` is pre-configured to automatically allow requests originating from `http://localhost:5173`, `FRONTEND_URL`, and all `https://*.vercel.app` preview deployments.

---

## 🔮 Limitations & Future Improvements

- **Payment Processing**: For educational and portfolio demonstration purposes, payments are currently simulated with instant status confirmation. Integration with real payment gateways like Razorpay or Stripe Webhooks can be plugged into `bookingController.js`.
- **OTP Verification**: Email and phone numbers are collected without active SMS/Email OTP verification.
- **Automated Refunds**: Cancellations currently mark reservations as `cancelled`; automated payout reversals are reserved for future integration.
- **Geo-distance Querying**: Current search filters by `city` and `area`; integration with MongoDB `$near` 2dsphere indexes for GPS proximity search is an optimal future enhancement.

---

## 📄 License
This project is open-source and built for educational and demonstration purposes.
