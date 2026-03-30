import type { LoginCredentials, AuthResponse, User } from '@/types';
import { mockAuthResponse } from '@/mocks/data';

// Demo users for mock login
const mockUsers: Record<string, { password: string; user: AuthResponse['user'] }> = {
  admin: {
    password: 'password123',
    user: {
      id: 'usr-001',
      username: 'ADMIN',
      fullName: 'SYSPRO Administrator',
      role: 'Admin',
      company: 'EDU1',
    },
  },
  approver1: {
    password: 'password123',
    user: {
      id: 'usr-002',
      username: 'APPROVER1',
      fullName: 'Alan Brown',
      role: 'Approver',
      company: 'EDU1',
    },
  },
  approver2: {
    password: 'password123',
    user: {
      id: 'usr-003',
      username: 'APPROVER2',
      fullName: 'Jane Doe',
      role: 'Approver',
      company: 'EDU1',
    },
  },
  requester: {
    password: 'password123',
    user: {
      id: 'usr-004',
      username: 'REQUESTER',
      fullName: 'John Smith',
      role: 'Requester',
      company: 'EDU1',
    },
  },
};

/**
 * Mock login — authenticates against local demo users
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
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

/**
 * Mock logout
 */
export async function logout(): Promise<void> {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('auth_user');
}

/**
 * Mock get profile
 */
export async function getProfile(): Promise<User> {
  const stored = localStorage.getItem('auth_user');
  if (stored) return JSON.parse(stored);
  return mockAuthResponse.user as User;
}
