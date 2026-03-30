import type {
  DashboardData,
  PurchaseOrdersResponse,
  AuthResponse,
  SupplierInvoice,
  PaymentRequest,
  PaymentApprovalItem,
  SalesOrder,
  MasterDataRequest,
  FinanceReportEntry,
  AuditTrailEntry,
  Attachment,
} from '@/types';

// ============================================
// Mock Auth Data
// ============================================
export const mockAuthResponse: AuthResponse = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocktoken.signature',
  user: {
    id: 'usr-001',
    username: 'ADMIN',
    fullName: 'SYSPRO Administrator',
    role: 'Approver',
    company: 'EDU1',
    avatar: undefined,
  },
};

// ============================================
// Mock Dashboard Data
// ============================================
export const mockDashboardData: DashboardData = {
  kpis: {
    pendingApprovals: 58,
    approvedToday: 12,
    avgProcessingTime: 1258.0,
    totalFinancialExposure: 1263709.76,
    currency: 'KES',
  },
  approvalTrends: [
    { day: 'Mon', approvals: 15, rejections: 3 },
    { day: 'Tue', approvals: 22, rejections: 5 },
    { day: 'Wed', approvals: 18, rejections: 2 },
    { day: 'Thu', approvals: 30, rejections: 7 },
    { day: 'Fri', approvals: 25, rejections: 4 },
    { day: 'Sat', approvals: 8, rejections: 1 },
    { day: 'Sun', approvals: 5, rejections: 0 },
  ],
  requestTypes: [
    { name: 'PO', value: 42, color: '#3b82f6' },
    { name: 'AP', value: 28, color: '#10b981' },
    { name: 'Pay', value: 18, color: '#f59e0b' },
    { name: 'Sales', value: 12, color: '#8b5cf6' },
  ],
  sections: [
    { id: 'purchase-orders', title: 'Purchase Orders', icon: 'ShoppingCart', count: 42, status: 'open', route: '/purchase-orders' },
    { id: 'accounts-payable', title: 'Accounts Payable', icon: 'Receipt', count: 28, status: 'open', route: '/accounts-payable' },
    { id: 'payments', title: 'Payments', icon: 'CreditCard', count: 18, status: 'open', route: '/payments' },
    { id: 'sales-orders', title: 'Sales Orders', icon: 'TrendingUp', count: 12, status: 'open', route: '/sales-orders' },
  ],
};

