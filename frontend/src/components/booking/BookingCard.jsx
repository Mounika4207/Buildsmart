import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Hash, IndianRupee } from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';

export const BookingCard = ({ booking, onCancelClick }) => {
  if (!booking) return null;

  const turf = booking.turf || {};
  const turfId = turf._id || turf.id;
  const bookingId = booking._id || booking.id;
  const image =
    turf.images && turf.images.length > 0
      ? turf.images[0]
      : 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=600&q=80';

  const canCancel = booking.status === 'confirmed';

  return (
    <div
      className="card card-hoverable"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', padding: '1.25rem' }}>
        {/* Turf Thumbnail */}
        <div
          style={{
            width: '140px',
            height: '110px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            flexShrink: 0,
            backgroundColor: '#0c1424',
          }}
        >
          <img
            src={image}
            alt={turf.name || 'Turf'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Hash size={13} />
              <span>{booking.bookingReference || bookingId}</span>
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <StatusBadge status={booking.status} type="booking" />
              {booking.paymentStatus && <StatusBadge status={booking.paymentStatus} type="payment" />}
            </div>
          </div>

          <h4 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
            {turf.name || 'Sports Facility'}
          </h4>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <MapPin size={14} color="var(--lime-primary)" />
            <span>
              {turf.area ? `${turf.area}, ` : ''}
              {turf.city || 'India'}
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginTop: '0.35rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} color="var(--lime-primary)" />
              <span>{formatDate(booking.date)}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} color="var(--lime-primary)" />
              <span>
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Details & Actions */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '0.85rem 1.25rem',
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
            Total Amount
          </span>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--lime-primary)' }}>
            {formatCurrency(booking.totalAmount)}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          {turfId && (
            <Link to={`/turfs/${turfId}`} className="btn btn-secondary btn-sm">
              View Turf
            </Link>
          )}

          {canCancel && onCancelClick && (
            <button
              type="button"
              onClick={() => onCancelClick(booking)}
              className="btn btn-danger btn-sm"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
