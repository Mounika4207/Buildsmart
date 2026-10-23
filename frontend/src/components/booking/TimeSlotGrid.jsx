import React from 'react';
import { formatTime } from '../../utils/formatters';
import { Clock, CheckCircle } from 'lucide-react';

export const TimeSlotGrid = ({
  slots = [],
  selectedSlot,
  onSelectSlot,
  loading = false,
}) => {
  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse"
            style={{
              height: '48px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
            }}
          />
        ))}
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        No slots available for the selected date. Please choose another date.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* Slot State Legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1.25rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          paddingBottom: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid var(--border-medium)' }} />
          <span>Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--lime-primary)' }} />
          <span>Selected</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)' }} />
          <span>Booked</span>
        </div>
      </div>

      {/* Grid of slot buttons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {slots.map((slot) => {
          const isSelected = selectedSlot?.startTime === slot.startTime;
          const isAvailable = slot.isAvailable;

          let btnStyle = {
            padding: '0.75rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.2rem',
            transition: 'all var(--transition-fast)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
          };

          if (isSelected) {
            btnStyle = {
              ...btnStyle,
              backgroundColor: 'var(--lime-primary)',
              color: 'var(--lime-text)',
              borderColor: 'var(--lime-primary)',
              boxShadow: '0 0 15px rgba(16, 239, 140, 0.4)',
              transform: 'scale(1.02)',
            };
          } else if (!isAvailable) {
            btnStyle = {
              ...btnStyle,
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              color: 'var(--text-muted)',
              borderColor: 'rgba(255, 255, 255, 0.04)',
              cursor: 'not-allowed',
              opacity: 0.6,
            };
          }

          return (
            <button
              key={slot.time || slot.startTime}
              type="button"
              disabled={!isAvailable}
              onClick={() => onSelectSlot(slot)}
              style={btnStyle}
              aria-label={`Slot ${slot.time || slot.startTime} - ${isAvailable ? 'Available' : slot.reason || 'Booked'}`}
            >
              <span>{formatTime(slot.startTime)}</span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 500,
                  opacity: isSelected ? 0.9 : 0.7,
                }}
              >
                {isSelected
                  ? 'Selected'
                  : !isAvailable
                  ? slot.reason || 'Booked'
                  : 'Available'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotGrid;
