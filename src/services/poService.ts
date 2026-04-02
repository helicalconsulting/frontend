import apiClient from './apiClient';

// Toggle between mock and real API calls
const USE_MOCK = false;

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
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return { items: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
  }
  const response = await apiClient.get('/po/pending', { params });
  return response.data.data;
}

/**
 * Get a single purchase order by PO number
 */
export async function getPurchaseOrder(poNumber: string): Promise<PurchaseOrder> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    throw new Error('PO not found');
  }
  const response = await apiClient.get(`/po/${poNumber}`);
  return response.data.data;
}

/**
 * Approve a purchase order
 */
export async function approvePO(
  poNumber: string,
  data: ApprovePOData
): Promise<PurchaseOrder> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    throw new Error('Mock mode - cannot approve PO');
  }
  const response = await apiClient.post(`/po/${poNumber}/approve`, data);
  return response.data.data;
}

/**
 * Reject a purchase order
 */
export async function rejectPO(
  poNumber: string,
  data: RejectPOData
): Promise<PurchaseOrder> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    throw new Error('Mock mode - cannot reject PO');
  }
  const response = await apiClient.post(`/po/${poNumber}/reject`, data);
  return response.data.data;
}

/**
 * Get approval history for a purchase order
 */
export async function getPOHistory(poNumber: string): Promise<ApprovalHistoryEntry[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return [];
  }
  const response = await apiClient.get(`/po/${poNumber}/history`);
  return response.data.data;
}
