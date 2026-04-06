/**
 * React Query Configuration
 * Setup for API data fetching and caching
 */

import { QueryClient } from '@tanstack/react-query';
import { handleApiError } from './errorHandler';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time - data considered fresh for 30 seconds
      staleTime: 30 * 1000,
      
      // Cache time - unused data kept in cache for 5 minutes
      gcTime: 5 * 60 * 1000,
      
      // Retry failed requests
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        const apiError = handleApiError(error);
        if (apiError.status && apiError.status >= 400 && apiError.status < 500) {
          return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus (can be disabled per query)
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});

// Query keys for consistent cache management
export const queryKeys = {
  // Auth
  auth: {
    profile: ['auth', 'profile'] as const,
  },
  
  // Dashboard
  dashboard: {
    kpis: ['dashboard', 'kpis'] as const,
    trends: ['dashboard', 'trends'] as const,
    breakdown: ['dashboard', 'breakdown'] as const,
    pending: ['dashboard', 'pending'] as const,
    activity: ['dashboard', 'activity'] as const,
  },
  
  // Payments
  payments: {
    all: ['payments'] as const,
    list: (params?: any) => ['payments', 'list', params] as const,
    detail: (id: number) => ['payments', 'detail', id] as const,
    approvalStatus: (id: number) => ['payments', 'approval-status', id] as const,
  },
  
  // AP (Accounts Payable)
  ap: {
    all: ['ap'] as const,
    invoices: (params?: any) => ['ap', 'invoices', params] as const,
    invoice: (id: string) => ['ap', 'invoice', id] as const,
    approvalStatus: (id: string) => ['ap', 'approval-status', id] as const,
  },
  
  // PO (Purchase Orders)
  po: {
    all: ['po'] as const,
    pending: (params?: any) => ['po', 'pending', params] as const,
    detail: (poNumber: string) => ['po', 'detail', poNumber] as const,
    history: (poNumber: string) => ['po', 'history', poNumber] as const,
  },
  
  // Sales
  sales: {
    all: ['sales'] as const,
    orders: (params?: any) => ['sales', 'orders', params] as const,
    order: (orderNumber: string) => ['sales', 'order', orderNumber] as const,
    creditOverrides: (params?: any) => ['sales', 'credit-overrides', params] as const,
  },
  
  // Onboarding
  onboarding: {
    all: ['onboarding'] as const,
    requests: (params?: any) => ['onboarding', 'requests', params] as const,
    request: (id: string) => ['onboarding', 'request', id] as const,
    approvalStatus: (id: string) => ['onboarding', 'approval-status', id] as const,
  },
  
  // Reports
  reports: {
    approvals: (params?: any) => ['reports', 'approvals', params] as const,
    activity: (params?: any) => ['reports', 'activity', params] as const,
    statistics: (params?: any) => ['reports', 'statistics', params] as const,
  },
  
  // Admin
  admin: {
    users: (params?: any) => ['admin', 'users', params] as const,
    user: (id: string) => ['admin', 'user', id] as const,
    roles: ['admin', 'roles'] as const,
    permissions: ['admin', 'permissions'] as const,
    approvalLevels: (params?: any) => ['admin', 'approval-levels', params] as const,
    settings: ['admin', 'settings'] as const,
  },
};

export default queryClient;
