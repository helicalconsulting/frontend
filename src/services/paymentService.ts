import apiClient from './apiClient';
import { API_CONFIG } from '@/config';

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
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.PAYMENTS.BASE, { params });
  return response.data.data;
}

/**
 * Get single payment request
 */
export async function getPaymentRequest(id: number): Promise<PaymentRequest> {
  const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.PAYMENTS.BASE}/${id}`);
  return response.data.data;
}

/**
 * Get approval status for a payment request
 */
export async function getPaymentApprovalStatus(id: number): Promise<PaymentApprovalStatus> {
  const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.PAYMENTS.BASE}/${id}/approval-status`);
  return response.data.data;
}

/**
 * Create payment request (draft)
 */
export async function createPaymentRequest(data: CreatePaymentInput): Promise<PaymentRequest> {
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.PAYMENTS.BASE, data);
  return response.data.data;
}

/**
 * Update payment request
 */
export async function updatePaymentRequest(id: number, data: Partial<CreatePaymentInput>): Promise<PaymentRequest> {
  const response = await apiClient.put(`${API_CONFIG.ENDPOINTS.PAYMENTS.BASE}/${id}`, data);
  return response.data.data;
}

/**
 * Submit payment request for approval
 */
export async function submitPaymentRequest(id: number): Promise<PaymentRequest> {
  const response = await apiClient.post(`${API_CONFIG.ENDPOINTS.PAYMENTS.BASE}/${id}/submit`);
  return response.data.data;
}

/**
 * Approve payment request
 */
export async function approvePaymentRequest(id: number, data: { comment?: string; signature?: string }): Promise<PaymentRequest> {
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.PAYMENTS.APPROVE(String(id)), data);
  return response.data.data;
}

/**
 * Reject payment request
 */
export async function rejectPaymentRequest(id: number, data: { comment: string }): Promise<PaymentRequest> {
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.PAYMENTS.REJECT(String(id)), data);
  return response.data.data;
}

/**
 * Delete draft payment request
 */
export async function deletePaymentRequest(id: number): Promise<void> {
  await apiClient.delete(`${API_CONFIG.ENDPOINTS.PAYMENTS.BASE}/${id}`);
}
