import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { formatDate } from '../utils/formatters';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { Search, Mail, Phone, Users, ShieldAlert } from 'lucide-react';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getAdminUsers({
        role: roleFilter,
        search,
      });
      setUsers(res.users || []);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Could not retrieve user directory from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const filtered = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(q))
      );
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', color: '#ffffff', margin: 0 }}>
          User Directory & Roles
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
          Registered players, facility owners, and system administrators.
        </p>
      </div>

      {/* Filter toolbar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', flex: '1 1 280px', maxWidth: '440px' }}>
          <Search size={18} color="var(--lime-primary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by name, email, or phone (press Enter)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem' }}
          />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ padding: '0.65rem 1rem' }}
          >
            <option value="all">All Roles</option>
            <option value="customer">Athletes / Customers</option>
            <option value="owner">Turf Owners</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSkeleton count={4} height="70px" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Users Found"
          description="No user records matched your search query."
        />
      ) : (
        <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>User</th>
                <th style={{ padding: '0.75rem 1rem' }}>Contact</th>
                <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                <th style={{ padding: '0.75rem 1rem' }}>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                let roleBadgeClass = 'badge-secondary';
                if (u.role === 'admin') roleBadgeClass = 'badge-cancelled';
                if (u.role === 'owner') roleBadgeClass = 'badge-pending';
                if (u.role === 'customer') roleBadgeClass = 'badge-confirmed';

                return (
                  <tr key={u._id || u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{u.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ID: {u._id || u.id}</div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-primary)' }}>
                        <Mail size={13} color="var(--lime-primary)" />
                        <span>{u.email}</span>
                      </div>
                      {u.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                          <Phone size={13} color="var(--lime-primary)" />
                          <span>{u.phone}</span>
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${roleBadgeClass}`}>
                        {u.role}
                      </span>
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {formatDate(u.createdAt, true)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
