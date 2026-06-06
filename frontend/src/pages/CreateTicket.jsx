import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Toast from '../components/Toast';

const API_URL = '/api';

function CreateTicket() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    description: '',
    priority: 'Medium',
  });
  const [errors, setErrors] = useState({});

  // ── Handle input changes ──────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // ── Validate form ─────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!form.customer_name.trim()) newErrors.customer_name = 'Customer name is required';
    if (!form.customer_email.trim()) {
      newErrors.customer_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email)) {
      newErrors.customer_email = 'Invalid email format';
    }
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit form ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create ticket');
      }

      const data = await res.json();
      setToast({ message: `Ticket ${data.ticket_id} created successfully!`, type: 'success' });

      // Navigate to the new ticket after a brief delay
      setTimeout(() => {
        navigate(`/tickets/${data.ticket_id}`);
      }, 1500);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Breadcrumb ───────────────────────────────────────── */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Tickets</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">New Ticket</span>
      </div>

      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Create New Ticket</h1>
          <p className="page-subtitle">Submit a new customer support request</p>
        </div>
      </div>

      {/* ── Form ─────────────────────────────────────────────── */}
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Customer Name */}
          <div className="form-group">
            <label htmlFor="customer_name" className="form-label">
              Customer Name <span className="required">*</span>
            </label>
            <input
              id="customer_name"
              name="customer_name"
              type="text"
              className={`form-input ${errors.customer_name ? 'input-error' : ''}`}
              placeholder="Enter customer name"
              value={form.customer_name}
              onChange={handleChange}
            />
            {errors.customer_name && <span className="error-text">{errors.customer_name}</span>}
          </div>

          {/* Customer Email */}
          <div className="form-group">
            <label htmlFor="customer_email" className="form-label">
              Customer Email <span className="required">*</span>
            </label>
            <input
              id="customer_email"
              name="customer_email"
              type="email"
              className={`form-input ${errors.customer_email ? 'input-error' : ''}`}
              placeholder="customer@example.com"
              value={form.customer_email}
              onChange={handleChange}
            />
            {errors.customer_email && <span className="error-text">{errors.customer_email}</span>}
          </div>
        </div>

        <div className="form-grid">
          {/* Subject */}
          <div className="form-group">
            <label htmlFor="subject" className="form-label">
              Subject <span className="required">*</span>
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              className={`form-input ${errors.subject ? 'input-error' : ''}`}
              placeholder="Brief summary of the issue"
              value={form.subject}
              onChange={handleChange}
            />
            {errors.subject && <span className="error-text">{errors.subject}</span>}
          </div>

          {/* Priority */}
          <div className="form-group">
            <label htmlFor="priority" className="form-label">Priority</label>
            <select
              id="priority"
              name="priority"
              className="form-input form-select"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            className={`form-input form-textarea ${errors.description ? 'input-error' : ''}`}
            placeholder="Describe the issue in detail..."
            rows="6"
            value={form.description}
            onChange={handleChange}
          ></textarea>
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        {/* Actions */}
        <div className="form-actions">
          <Link to="/" className="btn btn-secondary">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Creating...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Create Ticket
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTicket;
