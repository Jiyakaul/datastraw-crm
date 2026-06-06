import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import SearchBar from '../components/SearchBar';

const API_URL = '/api';

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [counts, setCounts] = useState({ total: 0, open: 0, in_progress: 0, closed: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // ── Fetch tickets with search & filter ────────────────────
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`${API_URL}/tickets?${params}`);
      const data = await res.json();
      setTickets(data.tickets);
      setCounts(data.counts);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  // ── Debounced search ──────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchTickets]);

  // ── Format date for display ───────────────────────────────
  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  const statusTabs = [
    { label: 'All', value: 'All', count: counts.total },
    { label: 'Open', value: 'Open', count: counts.open },
    { label: 'In Progress', value: 'In Progress', count: counts.in_progress },
    { label: 'Closed', value: 'Closed', count: counts.closed },
  ];

  return (
    <div className="page-container fade-in">
      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Support Tickets</h1>
            <p className="page-subtitle">Manage and track customer support requests</p>
          </div>
          <Link to="/create" className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Ticket
          </Link>
        </div>
      </div>

      {/* ── Status Filter Tabs ───────────────────────────────── */}
      <div className="filter-tabs">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            className={`filter-tab ${statusFilter === tab.value ? 'active' : ''}`}
            onClick={() => setStatusFilter(tab.value)}
          >
            {tab.label}
            <span className="tab-count">{tab.count || 0}</span>
          </button>
        ))}
      </div>

      {/* ── Search Bar ───────────────────────────────────────── */}
      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by ticket ID, name, email, subject..."
      />

      {/* ── Ticket List ──────────────────────────────────────── */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h3>No tickets found</h3>
          <p>{search ? 'Try adjusting your search terms' : 'Create your first support ticket to get started'}</p>
          {!search && (
            <Link to="/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Create First Ticket
            </Link>
          )}
        </div>
      ) : (
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <Link to={`/tickets/${ticket.ticket_id}`} key={ticket.ticket_id} className="ticket-card">
              <div className="ticket-card-header">
                <span className="ticket-id">{ticket.ticket_id}</span>
                <div className="ticket-badges">
                  <PriorityBadge priority={ticket.priority} />
                  <StatusBadge status={ticket.status} />
                </div>
              </div>
              <h3 className="ticket-subject">{ticket.subject}</h3>
              <div className="ticket-meta">
                <div className="ticket-customer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  {ticket.customer_name}
                </div>
                <div className="ticket-email">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  {ticket.customer_email}
                </div>
                <div className="ticket-date">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {formatDate(ticket.created_at)} · {formatTime(ticket.created_at)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketList;
