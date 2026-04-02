import apiClient from './apiClient';

// Toggle between mock and real API calls
const USE_MOCK = false;

// ============================================
// Types
// ============================================
export interface APInvoice {
  id: number;
  invoiceNumber: string;
  supplier: string;
  supplierCode: string;
  invoiceDate: string;
  dueDate: string;
  netValue: number;
  vatAmount: number;
  totalAmount: number;
  currency: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  matchStatus: 'MATCHED' | 'UNMATCHED' | 'PARTIAL' | 'VARIANCE';
  variance?: number;
  variancePercentage?: number;
  currentLevel: number;
  grnDetails?: GRNDetail[];
  poDetails?: PODetail[];
  approvals?: ApprovalRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface GRNDetail {
  id: number;
  grnNumber: string;
  item: string;
  stockCode: string;
  description: string;
  warehouse: string;
  qtyReceived: number;
  uom: string;
  matchedValue: number;
}

export interface PODetail {
  id: number;
  poNumber: string;
  lineNumber: number;
  stockCode: string;
  description: string;
  orderedQty: number;
  receivedQty: number;
  unitPrice: number;
  lineValue: number;
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

export interface GetInvoicesParams {
  page?: number;
  limit?: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  matchStatus?: 'MATCHED' | 'UNMATCHED' | 'PARTIAL' | 'VARIANCE';
  supplier?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ApproveInvoiceData {
  comment?: string;
  signature?: string;
  overrideVariance?: boolean;
}

export interface RejectInvoiceData {
  reason: string;
  comment?: string;
  returnToSupplier?: boolean;
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
// Invoice Operations
// ============================================

/**
 * Get all invoices with pagination and filters
 */
export async function getInvoices(params?: GetInvoicesParams): Promise<PaginatedResponse<APInvoice>> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return { items: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
  }
  const response = await apiClient.get('/ap', { params });
  return response.data.data;
}

/**
 * Get a single invoice by invoice number
 */
export async function getInvoice(invoiceNumber: string): Promise<APInvoice> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    throw new Error('Invoice not found');
  }
  const response = await apiClient.get(`/ap/${invoiceNumber}`);
  return response.data.data;
}

/**
 * Approve an invoice
 */
export async function approveInvoice(
  invoiceNumber: string,
  data: ApproveInvoiceData
): Promise<APInvoice> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    throw new Error('Mock mode - cannot approve invoice');
  }
  const response = await apiClient.post(`/ap/${invoiceNumber}/approve`, data);
  return response.data.data;
}

/**
 * Reject an invoice
 */
export async function rejectInvoice(
  invoiceNumber: string,
  data: RejectInvoiceData
): Promise<APInvoice> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    throw new Error('Mock mode - cannot reject invoice');
  }
  const response = await apiClient.post(`/ap/${invoiceNumber}/reject`, data);
  return response.data.data;
}

/**
 * Get approval history for an invoice
 */
export async function getInvoiceHistory(invoiceNumber: string): Promise<ApprovalHistoryEntry[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return [];
  }
  const response = await apiClient.get(`/ap/${invoiceNumber}/history`);
  return response.data.data;
}
