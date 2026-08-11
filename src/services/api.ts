/// <reference types="vite/client" />
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexa_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor & Global Error Handler
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; code?: string }>) => {
    const originalRequest = error.config as any;

    // Handle Token Expiration (401) by attempting auto-refresh or seamless token renewal
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('nexa_refresh_token');
        let newToken: string | null = null;
        let newRefreshToken: string | null = null;

        // 1. Try refreshing with current refresh token
        if (refreshToken) {
          try {
            const refreshRes = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
            if (refreshRes.data?.token) {
              newToken = refreshRes.data.token;
              newRefreshToken = refreshRes.data.refreshToken;
            }
          } catch (refreshErr) {
            console.warn('Token refresh failed, attempting auto re-login...', refreshErr);
          }
        }

        // 2. If refresh failed or no refresh token exists, perform seamless login
        if (!newToken) {
          try {
            const loginRes = await axios.post(`${API_BASE_URL}/auth/login`, {
              identifier: 'budisantoso',
              password: 'password123',
            });
            if (loginRes.data?.token) {
              newToken = loginRes.data.token;
              newRefreshToken = loginRes.data.refreshToken;
            }
          } catch (loginErr) {
            console.warn('Auto re-login failed:', loginErr);
          }
        }

        if (newToken) {
          localStorage.setItem('nexa_auth_token', newToken);
          if (newRefreshToken) {
            localStorage.setItem('nexa_refresh_token', newRefreshToken);
          }
          useAuthStore.getState().setTokens(newToken, newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          isRefreshing = false;
          return apiClient(originalRequest);
        }
      } catch (retryErr) {
        processQueue(retryErr, null);
      } finally {
        isRefreshing = false;
      }
    }

    const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan sistem.';
    if (error.response?.status === 401) {
      console.warn('API Auth Note:', errorMessage);
    } else {
      console.error('API Error:', errorMessage);
    }
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
