import api, { ENABLE_MOCK_FALLBACK } from './api';
import { MOCK_USERS } from '../data/mockData';

export const adminService = {
  /**
   * Fetch all registered users
   */
  async getAdminUsers(params = {}) {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        let list = [...MOCK_USERS];
        if (params.role && params.role !== 'all') {
          list = list.filter((u) => u.role === params.role);
        }
        if (params.search && params.search.trim()) {
          const q = params.search.toLowerCase();
          list = list.filter(
            (u) =>
              u.name.toLowerCase().includes(q) ||
              u.email.toLowerCase().includes(q) ||
              (u.phone && u.phone.includes(q))
          );
        }
        return { success: true, count: list.length, users: list, isDemo: true };
      }
      throw error;
    }
  },
};
