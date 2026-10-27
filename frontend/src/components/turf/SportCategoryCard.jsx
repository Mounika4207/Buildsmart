import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Shield, Activity, Award, Zap, Compass, ArrowRight } from 'lucide-react';

const ICON_MAP = {
  Trophy,
  Shield,
  Activity,
  Award,
  Zap,
  Compass,
};

export const SportCategoryCard = ({ sport }) => {
  const IconComponent = ICON_MAP[sport.iconName] || Trophy;

  return (
    <Link
      to={`/turfs?sport=${sport.id}`}
      className="card card-hoverable"
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        height: '240px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '1.5rem',
        textDecoration: 'none',
      }}
    >
      {/* Background Image with Dark Gradient Overlay */}
      <img
        src={sport.image}
        alt={sport.name}
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.4s ease',
          zIndex: 1,
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(10, 15, 29, 0.95) 15%, rgba(10, 15, 29, 0.4) 65%, rgba(10, 15, 29, 0.1) 100%)',
          zIndex: 2,
        }}
      />

      {/* Card Body */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'rgba(16, 239, 140, 0.15)',
            border: '1px solid rgba(16, 239, 140, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--lime-primary)',
            marginBottom: '0.75rem',
            backdropFilter: 'blur(4px)',
          }}
        >
          <IconComponent size={20} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.2rem' }}>
              {sport.name}
            </h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--lime-primary)', fontWeight: 600 }}>
              {sport.turfCount} Venues Available
            </span>
          </div>

          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SportCategoryCard;