// ============================================
// Mock Purchase Orders Data
// ============================================
export const mockPurchaseOrders: PurchaseOrdersResponse = {
  orders: [
    {
      id: 'po-001',
      poNumber: '000000000000512',
      supplier: 'Aztech Component Manufacturers',
      orderDate: '2025-05-14',
      dueDate: '2025-05-14',
      amount: 45000.0,
      currency: 'USD',
      exchangeRate: 1.0,
      status: 'pending',
      priority: 'high',
      requestedBy: 'John Smith',
      department: 'Engineering',
      lineItems: [
        { id: 'li-001', poNumber: '000000000000512', lineNumber: 1, description: '18 Speed Mountain Bike Boys', quantity: 100.0, unitPrice: 450.0, total: 45000.0, uom: 'EA' },
      ],
    },
    {
      id: 'po-002',
      poNumber: '000000000000513',
      supplier: 'Accessories Unlimited',
      orderDate: '2025-05-14',
      dueDate: '2025-05-14',
      amount: 1500.0,
      currency: 'EUR',
      exchangeRate: 0.876,
      status: 'pending',
      priority: 'medium',
      requestedBy: 'Jane Doe',
      department: 'Operations',
      lineItems: [
        { id: 'li-002', poNumber: '000000000000513', lineNumber: 1, description: 'Industrial Rubber Gaskets', quantity: 500.0, unitPrice: 2.0, total: 1000.0, uom: 'EA' },
        { id: 'li-003', poNumber: '000000000000513', lineNumber: 2, description: 'Precision Bearings Set', quantity: 50.0, unitPrice: 10.0, total: 500.0, uom: 'SET' },
      ],
    },
    {
      id: 'po-003',
      poNumber: '000000000000514',
      supplier: 'Global Electronics Ltd',
      orderDate: '2025-05-13',
      dueDate: '2025-05-20',
      amount: 128750.0,
      currency: 'USD',
      exchangeRate: 1.0,
      status: 'pending',
      priority: 'critical',
      requestedBy: 'Robert Chen',
      department: 'Production',
      lineItems: [
        { id: 'li-004', poNumber: '000000000000514', lineNumber: 1, description: 'Circuit Board Assembly PCB-X500', quantity: 250.0, unitPrice: 350.0, total: 87500.0, uom: 'EA' },
        { id: 'li-005', poNumber: '000000000000514', lineNumber: 2, description: 'Solder Paste Type 4', quantity: 25.0, unitPrice: 450.0, total: 11250.0, uom: 'KG' },
        { id: 'li-006', poNumber: '000000000000514', lineNumber: 3, description: 'SMD Capacitors Bulk', quantity: 10000.0, unitPrice: 3.0, total: 30000.0, uom: 'EA' },
      ],
    },
    {
      id: 'po-004',
      poNumber: '000000000000515',
      supplier: 'Precision Tools International',
      orderDate: '2025-05-12',
      dueDate: '2025-05-19',
      amount: 22400.0,
      currency: 'GBP',
      exchangeRate: 0.792,
      status: 'pending',
      priority: 'low',
      requestedBy: 'Sarah Williams',
      department: 'Maintenance',
      lineItems: [
        { id: 'li-007', poNumber: '000000000000515', lineNumber: 1, description: 'CNC Router Bits Set', quantity: 20.0, unitPrice: 870.0, total: 17400.0, uom: 'SET' },
        { id: 'li-008', poNumber: '000000000000515', lineNumber: 2, description: 'Calibration Tools Kit', quantity: 5.0, unitPrice: 1000.0, total: 5000.0, uom: 'KIT' },
      ],
    },
    {
      id: 'po-005',
      poNumber: '000000000000516',
      supplier: 'ChemSupply Africa',
      orderDate: '2025-05-11',
      dueDate: '2025-05-25',
      amount: 56200.0,
      currency: 'KES',
      exchangeRate: 129.5,
      status: 'pending',
      priority: 'high',
      requestedBy: 'Michael Ochieng',
      department: 'R&D',
      lineItems: [
        { id: 'li-009', poNumber: '000000000000516', lineNumber: 1, description: 'Industrial Epoxy Resin', quantity: 200.0, unitPrice: 180.0, total: 36000.0, uom: 'LTR' },
        { id: 'li-010', poNumber: '000000000000516', lineNumber: 2, description: 'Hardener Compound Type B', quantity: 100.0, unitPrice: 202.0, total: 20200.0, uom: 'LTR' },
      ],
    },
    {
      id: 'po-006',
      poNumber: '000000000000517',
      supplier: 'Nordic Steel Works',
      orderDate: '2025-05-10',
      dueDate: '2025-05-24',
      amount: 340000.0,
      currency: 'USD',
      exchangeRate: 1.0,
      status: 'approved',
      priority: 'critical',
      requestedBy: 'Erik Johansson',
      department: 'Construction',
      lineItems: [
        { id: 'li-011', poNumber: '000000000000517', lineNumber: 1, description: 'Structural Steel Beams I-500', quantity: 500.0, unitPrice: 680.0, total: 340000.0, uom: 'EA' },
      ],
    },
    {
      id: 'po-007',
      poNumber: '000000000000518',
      supplier: 'PackRight Solutions',
      orderDate: '2025-05-09',
      dueDate: '2025-05-16',
      amount: 8900.0,
      currency: 'USD',
      exchangeRate: 1.0,
      status: 'rejected',
      priority: 'low',
      requestedBy: 'Amanda Torres',
      department: 'Logistics',
      lineItems: [
        { id: 'li-012', poNumber: '000000000000518', lineNumber: 1, description: 'Corrugated Boxes 24x18x12', quantity: 2000.0, unitPrice: 3.2, total: 6400.0, uom: 'EA' },
        { id: 'li-013', poNumber: '000000000000518', lineNumber: 2, description: 'Packing Tape Industrial', quantity: 100.0, unitPrice: 25.0, total: 2500.0, uom: 'ROLL' },
      ],
    },
  ],
  totalCount: 7,
  pendingCount: 5,
  totalValue: { USD: 45000.0, EUR: 1500.0, GBP: 22400.0, KES: 56200.0 },
};

