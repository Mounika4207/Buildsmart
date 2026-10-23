import React from 'react';
import { formatCurrency, formatDate, formatTime, formatDuration } from '../../utils/formatters';
import { ShieldCheck, Info } from 'lucide-react';

export const PriceSummary = ({
  turf,
  date,
  selectedSlot,
  duration = 1,
  onProceed,
  loading = false,
  isCheckout = false,
  termsAccepted = false,
  onTermsChange,
}) => {
  if (!turf) return null;

  const hourlyRate = turf.pricePerHour || 0;
  const numDuration = Number(duration) || 1;
  const subtotal = hourlyRate * numDuration;
  // 0 convenience fee for college project demonstration
  const totalAmount = subtotal;

  return (
    <div
      className="card"
      style={{
        padding: '1.5rem',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-medium)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0, borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        Booking & Price Summary
      </h3>

      {/* Selected Slot Information */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Date:</span>
          <span style={{ fontWeight: 600, color: '#ffffff' }}>{formatDate(date)}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Selected Slot:</span>
          <span style={{ fontWeight: 600, color: selectedSlot ? 'var(--lime-primary)' : 'var(--text-muted)' }}>
            {selectedSlot ? `${formatTime(selectedSlot.startTime)} - ${formatTime(selectedSlot.endTime || `${parseInt(selectedSlot.startTime) + numDuration}:00`)}` : 'None Selected'}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Duration:</span>
          <span style={{ fontWeight: 600, color: '#ffffff' }}>{formatDuration(numDuration)}</span>
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

      {/* Price Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            Base Price ({formatCurrency(hourlyRate)} × {numDuration} hr)
          </span>
          <span style={{ color: '#ffffff' }}>{formatCurrency(subtotal)}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Convenience Fee:</span>
          <span style={{ color: 'var(--lime-primary)', fontWeight: 600 }}>₹0 (Waived)</span>
        </div>

        <div
          style={{
            borderTop: '1px dashed var(--border-medium)',
            paddingTop: '0.75rem',
            marginTop: '0.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>Total Amount:</span>
          <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--lime-primary)' }}>
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>

      {/* Cancellation policy excerpt */}
      {turf.cancellationPolicy && (
        <div
          style={{
            padding: '0.75rem',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'flex-start',
          }}
        >
          <Info size={16} color="var(--lime-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{turf.cancellationPolicy}</span>
        </div>
      )}

      {/* Terms checkbox if in checkout mode */}
      {isCheckout && (
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => onTermsChange && onTermsChange(e.target.checked)}
            style={{ marginTop: '3px' }}
          />
          <span>
            I agree to the facility rules, venue equipment guidelines, and PlayArena booking policies.
          </span>
        </label>
      )}

      {/* Action Button */}
      {onProceed && (
        <button
          type="button"
          disabled={!selectedSlot || loading || (isCheckout && !termsAccepted)}
          onClick={onProceed}
          className="btn btn-lime"
          style={{ width: '100%', height: '48px', fontSize: '1rem', fontWeight: 700 }}
        >
          {loading ? 'Processing...' : isCheckout ? 'Confirm Booking' : 'Proceed to Checkout'}
        </button>
      )}
    </div>
  );
};

export default PriceSummary;
