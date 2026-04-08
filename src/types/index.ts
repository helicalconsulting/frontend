// ============================================
// Auth Types
// ============================================
export interface LoginCredentials {
  username: string;
  password: string;
  company: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: number | string;
  username: string;
  email?: string;
  fullName: string;
  company: string;
  department?: string | null;
  role?: string;
  roles?: string[];
  permissions?: Record<string, ModulePermission>;
  avatar?: string;
}

export interface ModulePermission {
  canView: boolean;
  canApprove: boolean;
  canReject: boolean;
  canCreate: boolean;
  maxValue: number | null;
}

// ============================================
// Dashboard Types
// ============================================
export interface DashboardKPI {
  pendingApprovals: number;
  approvedToday: number;
  avgProcessingTime: number;
  totalFinancialExposure: number;
  currency: string;
  breakdown?: {
    purchaseOrders: number;
    paymentRequests: number;
  };
}

export interface ApprovalTrend {
  day: string;
  date?: string;
  approvals: number;
  rejections: number;
}

export interface RequestTypeBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface DashboardSection {
  id: string;
  title: string;
  icon: string;
  count: number;
  status: 'open' | 'closed';
  route?: string;
}

export interface DashboardData {
  kpis: DashboardKPI;
  approvalTrends: ApprovalTrend[];
  requestTypes: RequestTypeBreakdown[];
  sections: DashboardSection[];
}

// ============================================
// Purchase Order Types
// ============================================
export interface PurchaseOrderLineItem {
  id: string;
  poNumber: string;
  lineNumber: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  uom: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  orderDate: string;
  dueDate: string;
  amount: number;
  currency: string;
  exchangeRate: number;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  requestedBy: string;
  department: string;
  lineItems: PurchaseOrderLineItem[];
}

export interface PurchaseOrdersResponse {
  orders: PurchaseOrder[];
  totalCount: number;
  pendingCount: number;
  totalValue: Record<string, number>;
}

export interface ApproveRejectRequest {
  orderId: string;
  action: 'approve' | 'reject';
  comments?: string;
  signature?: string;
}

export interface ApproveRejectResponse {
  success: boolean;
  message: string;
  orderId: string;
  newStatus: string;
}

// ============================================
// Accounts Payable Types
// ============================================
export interface GRNDetail {
  id: string;
  item: string;
  purchaseOrder: string;
  grn: string;
  stockCode: string;
  description: string;
  warehouse: string;
  qtyReceived: number;
  uom: string;
  deliveryNote: string;
  matchedValue: number;
}

export interface SupplierInvoice {
  id: string;
  refNumber: string;
  supplier: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  netValue: number;
  currency: string;
  agingDays: number;
  status: 'pending' | 'approved' | 'overdue' | 'paid';
  approvalStatus: string;
  approver1?: string;
  approver2?: string;
  approvalDate1?: string;
  approvalDate2?: string;
  comment?: string;
  grnDetails: GRNDetail[];
}

// ============================================
// Payment Types
// ============================================
export interface PaymentRequestLineItem {
  id: string;
  description: string;
  account: string;
  amount: number;
  taxCode: string;
  taxAmount: number;
  total: number;
}

export interface PaymentRequest {
  id: string;
  requestNumber: string;
  supplierCode: string;
  supplierName: string;
  currency: string;
  dueDate: string;
  category: string;
  amount: number;
  vatAmount: number;
  totalAmount: number;
  reference: string;
  notes: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  requestDate: string;
  lineItems: PaymentRequestLineItem[];
}

export interface PaymentApprovalItem {
  id: string;
  requestNumber: string;
  supplier: string;
  amount: number;
  currency: string;
  requestDate: string;
  dueDate: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  priority: 'low' | 'medium' | 'high';
}

// ============================================
// Sales Order Types
// ============================================
export interface SalesOrderLineDetail {
  id: string;
  salesOrder: string;
  line: number;
  stockCode: string;
  description: string;
  warehouse: string;
  uom: string;
  orderQty: number;
  unitPrice: number;
  lineValue: number;
}

export interface OverdueInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  balance: number;
  agingDays: number;
}

export interface PaymentAgingEntry {
  id: string;
  period: string;
  amount: number;
  percentage: number;
}

export interface SalesOrder {
  id: string;
  salesOrderNumber: string;
  customerName: string;
  orderStatus: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  creditLimit: number;
  currentBalance: number;
  availableBalance: number;
  customerPONumber: string;
  orderDate: string;
  registrationDate: string;
  salesperson: string;
  isCreditBreached: boolean;
  lineDetails: SalesOrderLineDetail[];
  overdueInvoices: OverdueInvoice[];
  paymentAging: PaymentAgingEntry[];
}

