import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '420px',
          width: 'calc(100% - 48px)',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => {
          let bg = '#16223b';
          let border = 'rgba(255, 255, 255, 0.12)';
          let Icon = Info;
          let iconColor = '#38bdf8';

          if (toast.type === 'success') {
            border = 'rgba(16, 239, 140, 0.4)';
            Icon = CheckCircle2;
            iconColor = '#10ef8c';
          } else if (toast.type === 'error') {
            border = 'rgba(239, 68, 68, 0.4)';
            Icon = AlertCircle;
            iconColor = '#f87171';
          }

          return (
            <div
              key={toast.id}
              className="animate-fade-in"
              style={{
                backgroundColor: bg,
                border: `1px solid ${border}`,
                borderRadius: '10px',
                padding: '12px 16px',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                fontSize: '0.9rem',
                pointerEvents: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={20} color={iconColor} style={{ flexShrink: 0 }} />
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                }}
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
