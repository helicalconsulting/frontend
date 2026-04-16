import { useState, useMemo, useEffect } from 'react';
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
import { useSidebar } from '@/hooks/useSidebar';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { PurchaseOrder } from '@/types';
import {
  Search,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileText,
  Filter,
  Loader2,
  Package,
  AlertTriangle,
  DollarSign,
  MoreHorizontal,
  Check,
  X,
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

  useEffect(() => {
    if (selectedOrderDetails) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedOrderDetails]);

  const { collapsed } = useSidebar();

  // Clear selections when sidebar opens (on mobile)
  useEffect(() => {
    if (!collapsed) {
      setSelectedRows(new Set());
    }
  }, [collapsed]);

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
        title="PO Approval"
        subtitle="Purchase Order Management"
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
        <div className="flex flex-col gap-4">

          {/* Row 1: Search */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search PO number or supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 w-full bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-blue-500 dark:focus-visible:ring-slate-700"
            />
          </div>

          {/* Desktop Select All & Status & Currency */}
          <div className="hidden sm:flex items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3">
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
              <Button
                size="sm"
                variant="outline"
                onClick={toggleSelectAll}
                className="h-9 px-3 text-xs"
              >
                Select All
              </Button>
            </div>
            <div className="relative w-[250px]">
              <select
                value={displayCurrency}
                onChange={(e) => setDisplayCurrency(e.target.value)}
                className="appearance-none h-9 w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 pr-7 text-sm text-gray-800 dark:text-gray-200"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} — {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            </div>
          </div>

          {/* Mobile Select All & Currency */}
          <div className="sm:hidden flex flex-row items-center justify-between w-full">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={pendingCount > 0 && selectedRows.size === pendingCount}
                onChange={toggleSelectAll}
                className="h-5 w-5 rounded border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-blue-500 focus:ring-blue-500"
              />
              <span className={`text-sm font-medium ${selectedRows.size > 0 ? 'text-blue-600 dark:text-blue-500' : 'text-gray-600 dark:text-gray-400'}`}>
                Select All
              </span>
            </label>
            <div className="flex items-center gap-3">
              <span className={`text-xs ${selectedRows.size > 0 ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500'}`}>
                {selectedRows.size > 0 ? `${selectedRows.size} selected` : `${pendingCount} pending`}
              </span>
              <div className="relative">
                <select
                  value={displayCurrency}
                  onChange={(e) => setDisplayCurrency(e.target.value)}
                  className="appearance-none h-8 rounded-full border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-3 pl-8 pr-7 text-xs font-medium text-gray-700 dark:text-gray-200"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.code}
                    </option>
                  ))}
                </select>
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">{CURRENCIES.find(c => c.code === displayCurrency)?.flag}</span>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Mobile Filter Chips */}
          <div className="sm:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'all', label: 'All', count: data?.orders?.length || 0 },
              { id: 'pending', label: 'Pending', count: pendingCount },
              { id: 'approved', label: 'Approved', count: data?.orders?.filter(o => o.status === 'approved').length || 0 },
              { id: 'rejected', label: 'Rejected', count: data?.orders?.filter(o => o.status === 'rejected').length || 0 },
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap border text-sm font-medium transition-colors ${statusFilter === filter.id
                  ? 'bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white'
                  : 'bg-transparent border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  } ${statusFilter !== filter.id ? 'border-gray-200 dark:border-slate-800/60 ring-1 ring-gray-200 dark:ring-slate-800/60' : ''}`}
              >
                {filter.label}
                <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] sm:text-xs font-bold leading-none ${statusFilter === filter.id ? 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'
                  }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* Desktop Bulk Actions */}
          <div className="hidden sm:flex hidden">
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
                <Button
                  size="sm"
                  variant="warning"
                  className="rounded-full px-4"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Return
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
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

          {!isLoading && filteredOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-slate-500">
              <FileText className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No purchase orders found</p>
              <p className="text-xs mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>

        {/* Mobile Card List */}
        <div className="sm:hidden flex flex-col gap-4 pb-20">
          {isLoading
            ? Array(4).fill(null).map((_, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800/80 animate-pulse space-y-3">
                <div className="h-4 w-32 rounded bg-gray-200 dark:bg-slate-800" />
                <div className="h-6 w-48 rounded bg-gray-200 dark:bg-slate-800" />
                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-slate-800" />
              </div>
            ))
            : filteredOrders.map((order) => {
              const isSelected = selectedRows.has(order.id);

              const getPriorityStyles = (priority: string) => {
                switch (priority) {
                  case 'critical':
                    return { bg: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400', dot: 'bg-red-500 dark:bg-red-400' };
                  case 'high':
                    return { bg: 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400', dot: 'bg-orange-500 dark:bg-orange-400' };
                  case 'medium':
                    return { bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500 dark:bg-emerald-400' };
                  default:
                    return { bg: 'bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20 text-slate-600 dark:text-slate-400', dot: 'bg-slate-400 dark:bg-slate-500' };
                }
              };

              const getStatusStyles = (status: string) => {
                if (status === 'pending') return 'bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400';
                if (status === 'approved') return 'bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400';
                return 'bg-red-50/50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400';
              };

              const pStyles = getPriorityStyles(order.priority);
              const sStyles = getStatusStyles(order.status);

              return (
                <div
                  key={order.id}
                  className={`flex flex-col p-4 rounded-xl shadow-sm transition-colors ${isSelected
                    ? 'bg-blue-50/40 dark:bg-blue-900/10 border-[1.5px] border-blue-400 dark:border-blue-800'
                    : 'bg-white dark:bg-slate-900 border-[1px] border-gray-200 dark:border-slate-800'
                    }`}
                >
                  {/* Top Row: PO Number and Checkbox */}
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setSelectedOrderDetails(order)}
                        className="font-mono text-[13px] font-semibold text-gray-400 dark:text-slate-400 text-left hover:text-gray-600 dark:hover:text-slate-300 uppercase tracking-wide"
                      >
                        {order.poNumber}
                      </button>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-[3px] rounded border flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${pStyles.bg}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${pStyles.dot}`}></span>
                          {order.priority}
                        </span>
                        <span className={`px-2 py-[3px] rounded border text-[10px] font-bold uppercase tracking-wider ${sStyles}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(order.id)}
                      disabled={order.status !== 'pending'}
                      className="h-5 w-5 rounded-[4px] border-gray-300 dark:border-slate-600 text-blue-500 focus:ring-0 checked:bg-blue-500 mt-0.5 bg-transparent"
                    />
                  </div>

                  {/* Middle Row: Supplier and Amount */}
                  <div className="flex flex-col gap-1 mt-3">
                    <div className="text-[17px] font-bold text-slate-800 dark:text-white leading-tight">
                      {order.supplier}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-1.5 py-0.5 rounded-[4px] border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 text-[10px] font-bold text-gray-500 dark:text-slate-400">
                        {displayCurrency}
                      </span>
                      <span className="text-[22px] font-extrabold text-slate-900 dark:text-gray-50 tracking-tight">
                        {formatCurrency(
                          (order.amount / EXCHANGE_RATES[order.currency]) * EXCHANGE_RATES[displayCurrency],
                          displayCurrency
                        ).replace(/[^\d.,]/g, "").trim()}
                      </span>
                    </div>
                  </div>

                  <hr className="border-gray-100 dark:border-slate-800/80 my-3.5" />

                  {/* Bottom Row: Dates and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[4px] text-[11px] font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wide">
                      <span>Due</span>
                      <span className="font-bold text-gray-600 dark:text-slate-300">{formatDate(order.dueDate).substring(0, 6)}</span>
                      <span className="mx-1 text-gray-300 dark:text-slate-600 text-[10px]">•</span>
                      <span>Ord</span>
                      <span className="font-bold text-gray-600 dark:text-slate-300">{formatDate(order.orderDate).substring(0, 6)}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-[8px] border-gray-200 dark:border-slate-700 shadow-sm text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                        onClick={() => setSelectedOrderDetails(order)}
                      >
                        <MoreHorizontal className="h-[14px] w-[14px]" />
                      </Button>
                      {order.status === 'pending' && (
                        <>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleReject(order.id)}
                            className="h-8 w-8 rounded-[8px] shadow-sm border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-800"
                          >
                            <X className="h-[14px] w-[14px]" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleApprove(order.id)}
                            className="h-8 w-8 rounded-[8px] shadow-sm border-blue-200 dark:border-blue-900/50 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-800"
                          >
                            <Check className="h-[14px] w-[14px]" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

          {!isLoading && filteredOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-slate-500">
              <FileText className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No purchase orders found</p>
              <p className="text-xs mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Floating Action Bar */}
      {selectedRows.size > 0 && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-[#11131e]/90 backdrop-blur-md border-t border-gray-200 dark:border-slate-800 z-40 pb-safe">
          <div className="max-w-md mx-auto w-full flex items-center justify-between gap-2">
            <div className="flex-shrink-0 h-12 px-3 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-[#1c2132] border border-blue-100 dark:border-slate-700 font-bold text-blue-600 dark:text-blue-400 text-sm">
              {selectedRows.size} sel.
            </div>

            <Button
              className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 dark:bg-[#e74c3c] dark:hover:bg-[#c0392b] text-white font-bold text-sm"
              onClick={handleBulkReject}
            >
              Reject
            </Button>

            <Button
              className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-[#2ecc71] dark:hover:bg-[#27ae60] text-white font-bold text-sm"
              onClick={handleBulkApprove}
            >
              Approve
            </Button>

            <Button
              className="flex-1 h-12 rounded-xl bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-bold text-sm"
            >
              Return
            </Button>
          </div>
        </div>
      )}

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
