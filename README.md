# 🎉 Freaky Friday Hub
 
An HR gamification platform for running Friday team activities — live scoring, team generation, role management, game selection, cheers, stars, and a curated game library. Built to production-grade standards with full Supabase persistence.
 
---
 
## Tech Stack
 
| Layer      | Technology                      |
|------------|---------------------------------|
| Framework  | React 18 + Vite 6               |
| Styling    | Tailwind CSS v4                 |
| State      | Zustand v5                      |
| Backend    | Supabase (Postgres + RLS)       |
 
---
 
## Project Structure
 

app/
├── public/
├── src/
│   ├── components/
│   │   ├── Avatar.jsx          # Gradient avatar (4 styles, size variants)
│   │   ├── GamesView.jsx       # Game library — Play Now + active game badge
│   │   ├── Hero.jsx            # Live stat cards with animated counters
│   │   ├── MembersView.jsx     # Add/remove members, team generation, inline role picker
│   │   ├── RolesView.jsx       # Interactive role assignment per member
│   │   ├── ScoresView.jsx      # Live scoring with active game banner + team rosters
│   │   ├── Toast.jsx           # Accessible toast notifications (4 types)
│   │   └── Topbar.jsx          # Sticky nav + dark mode toggle
│   ├── hooks/
│   │   └── useCountUp.js       # Animated number counter hook
│   ├── App.jsx                 # Root component + view router
│   ├── index.css               # Tailwind entry + custom keyframes + utilities
│   ├── main.jsx                # React entry point
│   ├── store.js                # Zustand store (all state + actions + Supabase sync)
│   └── supabase.js             # Supabase client singleton (demo fallback)
├── supabase/
│   └── schema.sql              # Postgres schema + RLS policies + seed games
├── .env                        # Local environment variables (not committed)
├── .env.example                # Environment variable template
├── vite.config.js
└── package.json

 
---
 
## Getting Started
 
### Prerequisites
 
- Node.js 18+
 
### Install & Run
 
bash
cd app
npm install
npm run dev

 
App runs at *http://localhost:5173*
  
---
 
## Connecting Supabase
 
