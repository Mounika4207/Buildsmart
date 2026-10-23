import React from 'react';
import { Filter, X, SlidersHorizontal } from 'lucide-react';

export const FilterPanel = ({
  filters,
  onFilterChange,
  onClearFilters,
  cities = ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Chennai', 'Pune'],
  sports = ['cricket', 'football', 'badminton', 'tennis', 'basketball', 'pickleball'],
}) => {
  return (
    <div
      className="card"
      style={{
        padding: '1.5rem',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 700 }}>
          <SlidersHorizontal size={18} color="var(--lime-primary)" />
          <span>Filters</span>
        </div>
        <button
          onClick={onClearFilters}
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <X size={14} />
          <span>Reset All</span>
        </button>
      </div>

      {/* Sport Category Filter */}
      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'block' }}>
          Sport
        </label>
        <select
          value={filters.sport || 'all'}
          onChange={(e) => onFilterChange('sport', e.target.value)}
          style={{ width: '100%', padding: '0.65rem 0.85rem' }}
        >
          <option value="all">All Sports</option>
          {sports.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* City Filter */}
      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'block' }}>
          City
        </label>
        <select
          value={filters.city || 'all'}
          onChange={(e) => onFilterChange('city', e.target.value)}
          style={{ width: '100%', padding: '0.65rem 0.85rem' }}
        >
          <option value="all">All Cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Hourly Price Range */}
      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'block' }}>
          Hourly Price (INR)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <input
            type="number"
            placeholder="Min ₹"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            style={{ width: '100%', padding: '0.6rem 0.75rem' }}
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            style={{ width: '100%', padding: '0.6rem 0.75rem' }}
          />
        </div>
      </div>

      {/* Sorting */}
      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'block' }}>
          Sort By
        </label>
        <select
          value={filters.sort || 'popularity'}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          style={{ width: '100%', padding: '0.65rem 0.85rem' }}
        >
          <option value="popularity">Popularity / Recommended</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
