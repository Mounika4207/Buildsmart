import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Layers,
  PlusCircle,
  Users,
  ShieldCheck,
  User,
  Clock,
  Compass,
} from 'lucide-react';

export const DashboardSidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'customer';

  const customerLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/my-bookings', label: 'My Bookings', icon: Calendar },
    { to: '/profile', label: 'My Profile', icon: User },
    { to: '/turfs', label: 'Book a Turf', icon: Compass },
  ];

  const ownerLinks = [
    { to: '/owner/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/owner/turfs', label: 'My Turfs', icon: Layers },
    { to: '/owner/turfs/new', label: 'Add New Turf', icon: PlusCircle },
    { to: '/owner/bookings', label: 'Reservations', icon: Calendar },
    { to: '/owner/schedule', label: 'Slot Schedule', icon: Clock },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'System Overview', icon: LayoutDashboard },
    { to: '/admin/turfs', label: 'Turf Approvals', icon: ShieldCheck },
    { to: '/admin/users', label: 'User Directory', icon: Users },
    { to: '/profile', label: 'Admin Profile', icon: User },
  ];

  const links = role === 'admin' ? adminLinks : role === 'owner' ? ownerLinks : customerLinks;

  return (
    <aside
      style={{
        width: '260px',
        flexShrink: 0,
        backgroundColor: 'var(--bg-card)',
        borderRight: '1px solid var(--border-subtle)',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
      className="dashboard-sidebar"
    >
      <div style={{ padding: '0 0.75rem 1.25rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 700 }}>
          {role} Workspace
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '0.2rem' }}>
          {user?.name || 'Member'}
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard' || item.to === '/owner/dashboard' || item.to === '/admin/dashboard'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: isActive ? 'var(--lime-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'rgba(16, 239, 140, 0.08)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--lime-primary)' : '3px solid transparent',
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
