import api, { ENABLE_MOCK_FALLBACK } from './api';
import { MOCK_USERS } from '../data/mockData';

export const authService = {
  /**
   * Register a new user (customer or turf owner)
   * Admin role is prohibited from public registration.
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data?.token) {
        localStorage.setItem('playarena_token', response.data.token);
        localStorage.setItem('playarena_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      // If backend is not running and mock fallback is explicitly enabled for college demo
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        console.warn('[PlayArena Demo Mode] Backend unavailable. Simulating demo registration.');
        const newUser = {
          _id: `user-${Date.now()}`,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role || 'customer',
          isDemoUser: true,
        };
        const demoToken = `demo_jwt_token_${Date.now()}`;
        localStorage.setItem('playarena_token', demoToken);
        localStorage.setItem('playarena_user', JSON.stringify(newUser));
        return {
          success: true,
          token: demoToken,
          user: newUser,
          isDemo: true,
          message: 'Registered in local demo mode (Backend currently unreachable)',
        };
      }
      throw error;
    }
  },

  /**
   * Log in user with email & password
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data?.token) {
        localStorage.setItem('playarena_token', response.data.token);
        localStorage.setItem('playarena_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        console.warn('[PlayArena Demo Mode] Backend unavailable. Checking demo accounts.');
        // Allow demonstration using mock accounts if backend is offline
        const found = MOCK_USERS.find(
          (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
        );
        const demoUser = found || {
          _id: `user-${Date.now()}`,
          name: credentials.email.split('@')[0],
          email: credentials.email,
          role: credentials.email.includes('owner') ? 'owner' : credentials.email.includes('admin') ? 'admin' : 'customer',
          isDemoUser: true,
        };
        const demoToken = `demo_jwt_token_${demoUser._id}`;
        localStorage.setItem('playarena_token', demoToken);
        localStorage.setItem('playarena_user', JSON.stringify(demoUser));
        return {
          success: true,
          token: demoToken,
          user: demoUser,
          isDemo: true,
          message: 'Logged in via demo mode (Backend currently unreachable)',
        };
      }
      throw error;
    }
  },

  /**
   * Get current authenticated user profile
   */
  async getMe() {
    try {
      const response = await api.get('/auth/me');
      if (response.data?.user) {
        localStorage.setItem('playarena_user', JSON.stringify(response.data.user));
      }
      return response.data.user;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        const stored = localStorage.getItem('playarena_user');
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch {
            return null;
          }
        }
      }
      throw error;
    }
  },

  /**
   * Forgot password request
   */
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      if (ENABLE_MOCK_FALLBACK && (!error.response || error.code === 'ERR_NETWORK')) {
        return {
          success: true,
          message: 'Password reset link simulated in demo mode. Check your inbox.',
        };
      }
      throw error;
    }
  },

  /**
   * Log out user
   */
  logout() {
    localStorage.removeItem('playarena_token');
    localStorage.removeItem('playarena_user');
  },

  /**
   * Read locally cached user without making a network call
   */
  getCurrentUser() {
    const raw = localStorage.getItem('playarena_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('playarena_token');
  },
};
