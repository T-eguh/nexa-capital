import apiClient from './api';

export interface RegisterPayload {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  referralCode?: string;
  acceptTerms: boolean;
  newsletter?: boolean;
}

export interface LoginPayload {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

export interface UserResponse {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  country: string;
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  isEmailVerified: boolean;
  referralCode: string;
  referredByCode?: string;
  vipLevel: string;
  saldoPenarikan: number;
  saldoProfit: number;
  totalInvested: number;
  totalProfitEarned: number;
  totalReferralCommission: number;
  roles: string[];
  permissions: string[];
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  refreshToken: string;
  user: UserResponse;
}

export interface SessionResponse {
  id: string;
  userId: string;
  token: string;
  ipAddress: string;
  userAgent: string;
  deviceName: string;
  isCurrent: boolean;
  isValid: boolean;
  expiresAt: string;
  lastActiveAt: string;
  createdAt: string;
}

export interface SecurityLogResponse {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  deviceType: string;
  status: 'SUCCESS' | 'FAILED' | 'SUSPICIOUS';
  failureReason?: string;
  createdAt: string;
}

export const authService = {
  async register(payload: RegisterPayload) {
    const response = await apiClient.post<{ success: boolean; message: string; user: any }>('/auth/register', payload);
    return response.data;
  },

  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', payload);
    if (response.data.token) {
      localStorage.setItem('nexa_auth_token', response.data.token);
      localStorage.setItem('nexa_refresh_token', response.data.refreshToken);
    }
    return response.data;
  },

  async logout() {
    const refreshToken = localStorage.getItem('nexa_refresh_token');
    try {
      await apiClient.post('/auth/logout', { refreshToken });
    } catch (e) {
      console.warn('Logout API error:', e);
    } finally {
      localStorage.removeItem('nexa_auth_token');
      localStorage.removeItem('nexa_refresh_token');
    }
  },

  async refreshTokens() {
    const refreshToken = localStorage.getItem('nexa_refresh_token');
    if (!refreshToken) throw new Error('No refresh token');

    const response = await apiClient.post<{ success: boolean; token: string; refreshToken: string }>('/auth/refresh', {
      refreshToken,
    });

    if (response.data.token) {
      localStorage.setItem('nexa_auth_token', response.data.token);
      localStorage.setItem('nexa_refresh_token', response.data.refreshToken);
    }
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await apiClient.post<{ success: boolean; message: string }>('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(payload: { token: string; newPassword: string; confirmPassword: string }) {
    const response = await apiClient.post<{ success: boolean; message: string }>('/auth/reset-password', payload);
    return response.data;
  },

  async verifyEmail(token: string) {
    const response = await apiClient.get<{ success: boolean; message: string }>(`/auth/verify-email?token=${token}`);
    return response.data;
  },

  async resendVerification() {
    const response = await apiClient.post<{ success: boolean; message: string }>('/auth/resend-verification');
    return response.data;
  },

  async getProfile(): Promise<{ success: boolean; profile: UserResponse }> {
    const response = await apiClient.get<{ success: boolean; profile: UserResponse }>('/profile');
    return response.data;
  },

  async updateProfile(payload: Partial<UserResponse>) {
    const response = await apiClient.put<{ success: boolean; message: string; profile: UserResponse }>('/profile', payload);
    return response.data;
  },

  async updatePassword(payload: { currentPassword: string; newPassword: string; confirmPassword: string }) {
    const response = await apiClient.put<{ success: boolean; message: string }>('/profile/password', payload);
    return response.data;
  },

  async updateAvatar(avatarUrl: string) {
    const response = await apiClient.post<{ success: boolean; message: string; avatarUrl: string }>('/profile/avatar', {
      avatarUrl,
    });
    return response.data;
  },

  async deleteAvatar() {
    const response = await apiClient.delete<{ success: boolean; message: string; avatarUrl: string }>('/profile/avatar');
    return response.data;
  },

  async getActiveSessions(): Promise<{ success: boolean; sessions: SessionResponse[] }> {
    const response = await apiClient.get<{ success: boolean; sessions: SessionResponse[] }>('/auth/sessions');
    return response.data;
  },

  async revokeSession(sessionId?: string, revokeAllOthers?: boolean) {
    const response = await apiClient.post<{ success: boolean; message: string }>('/auth/sessions/revoke', {
      sessionId,
      revokeAllOthers,
    });
    return response.data;
  },

  async getSecurityLogs(): Promise<{ success: boolean; logs: SecurityLogResponse[] }> {
    const response = await apiClient.get<{ success: boolean; logs: SecurityLogResponse[] }>('/auth/security-logs');
    return response.data;
  },
};
