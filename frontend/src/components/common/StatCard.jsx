import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'var(--lime-primary)' }) => {
  return (
    <div
      className="card"
      style={{
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
          {title}
        </span>
        <h3 style={{ fontSize: '1.85rem', color: '#ffffff', margin: '0.35rem 0 0.15rem 0' }}>
          {value}
        </h3>
        {subtitle && (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {subtitle}
          </span>
        )}
      </div>

      {Icon && (
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
          }}
        >
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
