import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { bookingService } from '../services/bookingService';
import StatCard from '../components/common/StatCard';
import BookingCard from '../components/booking/BookingCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getMyBookings();
      setBookings(res.bookings || []);
    } catch (err) {
      console.error('Failed to load user bookings:', err);
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
      await bookingService.cancelBooking(bId, 'Customer requested cancellation via portal');
      showToast('Booking cancelled successfully.', 'success');
      setBookingToCancel(null);
      fetchBookings();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel booking.', 'error');
    } finally {
      setCancelling(false);
    }
  };

  // Classify bookings
  const today = new Date().toISOString().split('T')[0];
  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' && b.date >= today
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'completed' || (b.status === 'confirmed' && b.date < today)
  );
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled');

  const totalSpent = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, #131d33 0%, #0c1424 100%)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--lime-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Player Dashboard
          </span>
          <h1 style={{ fontSize: '2rem', color: '#ffffff', margin: '0.25rem 0 0.5rem 0' }}>
            Welcome back, {user?.name || 'Athlete'}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
            Here is an overview of your court reservations and upcoming match schedules.
          </p>
        </div>

        <Link to="/turfs" className="btn btn-lime">
          <Compass size={18} />
          <span>Book a Ground</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <StatCard
          title="Upcoming Matches"
          value={upcomingBookings.length}
          subtitle="Confirmed reservations"
          icon={Calendar}
          color="var(--lime-primary)"
        />
        <StatCard
          title="Past Games"
          value={pastBookings.length}
          subtitle="Completed sessions"
          icon={CheckCircle2}
          color="#38bdf8"
        />
        <StatCard
          title="Total Spent"
          value={formatCurrency(totalSpent)}
          subtitle="Across active bookings"
          icon={IndianRupee}
          color="#fbbf24"
        />
        <StatCard
          title="Cancelled"
          value={cancelledBookings.length}
          subtitle="Past cancellations"
          icon={XCircle}
          color="#f87171"
        />
      </div>

      {/* Upcoming Bookings Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', margin: 0 }}>
              Upcoming Reservations ({upcomingBookings.length})
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
              Your scheduled matches ready to play.
            </p>
          </div>

          <Link to="/my-bookings" style={{ color: 'var(--lime-primary)', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>View All</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton count={2} height="160px" />
        ) : upcomingBookings.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No Upcoming Bookings"
            description="You don't have any scheduled sports matches. Explore popular turfs and secure your next game!"
            actionLabel="Discover Grounds"
            actionLink="/turfs"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {upcomingBookings.map((b) => (
              <BookingCard
                key={b._id || b.id}
                booking={b}
                onCancelClick={(target) => setBookingToCancel(target)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Booking Cancellation */}
      <ConfirmDialog
        isOpen={!!bookingToCancel}
        onClose={() => setBookingToCancel(null)}
        onConfirm={handleCancelConfirm}
        title="Cancel Court Reservation"
        message={`Are you sure you want to cancel booking ${bookingToCancel?.bookingReference || ''} at ${bookingToCancel?.turf?.name || 'this turf'}? Cancellation policies apply.`}
        confirmLabel="Yes, Cancel Booking"
        cancelLabel="Keep Reservation"
        isDanger={true}
        loading={cancelling}
      />
    </div>
  );
};

export default CustomerDashboard;
