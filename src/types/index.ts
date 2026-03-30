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
