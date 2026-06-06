import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import Toast from '../components/Toast';

const API_URL = '/api';

function TicketDetail() {
  const { ticket_id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // ── Fetch ticket detail ───────────────────────────────────
  const fetchTicket = async () => {
    try {
      const res = await fetch(`${API_URL}/tickets/${ticket_id}`);
      if (!res.ok) throw new Error('Ticket not found');
      const data = await res.json();
      setTicket(data);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticket_id]);

  // ── Update status ─────────────────────────────────────────
  const handleStatusChange = async (newStatus) => {
    setStatusUpdating(true);
    try {
      const res = await fetch(`${API_URL}/tickets/${ticket_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setToast({ message: `Status updated to "${newStatus}"`, type: 'success' });
      await fetchTicket();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setStatusUpdating(false);
    }
  };

  // ── Update priority ───────────────────────────────────────
  const handlePriorityChange = async (newPriority) => {
    try {
      const res = await fetch(`${API_URL}/tickets/${ticket_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority }),
      });
      if (!res.ok) throw new Error('Failed to update priority');
      setToast({ message: `Priority updated to "${newPriority}"`, type: 'success' });
      await fetchTicket();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  // ── Add note ──────────────────────────────────────────────
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setNoteLoading(true);
    try {
      const res = await fetch(`${API_URL}/tickets/${ticket_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: newNote.trim() }),
      });
      if (!res.ok) throw new Error('Failed to add note');
      setNewNote('');
      setToast({ message: 'Note added successfully', type: 'success' });
      await fetchTicket();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setNoteLoading(false);
    }
  };

  // ── Format dates ──────────────────────────────────────────
  const formatDateTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3>Ticket not found</h3>
          <p>The ticket you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Tickets</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Breadcrumb ───────────────────────────────────────── */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Tickets</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{ticket.ticket_id}</span>
      </div>

      {/* ── Ticket Header ────────────────────────────────────── */}
      <div className="detail-header">
        <div className="detail-header-top">
          <div className="detail-title-group">
            <span className="ticket-id-large">{ticket.ticket_id}</span>
            <h1 className="detail-title">{ticket.subject}</h1>
          </div>
          <div className="detail-badges">
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>
        </div>
        <div className="detail-timestamps">
          <span>Created {formatDateTime(ticket.created_at)}</span>
          <span>·</span>
          <span>Updated {timeAgo(ticket.updated_at)}</span>
        </div>
      </div>

      <div className="detail-grid">
        {/* ── Left Column: Main Content ────────────────────── */}
        <div className="detail-main">
          {/* Description */}
          <div className="detail-card">
            <h2 className="detail-section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              Description
            </h2>
            <p className="detail-description">{ticket.description}</p>
          </div>

          {/* Notes Section */}
          <div className="detail-card">
            <h2 className="detail-section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Notes & Comments
              <span className="note-count">{ticket.notes?.length || 0}</span>
            </h2>

            {/* Add Note Form */}
            <form className="note-form" onSubmit={handleAddNote}>
              <textarea
                className="form-input form-textarea"
                placeholder="Add a note or comment..."
                rows="3"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              ></textarea>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={noteLoading || !newNote.trim()}
              >
                {noteLoading ? (
                  <>
                    <span className="spinner-small"></span>
                    Adding...
                  </>
                ) : (
                  'Add Note'
                )}
              </button>
            </form>

            {/* Notes List */}
            {ticket.notes && ticket.notes.length > 0 ? (
              <div className="notes-list">
                {ticket.notes.map((note) => (
                  <div key={note.id} className="note-item">
                    <div className="note-header">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      <span className="note-time">{formatDateTime(note.created_at)}</span>
                    </div>
                    <p className="note-text">{note.note_text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-notes">No notes yet. Add the first comment above.</p>
            )}
          </div>
        </div>

        {/* ── Right Column: Sidebar ────────────────────────── */}
        <div className="detail-sidebar">
          {/* Customer Info */}
          <div className="detail-card sidebar-card">
            <h3 className="sidebar-title">Customer Information</h3>
            <div className="sidebar-field">
              <span className="sidebar-label">Name</span>
              <span className="sidebar-value">{ticket.customer_name}</span>
            </div>
            <div className="sidebar-field">
              <span className="sidebar-label">Email</span>
              <a href={`mailto:${ticket.customer_email}`} className="sidebar-value sidebar-link">
                {ticket.customer_email}
              </a>
            </div>
          </div>

          {/* Status Update */}
          <div className="detail-card sidebar-card">
            <h3 className="sidebar-title">Update Status</h3>
            <div className="status-buttons">
              {['Open', 'In Progress', 'Closed'].map((s) => (
                <button
                  key={s}
                  className={`status-btn ${ticket.status === s ? 'active' : ''} status-btn-${s.toLowerCase().replace(' ', '-')}`}
                  onClick={() => handleStatusChange(s)}
                  disabled={statusUpdating || ticket.status === s}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Update */}
          <div className="detail-card sidebar-card">
            <h3 className="sidebar-title">Update Priority</h3>
            <select
              className="form-input form-select"
              value={ticket.priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
            >
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </select>
          </div>

          {/* Ticket Metadata */}
          <div className="detail-card sidebar-card">
            <h3 className="sidebar-title">Details</h3>
            <div className="sidebar-field">
              <span className="sidebar-label">Ticket ID</span>
              <span className="sidebar-value mono">{ticket.ticket_id}</span>
            </div>
            <div className="sidebar-field">
              <span className="sidebar-label">Created</span>
              <span className="sidebar-value">{formatDateTime(ticket.created_at)}</span>
            </div>
            <div className="sidebar-field">
              <span className="sidebar-label">Last Updated</span>
              <span className="sidebar-value">{formatDateTime(ticket.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetail;
