import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { turfService } from '../services/turfService';
import { bookingService } from '../services/bookingService';
import { MOCK_USERS } from '../data/mockData';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import {
  ShieldAlert,
  Users,
  Layers,
  Calendar,
  CheckCircle,
  XCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [turfs, setTurfs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      try {
        const [turfData, bookingData] = await Promise.all([
          turfService.getAllTurfs(),
          bookingService.getOwnerBookings(),
        ]);
        setTurfs(turfData.turfs || []);
        setBookings(bookingData.bookings || []);
      } catch (err) {
        console.error('Admin overview failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const pendingTurfs = turfs.filter((t) => !t.isVerified);
  const verifiedTurfs = turfs.filter((t) => t.isVerified);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Admin Banner */}
      <div
        className="card"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, #1b1735 0%, #0d1222 100%)',
          border: '1px solid rgba(147, 51, 234, 0.3)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        <div>
          <span className="badge" style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
            Super Admin Console
          </span>
          <h1 style={{ fontSize: '2rem', color: '#ffffff', margin: '0.4rem 0 0.5rem 0' }}>
            System Governance & Operations
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
            Supervise platform facility verification, user accounts, and booking transactions.
          </p>
        </div>

        <Link to="/admin/turfs" className="btn btn-lime">
          <ShieldAlert size={18} />
          <span>Review Pending Turfs ({pendingTurfs.length})</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <StatCard
          title="Pending Approvals"
          value={pendingTurfs.length}
          subtitle="Turfs awaiting audit"
          icon={ShieldAlert}
          color="#fbbf24"
        />
        <StatCard
          title="Verified Facilities"
          value={verifiedTurfs.length}
          subtitle="Active bookable venues"
          icon={ShieldCheck}
          color="var(--lime-primary)"
        />
        <StatCard
          title="Registered Users"
          value={MOCK_USERS.length}
          subtitle="Athletes & turf partners"
          icon={Users}
          color="#38bdf8"
        />
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          subtitle="System-wide reservations"
          icon={Calendar}
          color="#a855f7"
        />
      </div>

      {/* Pending Approvals Table */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>
              Venues Awaiting Verification ({pendingTurfs.length})
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Facilities submitted by owners needing verification before appearing publicly.
            </span>
          </div>

          <Link to="/admin/turfs" style={{ color: 'var(--lime-primary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Manage All</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton count={2} height="60px" />
        ) : pendingTurfs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            All sports turf listings are currently verified. No pending reviews!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Venue Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Location</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Sports</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Owner</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingTurfs.map((t) => (
                  <tr key={t._id || t.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#fff' }}>
                      {t.name}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                      {t.city} ({t.area})
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {t.sports?.join(', ')}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                      {t.owner?.name || 'Partner'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge badge-pending">Pending Review</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <Link to="/admin/turfs" className="btn btn-secondary btn-sm">
                        Audit
                      </Link>
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

export default AdminDashboard;