// ============================================
// Mock Accounts Payable — Supplier Invoices
// ============================================
export const mockSupplierInvoices: SupplierInvoice[] = [
  {
    id: 'inv-001',
    refNumber: '112',
    supplier: 'Splash Paints',
    invoiceNumber: '10122',
    invoiceDate: '2025-12-01',
    dueDate: '2025-03-27',
    netValue: 2000.0,
    currency: 'USD',
    agingDays: 3562,
    status: 'pending',
    approvalStatus: 'Pending',
    approver1: 'SYSPRO Administrator',
    comment: 'approved',
    approvalDate1: '12/08/2025',
    grnDetails: [
      { id: 'grn-001', item: '1', purchaseOrder: 'PO 000504', grn: 'GRN-001', stockCode: 'A101', description: 'Exterior Latex Paint - White', warehouse: 'E', qtyReceived: 100, uom: 'LTR', deliveryNote: 'DN-10122', matchedValue: 1200.0 },
      { id: 'grn-002', item: '2', purchaseOrder: 'PO 000504', grn: 'GRN-002', stockCode: 'A102', description: 'Interior Acrylic Paint - Cream', warehouse: 'E', qtyReceived: 50, uom: 'LTR', deliveryNote: 'DN-10122', matchedValue: 800.0 },
    ],
  },
  {
    id: 'inv-002',
    refNumber: '113',
    supplier: 'TechParts Global',
    invoiceNumber: '20045',
    invoiceDate: '2025-11-15',
    dueDate: '2025-12-15',
    netValue: 15750.0,
    currency: 'USD',
    agingDays: 103,
    status: 'approved',
    approvalStatus: 'Approved',
    approver1: 'Alan Brown',
    approver2: 'Jane Doe',
    approvalDate1: '20/11/2025',
    approvalDate2: '22/11/2025',
    comment: 'verified',
    grnDetails: [
      { id: 'grn-003', item: '1', purchaseOrder: 'PO 000510', grn: 'GRN-003', stockCode: 'B201', description: 'Servo Motor 24V DC', warehouse: 'A', qtyReceived: 25, uom: 'EA', deliveryNote: 'DN-20045', matchedValue: 8750.0 },
      { id: 'grn-004', item: '2', purchaseOrder: 'PO 000510', grn: 'GRN-004', stockCode: 'B202', description: 'PLC Controller Unit', warehouse: 'A', qtyReceived: 10, uom: 'EA', deliveryNote: 'DN-20045', matchedValue: 7000.0 },
    ],
  },
  {
    id: 'inv-003',
    refNumber: '114',
    supplier: 'OfficeMax Supplies',
    invoiceNumber: '30089',
    invoiceDate: '2026-01-10',
    dueDate: '2026-02-10',
    netValue: 3200.0,
    currency: 'USD',
    agingDays: 46,
    status: 'overdue',
    approvalStatus: 'Overdue',
    approver1: 'SYSPRO Administrator',
    comment: 'follow up required',
    grnDetails: [
      { id: 'grn-005', item: '1', purchaseOrder: 'PO 000520', grn: 'GRN-005', stockCode: 'C301', description: 'A4 Copy Paper Reams', warehouse: 'C', qtyReceived: 200, uom: 'REAM', deliveryNote: 'DN-30089', matchedValue: 2400.0 },
    ],
  },
  {
    id: 'inv-004',
    refNumber: '115',
    supplier: 'Industrial Fasteners Co',
    invoiceNumber: '40156',
    invoiceDate: '2026-02-20',
    dueDate: '2026-03-20',
    netValue: 8900.0,
    currency: 'USD',
    agingDays: 8,
    status: 'pending',
    approvalStatus: 'Pending',
    grnDetails: [
      { id: 'grn-006', item: '1', purchaseOrder: 'PO 000525', grn: 'GRN-006', stockCode: 'D401', description: 'Stainless Steel Bolts M10', warehouse: 'B', qtyReceived: 5000, uom: 'EA', deliveryNote: 'DN-40156', matchedValue: 5500.0 },
      { id: 'grn-007', item: '2', purchaseOrder: 'PO 000525', grn: 'GRN-007', stockCode: 'D402', description: 'Hex Nuts M10 Grade 8', warehouse: 'B', qtyReceived: 5000, uom: 'EA', deliveryNote: 'DN-40156', matchedValue: 3400.0 },
    ],
  },
  {
    id: 'inv-005',
    refNumber: '116',
    supplier: 'Chemical Solutions Ltd',
    invoiceNumber: '50201',
    invoiceDate: '2026-03-01',
    dueDate: '2026-04-01',
    netValue: 22500.0,
    currency: 'KES',
    agingDays: 0,
    status: 'pending',
    approvalStatus: 'Pending',
    grnDetails: [
      { id: 'grn-008', item: '1', purchaseOrder: 'PO 000530', grn: 'GRN-008', stockCode: 'E501', description: 'Industrial Solvent Grade A', warehouse: 'D', qtyReceived: 500, uom: 'LTR', deliveryNote: 'DN-50201', matchedValue: 22500.0 },
    ],
  },
];

