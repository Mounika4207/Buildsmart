import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Activity, Calendar as CalendarIcon, Clock } from 'lucide-react';

export const SearchBar = ({ initialValues = {} }) => {
  const navigate = useNavigate();
  const [city, setCity] = useState(initialValues.city || '');
  const [sport, setSport] = useState(initialValues.sport || 'all');
  const [date, setDate] = useState(
    initialValues.date || new Date().toISOString().split('T')[0]
  );
  const [duration, setDuration] = useState(initialValues.duration || '1');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city && city !== 'all') params.set('city', city);
    if (sport && sport !== 'all') params.set('sport', sport);
    if (date) params.set('date', date);
    if (duration) params.set('duration', duration);

    navigate(`/turfs?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="card search-panel"
      style={{
        backgroundColor: 'rgba(17, 26, 46, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.25rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr)) auto',
        gap: '1rem',
        alignItems: 'end',
      }}
    >
      {/* Location / City Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <MapPin size={14} color="var(--lime-primary)" />
          <span>Location</span>
        </label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ width: '100%', padding: '0.75rem 0.85rem' }}
        >
          <option value="">All Cities (India)</option>
          <option value="Bengaluru">Bengaluru</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi NCR">Delhi NCR</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Chennai">Chennai</option>
          <option value="Pune">Pune</option>
        </select>
      </div>

      {/* Sport Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Activity size={14} color="var(--lime-primary)" />
          <span>Sport Category</span>
        </label>
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          style={{ width: '100%', padding: '0.75rem 0.85rem' }}
        >
          <option value="all">All Sports</option>
          <option value="cricket">Cricket</option>
          <option value="football">Football</option>
          <option value="badminton">Badminton</option>
          <option value="tennis">Tennis</option>
          <option value="basketball">Basketball</option>
          <option value="pickleball">Pickleball</option>
        </select>
      </div>

      {/* Date Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <CalendarIcon size={14} color="var(--lime-primary)" />
          <span>Date</span>
        </label>
        <input
          type="date"
          value={date}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setDate(e.target.value)}
          style={{ width: '100%', padding: '0.75rem 0.85rem' }}
        />
      </div>

      {/* Duration Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Clock size={14} color="var(--lime-primary)" />
          <span>Duration</span>
        </label>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          style={{ width: '100%', padding: '0.75rem 0.85rem' }}
        >
          <option value="1">1 Hour</option>
          <option value="2">2 Hours</option>
          <option value="3">3 Hours</option>
          <option value="4">4 Hours</option>
        </select>
      </div>

      {/* Submit Search Button */}
      <button
        type="submit"
        className="btn btn-lime"
        style={{
          height: '46px',
          padding: '0 1.75rem',
          fontWeight: 700,
          boxShadow: 'var(--shadow-glow)',
        }}
      >
        <Search size={18} />
        <span>Search</span>
      </button>

      <style>{`
        @media (max-width: 768px) {
          .search-panel {
            grid-template-columns: 1fr !important;
          }
          .search-panel button {
            width: 100% !important;
          }
        }
      `}</style>
    </form>
  );
};

export default SearchBar;
