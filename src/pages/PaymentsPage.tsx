import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { mockPaymentRequests, mockPaymentApprovalQueue } from '@/mocks/data';
import { useSidebar } from '@/hooks/useSidebar';
import {
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowLeft,
  Filter,
  DollarSign,
  Clock,
  FileText,
  CreditCard,
  AlertTriangle,
  MoreHorizontal,
  Check,
  X,
  ChevronDown,
} from 'lucide-react';
import type { PaymentRequest } from '@/types';

type ViewMode = 'queue' | 'form';

const priorityVariants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  low: 'default',
  medium: 'info',
  high: 'danger',
};

const CURRENCIES = [
  { code: "KES", label: "Kenyan Shilling", flag: "🇰🇪", region: "africa" },
  { code: "NGN", label: "Nigerian Naira", flag: "🇳🇬", region: "africa" },
  { code: "ZAR", label: "South African Rand", flag: "🇿🇦", region: "africa" },

  { code: "USD", label: "US Dollar", flag: "🇺🇸", region: "global" },
  { code: "EUR", label: "Euro", flag: "🇪🇺", region: "global" },
  { code: "GBP", label: "British Pound", flag: "🇬🇧", region: "global" },
];

export function PaymentsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState("USD");

  useEffect(() => {
    if (selectedRequest) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedRequest]);

  const { collapsed } = useSidebar();

  // Clear selections when sidebar opens (on mobile)
  useEffect(() => {
    if (!collapsed) {
      setSelectedIds(new Set());
    }
  }, [collapsed]);
  const [statusFilter, setStatusFilter] = useState('all');

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

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredQueue.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredQueue.map(i => i.id)));
    }
  };

  const filteredQueue = useMemo(() => {
    return mockPaymentApprovalQueue.filter((item) => {
      const matchesSearch = !searchQuery ||
        item.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

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
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <Header
          title="New Payment Request"
          subtitle="Submit a new payment request for approval"
        />
        <div className="p-3 sm:p-6">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setViewMode('queue')}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors mb-5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Approval Queue
            </button>

            <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 sm:px-6 py-5">
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

              <form className="p-4 sm:p-6 space-y-5">
                {/* General Info Section */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">General Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5">Supplier Code</label>
                      <Input
                        value={formData.supplierCode}
                        onChange={(e) => setFormData({ ...formData, supplierCode: e.target.value })}
                        placeholder="SUP-001"
                        className="bg-white dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5">Supplier Name</label>
                      <Input
                        value={formData.supplierName}
                        onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                        placeholder="Splash Paints"
                        className="bg-white dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5">Currency</label>
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="USD">USD</option>
                        <option value="KES">KES</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5">Due Date</label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="Materials">Materials</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Consumables">Consumables</option>
                        <option value="Services">Services</option>
                        <option value="Chemicals">Chemicals</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5">Net Amount</label>
                      <Input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0.00"
                        className="bg-white dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5">VAT Amount</label>
                      <Input
                        type="number"
                        value={formData.vatAmount}
                        onChange={(e) => setFormData({ ...formData, vatAmount: e.target.value })}
                        placeholder="0.00"
                        className="bg-white dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5">Reference</label>
                      <Input
                        value={formData.reference}
                        onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                        placeholder="INV-XXXXX"
                        className="bg-white dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes..."
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-3 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 shadow-sm resize-none focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    rows={3}
                  />
                </div>

                {/* Line Items Preview */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Line Items</h4>
                  <div className="rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 p-6 sm:p-8 text-center">
                    <p className="text-sm text-gray-400 dark:text-slate-500">Line items will appear here after saving general info</p>
                    <Button size="sm" variant="outline" className="mt-3">
                      <Plus className="h-4 w-4" />
                      Add Line Item
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => setViewMode('queue')} className="sm:w-auto">Cancel</Button>
                  <Button variant="default" className="bg-gradient-to-r from-blue-600 to-indigo-600 sm:w-auto">
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Header
        title="Payment Approval"
        subtitle="Review and process pending payment requests"
      />

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Pending Requests</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{totalPending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Total Value</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {displayCurrency}{" "}
                  {mockPaymentApprovalQueue
                    .reduce((sum, i) => {
                      const usd = i.amount;
                      const rate = CURRENCIES.find(c => c.code === displayCurrency)?.rate || 1;
                      return sum + usd * rate;
                    }, 0)
                    .toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">High Priority</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {mockPaymentApprovalQueue.filter((i) => i.priority === 'high').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3 w-full">

            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Quick Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 dark:text-white"
              />
            </div>

            {/* New Request — always visible */}
            <Button
              size="sm"
              onClick={() => setViewMode('form')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 h-9 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" />
              New Request
            </Button>

            {/* Right Side Controls — desktop only, mobile has its own compact dropdown below */}
            <div className="hidden sm:flex items-center gap-2 sm:w-auto sm:ml-auto">

              {/* Select All — desktop only */}
              <Button
                size="sm"
                variant="outline"
                onClick={toggleSelectAll}
                className="h-8 px-3 text-xs whitespace-nowrap"
              >
                Select All
              </Button>

              {/* Currency Dropdown */}
              <div className="relative w-[150px] sm:w-[180px]">
                <select
                  value={displayCurrency}
                  onChange={(e) => setDisplayCurrency(e.target.value)}
                  className="appearance-none w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 pr-7 text-xs text-gray-800 dark:text-gray-200"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.label}
                    </option>
                  ))}
                </select>

                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                  ▼
                </span>
              </div>

              {/* Filter */}
              

            </div>
          </div>

          {/* Mobile Select All Row — matches PO page style */}
          <div className="sm:hidden flex flex-row items-center justify-between w-full">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={filteredQueue.length > 0 && selectedIds.size === filteredQueue.length}
                onChange={toggleSelectAll}
                className="h-5 w-5 rounded border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-blue-500 focus:ring-blue-500"
              />
              <span className={`text-sm font-medium ${selectedIds.size > 0 ? 'text-blue-600 dark:text-blue-500' : 'text-gray-600 dark:text-gray-400'}`}>
                Select All
              </span>
            </label>
            <div className="flex items-center gap-3">
              <span className={`text-xs ${selectedIds.size > 0 ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500'}`}>
                {selectedIds.size > 0 ? `${selectedIds.size} selected` : `${totalPending} pending`}
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
              { id: 'all', label: 'All', count: mockPaymentApprovalQueue.length },
              { id: 'pending', label: 'Pending', count: totalPending },
              { id: 'approved', label: 'Approved', count: mockPaymentApprovalQueue.filter(o => o.status === 'approved').length },
              { id: 'rejected', label: 'Rejected', count: mockPaymentApprovalQueue.filter(o => o.status === 'rejected').length },
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
          <div className="hidden sm:flex w-full">
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2 w-full justify-end">
                <span className="text-xs text-gray-500 font-medium">{selectedIds.size} selected</span>
                <Button size="sm" variant="success">
                  <CheckCircle2 className="h-4 w-4" />
                  Approve
                </Button>
                <Button size="sm" variant="destructive">
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
                <Button size="sm" variant="warning">
                  <RotateCcw className="h-4 w-4" />
                  Return
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Approval Queue Table */}
        <div className="hidden sm:block rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/50 px-4 sm:px-5 py-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500 dark:text-slate-400" />
              <h3 className="text-sm font-bold text-gray-700 dark:text-slate-200">Pending Requests</h3>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/20">
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
                      title="Select All"
                    />
                  </th>
                  <th className="px-4 py-3 text-left w-10" />
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Request #</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Supplier</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Request Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Due Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Requested By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
                {filteredQueue.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition-colors duration-150 text-gray-700 dark:text-slate-300 ${selectedIds.has(item.id) ? 'bg-blue-50/50 dark:bg-blue-900/20' : 'hover:bg-gray-50/80 dark:hover:bg-slate-800/50'
                      }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:bg-slate-700"
                      />
                    </td>
                    <td className="px-4 py-3 w-10">
                      <button className="w-4 h-4 opacity-0"></button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedRequest(item.id)}
                        className="inline-flex items-center px-2.5 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-800 dark:hover:text-blue-300 rounded-md font-medium text-xs transition-all shadow-sm border border-blue-200/50 dark:border-blue-800/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        title="View Details"
                      >
                        <span className="font-mono tracking-tight">{item.requestNumber}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{item.supplier}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white font-mono">
                      ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-xs">{item.requestDate}</td>
                    <td className="px-4 py-3 text-xs">{item.dueDate}</td>
                    <td className="px-4 py-3 text-xs">{item.category}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={priorityVariants[item.priority]}>
                        {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs">{item.requestedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredQueue.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-slate-500">
              <CreditCard className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No pending requests</p>
              <p className="text-xs mt-1">All payment requests have been processed</p>
            </div>
          )}
        </div>

        {/* Mobile Card List */}
        <div className="sm:hidden flex flex-col gap-4 pb-20 mt-2">
          {filteredQueue.map((item) => {
            const isSelected = selectedIds.has(item.id);

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

            const pStyles = getPriorityStyles(item.priority || '');
            const sStyles = getStatusStyles(item.status || 'pending');

            return (
              <div
                key={item.id}
                className={`flex flex-col p-4 rounded-xl shadow-sm transition-colors ${isSelected
                    ? 'bg-blue-50/40 dark:bg-blue-900/10 border-[1.5px] border-blue-400 dark:border-blue-800'
                    : 'bg-white dark:bg-slate-900 border-[1px] border-gray-200 dark:border-slate-800'
                  }`}
              >
                {/* Top Row: Request Number and Checkbox */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedRequest(item.id)}
                      className="font-mono text-[13px] font-semibold text-gray-400 dark:text-slate-400 text-left hover:text-gray-600 dark:hover:text-slate-300 uppercase tracking-wide"
                    >
                      {item.requestNumber}
                    </button>
                    <div className="flex items-center gap-2">
                      {item.priority && (
                        <span className={`px-2 py-[3px] rounded border flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${pStyles.bg}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${pStyles.dot}`}></span>
                          {item.priority}
                        </span>
                      )}
                      <span className={`px-2 py-[3px] rounded border text-[10px] font-bold uppercase tracking-wider ${sStyles}`}>
                        {item.status || 'pending'}
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(item.id)}
                    className="h-5 w-5 rounded-[4px] border-gray-300 dark:border-slate-600 text-blue-500 focus:ring-0 checked:bg-blue-500 mt-0.5 bg-transparent"
                  />
                </div>

                {/* Middle Row: Supplier and Amount */}
                <div className="flex flex-col gap-1 mt-3">
                  <div className="text-[17px] font-bold text-slate-800 dark:text-white leading-tight">
                    {item.supplier}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-1.5 py-0.5 rounded-[4px] border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 text-[10px] font-bold text-gray-500 dark:text-slate-400">
                      {displayCurrency}
                    </span>
                    <span className="text-[22px] font-extrabold text-slate-900 dark:text-gray-50 tracking-tight">
                      {(item.amount * (CURRENCIES.find(c => c.code === displayCurrency)?.rate || 1)).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Badges/Category */}
                {item.category && (
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <button
                      className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 dark:bg-[#1a1d2d]/80 border border-gray-200 dark:border-slate-700/60 transition-colors group rounded-md"
                    >
                      <span className="text-[10px] font-medium text-gray-500 dark:text-slate-400">{item.category}</span>
                    </button>
                  </div>
                )}

                <hr className="border-gray-100 dark:border-slate-800/80 my-3.5" />

                {/* Bottom Row: Dates and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[4px] text-[11px] font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wide">
                    <span>Due</span>
                    <span className="font-bold text-gray-600 dark:text-slate-300">{item.dueDate.substring(0, 6)}</span>
                    <span className="mx-1 text-gray-300 dark:text-slate-600 text-[10px]">•</span>
                    <span>Req</span>
                    <span className="font-bold text-gray-600 dark:text-slate-300">{item.requestDate.substring(0, 6)}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-[8px] border-gray-200 dark:border-slate-700 shadow-sm text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                      onClick={() => setSelectedRequest(item.id)}
                    >
                      <MoreHorizontal className="h-[14px] w-[14px]" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-[8px] shadow-sm border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-800"
                    >
                      <X className="h-[14px] w-[14px]" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-[8px] shadow-sm border-blue-200 dark:border-blue-900/50 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-800"
                    >
                      <Check className="h-[14px] w-[14px]" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredQueue.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-slate-500">
              <CreditCard className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No pending requests</p>
              <p className="text-xs mt-1">All payment requests have been processed</p>
            </div>
          )}
        </div>

        {/* Transaction Detail Modal */}
        {selectedRequest && (() => {
          const req = mockPaymentRequests.find((r) =>
            mockPaymentApprovalQueue.find((q) => q.id === selectedRequest)?.requestNumber === r.requestNumber
          );

          if (!req) return null;

          return (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">

              <div className="bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-slate-800">

                {/* Header */}
                <div className="px-4 sm:px-6 py-4 flex items-center justify-between 
bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex-shrink-0">
                  <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                    {req.requestNumber} — Transaction Breakdown
                  </h3>
                  <button onClick={() => setSelectedRequest(null)} className="ml-2 flex-shrink-0">
                    <XCircle className="h-6 w-6 text-white hover:text-gray-200" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                  <div className="rounded-lg border border-gray-200 dark:border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-slate-800/80">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-400">Description</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-400">Account</th>
                            <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 dark:text-slate-400">Amount</th>
                            <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 dark:text-slate-400">Tax Code</th>
                            <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 dark:text-slate-400">Tax</th>
                            <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 dark:text-slate-400">Total</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-700 dark:text-slate-300">
                          {req.lineItems.map((li) => (
                            <tr key={li.id} className="dark:bg-slate-900/50">
                              <td className="px-4 py-2 text-gray-900 dark:text-white font-medium">{li.description}</td>
                              <td className="px-4 py-2">{li.account}</td>
                              <td className="px-4 py-2 text-right">{li.amount.toLocaleString()}</td>
                              <td className="px-4 py-2 text-center">{li.taxCode}</td>
                              <td className="px-4 py-2 text-right">{li.taxAmount.toLocaleString()}</td>
                              <td className="px-4 py-2 text-right font-semibold text-gray-900 dark:text-white">{li.total.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex items-center justify-end gap-3 w-full">
                  <Button
                    variant="destructive"
                    onClick={() => setSelectedRequest(null)}
                    className="whitespace-nowrap"
                  >
                    Reject
                  </Button>

                  <Button
                    variant="success"
                    onClick={() => setSelectedRequest(null)}
                    className="whitespace-nowrap"
                  >
                    Approve
                  </Button>

                </div>

              </div>
            </div>
          );
        })()}

        {/* Floating Action Bar for Mobile — hidden when drawer is open */}
        {selectedIds.size > 0 && !selectedRequest && (
          <div className="sm:hidden fixed bottom-0 left-0 right-0 px-2 py-3 bg-white/90 dark:bg-[#11131e]/90 backdrop-blur-md border-t border-gray-200 dark:border-slate-800 z-40 pb-safe">
            <div className="w-full flex items-center justify-between gap-1">
              <div className="flex-shrink-0 h-11 px-2 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-[#1c2132] border border-blue-100 dark:border-slate-700 font-bold text-blue-600 dark:text-blue-400 text-xs">
                {selectedIds.size} sel.
              </div>

              <Button className="flex-1 min-w-0 h-11 px-2 rounded-xl bg-red-600 hover:bg-red-700 dark:bg-[#e74c3c] dark:hover:bg-[#c0392b] text-white font-bold text-xs">
                Reject
              </Button>

              <Button className="flex-1 min-w-0 h-11 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-[#2ecc71] dark:hover:bg-[#27ae60] text-white font-bold text-xs">
                Approve
              </Button>

              <Button className="flex-1 min-w-0 h-11 px-2 rounded-xl bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-bold text-xs">
                Return
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}