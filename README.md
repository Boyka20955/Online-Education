Vercel Deployment(https://online-education-delta.vercel.app/)

# Online Education (E-learning)

Full-stack Online Education platform (React + Vite frontend, Node/Express + TypeScript backend, MongoDB).

This repository contains two main parts:

- Frontend: React (Vite) app in `src/` — UI, pages, components.
- Backend: Node/Express API in `Backend/` — routes, controllers, models, and DB connection.

This README explains how to set up, run, and develop both parts locally, plus an API overview and troubleshooting tips.

---

## Table of Contents

- Project structure
- Requirements
- Environment variables
- Backend setup (development)
	- Scripts
	- Running
	- API overview (notable endpoints)
- Frontend setup (development)
	- Scripts
	- Running
- Common tasks
- Troubleshooting
- Contributing
- License

---

## Project structure

Top-level files and directories (important ones):

- `src/` — Frontend React app
	- `pages/` — Page components (e.g. `PricingPage.jsx`, `AdminDashboardPage.jsx`)
	- `components/` — Reusable UI components
	- `store/` — Local auth store
	- `constant/` — Static data
- `Backend/` — Express API
	- `src/` — Backend source files
		- `controllers/` — Route handlers
		- `models/` — Mongoose models (User, Course, Pricing, Paid, Purchase, Admin)
		- `routes/` — Express routes
		- `db/` — DB connection
		- `mailtrap/` — Email helper templates (for dev/testing)

---

## Requirements

- Node.js >= 18 (LTS recommended)
- npm or yarn
- MongoDB (local or Atlas)
- Optional: Mailtrap account for email testing (the code uses a mailtrap helper in `Backend/mailtrap/`)

---

## Environment variables

Create a `.env` file in `Backend/` with the following variables:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=some_secret_key
PORT=5000
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_password
CLIENT_URL=http://localhost:5173
```

Adjust `CLIENT_URL` if the frontend runs on a different port.

---

## Backend setup (development)

1. Move to the backend folder and install dependencies:

```bash
cd Backend
npm install
```

2. Available scripts (from `Backend/package.json`):

- `npm run dev` — Run the backend in development (likely uses `ts-node` or `nodemon` depending on setup).
- `npm start` — Start the compiled/production server.

3. Run the backend (development):

```bash
cd Backend
npm run dev
```

The backend listens on `PORT` (default 5000). It exposes API routes under `/api/*`.

Notable backend endpoints (admin-protected endpoints require an `Authorization: Bearer <token>` header):

- Auth & users
	- POST `/api/auth/signup` — Register user
	- POST `/api/auth/login` — Login
	- POST `/api/auth/verify-email` — Verify account
- Admin (see `Backend/src/routes/admin.route.ts`)
	- `GET /api/admin/users` — Get all users (admin)
	- `GET /api/admin/courses` — Get courses (admin)
	- `POST /api/admin/courses` — Create course (admin)
	- `GET /api/admin/pricing` — Get pricing plans (admin)
	- `POST /api/admin/purchases` — Create a purchase record (admin)
	- `GET /api/admin/purchases` — List purchases (admin)
- Public
	- `GET /api/pricing` — Get pricing plans (public)
	- `POST /api/stkpush` — Initiate MPESA STK push (client-side uses this)

Check the `Backend/src/routes` folder for a complete list and details.

---

## Frontend setup (development)

1. From repo root, install frontend dependencies and run:

```bash
# from repo root
npm install
# or if you prefer to only install frontend deps:
# cd src && npm install

npm run dev
```

This project uses Vite; the default port is usually `5173`. The frontend communicates with the backend at `http://localhost:5000` by default (change endpoints if your backend runs elsewhere).

Available frontend features:
- Pricing page with MPESA integration (`src/pages/PricingPage.jsx`)
- Admin dashboard (`src/pages/AdminDashboardPage.jsx`) with modal forms for managing users, courses, pricing, purchases, and purchased courses.

---

## Common tasks and tips

- If you get CORS or auth issues, ensure the backend allows requests from the frontend origin and that tokens are set correctly.
- Admin flows use an `Authorization` header with an admin token — check `Backend/src/routes/admin.route.ts` for how admin tokens are verified.
- The admin dashboard expects the backend's `pricing` and `courses` endpoints to return records that include `_id` fields (Mongoose). When working with sample/static data (`src/constant/data.js`), items may have `id` instead of `_id` — the frontend tries to handle both.

Database notes
- Models are Mongoose schemas under `Backend/src/models/`. If you alter schemas, restart the backend and consider running migrations for production data.

---

## Troubleshooting

- MongoDB connection errors: verify `MONGO_URI` and network rules if using Atlas.
- Email sending fails: verify Mailtrap credentials in `.env` or use local dev email logs.
- Frontend can't reach backend: check `Backend` server is running and `CLIENT_URL` / CORS settings.
- TypeScript/compilation: backend uses TypeScript; ensure `tsconfig.backend.json` is correct if you're changing compile settings.

---



