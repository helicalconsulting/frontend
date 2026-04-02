import apiClient from './apiClient';

// Toggle between mock and real API calls
const USE_MOCK = false;

export interface PaymentRequest {
  id: number;
  reqNumber: string;
  supplierCode: string;
  supplierName?: string;
  currency: string;
  dueDate?: string;
  category?: string;
  amountExclVat: number;
  vatAmount: number;
  totalAmount: number;
  reference?: string;
  internalNotes?: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  currentLevel: number;
  submittedBy?: number;
  submittedAt?: string;
  submitter?: { fullName: string };
  approverL1?: { fullName: string };
  approverL2?: { fullName: string };
  lines: PaymentLine[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentLine {
  id: number;
  lineNumber: number;
  description: string;
  amount: number;
  taxCode?: string;
  taxAmount: number;
  costCenter?: string;
  glAccount?: string;
}

export interface CreatePaymentInput {
  supplierCode: string;
  supplierName?: string;
  currency?: string;
  dueDate?: string;
  category?: string;
  reference?: string;
  internalNotes?: string;
  lines: {
    description: string;
    amount: number;
    taxCode?: string;
    taxAmount?: number;
    costCenter?: string;
    glAccount?: string;
  }[];
}

export interface PaymentApprovalStatus {
  currentLevel: number;
  totalLevels: number;
  levels: {
    level: number;
    name: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SKIPPED';
    approvedBy?: { id: number; fullName: string };
    approvedAt?: string;
    comment?: string;
  }[];
}

/**
 * List payment requests
 */
export async function getPaymentRequests(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{
  payments: PaymentRequest[];
  pagination: { page: number; limit: number; total: number; pages: number };
}> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return { payments: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
  }
  const response = await apiClient.get('/payments', { params });
  return response.data.data;
}

/**
 * Get single payment request
 */
export async function getPaymentRequest(id: number): Promise<PaymentRequest> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    throw new Error('Payment not found');
  }
  const response = await apiClient.get(`/payments/${id}`);
  return response.data.data;
}

/**
 * Get approval status for a payment request
 */
export async function getPaymentApprovalStatus(id: number): Promise<PaymentApprovalStatus> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return { currentLevel: 0, totalLevels: 2, levels: [] };
  }
  const response = await apiClient.get(`/payments/${id}/approval-status`);
  return response.data.data;
}

/**
 * Create payment request (draft)
 */
export async function createPaymentRequest(data: CreatePaymentInput): Promise<PaymentRequest> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    throw new Error('Mock mode - cannot create payment');
  }
  const response = await apiClient.post('/payments', data);
  return response.data.data;
}

/**
 * Update payment request
 */
export async function updatePaymentRequest(id: number, data: Partial<CreatePaymentInput>): Promise<PaymentRequest> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    throw new Error('Mock mode - cannot update payment');
  }
  const response = await apiClient.put(`/payments/${id}`, data);
  return response.data.data;
}

/**
 * Submit payment request for approval
 */
export async function submitPaymentRequest(id: number): Promise<PaymentRequest> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    throw new Error('Mock mode - cannot submit payment');
  }
  const response = await apiClient.post(`/payments/${id}/submit`);
  return response.data.data;
}

/**
 * Approve payment request
 */
export async function approvePaymentRequest(id: number, data: { comment?: string; signature?: string }): Promise<PaymentRequest> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    throw new Error('Mock mode - cannot approve payment');
  }
  const response = await apiClient.post(`/payments/${id}/approve`, data);
  return response.data.data;
}

/**
 * Reject payment request
 */
export async function rejectPaymentRequest(id: number, data: { comment: string }): Promise<PaymentRequest> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    throw new Error('Mock mode - cannot reject payment');
  }
  const response = await apiClient.post(`/payments/${id}/reject`, data);
  return response.data.data;
}

/**
 * Delete draft payment request
 */
export async function deletePaymentRequest(id: number): Promise<void> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    throw new Error('Mock mode - cannot delete payment');
  }
  await apiClient.delete(`/payments/${id}`);
}
