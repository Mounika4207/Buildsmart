import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { useToast } from '../context/ToastContext';
import BookingCard from '../components/booking/BookingCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { Calendar, Compass } from 'lucide-react';

export const MyBookings = () => {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'upcoming' | 'past' | 'cancelled'
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getMyBookings();
      setBookings(res.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      showToast('Failed to load your reservations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return;
    setCancelling(true);
    try {
      const bId = bookingToCancel._id || bookingToCancel.id;
      await bookingService.cancelBooking(bId, 'Customer cancellation via dashboard');
      showToast('Booking cancelled.', 'success');
      setBookingToCancel(null);
      fetchBookings();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not cancel booking.', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') {
      return b.status === 'confirmed' && b.date >= today;
    }
    if (activeTab === 'past') {
      return b.status === 'completed' || (b.status === 'confirmed' && b.date < today);
    }
    if (activeTab === 'cancelled') {
      return b.status === 'cancelled';
    }
    return true; // 'all'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#ffffff', margin: 0 }}>
            My Match Bookings
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Track, review, or cancel your turf and court reservations.
          </p>
        </div>

        <Link to="/turfs" className="btn btn-lime">
          <Compass size={18} />
          <span>Book New Slot</span>
        </Link>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.5rem',
          overflowX: 'auto',
        }}
      >
        {[
          { key: 'all', label: `All (${bookings.length})` },
          { key: 'upcoming', label: `Upcoming (${bookings.filter((b) => b.status === 'confirmed' && b.date >= today).length})` },
          { key: 'past', label: `Past / Completed (${bookings.filter((b) => b.status === 'completed' || (b.status === 'confirmed' && b.date < today)).length})` },
          { key: 'cancelled', label: `Cancelled (${bookings.filter((b) => b.status === 'cancelled').length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.88rem',
              backgroundColor: activeTab === tab.key ? 'rgba(16, 239, 140, 0.12)' : 'transparent',
              color: activeTab === tab.key ? 'var(--lime-primary)' : 'var(--text-secondary)',
              border: activeTab === tab.key ? '1px solid rgba(16, 239, 140, 0.3)' : '1px solid transparent',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <LoadingSkeleton count={3} height="160px" />
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={`No ${activeTab !== 'all' ? activeTab : ''} bookings found`}
          description="You do not have any bookings in this section."
          actionLabel="Explore Available Turfs"
          actionLink="/turfs"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredBookings.map((b) => (
            <BookingCard
              key={b._id || b.id}
              booking={b}
              onCancelClick={(target) => setBookingToCancel(target)}
            />
          ))}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!bookingToCancel}
        onClose={() => setBookingToCancel(null)}
        onConfirm={handleCancelConfirm}
        title="Confirm Cancellation"
        message={`Are you sure you want to cancel your reservation for ${bookingToCancel?.turf?.name}? This action cannot be reversed.`}
        confirmLabel="Confirm Cancellation"
        cancelLabel="Nevermind"
        isDanger={true}
        loading={cancelling}
      />
    </div>
  );
};

export default MyBookings;
