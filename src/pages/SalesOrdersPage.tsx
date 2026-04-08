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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Sales Order Approvals"
        subtitle="Automated credit risk detection and order governance"
      />

      <div className="p-6 space-y-4">
        {/* ✅ KPI CARDS (Payments jaisa) */}
{/* ✅ KPI CARDS (WHITE THEME) */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

  {/* Pending Orders */}
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-blue-100 rounded-lg">
        <Package className="h-5 w-5 text-blue-600" />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">
          Pending Orders
        </p>
        <p className="text-2xl font-bold text-gray-900">
          {filteredOrders.length}
        </p>
      </div>
    </div>
  </div>

  {/* Total Value */}
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-emerald-100 rounded-lg">
        <DollarSign className="h-5 w-5 text-emerald-600" />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">
          Total Value
        </p>
        <p className="text-2xl font-bold text-gray-900">
          $
          {filteredOrders
            .reduce((sum, o) => sum + Number(o.availableBalance || 0), 0)
            .toLocaleString()}
        </p>
      </div>
    </div>
  </div>

  {/* High Priority */}
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-amber-100 rounded-lg">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">
          High Priority
        </p>
        <p className="text-2xl font-bold text-gray-900">
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
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-3">
            <Button size="sm" variant="outline">Override 2nd Approver</Button>
            <Button size="sm" className="bg-emerald-600 text-white">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </Button>
            {/* Home button (always last) */}
            
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
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

          {/* ✅ HEADER (Payments jaisa) */}
          <div className="border-b border-gray-200 bg-gray-50/80 px-5 py-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <h3 className="text-sm font-bold text-gray-700">Pending Orders</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">

                  {/* Select All */}
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredOrders.length && filteredOrders.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4"
                    />
                  </th>

                  {/* Empty column (IMPORTANT) */}
                  <th className="px-4 py-3 w-10" />

                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Sales Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Credit Limit</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Current Balance</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Available</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">PO</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Salesperson</th>

                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={`transition-colors ${selectedIds.has(order.id)
                        ? 'bg-blue-50/50'
                        : 'hover:bg-gray-50/80'
                      }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(order.id)}
                        onChange={() => toggleSelect(order.id)}
                        className="h-4 w-4"
                      />
                    </td>

                    <td className="px-4 py-3" />

                    <td className="px-4 py-3">{order.salesOrderNumber}</td>

                    <td className="px-4 py-3">
                      {order.customerName}
                      {order.isCreditBreached && (
                        <ShieldAlert className="inline ml-1 text-red-500 h-4 w-4" />
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Badge variant="info">{order.orderStatus}</Badge>
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
        </div>

      </div>
    </div>
  );
}