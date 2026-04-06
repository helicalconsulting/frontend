import type { DashboardData, DashboardKPI, ApprovalTrend, RequestTypeBreakdown } from '@/types';
import apiClient from './apiClient';
import { API_CONFIG } from '@/config';

/**
 * Fetch dashboard KPIs
 */
export async function getDashboardKPIs(): Promise<DashboardKPI> {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.DASHBOARD.KPIS);
  return response.data.data;
}

/**
 * Fetch approval trends
 */
export async function getApprovalTrends(): Promise<ApprovalTrend[]> {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.DASHBOARD.TRENDS);
  return response.data.data;
}

/**
 * Fetch request type breakdown
 */
export async function getRequestTypeBreakdown(): Promise<RequestTypeBreakdown[]> {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.DASHBOARD.BREAKDOWN);
  return response.data.data;
}

/**
 * Fetch pending counts
 */
export async function getPendingCounts(): Promise<any> {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.DASHBOARD.PENDING);
  return response.data.data;
}

/**
 * Fetch recent activity
 */
export async function getRecentActivity(): Promise<any> {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.DASHBOARD.ACTIVITY);
  return response.data.data;
}

/**
 * Fetch all dashboard data
 */
export async function getDashboardData(): Promise<DashboardData> {
  const [kpis, trends, breakdown] = await Promise.all([
    getDashboardKPIs(),
    getApprovalTrends(),
    getRequestTypeBreakdown(),
  ]);
  
  return {
    kpis,
    approvalTrends: trends,
    requestTypes: breakdown,
  };
}
