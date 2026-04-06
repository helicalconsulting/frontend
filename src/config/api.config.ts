/**
 * API Configuration
 * Central configuration for API integration
 */

export const API_CONFIG = {
  // Base URL - can be overridden by environment variable
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  
  // Timeouts
  TIMEOUT: 15000,
  UPLOAD_TIMEOUT: 60000,
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  
  // Token storage keys
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_KEY: 'auth_user',
  
  // Feature flags
  USE_MOCK: import.meta.env.VITE_USE_MOCK === 'true' || false,
  
  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      PROFILE: '/auth/profile',
      CHANGE_PASSWORD: '/auth/change-password',
    },
    DASHBOARD: {
      KPIS: '/dashboard/kpis',
      TRENDS: '/dashboard/trends',
      BREAKDOWN: '/dashboard/breakdown',
      PENDING: '/dashboard/pending',
      ACTIVITY: '/dashboard/activity',
    },
    PAYMENTS: {
      BASE: '/payments',
      APPROVE: (id: string) => `/payments/${id}/approve`,
      REJECT: (id: string) => `/payments/${id}/reject`,
      HISTORY: (id: string) => `/payments/${id}/history`,
    },
    AP: {
      BASE: '/ap',
      INVOICES: '/ap/invoices',
      INVOICE_DETAIL: (id: string) => `/ap/invoices/${id}`,
      APPROVE: (id: string) => `/ap/invoices/${id}/approve`,
      REJECT: (id: string) => `/ap/invoices/${id}/reject`,
      HISTORY: (id: string) => `/ap/invoices/${id}/history`,
    },
    PO: {
      BASE: '/po',
      PENDING: '/po/pending',
      DETAIL: (poNumber: string) => `/po/${poNumber}`,
      APPROVE: (poNumber: string) => `/po/${poNumber}/approve`,
      REJECT: (poNumber: string) => `/po/${poNumber}/reject`,
      HISTORY: (poNumber: string) => `/po/${poNumber}/history`,
    },
    SALES: {
      BASE: '/sales',
      CREDIT_OVERRIDES: '/sales/credit-overrides',
      ORDER_DETAIL: (orderNumber: string) => `/sales/${orderNumber}`,
      APPROVE: (orderNumber: string) => `/sales/${orderNumber}/approve`,
      REJECT: (orderNumber: string) => `/sales/${orderNumber}/reject`,
      PRICE_OVERRIDE: '/sales/price-override',
    },
    ONBOARDING: {
      BASE: '/onboarding',
      DETAIL: (id: string) => `/onboarding/${id}`,
      APPROVAL_STATUS: (id: string) => `/onboarding/${id}/approval-status`,
      SUBMIT: (id: string) => `/onboarding/${id}/submit`,
      APPROVE: (id: string) => `/onboarding/${id}/approve`,
      REJECT: (id: string) => `/onboarding/${id}/reject`,
    },
    REPORTS: {
      APPROVALS: '/reports/approvals',
      ACTIVITY: '/reports/activity',
      STATISTICS: '/reports/statistics',
      EXPORT_EXCEL: '/reports/export/excel',
      EXPORT_PDF: '/reports/export/pdf',
    },
    ADMIN: {
      USERS: '/admin/users',
      USER_DETAIL: (id: string) => `/admin/users/${id}`,
      USER_STATUS: (id: string) => `/admin/users/${id}/status`,
      USER_ROLES: (id: string) => `/admin/users/${id}/roles`,
      ROLES: '/admin/roles',
      PERMISSIONS: '/admin/permissions',
      ROLE_PERMISSIONS: (roleId: string) => `/admin/roles/${roleId}/permissions`,
      APPROVAL_LEVELS: '/admin/approval-levels',
      APPROVAL_LEVEL_DETAIL: (id: string) => `/admin/approval-levels/${id}`,
      APPROVAL_LEVEL_REORDER: '/admin/approval-levels/reorder',
      APPROVAL_MODULES: '/admin/approval-levels/modules',
      SETTINGS: '/admin/settings',
    },
  },
} as const;

export default API_CONFIG;