// ============================================
// Mock Payment Requests
// ============================================
export const mockPaymentRequests: PaymentRequest[] = [
  {
    id: 'pay-001',
    requestNumber: 'PR-2026-001',
    supplierCode: 'SUP-001',
    supplierName: 'Splash Paints',
    currency: 'USD',
    dueDate: '2026-04-15',
    category: 'Materials',
    amount: 2000.0,
    vatAmount: 320.0,
    totalAmount: 2320.0,
    reference: 'INV-10122',
    notes: 'Payment for Q1 paint supplies',
    status: 'pending',
    requestedBy: 'John Smith',
    requestDate: '2026-03-20',
    lineItems: [
      { id: 'pli-001', description: 'Exterior Latex Paint', account: '5000-01', amount: 1200.0, taxCode: 'VAT16', taxAmount: 192.0, total: 1392.0 },
      { id: 'pli-002', description: 'Interior Acrylic Paint', account: '5000-01', amount: 800.0, taxCode: 'VAT16', taxAmount: 128.0, total: 928.0 },
    ],
  },
  {
    id: 'pay-002',
    requestNumber: 'PR-2026-002',
    supplierCode: 'SUP-003',
    supplierName: 'TechParts Global',
    currency: 'USD',
    dueDate: '2026-04-01',
    category: 'Equipment',
    amount: 15750.0,
    vatAmount: 2520.0,
    totalAmount: 18270.0,
    reference: 'INV-20045',
    notes: 'Urgent — production line components',
    status: 'pending',
    requestedBy: 'Robert Chen',
    requestDate: '2026-03-18',
    lineItems: [
      { id: 'pli-003', description: 'Servo Motor 24V DC', account: '5100-02', amount: 8750.0, taxCode: 'VAT16', taxAmount: 1400.0, total: 10150.0 },
      { id: 'pli-004', description: 'PLC Controller Unit', account: '5100-02', amount: 7000.0, taxCode: 'VAT16', taxAmount: 1120.0, total: 8120.0 },
    ],
  },
  {
    id: 'pay-003',
    requestNumber: 'PR-2026-003',
    supplierCode: 'SUP-005',
    supplierName: 'OfficeMax Supplies',
    currency: 'USD',
    dueDate: '2026-03-30',
    category: 'Consumables',
    amount: 3200.0,
    vatAmount: 512.0,
    totalAmount: 3712.0,
    reference: 'INV-30089',
    notes: 'Office supplies — monthly order',
    status: 'approved',
    requestedBy: 'Sarah Williams',
    requestDate: '2026-03-15',
    lineItems: [
      { id: 'pli-005', description: 'A4 Copy Paper', account: '6200-01', amount: 2400.0, taxCode: 'VAT16', taxAmount: 384.0, total: 2784.0 },
      { id: 'pli-006', description: 'Toner Cartridges', account: '6200-01', amount: 800.0, taxCode: 'VAT16', taxAmount: 128.0, total: 928.0 },
    ],
  },
];

