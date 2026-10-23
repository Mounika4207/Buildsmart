# PlayArena — Sports Turf & Court Booking System (Frontend)

PlayArena is a sports-tech ground reservation platform developed using React.js (Vite), React Router, and Axios. It allows athletes to discover and book verified cricket pitches, football astro turfs, indoor badminton courts, basketball courts, and pickleball arenas in real time.

---

## 🚀 Getting Started (Windows PowerShell)

### Prerequisites
- Node.js (v18+ or v22+)
- npm (v9+)

### Installation & Execution
Open Windows PowerShell and navigate to the project directory:

```powershell
# 1. Navigate to the frontend directory
cd C:\Users\Kmoun\.gemini\antigravity\scratch\sports-turf-booking\frontend

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the development server
npm run dev
```

The Vite dev server will start at:
👉 **`http://localhost:5173`**

To build for production:
```powershell
npm run build
```

---

## 🎨 Design System & Theme
- **Theme Foundation**: Deep charcoal and night navy (`#0a0f1d`, `#111a2e`).
- **Brand Accent**: Electric sports lime (`#10ef8c`, `#0cd67c`).
- **Surface Accents**: Semi-transparent dark cards (`rgba(255, 255, 255, 0.04)`), crisp borders (`rgba(255, 255, 255, 0.08)`), and soft neon glows.
- **Typography**: Google Fonts `Outfit` (for punchy sports headings) and `Plus Jakarta Sans` (for clean, legible body text).
- **Icons**: Lucide Icons (`lucide-react`).

---

## 📁 Project Architecture & Folder Structure

```
frontend/
├── src/
│   ├── assets/                # Static brand assets and SVGs
│   ├── components/
│   │   ├── common/            # Reusable UI elements
│   │   │   ├── ProtectedRoute.jsx   # Authentication route guard with return-path preservation
│   │   │   ├── RoleGuard.jsx       # Role-based authorization guard (Customer/Owner/Admin)
│   │   │   ├── StatusBadge.jsx     # Booking, payment, and verification status badges
│   │   │   ├── LoadingSkeleton.jsx # Pulse skeleton loader for async data
│   │   │   ├── EmptyState.jsx      # Generic empty state with custom action CTA
│   │   │   ├── ErrorState.jsx      # Network / API error state with retry button
│   │   │   ├── Modal.jsx           # Accessible dialog with ESC listener & backdrop
│   │   │   ├── ConfirmDialog.jsx   # Sensitive action confirmation modal
│   │   │   └── StatCard.jsx        # Metric highlight cards for dashboards
│   │   ├── layout/
│   │   │   ├── Navbar.jsx          # Sticky responsive navigation with role dropdown & mobile drawer
│   │   │   ├── Footer.jsx          # Clean sports tech footer with demo support placeholders
│   │   │   └── DashboardSidebar.jsx# Role-aware sidebar for Customer, Owner, and Admin
│   │   ├── turf/
│   │   │   ├── TurfCard.jsx        # Facility card with image, sports, verified badge, rating & price
│   │   │   ├── SportCategoryCard.jsx# Interactive category cards (Cricket, Football, Badminton, etc.)
│   │   │   ├── SearchBar.jsx       # Search form with location, sport, date, duration
│   │   │   └── FilterPanel.jsx     # Faceted filters for sport, city, price range, and sorting
│   │   ├── booking/
│   │   │   ├── TimeSlotGrid.jsx    # Interactive hourly slot grid with available/booked/blocked states
│   │   │   ├── PriceSummary.jsx    # Authoritative breakdown of base rate, duration, fees, total INR
│   │   │   └── BookingCard.jsx     # Reservation card with status badges and cancellation trigger
│   │   └── forms/
│   │       └── FormInput.jsx       # Input component with show/hide password and validation errors
│   ├── pages/
│   │   ├── Home.jsx                # Public landing page with hero, search, sports, and featured turfs
│   │   ├── ExploreTurfs.jsx        # Search & filter marketplace with query params and grid/list view
│   │   ├── TurfDetails.jsx         # Facility detail page, gallery, amenities, GPS map, and slot picker
│   │   ├── Login.jsx               # Sign in page with preset demo accounts for evaluation
│   │   ├── Register.jsx            # Sign up with role selection (Customer vs Turf Owner)
│   │   ├── ForgotPassword.jsx      # Password reset link request form
│   │   ├── BookingCheckout.jsx     # Checkout summary, player details, and payment mode selection
│   │   ├── BookingConfirmation.jsx # Confirmed reservation receipt with reference code
│   │   ├── CustomerDashboard.jsx   # Customer overview with metrics and upcoming matches
│   │   ├── MyBookings.jsx          # Customer booking history with tab filters (All/Upcoming/Past/Cancelled)
│   │   ├── Profile.jsx             # User profile details and security architecture note
│   │   ├── OwnerDashboard.jsx      # Turf owner overview with occupancy, bookings, and revenue
│   │   ├── OwnerTurfs.jsx          # Owner facilities list with edit, delete, and verification status
│   │   ├── AddEditTurf.jsx         # Facility creation and edit form
│   │   ├── OwnerBookings.jsx       # Owner booking filterable table by turf, date, and status
│   │   ├── OwnerSchedule.jsx       # Owner daily slot matrix with manual maintenance slot blocking
│   │   ├── AdminDashboard.jsx      # Super admin governance metrics and pending review queue
│   │   ├── AdminTurfs.jsx          # Facility audit and verification approval/rejection console
│   │   ├── AdminUsers.jsx          # Platform user directory with role filters
│   │   └── NotFound.jsx            # 404 Out-of-bounds error page
│   ├── layouts/
│   │   ├── MainLayout.jsx          # Layout for public and booking pages
│   │   ├── AuthLayout.jsx          # Centered card layout for authentication
│   │   └── DashboardLayout.jsx     # Two-column layout with sidebar for user portals
│   ├── services/
│   │   ├── api.js                  # Axios client with JWT interceptor and base URL
│   │   ├── authService.js          # Authentication endpoints (login, register, session check)
│   │   ├── turfService.js          # Turf API methods (list, get, slots, owner CRUD, admin audit)
│   │   ├── bookingService.js       # Booking API methods (create, customer list, cancel, owner schedule)
│   │   └── reviewService.js        # Venue review and rating endpoints
│   ├── context/
│   │   ├── AuthContext.jsx         # Global authentication state, session storage, and role validation
│   │   └── ToastContext.jsx        # Non-intrusive alert notification popup system
│   ├── data/
│   │   └── mockData.js             # Realistic fallback data for local college demonstration
│   ├── utils/
│   │   └── formatters.js           # Formatters for INR (₹), dates, times, and status badges
│   ├── App.jsx                     # Route definitions and provider wiring
│   ├── main.jsx                    # React 19 root bootstrap
│   └── index.css                   # Global CSS design tokens, reset, and animation styles
├── .env                            # API base URL (`VITE_API_BASE_URL`) & demo fallback toggle
├── .env.example
├── index.html                      # HTML entry with sports meta and Google Fonts
├── package.json
└── vite.config.js
```

