# Creator Revenue Intelligence Platform

Full-stack app for creator engagement tracking, anomaly detection, trust scoring, and fair revenue distribution.

## Stack
- Frontend: React (Vite), Tailwind CSS, Framer Motion, Recharts, Axios
- Backend: Node.js, Express, MongoDB (Mongoose), JWT auth

## Run
1. Backend setup:
   - Copy `backend/.env.example` to `backend/.env`
   - Fill `MONGO_URI` and `JWT_SECRET`
   - Run `npm run dev` inside `backend`
2. Frontend setup:
   - Copy `frontend/.env.example` to `frontend/.env`
   - Run `npm run dev` inside `frontend`

## API Overview
- Auth: `POST /api/signup`, `POST /api/login`
- Content: `POST /api/content`, `GET /api/content`
- Analytics: `GET /api/anomaly`, `GET /api/normalization`
- Revenue: `GET /api/revenue`

## Validation Highlights
- Strict role selection: `admin` or `creator`
- Unique ID format:
  - Admin: `ADMIN` + digits
  - Creator: `CREATOR` + digits
- Login requires email + password + role + unique ID exact match