// ============================================
// Master Data Types
// ============================================
export interface MasterDataRequest {
  id: number;
  entityType: 'Supplier' | 'Customer';
  entityName: string;
  taxVatNumber: string;
  submittedDate: string;
  documents: string[];
  workflowLevel: string;
  status: 'pending' | 'approved' | 'rejected';
  currency?: string;
  address?: string;
  onboardingType?: string;
}

// ============================================
// Finance Report Types
// ============================================
export interface FinanceReportEntry {
  id: string;
  refNumber: string;
  approved: boolean;
  supplier: string;
  invoiceNumber: string;
  netValue: number;
  dueDate: string;
  agingDays: number;
  approver1: string;
  approver2?: string;
  comment: string;
  approvalDate: string;
  hasFiles: boolean;
}

// ============================================
// Audit Trail Types
// ============================================
export interface AuditTrailEntry {
  id: string;
  poNumber: string;
  status: string;
  statusLabel: string;
  supplier: string;
  entryDate: string;
  value: number;
  currency: string;
  approvalStatus: string;
  approver1: string;
  approver2?: string;
  approvalDate1?: string;
  approvalDate2?: string;
  hasFiles: boolean;
}

// ============================================
// Attachment Types
// ============================================
export interface Attachment {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadDate: string;
  uploadedBy: string;
}

// ============================================
// Admin Types
// ============================================
export interface Role {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  permissions: string[];
  userCount?: number;
  isSystem?: boolean;
  createdAt?: string;
}

export interface Permission {
  id: string;
  module: string;
  action: string;
  description?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  department?: string;
  phone?: string;
  isActive: boolean;
  roles: Role[];
  roleIds?: string[];
  createdAt: string;
  lastLogin?: string;
  company: string;
}

export interface ApprovalLevel {
  id: string;
  module: string;
  levelNumber: number;
  levelName: string;
  minValue: number;
  maxValue: number | null;
  requiredRole: string;
  description?: string;
  isActive: boolean;
  isFinal: boolean;
  autoApprove: boolean;
  timeoutHours?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SystemSettings {
  defaultCurrency: string;
  sessionTimeoutMinutes: number;
  maxLoginAttempts: number;
  requireTwoFactor: boolean;
  emailNotifications: boolean;
  approvalReminderHours: number;
  autoEscalationEnabled: boolean;
  autoEscalationHours: number;
  companyName: string;
  companyLogo?: string;
  sysproIntegration: {
    enabled: boolean;
    baseUrl: string;
    company: string;
    maxSessions: number;
  };
}

// ============================================
// Credit Override Types
// ============================================
export interface CreditOverride {
  id: string;
  customerId: string;
  customerName: string;
  currentLimit: number;
  requestedLimit: number;
  orderAmount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  requestDate: string;
  salesOrderNumber?: string;
  currency: string;
}

// ============================================
// AP Invoice Types (Extended)
// ============================================
export interface APInvoice {
  id: string;
  invoiceNumber: string;
  supplier: string;
  supplierCode: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  matchStatus: 'matched' | 'partial' | 'unmatched';
  variance?: number;
  variancePercentage?: number;
  poNumbers: string[];
  grnNumbers: string[];
  agingDays: number;
  approvalHistory?: ApprovalHistoryEntry[];
}

export interface ApprovalHistoryEntry {
  id: string;
  action: 'submit' | 'approve' | 'reject' | 'escalate';
  performedBy: string;
  performedAt: string;
  level: number;
  comment?: string;
}

// ============================================
// Onboarding Types (Extended)
// ============================================
export interface OnboardingRequest {
  id: string;
  entityType: 'SUPPLIER' | 'CUSTOMER';
  entityName: string;
  taxVatNumber?: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;
  fullAddress?: string;
  currency: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  requestDate: string;
  sysproCode?: string;
  documents: Attachment[];
  approvalStatus?: {
    currentLevel: number;
    totalLevels: number;
    history: ApprovalHistoryEntry[];
  };
}

// ============================================
// Report Types
// ============================================
export interface ApprovalReport {
  id: string;
  module: string;
  documentNumber: string;
  action: 'approve' | 'reject';
  approverId: string;
  approverName: string;
  performedAt: string;
  amount?: number;
  currency?: string;
  comment?: string;
}

export interface ActivityReport {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  documentNumber: string;
  timestamp: string;
  ipAddress?: string;
  details?: string;
}

export interface ReportStatistics {
  totalApprovals: number;
  totalRejections: number;
  avgProcessingTimeHours: number;
  approvalsByModule: Record<string, number>;
  rejectionsByModule: Record<string, number>;
  topApprovers: { name: string; count: number }[];
  pendingByModule: Record<string, number>;
}

// ============================================
// API Response Types
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ============================================
// Health Check Types
// ============================================
export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  syspro: {
    connected: boolean;
    mode: string;
    baseUrl: string;
    company: string;
    activeSessions: number;
    maxSessions: number;
  };
}
