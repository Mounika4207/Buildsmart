import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Trophy } from 'lucide-react';

export const NotFound = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '65vh',
        padding: '3rem 1.5rem',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '24px',
          backgroundColor: 'rgba(16, 239, 140, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--lime-primary)',
          marginBottom: '1.5rem',
        }}
      >
        <Trophy size={42} />
      </div>

      <span style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--lime-primary)', lineHeight: 1 }}>
        404
      </span>

      <h1 style={{ fontSize: '1.8rem', color: '#ffffff', margin: '0.75rem 0 0.5rem 0' }}>
        Out of Bounds! Page Not Found
      </h1>

      <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', marginBottom: '2rem', fontSize: '0.95rem' }}>
        The sports ground or link you are trying to visit doesn't exist or has moved. Return to the homepage to resume your game.
      </p>

      <Link to="/" className="btn btn-lime btn-lg">
        <Compass size={18} />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
