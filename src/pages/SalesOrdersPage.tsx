import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { mockSalesOrders } from '@/mocks/data';
import { useSidebar } from '@/hooks/useSidebar';
import {
  Search,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Home,
  MessageCircle,
  ShieldAlert,
  FileText,
  AlertTriangle,
  DollarSign,
  Package,
  Check,
  X,
  ChevronDown,
} from 'lucide-react';
import type { SalesOrder } from '@/types';

type SubTab = 'lines' | 'overdue' | 'aging';

const CURRENCIES = [
  { code: "KES", label: "Kenyan Shilling", flag: "🇰🇪", region: "africa" },
  { code: "NGN", label: "Nigerian Naira", flag: "🇳🇬", region: "africa" },
  { code: "ZAR", label: "South African Rand", flag: "🇿🇦", region: "africa" },

  { code: "USD", label: "US Dollar", flag: "🇺🇸", region: "global" },
  { code: "EUR", label: "Euro", flag: "🇪🇺", region: "global" },
  { code: "GBP", label: "British Pound", flag: "🇬🇧", region: "global" },
];

export function SalesOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('lines');

  useEffect(() => {
    if (selectedOrder) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedOrder]);
  const { collapsed } = useSidebar();

  // Clear selections when sidebar opens (on mobile)
  useEffect(() => {
    if (!collapsed) {
      setSelectedIds(new Set());
    }
  }, [collapsed]);

  const [displayCurrency, setDisplayCurrency] = useState("USD");
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = useMemo(() => {
    return mockSalesOrders.filter((order) => {
      const matchesSearch = !searchQuery ||
        order.salesOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

      const statusMap: Record<string, string> = { 'S': 'pending', 'A': 'approved', 'O': 'overdue' };
      const normalizedStatus = statusMap[order.orderStatus] || 'unknown';
      const matchesStatus = statusFilter === 'all' || normalizedStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === 'S') return 'Pending';
    if (status === 'A') return 'Approved';
    if (status === 'O') return 'Overdue';
    return status;
  };

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();

    if (s === 'pending') {
      return "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:border-amber-400/30";
    }

    if (s === 'approved') {
      return "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:border-emerald-400/30";
    }

    if (s === 'overdue') {
      return "bg-red-50 text-red-700 border border-red-200 dark:bg-red-400/10 dark:text-red-300 dark:border-red-400/30";
    }

    return "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600";
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Header
        title="Sales Order Approvals"
        subtitle="Automated credit risk detection and order governance"
      />

      <div className="p-3 sm:p-6 space-y-4">
        {/* ✅ KPI CARDS (Payments jaisa) */}
        {/* ✅ KPI CARDS (WHITE THEME) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Pending Orders */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                  Pending Orders
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {filteredOrders.length}
                </p>
              </div>
            </div>
          </div>

          {/* Total Value */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                  Total Value
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">

                  {displayCurrency}{" "}
                  {filteredOrders
                    .reduce((sum, o) => {
                      const usd = Number(o.availableBalance || 0); // assume USD base
                      const rate =
                        CURRENCIES.find(c => c.code === displayCurrency)?.rate || 1;
                      return sum + usd * rate;
                    }, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* High Priority */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                  High Priority
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {
                    filteredOrders.filter(
                      (o) => o.priority === 'high' || o.priority === 'critical'
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Search + Top */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="text-xs">Override 2nd Approver</Button>
            <Button size="sm" className="bg-emerald-600 text-white text-xs">
              <MessageCircle className="h-4 w-6 " /> WhatsApp
            </Button>
          </div>
        </div>
        {/* Desktop: Select All + Currency row */}
        <div className="hidden sm:flex items-center justify-end gap-2 w-full mt-2">

          {/* Select All */}
          <Button
            size="sm"
            variant="outline"
            onClick={toggleSelectAll}
            className="h-8 px-3 text-xs whitespace-nowrap"
          >
            Select All
          </Button>

          {/* Currency Dropdown */}
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
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▼</span>
          </div>

        </div>

        {/* Mobile: PO-style Select All row */}
        <div className="sm:hidden flex flex-row items-center justify-between w-full mt-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={filteredOrders.length > 0 && selectedIds.size === filteredOrders.length}
              onChange={toggleSelectAll}
              className="h-5 w-5 rounded border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-blue-500 focus:ring-blue-500"
            />
            <span className={`text-sm font-medium ${selectedIds.size > 0 ? 'text-blue-600 dark:text-blue-500' : 'text-gray-600 dark:text-gray-400'}`}>
              Select All
            </span>
          </label>
          <div className="flex items-center gap-3">
            <span className={`text-xs ${selectedIds.size > 0 ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500'}`}>
              {selectedIds.size > 0 ? `${selectedIds.size} selected` : `${filteredOrders.length} orders`}
            </span>
            <div className="relative">
              <select
                value={displayCurrency}
                onChange={(e) => setDisplayCurrency(e.target.value)}
                className="appearance-none h-8 rounded-full border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-3 pl-8 pr-7 text-xs font-medium text-gray-700 dark:text-gray-200"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">{CURRENCIES.find(c => c.code === displayCurrency)?.flag}</span>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Bulk Actions (Payments jaisa) */}
        <div className="flex items-center justify-between">

          {/* LEFT SIDE (empty ya future ke liye) */}
          <div />

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 ml-auto">

            {selectedIds.size > 0 && (
              <>
                <span className="text-xs text-gray-500 mr-2">
                  {selectedIds.size} selected
                </span>

                <Button size="sm" variant="success" className="hidden sm:inline-flex">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Approve
                </Button>

                <Button size="sm" variant="destructive" className="hidden sm:inline-flex">
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>

                <Button size="sm" variant="warning" className="hidden sm:inline-flex">
                  Return
                </Button>
              </>
            )}



          </div>
        </div>
        {/* TABLE */}
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">

          <div className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/50 px-4 sm:px-5 py-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500 dark:text-slate-400" />
              <h3 className="text-sm font-bold text-gray-700 dark:text-slate-200">Pending Orders</h3>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredOrders.length && filteredOrders.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:bg-slate-700"
                    />
                  </th>
                  <th className="px-4 py-3 w-10" />
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Sales Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Customer</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Credit Limit</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Current Balance</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Available</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">PO</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Salesperson</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={`transition-colors text-gray-700 dark:text-slate-300 ${selectedIds.has(order.id)
                      ? 'bg-blue-50/50 dark:bg-blue-900/20'
                      : 'hover:bg-gray-50/80 dark:hover:bg-slate-800/50'
                      }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(order.id)}
                        onChange={() => toggleSelect(order.id)}
                        className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:bg-slate-700"
                      />
                    </td>
                    <td className="px-4 py-3" />
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center px-2.5 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-md font-mono text-xs font-medium border border-blue-200/50 dark:border-blue-800/50 transition"
                      >
                        {order.salesOrderNumber}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {order.customerName}
                      {order.isCreditBreached && (
                        <ShieldAlert className="inline ml-1 text-red-500 h-4 w-4" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusStyle(getStatusLabel(order.orderStatus))}`}>
                        {getStatusLabel(order.orderStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">{order.creditLimit}</td>
                    <td className="px-4 py-3 text-right">{order.currentBalance}</td>
                    <td className="px-4 py-3 text-right font-semibold">{order.availableBalance}</td>
                    <td className="px-4 py-3">{order.customerPONumber}</td>
                    <td className="px-4 py-3">{order.orderDate}</td>
                    <td className="px-4 py-3">{order.salesperson}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Filter Chips */}
          <div className="sm:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide py-2">
            {[
              { id: 'all', label: 'All', count: mockSalesOrders.length },
              { id: 'pending', label: 'Pending', count: mockSalesOrders.filter(o => o.orderStatus === 'S').length },
              { id: 'approved', label: 'Approved', count: mockSalesOrders.filter(o => o.orderStatus === 'A').length },
              { id: 'overdue', label: 'Overdue', count: mockSalesOrders.filter(o => o.orderStatus === 'O').length },
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap border text-sm font-medium transition-colors ${statusFilter === filter.id
                  ? 'bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white'
                  : 'bg-transparent border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 ring-1 ring-gray-200 dark:ring-slate-800/60'
                  }`}
              >
                {filter.label}
                <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] sm:text-xs font-bold leading-none ${statusFilter === filter.id ? 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'
                  }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* Mobile Card List */}
          <div className="sm:hidden flex flex-col gap-4 pb-20 mt-2 bg-transparent">
            {filteredOrders.map((order) => {
              const isSelected = selectedIds.has(order.id);
              const normalizedStatus = order.orderStatus === 'S' ? 'pending' : order.orderStatus === 'A' ? 'approved' : 'overdue';

              const getStatusStyles = (status: string) => {
                if (status === 'pending') return 'bg-amber-50/50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400';
                if (status === 'approved') return 'bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400';
                return 'bg-red-50/50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400';
              };
              const sStyles = getStatusStyles(normalizedStatus);

              return (
                <div
                  key={order.id}
                  className={`flex flex-col p-4 rounded-xl shadow-sm transition-colors ${isSelected
                    ? 'bg-blue-50/40 dark:bg-blue-900/10 border-[1.5px] border-blue-400 dark:border-blue-800'
                    : 'bg-white dark:bg-slate-900 border-[1px] border-gray-200 dark:border-slate-800'
                    }`}
                >
                  {/* Top Row: Ref Number and Checkbox */}
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="font-mono text-[13px] font-semibold text-gray-400 dark:text-slate-400 text-left hover:text-gray-600 dark:hover:text-slate-300 uppercase tracking-wide"
                      >
                        {order.salesOrderNumber}
                      </button>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-[3px] rounded border text-[10px] font-bold uppercase tracking-wider ${sStyles}`}>
                          {normalizedStatus}
                        </span>
                        {order.isCreditBreached && (
                          <span className="px-2 py-[3px] rounded border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                            <ShieldAlert className="h-3 w-3" /> Breach
                          </span>
                        )}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={normalizedStatus === 'approved'}
                      onChange={() => toggleSelect(order.id)}
                      className="h-5 w-5 rounded-[4px] border-gray-300 dark:border-slate-600 text-blue-500 focus:ring-0 checked:bg-blue-500 mt-0.5 bg-transparent"
                    />
                  </div>

                  {/* Middle Row: Customer and Amount */}
                  <div className="flex flex-col gap-1 mt-3">
                    <div className="text-[17px] font-bold text-slate-800 dark:text-white leading-tight">
                      {order.customerName}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-1.5 py-0.5 rounded-[4px] border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 text-[10px] font-bold text-gray-500 dark:text-slate-400">
                        AVAILABLE
                      </span>
                      <span className={`text-[22px] font-extrabold tracking-tight ${order.availableBalance < 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-gray-50'}`}>
                        {order.availableBalance.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Links Row */}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {order.customerPONumber && order.customerPONumber !== 'N/A' && (
                      <button
                        className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 dark:bg-[#1a1d2d]/80 border border-gray-200 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors group"
                      >
                        <FileText className="h-3 w-3 text-indigo-500 group-hover:text-indigo-600 dark:text-indigo-400" />
                        <span className="font-mono text-[10px] font-bold text-gray-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">PO: {order.customerPONumber}</span>
                      </button>
                    )}
                  </div>

                  <hr className="border-gray-100 dark:border-slate-800/80 my-3.5" />

                  {/* Bottom Row: Dates and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[4px] text-[11px] font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wide">
                      <span>Limit</span>
                      <span className="font-bold text-gray-600 dark:text-slate-300">{order.creditLimit.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        size="icon"
                        variant="outline"
                        title="Full Details"
                        className="h-8 w-8 rounded-[8px] border-gray-200 dark:border-slate-700 shadow-sm text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <FileText className="h-[14px] w-[14px]" />
                      </Button>
                      {(normalizedStatus === 'pending' || normalizedStatus === 'overdue') && (
                        <>
                          <Button
                            size="icon"
                            variant="outline"
                            title="Reject"
                            className="h-8 w-8 rounded-[8px] shadow-sm border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-800"
                          >
                            <X className="h-[14px] w-[14px]" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            title="Approve"
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
          </div>
        </div>

      </div>

      {/* Mobile Floating Action Bar */}
      {selectedIds.size > 0 && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-[#11131e]/90 backdrop-blur-md border-t border-gray-200 dark:border-slate-800 z-40 pb-safe">
          <div className="max-w-md mx-auto w-full flex items-center justify-between gap-2">
            <div className="flex-shrink-0 h-12 px-3 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-[#1c2132] border border-blue-100 dark:border-slate-700 font-bold text-blue-600 dark:text-blue-400 text-sm">
              {selectedIds.size} sel.
            </div>
            <Button className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 dark:bg-[#e74c3c] dark:hover:bg-[#c0392b] text-white font-bold text-sm">
              Reject
            </Button>
            <Button className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-[#2ecc71] dark:hover:bg-[#27ae60] text-white font-bold text-sm">
              Approve
            </Button>
            <Button className="flex-1 h-12 rounded-xl bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-bold text-sm">
              Return
            </Button>
          </div>
        </div>
      )}
      {selectedOrder && (
        <SalesOrderModal
          isOpen={true}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
        />
      )}
    </div>
  );
}

// ================================================
// Sales Order Details Modal
// ================================================
function SalesOrderModal({
  isOpen,
  onClose,
  order,
}: {
  isOpen: boolean;
  onClose: () => void;
  order: SalesOrder;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">

      <div className="w-full max-w-4xl rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[90vh] flex flex-col
      bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 
      border border-gray-200 dark:border-slate-800 shadow-2xl">

        {/* HEADER */}
        <div className="px-6 py-4 flex items-center justify-between 
        bg-gradient-to-r from-blue-600 to-indigo-600 text-white">

          <div>
            <h3 className="text-lg font-bold">Sales Order Details</h3>
            <p className="text-sm text-blue-100">
              SO# {order.salesOrderNumber}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400 uppercase">
                Customer
              </p>
              <p className="font-medium text-gray-900 dark:text-white mt-1">
                {order.customerName}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400 uppercase">
                Order Date
              </p>
              <p className="font-medium text-gray-900 dark:text-white mt-1">
                {order.orderDate}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400 uppercase">
                Credit Limit
              </p>
              <p className="font-medium text-gray-900 dark:text-white mt-1">
                {order.creditLimit}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400 uppercase">
                Status
              </p>
              <Badge variant="info" className="mt-1">
                {order.orderStatus}
              </Badge>
            </div>
          </div>

          {/* TABLE */}
          <div className="rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-gray-50 dark:bg-slate-800 px-4 py-2">
              <h4 className="text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase">
                Order Summary
              </h4>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-2 text-left text-xs">PO</th>
                  <th className="px-4 py-2 text-left text-xs">Salesperson</th>
                  <th className="px-4 py-2 text-right text-xs">Current Balance</th>
                  <th className="px-4 py-2 text-right text-xs">Available</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-700 dark:text-slate-300">
                <tr>
                  <td className="px-4 py-2">{order.customerPONumber}</td>
                  <td className="px-4 py-2">{order.salesperson}</td>
                  <td className="px-4 py-2 text-right">{order.currentBalance}</td>
                  <td className="px-4 py-2 text-right font-semibold">
                    {order.availableBalance}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-slate-800 flex-shrink-0
        bg-gray-50 dark:bg-slate-900 flex justify-end gap-3">

          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>

          <Button variant="destructive" className="shadow-lg shadow-red-500/20">
            Reject
          </Button>

          <Button variant="success" className="shadow-lg shadow-emerald-500/20">
            Approve
          </Button>
        </div>
      </div>

    </div>
  );
}