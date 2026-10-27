import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Trophy,
  Menu,
  X,
  User,
  LogOut,
  Calendar,
  Layers,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const isHomePage = location.pathname === '/';
  // Public navigation links (Home, Explore Turfs, Sports, Why PlayArena) only appear on the home page or when logged out
  const showPublicNav = !isAuthenticated || isHomePage;

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate(`/#${targetId}`);
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getDashboardPath = () => {
    if (user?.role === 'owner') return '/owner/dashboard';
    if (user?.role === 'admin') return '/admin/dashboard';
    return '/dashboard';
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)', backgroundColor: 'rgba(10, 15, 29, 0.92)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--lime-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--bg-dark)',
              boxShadow: '0 0 16px rgba(16, 239, 140, 0.3)',
            }}
          >
            <Trophy size={22} strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>
            Play<span style={{ color: 'var(--lime-primary)' }}>Arena</span>
          </span>
        </Link>

        {/* Desktop Navigation Links - Only on Home Page when authenticated, or when logged out */}
        {showPublicNav && (
          <nav style={{ display: 'none', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
            <NavLink
              to="/"
              style={({ isActive }) => ({
                fontWeight: 500,
                fontSize: '0.95rem',
                color: isActive ? 'var(--lime-primary)' : 'var(--text-secondary)',
              })}
            >
              Home
            </NavLink>
            <NavLink
              to="/turfs"
              style={({ isActive }) => ({
                fontWeight: 500,
                fontSize: '0.95rem',
                color: isActive ? 'var(--lime-primary)' : 'var(--text-secondary)',
              })}
            >
              Explore Turfs
            </NavLink>
            <a
              href="#sports"
              onClick={(e) => handleScrollTo(e, 'sports')}
              style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              Sports
            </a>
            <a
              href="#about"
              onClick={(e) => handleScrollTo(e, 'about')}
              style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              Why PlayArena
            </a>
          </nav>
        )}

        {/* Desktop User / Auth Actions */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="desktop-auth">
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.45rem 0.85rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  color: '#ffffff',
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--lime-primary)',
                    color: 'var(--bg-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name || 'Player'}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--lime-primary)', textTransform: 'capitalize' }}>
                    {user?.role || 'Customer'}
                  </div>
                </div>
                <ChevronDown size={16} color="var(--text-secondary)" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className="card animate-fade-in"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '115%',
                    width: '230px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-medium)',
                    boxShadow: 'var(--shadow-lg)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem',
                    zIndex: 200,
                  }}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                  </div>

                  <Link
                    to={getDashboardPath()}
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-xs)',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                    }}
                  >
                    <Layers size={16} color="var(--lime-primary)" />
                    <span>Dashboard</span>
                  </Link>

                  {user?.role === 'customer' && (
                    <Link
                      to="/my-bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-xs)',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                      }}
                    >
                      <Calendar size={16} />
                      <span>My Bookings</span>
                    </Link>
                  )}

                  {user?.role === 'owner' && (
                    <Link
                      to="/owner/turfs"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-xs)',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                      }}
                    >
                      <Layers size={16} />
                      <span>Manage Turfs</span>
                    </Link>
                  )}

                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/turfs"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-xs)',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                      }}
                    >
                      <ShieldAlert size={16} />
                      <span>Turf Approvals</span>
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-xs)',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                    }}
                  >
                    <User size={16} />
                    <span>Profile Settings</span>
                  </Link>

                  <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '0.35rem 0' }} />

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-xs)',
                      color: '#f87171',
                      fontSize: '0.85rem',
                      textAlign: 'left',
                    }}
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-lime btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            color: '#ffffff',
            padding: '8px',
          }}
          className="mobile-toggle"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-medium)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
          className="animate-fade-in"
        >
          {showPublicNav && (
            <>
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: '1rem', color: 'var(--text-primary)' }}
              >
                Home
              </NavLink>
              <NavLink
                to="/turfs"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: '1rem', color: 'var(--text-primary)' }}
              >
                Explore Turfs
              </NavLink>
              <a
                href="#sports"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleScrollTo(e, 'sports');
                }}
                style={{ fontSize: '1rem', color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                Sports
              </a>
              <a
                href="#about"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleScrollTo(e, 'about');
                }}
                style={{ fontSize: '1rem', color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                Why PlayArena
              </a>
              <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '0.5rem 0' }} />
            </>
          )}

          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--lime-primary)' }}>
                Signed in as {user?.name} ({user?.role})
              </div>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start' }}
              >
                <Layers size={18} />
                Dashboard
              </Link>
              {user?.role === 'customer' && (
                <Link
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-secondary"
                  style={{ justifyContent: 'flex-start' }}
                >
                  <Calendar size={18} />
                  My Bookings
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start' }}
              >
                <User size={18} />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-danger"
                style={{ justifyContent: 'flex-start' }}
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-lime"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-auth { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
