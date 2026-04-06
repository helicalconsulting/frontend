import apiClient from "./apiClient";
import { API_CONFIG } from "@/config";

// ============================================
// Types
// ============================================
export interface ApprovalReportEntry {
  id: number;
  module: string;
  documentNumber: string;
  documentType: string;
  action: 'APPROVED' | 'REJECTED';
  approver: { id: number; fullName: string };
  approvedAt: string;
  level: number;
  value?: number;
  currency?: string;
  comment?: string;
}

export interface ActivityReportEntry {
  id: number;
  user: { id: number; fullName: string; username: string };
  action: string;
  module: string;
  documentNumber?: string;
  details?: string;
  ipAddress?: string;
  timestamp: string;
}

export interface ModuleStatistics {
  module: string;
  totalDocuments: number;
  pending: number;
  approved: number;
  rejected: number;
  avgProcessingTime: number;
  totalValue: number;
  currency: string;
}

export interface StatisticsResponse {
  period: { startDate: string; endDate: string };
  summary: {
    totalApprovals: number;
    totalRejections: number;
    avgProcessingTime: number;
    totalValue: number;
  };
  byModule: ModuleStatistics[];
  trends: { date: string; approvals: number; rejections: number }[];
}

export interface GetApprovalsReportParams {
  page?: number;
  limit?: number;
  module?: string;
  action?: 'APPROVED' | 'REJECTED';
  approver?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface GetActivityReportParams {
  page?: number;
  limit?: number;
  user?: number;
  action?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ExportParams {
  type?: string;
  module?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ============================================
// Report Operations
// ============================================

/**
 * Get approvals report with filters
 */
export async function getApprovalsReport(
  params?: GetApprovalsReportParams
): Promise<PaginatedResponse<ApprovalReportEntry>> {
  const response = await apiClient.get('/reports/approvals', { params });
  return response.data.data;
}

/**
 * Get activity report with filters
 */
export async function getActivityReport(
  params?: GetActivityReportParams
): Promise<PaginatedResponse<ActivityReportEntry>> {
  const response = await apiClient.get('/reports/activity', { params });
  return response.data.data;
}

/**
 * Get statistics for a date range
 */
export async function getStatistics(
  startDate: string,
  endDate: string
): Promise<StatisticsResponse> {
  const response = await apiClient.get('/reports/statistics', {
    params: { startDate, endDate },
  });
  return response.data.data;
}

/**
 * Export report data as Excel/CSV
 * Returns a Blob for file download
 */
export async function exportExcel(params?: ExportParams): Promise<Blob> {
  const response = await apiClient.get('/reports/export/excel', {
    params,
    responseType: 'blob',
  });
  return response.data;
}

/**
 * Export report data as PDF
 * Returns a Blob for file download
 */
export async function exportPdf(params?: ExportParams): Promise<Blob> {
  const response = await apiClient.get('/reports/export/pdf', {
    params,
    responseType: 'blob',
  });
  return response.data;
}

// ============================================
// Utility Functions
// ============================================

/**
 * Helper to trigger file download from blob
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
