import React from 'react';

export const LoadingSkeleton = ({ count = 3, height = '180px', width = '100%', style = {} }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', ...style }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse"
          style={{
            height,
            width,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
          }}
        />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
