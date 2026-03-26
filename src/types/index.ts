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
  id: string;
  username: string;
  fullName: string;
  role: string;
  company: string;
  avatar?: string;
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
}

export interface ApprovalTrend {
  day: string;
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
}

export interface ApproveRejectResponse {
  success: boolean;
  message: string;
  orderId: string;
  newStatus: string;
}
