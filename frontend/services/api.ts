import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { getItem, removeItem, STORAGE_KEYS } from '@/utils/storage';

const api: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: attach JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getItem<string>(STORAGE_KEYS.accessToken);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored credentials and redirect to login
      removeItem(STORAGE_KEYS.accessToken);
      removeItem(STORAGE_KEYS.refreshToken);
      removeItem(STORAGE_KEYS.user);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
