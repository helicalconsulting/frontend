import apiClient from './apiClient';

// Toggle between mock and real API calls
const USE_MOCK = false;

// ============================================
// Types
// ============================================
export interface SalesOrder {
  id: number;
  orderNumber: string;
  customerCode: string;
  customerName: string;
  orderDate: string;
  dueDate?: string;
  totalValue: number;
  currency: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RELEASED';
  creditStatus: 'OK' | 'HOLD' | 'OVERRIDE_REQUESTED' | 'OVERRIDE_APPROVED';
  creditLimit: number;
  currentBalance: number;
  availableCredit: number;
  isCreditBreached: boolean;
  salesperson?: string;
  customerPONumber?: string;
  lineDetails?: SalesOrderLine[];
  overdueInvoices?: OverdueInvoice[];
  paymentAging?: PaymentAgingEntry[];
  currentLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface SalesOrderLine {
  id: number;
  lineNumber: number;
  stockCode: string;
  description: string;
  warehouse?: string;
  uom: string;
  orderQty: number;
  unitPrice: number;
  lineValue: number;
}

export interface OverdueInvoice {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  balance: number;
  agingDays: number;
}

export interface PaymentAgingEntry {
  period: string;
  amount: number;
  percentage: number;
}

export interface CreditOverride {
  id: number;
  orderNumber: string;
  customerCode: string;
  customerName: string;
  requestedBy: { id: number; fullName: string };
  requestedAt: string;
  currentLimit: number;
  requestedLimit: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: { id: number; fullName: string };
  approvedAt?: string;
  approvalComment?: string;
  isTemporary: boolean;
  expiryDate?: string;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RELEASED';
  creditStatus?: 'OK' | 'HOLD' | 'OVERRIDE_REQUESTED' | 'OVERRIDE_APPROVED';
  customer?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ApproveOrderData {
  comment?: string;
  signature?: string;
}

export interface RejectOrderData {
  reason: string;
  comment?: string;
}

export interface ApproveCreditOverrideData {
  comment?: string;
  newLimit?: number;
  isTemporary?: boolean;
  expiryDate?: string;
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
// Sales Order Operations
// ============================================

/**
 * Get all sales orders with pagination and filters
 */
export async function getOrders(params?: GetOrdersParams): Promise<PaginatedResponse<SalesOrder>> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return { items: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
  }
  const response = await apiClient.get('/sales', { params });
  return response.data.data;
}

/**
 * Get a single sales order by order number
 */
export async function getOrder(orderNumber: string): Promise<SalesOrder> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    throw new Error('Order not found');
  }
  const response = await apiClient.get(`/sales/${orderNumber}`);
  return response.data.data;
}

/**
 * Approve a sales order
 */
export async function approveOrder(
  orderNumber: string,
  data: ApproveOrderData
): Promise<SalesOrder> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    throw new Error('Mock mode - cannot approve order');
  }
  const response = await apiClient.post(`/sales/${orderNumber}/approve`, data);
  return response.data.data;
}

/**
 * Reject a sales order
 */
export async function rejectOrder(
  orderNumber: string,
  data: RejectOrderData
): Promise<SalesOrder> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    throw new Error('Mock mode - cannot reject order');
  }
  const response = await apiClient.post(`/sales/${orderNumber}/reject`, data);
  return response.data.data;
}

// ============================================
// Credit Override Operations
// ============================================

/**
 * Get credit overrides with optional status filter
 */
export async function getCreditOverrides(status?: string): Promise<CreditOverride[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return [];
  }
  const params = status ? { status } : undefined;
  const response = await apiClient.get('/sales/credit-overrides', { params });
  return response.data.data;
}

/**
 * Approve a credit override request
 */
export async function approveCreditOverride(
  overrideId: number,
  data: ApproveCreditOverrideData
): Promise<CreditOverride> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    throw new Error('Mock mode - cannot approve credit override');
  }
  const response = await apiClient.post(`/sales/credit-overrides/${overrideId}/approve`, data);
  return response.data.data;
}
