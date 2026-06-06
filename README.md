# DataStraw CRM — Customer Support Ticketing System

A full-stack web application for managing customer support tickets.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite 6 |
| **Backend** | Node.js + Express 4 |
| **Database** | SQLite (via better-sqlite3) |
| **Styling** | Vanilla CSS |
| **Deployment** | Render |


## Features

### Core Features
1. **Create Tickets** — Submit tickets with customer name, email, subject, description, and priority
2. **List All Tickets** — View all tickets with ID, name, title, status, priority, and date
3. **Search Functionality** — Instant search across names, IDs, emails, subjects, and descriptions 
4. **Filter by Status** — Filter tickets by Open, In Progress, or Closed with count badges
5. **View & Update Tickets** — Detailed view with status updates and notes/comments system

### Bonus Features
- **Priority Levels** — High, Medium, Low with color-coded badges
- **Notes System** — Add comments/notes to track ticket progress
- **Auto-generated Ticket IDs** — Sequential format: TKT-001, TKT-002, etc.
- **Status Count Badges** — Real-time counts per status on the filter tabs
- **Premium Dark UI** — Modern glassmorphism design with smooth animations
- **Fully Responsive** — Works on desktop, tablet, and mobile

## Architecture
┌─────────────────────────────────────────────────────┐
│                   React Frontend                     │
│        (Vite dev server / Express static)            │
│   ┌──────────┐ ┌──────────────┐ ┌──────────────┐   │
│   │  Ticket   │ │   Create     │ │   Ticket     │   │
│   │  List     │ │   Ticket     │ │   Detail     │   │
│   └──────────┘ └──────────────┘ └──────────────┘   │
└──────────────────────┬──────────────────────────────┘
                       │ fetch() / REST API
┌──────────────────────▼──────────────────────────────┐
│                 Express.js Backend                    │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│   │  POST    │ │  GET     │ │  GET/:id │ │ PUT/:id ││
│   │ /tickets │ │ /tickets │ │          │ │         ││
│   └──────────┘ └──────────┘ └──────────┘ └────────┘│
└──────────────────────┬──────────────────────────────┘
                       │ better-sqlite3
┌──────────────────────▼──────────────────────────────┐
│                    SQLite Database                    │
│         ┌──────────────┐ ┌──────────────┐           │
│         │   tickets    │ │    notes     │           │
│         │   table      │ │    table     │           │
│         └──────────────┘ └──────────────┘           │
└─────────────────────────────────────────────────────┘

## Folder Structure

CRM/
├── backend/
│   ├── server.js          # Express entry point
│   ├── db.js              # SQLite setup + schema
│   └── routes/
│       └── tickets.js     # All 4 API endpoints
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # React Router setup
│   │   ├── main.jsx       # React entry point
│   │   ├── index.css      # Full design system
│   │   ├── pages/
│   │   │   ├── TicketList.jsx    # Home page
│   │   │   ├── CreateTicket.jsx  # Create form
│   │   │   └── TicketDetail.jsx  # Detail + update
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       ├── StatusBadge.jsx
│   │       ├── PriorityBadge.jsx
│   │       ├── SearchBar.jsx
│   │       └── Toast.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json
├── .gitignore
├── .env.example
└── README.md



## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/tickets` | Create a new ticket |
| `GET` | `/api/tickets` | List all tickets (with search & filter) |
| `GET` | `/api/tickets/:ticket_id` | Get single ticket with notes |
| `PUT` | `/api/tickets/:ticket_id` | Update ticket status/priority/notes |
| `GET` | `/api/health` | Health check |

### Create Ticket
```bash
POST /api/tickets
Content-Type: application/json

{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "subject": "Login issue",
  "description": "Cannot login to the dashboard",
  "priority": "High"  // Optional: Low, Medium, High
}

# Response: { "ticket_id": "TKT-001", "created_at": "..." }
```

### List Tickets (with search & filter)
```bash
GET /api/tickets?status=Open&search=john&priority=High

# Response: { "tickets": [...], "counts": { "total": 5, "open": 3, ... } }
```

### Update Ticket
```bash
PUT /api/tickets/TKT-001
Content-Type: application/json

{
  "status": "In Progress",
  "notes": "Looking into this issue"
}

# Response: { "success": true, "updated_at": "..." }
```

## Database Schema

### tickets
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| ticket_id | TEXT | Unique ID (TKT-001) |
| customer_name | TEXT | Customer's full name |
| customer_email | TEXT | Customer's email |
| subject | TEXT | Issue title |
| description | TEXT | Detailed description |
| status | TEXT | Open / In Progress / Closed |
| priority | TEXT | Low / Medium / High |
| created_at | TEXT | ISO timestamp |
| updated_at | TEXT | ISO timestamp |

### notes
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| ticket_id | TEXT | FK → tickets.ticket_id |
| note_text | TEXT | Comment content |
| created_at | TEXT | ISO timestamp |

## Design Decisions

- **SQLite** — Zero configuration database, perfect for a self-contained app. No external DB server needed.
- **better-sqlite3** — Synchronous SQLite driver for Node.js, faster and simpler than async alternatives.
- **Vanilla CSS** — No CSS framework dependency. 
- **Vite** — Lightning-fast dev server with hot module replacement.
- **Single-server deployment** — Express serves both the API and the React build in production, simplifying deployment.

## SDLC Model

**Agile (3 Sprints)**

| Sprint | Focus | Output |
|--------|-------|--------|
| 1 | Backend | Working REST API + SQLite DB |
| 2 | Frontend | React UI connected to API |
| 3 | Polish + Deploy | Production build, Render deployment |
