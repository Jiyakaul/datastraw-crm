const Database = require('better-sqlite3');
const path = require('path');

// ── Database file location ──────────────────────────────────────
const DB_PATH = path.join(__dirname, '..', 'crm.db');

// ── Initialize database ─────────────────────────────────────────
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// ── Create tables ───────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id     TEXT    UNIQUE NOT NULL,
    customer_name TEXT    NOT NULL,
    customer_email TEXT   NOT NULL,
    subject       TEXT    NOT NULL,
    description   TEXT    NOT NULL,
    status        TEXT    NOT NULL DEFAULT 'Open',
    priority      TEXT    NOT NULL DEFAULT 'Medium',
    created_at    TEXT    NOT NULL,
    updated_at    TEXT    NOT NULL
  );

  CREATE TABLE IF NOT EXISTS notes (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id  TEXT    NOT NULL,
    note_text  TEXT    NOT NULL,
    created_at TEXT    NOT NULL,
    FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id)
  );
`);

// ── Helper: generate next ticket ID (TKT-001, TKT-002, …) ─────
function generateTicketId() {
  const row = db.prepare('SELECT MAX(id) as max_id FROM tickets').get();
  const nextNum = (row.max_id || 0) + 1;
  return `TKT-${String(nextNum).padStart(3, '0')}`;
}

module.exports = { db, generateTicketId };
