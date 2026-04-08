import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPurchaseOrders, approveOrder, rejectOrder } from '@/services/purchaseService';
import type { ApproveRejectRequest, PurchaseOrdersResponse } from '@/types';

export function usePurchaseOrders() {
  return useQuery<PurchaseOrdersResponse>({
    queryKey: ['purchaseOrders'],
    queryFn: () => getPurchaseOrders(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useApproveOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ApproveRejectRequest) => approveOrder(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useRejectOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ApproveRejectRequest) => rejectOrder(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
