import type { PurchaseOrdersResponse, ApproveRejectRequest, ApproveRejectResponse, PurchaseOrder } from '@/types';
import { mockPurchaseOrders } from '@/mocks/data';

/**
 * Mock — Fetch all pending purchase orders
 */
export async function getPurchaseOrders(): Promise<PurchaseOrdersResponse> {
  await new Promise((r) => setTimeout(r, 400));
  return mockPurchaseOrders;
}

/**
 * Mock — Get single PO details
 */
export async function getPurchaseOrderDetails(poNumber: string): Promise<PurchaseOrder> {
  await new Promise((r) => setTimeout(r, 300));
  const order = mockPurchaseOrders.orders.find((o) => o.poNumber === poNumber);
  if (!order) throw new Error('PO not found');
  return order;
}

/**
 * Mock — Approve a purchase order
 */
export async function approveOrder(request: ApproveRejectRequest): Promise<ApproveRejectResponse> {
  await new Promise((r) => setTimeout(r, 600));
  return {
    success: true,
    message: `Order ${request.orderId} approved successfully`,
    orderId: request.orderId,
    newStatus: 'approved',
  };
}

/**
 * Mock — Reject a purchase order
 */
export async function rejectOrder(request: ApproveRejectRequest): Promise<ApproveRejectResponse> {
  await new Promise((r) => setTimeout(r, 600));
  return {
    success: true,
    message: `Order ${request.orderId} rejected`,
    orderId: request.orderId,
    newStatus: 'rejected',
  };
}

/**
 * Mock — Get PO approval history
 */
export async function getPOHistory(poNumber: string) {
  await new Promise((r) => setTimeout(r, 300));
  return [];
}
