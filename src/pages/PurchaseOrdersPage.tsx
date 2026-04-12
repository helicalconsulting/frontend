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
  AlertTriangle,
  DollarSign,
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
const CURRENCIES = [
  { code: "KES", label: "Kenyan Shilling", flag: "🇰🇪", region: "africa" },
  { code: "NGN", label: "Nigerian Naira", flag: "🇳🇬", region: "africa" },
  { code: "ZAR", label: "South African Rand", flag: "🇿🇦", region: "africa" },

  { code: "USD", label: "US Dollar", flag: "🇺🇸", region: "global" },
  { code: "EUR", label: "Euro", flag: "🇪🇺", region: "global" },
  { code: "GBP", label: "British Pound", flag: "🇬🇧", region: "global" },
];

const EXCHANGE_RATES: Record<string, number> = {
  KES: 129.5,
  NGN: 1580,
  ZAR: 18.6,
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
};



export function PurchaseOrdersPage() {
  const { data, isLoading } = usePurchaseOrders();
  const approveOrder = useApproveOrder();
  const rejectOrder = useRejectOrder();
  const [displayCurrency, setDisplayCurrency] = useState("KES");
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<PurchaseOrder | null>(null);

  const convertedTotal = useMemo(() => {
    if (!data?.totalValue) return 0;

    return Object.entries(data.totalValue).reduce((sum, [curr, val]) => {
      const fromRate = EXCHANGE_RATES[curr];
      const toRate = EXCHANGE_RATES[displayCurrency];

      if (!fromRate || !toRate) return sum;

      const usd = val / fromRate;
      const converted = usd * toRate;

      return sum + converted;
    }, 0);
  }, [data?.totalValue, displayCurrency]);

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


  const pendingCount = filteredOrders.filter(o => o.status === 'pending').length;
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
    const pendingIds = filteredOrders
      .filter(o => o.status === 'pending')
      .map(o => o.id);

    if (selectedRows.size === pendingIds.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(pendingIds));
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Header
        title="Purchase Order Approval"
        subtitle="Review and authorize pending purchase requests"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-6">

        {/* Pending Orders */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Pending Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {data?.pendingCount || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Total Value */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
              <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Total Value</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {formatCurrency(convertedTotal, displayCurrency)}
              </p>
            </div>
          </div>
        </div>

        {/* High Priority */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">High Priority</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {filteredOrders.filter(o => o.priority === 'high' || o.priority === 'critical').length}
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="px-3 sm:px-6 pb-6 space-y-4">
        {/* Top toolbar */}
        <div className="flex flex-col gap-3">
          {/* Row 1: Search & Status Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">

  {/* LEFT SIDE */}
  <div className="flex flex-1 items-center gap-3 w-full">

    {/* Search */}
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder="PO Number or Supplier Name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 dark:text-white"
      />
    </div>

    {/* Status */}
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="h-10 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-gray-700 dark:text-gray-200"
    >
      <option value="all">All Status</option>
      <option value="pending">Pending</option>
      <option value="approved">Approved</option>
      <option value="rejected">Rejected</option>
    </select>

  </div>

  {/* RIGHT SIDE (FIXED) */}
  <div className="w-full sm:w-auto sm:ml-auto">
    <div className="relative w-full sm:w-[220px]">
      <select
        value={displayCurrency}
        onChange={(e) => setDisplayCurrency(e.target.value)}
        className="appearance-none w-full cursor-pointer rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 pr-8 text-sm font-medium text-gray-800 dark:text-gray-200"
      >
        {CURRENCIES.map(c => (
          <option key={c.code} value={c.code}>
            {c.code} — {c.label}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
    </div>
  </div>

          </div>
           {selectedRows.size > 0 && (
    <div className="flex items-center justify-end gap-3 w-full">

      <span className="text-sm text-gray-400 whitespace-nowrap">
        {selectedRows.size} selected
      </span>

      <Button
        size="sm"
        variant="success"
        onClick={handleBulkApprove}
        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4"
      >
        <CheckCircle2 className="h-4 w-4 mr-1" />
        Approve
      </Button>

      <Button
        size="sm"
        variant="destructive"
        onClick={handleBulkReject}
        className="rounded-full px-4"
      >
        <XCircle className="h-4 w-4 mr-1" />
        Reject
      </Button>

    </div>
  )}
        </div>

        {/* Desktop Table */}
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider w-10">
                    <input
                      type="checkbox"
                      checked={pendingCount > 0 && selectedRows.size === pendingCount}
                      onChange={toggleSelectAll}
                      className="h-4 w-4"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">PO Number</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Supplier</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Order Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Due Date</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500 text-xs uppercase tracking-wider">Exchange Rate</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500 text-xs uppercase tracking-wider">PO Value</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500 text-xs uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
                {isLoading
                  ? Array(5)
                    .fill(null)
                    .map((_, i) => (
                      <tr key={i}>
                        {Array(9)
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

          {/* Mobile Card List */}
          <div className="sm:hidden divide-y divide-gray-100 dark:divide-slate-800/60">
            {isLoading
              ? Array(4).fill(null).map((_, i) => (
                <div key={i} className="p-4 animate-pulse space-y-2">
                  <div className="h-4 w-32 rounded bg-gray-200 dark:bg-slate-800" />
                  <div className="h-3 w-48 rounded bg-gray-200 dark:bg-slate-800" />
                  <div className="h-3 w-24 rounded bg-gray-200 dark:bg-slate-800" />
                </div>
              ))
              : filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 space-y-3 ${selectedRows.has(order.id) ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(order.id)}
                        onChange={() => toggleSelect(order.id)}
                        disabled={order.status !== 'pending'}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 flex-shrink-0"
                      />
                      <button
                        onClick={() => setSelectedOrderDetails(order)}
                        className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-md border border-blue-200/50 dark:border-blue-800/50"
                      >
                        {order.poNumber}
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Badge variant={priorityVariants[order.priority]} className="text-[10px]">
                        {order.priority}
                      </Badge>
                      <Badge variant={statusVariants[order.status]} className="text-[10px]">
                        {order.status}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{order.supplier}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500 dark:text-slate-400">
                      <span>Order: {formatDate(order.orderDate)}</span>
                      <span>Due: {formatDate(order.dueDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(order.amount, order.currency)}
                    </span>
                    {order.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="destructive" onClick={() => handleReject(order.id)} className="h-8 px-3 text-xs">
                          Reject
                        </Button>
                        <Button size="sm" variant="success" onClick={() => handleApprove(order.id)} className="h-8 px-3 text-xs">
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {!isLoading && filteredOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-slate-500">
              <FileText className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No purchase orders found</p>
              <p className="text-xs mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>

      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in">
          <div className="bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in border border-gray-200 dark:border-slate-800">
            <div className="px-4 sm:px-6 py-4 flex items-center justify-between 
bg-gradient-to-r from-blue-600 to-indigo-600 
text-white flex-shrink-0">
              <h3 className="text-base sm:text-lg font-semibold text-white truncate">PO Details: {selectedOrderDetails.poNumber}</h3>
              <button onClick={() => setSelectedOrderDetails(null)} className="text-white/80 hover:text-white ml-2 flex-shrink-0">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">Supplier</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1 text-sm">{selectedOrderDetails.supplier}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">Order Date</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1 text-sm">{formatDate(selectedOrderDetails.orderDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">Total Value</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1 text-sm">{formatCurrency(selectedOrderDetails.amount, selectedOrderDetails.currency)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</p>
                  <Badge variant={statusVariants[selectedOrderDetails.status]} className="mt-1">
                    {selectedOrderDetails.status.charAt(0).toUpperCase() + selectedOrderDetails.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-slate-800/80">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-400">Line</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-400">Description</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 dark:text-slate-400">Qty</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 dark:text-slate-400">Price</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 dark:text-slate-400">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {selectedOrderDetails.lineItems.map((item) => (
                        <tr key={item.id} className="dark:bg-slate-900/50">
                          <td className="px-4 py-2 text-gray-700 dark:text-slate-300">{item.lineNumber}</td>
                          <td className="px-4 py-2 text-gray-900 dark:text-white font-medium">{item.description}</td>
                          <td className="px-4 py-2 text-right text-gray-700 dark:text-slate-300">{item.quantity.toLocaleString()}</td>
                          <td className="px-4 py-2 text-right text-gray-700 dark:text-slate-300">{item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td className="px-4 py-2 text-right font-semibold text-gray-900 dark:text-white">{item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3 items-center flex-shrink-0">
              <Button variant="ghost" onClick={() => setSelectedOrderDetails(null)} className="mr-auto dark:text-slate-200">
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
// Order Row Component (Desktop only)
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
        className={`transition-colors duration-150 text-gray-700 dark:text-slate-300 ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/20' : 'hover:bg-gray-50/80 dark:hover:bg-slate-800/50'
          }`}
      >
        <td className="px-4 py-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            disabled={order.status !== 'pending'}
            className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 disabled:opacity-30 dark:bg-slate-700"
          />
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onShowDetails}
              className="inline-flex items-center px-2.5 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-800 dark:hover:text-blue-300 rounded-md font-medium text-sm transition-all shadow-sm border border-blue-200/50 dark:border-blue-800/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              title="View PO Details"
            >
              <span className="font-mono tracking-tight">{order.poNumber}</span>
            </button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-xs text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
            >
              <FileText className="h-3.5 w-3.5 mr-1.5" /> Files
            </Button>
          </div>
        </td>
        <td className="px-4 py-3">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{order.supplier}</p>
          </div>
        </td>
        <td className="px-4 py-3">{formatDate(order.orderDate)}</td>
        <td className="px-4 py-3">{formatDate(order.dueDate)}</td>
        <td className="px-4 py-3 text-right font-mono text-xs">
          {order.exchangeRate.toFixed(6)}
        </td>
        <td className="px-4 py-3 text-right">
          <span className="font-semibold text-gray-900 dark:text-white">
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
    </>
  );
}
