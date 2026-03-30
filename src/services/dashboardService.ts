import type { DashboardData, DashboardKPI, ApprovalTrend, RequestTypeBreakdown } from '@/types';
import { mockDashboardData } from '@/mocks/data';

/**
 * Mock — Fetch dashboard KPIs
 */
export async function getDashboardKPIs(): Promise<DashboardKPI> {
  await new Promise((r) => setTimeout(r, 300));
  return mockDashboardData.kpis;
}

/**
 * Mock — Fetch approval trends
 */
export async function getApprovalTrends(): Promise<ApprovalTrend[]> {
  await new Promise((r) => setTimeout(r, 200));
  return mockDashboardData.approvalTrends;
}

/**
 * Mock — Fetch request type breakdown
 */
export async function getRequestTypeBreakdown(): Promise<RequestTypeBreakdown[]> {
  await new Promise((r) => setTimeout(r, 200));
  return mockDashboardData.requestTypes;
}

/**
 * Mock — Fetch all dashboard data
 */
export async function getDashboardData(): Promise<DashboardData> {
  await new Promise((r) => setTimeout(r, 400));
  return mockDashboardData;
}
