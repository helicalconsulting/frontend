/**
 * React Query Hooks for Accounts Payable
 * All mutations include toast notifications
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as apService from '@/services/apService';
import { queryKeys } from '@/lib/queryClient';
import { useApiToast } from './useApiToast';
import type { GetInvoicesParams, ApproveInvoiceData, RejectInvoiceData } from '@/services/apService';

/**
 * AP Invoices list query
 */
export function useAPInvoices(params?: GetInvoicesParams) {
  return useQuery({
    queryKey: queryKeys.ap.invoices(params),
    queryFn: () => apService.getInvoices(params),
    staleTime: 30 * 1000,
  });
}

/**
 * Single AP invoice query
 */
export function useAPInvoice(invoiceNumber: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.ap.invoice(invoiceNumber),
    queryFn: () => apService.getInvoice(invoiceNumber),
    enabled,
  });
}

/**
 * AP invoice approval history
 */
export function useAPInvoiceHistory(invoiceNumber: string) {
  return useQuery({
    queryKey: queryKeys.ap.approvalStatus(invoiceNumber),
    queryFn: () => apService.getInvoiceHistory(invoiceNumber),
  });
}

/**
 * Approve AP invoice mutation
 */
export function useApproveAPInvoice() {
  const queryClient = useQueryClient();
  const { showSuccess, handleError } = useApiToast();

  return useMutation({
    mutationFn: ({ invoiceNumber, data }: { invoiceNumber: string; data: ApproveInvoiceData }) =>
      apService.approveInvoice(invoiceNumber, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ap.invoice(variables.invoiceNumber) });
      queryClient.invalidateQueries({ queryKey: queryKeys.ap.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.pending });
      showSuccess('Invoice Approved', 'AP invoice approved successfully');
    },
    onError: (error) => {
      handleError(error, 'Approve Invoice Failed');
    },
  });
}

/**
 * Reject AP invoice mutation
 */
export function useRejectAPInvoice() {
  const queryClient = useQueryClient();
  const { showSuccess, handleError } = useApiToast();

  return useMutation({
    mutationFn: ({ invoiceNumber, data }: { invoiceNumber: string; data: RejectInvoiceData }) =>
      apService.rejectInvoice(invoiceNumber, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ap.invoice(variables.invoiceNumber) });
      queryClient.invalidateQueries({ queryKey: queryKeys.ap.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.pending });
      showSuccess('Invoice Rejected', 'AP invoice rejected');
    },
    onError: (error) => {
      handleError(error, 'Reject Invoice Failed');
    },
  });
}
