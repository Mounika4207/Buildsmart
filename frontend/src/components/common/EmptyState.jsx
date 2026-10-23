import React from 'react';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = Compass,
  title = 'No records found',
  description = 'There are no items matching your criteria at this moment.',
  actionLabel,
  actionLink,
  onAction,
}) => {
  return (
    <div
      style={{
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '560px',
        margin: '2rem auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(16, 239, 140, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          color: 'var(--lime-primary)',
        }}
      >
        <Icon size={32} />
      </div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#ffffff' }}>{title}</h3>
      <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: '420px', color: 'var(--text-secondary)' }}>
        {description}
      </p>
      {actionLabel && actionLink && (
        <Link to={actionLink} className="btn btn-lime">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionLink && (
        <button onClick={onAction} className="btn btn-lime">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
