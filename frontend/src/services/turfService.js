import api, { ENABLE_MOCK_FALLBACK } from './api';
import { MOCK_TURFS, MOCK_SLOTS_TEMPLATE } from '../data/mockData';

export const turfService = {
  /**
   * Fetch all turfs with filtering, search and sorting parameters
   */
  async getAllTurfs(params = {}) {
    try {
      const response = await api.get('/turfs', { params });
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        console.warn('[PlayArena Demo Mode] Backend unreachable. Filtering mock turfs.');
        let results = [...MOCK_TURFS];

        if (params.search) {
          const q = params.search.toLowerCase();
          results = results.filter(
            (t) =>
              t.name.toLowerCase().includes(q) ||
              t.city.toLowerCase().includes(q) ||
              t.area.toLowerCase().includes(q)
          );
        }

        if (params.sport && params.sport !== 'all') {
          results = results.filter((t) =>
            t.sports.map((s) => s.toLowerCase()).includes(params.sport.toLowerCase())
          );
        }

        if (params.city && params.city !== 'all') {
          results = results.filter(
            (t) => t.city.toLowerCase() === params.city.toLowerCase()
          );
        }

        if (params.minPrice) {
          results = results.filter((t) => t.pricePerHour >= Number(params.minPrice));
        }

        if (params.maxPrice) {
          results = results.filter((t) => t.pricePerHour <= Number(params.maxPrice));
        }

        // Sorting
        if (params.sort === 'price_asc') {
          results.sort((a, b) => a.pricePerHour - b.pricePerHour);
        } else if (params.sort === 'price_desc') {
          results.sort((a, b) => b.pricePerHour - a.pricePerHour);
        } else if (params.sort === 'rating') {
          results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        return {
          success: true,
          total: results.length,
          turfs: results,
          isDemo: true,
        };
      }
      throw error;
    }
  },

  /**
   * Fetch featured verified turfs for the Home page
   */
  async getFeaturedTurfs() {
    try {
      const response = await api.get('/turfs/featured');
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        const featured = MOCK_TURFS.filter((t) => t.isVerified).slice(0, 4);
        return { success: true, turfs: featured, isDemo: true };
      }
      throw error;
    }
  },

  /**
   * Fetch single turf by ID
   */
  async getTurfById(id) {
    try {
      const response = await api.get(`/turfs/${id}`);
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        const turf = MOCK_TURFS.find((t) => t.id === id || t._id === id);
        if (turf) {
          return { success: true, turf, isDemo: true };
        }
      }
      throw error;
    }
  },

  /**
   * Fetch time slots availability for a turf on a specific date
   */
  async getTurfAvailability(id, date) {
    try {
      const response = await api.get(`/turfs/${id}/availability`, { params: { date } });
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        // Return slot availability with predictable pseudo-random variance based on day
        const dayNum = new Date(date).getDate() || 1;
        const slots = MOCK_SLOTS_TEMPLATE.map((slot, index) => {
          const isSlotBooked = (dayNum + index) % 4 === 0;
          return {
            ...slot,
            isAvailable: !isSlotBooked,
            reason: isSlotBooked ? 'Booked' : undefined,
          };
        });
        return { success: true, date, slots, isDemo: true };
      }
      throw error;
    }
  },

  /**
   * Owner: get turfs owned by logged in user
   */
  async getOwnerTurfs() {
    try {
      const response = await api.get('/owner/turfs');
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        return { success: true, turfs: MOCK_TURFS.slice(0, 3), isDemo: true };
      }
      throw error;
    }
  },

  /**
   * Owner: create a new turf
   */
  async createTurf(turfData) {
    try {
      const response = await api.post('/owner/turfs', turfData);
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        const newTurf = {
          _id: `turf-${Date.now()}`,
          id: `turf-${Date.now()}`,
          ...turfData,
          isVerified: false,
          rating: 5.0,
          reviewsCount: 0,
        };
        MOCK_TURFS.unshift(newTurf);
        return { success: true, turf: newTurf, isDemo: true };
      }
      throw error;
    }
  },

  /**
   * Owner: update existing turf
   */
  async updateTurf(id, turfData) {
    try {
      const response = await api.patch(`/owner/turfs/${id}`, turfData);
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        const index = MOCK_TURFS.findIndex((t) => t.id === id || t._id === id);
        if (index !== -1) {
          MOCK_TURFS[index] = { ...MOCK_TURFS[index], ...turfData };
          return { success: true, turf: MOCK_TURFS[index], isDemo: true };
        }
      }
      throw error;
    }
  },

  /**
   * Owner: delete a turf
   */
  async deleteTurf(id) {
    try {
      const response = await api.delete(`/owner/turfs/${id}`);
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        const index = MOCK_TURFS.findIndex((t) => t.id === id || t._id === id);
        if (index !== -1) {
          MOCK_TURFS.splice(index, 1);
        }
        return { success: true, message: 'Turf deleted (demo mode)', isDemo: true };
      }
      throw error;
    }
  },

  /**
   * Admin: fetch turfs by status
   */
  async getAdminTurfs(status = 'all') {
    try {
      const response = await api.get('/admin/turfs', { params: { status } });
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        let list = [...MOCK_TURFS];
        if (status === 'pending') list = list.filter((t) => !t.isVerified);
        if (status === 'verified') list = list.filter((t) => t.isVerified);
        return { success: true, turfs: list, isDemo: true };
      }
      throw error;
    }
  },

  /**
   * Admin: verify or reject turf
   */
  async updateTurfVerification(id, isVerified) {
    try {
      const response = await api.patch(`/admin/turfs/${id}/verification`, { isVerified });
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        const turf = MOCK_TURFS.find((t) => t.id === id || t._id === id);
        if (turf) turf.isVerified = isVerified;
        return { success: true, turf, isDemo: true };
      }
      throw error;
    }
  },
};
