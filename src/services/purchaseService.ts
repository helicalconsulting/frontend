import type { PurchaseOrdersResponse, ApproveRejectRequest, ApproveRejectResponse } from '@/types';
import { mockPurchaseOrders } from '@/mocks/data';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch all purchase orders.
 * Replace with: apiClient.get<PurchaseOrdersResponse>('/purchase-orders').then(r => r.data);
 */
export async function getPurchaseOrders(): Promise<PurchaseOrdersResponse> {
  await delay(900);
  return JSON.parse(JSON.stringify(mockPurchaseOrders)); // deep clone so mutations don't affect mock
}

/**
 * Approve a purchase order.
 * Replace with: apiClient.post<ApproveRejectResponse>('/approve-order', request).then(r => r.data);
 */
export async function approveOrder(request: ApproveRejectRequest): Promise<ApproveRejectResponse> {
  await delay(600);
  return {
    success: true,
    message: `Order ${request.orderId} has been approved.`,
    orderId: request.orderId,
    newStatus: 'approved',
  };
}

/**
 * Reject a purchase order.
 * Replace with: apiClient.post<ApproveRejectResponse>('/reject-order', request).then(r => r.data);
 */
export async function rejectOrder(request: ApproveRejectRequest): Promise<ApproveRejectResponse> {
  await delay(600);
  return {
    success: true,
    message: `Order ${request.orderId} has been rejected.`,
    orderId: request.orderId,
    newStatus: 'rejected',
  };
}
