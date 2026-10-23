import api, { ENABLE_MOCK_FALLBACK } from './api';
import { MOCK_BOOKINGS, MOCK_TURFS } from '../data/mockData';

export const bookingService = {
  /**
   * Create a new booking
   * Validates slot and calculates authoritative total
   */
  async createBooking(bookingData) {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        console.warn('[PlayArena Demo Mode] Simulating booking creation.');
        const turf = MOCK_TURFS.find(
          (t) => t.id === bookingData.turfId || t._id === bookingData.turfId
        ) || MOCK_TURFS[0];

        const duration = Number(bookingData.duration) || 1;
        const totalAmount = turf.pricePerHour * duration;
        const newBooking = {
          _id: `bkg-${Date.now()}`,
          id: `bkg-${Date.now()}`,
          bookingReference: `PA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          turf,
          date: bookingData.date,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime || `${parseInt(bookingData.startTime) + duration}:00`,
          duration,
          sport: bookingData.sport || turf.sports[0],
          totalAmount,
          status: 'confirmed',
          paymentStatus: 'pending',
          paymentMethod: bookingData.paymentMethod || 'Pay at Venue',
          createdAt: new Date().toISOString(),
          customer: {
            name: bookingData.customerName || 'Aditya Sen',
            email: bookingData.customerEmail || 'aditya@example.com',
            phone: bookingData.customerPhone || '+91 99887 76655',
          },
        };

        MOCK_BOOKINGS.unshift(newBooking);
        return {
          success: true,
          booking: newBooking,
          isDemo: true,
          message: 'Booking created successfully in demo mode',
        };
      }
      throw error;
    }
  },

  /**
   * Get all bookings for the currently authenticated customer
   */
  async getMyBookings() {
    try {
      const response = await api.get('/bookings/my');
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        return { success: true, bookings: MOCK_BOOKINGS, isDemo: true };
      }
      throw error;
    }
  },

  /**
   * Get details of a single booking
   */
  async getBookingById(id) {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        const booking = MOCK_BOOKINGS.find(
          (b) => b.id === id || b._id === id || b.bookingReference === id
        );
        if (booking) {
          return { success: true, booking, isDemo: true };
        }
      }
      throw error;
    }
  },

  /**
   * Cancel an existing booking
   */
  async cancelBooking(id, reason = '') {
    try {
      const response = await api.patch(`/bookings/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        const booking = MOCK_BOOKINGS.find((b) => b.id === id || b._id === id);
        if (booking) {
          booking.status = 'cancelled';
          booking.cancellationReason = reason;
          return { success: true, booking, isDemo: true };
        }
      }
      throw error;
    }
  },

  /**
   * Turf Owner: View reservations across their facilities
   */
  async getOwnerBookings(params = {}) {
    try {
      const response = await api.get('/owner/bookings', { params });
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        let list = [...MOCK_BOOKINGS];
        if (params.turfId && params.turfId !== 'all') {
          list = list.filter((b) => (b.turf?._id || b.turf?.id) === params.turfId);
        }
        if (params.status && params.status !== 'all') {
          list = list.filter((b) => b.status === params.status);
        }
        return { success: true, bookings: list, isDemo: true };
      }
      throw error;
    }
  },

  /**
   * Turf Owner: Schedule overview for a turf by date
   */
  async getOwnerSchedule(turfId, date) {
    try {
      const response = await api.get(`/owner/schedule/${turfId}`, { params: { date } });
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        const bookingsForDate = MOCK_BOOKINGS.filter(
          (b) => (b.turf?._id === turfId || b.turf?.id === turfId) && b.date === date
        );
        return {
          success: true,
          date,
          turfId,
          schedule: bookingsForDate,
          isDemo: true,
        };
      }
      throw error;
    }
  },
};
