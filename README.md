# LearnPath AI — Personalized Learning Path Generator

A full-stack, AI-powered web app that turns a student's skills, interests,
and goals into a personalized weekly learning roadmap.

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Flask (Python)
- **AI:** Google Gemini API
- **Auth & Database:** Firebase Authentication + Firestore

The app runs fully out of the box in **demo mode** — no Firebase or Gemini
setup required — using browser storage and sample data. Connecting Firebase
gives you real accounts and persistent data; connecting the Flask backend +
Gemini API key upgrades Roadmap/Planner/Skill Gap/Chat from sample data to
live AI generation. The two are independent — set up either, both, or neither.

---

## 1. Quick start (zero setup, demo mode)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Sign up with any email/password (it creates a
local-only session — no real account), fill your profile, take the
assessment, and click through every page. A banner on the login/signup
pages reminds you when you're in demo mode.

## 2. Real accounts + data (Firebase)

### a. Create a Firebase project
1. Go to https://console.firebase.google.com → **Add project** → follow the prompts.
2. In the left sidebar: **Build → Authentication → Get started**. Enable
   **Email/Password** and **Google** as sign-in providers.
3. In the left sidebar: **Build → Firestore Database → Create database**.
   Start in production mode (the security rules below lock it down properly).

### b. Register a web app
1. In Project Settings (gear icon) → **Your apps** → click the `</>` (web) icon.
2. Give it any nickname, skip Firebase Hosting for now.
3. Copy the `firebaseConfig` values shown — you'll need them next.

### c. Configure the frontend
```bash
cd frontend
cp .env.example .env
```
Paste your config values into `.env`:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### d. Lock down Firestore
In Firebase Console → Firestore Database → **Rules**, paste the contents of
`firebase/firestore.rules` (already in this project) and click **Publish**.
This ensures each signed-in user can only read/write their own data.

### e. Run it
```bash
npm install
npm run dev
```
Sign up for real — you'll see the new user appear under Authentication →
Users, and their profile/roadmap/progress saved under Firestore →
`users/{their-uid}`.

## 3. Live AI generation (Flask + Gemini)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # on Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Open `.env` and add your Gemini API key (get one free at
https://aistudio.google.com/app/apikey):

```
GEMINI_API_KEY=your_key_here
```

Then run the server:

```bash
python app.py
```

The API runs at http://localhost:5000. Check it's working:
http://localhost:5000/api/health should return `{"status": "ok", "gemini_configured": true}`.

### Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite's dev server proxies `/api/*` requests to `http://localhost:5000`
(configured in `vite.config.js`), so the two run together with no extra
setup. Visit http://localhost:5173 and generate a roadmap — it will now
call Gemini for real.

---

## Project structure

```
learnpath-ai/
├── frontend/
│   ├── src/
│   │   ├── pages/          # One file per route (Home, Login, Dashboard, ...)
│   │   ├── components/     # Navbar, Footer, Card, Button, ProtectedRoute
│   │   ├── context/         # AppContext — Firebase auth + Firestore state
│   │   ├── data/            # api.js (backend calls) + mockData.js (fallback data)
│   │   ├── firebase.js      # Firebase init (auth + Firestore)
│   │   └── App.jsx          # Route definitions
│   ├── .env.example
│   └── package.json
├── backend/
│   ├── app.py               # Flask entry point
│   ├── gemini_client.py     # Gemini API wrapper
│   ├── routes/               # roadmap.py, study_plan.py, skill_gap.py, chat.py
│   ├── models/               # Placeholder for future SQL models, if ever needed
│   └── requirements.txt
├── firebase/
│   └── firestore.rules       # Security rules — deploy or paste into console
└── README.md
```

## How auth + data storage works

`AppContext.jsx` is the single source of truth for the signed-in user and
their data (profile, assessment, roadmap, progress). It automatically
detects whether Firebase is configured (`isFirebaseConfigured` in
`firebase.js`, based on your `.env`):

- **Firebase configured:** real Firebase Authentication (email/password +
  Google), with each user's data stored in Firestore at
  `users/{uid}`. `update(patch)` merges changes into that document.
- **Not configured (demo mode):** a fake local session plus `localStorage`,
  so the whole app is still fully clickable for a demo or presentation
  without any account setup.

Every page that touches auth or data goes through this context —
`Login.jsx`, `Signup.jsx`, `ForgotPassword.jsx`, `Profile.jsx`, and
`Settings.jsx` are the main ones to look at if you want to extend the data
model (e.g. add fields to the profile form).

## Customizing the AI prompts

All Gemini prompts live in `backend/routes/*.py` — edit the prompt strings
there to change roadmap structure, tone, quiz scoring logic, etc. Swap the
model in `backend/gemini_client.py` (`MODEL_NAME`) between
`gemini-1.5-flash` (fast/cheap) and `gemini-1.5-pro` (higher quality) as needed.

## Design system

| Token | Value |
|---|---|
| Background | `#F8FAFC` |
| Light blue | `#E0F2FE` |
| Mint green | `#DCFCE7` |
| Lavender | `#F3E8FF` |
| Font | Poppins |

Dark mode is available via the toggle in the navbar/Settings page (Tailwind
`class` strategy, see `tailwind.config.js`).

## Notes for submission as a college project

- The app works in three independent tiers: fully offline demo mode → real
  accounts via Firebase → live AI generation via Flask + Gemini. You can
  demo any combination, which is handy if wifi is unreliable during a
  presentation.
- Every "AI-powered" page gracefully falls back to realistic sample content
  if the backend or API key isn't available, so a live demo never breaks.
- Firestore security rules (`firebase/firestore.rules`) are included and
  documented — a good thing to mention in a viva/defense if asked about
  data security.
- Well-commented code throughout — see comments in `AppContext.jsx` and
  `firebase.js` for exactly how the demo-mode/real-mode switch works.

