import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Hash,
  Download,
  Share2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { formatDate, formatTime, formatCurrency } from '../utils/formatters';

export const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const location = useLocation();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (booking) return;

    const fetchBooking = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await bookingService.getBookingById(bookingId);
        if (res.booking) {
          setBooking(res.booking);
        } else {
          setError('Booking record not found.');
        }
      } catch (err) {
        console.error('Error fetching booking confirmation:', err);
        setError('Could not retrieve booking details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, booking]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '680px' }}>
        <LoadingSkeleton count={3} height="120px" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <ErrorState
          title="Booking Not Found"
          message={error || 'No confirmed booking was found matching this reference.'}
        />
      </div>
    );
  }

  const turf = booking.turf || {};
  const reference = booking.bookingReference || booking._id || booking.id;

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 5rem 1.5rem', maxWidth: '780px' }}>
      {/* Success Hero Header */}
      <div
        className="card animate-fade-in"
        style={{
          padding: '2.5rem 2rem',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(16, 239, 140, 0.3)',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 239, 140, 0.15)',
            color: 'var(--lime-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            boxShadow: 'var(--shadow-glow)',
          }}
        >
          <CheckCircle size={40} />
        </div>

        <span className="badge badge-confirmed" style={{ marginBottom: '0.75rem' }}>
          Slot Confirmed
        </span>

        <h1 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '0.5rem' }}>
          Booking Confirmed!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '520px', lineHeight: 1.6 }}>
          Your sports ground reservation is locked in. A booking confirmation has been issued with reference number below.
        </p>

        {/* Reference Banner */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px dashed var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Booking Reference:</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--lime-primary)', letterSpacing: '0.05em' }}>
            {reference}
          </span>
        </div>
      </div>

      {/* Booking Details Card */}
      <div
        className="card"
        style={{
          padding: '2rem',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0, borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          Reservation Breakdown
        </h3>

        {/* Turf Info */}
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <img
            src={turf.images?.[0] || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=300&q=80'}
            alt={turf.name}
            style={{ width: '90px', height: '70px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
          />
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: 0 }}>{turf.name}</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              <MapPin size={14} color="var(--lime-primary)" />
              <span>{turf.address || turf.city}</span>
            </div>
          </div>
        </div>

        {/* Details List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', fontSize: '0.9rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Date</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{formatDate(booking.date)}</span>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Time Slot</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)} ({booking.duration || 1} hr)
            </span>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Booking Status</span>
            <div style={{ marginTop: '3px' }}>
              <StatusBadge status={booking.status} type="booking" />
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Payment Status</span>
            <div style={{ marginTop: '3px' }}>
              <StatusBadge status={booking.paymentStatus || 'pending'} type="payment" />
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Total Amount</span>
            <span style={{ color: 'var(--lime-primary)', fontWeight: 800, fontSize: '1.2rem' }}>
              {formatCurrency(booking.totalAmount)}
            </span>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Payment Method</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{booking.paymentMethod || 'Pay at Venue'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/my-bookings" className="btn btn-lime btn-lg">
          <span>View My Bookings</span>
          <ArrowRight size={18} />
        </Link>
        <Link to="/" className="btn btn-secondary btn-lg">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;
