import type { DashboardData, DashboardKPI, ApprovalTrend, RequestTypeBreakdown } from '@/types';
import { mockDashboardData } from '@/mocks/data';
import apiClient from './apiClient';

// Toggle between mock and real API calls
const USE_MOCK = true;

/**
 * Fetch dashboard KPIs
 */
export async function getDashboardKPIs(): Promise<DashboardKPI> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return mockDashboardData.kpis;
  }
  const response = await apiClient.get('/dashboard/kpis');
  return response.data.data;
}

/**
 * Fetch approval trends
 */
export async function getApprovalTrends(): Promise<ApprovalTrend[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return mockDashboardData.approvalTrends;
  }
  const response = await apiClient.get('/dashboard/trends');
  return response.data.data;
}

/**
 * Fetch request type breakdown
 */
export async function getRequestTypeBreakdown(): Promise<RequestTypeBreakdown[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return mockDashboardData.requestTypes;
  }
  const response = await apiClient.get('/dashboard/breakdown');
  return response.data.data;
}

/**
 * Fetch all dashboard data
 */
export async function getDashboardData(): Promise<DashboardData> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    return mockDashboardData;
  }
  const response = await apiClient.get('/dashboard');
  return response.data.data;
}
