import axios from 'axios';

// Get base URL from environment or default to local backend port 5000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const ENABLE_MOCK_FALLBACK = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('playarena_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to manage global auth invalidation & error normalization
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear expired session if 401 returned from authorized endpoint
      const isAuthCheck = error.config.url?.includes('/auth/me');
      if (!isAuthCheck) {
        localStorage.removeItem('playarena_token');
        localStorage.removeItem('playarena_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
