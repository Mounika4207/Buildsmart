import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { turfService } from '../services/turfService';
import TurfCard from '../components/turf/TurfCard';
import FilterPanel from '../components/turf/FilterPanel';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import {
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  Compass,
} from 'lucide-react';

export const ExploreTurfs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters read from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sport, setSport] = useState(searchParams.get('sport') || 'all');
  const [city, setCity] = useState(searchParams.get('city') || 'all');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'popularity');

  // UI state
  const [layout, setLayout] = useState('grid'); // 'grid' | 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Data state
  const [turfs, setTurfs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync state to URL search parameters
  const updateParams = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.sport && newFilters.sport !== 'all') params.set('sport', newFilters.sport);
    if (newFilters.city && newFilters.city !== 'all') params.set('city', newFilters.city);
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice);
    if (newFilters.sort && newFilters.sort !== 'popularity') params.set('sort', newFilters.sort);

    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    let nextState = {
      search: searchQuery,
      sport,
      city,
      minPrice,
      maxPrice,
      sort,
      [key]: value,
    };

    if (key === 'sport') setSport(value);
    if (key === 'city') setCity(value);
    if (key === 'minPrice') setMinPrice(value);
    if (key === 'maxPrice') setMaxPrice(value);
    if (key === 'sort') setSort(value);

    updateParams(nextState);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchQuery, sport, city, minPrice, maxPrice, sort });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSport('all');
    setCity('all');
    setMinPrice('');
    setMaxPrice('');
    setSort('popularity');
    setSearchParams(new URLSearchParams());
  };

  // Fetch turfs whenever searchParams change
  useEffect(() => {
    const fetchTurfs = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = {
          search: searchParams.get('search') || '',
          sport: searchParams.get('sport') || '',
          city: searchParams.get('city') || '',
          minPrice: searchParams.get('minPrice') || '',
          maxPrice: searchParams.get('maxPrice') || '',
          sort: searchParams.get('sort') || 'popularity',
        };

        const res = await turfService.getAllTurfs(queryParams);
        setTurfs(res.turfs || []);
        setTotalCount(res.total || res.turfs?.length || 0);
      } catch (err) {
        console.error('Error fetching turfs:', err);
        setError('Failed to fetch sports turfs. Please verify network or API status.');
      } finally {
        setLoading(false);
      }
    };

    fetchTurfs();
  }, [searchParams]);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem 1.5rem' }}>
      {/* Page Title & Breadcrumb Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '0.35rem' }}>
          Explore Sports Arenas & Turfs
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {loading ? 'Searching available grounds...' : `Found ${totalCount} verified sports facilities ready for reservation`}
        </p>
      </div>

      {/* Search Header Bar & Layout Toggles */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {/* Name / Location Search Input */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            flex: '1 1 320px',
            maxWidth: '520px',
          }}
        >
          <Search
            size={18}
            color="var(--lime-primary)"
            style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }}
          />
          <input
            type="text"
            placeholder="Search by turf name, area, or landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.6rem',
              borderRadius: 'var(--radius-md)',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                updateParams({ search: '', sport, city, minPrice, maxPrice, sort });
              }}
              style={{
                position: 'absolute',
                right: '12px',
                color: 'var(--text-muted)',
                padding: '4px',
              }}
              aria-label="Clear search text"
            >
              <X size={16} />
            </button>
          )}
        </form>

        {/* View Toggle & Mobile Filter Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="btn btn-secondary mobile-filter-btn"
            style={{ gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <SlidersHorizontal size={16} color="var(--lime-primary)" />
            <span>Filters</span>
          </button>

          {/* Grid / List Layout Switcher */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '3px',
            }}
          >
            <button
              type="button"
              onClick={() => setLayout('grid')}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: layout === 'grid' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: layout === 'grid' ? 'var(--lime-primary)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Grid layout"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              type="button"
              onClick={() => setLayout('list')}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: layout === 'list' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: layout === 'list' ? 'var(--lime-primary)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="List layout"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Desktop Filter Panel */}
        <aside
          style={{ width: '280px', flexShrink: 0 }}
          className="desktop-filter-col"
        >
          <FilterPanel
            filters={{ sport, city, minPrice, maxPrice, sort }}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </aside>

        {/* Mobile Filter Modal / Drawer */}
        {mobileFilterOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              backgroundColor: 'rgba(5, 10, 20, 0.85)',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
            onClick={() => setMobileFilterOpen(false)}
          >
            <div
              style={{
                width: '320px',
                height: '100%',
                backgroundColor: 'var(--bg-card)',
                padding: '1.5rem',
                overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>Filter Venues</h3>
                <button onClick={() => setMobileFilterOpen(false)} style={{ color: '#fff' }}>
                  <X size={20} />
                </button>
              </div>
              <FilterPanel
                filters={{ sport, city, minPrice, maxPrice, sort }}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>
        )}

        {/* Turf Cards Results Container */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div className="grid-cards">
              {Array.from({ length: 4 }).map((_, idx) => (
                <LoadingSkeleton key={idx} height="360px" />
              ))}
            </div>
          ) : error ? (
            <ErrorState
              title="Failed to Load Turfs"
              message={error}
              onRetry={() => updateParams({ search: searchQuery, sport, city, minPrice, maxPrice, sort })}
            />
          ) : turfs.length === 0 ? (
            <EmptyState
              icon={Compass}
              title="No facilities matched your criteria"
              description="Try adjusting your sport selection, city filter, or price range to discover available turfs."
              actionLabel="Reset All Filters"
              onAction={handleClearFilters}
            />
          ) : (
            <div
              className={layout === 'grid' ? 'grid-cards' : ''}
              style={{
                display: layout === 'list' ? 'flex' : undefined,
                flexDirection: layout === 'list' ? 'column' : undefined,
                gap: layout === 'list' ? '1.25rem' : undefined,
              }}
            >
              {turfs.map((turf) => (
                <TurfCard key={turf._id || turf.id} turf={turf} layout={layout} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .desktop-filter-col { display: none !important; }
        }
        @media (min-width: 901px) {
          .mobile-filter-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default ExploreTurfs;
