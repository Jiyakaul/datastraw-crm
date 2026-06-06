import { useEffect, useState } from 'react';

function Toast({ message, type = 'success', onClose }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      onClose();
    }, 250); // match the toastSlideOut animation duration
  };

  return (
    <div className="toast-container">
      <div
        className={`toast toast-${type} ${exiting ? 'toast-exiting' : ''}`}
        role="alert"
        aria-live="assertive"
      >
        {/* Icon */}
        <div className="toast-icon">
          {type === 'success' ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )}
        </div>

        {/* Message */}
        <span className="toast-message">{message}</span>

        {/* Close Button */}
        <button
          className="toast-close"
          onClick={handleClose}
          aria-label="Dismiss notification"
          type="button"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Toast;
