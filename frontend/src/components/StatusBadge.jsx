function StatusBadge({ status }) {
  const getClassName = () => {
    switch (status) {
      case 'Open':
        return 'badge badge-dot badge-open';
      case 'In Progress':
        return 'badge badge-dot badge-in-progress';
      case 'Closed':
        return 'badge badge-dot badge-closed';
      default:
        return 'badge badge-dot badge-closed';
    }
  };

  return <span className={getClassName()}>{status}</span>;
}

export default StatusBadge;
