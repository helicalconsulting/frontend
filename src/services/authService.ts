import type { LoginCredentials, AuthResponse, User } from '@/types';
import { mockAuthResponse } from '@/mocks/data';
import apiClient from './apiClient';

// Toggle between mock and real API calls
const USE_MOCK = false;

// Demo users for mock login - matches backend credentials
const mockUsers: Record<string, { password: string; user: AuthResponse['user'] }> = {
  admin: {
    password: 'password123',
    user: {
      id: 'usr-001',
      username: 'admin',
      email: 'admin@helical.com',
      fullName: 'System Administrator',
      role: 'Super Admin',
      roles: ['super_admin'],
      company: 'DEMO',
      department: 'IT',
      permissions: {
        PAYMENT: { canView: true, canCreate: true, canApprove: true, canReject: true, maxValue: null },
        AP: { canView: true, canCreate: true, canApprove: true, canReject: true, maxValue: null },
        PO: { canView: true, canCreate: true, canApprove: true, canReject: true, maxValue: null },
        SALES: { canView: true, canCreate: true, canApprove: true, canReject: true, maxValue: null },
        ONBOARDING: { canView: true, canCreate: true, canApprove: true, canReject: true, maxValue: null },
        REPORTS: { canView: true, canCreate: true, canApprove: true, canReject: true, maxValue: null },
        ADMIN: { canView: true, canCreate: true, canApprove: true, canReject: true, maxValue: null },
      },
    },
  },
  approver1: {
    password: 'password123',
    user: {
      id: 'usr-002',
      username: 'approver1',
      email: 'manager@helical.com',
      fullName: 'John Manager',
      role: 'Manager',
      roles: ['manager'],
      company: 'DEMO',
      department: 'Finance',
      permissions: {
        PAYMENT: { canView: true, canCreate: true, canApprove: true, canReject: true, maxValue: 50000 },
        AP: { canView: true, canCreate: false, canApprove: true, canReject: true, maxValue: 50000 },
        PO: { canView: true, canCreate: false, canApprove: true, canReject: true, maxValue: 50000 },
        REPORTS: { canView: true, canCreate: false, canApprove: false, canReject: false, maxValue: null },
      },
    },
  },
  approver2: {
    password: 'password123',
    user: {
      id: 'usr-003',
      username: 'approver2',
      email: 'finance@helical.com',
      fullName: 'Sarah Finance',
      role: 'Finance Approver',
      roles: ['finance_approver'],
      company: 'DEMO',
      department: 'Finance',
      permissions: {
        PAYMENT: { canView: true, canCreate: false, canApprove: true, canReject: true, maxValue: null },
        AP: { canView: true, canCreate: false, canApprove: true, canReject: true, maxValue: null },
        REPORTS: { canView: true, canCreate: false, canApprove: false, canReject: false, maxValue: null },
      },
    },
  },
  requester: {
    password: 'password123',
    user: {
      id: 'usr-004',
      username: 'requester',
      email: 'staff@helical.com',
      fullName: 'Mike Staff',
      role: 'Staff',
      roles: ['staff'],
      company: 'DEMO',
      department: 'Operations',
      permissions: {
        PAYMENT: { canView: true, canCreate: true, canApprove: false, canReject: false, maxValue: null },
        PO: { canView: true, canCreate: false, canApprove: false, canReject: false, maxValue: null },
        ONBOARDING: { canView: true, canCreate: true, canApprove: false, canReject: false, maxValue: null },
      },
    },
  },
};

/**
 * Login — authenticates user
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  if (USE_MOCK) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser = mockUsers[credentials.username.toLowerCase()];

    if (!mockUser || mockUser.password !== credentials.password) {
      throw new Error('Invalid username or password. Try: admin / password123');
    }

    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: mockUser.user,
    };
  }

  const response = await apiClient.post('/auth/login', credentials);
  const { accessToken, refreshToken, user } = response.data.data;
  
  // Store tokens
  localStorage.setItem('auth_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  localStorage.setItem('auth_user', JSON.stringify(user));
  
  return {
    token: accessToken,
    user,
  };
}

/**
 * Logout
 */
export async function logout(): Promise<void> {
  if (!USE_MOCK) {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore errors on logout
    }
  }
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('auth_user');
}

/**
 * Get current user profile
 */
export async function getProfile(): Promise<User> {
  if (USE_MOCK) {
    const stored = localStorage.getItem('auth_user');
    if (stored) return JSON.parse(stored);
    return mockAuthResponse.user as User;
  }
  
  const response = await apiClient.get('/auth/me');
  return response.data.data;
}

/**
 * Refresh access token
 */
export async function refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
  const refreshTokenValue = localStorage.getItem('refresh_token');
  if (!refreshTokenValue) {
    throw new Error('No refresh token available');
  }
  
  const response = await apiClient.post('/auth/refresh', {
    refreshToken: refreshTokenValue,
  });
  
  const { accessToken, refreshToken: newRefreshToken } = response.data.data;
  
  localStorage.setItem('auth_token', accessToken);
  localStorage.setItem('refresh_token', newRefreshToken);
  
  return { accessToken, refreshToken: newRefreshToken };
}

/**
 * Change password
 */
export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    return;
  }
  await apiClient.post('/auth/change-password', data);
}
