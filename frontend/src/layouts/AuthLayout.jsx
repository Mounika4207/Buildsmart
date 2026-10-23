import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2.5rem 1.5rem',
        background: 'radial-gradient(circle at 50% 20%, #162038 0%, #0a0f1d 70%)',
      }}
    >
      {/* Brand Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'var(--lime-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--bg-dark)',
              boxShadow: '0 0 20px rgba(16, 239, 140, 0.4)',
            }}
          >
            <Trophy size={26} strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
            Play<span style={{ color: 'var(--lime-primary)' }}>Arena</span>
          </span>
        </Link>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Sports Turf & Court Booking Platform
        </p>
      </div>

      {/* Main Auth Card Container */}
      <div
        className="card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem 2rem',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <Outlet />
      </div>

      <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        PlayArena Academic Project Demo • Security Notice: Passwords hashed with bcrypt in MongoDB
      </div>
    </div>
  );
};

export default AuthLayout;
