import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { mockSalesOrders } from '@/mocks/data';
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
} from 'lucide-react';
import type { SalesOrder } from '@/types';

type SubTab = 'lines' | 'overdue' | 'aging';

export function SalesOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('lines');

  const filteredOrders = useMemo(() => {
    return mockSalesOrders.filter((order) =>
      !searchQuery ||
      order.salesOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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
                  $
                  {filteredOrders
                    .reduce((sum, o) => sum + Number(o.availableBalance || 0), 0)
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
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </Button>
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

                <Button size="sm" variant="success">
                  <CheckCircle2 className="h-4 w-4" />
                  Approve
                </Button>

                <Button size="sm" variant="destructive">
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>

                <Button size="sm" variant="warning">

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

          {/* Mobile Card List */}
          <div className="sm:hidden divide-y divide-gray-100 dark:divide-slate-800/60">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`p-4 space-y-2.5 ${selectedIds.has(order.id) ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(order.id)}
                      onChange={() => toggleSelect(order.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md border border-blue-200/50"
                    >
                      {order.salesOrderNumber}
                    </button>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${getStatusStyle(getStatusLabel(order.orderStatus))}`}>
                    {getStatusLabel(order.orderStatus)}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {order.customerName}
                    {order.isCreditBreached && <ShieldAlert className="inline ml-1 text-red-500 h-3.5 w-3.5" />}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500 dark:text-slate-400">
                    <span>PO: {order.customerPONumber}</span>
                    <span>{order.orderDate}</span>
                    <span>{order.salesperson}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 dark:text-slate-400 space-y-0.5">
                    <div>Avail: <span className="font-semibold text-gray-900 dark:text-white">{order.availableBalance}</span></div>
                    <div>Limit: {order.creditLimit}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive" className="h-7 px-2.5 text-xs">Reject</Button>
                    <Button size="sm" variant="success" className="h-7 px-2.5 text-xs">Approve</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
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