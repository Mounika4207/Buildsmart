import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Mail, Phone, MapPin, Shield } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#070b14',
        borderTop: '1px solid var(--border-subtle)',
        padding: '4rem 0 2rem 0',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--lime-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--bg-dark)',
                }}
              >
                <Trophy size={20} strokeWidth={2.5} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                Play<span style={{ color: 'var(--lime-primary)' }}>Arena</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              India’s next-generation sports tech platform for booking football turfs, cricket arenas, badminton courts, and multi-sport complexes.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--lime-primary)', fontSize: '0.85rem' }}>
              <Shield size={16} />
              <span>Full-Stack College Project Demo</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/turfs" style={{ color: 'var(--text-secondary)' }}>All Sports Turfs</Link>
              </li>
              <li>
                <Link to="/turfs?sport=cricket" style={{ color: 'var(--text-secondary)' }}>Cricket Pitches</Link>
              </li>
              <li>
                <Link to="/turfs?sport=football" style={{ color: 'var(--text-secondary)' }}>Football AstroTurf</Link>
              </li>
              <li>
                <Link to="/turfs?sport=badminton" style={{ color: 'var(--text-secondary)' }}>Badminton Courts</Link>
              </li>
              <li>
                <Link to="/turfs?sport=pickleball" style={{ color: 'var(--text-secondary)' }}>Pickleball Hubs</Link>
              </li>
            </ul>
          </div>

          {/* For Partners & Owners */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              For Facility Owners
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/register" style={{ color: 'var(--text-secondary)' }}>List Your Facility</Link>
              </li>
              <li>
                <Link to="/owner/dashboard" style={{ color: 'var(--text-secondary)' }}>Owner Portal</Link>
              </li>
              <li>
                <a href="#about" style={{ color: 'var(--text-secondary)' }}>Pricing & Features</a>
              </li>
              <li>
                <Link to="/admin/dashboard" style={{ color: 'var(--text-secondary)' }}>Admin Console (Authorized)</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support Placeholders */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Help & Support
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Mail size={16} color="var(--lime-primary)" />
                <span>support@playarena.example</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Phone size={16} color="var(--lime-primary)" />
                <span>+91 00000 00000 (Demo Support)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <MapPin size={16} color="var(--lime-primary)" />
                <span>Tech Campus Center, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} PlayArena Sports Tech. Designed for Academic Evaluation & Recruitment Demonstration.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#terms" style={{ color: 'var(--text-muted)' }}>Terms of Service</a>
            <a href="#privacy" style={{ color: 'var(--text-muted)' }}>Privacy Policy</a>
            <a href="#cancellation" style={{ color: 'var(--text-muted)' }}>Cancellation Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
