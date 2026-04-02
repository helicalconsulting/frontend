import type { PurchaseOrdersResponse, ApproveRejectRequest, ApproveRejectResponse, PurchaseOrder } from '@/types';
import { mockPurchaseOrders } from '@/mocks/data';
import apiClient from './apiClient';

// Toggle between mock and real API calls
const USE_MOCK = false;

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
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    return mockPurchaseOrders;
  }
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
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const order = mockPurchaseOrders.orders.find((o) => o.poNumber === poNumber);
    if (!order) throw new Error('PO not found');
    return order;
  }
  const response = await apiClient.get(`/po/${poNumber}`);
  return response.data.data;
}

/**
 * Approve a purchase order (legacy interface)
 */
export async function approveOrder(request: ApproveRejectRequest): Promise<ApproveRejectResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    return {
      success: true,
      message: `Order ${request.orderId} approved successfully`,
      orderId: request.orderId,
      newStatus: 'approved',
    };
  }
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
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    throw new Error('Mock mode - cannot approve PO');
  }
  const response = await apiClient.post(`/po/${poNumber}/approve`, data);
  return response.data.data;
}

/**
 * Reject a purchase order (legacy interface)
 */
export async function rejectOrder(request: ApproveRejectRequest): Promise<ApproveRejectResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    return {
      success: true,
      message: `Order ${request.orderId} rejected`,
      orderId: request.orderId,
      newStatus: 'rejected',
    };
  }
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
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    throw new Error('Mock mode - cannot reject PO');
  }
  const response = await apiClient.post(`/po/${poNumber}/reject`, data);
  return response.data.data;
}

/**
 * Get PO approval history
 */
export async function getPOHistory(poNumber: string): Promise<POHistoryEntry[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return [];
  }
  const response = await apiClient.get(`/po/${poNumber}/history`);
  return response.data.data;
}
