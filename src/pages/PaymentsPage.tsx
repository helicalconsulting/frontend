import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { mockPaymentRequests, mockPaymentApprovalQueue } from '@/mocks/data';
import {
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Filter,
  DollarSign,
  Clock,
  FileText,
  ChevronDown,
  ChevronRight,
  CreditCard,
  AlertTriangle,
} from 'lucide-react';
import type { PaymentRequest } from '@/types';

type ViewMode = 'queue' | 'form';

const priorityVariants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  low: 'default',
  medium: 'info',
  high: 'danger',
};

export function PaymentsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    supplierCode: '',
    supplierName: '',
    currency: 'USD',
    dueDate: '',
    category: 'Materials',
    amount: '',
    vatAmount: '',
    reference: '',
    notes: '',
  });

  const filteredQueue = useMemo(() => {
    return mockPaymentApprovalQueue.filter((item) => {
      return !searchQuery ||
        item.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  const totalPending = mockPaymentApprovalQueue.filter((i) => i.status === 'pending').length;
  const totalValue = mockPaymentApprovalQueue.reduce((sum, i) => sum + i.amount, 0);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (viewMode === 'form') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          title="New Payment Request"
          subtitle="Submit a new payment request for approval"
        />
        <div className="p-6">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setViewMode('queue')}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Approval Queue
            </button>

            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Payment Request Form</h3>
                    <p className="text-xs text-blue-100">General Information & Line Items</p>
                  </div>
                </div>
              </div>

              <form className="p-6 space-y-5">
                {/* General Info Section */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">General Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Supplier Code</label>
                      <Input
                        value={formData.supplierCode}
                        onChange={(e) => setFormData({ ...formData, supplierCode: e.target.value })}
                        placeholder="SUP-001"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Supplier Name</label>
                      <Input
                        value={formData.supplierName}
                        onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                        placeholder="Splash Paints"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Currency</label>
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="USD">USD</option>
                        <option value="KES">KES</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Due Date</label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="Materials">Materials</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Consumables">Consumables</option>
                        <option value="Services">Services</option>
                        <option value="Chemicals">Chemicals</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Net Amount</label>
                      <Input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">VAT Amount</label>
                      <Input
                        type="number"
                        value={formData.vatAmount}
                        onChange={(e) => setFormData({ ...formData, vatAmount: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Reference</label>
                      <Input
                        value={formData.reference}
                        onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                        placeholder="INV-XXXXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-700 placeholder:text-gray-400 shadow-sm resize-none focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    rows={3}
                  />
                </div>

                {/* Line Items Preview */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Line Items</h4>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                    <p className="text-sm text-gray-400">Line items will appear here after saving general info</p>
                    <Button size="sm" variant="outline" className="mt-3">
                      <Plus className="h-4 w-4" />
                      Add Line Item
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => setViewMode('queue')}>Cancel</Button>
                  <Button variant="default" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                    Submit Request
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Payment Approval"
        subtitle="Review and process pending payment requests"
      />

      <div className="p-6 space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{totalPending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">High Priority</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockPaymentApprovalQueue.filter((i) => i.priority === 'high').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions + Search */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {selectedIds.size > 0 && (
              <>
                <span className="text-xs text-gray-500 font-medium">{selectedIds.size} selected</span>
                <Button size="sm" variant="success" onClick={() => setSelectedIds(new Set())}>
                  <CheckCircle2 className="h-4 w-4" />
                  Approve
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setSelectedIds(new Set())}>
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedIds(new Set())}>
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search-queue"
                placeholder="Quick Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button size="sm" variant="outline">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => setViewMode('form')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              <Plus className="h-4 w-4" />
              New Request
            </Button>
          </div>
        </div>

        {/* Approval Queue Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50/80 px-5 py-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <h3 className="text-sm font-bold text-gray-700">Pending Requests</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredQueue.length && filteredQueue.length > 0}
                      onChange={() => {
                        if (selectedIds.size === filteredQueue.length) {
                          setSelectedIds(new Set());
                        } else {
                          setSelectedIds(new Set(filteredQueue.map((i) => i.id)));
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left w-10" />
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Request #</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Supplier</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500 text-xs uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Request Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Due Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500 text-xs uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Requested By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredQueue.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition-colors duration-150 ${
                      selectedIds.has(item.id) ? 'bg-blue-50/50' : 'hover:bg-gray-50/80'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setExpandedRequest(expandedRequest === item.id ? null : item.id)}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
                      >
                        {expandedRequest === item.id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-medium text-blue-600">{item.requestNumber}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{item.supplier}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 font-mono">
                      ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{item.requestDate}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{item.dueDate}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs">{item.category}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={priorityVariants[item.priority]}>
                        {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-xs">{item.requestedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Transaction Breakdown for expanded item */}
          {expandedRequest && (() => {
            const req = mockPaymentRequests.find((r) =>
              mockPaymentApprovalQueue.find((q) => q.id === expandedRequest)?.requestNumber === r.requestNumber
            );
            if (!req) return null;
            return (
              <div className="border-t border-gray-200 bg-slate-50/80 p-5">
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Transaction Breakdown</h4>
                <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Description</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Account</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Amount</th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">Tax Code</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Tax</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {req.lineItems.map((li) => (
                        <tr key={li.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-4 py-2.5 text-gray-900 font-medium">{li.description}</td>
                          <td className="px-4 py-2.5 text-gray-600 font-mono text-xs">{li.account}</td>
                          <td className="px-4 py-2.5 text-right text-gray-700 font-mono">{li.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td className="px-4 py-2.5 text-center text-gray-500 text-xs">{li.taxCode}</td>
                          <td className="px-4 py-2.5 text-right text-gray-600 font-mono">{li.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td className="px-4 py-2.5 text-right font-semibold text-gray-900 font-mono">{li.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-gray-200 bg-gray-50/50">
                        <td colSpan={5} className="px-4 py-2.5 text-right text-xs font-semibold text-gray-600 uppercase">Total</td>
                        <td className="px-4 py-2.5 text-right font-bold text-gray-900 font-mono">
                          ${req.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            );
          })()}

          {filteredQueue.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <CreditCard className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No pending requests</p>
              <p className="text-xs mt-1">All payment requests have been processed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
