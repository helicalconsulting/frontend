/**
 * React Query Hooks for Sales Orders
 * All mutations include toast notifications
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as salesService from '@/services/salesService';
import { queryKeys } from '@/lib/queryClient';
import { useApiToast } from './useApiToast';
import type { 
  GetOrdersParams, 
  ApproveOrderData, 
  RejectOrderData,
  ApproveCreditOverrideData 
} from '@/services/salesService';

/**
 * Sales orders list query
 */
export function useSalesOrders(params?: GetOrdersParams) {
  return useQuery({
    queryKey: queryKeys.sales.orders(params),
    queryFn: () => salesService.getOrders(params),
    staleTime: 30 * 1000,
  });
}

/**
 * Single sales order query
 */
export function useSalesOrder(orderNumber: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.sales.order(orderNumber),
    queryFn: () => salesService.getOrder(orderNumber),
    enabled,
  });
}

/**
 * Credit overrides list query
 */
export function useCreditOverrides(status?: string) {
  return useQuery({
    queryKey: queryKeys.sales.creditOverrides({ status }),
    queryFn: () => salesService.getCreditOverrides(status),
    staleTime: 30 * 1000,
  });
}

/**
 * Approve sales order mutation
 */
export function useApproveSalesOrder() {
  const queryClient = useQueryClient();
  const { showSuccess, handleError } = useApiToast();

  return useMutation({
    mutationFn: ({ orderNumber, data }: { orderNumber: string; data: ApproveOrderData }) =>
      salesService.approveOrder(orderNumber, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.order(variables.orderNumber) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.pending });
      showSuccess('Order Approved', 'Sales order approved successfully');
    },
    onError: (error) => {
      handleError(error, 'Approve Order Failed');
    },
  });
}

/**
 * Reject sales order mutation
 */
export function useRejectSalesOrder() {
  const queryClient = useQueryClient();
  const { showSuccess, handleError } = useApiToast();

  return useMutation({
    mutationFn: ({ orderNumber, data }: { orderNumber: string; data: RejectOrderData }) =>
      salesService.rejectOrder(orderNumber, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.order(variables.orderNumber) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.pending });
      showSuccess('Order Rejected', 'Sales order rejected');
    },
    onError: (error) => {
      handleError(error, 'Reject Order Failed');
    },
  });
}

/**
 * Approve credit override mutation
 */
export function useApproveCreditOverride() {
  const queryClient = useQueryClient();
  const { showSuccess, handleError } = useApiToast();

  return useMutation({
    mutationFn: ({ overrideId, data }: { overrideId: number; data: ApproveCreditOverrideData }) =>
      salesService.approveCreditOverride(overrideId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.creditOverrides() });
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all });
      showSuccess('Credit Override Approved', 'Credit limit override approved successfully');
    },
    onError: (error) => {
      handleError(error, 'Approve Credit Override Failed');
    },
  });
}
