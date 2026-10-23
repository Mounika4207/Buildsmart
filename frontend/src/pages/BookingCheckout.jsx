import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { bookingService } from '../services/bookingService';
import PriceSummary from '../components/booking/PriceSummary';
import {
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  Building,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { formatDate, formatTime } from '../utils/formatters';

export const BookingCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  // Booking payload from state
  const bookingData = location.state || {};
  const turf = bookingData.turf;
  const date = bookingData.date;
  const slot = bookingData.slot;
  const duration = bookingData.duration || 1;

  const [paymentMethod, setPaymentMethod] = useState('Pay at Venue');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Guard against direct navigation without payload
  if (!turf || !slot || !date) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '2.5rem' }}>
          <AlertCircle size={44} color="#f87171" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
            No Booking Session Found
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Please select an arena and available time slot before checking out.
          </p>
          <Link to="/turfs" className="btn btn-lime">
            Explore Turfs
          </Link>
        </div>
      </div>
    );
  }

  const turfId = turf._id || turf.id;

  const handleConfirmBooking = async () => {
    if (!termsAccepted) {
      showToast('Please accept the booking terms to continue.', 'error');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        turfId,
        date,
        startTime: slot.startTime,
        endTime: slot.endTime || `${parseInt(slot.startTime) + Number(duration)}:00`,
        duration: Number(duration),
        paymentMethod,
        customerName: user?.name,
        customerEmail: user?.email,
        customerPhone: user?.phone,
      };

      const res = await bookingService.createBooking(payload);
      showToast('Booking reserved successfully!', 'success');

      const createdBookingId = res.booking?._id || res.booking?.id || res.booking?.bookingReference;
      navigate(`/booking/confirmation/${createdBookingId}`, {
        state: { booking: res.booking },
        replace: true,
      });
    } catch (err) {
      console.error('Booking confirmation failed:', err);
      const msg = err.response?.data?.message || err.message || 'Slot conflict or server error. Please try another time.';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          to={`/turfs/${turfId}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            marginBottom: '0.75rem',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Turf Details</span>
        </Link>
        <h1 style={{ fontSize: '2.2rem', color: '#ffffff', margin: 0 }}>
          Review & Confirm Reservation
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
          Finalize your ground timing and select your payment option.
        </p>
      </div>

      {errorMsg && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-sm)',
            color: '#f87171',
            marginBottom: '1.5rem',
          }}
        >
          {errorMsg}
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: '2.5rem',
          alignItems: 'start',
        }}
        className="checkout-grid"
      >
        {/* Left Column: Venue Summary, Player Details, Payment Option */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Turf Venue Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              Venue Details
            </h3>

            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <img
                src={turf.images?.[0] || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=400&q=80'}
                alt={turf.name}
                style={{ width: '100px', height: '80px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: 0 }}>{turf.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  <MapPin size={14} color="var(--lime-primary)" />
                  <span>{turf.address || turf.city}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reserved Schedule Details */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              Reserved Schedule
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(16, 239, 140, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lime-primary)' }}>
                  <Calendar size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Match Date</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>{formatDate(date)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(16, 239, 140, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lime-primary)' }}>
                  <Clock size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Time Slot & Duration</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
                    {formatTime(slot.startTime)} ({duration} hr)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer / Player Info */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              Player Contact Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Name</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{user?.name || 'Player'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Email</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{user?.email || 'N/A'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Phone</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{user?.phone || '+91 99887 76655'}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>
              Payment Mode
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Real payment gateways (Razorpay/Stripe) will be integrated in backend phase. For this demo, choose your settlement preference:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: paymentMethod === 'Pay at Venue' ? 'rgba(16, 239, 140, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: paymentMethod === 'Pay at Venue' ? '1px solid var(--lime-primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Pay at Venue"
                  checked={paymentMethod === 'Pay at Venue'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <Building size={20} color="var(--lime-primary)" />
                <div>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>Pay at Venue (Cash / UPI at Counter)</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status marked as "Payment Pending" until paid at facility.</div>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: paymentMethod === 'Simulated UPI' ? 'rgba(16, 239, 140, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: paymentMethod === 'Simulated UPI' ? '1px solid var(--lime-primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Simulated UPI"
                  checked={paymentMethod === 'Simulated UPI'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <CreditCard size={20} color="var(--lime-primary)" />
                <div>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>Simulated Instant UPI / Card</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Demo test payment verification.</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Authoritative Price Summary and Submission */}
        <div>
          <PriceSummary
            turf={turf}
            date={date}
            selectedSlot={slot}
            duration={duration}
            onProceed={handleConfirmBooking}
            loading={submitting}
            isCheckout={true}
            termsAccepted={termsAccepted}
            onTermsChange={setTermsAccepted}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 868px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingCheckout;
