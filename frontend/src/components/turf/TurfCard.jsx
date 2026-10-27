import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80';

export const TurfCard = ({ turf, layout = 'grid' }) => {
  if (!turf) return null;

  const turfId = turf._id || turf.id;
  const image = turf.images && turf.images.length > 0 ? turf.images[0] : DEFAULT_IMAGE;
  const isList = layout === 'list';

  return (
    <div
      className={`card card-hoverable animate-fade-in ${isList ? 'turf-card-list' : ''}`}
      style={{
        display: 'flex',
        flexDirection: isList ? 'row' : 'column',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Turf Image Container */}
      <div
        style={{
          position: 'relative',
          width: isList ? '280px' : '100%',
          height: isList ? 'auto' : '210px',
          minHeight: '200px',
          flexShrink: 0,
          backgroundColor: '#0c1424',
          overflow: 'hidden',
        }}
      >
        <img
          src={image}
          alt={turf.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_IMAGE;
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Top Badges (Verified & Sports) */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {turf.isVerified && (
            <span
              className="badge"
              style={{
                backgroundColor: 'rgba(10, 15, 29, 0.85)',
                color: 'var(--lime-primary)',
                border: '1px solid var(--lime-primary)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <ShieldCheck size={13} />
              <span>Verified</span>
            </span>
          )}

          {turf.rating && (
            <div
              style={{
                marginLeft: 'auto',
                backgroundColor: 'rgba(10, 15, 29, 0.85)',
                backdropFilter: 'blur(4px)',
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#fbbf24',
              }}
            >
              <Star size={13} fill="#fbbf24" color="#fbbf24" />
              <span>{turf.rating}</span>
              {turf.reviewsCount ? (
                <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                  ({turf.reviewsCount})
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Turf Details Content */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Sports categories tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.65rem' }}>
            {turf.sports &&
              turf.sports.map((sport) => (
                <span key={sport} className="badge badge-sport">
                  {sport}
                </span>
              ))}
          </div>

          {/* Turf Name */}
          <h3
            style={{
              fontSize: '1.15rem',
              color: '#ffffff',
              marginBottom: '0.4rem',
              lineHeight: 1.3,
            }}
          >
            <Link to={`/turfs/${turfId}`} style={{ color: '#ffffff' }}>
              {turf.name}
            </Link>
          </h3>

          {/* Location */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              marginBottom: '0.85rem',
            }}
          >
            <MapPin size={15} color="var(--lime-primary)" />
            <span>
              {turf.area ? `${turf.area}, ` : ''}
              {turf.city || 'India'}
            </span>
          </div>

          {/* Facilities preview */}
          {turf.facilities && turf.facilities.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.4rem',
                marginBottom: '1rem',
              }}
            >
              {turf.facilities.slice(0, 3).map((f) => (
                <span
                  key={f}
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  ✓ {f}
                </span>
              ))}
              {turf.facilities.length > 3 && (
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  +{turf.facilities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '0.5rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
              Starts from
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lime-primary)' }}>
                {formatCurrency(turf.pricePerHour)}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>/ hour</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to={`/turfs/${turfId}`} className="btn btn-secondary btn-sm" aria-label={`View details for ${turf.name}`}>
              Details
            </Link>
            <Link to={`/turfs/${turfId}#booking`} className="btn btn-lime btn-sm" aria-label={`Book ${turf.name}`}>
              Book Now
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .turf-card-list {
            flex-direction: column !important;
          }
          .turf-card-list > div:first-child {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TurfCard;
