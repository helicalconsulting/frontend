import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  usePurchaseOrders,
  useApproveOrder,
  useRejectOrder,
} from '@/hooks/usePurchaseOrders';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { PurchaseOrder } from '@/types';
import {
  Search,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  FileText,
  Filter,
  Loader2,
  Package,
} from 'lucide-react';

const priorityVariants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  low: 'default',
  medium: 'info',
  high: 'warning',
  critical: 'danger',
};

const statusVariants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
};

export function PurchaseOrdersPage() {
  const { data, isLoading } = usePurchaseOrders();
  const approveOrder = useApproveOrder();
  const rejectOrder = useRejectOrder();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<PurchaseOrder | null>(null);

  const filteredOrders = useMemo(() => {
    if (!data?.orders) return [];
    return data.orders.filter((order) => {
      const matchesSearch =
        !searchQuery ||
        order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data?.orders, searchQuery, statusFilter]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === filteredOrders.length && filteredOrders.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredOrders.filter(o => o.status === 'pending').map(o => o.id)));
    }
  };

  const handleApprove = (orderId: string) => {
    approveOrder.mutate({ orderId, action: 'approve' });
  };

  const handleReject = (orderId: string) => {
    rejectOrder.mutate({ orderId, action: 'reject' });
  };

  const handleBulkApprove = () => {
    selectedRows.forEach((id) => {
      approveOrder.mutate({ orderId: id, action: 'approve' });
    });
    setSelectedRows(new Set());
  };

  const handleBulkReject = () => {
    selectedRows.forEach((id) => {
      rejectOrder.mutate({ orderId: id, action: 'reject' });
    });
    setSelectedRows(new Set());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Purchase Order Approval"
        subtitle="Review and authorize pending purchase requests"
      />

      <div className="p-6 space-y-4">
        {/* Top toolbar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1 w-full">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search-orders"
                placeholder="PO Number or Supplier Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Summary & Bulk Actions */}
          <div className="flex items-center gap-3">
            {data && (
              <div className="flex items-center gap-4 mr-4">
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700">
                    Pending: {data.pendingCount}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
                  <span className="text-xs font-semibold text-emerald-700">
                    {Object.entries(data.totalValue)
                      .map(([curr, val]) => formatCurrency(val, curr))
                      .join(' | ')}
                  </span>
                </div>
              </div>
            )}

            {selectedRows.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">
                  {selectedRows.size} selected
                </span>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleBulkReject}
                >
                  Return Request
                </Button>
                <Button
                  size="sm"
                  variant="success"
                  onClick={handleBulkApprove}
                >
                  Approve Orders
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider w-10">
                    <input
                      type="checkbox"
                      checked={selectedRows.size > 0 && selectedRows.size === filteredOrders.filter(o => o.status === 'pending').length}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      title="Select All"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider w-10">
                    {' '}
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    PO Number
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    Exchange Rate
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    PO Value
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading
                  ? Array(5)
                      .fill(null)
                      .map((_, i) => (
                        <tr key={i}>
                          {Array(10)
                            .fill(null)
                            .map((_, j) => (
                              <td key={j} className="px-4 py-4">
                                <Skeleton className="h-4 w-full" />
                              </td>
                            ))}
                        </tr>
                      ))
                  : filteredOrders.map((order) => (
                      <OrderRow
                        key={order.id}
                        order={order}
                        isExpanded={expandedRows.has(order.id)}
                        isSelected={selectedRows.has(order.id)}
                        onToggleExpand={() => toggleRow(order.id)}
                        onToggleSelect={() => toggleSelect(order.id)}
                        onApprove={() => handleApprove(order.id)}
                        onReject={() => handleReject(order.id)}
                        isApproving={approveOrder.isPending}
                        isRejecting={rejectOrder.isPending}
                        onShowDetails={() => setSelectedOrderDetails(order)}
                      />
                    ))}
              </tbody>
            </table>
          </div>

          {!isLoading && filteredOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FileText className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No purchase orders found</p>
              <p className="text-xs mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>

      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">PO Details: {selectedOrderDetails.poNumber}</h3>
              <button onClick={() => setSelectedOrderDetails(null)} className="text-gray-400 hover:text-gray-500">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Supplier</p>
                  <p className="font-medium text-gray-900 mt-1">{selectedOrderDetails.supplier}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Order Date</p>
                  <p className="font-medium text-gray-900 mt-1">{formatDate(selectedOrderDetails.orderDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Total Value</p>
                  <p className="font-medium text-gray-900 mt-1">{formatCurrency(selectedOrderDetails.amount, selectedOrderDetails.currency)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                  <Badge variant={statusVariants[selectedOrderDetails.status]} className="mt-1">
                    {selectedOrderDetails.status.charAt(0).toUpperCase() + selectedOrderDetails.status.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Line</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Description</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Qty</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Price</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedOrderDetails.lineItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-gray-700">{item.lineNumber}</td>
                        <td className="px-4 py-2 text-gray-900 font-medium">{item.description}</td>
                        <td className="px-4 py-2 text-right text-gray-700">{item.quantity.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right text-gray-700">{item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="px-4 py-2 text-right font-semibold text-gray-900">{item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 items-center">
              <Button variant="ghost" onClick={() => setSelectedOrderDetails(null)} className="mr-auto">
                Close
              </Button>
              {selectedOrderDetails.status === 'pending' && (
                <>
                  <Button variant="destructive" onClick={() => { handleReject(selectedOrderDetails.id); setSelectedOrderDetails(null); }}>
                    Reject
                  </Button>
                  <Button variant="success" onClick={() => { handleApprove(selectedOrderDetails.id); setSelectedOrderDetails(null); }}>
                    Approve
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Order Row Component
// ============================================
interface OrderRowProps {
  order: PurchaseOrder;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpand: () => void;
  onToggleSelect: () => void;
  onApprove: () => void;
  onReject: () => void;
  isApproving: boolean;
  isRejecting: boolean;
  onShowDetails: () => void;
}

function OrderRow({
  order,
  isExpanded,
  isSelected,
  onToggleExpand,
  onToggleSelect,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
  onShowDetails,
}: OrderRowProps) {
  return (
    <>
      <tr
        className={`transition-colors duration-150 ${
          isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50/80'
        }`}
      >
        <td className="px-4 py-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            disabled={order.status !== 'pending'}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-30"
          />
        </td>
        <td className="px-4 py-3">
          <button
            onClick={onToggleExpand}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onShowDetails}
              className="inline-flex items-center px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 rounded-md font-medium text-sm transition-all shadow-sm border border-blue-200/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              title="View PO Details"
            >
              <span className="font-mono tracking-tight">{order.poNumber}</span>
            </button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-xs text-gray-500 hover:text-gray-700"
            >
              <FileText className="h-3.5 w-3.5 mr-1.5" /> Files
            </Button>
          </div>
        </td>
        <td className="px-4 py-3">
          <div>
            <p className="font-medium text-gray-900">{order.supplier}</p>
          </div>
        </td>
        <td className="px-4 py-3 text-gray-600">{formatDate(order.orderDate)}</td>
        <td className="px-4 py-3 text-gray-600">{formatDate(order.dueDate)}</td>
        <td className="px-4 py-3 text-right text-gray-600 font-mono text-xs">
          {order.exchangeRate.toFixed(6)}
        </td>
        <td className="px-4 py-3 text-right">
          <span className="font-semibold text-gray-900">
            {formatCurrency(order.amount, order.currency)}
          </span>
        </td>
        <td className="px-4 py-3 text-center">
          <Badge variant={priorityVariants[order.priority]}>
            {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
          </Badge>
        </td>
        <td className="px-4 py-3 text-center">
          <Badge variant={statusVariants[order.status]}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </td>
      </tr>

      {/* Expanded line items */}
      {isExpanded && (
        <tr>
          <td colSpan={10} className="bg-slate-50/80 px-4 py-0">
            <div className="py-4 pl-10">
              <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order Line Details
                  </h4>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                        PO #
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                        Line
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                        Description
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">
                        Qty
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">
                        UOM
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">
                        Price
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {order.lineItems.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        <td className="px-4 py-2.5 text-gray-700 font-mono text-xs">
                          {item.poNumber}
                        </td>
                        <td className="px-4 py-2.5 text-gray-700">
                          {item.lineNumber}
                        </td>
                        <td className="px-4 py-2.5 text-gray-900 font-medium">
                          {item.description}
                        </td>
                        <td className="px-4 py-2.5 text-right text-gray-700 font-mono">
                          {item.quantity.toLocaleString()}
                        </td>
                        <td className="px-4 py-2.5 text-center text-gray-500 text-xs">
                          {item.uom}
                        </td>
                        <td className="px-4 py-2.5 text-right text-gray-700 font-mono">
                          {item.unitPrice.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-2.5 text-right font-semibold text-gray-900 font-mono">
                          {item.total.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-200 bg-gray-50/50">
                      <td
                        colSpan={6}
                        className="px-4 py-2.5 text-right text-xs font-semibold text-gray-600 uppercase"
                      >
                        Total
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-gray-900 font-mono">
                        {formatCurrency(order.amount, order.currency)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                <span>Requested by: <span className="font-medium text-gray-600">{order.requestedBy}</span></span>
                <span>•</span>
                <span>Department: <span className="font-medium text-gray-600">{order.department}</span></span>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
