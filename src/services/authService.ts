import type { LoginCredentials, AuthResponse } from '@/types';
import { mockAuthResponse } from '@/mocks/data';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Authenticate user. Currently uses mock data.
 * Replace the body of this function with a real API call when backend is ready:
 *   return apiClient.post<AuthResponse>('/auth/login', credentials).then(r => r.data);
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  await delay(1200);

  if (credentials.username === 'ADMIN' && credentials.password === 'admin123') {
    return {
      ...mockAuthResponse,
      user: {
        ...mockAuthResponse.user,
        company: credentials.company,
      },
    };
  }

  throw new Error('Invalid username or password');
}

export async function logout(): Promise<void> {
  await delay(300);
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}
