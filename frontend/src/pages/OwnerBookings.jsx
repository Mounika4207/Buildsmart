import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { turfService } from '../services/turfService';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { Calendar, Filter, Phone, Mail, Clock } from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';

export const OwnerBookings = () => {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedTurf, setSelectedTurf] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [bRes, tRes] = await Promise.all([
        bookingService.getOwnerBookings({
          turfId: selectedTurf,
          status: selectedStatus,
        }),
        turfService.getOwnerTurfs(),
      ]);
      setBookings(bRes.bookings || []);
      setTurfs(tRes.turfs || []);
    } catch (err) {
      console.error('Failed to load owner bookings:', err);
      showToast('Could not fetch reservations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedTurf, selectedStatus]);

  const filtered = bookings.filter((b) => {
    if (selectedDate && b.date !== selectedDate) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', color: '#ffffff', margin: 0 }}>
          Facility Reservations
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
          Inspect incoming bookings, verify payments, and check customer details across your venues.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) auto',
          gap: '1rem',
          alignItems: 'end',
        }}
      >
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
            Filter by Venue
          </label>
          <select
            value={selectedTurf}
            onChange={(e) => setSelectedTurf(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 0.85rem' }}
          >
            <option value="all">All My Facilities</option>
            {turfs.map((t) => (
              <option key={t._id || t.id} value={t._id || t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
            Reservation Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 0.85rem' }}
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
            Specific Match Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 0.85rem' }}
          />
        </div>

        {selectedDate && (
          <button
            type="button"
            onClick={() => setSelectedDate('')}
            className="btn btn-secondary btn-sm"
            style={{ height: '40px' }}
          >
            Clear Date
          </button>
        )}
      </div>

      {/* Bookings Table */}
      {loading ? (
        <LoadingSkeleton count={4} height="80px" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No reservations found"
          description="No bookings matched the selected filters."
        />
      ) : (
        <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Reference</th>
                <th style={{ padding: '0.75rem 1rem' }}>Facility</th>
                <th style={{ padding: '0.75rem 1rem' }}>Player Details</th>
                <th style={{ padding: '0.75rem 1rem' }}>Match Schedule</th>
                <th style={{ padding: '0.75rem 1rem' }}>Total Amount</th>
                <th style={{ padding: '0.75rem 1rem' }}>Payment</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b._id || b.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: '#fff' }}>
                    {b.bookingReference || b._id}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>
                    {b.turf?.name || 'Venue'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ color: '#fff', fontWeight: 600 }}>{b.customer?.name || 'Player'}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{b.customer?.phone}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ color: '#fff' }}>{formatDate(b.date, true)}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {formatTime(b.startTime)} - {formatTime(b.endTime)}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 800, color: 'var(--lime-primary)' }}>
                    {formatCurrency(b.totalAmount)}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <StatusBadge status={b.paymentStatus || 'pending'} type="payment" />
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <StatusBadge status={b.status} type="booking" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OwnerBookings;
