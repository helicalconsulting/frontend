import type { PurchaseOrdersResponse, ApproveRejectRequest, ApproveRejectResponse, PurchaseOrder } from '@/types';
import apiClient from "./apiClient";
import { API_CONFIG } from "@/config";

// ============================================
// Types for API Responses
// ============================================
export interface POListParams {
  page?: number;
  limit?: number;
  supplier?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  minValue?: number;
  maxValue?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface POApprovalData {
  comment?: string;
  signature?: string;
}

export interface PORejectData {
  reason: string;
  comment?: string;
}

export interface POHistoryEntry {
  id: number;
  action: string;
  comment?: string;
  user: { id: number; fullName: string };
  timestamp: string;
  level?: number;
}

// ============================================
// Purchase Order Operations
// ============================================

/**
 * Fetch all pending purchase orders
 */
export async function getPurchaseOrders(params?: POListParams): Promise<PurchaseOrdersResponse> {
  const response = await apiClient.get('/po/pending', { params });
  // Transform API response to match existing type
  const data = response.data.data;
  return {
    orders: data.items || [],
    totalCount: data.pagination?.total || 0,
    pendingCount: data.items?.length || 0,
    totalValue: {},
  };
}

/**
 * Get single PO details
 */
export async function getPurchaseOrderDetails(poNumber: string): Promise<PurchaseOrder> {
  const response = await apiClient.get(`/po/${poNumber}`);
  return response.data.data;
}

/**
 * Approve a purchase order (legacy interface)
 */
export async function approveOrder(request: ApproveRejectRequest): Promise<ApproveRejectResponse> {
  const response = await apiClient.post(`/po/${request.orderId}/approve`, {
    comment: request.comments,
    signature: request.signature,
  });
  return {
    success: response.data.success,
    message: response.data.message || 'Order approved',
    orderId: request.orderId,
    newStatus: 'approved',
  };
}

/**
 * Approve a purchase order (new interface)
 */
export async function approvePurchaseOrder(
  poNumber: string,
  data: POApprovalData
): Promise<PurchaseOrder> {
  const response = await apiClient.post(`/po/${poNumber}/approve`, data);
  return response.data.data;
}

/**
 * Reject a purchase order (legacy interface)
 */
export async function rejectOrder(request: ApproveRejectRequest): Promise<ApproveRejectResponse> {
  const response = await apiClient.post(`/po/${request.orderId}/reject`, {
    reason: request.comments || 'Rejected',
    comment: request.comments,
  });
  return {
    success: response.data.success,
    message: response.data.message || 'Order rejected',
    orderId: request.orderId,
    newStatus: 'rejected',
  };
}

/**
 * Reject a purchase order (new interface)
 */
export async function rejectPurchaseOrder(
  poNumber: string,
  data: PORejectData
): Promise<PurchaseOrder> {
  const response = await apiClient.post(`/po/${poNumber}/reject`, data);
  return response.data.data;
}

/**
 * Get PO approval history
 */
export async function getPOHistory(poNumber: string): Promise<POHistoryEntry[]> {
  const response = await apiClient.get(`/po/${poNumber}/history`);
  return response.data.data;
}
