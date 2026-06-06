function PriorityBadge({ priority }) {
  const getClassName = () => {
    switch (priority) {
      case 'High':
        return 'badge badge-dot badge-high';
      case 'Medium':
        return 'badge badge-dot badge-medium';
      case 'Low':
        return 'badge badge-dot badge-low';
      default:
        return 'badge badge-dot badge-medium';
    }
  };

  return <span className={getClassName()}>{priority}</span>;
}

export default PriorityBadge;
