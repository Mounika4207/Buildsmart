import React from 'react';
import Modal from './Modal';
import { AlertCircle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = false,
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="460px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          {isDanger && (
            <div
              style={{
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                flexShrink: 0,
              }}
            >
              <AlertCircle size={24} />
            </div>
          )}
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            {message}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`btn ${isDanger ? 'btn-danger' : 'btn-lime'}`}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
