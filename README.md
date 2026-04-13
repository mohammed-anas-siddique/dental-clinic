# Bright Smile — Dental Clinic (Full-Stack Example)

This repository contains a small full-stack dental clinic website (frontend + backend).

Quick overview:
- Frontend: static HTML/CSS/JS in `frontend/`
- Backend: Express server that saves appointment requests to `backend/appointments.json` (no SMTP or .env required)

Setup (Windows / macOS / Linux):

1. Install Node.js (v14+ recommended).
2. Install backend dependencies and start server:

```bash
cd backend
npm install
npm start
```

3. Open your browser to http://localhost:3000 — the backend serves the frontend static files.

How appointments are handled:
- When users submit the appointment form, the backend stores appointment entries in `backend/appointments.json`.
- No email is sent by default; this keeps the project self-contained and avoids SMTP configuration.

Files of interest:
- `frontend/index.html` — Main UI (hero, services, appointment form, contact)
- `frontend/styles.css` — Styling and responsive layout
- `frontend/script.js` — Client-side validation + POST to `/send-appointment`
- `backend/server.js` — Express server and `/send-appointment` implementation (stores appointments locally)
- `backend/appointments.json` — Created when the first appointment is saved
- `backend/package.json` — Dependencies and start/dev scripts

If you want email sending later, I can add a toggle and a simple local SMTP stub or file-based queue.

Security reminder: Do not commit sensitive credentials. This project no longer requires them.
