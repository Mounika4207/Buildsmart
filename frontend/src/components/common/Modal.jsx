import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = '540px' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(5, 10, 20, 0.8)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        className="card animate-fade-in"
        style={{
          width: '100%',
          maxWidth,
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          borderRadius: 'var(--radius-lg)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              color: 'var(--text-secondary)',
              padding: '4px',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '1.5rem', overflowY: 'auto' }}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