1. Create a project at [supabase.com](https://supabase.com)
2. Go to *Project Settings → API* and copy your *Project URL* and *anon key*
3. Copy the env template and fill in your credentials:
   bash
   cp .env.example .env
   
   env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   
4. In Supabase → *SQL Editor → New query*, paste the contents of supabase/schema.sql and run it
5. Restart the dev server — the demo banner disappears
 
---
 
## Features
 
### Members
- Add members by name — auto-generates initials and a gradient avatar
- Remove members with hover-reveal action
- *Generate Teams* — Fisher-Yates shuffle splits the crew into Teal and Gold teams
- Session + team rows are persisted to Supabase on generation
- *Inline role picker* — click any member's role badge to reassign their role instantly
 
### Roles
- Five roles: *Admin, **Host, **Lead, **Member, **New*
- *Role Assignments* panel — accordion per role showing all assigned members
- Change any member's role via dropdown; synced to Supabase immediately
- *Quick-assign strip* — move any member to a role with one click
 
### Games
- 6 built-in games loaded from Supabase (duration, description, flavor-color labels)
- *▶ Play Now* button on each card — activates the game, navigates to the Scores tab, and shows a toast
- *Now Playing* badge + ring highlight on the active game card
- Active game can be ended from the Games tab or the Scores tab
 
### Scores
- *Active game banner* at the top — shows the current game title and duration; prompt to pick a game if none is active
- Team rosters shown inside each team panel (member avatars pulled from generated teams)
- Real-time animated score counters (count-up animation on every change)
- Per-team *Cheer* (+1 pt), *Star* (+3 pts), and custom point input (1–999)
- Score changes are persisted to Supabase after every action
- Leader banner updates live (Teal / Gold / Tied)
- *Announce Winner* and *Reset Board* — reset clears active game and session state
 
### UI / UX
- Light and dark mode (toggled in the nav bar, persisted to localStorage)
- Animated count-up on all score changes
- Color-coded toast notifications (success / warning / error / info)
- Fully accessible navigation (aria-current, aria-live, aria-label, aria-expanded)
 
---
 
## Data Model (Supabase)
 
| Table      | Purpose                                              |
|------------|------------------------------------------------------|
| members  | Crew members — name, initials, avatar key, role      |
| sessions | A single Friday session (created on Generate Teams)  |
| teams    | Teal / Gold teams linked to a session                |
| scores   | Running points, cheers, stars per team               |
| games    | Game library — title, description, duration, labels  |
 
All tables have Row Level Security (RLS) enabled. The schema is idempotent — safe to re-run.
 
---
 
## Available Scripts
 
| Command           | Description                        |
|-------------------|------------------------------------|
| npm run dev     | Start local dev server (port 5173) |
| npm run build   | Build for production               |
| npm run preview | Preview the production build       |
 
---
 
## Environment Variables
 
| Variable                 | Description                        |
|--------------------------|------------------------------------|
| VITE_SUPABASE_URL      | Your Supabase project URL          |
| VITE_SUPABASE_ANON_KEY | Your Supabase anon/public key      |
 
 
---
 
## Improvements & Roadmap
 
The sections below outline professional enhancements roughly ordered by impact and implementation effort, from near-term to strategic.
 
---
 
### Phase 1 — Foundation Hardening (short-term)
 
#### Real-time Collaboration
- Replace one-off Supabase reads with *Supabase Realtime subscriptions* on scores and members — score updates broadcast live to every connected device in the room without a page refresh.
 
#### Authentication & Access Control
- Integrate *Supabase Auth* (email magic link or Google / Microsoft SSO via OAuth 2.0).
- Map Supabase roles to app roles: only Admin users can manage games and generate teams; Host controls scoring; Member is read-only.
- Replace anonymous RLS policies with user-scoped policies so each organisation's data is isolated.
 
#### Input Validation & Error Handling
- Add *React Error Boundaries* around each view so a component crash doesn't take down the whole app.
- Validate member names client-side (min length, no HTML injection) and surface inline field errors.
- Wrap all Supabase calls in structured error handling with user-facing fallback messages.
 
#### Testing
- *Unit tests* with [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) for store actions, score logic, and shuffle correctness.
- *End-to-end tests* with [Playwright](https://playwright.dev/) covering the core flows: add member → generate teams → select game → score → announce winner.
- Aim for ≥ 80% coverage on store.js business logic.
 
---
 
### Phase 2 — Feature Completeness (mid-term)
 
#### Session History & Leaderboard
- Persist past Friday sessions in Supabase; surface a *Session History* tab with results, winning team, game played, and top scorers.
- Add an *All-time Leaderboard* that aggregates member stars and points across sessions.
 
#### Rich Member Profiles
- Allow uploading a profile photo (Supabase Storage) to replace the initials avatar.
- Add an optional department / team field for filtering during team generation.
- Track per-member stats: total stars earned, sessions attended, win rate.
 
#### Custom Game Builder
- A form-driven UI that lets an Admin create new games (title, description, duration, labels, rules) and save them to the games table — no SQL required.
- Allow games to be archived or reordered.
 
#### Points Audit Trail
- Log every score change (who gave it, when, how many points) to a score_events table.
- Show a scrollable activity feed in the Scores tab ("Alex gave Teal Team ⭐ Star at 14:32").
 
#### Export & Sharing
- *Export session results* to CSV or a styled PDF (using jsPDF or a server-side Supabase Edge Function).
- Generate a shareable *results card* image (HTML Canvas / html2canvas) to post in Slack or Teams.
 
#### Notification Integrations
- Incoming webhooks to *Slack* or *Microsoft Teams* when a winner is announced or a milestone is hit (e.g., 100 points reached).
- Optional email summary at session end via Supabase Edge Functions + Resend.
 
---
 
### Phase 3 — Scale & Reliability (long-term)
 
#### Progressive Web App (PWA)
- Add a *service worker* (via vite-plugin-pwa) for offline capability and home-screen install on mobile.
- Cache the game library and member list locally; sync when back online.
 
#### Performance Optimisation
- *Route-level code splitting* with React.lazy + Suspense so each tab's bundle is loaded on demand.
- Memoize expensive derived state with useMemo and prevent unnecessary re-renders with React.memo.
- Migrate server-state fetching to *TanStack Query* for automatic caching, background refetch, and stale-while-revalidate behaviour — reducing manual loading/error state management.
 
#### Analytics & Observability
- Integrate *Sentry* for runtime error tracking and performance monitoring.
- Add a lightweight analytics layer (e.g., Plausible or PostHog self-hosted) to track feature usage — which games are played most, average session length, team size distribution.
- Structured logging via Supabase Edge Function middleware.
 
#### CI/CD Pipeline
- *GitHub Actions* workflow: lint → typecheck → unit tests → Playwright E2E → build on every PR.
- Deployment to *Vercel* or *Netlify* with preview deployments per branch.
- Separate staging and production Supabase projects with environment-gated deployments.
 
#### TypeScript Migration
- Gradually migrate .jsx / .js to .tsx / .ts.
- Generate Supabase TypeScript types via supabase gen types typescript for fully typed database queries.
- Add strict null checks to eliminate runtime type errors in store actions.
 
#### Accessibility Audit (WCAG 2.1 AA)
- Formal audit using [axe-core](https://github.com/dequelabs/axe-core) and manual screen-reader testing (NVDA / VoiceOver).
- Ensure all interactive elements have visible focus rings, correct ARIA roles, and sufficient colour contrast (4.5:1 minimum).
- Add a *keyboard-only navigation* smoke test in the Playwright suite.
 
#### Multi-tenancy & Organisation Support
- Support multiple organisations in a single Supabase project using a tenant-scoped RLS strategy (org_id column on all tables).
- Admin can invite team members by email; invitations managed through Supabase Auth.
- Per-organisation branding (logo, primary colour) stored in an orgs table.
 
---
 
### Quick-Win Checklist
 
| # | Improvement | Effort | Impact |
|---|-------------|--------|--------|
| 1 | Supabase Realtime on scores | Low | High |
| 2 | React Error Boundaries | Low | High |
| 3 | Vitest unit tests for store | Medium | High |
| 4 | Session history tab | Medium | High |
| 5 | Supabase Auth (Google SSO) | Medium | High |
| 6 | Custom game builder | Medium | Medium |
| 7 | CSV/PDF export | Low | Medium |
| 8 | Slack/Teams webhook | Low | Medium |
| 9 | PWA / offline support | Medium | Medium |
| 10 | TanStack Query migration | Medium | Medium |
| 11 | TypeScript migration | High | High |
| 12 | Playwright E2E suite | Medium | High |
| 13 | GitHub Actions CI/CD | Low | High |
| 14 | Sentry error monitoring | Low | Medium |
| 15 | WCAG 2.1 AA audit | Medium | High |
