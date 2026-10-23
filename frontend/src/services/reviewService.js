import api, { ENABLE_MOCK_FALLBACK } from './api';
import { MOCK_REVIEWS } from '../data/mockData';

export const reviewService = {
  /**
   * Fetch reviews for a specific turf
   */
  async getTurfReviews(turfId) {
    try {
      const response = await api.get(`/turfs/${turfId}/reviews`);
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        return { success: true, reviews: MOCK_REVIEWS, isDemo: true };
      }
      throw error;
    }
  },

  /**
   * Add a review for a turf
   */
  async createReview(turfId, reviewData) {
    try {
      const response = await api.post(`/turfs/${turfId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        const newReview = {
          id: `rev-${Date.now()}`,
          userName: reviewData.userName || 'Verified Player',
          rating: Number(reviewData.rating) || 5,
          date: new Date().toISOString().split('T')[0],
          comment: reviewData.comment,
        };
        MOCK_REVIEWS.unshift(newReview);
        return { success: true, review: newReview, isDemo: true };
      }
      throw error;
    }
  },
};
