import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'Failed to load data from the server. Please check your network or try again.',
  onRetry,
}) => {
  return (
    <div
      style={{
        padding: '3rem 1.5rem',
        textAlign: 'center',
        background: 'rgba(239, 68, 68, 0.05)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '520px',
        margin: '2rem auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          color: '#f87171',
        }}
      >
        <AlertTriangle size={28} />
      </div>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
        {message}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary" style={{ gap: '0.5rem' }}>
          <RefreshCw size={16} />
          <span>Retry Request</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
