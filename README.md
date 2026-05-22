# NerfSG — Public Website

Public-facing website for the Nerf Singapore community. Built with React + Vite, styled with Tailwind CSS, and powered by live Firestore data.

**Live site:** https://nerfsg-web.vercel.app

## Features

- **Live game data** — upcoming and past games streamed directly from Firestore via `onSnapshot`
- **Tactical HUD aesthetic** — reticle cursor, dart trail, hit markers, corner brackets, mission ticker
- **Hero + Next Op card** — live countdown to the next game with RSVP avatar stack
- **Year in Foam stats** — games run, unique operators, RSVPs with monthly sparklines, year-over-year comparison, and GitHub-style activity heatmap
- **Game Modes** — flip cards for all 6 standard formats (TDM, CTF, Domination, KotH, CD, HvZ)
- **Field Essentials** — gear and safety requirements
- **Recent Operators** — scrolling marquee of the latest RSVP'd players
- **Past Games Archive** — searchable/filterable table + photo wall with full detail modals (roster, payments, host notes)
- **Watch + Join** — YouTube playlist embed and community links
- **Activity toasts** — real-time slide-in notifications when a new game is posted or someone RSVPs
- **Singapore red theme** — `#ed1c24` accent, Saira Condensed display font, JetBrains Mono

## Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v4 |
| Database | Firebase Firestore (read-only, `onSnapshot`) |
| Auth | Firebase Anonymous Auth (for Firestore access) |
| Hosting | Vercel (auto-deploy on push to `main`) |
| Fonts | Saira Condensed · JetBrains Mono · Inter (Google Fonts) |

## Project structure

```
src/
├── components/
│   ├── AvatarChip.jsx     # Deterministic colour-coded operator avatar
│   ├── Archive.jsx        # Past games — search, filter, table/wall, detail modal
│   ├── Extras.jsx         # Sparkline, TrendsRow, YoYBlock, HeatmapCalendar
│   ├── Hud.jsx            # Reticle cursor, hit markers, brackets, ticker, toasts, countdown hooks
│   └── Navbar.jsx         # Sticky nav with React Router NavLinks
├── firebase/
│   └── config.js          # Firebase initialisation (env vars)
├── hooks/
│   └── useGamedays.js     # useAllGamedays, deriveStats, extractParticipants, toast pub/sub
└── pages/
    ├── Home.jsx           # All homepage sections
    └── ...                # Events, HvZ, GameModes, Guides, FAQ, Contact, Review2025
```

## Local development

```bash
# 1. Clone
git clone https://github.com/nerfsingapore2009/nerfsg-web.git
cd nerfsg-web

# 2. Install
npm install

# 3. Set up env — copy the example and fill in your Firebase config
cp .env.example .env.local

# 4. Dev server
npm run dev
```

### Environment variables

Create `.env.local` with your Firebase project credentials:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

## Deployment

Vercel is connected to this repo and auto-deploys every push to `main`. No manual deploy needed.

The Firestore rules (managed separately in NerfApp) must have `allow read: if true` on gamedays for the public site to work without login:

```
match /gamedays/{gamedayId} {
  allow read: if true;   // public — website reads game day history
  ...
}
```

## Related

- **NerfApp** — the full game management app (RSVP, payments, rounds, leaderboard): `nerf-singapore.web.app`
- **Firestore project** — `nerf-singapore` on Google Cloud