export const mockPaymentApprovalQueue: PaymentApprovalItem[] = [
  { id: 'paq-001', requestNumber: 'PR-2026-001', supplier: 'Splash Paints', amount: 2320.0, currency: 'USD', requestDate: '2026-03-20', dueDate: '2026-04-15', category: 'Materials', status: 'pending', requestedBy: 'John Smith', priority: 'medium' },
  { id: 'paq-002', requestNumber: 'PR-2026-002', supplier: 'TechParts Global', amount: 18270.0, currency: 'USD', requestDate: '2026-03-18', dueDate: '2026-04-01', category: 'Equipment', status: 'pending', requestedBy: 'Robert Chen', priority: 'high' },
  { id: 'paq-003', requestNumber: 'PR-2026-004', supplier: 'Industrial Fasteners Co', amount: 10324.0, currency: 'USD', requestDate: '2026-03-22', dueDate: '2026-04-22', category: 'Materials', status: 'pending', requestedBy: 'Michael Ochieng', priority: 'low' },
  { id: 'paq-004', requestNumber: 'PR-2026-005', supplier: 'Chemical Solutions Ltd', amount: 26100.0, currency: 'KES', requestDate: '2026-03-25', dueDate: '2026-04-25', category: 'Chemicals', status: 'pending', requestedBy: 'Amanda Torres', priority: 'high' },
];

// ============================================
// Mock Sales Orders
// ============================================
export const mockSalesOrders: SalesOrder[] = [
  {
    id: 'so-001',
    salesOrderNumber: '000000000001140',
    customerName: 'Bikes & Blades - North',
    orderStatus: 'S',
    creditLimit: 15000,
    currentBalance: 970049,
    availableBalance: -955049,
    customerPONumber: '12QW',
    orderDate: '11 Apr 2020',
    registrationDate: '11 Apr 2020',
    salesperson: 'Tony Dean',
    isCreditBreached: true,
    lineDetails: [
      { id: 'sld-001', salesOrder: '000000000001140', line: 1, stockCode: 'A101', description: '15 Speed Mountain Bike Girls', warehouse: 'E', uom: 'EA', orderQty: 8, unitPrice: 560, lineValue: 4480 },
    ],
    overdueInvoices: [
      { id: 'oi-001', invoiceNumber: 'INV-8891', invoiceDate: '2020-01-15', dueDate: '2020-02-15', amount: 12500, balance: 12500, agingDays: 2233 },
      { id: 'oi-002', invoiceNumber: 'INV-8750', invoiceDate: '2019-11-20', dueDate: '2019-12-20', amount: 8400, balance: 8400, agingDays: 2290 },
    ],
    paymentAging: [
      { id: 'pa-001', period: 'Current', amount: 0, percentage: 0 },
      { id: 'pa-002', period: '30 Days', amount: 0, percentage: 0 },
      { id: 'pa-003', period: '60 Days', amount: 0, percentage: 0 },
      { id: 'pa-004', period: '90 Days', amount: 0, percentage: 0 },
      { id: 'pa-005', period: '120+ Days', amount: 970049, percentage: 100 },
    ],
  },
  {
    id: 'so-002',
    salesOrderNumber: '000000000001141',
    customerName: 'SportGear East',
    orderStatus: 'S',
    creditLimit: 50000,
    currentBalance: 32000,
    availableBalance: 18000,
    customerPONumber: '45RT',
    orderDate: '15 Mar 2026',
    registrationDate: '15 Mar 2026',
    salesperson: 'Jane Wilson',
    isCreditBreached: false,
    lineDetails: [
      { id: 'sld-002', salesOrder: '000000000001141', line: 1, stockCode: 'B205', description: 'Professional Tennis Racket', warehouse: 'A', uom: 'EA', orderQty: 50, unitPrice: 120, lineValue: 6000 },
      { id: 'sld-003', salesOrder: '000000000001141', line: 2, stockCode: 'B206', description: 'Tennis Ball Pack (12)', warehouse: 'A', uom: 'PKT', orderQty: 200, unitPrice: 15, lineValue: 3000 },
    ],
    overdueInvoices: [],
    paymentAging: [
      { id: 'pa-006', period: 'Current', amount: 12000, percentage: 37.5 },
      { id: 'pa-007', period: '30 Days', amount: 10000, percentage: 31.3 },
      { id: 'pa-008', period: '60 Days', amount: 10000, percentage: 31.2 },
      { id: 'pa-009', period: '90 Days', amount: 0, percentage: 0 },
      { id: 'pa-010', period: '120+ Days', amount: 0, percentage: 0 },
    ],
  },
  {
    id: 'so-003',
    salesOrderNumber: '000000000001142',
    customerName: 'Adventure Outfitters',
    orderStatus: 'S',
    creditLimit: 25000,
    currentBalance: 28500,
    availableBalance: -3500,
    customerPONumber: '78YU',
    orderDate: '20 Mar 2026',
    registrationDate: '20 Mar 2026',
    salesperson: 'Tony Dean',
    isCreditBreached: true,
    lineDetails: [
      { id: 'sld-004', salesOrder: '000000000001142', line: 1, stockCode: 'C310', description: 'Camping Tent 4-Person', warehouse: 'C', uom: 'EA', orderQty: 15, unitPrice: 350, lineValue: 5250 },
    ],
    overdueInvoices: [
      { id: 'oi-003', invoiceNumber: 'INV-9102', invoiceDate: '2026-01-10', dueDate: '2026-02-10', amount: 5600, balance: 3500, agingDays: 46 },
    ],
    paymentAging: [
      { id: 'pa-011', period: 'Current', amount: 5000, percentage: 17.5 },
      { id: 'pa-012', period: '30 Days', amount: 8500, percentage: 29.8 },
      { id: 'pa-013', period: '60 Days', amount: 10000, percentage: 35.1 },
      { id: 'pa-014', period: '90 Days', amount: 5000, percentage: 17.5 },
      { id: 'pa-015', period: '120+ Days', amount: 0, percentage: 0 },
    ],
  },
];

