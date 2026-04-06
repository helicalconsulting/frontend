import type { LoginCredentials, AuthResponse, User } from '@/types';
import apiClient from './apiClient';
import { API_CONFIG } from '@/config';

/**
 * Login — authenticates user
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
  const { accessToken, refreshToken, user } = response.data.data;
  
  // Store tokens
  localStorage.setItem(API_CONFIG.TOKEN_KEY, accessToken);
  localStorage.setItem(API_CONFIG.REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(API_CONFIG.USER_KEY, JSON.stringify(user));
  
  return {
    token: accessToken,
    user,
  };
}

/**
 * Logout
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
  } catch {
    // Ignore errors on logout
  }
  localStorage.removeItem(API_CONFIG.TOKEN_KEY);
  localStorage.removeItem(API_CONFIG.REFRESH_TOKEN_KEY);
  localStorage.removeItem(API_CONFIG.USER_KEY);
}

/**
 * Get current user profile
 */
export async function getProfile(): Promise<User> {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
  return response.data.data;
}

/**
 * Refresh access token
 */
export async function refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
  const refreshTokenValue = localStorage.getItem(API_CONFIG.REFRESH_TOKEN_KEY);
  if (!refreshTokenValue) {
    throw new Error('No refresh token available');
  }
  
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH, {
    refreshToken: refreshTokenValue,
  });
  
  const { accessToken, refreshToken: newRefreshToken } = response.data.data;
  
  localStorage.setItem(API_CONFIG.TOKEN_KEY, accessToken);
  localStorage.setItem(API_CONFIG.REFRESH_TOKEN_KEY, newRefreshToken);
  
  return { accessToken, refreshToken: newRefreshToken };
}

/**
 * Change password
 */
export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
}
