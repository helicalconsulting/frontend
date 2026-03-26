import type { DashboardData } from '@/types';
import { mockDashboardData } from '@/mocks/data';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch dashboard data.
 * Replace with: apiClient.get<DashboardData>('/dashboard').then(r => r.data);
 */
export async function getDashboardData(): Promise<DashboardData> {
  await delay(800);
  return mockDashboardData;
}
