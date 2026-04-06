import apiClient from './apiClient';
import { API_CONFIG } from '@/config';

// ============================================
// Types
// ============================================
export interface PurchaseOrder {
  id: number;
  poNumber: string;
  supplier: string;
  supplierCode: string;
  orderDate: string;
  dueDate: string;
  deliveryDate?: string;
  amount: number;
  vatAmount?: number;
  totalAmount: number;
  currency: string;
  exchangeRate?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  requestedBy?: { id: number; fullName: string };
  department?: string;
  warehouse?: string;
  currentLevel: number;
  lineItems?: POLineItem[];
  approvals?: ApprovalRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface POLineItem {
  id: number;
  lineNumber: number;
  stockCode: string;
  description: string;
  warehouse?: string;
  uom: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ApprovalRecord {
  id: number;
  level: number;
  action: 'APPROVED' | 'REJECTED';
  comment?: string;
  approvedBy: { id: number; fullName: string };
  approvedAt: string;
}

export interface ApprovalHistoryEntry {
  id: number;
  action: string;
  comment?: string;
  user: { id: number; fullName: string };
  timestamp: string;
  level?: number;
  signature?: string;
}

export interface GetPendingPOsParams {
  page?: number;
  limit?: number;
  supplier?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  minValue?: number;
  maxValue?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface ApprovePOData {
  comment?: string;
  signature?: string;
}

export interface RejectPOData {
  reason: string;
  comment?: string;
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
// Purchase Order Operations
// ============================================

/**
 * Get all pending purchase orders with filters
 */
export async function getPendingOrders(
  params?: GetPendingPOsParams
): Promise<PaginatedResponse<PurchaseOrder>> {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.PO.PENDING, { params });
  return response.data.data;
}

/**
 * Get a single purchase order by PO number
 */
export async function getPurchaseOrder(poNumber: string): Promise<PurchaseOrder> {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.PO.DETAIL(poNumber));
  return response.data.data;
}

/**
 * Approve a purchase order
 */
export async function approvePO(
  poNumber: string,
  data: ApprovePOData
): Promise<PurchaseOrder> {
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.PO.APPROVE(poNumber), data);
  return response.data.data;
}

/**
 * Reject a purchase order
 */
export async function rejectPO(
  poNumber: string,
  data: RejectPOData
): Promise<PurchaseOrder> {
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.PO.REJECT(poNumber), data);
  return response.data.data;
}

/**
 * Get approval history for a purchase order
 */
export async function getPOHistory(poNumber: string): Promise<ApprovalHistoryEntry[]> {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.PO.HISTORY(poNumber));
  return response.data.data;
}