---

## 🔑 Demo Accounts for Faculty & Recruiter Evaluation

When evaluating the project before the backend server is running, the frontend automatically falls back to clean mock data labeled with the `COLLEGE PROJECT` demo indicator banner. You can quickly sign in with the following demo credentials on the `/login` screen:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Customer** | `aditya@example.com` | Any (e.g. `password123`) | Book turfs, view `/dashboard`, manage `/my-bookings`, cancel slots |
| **Turf Owner** | `rajesh.owner@playarena.example` | Any | Access `/owner/dashboard`, manage `/owner/turfs`, block slots in `/owner/schedule` |
| **Super Admin** | `admin@playarena.example` | Any | Access `/admin/dashboard`, approve/reject turfs in `/admin/turfs`, view `/admin/users` |

*(Quick-fill buttons are provided directly on the Login page for convenience during evaluation).*

---

## 🔌 Backend API Alignment Guide

Configure your backend API base URL in `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Required Backend Endpoints

| Method | Endpoint | Description | Consuming Frontend Module |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | User sign-up (Customer / Turf Owner) | `authService.register` |
| `POST` | `/auth/login` | User login (returns JWT token and user record) | `authService.login` |
| `GET` | `/auth/me` | Fetch currently authenticated user session | `authService.getMe` |
| `POST` | `/auth/forgot-password` | Dispatches password reset email | `authService.forgotPassword` |
| `GET` | `/turfs` | Fetch turfs with query filters (`search`, `sport`, `city`, `minPrice`, `maxPrice`, `sort`) | `turfService.getAllTurfs` |
| `GET` | `/turfs/featured` | Fetch top-rated verified turfs for Home page | `turfService.getFeaturedTurfs` |
| `GET` | `/turfs/:id` | Fetch single turf details | `turfService.getTurfById` |
| `GET` | `/turfs/:id/availability` | Fetch time slots with availability for a specific `date` | `turfService.getTurfAvailability` |
| `GET` | `/turfs/:id/reviews` | Fetch player reviews for a turf | `reviewService.getTurfReviews` |
| `POST` | `/bookings` | Create new reservation with slot locking & authoritative price check | `bookingService.createBooking` |
| `GET` | `/bookings/my` | Retrieve bookings for logged-in customer | `bookingService.getMyBookings` |
| `GET` | `/bookings/:id` | Retrieve single booking details for confirmation page | `bookingService.getBookingById` |
| `PATCH` | `/bookings/:id/cancel` | Cancel an eligible confirmed booking | `bookingService.cancelBooking` |
| `GET` | `/owner/turfs` | Retrieve facilities owned by authenticated owner | `turfService.getOwnerTurfs` |
| `POST` | `/owner/turfs` | Create a new sports facility | `turfService.createTurf` |
| `PATCH` | `/owner/turfs/:id` | Update existing facility details | `turfService.updateTurf` |
| `DELETE` | `/owner/turfs/:id` | Delete a sports facility listing | `turfService.deleteTurf` |
| `GET` | `/owner/bookings` | Retrieve reservations across owner's venues | `bookingService.getOwnerBookings` |
| `GET` | `/owner/schedule/:turfId` | Schedule matrix for owner's turf on a given `date` | `bookingService.getOwnerSchedule` |
| `GET` | `/admin/turfs` | Admin list of all turfs filterable by status | `turfService.getAdminTurfs` |
| `PATCH` | `/admin/turfs/:id/verification` | Approve or reject facility verification badge | `turfService.updateTurfVerification` |
| `GET` | `/admin/users` | List platform registered users | `AdminUsers.jsx` |
