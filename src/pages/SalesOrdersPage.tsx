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
  ChevronDown,
  ChevronRight,
  MessageCircle,
  AlertTriangle,
  ShieldAlert,
  FileText,
} from 'lucide-react';
import type { SalesOrder } from '@/types';

type SubTab = 'lines' | 'overdue' | 'aging';

export function SalesOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('lines');

  const filteredOrders = useMemo(() => {
    return mockSalesOrders.filter((order) => {
      return !searchQuery ||
        order.salesOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleWhatsApp = (order: SalesOrder) => {
    const msg = `Hi, regarding Sales Order ${order.salesOrderNumber} for ${order.customerName}. Please review the credit limit status.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Sales Order Approvals"
        subtitle="Automated credit risk detection and order governance"
      />

      <div className="p-6 space-y-4">
        {/* Top bar: Search + Actions */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search-sales-orders"
                placeholder="Search Sales Order or Customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline">
              Override 2nd Approver
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => {
                if (mockSalesOrders.length > 0) handleWhatsApp(mockSalesOrders[0]);
              }}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="success"
            disabled={selectedIds.size === 0}
            onClick={() => setSelectedIds(new Set())}
          >
            <CheckCircle2 className="h-4 w-4" />
            Approve Selected
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={selectedIds.size === 0}
            onClick={() => setSelectedIds(new Set())}
          >
            <XCircle className="h-4 w-4" />
            Reject
          </Button>
          <Button
            size="sm"
            variant="warning"
            disabled={selectedIds.size === 0}
            onClick={() => setSelectedIds(new Set())}
          >
            <RotateCcw className="h-4 w-4" />
            Return with Reason
          </Button>

          {selectedIds.size > 0 && (
            <span className="text-xs text-gray-500 font-medium ml-2">
              {selectedIds.size} selected
            </span>
          )}

          <div className="ml-auto">
            <Button size="sm" variant="outline">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </div>
        </div>

        {/* Pending Orders Label */}
        <div className="flex items-center gap-2 text-gray-600">
          <FileText className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Pending Orders</span>
        </div>

        {/* Sales Orders Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="px-3 py-3 text-left w-10 font-semibold text-gray-500 text-xs uppercase">Select</th>
                  <th className="px-3 py-3 text-left w-10" />
                  <th className="px-3 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">SalesOrder</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">CustomerName</th>
                  <th className="px-3 py-3 text-center font-semibold text-gray-500 text-xs uppercase tracking-wider">OrderStatus</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-500 text-xs uppercase tracking-wider">CreditLimit</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-500 text-xs uppercase tracking-wider">CurrentBalance</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-500 text-xs uppercase tracking-wider">AvailableBalance</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">CustomerPONumber</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">OrderDate</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">RegisHPDate</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Salesperson</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <SalesOrderRow
                    key={order.id}
                    order={order}
                    isSelected={selectedIds.has(order.id)}
                    isExpanded={expandedRow === order.id}
                    activeSubTab={activeSubTab}
                    onToggleSelect={() => toggleSelect(order.id)}
                    onToggleExpand={() => setExpandedRow(expandedRow === order.id ? null : order.id)}
                    onSubTabChange={setActiveSubTab}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FileText className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No sales orders found</p>
              <p className="text-xs mt-1">Try adjusting your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ================================================
// Sales Order Row
// ================================================
function SalesOrderRow({
  order,
  isSelected,
  isExpanded,
  activeSubTab,
  onToggleSelect,
  onToggleExpand,
  onSubTabChange,
}: {
  order: SalesOrder;
  isSelected: boolean;
  isExpanded: boolean;
  activeSubTab: SubTab;
  onToggleSelect: () => void;
  onToggleExpand: () => void;
  onSubTabChange: (tab: SubTab) => void;
}) {
  return (
    <>
      <tr
        className={`transition-colors duration-150 ${
          order.isCreditBreached
            ? 'bg-red-50/60 border-l-4 border-l-red-500'
            : isSelected
            ? 'bg-blue-50/50'
            : 'hover:bg-gray-50/80'
        }`}
      >
        <td className="px-3 py-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </td>
        <td className="px-3 py-3">
          <button
            onClick={onToggleExpand}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </td>
        <td className="px-3 py-3 font-mono text-xs font-medium text-gray-900">{order.salesOrderNumber}</td>
        <td className="px-3 py-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{order.customerName}</span>
            {order.isCreditBreached && (
              <ShieldAlert className="h-4 w-4 text-red-500" aria-label="Credit Limit Breached" />
            )}
          </div>
        </td>
        <td className="px-3 py-3 text-center">
          <Badge variant="info">{order.orderStatus}</Badge>
        </td>
        <td className="px-3 py-3 text-right font-mono text-xs text-gray-700">
          {order.creditLimit.toLocaleString()}
        </td>
        <td className="px-3 py-3 text-right">
          <span className={`font-mono text-xs font-semibold ${order.isCreditBreached ? 'text-red-600' : 'text-gray-700'}`}>
            {order.currentBalance.toLocaleString()}
          </span>
        </td>
        <td className="px-3 py-3 text-right">
          <span className={`font-mono text-xs font-bold ${order.availableBalance < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {order.availableBalance.toLocaleString()}
          </span>
        </td>
        <td className="px-3 py-3 font-mono text-xs text-gray-700">{order.customerPONumber}</td>
        <td className="px-3 py-3 text-gray-600 text-xs">{order.orderDate}</td>
        <td className="px-3 py-3 text-gray-600 text-xs">{order.registrationDate}</td>
        <td className="px-3 py-3 text-gray-700 text-xs">{order.salesperson}</td>
      </tr>

      {/* Expanded Sub-tabs */}
      {isExpanded && (
        <tr>
          <td colSpan={12} className="bg-slate-50/80 px-3 py-0">
            <div className="py-4 pl-8">
              {/* Sub-tab Navigation */}
              <div className="flex items-center gap-1 mb-3 border-b border-gray-200">
                <button
                  onClick={() => onSubTabChange('lines')}
                  className={`px-4 py-2 text-xs font-semibold transition-colors border-b-2 ${
                    activeSubTab === 'lines'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    Order Line Details
                  </span>
                </button>
                <button
                  onClick={() => onSubTabChange('overdue')}
                  className={`px-4 py-2 text-xs font-semibold transition-colors border-b-2 ${
                    activeSubTab === 'overdue'
                      ? 'text-amber-600 border-amber-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Overdue Invoices
                  </span>
                </button>
                <button
                  onClick={() => onSubTabChange('aging')}
                  className={`px-4 py-2 text-xs font-semibold transition-colors border-b-2 ${
                    activeSubTab === 'aging'
                      ? 'text-indigo-600 border-indigo-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    Payment Aging
                  </span>
                </button>
              </div>

              {/* Sub-tab Content */}
              {activeSubTab === 'lines' && (
                <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">SalesOrder</th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">Line</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">StockCode</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Description</th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">Warehouse</th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">UOM</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">OrderQty</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">UnitPrice</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">LineValue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {order.lineDetails.map((ld) => (
                        <tr key={ld.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-4 py-2.5 font-mono text-xs text-gray-700">{ld.salesOrder}</td>
                          <td className="px-4 py-2.5 text-center text-gray-700">{ld.line}</td>
                          <td className="px-4 py-2.5 font-mono text-xs text-gray-700">{ld.stockCode}</td>
                          <td className="px-4 py-2.5 font-medium text-gray-900">{ld.description}</td>
                          <td className="px-4 py-2.5 text-center text-gray-500 text-xs">{ld.warehouse}</td>
                          <td className="px-4 py-2.5 text-center text-gray-500 text-xs">{ld.uom}</td>
                          <td className="px-4 py-2.5 text-right text-gray-700 font-mono">{ld.orderQty}</td>
                          <td className="px-4 py-2.5 text-right text-gray-700 font-mono">{ld.unitPrice.toLocaleString()}</td>
                          <td className="px-4 py-2.5 text-right font-semibold text-gray-900 font-mono">{ld.lineValue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeSubTab === 'overdue' && (
                <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
                  {order.overdueInvoices.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Invoice #</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Invoice Date</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Due Date</th>
                          <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Amount</th>
                          <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Balance</th>
                          <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Aging Days</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {order.overdueInvoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-red-50/30 transition-colors">
                            <td className="px-4 py-2.5 font-mono text-xs text-gray-900">{inv.invoiceNumber}</td>
                            <td className="px-4 py-2.5 text-gray-600 text-xs">{inv.invoiceDate}</td>
                            <td className="px-4 py-2.5 text-gray-600 text-xs">{inv.dueDate}</td>
                            <td className="px-4 py-2.5 text-right text-gray-700 font-mono">{inv.amount.toLocaleString()}</td>
                            <td className="px-4 py-2.5 text-right font-semibold text-red-600 font-mono">{inv.balance.toLocaleString()}</td>
                            <td className="px-4 py-2.5 text-right">
                              <span className="font-mono text-xs font-bold text-red-600">{inv.agingDays}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-gray-400">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-400" />
                      <p className="text-sm font-medium">No overdue invoices</p>
                    </div>
                  )}
                </div>
              )}

              {activeSubTab === 'aging' && (
                <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Period</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Amount</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">%</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Distribution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {order.paymentAging.map((pa) => (
                        <tr key={pa.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-4 py-2.5 font-medium text-gray-900">{pa.period}</td>
                          <td className="px-4 py-2.5 text-right text-gray-700 font-mono">{pa.amount.toLocaleString()}</td>
                          <td className="px-4 py-2.5 text-right text-gray-600 font-mono text-xs">{pa.percentage.toFixed(1)}%</td>
                          <td className="px-4 py-2.5">
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  pa.period === '120+ Days' ? 'bg-red-500' :
                                  pa.period === '90 Days' ? 'bg-amber-500' :
                                  'bg-blue-500'
                                }`}
                                style={{ width: `${Math.min(pa.percentage, 100)}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
