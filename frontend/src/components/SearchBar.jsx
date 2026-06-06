function SearchBar({ value, onChange, placeholder = 'Search tickets...' }) {
  const handleClear = () => {
    onChange({ target: { value: '' } });
  };

  return (
    <div className="search-bar">
      {/* Search Icon */}
      <svg
        className="search-bar-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      {/* Input */}
      <input
        type="text"
        className="search-bar-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
      />

      {/* Clear Button */}
      {value && (
        <button
          className="search-bar-clear"
          onClick={handleClear}
          aria-label="Clear search"
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
      )}
    </div>
  );
}

export default SearchBar;
