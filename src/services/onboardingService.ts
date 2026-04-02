import apiClient from './apiClient';

// Toggle between mock and real API calls
const USE_MOCK = false;

// ============================================
// Types
// ============================================
export interface OnboardingRequest {
  id: number;
  reqNumber: string;
  type: 'SUPPLIER' | 'CUSTOMER';
  entityName: string;
  tradingName?: string;
  taxNumber?: string;
  vatNumber?: string;
  registrationNumber?: string;
  category?: string;
  currency?: string;
  paymentTerms?: string;
  creditLimit?: number;
  address?: OnboardingAddress;
  bankDetails?: OnboardingBankDetails;
  contacts?: OnboardingContact[];
  documents?: OnboardingDocument[];
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  currentLevel: number;
  sysprCode?: string;
  submittedBy?: { id: number; fullName: string };
  submittedAt?: string;
  approvals?: ApprovalRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingAddress {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface OnboardingBankDetails {
  bankName: string;
  accountNumber: string;
  branchCode: string;
  accountType?: string;
  swiftCode?: string;
}

export interface OnboardingContact {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  isPrimary: boolean;
}

export interface OnboardingDocument {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  documentType: string;
  uploadedAt: string;
  url?: string;
}

export interface ApprovalRecord {
  id: number;
  level: number;
  action: 'APPROVED' | 'REJECTED';
  comment?: string;
  approvedBy: { id: number; fullName: string };
  approvedAt: string;
}

export interface ApprovalStatus {
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

export interface GetRequestsParams {
  page?: number;
  limit?: number;
  status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  type?: 'SUPPLIER' | 'CUSTOMER';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateRequestData {
  type: 'SUPPLIER' | 'CUSTOMER';
  entityName: string;
  tradingName?: string;
  taxNumber?: string;
  vatNumber?: string;
  registrationNumber?: string;
  category?: string;
  currency?: string;
  paymentTerms?: string;
  creditLimit?: number;
  address?: OnboardingAddress;
  bankDetails?: OnboardingBankDetails;
  contacts?: Omit<OnboardingContact, 'id'>[];
}

export interface UpdateRequestData extends Partial<CreateRequestData> {}

export interface ApproveRequestData {
  comment?: string;
  signature?: string;
  sysprCode?: string;
}

export interface RejectRequestData {
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
// Onboarding Request Operations
// ============================================

/**
 * Get all onboarding requests with pagination and filters
 */
export async function getRequests(
  params?: GetRequestsParams
): Promise<PaginatedResponse<OnboardingRequest>> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return { items: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
  }
  const response = await apiClient.get('/onboarding', { params });
  return response.data.data;
}

/**
 * Get a single onboarding request by ID
 */
export async function getRequest(id: number): Promise<OnboardingRequest> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    throw new Error('Request not found');
  }
  const response = await apiClient.get(`/onboarding/${id}`);
  return response.data.data;
}

/**
 * Get approval status for an onboarding request
 */
export async function getApprovalStatus(id: number): Promise<ApprovalStatus> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return { currentLevel: 0, totalLevels: 2, levels: [] };
  }
  const response = await apiClient.get(`/onboarding/${id}/approval-status`);
  return response.data.data;
}

/**
 * Create a new onboarding request (as draft)
 */
export async function createRequest(data: CreateRequestData): Promise<OnboardingRequest> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    throw new Error('Mock mode - cannot create request');
  }
  const response = await apiClient.post('/onboarding', data);
  return response.data.data;
}

/**
 * Update an existing onboarding request
 */
export async function updateRequest(
  id: number,
  data: UpdateRequestData
): Promise<OnboardingRequest> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    throw new Error('Mock mode - cannot update request');
  }
  const response = await apiClient.put(`/onboarding/${id}`, data);
  return response.data.data;
}

/**
 * Submit an onboarding request for approval
 */
export async function submitRequest(id: number): Promise<OnboardingRequest> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    throw new Error('Mock mode - cannot submit request');
  }
  const response = await apiClient.post(`/onboarding/${id}/submit`);
  return response.data.data;
}

/**
 * Approve an onboarding request
 */
export async function approveRequest(
  id: number,
  data: ApproveRequestData
): Promise<OnboardingRequest> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    throw new Error('Mock mode - cannot approve request');
  }
  const response = await apiClient.post(`/onboarding/${id}/approve`, data);
  return response.data.data;
}

/**
 * Reject an onboarding request
 */
export async function rejectRequest(
  id: number,
  data: RejectRequestData
): Promise<OnboardingRequest> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    throw new Error('Mock mode - cannot reject request');
  }
  const response = await apiClient.post(`/onboarding/${id}/reject`, data);
  return response.data.data;
}

/**
 * Delete an onboarding request
 */
export async function deleteRequest(id: number): Promise<void> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    throw new Error('Mock mode - cannot delete request');
  }
  await apiClient.delete(`/onboarding/${id}`);
}
