import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { turfService } from '../services/turfService';
import { reviewService } from '../services/reviewService';
import TimeSlotGrid from '../components/booking/TimeSlotGrid';
import PriceSummary from '../components/booking/PriceSummary';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';
import {
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  Phone,
  Mail,
  CheckCircle2,
  Share2,
  Navigation,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export const TurfDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // Data states
  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery active image
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Booking states
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [duration, setDuration] = useState(1);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Reviews state
  const [reviews, setReviews] = useState([]);

  // Fetch Turf details
  useEffect(() => {
    const fetchTurf = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await turfService.getTurfById(id);
        if (res.turf) {
          setTurf(res.turf);
        } else {
          setError('Turf not found.');
        }
      } catch (err) {
        console.error('Error fetching turf:', err);
        setError('Failed to load facility details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTurf();
  }, [id]);

  // Fetch slot availability when date or turf ID changes
  useEffect(() => {
    if (!id || !selectedDate) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSelectedSlot(null);
      try {
        const res = await turfService.getTurfAvailability(id, selectedDate);
        setSlots(res.slots || []);
      } catch (err) {
        console.error('Error fetching slots:', err);
        showToast('Could not refresh slot availability for this date.', 'error');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [id, selectedDate, showToast]);

  // Fetch reviews
  useEffect(() => {
    if (!id) return;
    reviewService.getTurfReviews(id).then((res) => {
      if (res.reviews) setReviews(res.reviews);
    }).catch(() => {});
  }, [id]);

  const handleProceedBooking = () => {
    if (!selectedSlot) {
      showToast('Please select an available time slot first.', 'error');
      return;
    }

    if (!isAuthenticated) {
      showToast('Please log in or register to complete your reservation.', 'info');
      navigate('/login', {
        state: {
          from: location,
          bookingIntent: {
            turfId: id,
            date: selectedDate,
            slot: selectedSlot,
            duration,
          },
        },
      });
      return;
    }

    // Navigate to checkout with payload
    navigate('/booking/checkout', {
      state: {
        turf,
        date: selectedDate,
        slot: selectedSlot,
        duration,
      },
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: turf?.name,
        text: `Check out ${turf?.name} on PlayArena!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <LoadingSkeleton count={4} height="200px" />
      </div>
    );
  }

  if (error || !turf) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <ErrorState
          title="Facility Unavailable"
          message={error || 'We could not find the sports turf you were looking for.'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const images = turf.images && turf.images.length > 0 ? turf.images : [
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
  ];

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem 1.5rem' }}>
      {/* Turf Top Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            {turf.isVerified && (
              <span className="badge badge-verified">
                <ShieldCheck size={14} />
                <span>Verified Facility</span>
              </span>
            )}
            {turf.sports?.map((s) => (
              <span key={s} className="badge badge-sport">
                {s}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.4rem' }}
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#ffffff', marginBottom: '0.5rem' }}>
          {turf.name}
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={16} color="var(--lime-primary)" />
            <span>{turf.address || `${turf.area}, ${turf.city}`}</span>
          </div>

          {turf.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#fbbf24', fontWeight: 700 }}>
              <Star size={16} fill="#fbbf24" color="#fbbf24" />
              <span>{turf.rating}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                ({turf.reviewsCount || reviews.length || 0} reviews)
              </span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={16} color="var(--lime-primary)" />
            <span>
              Open {turf.openingHours?.open || '06:00'} - {turf.openingHours?.close || '23:00'}
            </span>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
        {/* Main Banner Image */}
        <div
          style={{
            width: '100%',
            height: 'clamp(280px, 45vh, 460px)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            backgroundColor: '#0c1424',
          }}
        >
          <img
            src={images[selectedImageIndex]}
            alt={turf.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Thumbnail Selector */}
        {images.length > 1 && (
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                style={{
                  width: '90px',
                  height: '65px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: selectedImageIndex === idx ? '2px solid var(--lime-primary)' : '1px solid var(--border-subtle)',
                  opacity: selectedImageIndex === idx ? 1 : 0.65,
                  padding: 0,
                }}
              >
                <img src={img} alt={`Thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details & Booking Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: '2.5rem',
          alignItems: 'start',
        }}
        className="turf-details-grid"
      >
        {/* Left Column: Description, Facilities, Hours, Owner, Map, Reviews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* About Turf */}
          <section>
            <h3 style={{ fontSize: '1.35rem', color: '#ffffff', marginBottom: '0.85rem' }}>
              About This Arena
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              {turf.description ||
                'High-performance sports court built to international standards with certified synthetic turf, optimal shock absorption, and stadium floodlights.'}
            </p>
          </section>

          {/* Amenities & Facilities */}
          <section>
            <h3 style={{ fontSize: '1.35rem', color: '#ffffff', marginBottom: '1rem' }}>
              Facilities & Amenities
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {turf.facilities?.map((f) => (
                <div
                  key={f}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.88rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  <CheckCircle2 size={16} color="var(--lime-primary)" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Venue Location & Map Placeholder */}
          <section>
            <h3 style={{ fontSize: '1.35rem', color: '#ffffff', marginBottom: '0.85rem' }}>
              Venue Location
            </h3>
            <div
              className="card"
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Navigation size={20} color="var(--lime-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{turf.address}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Landmark: Near Main Road Transit Hub • Free parking on-site
                  </div>
                </div>
              </div>

              {/* Map Placeholder Graphic */}
              <div
                style={{
                  height: '180px',
                  backgroundColor: '#0c1527',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed var(--border-medium)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  color: 'var(--text-muted)',
                }}
              >
                <MapPin size={32} color="var(--lime-primary)" />
                <span style={{ fontSize: '0.85rem' }}>Interactive GPS Navigation Map Preview</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--lime-primary)' }}>
                  Lat: 12.9352° N, Long: 77.6245° E
                </span>
              </div>
            </div>
          </section>

          {/* Owner / Contact Info */}
          {turf.owner && (
            <section>
              <h3 style={{ fontSize: '1.35rem', color: '#ffffff', marginBottom: '0.85rem' }}>
                Facility Management
              </h3>
              <div
                className="card"
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>
                    {turf.owner.name || 'Arena Manager'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--lime-primary)' }}>
                    Authorized Facility Host
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {turf.owner.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Phone size={14} color="var(--lime-primary)" />
                      <span>{turf.owner.phone}</span>
                    </div>
                  )}
                  {turf.owner.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Mail size={14} color="var(--lime-primary)" />
                      <span>{turf.owner.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Reviews & Ratings */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#ffffff', margin: 0 }}>
                Player Reviews ({reviews.length})
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontWeight: 700 }}>
                <Star size={18} fill="#fbbf24" color="#fbbf24" />
                <span>{turf.rating || 5.0} / 5</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="card"
                  style={{ padding: '1.25rem', backgroundColor: 'var(--bg-card)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: '#ffffff' }}>{rev.userName}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(rev.date, true)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '0.65rem' }}>
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Slot Selector & Price Summary */}
        <div
          id="booking"
          style={{
            position: 'sticky',
            top: '90px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          {/* Slot Selection Card */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
                Select Match Date & Slot
              </h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--lime-primary)', fontWeight: 700 }}>
                {formatCurrency(turf.pricePerHour)}/hr
              </div>
            </div>

            {/* Date Picker Input */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                Booking Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem' }}
              />
            </div>

            {/* Duration Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                Match Duration
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {[1, 2, 3].map((hr) => (
                  <button
                    key={hr}
                    type="button"
                    onClick={() => setDuration(hr)}
                    style={{
                      padding: '0.55rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      backgroundColor: duration === hr ? 'var(--lime-primary)' : 'rgba(255, 255, 255, 0.05)',
                      color: duration === hr ? 'var(--lime-text)' : 'var(--text-primary)',
                      border: duration === hr ? '1px solid var(--lime-primary)' : '1px solid var(--border-subtle)',
                    }}
                  >
                    {hr} {hr === 1 ? 'Hour' : 'Hours'}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots Grid */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                Available Hourly Slots
              </label>
              <TimeSlotGrid
                slots={slots}
                selectedSlot={selectedSlot}
                onSelectSlot={(slot) => setSelectedSlot(slot)}
                loading={loadingSlots}
              />
            </div>
          </div>

          {/* Price Summary and Checkout Action */}
          <PriceSummary
            turf={turf}
            date={selectedDate}
            selectedSlot={selectedSlot}
            duration={duration}
            onProceed={handleProceedBooking}
            isCheckout={false}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .turf-details-grid {
            grid-template-columns: 1fr !important;
          }
          #booking {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TurfDetails;
