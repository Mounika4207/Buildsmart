import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { turfService } from '../services/turfService';
import { bookingService } from '../services/bookingService';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import {
  Layers,
  Calendar,
  IndianRupee,
  Clock,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';

export const OwnerDashboard = () => {
  const { user } = useAuth();
  const [turfs, setTurfs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOwnerData = async () => {
      setLoading(true);
      try {
        const [turfsRes, bookingsRes] = await Promise.all([
          turfService.getOwnerTurfs(),
          bookingService.getOwnerBookings(),
        ]);
        setTurfs(turfsRes.turfs || []);
        setBookings(bookingsRes.bookings || []);
      } catch (err) {
        console.error('Owner dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOwnerData();
  }, []);

  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);

  const upcomingCount = bookings.filter((b) => b.status === 'confirmed').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header Banner */}
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
            Facility Partner Console
          </span>
          <h1 style={{ fontSize: '2rem', color: '#ffffff', margin: '0.25rem 0 0.5rem 0' }}>
            {user?.name || 'Owner'} Management Hub
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
            Manage arena listings, track daily occupancy, and monitor incoming booking revenues.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/owner/turfs/new" className="btn btn-lime">
            <PlusCircle size={18} />
            <span>Add Facility</span>
          </Link>
          <Link to="/owner/schedule" className="btn btn-secondary">
            <Clock size={18} />
            <span>Slot Schedule</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <StatCard
          title="Total Venues"
          value={turfs.length}
          subtitle="Listed sports facilities"
          icon={Layers}
          color="var(--lime-primary)"
        />
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          subtitle="All recorded slots"
          icon={Calendar}
          color="#38bdf8"
        />
        <StatCard
          title="Upcoming Slots"
          value={upcomingCount}
          subtitle="Confirmed reservations"
          icon={Clock}
          color="#fbbf24"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          subtitle="Completed / Confirmed INR"
          icon={IndianRupee}
          color="#10ef8c"
        />
      </div>

      {/* Recent Reservations Table */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>
              Recent Customer Reservations
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Live customer activity across all your sports grounds.
            </span>
          </div>
          <Link to="/owner/bookings" style={{ color: 'var(--lime-primary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>View All</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton count={3} height="60px" />
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>
            No customer bookings recorded yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Reference</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Turf</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Customer</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Date & Slot</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Amount</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b._id || b.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#fff' }}>
                      {b.bookingReference || b._id}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-primary)' }}>
                      {b.turf?.name || 'Venue'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                      <div>{b.customer?.name || 'Customer'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.customer?.phone}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-primary)' }}>
                      <div>{formatDate(b.date, true)}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {formatTime(b.startTime)} - {formatTime(b.endTime)}
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--lime-primary)' }}>
                      {formatCurrency(b.totalAmount)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <StatusBadge status={b.status} type="booking" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
