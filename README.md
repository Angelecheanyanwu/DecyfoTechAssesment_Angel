# Clinic Patient Flow Monitor

A live dashboard tracking clinic patient-flow events (check-in → triage → complete, plus alerts) as they happen. Events pushed from the backend appear in the frontend feed in real time over WebSockets, each one triggering a stubbed notification dispatch (in-app push is actually implemented; SMS and WhatsApp are logged stubs).

- **Backend:** Node.js, Express, Socket.io, Prisma, PostgreSQL (hosted on [Neon](https://neon.tech))
- **Frontend:** Next.js (App Router, TypeScript), Tailwind CSS, socket.io-client
- **Live demo:** Backend — https://assesment-production-8bbd.up.railway.app · Frontend — https://vercel.com/angelecheanyanwus-projects/decyfo-tech-assesment-angel
## Concept

A patient moves through a small state machine: `CHECK_IN → TRIAGE_STARTED → TRIAGE_COMPLETE`, with `ALERT` events firing at any point for anomalies (e.g. vitals out of range). Every event carries a severity (`NORMAL`, `HIGH`, `CRITICAL`) which deterministically selects the notification channel that would be used for it:

| Severity | Channel | Status |
|---|---|---|
| `NORMAL` | In-app push | Actually implemented (logged + pushed via toast in the UI) |
| `HIGH` | SMS | Stub — logged only |
| `CRITICAL` | WhatsApp | Stub — logged only |

## Architecture

All events — whether created by the "Simulate Event" button, a direct API call, or the optional server-side interval simulator — flow through a single function, [`eventService.createEvent()`](backend/src/services/eventService.js):

```
createEvent(data)
  → prisma.event.create(data)   // persist to Postgres
  → io.emit('event:new', event) // real-time push to every connected client
  → dispatchNotification(event) // logs which channel would fire (in-app is real)
```

This keeps the write path, the real-time push, and the notification dispatch as one clean, testable pipeline instead of three loosely-coupled side effects scattered across the route handler.

## Project structure

```
backend/
  src/
    server.js              Express app + HTTP server + Socket.io init
    app.js                 Express app factory (routes, CORS, error handler)
    routes/events.js       GET/POST /api/events, POST /api/events/simulate
    services/eventService.js        createEvent() / listEvents()
    services/notificationService.js dispatchNotification() — channel selection + logging
    simulator/eventSimulator.js     random event generator (used by /simulate and optional interval)
  prisma/schema.prisma     Event model + enums
  tests/unit, tests/integration
  postman/clinic-monitor.postman_collection.json
frontend/
  app/page.tsx             Dashboard: sidebar + stat cards + live feed + toasts
  components/              EventFeed, SimulateButton, Toast, StatCards, Sidebar, WardOverview
  lib/                     api.ts, socket.ts, notifications.ts (channel/severity mapping), types.ts
  __tests__/
```

## Setup

### Prerequisites

- Node.js + npm
- A PostgreSQL database (this project uses a free [Neon](https://neon.tech) instance — no local DB install required)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL with your Postgres connection string
npx prisma migrate dev
npm run dev             # http://localhost:4000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev              # http://localhost:3000
```

### Tests

```bash
cd backend && npm test    # unit + integration (Jest, Supertest, socket.io-client)
cd frontend && npm test   # component tests (Jest, React Testing Library)
```

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/events?limit=50` | List most recent events |
| POST | `/api/events` | Create an event — body: `{ type, patientRef, message, severity? }` |
| POST | `/api/events/simulate` | Create a random event (used by the "Simulate Event" button) |

Event `type`: `CHECK_IN`, `TRIAGE_STARTED`, `TRIAGE_COMPLETE`, `ALERT`
Event `severity`: `NORMAL` (default), `HIGH`, `CRITICAL`

A Postman collection covering all endpoints is at [`backend/postman/clinic-monitor.postman_collection.json`](backend/postman/clinic-monitor.postman_collection.json).

## Environment variables

See `backend/.env.example` and `frontend/.env.example`. Never commit real `.env`/`.env.local` files.

---

## Written note

### 1.Mobile architecture
I'd Maintain Express + Socket.io on the backend and introduce a second client via React Native (using Expo). No modifications to the backend will be required. Expo will beat bare React Native on iteration speed, OTA updates, and built-in socket.io-client implementation. I'd make sure the data contract (event types, socket connection code, formatters) were extracted to common code, since web and mobile shouldn't get out of sync. The only real difference will be in notifications: toast notifications will behave the same way as long as there's a live socket connection, but push notifications (which reach your phone even if the app is in the background) need Expo or FCM/APNs.

### 2. Push vs. SMS vs. WhatsApp:

This decision is guided by two factors: urgency of the event and whether or not the user will be using the application at that time. The in-app push is free and immediate but reaches only active users, and is thus best suited to regular events. The SMS comes at a cost but does not depend on the status of the application, and is appropriate for events where missing the message entails very high cost, like the alert about abnormal vitals. In Nigeria and other similar markets, WhatsApp can often be more economical and engaging than the SMS, and provides an ideal alternative in such cases.