// ============================================
// Mock Master Data Requests
// ============================================
export const mockMasterDataRequests: MasterDataRequest[] = [
  { id: 1, entityType: 'Supplier', entityName: 'Keya & Sons Ltd', taxVatNumber: 'PS13465456X', submittedDate: '31 Jan 2026', documents: ['pdf', 'doc', 'xls', 'img'], workflowLevel: 'Queue: Lv 1', status: 'pending', currency: 'KES', address: 'Industrial Area, Mombasa Rd, Nairobi', onboardingType: 'Supplier' },
  { id: 2, entityType: 'Customer', entityName: 'Keya & Daughters Ltd', taxVatNumber: 'PS15555456X', submittedDate: '31 Jan 2026', documents: ['pdf', 'doc'], workflowLevel: 'Queue: Lv 1', status: 'pending', currency: 'KES', address: 'Westlands, Waiyaki Way, Nairobi', onboardingType: 'Customer' },
  { id: 3, entityType: 'Supplier', entityName: 'Amara Ltd', taxVatNumber: 'P3455334Z', submittedDate: '31 Jan 2026', documents: ['pdf'], workflowLevel: 'Queue: Lv 1', status: 'pending', currency: 'USD', address: 'Plot 45, Industrial Park, Kampala', onboardingType: 'Supplier' },
  { id: 4, entityType: 'Customer', entityName: 'Best Deals Limited', taxVatNumber: 'PS13465456X', submittedDate: '15 Feb 2026', documents: ['pdf', 'img'], workflowLevel: 'Queue: Lv 2', status: 'approved', currency: 'KES', address: 'Corner House, 5th floor, Kimathi Street, Nairobi.', onboardingType: 'Customer' },
];

