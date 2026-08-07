import { create } from 'zustand';
import { authService, UserResponse, SessionResponse, SecurityLogResponse } from '../services/authService';

interface AuthState {
  user: UserResponse | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  activeSessions: SessionResponse[];
  securityLogs: SecurityLogResponse[];

  // Actions
  setUser: (user: UserResponse | null) => void;
  setTokens: (token: string | null, refreshToken: string | null) => void;
  clearAuth: () => void;
  fetchProfile: () => Promise<void>;
  fetchSessions: () => Promise<void>;
  fetchSecurityLogs: () => Promise<void>;
  revokeSession: (sessionId?: string, revokeAllOthers?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('nexa_auth_token'),
  refreshToken: localStorage.getItem('nexa_refresh_token'),
  isAuthenticated: !!localStorage.getItem('nexa_auth_token'),
  isLoading: false,
  error: null,
  activeSessions: [],
  securityLogs: [],

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setTokens: (token, refreshToken) => {
    if (token) localStorage.setItem('nexa_auth_token', token);
    else localStorage.removeItem('nexa_auth_token');

    if (refreshToken) localStorage.setItem('nexa_refresh_token', refreshToken);
    else localStorage.removeItem('nexa_refresh_token');

    set({ token, refreshToken, isAuthenticated: !!token });
  },

  clearAuth: () => {
    localStorage.removeItem('nexa_auth_token');
    localStorage.removeItem('nexa_refresh_token');
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false, activeSessions: [], securityLogs: [] });
  },

  fetchProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await authService.getProfile();
      if (res.success && res.profile) {
        set({ user: res.profile, isAuthenticated: true, isLoading: false });
      }
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  fetchSessions: async () => {
    try {
      const res = await authService.getActiveSessions();
      if (res.success) {
        set({ activeSessions: res.sessions });
      }
    } catch (e) {
      console.warn('Failed fetching sessions:', e);
    }
  },

  fetchSecurityLogs: async () => {
    try {
      const res = await authService.getSecurityLogs();
      if (res.success) {
        set({ securityLogs: res.logs });
      }
    } catch (e) {
      console.warn('Failed fetching security logs:', e);
    }
  },

  revokeSession: async (sessionId, revokeAllOthers) => {
    try {
      await authService.revokeSession(sessionId, revokeAllOthers);
      await get().fetchSessions();
    } catch (e) {
      console.warn('Revoke session failed:', e);
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.warn(e);
    } finally {
      get().clearAuth();
    }
  },
}));
