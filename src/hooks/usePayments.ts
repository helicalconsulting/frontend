/**
 * React Query Hooks for Payments
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as paymentService from '@/services/paymentService';
import { queryKeys } from '@/lib/queryClient';
import type { CreatePaymentInput } from '@/services/paymentService';

/**
 * Payment requests list query
 */
export function usePaymentRequests(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: queryKeys.payments.list(params),
    queryFn: () => paymentService.getPaymentRequests(params),
    staleTime: 30 * 1000,
  });
}

/**
 * Single payment request query
 */
export function usePaymentRequest(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.payments.detail(id),
    queryFn: () => paymentService.getPaymentRequest(id),
    enabled,
  });
}

/**
 * Payment approval status query
 */
export function usePaymentApprovalStatus(id: number) {
  return useQuery({
    queryKey: queryKeys.payments.approvalStatus(id),
    queryFn: () => paymentService.getPaymentApprovalStatus(id),
  });
}

/**
 * Create payment request mutation
 */
export function useCreatePayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePaymentInput) => paymentService.createPaymentRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
  });
}

/**
 * Update payment request mutation
 */
export function useUpdatePayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreatePaymentInput> }) =>
      paymentService.updatePaymentRequest(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
  });
}

/**
 * Submit payment request mutation
 */
export function useSubmitPayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => paymentService.submitPaymentRequest(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.pending });
    },
  });
}

/**
 * Approve payment request mutation
 */
export function useApprovePayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { comment?: string; signature?: string } }) =>
      paymentService.approvePaymentRequest(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.pending });
    },
  });
}

/**
 * Reject payment request mutation
 */
export function useRejectPayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { comment: string } }) =>
      paymentService.rejectPaymentRequest(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.pending });
    },
  });
}

/**
 * Delete payment request mutation
 */
export function useDeletePayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => paymentService.deletePaymentRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
  });
}
