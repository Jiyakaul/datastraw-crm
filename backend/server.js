const express = require('express');
const cors = require('cors');
const path = require('path');

const ticketRoutes = require('./routes/tickets');

// ── Create Express app ──────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── API Routes ──────────────────────────────────────────────────
app.use('/api/tickets', ticketRoutes);

// ── Health check endpoint ───────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Serve React frontend in production ──────────────────────────
const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendPath));

// Catch-all: serve index.html for any non-API route (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ── Start server ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🚀 CRM Server running on http://localhost:${PORT}\n`);
});
