Sports Turf and Court Booking System
A React-based web application intended to help users discover sports turfs/courts, view venue information, check time-slot availability, and manage bookings.
Status: The linked repository currently presents a frontend folder. Backend APIs and MongoDB integration are to be added and tested. Features described as intended below should not be considered complete until connected and verified end to end.

How it is intended to work
Customer
1. Browse the available turf/court listings.
2. Search or filter venues using filters available in the UI.
3. Open a venue to view location, sport, facilities, images, and price.
4. Choose a date and time slot.
5. Register or log in if required.
6. Submit a booking. The Express backend validates the request, checks for overlapping bookings, calculates the amount, and stores it in MongoDB.
7. View booking status and cancel where allowed.
Turf owner :
1. Log in with an owner account.
2. Add a venue with details, price, images, and operating hours.
3. Manage their own venues and view related bookings.
4. Update venue details according to permissions.
Admin (if supported by the current UI)
Review users, listings, and bookings, and approve venues if an approval workflow is implemented. Admin access must be protected; do not add public admin registration or hardcoded credentials.

The final workflows and roles must match the actual React pages and implemented backend.
Technology stack
Layer	Technology	Responsibility
Frontend	React, HTML, CSS, JavaScript	UI, forms, venue browsing, booking screens
Backend	Node.js, Express.js	REST API, validation, business rules
Database	MongoDB, Mongoose	Persistent user, turf, and booking records
Authentication	JWT + bcrypt	Authentication and password hashing
API communication	REST/JSON	React-to-backend requests
Frontend hosting	Vercel	React frontend hosting


Architecture
Browser
  -> React frontend
  -> HTTP/JSON REST API
  -> Node.js + Express
  -> Mongoose
  -> MongoDB
React must never connect directly to MongoDB. Database operations happen only through the backend.
Suggested full-stack structure
Preserve the existing frontend structure; add backend files alongside it.
sports-turf-booking/
├── frontend/                 # Existing React app
│   ├── src/
│   └── package.json
├── backend/                  # To be added
│   ├── src/
│   │   ├── config/db.js
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
Suggested data collections
- Users: name, unique normalized email, password hash, role, timestamps.
- Turfs: name, description, sport types, location, images, hourly price, operating hours, amenities, owner reference, status, timestamps.
- Bookings: user reference, turf reference, date, start/end time, duration, server-calculated total, status, timestamps.
Adapt fields to the forms that already exist. Use validation and indexes where appropriate.
Prerequisites
Install Node.js LTS/npm, Git, and MongoDB locally or create a MongoDB Atlas cluster. VS Code and Postman are helpful.

Check Node/npm versions:
node -v
npm -v
Environment setup
Create backend/.env based on backend/.env.example. Typical variables:
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/sports_turf_booking
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
Use the actual local frontend URL/port shown by its development server. For Atlas, use the connection string from your Atlas database and configure its database user and network access securely.

For the frontend, use the environment-variable convention of the actual build tool. For Vite, this is commonly:
VITE_API_BASE_URL=http://localhost:5000/api
Create React App commonly uses REACT_APP_API_BASE_URL instead. Check frontend/package.json before choosing. Frontend variables are exposed in the browser: never put MongoDB credentials or JWT signing secrets there.

Never commit .env files or real secrets to GitHub.
Run locally
These commands assume the backend has been implemented and scripts are configured. Run each part in a separate terminal.

Terminal 1 — backend
cd backend
npm install
npm run dev
Use npm start if that is the script provided by the backend package.json.

Terminal 2 — frontend
cd frontend
npm install
npm run dev
Open the local URL printed in the terminal. Follow the actual package scripts if they differ.
Typical API routes
These are proposed examples only. Update this list after implementation to match the real routes.
Method	Example endpoint	Purpose
POST	/api/auth/register	Register
POST	/api/auth/login	Log in
GET	/api/auth/me	Current user
GET	/api/turfs	List/search turfs
GET	/api/turfs/:id	Turf details
POST	/api/turfs	Create turf (authorized owner/admin)
PATCH	/api/turfs/:id	Update authorized turf
DELETE	/api/turfs/:id	Delete when permitted
GET	/api/turfs/:id/availability	Check slot availability
POST	/api/bookings	Create booking
GET	/api/bookings/my	Current user's bookings
PATCH	/api/bookings/:id/cancel	Cancel when permitted


Important booking validations
- Reject invalid or past dates and invalid time ranges.
- Ensure the selected slot is within venue operating hours.
- Calculate the total price on the server.
- Reject overlapping bookings for the same venue/date/time.
- Users must only access their own bookings; owners must only manage their own turfs and associated bookings unless admin permissions apply.
- Enforce permissions on the backend, not only by hiding React buttons.
Testing checklist
- [ ] Register and log in with valid credentials.
- [ ] Reject duplicate emails and invalid credentials.
- [ ] Ensure protected routes reject unauthenticated requests.
- [ ] Browse venue listings and view venue details.
- [ ] Verify owner permissions for creating/updating venues.
- [ ] Create a valid booking and view it in booking history.
- [ ] Try an overlapping booking and confirm it is rejected.
- [ ] Verify invalid dates, times, and unauthorized cancellations are rejected.
- [ ] Confirm loading, empty, success, and error states work in React.
- [ ] Test the deployed frontend against the deployed backend with correct CORS settings.
Deployment
React frontend on Vercel
1. Connect the repository/project to Vercel.
2. Configure the frontend root directory and build command based on frontend/package.json.
3. Set the frontend API base URL to the deployed backend URL.
4. Redeploy after changing environment variables.
Backend
Deploy the backend to a Node.js-compatible hosting provider. Configure MONGODB_URI, JWT_SECRET, CLIENT_ORIGIN, PORT, and NODE_ENV in the provider's environment settings. Allow only the intended frontend origin in production CORS.
MongoDB Atlas
Create a database and database user, configure network access, and store the Atlas connection string in the backend's MONGODB_URI setting. Keep credentials private.
Security notes
- Hash passwords with bcrypt; never store plaintext passwords.
- Protect private endpoints with authentication and role checks.
- Validate all inputs and do not trust client-provided prices or ownership IDs.
- Restrict production CORS to the intended frontend origin.
- Do not commit secrets or expose backend secrets in frontend code.
- Do not claim payment processing is available unless a real provider has been integrated and tested.
Future improvements
Potential additions include verified listings, ratings/reviews, notifications, booking reminders, image uploads, analytics, an admin approval dashboard, and payment integration.
Repository
https://github.com/Mounika4207/sports-turf-booking
