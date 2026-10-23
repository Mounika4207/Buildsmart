import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { turfService } from '../services/turfService';
import { SPORTS_CATEGORIES } from '../data/mockData';
import SearchBar from '../components/turf/SearchBar';
import SportCategoryCard from '../components/turf/SportCategoryCard';
import TurfCard from '../components/turf/TurfCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';
import {
  Compass,
  CalendarCheck,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Zap,
  ArrowRight,
  Clock,
  Award,
} from 'lucide-react';

export const Home = () => {
  const [featuredTurfs, setFeaturedTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeatured = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await turfService.getFeaturedTurfs();
      setFeaturedTurfs(data.turfs || []);
    } catch (err) {
      console.error('Error fetching featured turfs:', err);
      setError('Unable to load featured turfs from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '4rem' }}>
      {/* ========================================================
          A. HERO SECTION
          ======================================================== */}
      <section
        style={{
          position: 'relative',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6rem 1.5rem 5rem 1.5rem',
          backgroundImage: `linear-gradient(to bottom, rgba(10, 15, 29, 0.75) 0%, rgba(10, 15, 29, 0.95) 100%), url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '1000px', zIndex: 10 }}>
          {/* Eyebrow Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(16, 239, 140, 0.12)',
              border: '1px solid rgba(16, 239, 140, 0.3)',
              padding: '0.4rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              color: 'var(--lime-primary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={16} />
            <span>Smart Sports Ground & Court Reservation</span>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              lineHeight: 1.15,
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '1.25rem',
              letterSpacing: '-0.03em',
            }}
          >
            Your Game. <span style={{ color: 'var(--lime-primary)' }}>Your Ground.</span> Your Time.
          </h1>

          {/* Supporting Text */}
          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: '720px',
              margin: '0 auto 2.75rem auto',
              lineHeight: 1.6,
            }}
          >
            Discover, check live slot availability, and book verified floodlit cricket turfs, football grounds, and indoor badminton courts in seconds.
          </p>

          {/* Prominent Booking Search Panel */}
          <div style={{ maxWidth: '940px', margin: '0 auto' }}>
            <SearchBar />
          </div>

          {/* Trust Highlights */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '2rem',
              marginTop: '3rem',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="var(--lime-primary)" />
              <span>100% Verified Sports Facilities</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="var(--lime-primary)" />
              <span>Instant Real-Time Confirmation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--lime-primary)" />
              <span>Zero Convenience Fees on Direct Booking</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          B. POPULAR SPORTS CATEGORIES
          ======================================================== */}
      <section id="sports" className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--lime-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Choose Your Sport
          </span>
          <h2 style={{ fontSize: '2.25rem', color: '#ffffff', marginTop: '0.4rem' }}>
            Popular Sports Arenas
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0.5rem auto 0 auto' }}>
            Select your discipline to explore top-rated courts and synthetic turfs with professional amenities.
          </p>
        </div>

        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {SPORTS_CATEGORIES.map((sport) => (
            <SportCategoryCard key={sport.id} sport={sport} />
          ))}
        </div>
      </section>

      {/* ========================================================
          C. FEATURED TURFS
          ======================================================== */}
      <section className="container">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--lime-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Top Rated Grounds
            </span>
            <h2 style={{ fontSize: '2.25rem', color: '#ffffff', marginTop: '0.4rem' }}>
              Featured Facilities
            </h2>
          </div>

          <Link
            to="/turfs"
            className="btn btn-secondary"
            style={{ gap: '0.5rem', fontSize: '0.9rem' }}
          >
            <span>View All Arenas</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid-cards">
            {Array.from({ length: 3 }).map((_, idx) => (
              <LoadingSkeleton key={idx} height="360px" />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchFeatured} />
        ) : featuredTurfs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No featured venues currently available.
          </div>
        ) : (
          <div className="grid-cards">
            {featuredTurfs.map((turf) => (
              <TurfCard key={turf._id || turf.id} turf={turf} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          D. HOW IT WORKS (3 Simple Steps)
          ======================================================== */}
      <section style={{ backgroundColor: '#0d1527', padding: '5rem 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--lime-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Streamlined Process
            </span>
            <h2 style={{ fontSize: '2.25rem', color: '#ffffff', marginTop: '0.4rem' }}>
              How PlayArena Works
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '0.5rem auto 0 auto' }}>
              Book your team's slot in under 60 seconds with 3 straightforward steps.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Step 1 */}
            <div
              className="card"
              style={{
                padding: '2.25rem 1.75rem',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(16, 239, 140, 0.12)',
                  color: 'var(--lime-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                }}
              >
                <Compass size={28} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--lime-primary)', letterSpacing: '0.1em' }}>
                STEP 01
              </span>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: '0.5rem 0 0.75rem 0' }}>
                Find Your Turf
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Filter by sport, city, pricing, and certified facilities like night floodlights, parking, and locker rooms.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className="card"
              style={{
                padding: '2.25rem 1.75rem',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                }}
              >
                <CalendarCheck size={28} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.1em' }}>
                STEP 02
              </span>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: '0.5rem 0 0.75rem 0' }}>
                Choose An Available Slot
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Select your preferred match date and view real-time available hourly slots without back-and-forth phone calls.
              </p>
            </div>

            {/* Step 3 */}
            <div
              className="card"
              style={{
                padding: '2.25rem 1.75rem',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  color: '#fbbf24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                }}
              >
                <CreditCard size={28} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.1em' }}>
                STEP 03
              </span>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: '0.5rem 0 0.75rem 0' }}>
                Confirm Your Booking
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Review transparent pricing breakdown, receive instant booking reference, and play on verified grounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          E. WHY PLAYARENA
          ======================================================== */}
      <section id="about" className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--lime-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            The Competitive Edge
          </span>
          <h2 style={{ fontSize: '2.25rem', color: '#ffffff', marginTop: '0.4rem' }}>
            Why Players & Owners Choose PlayArena
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ color: 'var(--lime-primary)', marginBottom: '1rem' }}>
              <ShieldCheck size={32} />
            </div>
            <h4 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>
              Facility Variety
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              From FIFA 2-star synthetic football turfs to air-conditioned BWF wooden badminton courts and cricket cages with bowling machines.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ color: 'var(--lime-primary)', marginBottom: '1rem' }}>
              <CreditCard size={32} />
            </div>
            <h4 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>
              Transparent Hourly Pricing
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              All hourly fees are clearly listed in INR with zero surprise commissions or hidden checkout fees.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ color: 'var(--lime-primary)', marginBottom: '1rem' }}>
              <Clock size={32} />
            </div>
            <h4 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>
              Real-Time Slot Engine
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Dual-end schedule synchronisation guarantees you never face double bookings or disputed field reservations.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ color: 'var(--lime-primary)', marginBottom: '1rem' }}>
              <Award size={32} />
            </div>
            <h4 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>
              Easy Booking Management
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Track past and upcoming reservations, access cancellation policies, and review venue experiences effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          F. CTA BANNER FOR TURF OWNERS
          ======================================================== */}
      <section className="container">
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, #132238 0%, #0c1527 100%)',
            border: '1px solid rgba(16, 239, 140, 0.25)',
            padding: '3rem 2rem',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ maxWidth: '600px' }}>
            <span className="badge badge-verified" style={{ marginBottom: '0.75rem' }}>
              Facility Partnership
            </span>
            <h3 style={{ fontSize: '1.85rem', color: '#ffffff', marginBottom: '0.75rem' }}>
              Are You a Turf or Court Facility Owner?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              List your sports complex on PlayArena. Maximize your weekday hours, automate slot scheduling, and accept verified bookings directly.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-lime btn-lg">
              Register as Turf Owner
            </Link>
            <Link to="/turfs" className="btn btn-secondary btn-lg">
              Explore Listings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