// ============================================
// Mock Finance Report Entries
// ============================================
export const mockFinanceReportEntries: FinanceReportEntry[] = [
  { id: 'fr-001', refNumber: '112', approved: false, supplier: 'Splash Paints', invoiceNumber: '10122', netValue: 2000, dueDate: '27-Mar-2016', agingDays: 3562, approver1: 'SYSPRO Administrator', comment: 'approved', approvalDate: '12/08/2025', hasFiles: true },
  { id: 'fr-002', refNumber: '113', approved: true, supplier: 'TechParts Global', invoiceNumber: '20045', netValue: 15750, dueDate: '15-Dec-2025', agingDays: 103, approver1: 'Alan Brown', approver2: 'Jane Doe', comment: 'verified', approvalDate: '20/11/2025', hasFiles: true },
  { id: 'fr-003', refNumber: '114', approved: false, supplier: 'OfficeMax Supplies', invoiceNumber: '30089', netValue: 3200, dueDate: '10-Feb-2026', agingDays: 46, approver1: 'SYSPRO Administrator', comment: 'follow up', approvalDate: '', hasFiles: false },
  { id: 'fr-004', refNumber: '115', approved: true, supplier: 'Industrial Fasteners Co', invoiceNumber: '40156', netValue: 8900, dueDate: '20-Mar-2026', agingDays: 8, approver1: 'Alan Brown', comment: 'approved', approvalDate: '25/03/2026', hasFiles: true },
  { id: 'fr-005', refNumber: '116', approved: false, supplier: 'Chemical Solutions Ltd', invoiceNumber: '50201', netValue: 22500, dueDate: '01-Apr-2026', agingDays: 0, approver1: '', comment: '', approvalDate: '', hasFiles: false },
];

// ============================================
// Mock Audit Trail Entries
// ============================================
export const mockAuditTrailEntries: AuditTrailEntry[] = [
  { id: 'at-001', poNumber: 'PO 000504', status: 'Comment', statusLabel: 'Comment', supplier: 'Supplier', entryDate: '12/03/2024', value: 1300.00, currency: 'USD', approvalStatus: 'Approved', approver1: 'Alan Brown', approvalDate1: '20/03/2024', hasFiles: true },
  { id: 'at-002', poNumber: 'PO 000504', status: 'Comment', statusLabel: 'Comment', supplier: 'Supplier', entryDate: '18/03/2024', value: 1250.00, currency: 'USD', approvalStatus: 'Approved', approver1: 'Alan Brown', approver2: 'Alan Brown', approvalDate1: '20/03/2024', hasFiles: true },
  { id: 'at-003', poNumber: 'PO 000502', status: 'Comment', statusLabel: 'Comment', supplier: 'Supplier', entryDate: '17/03/2024', value: 1500.00, currency: 'USD', approvalStatus: 'Approved', approver1: 'Alan Brown', approvalDate1: '20/03/2024', hasFiles: true },
  { id: 'at-004', poNumber: 'PO 000502', status: 'Comment', statusLabel: 'Comment', supplier: 'Supplier', entryDate: '19/03/2024', value: 1000.00, currency: 'USD', approvalStatus: 'Approved', approver1: 'Alan Brown', approvalDate1: '20/03/2024', hasFiles: true },
  { id: 'at-005', poNumber: 'PO 000501', status: 'Comment', statusLabel: 'Comment', supplier: 'Supplier', entryDate: '19/03/2024', value: 450.00, currency: 'USD', approvalStatus: 'Approved', approver1: 'Alan Brown', approvalDate1: '20/03/2024', hasFiles: true },
];

// ============================================
// Mock Attachments
// ============================================
export const mockAttachments: Attachment[] = [
  { id: 'att-001', fileName: 'Purchase_Order_512.pdf', fileSize: '245 KB', fileType: 'pdf', uploadDate: '2025-05-14', uploadedBy: 'John Smith' },
  { id: 'att-002', fileName: 'Supplier_Quote_Q2025.pdf', fileSize: '180 KB', fileType: 'pdf', uploadDate: '2025-05-13', uploadedBy: 'Jane Doe' },
  { id: 'att-003', fileName: 'Technical_Spec_PCB-X500.xlsx', fileSize: '420 KB', fileType: 'xlsx', uploadDate: '2025-05-12', uploadedBy: 'Robert Chen' },
  { id: 'att-004', fileName: 'Delivery_Note_DN10122.jpg', fileSize: '1.2 MB', fileType: 'jpg', uploadDate: '2025-12-01', uploadedBy: 'Sarah Williams' },
];
