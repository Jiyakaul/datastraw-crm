const express = require('express');
const router = express.Router();
const { db, generateTicketId } = require('../db');

// ═══════════════════════════════════════════════════════════════
// 1. POST /api/tickets — Create a new ticket
// ═══════════════════════════════════════════════════════════════
router.post('/', (req, res) => {
  try {
    const { customer_name, customer_email, subject, description, priority } = req.body;

    // ── Validation ──────────────────────────────────────────
    if (!customer_name || !customer_email || !subject || !description) {
      return res.status(400).json({
        error: 'Missing required fields: customer_name, customer_email, subject, description'
      });
    }

    // Validate email format (basic check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate priority if provided
    const validPriorities = ['Low', 'Medium', 'High'];
    const ticketPriority = priority && validPriorities.includes(priority) ? priority : 'Medium';

    // ── Generate ticket ID & timestamps ─────────────────────
    const ticket_id = generateTicketId();
    const now = new Date().toISOString();

    // ── Insert into database ────────────────────────────────
    const stmt = db.prepare(`
      INSERT INTO tickets (ticket_id, customer_name, customer_email, subject, description, status, priority, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'Open', ?, ?, ?)
    `);

    stmt.run(ticket_id, customer_name, customer_email, subject, description, ticketPriority, now, now);

    res.status(201).json({
      ticket_id,
      created_at: now
    });
  } catch (err) {
    console.error('Error creating ticket:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══════════════════════════════════════════════════════════════
// 2. GET /api/tickets — List all tickets (with search & filter)
// ═══════════════════════════════════════════════════════════════
router.get('/', (req, res) => {
  try {
    const { status, search, priority } = req.query;

    let query = 'SELECT ticket_id, customer_name, customer_email, subject, status, priority, created_at, updated_at FROM tickets WHERE 1=1';
    const params = [];

    // ── Filter by status ────────────────────────────────────
    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    // ── Filter by priority ──────────────────────────────────
    if (priority && priority !== 'All') {
      query += ' AND priority = ?';
      params.push(priority);
    }

    // ── Search across multiple fields ───────────────────────
    if (search) {
      query += ` AND (
        ticket_id LIKE ? OR
        customer_name LIKE ? OR
        customer_email LIKE ? OR
        subject LIKE ? OR
        description LIKE ?
      )`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC';

    const tickets = db.prepare(query).all(...params);

    // ── Also return status counts for the UI badges ─────────
    const counts = db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as open,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) as closed
      FROM tickets
    `).get();

    res.json({ tickets, counts });
  } catch (err) {
    console.error('Error listing tickets:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══════════════════════════════════════════════════════════════
// 3. GET /api/tickets/:ticket_id — Get single ticket + notes
// ═══════════════════════════════════════════════════════════════
router.get('/:ticket_id', (req, res) => {
  try {
    const { ticket_id } = req.params;

    const ticket = db.prepare(`
      SELECT * FROM tickets WHERE ticket_id = ?
    `).get(ticket_id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const notes = db.prepare(`
      SELECT id, note_text, created_at FROM notes WHERE ticket_id = ? ORDER BY created_at DESC
    `).all(ticket_id);

    res.json({ ...ticket, notes });
  } catch (err) {
    console.error('Error fetching ticket:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══════════════════════════════════════════════════════════════
// 4. PUT /api/tickets/:ticket_id — Update ticket (status/notes)
// ═══════════════════════════════════════════════════════════════
router.put('/:ticket_id', (req, res) => {
  try {
    const { ticket_id } = req.params;
    const { status, notes, priority } = req.body;

    // ── Check ticket exists ─────────────────────────────────
    const ticket = db.prepare('SELECT * FROM tickets WHERE ticket_id = ?').get(ticket_id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const now = new Date().toISOString();

    // ── Update status if provided ───────────────────────────
    if (status) {
      const validStatuses = ['Open', 'In Progress', 'Closed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be: Open, In Progress, or Closed' });
      }
      db.prepare('UPDATE tickets SET status = ?, updated_at = ? WHERE ticket_id = ?')
        .run(status, now, ticket_id);
    }

    // ── Update priority if provided ─────────────────────────
    if (priority) {
      const validPriorities = ['Low', 'Medium', 'High'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority. Must be: Low, Medium, or High' });
      }
      db.prepare('UPDATE tickets SET priority = ?, updated_at = ? WHERE ticket_id = ?')
        .run(priority, now, ticket_id);
    }

    // ── Add note if provided ────────────────────────────────
    if (notes) {
      db.prepare('INSERT INTO notes (ticket_id, note_text, created_at) VALUES (?, ?, ?)')
        .run(ticket_id, notes, now);
      // Also update the ticket's updated_at timestamp
      db.prepare('UPDATE tickets SET updated_at = ? WHERE ticket_id = ?')
        .run(now, ticket_id);
    }

    res.json({ success: true, updated_at: now });
  } catch (err) {
    console.error('Error updating ticket:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
