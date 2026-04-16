import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { FileAttachmentModal } from '@/components/FileAttachmentModal';
import { mockSupplierInvoices, mockAttachments } from '@/mocks/data';
import { useSidebar } from '@/hooks/useSidebar';
import {
  Search,
  AlertTriangle,
  DollarSign,
  Eye,
  FileText,
  XCircle,
  CheckCircle2,
  RotateCcw,
  Check,
  X,
  MoreHorizontal,
  ShoppingCart,
  ChevronDown,
} from 'lucide-react';
import type { SupplierInvoice } from '@/types';
import { usePurchaseOrders } from '@/hooks/usePurchaseOrders';

const statusVariants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  pending: 'warning',
  approved: 'success',
  overdue: 'danger',
  paid: 'info',
};

type TabType = 'home' | 'reports' | 'exception' | 'release';

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

export function AccountsPayablePage() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showPOModal, setShowPOModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState<string | null>(null);
  const [selectedInvoiceDetails, setSelectedInvoiceDetails] = useState<SupplierInvoice | null>(null);

  useEffect(() => {
    if (selectedInvoiceDetails || showPOModal || showFilesModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedInvoiceDetails, showPOModal, showFilesModal]);

  const { collapsed } = useSidebar();

  // Clear selections when sidebar opens (on mobile)
  useEffect(() => {
    if (!collapsed) {
      setSelectedRows(new Set());
    }
  }, [collapsed]);

  const [displayCurrency, setDisplayCurrency] = useState("KES");
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredInvoices = useMemo(() => {
    return mockSupplierInvoices.filter((inv) => {
      const matchesSearch = !searchQuery ||
        inv.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.refNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const selectableCount = filteredInvoices.filter(inv => inv.status !== 'approved').length;
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
    const selectableIds = filteredInvoices
      .filter((inv) => inv.status !== 'approved')
      .map((inv) => inv.id);
    if (selectedRows.size === selectableIds.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(selectableIds));
    }
  };

  const handlePOClick = (poNumber: string) => {
    setSelectedPO(poNumber);
    setShowPOModal(true);
  };

  const pendingCount = mockSupplierInvoices.filter((i) => i.status === 'pending').length;
  const overdueCount = mockSupplierInvoices.filter((i) => i.status === 'overdue').length;
  const convertedTotal = useMemo(() => {
    return mockSupplierInvoices.reduce((sum, inv) => {
      const fromRate = EXCHANGE_RATES["USD"];
      const toRate = EXCHANGE_RATES[displayCurrency];

      if (!fromRate || !toRate) return sum;

      const usd = inv.netValue / fromRate;
      const converted = usd * toRate;

      return sum + converted;
    }, 0);
  }, [displayCurrency]);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'reports', label: 'Payment Reports' },
    { id: 'exception', label: 'Exception' },
    { id: 'release', label: 'Release Payment' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 overflow-x-hidden">
      <Header
        title="Supplier Invoices Due"
        subtitle="Accounts Payable — Invoice approval and GRN matching"
      />

      <div className="p-3 sm:p-6 space-y-4">
        {/* Navigation Tabs - scrollable on mobile */}
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-sm overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                ? tab.id === 'exception'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : tab.id === 'release'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-3 sm:p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Total Invoices</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{mockSupplierInvoices.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-3 sm:p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Pending</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-3 sm:p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Overdue</p>
                <p className="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400">{overdueCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-3 sm:p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Total Value</p>
                <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                  {displayCurrency} {convertedTotal.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search + Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-3 flex-1 w-full">

            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-400" />

              <Input
                placeholder="Search by supplier, invoice, or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Button */}
            <Button size="sm" variant="outline" className="hidden sm:inline-flex whitespace-nowrap flex-shrink-0">
              <Eye className="h-4 w-4" />
              View Details
            </Button>

          </div>

          {/* RIGHT SIDE (CURRENCY) — desktop only, mobile has its own compact dropdown below */}
          <div className="hidden sm:block sm:w-auto sm:ml-auto">
            <div className="flex items-center justify-between sm:justify-end gap-2 w-full">

              {/* Select All Button — desktop only */}
              <Button
                size="sm"
                variant="outline"
                onClick={toggleSelectAll}
                className="hidden sm:flex h-8 px-3 text-xs whitespace-nowrap"
              >
                Select All
              </Button>

              {/* Currency Dropdown */}
              <div className="relative w-[200px] sm:w-[250px]">
                <select
                  value={displayCurrency}
                  onChange={(e) => setDisplayCurrency(e.target.value)}
                  className="appearance-none h-9 w-full cursor-pointer rounded-xl border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 pr-8 text-sm font-semibold text-gray-800 dark:text-gray-200 truncate"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} — {c.label}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                  ▼
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Mobile Select All Row — matches PO page style */}
        <div className="sm:hidden flex flex-row items-center justify-between w-full">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectableCount > 0 && selectedRows.size === selectableCount}
              onChange={toggleSelectAll}
              className="h-5 w-5 rounded border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-blue-500 focus:ring-blue-500"
            />
            <span className={`text-sm font-medium ${selectedRows.size > 0 ? 'text-blue-600 dark:text-blue-500' : 'text-gray-600 dark:text-gray-400'}`}>
              Select All
            </span>
          </label>
          <div className="flex items-center gap-3">
            <span className={`text-xs ${selectedRows.size > 0 ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500'}`}>
              {selectedRows.size > 0 ? `${selectedRows.size} selected` : `${selectableCount} pending`}
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

        <div className="hidden sm:flex w-full mt-2">
          {selectedRows.size > 0 && (
            <div className="flex items-center gap-3 w-full justify-end">
              <span className="text-sm text-gray-400 whitespace-nowrap">
                {selectedRows.size} selected
              </span>

              <Button size="sm" variant="success" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Approve
              </Button>

              <Button size="sm" variant="destructive" className="rounded-full px-4">
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>

              <Button size="sm" variant="warning" className="rounded-full px-4">
                <RotateCcw className="h-4 w-4 mr-1" />
                Return
              </Button>
            </div>
          )}
        </div>

        {/* Invoices Table */}
        <div className="hidden sm:block rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider w-10">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === selectableCount && selectableCount > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      title="Select All"
                    />
                  </th>
                  <th className="px-4 py-3 text-left w-10" />
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">PO Number</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Ref #</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Supplier</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Invoice #</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Net Value</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Due Date</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Days</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Approver 1</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Comment</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Appr. Date</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
                {filteredInvoices.map((invoice) => (
                  <InvoiceRow
                    key={invoice.id}
                    invoice={invoice}
                    isExpanded={expandedRows.has(invoice.id)}
                    isSelected={selectedRows.has(invoice.id)}
                    onToggle={() => toggleRow(invoice.id)}
                    onToggleSelect={() => toggleSelect(invoice.id)}
                    onPOClick={handlePOClick}
                    onInvoiceClick={(inv) => setSelectedInvoiceDetails(inv)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {filteredInvoices.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-slate-500">
              <FileText className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No invoices found</p>
              <p className="text-xs mt-1">Try adjusting your search</p>
            </div>
          )}
        </div>

        {/* Mobile Filter Chips */}
        <div className="sm:hidden flex items-center gap-2 px-4 py-2 overflow-x-auto hide-scrollbar border-b border-gray-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mb-4">
          {['all', 'pending', 'approved', 'overdue', 'paid'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-bold capitalize whitespace-nowrap transition-colors ${statusFilter === status
                  ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                  : 'bg-white dark:bg-[#1a1d2d] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700/60'
                }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Mobile Card List */}
        <div className="sm:hidden flex flex-col gap-4 pb-32 mt-2">
          {filteredInvoices.map((invoice) => {
            const isSelected = selectedRows.has(invoice.id);
            const poNumber = invoice.grnDetails[0]?.purchaseOrder || 'N/A';

            const getStatusStyles = (status: string) => {
              if (status === 'paid') return 'bg-blue-50/50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400';
              if (status === 'approved') return 'bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400';
              if (status === 'overdue') return 'bg-red-50/50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400';
              return 'bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400'; // pending
            };

            const sStyles = getStatusStyles(invoice.status);

            return (
              <div
                key={invoice.id}
                className={`flex flex-col p-4 rounded-xl shadow-sm transition-colors ${isSelected
                    ? 'bg-blue-50/40 dark:bg-blue-900/10 border-[1.5px] border-blue-400 dark:border-blue-800'
                    : 'bg-white dark:bg-slate-900 border-[1px] border-gray-200 dark:border-slate-800'
                  }`}
              >
                {/* Top Row: Invoice Number and Checkbox */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedInvoiceDetails(invoice)}
                      className="font-mono text-[13px] font-semibold text-gray-400 dark:text-slate-400 text-left hover:text-gray-600 dark:hover:text-slate-300 uppercase tracking-wide"
                    >
                      {invoice.invoiceNumber}
                    </button>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-[3px] rounded border text-[10px] font-bold uppercase tracking-wider ${sStyles}`}>
                        {invoice.approvalStatus || invoice.status}
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(invoice.id)}
                    disabled={invoice.status === 'approved' || invoice.status === 'paid'}
                    className="h-5 w-5 rounded-[4px] border-gray-300 dark:border-slate-600 text-blue-500 focus:ring-0 checked:bg-blue-500 mt-0.5 bg-transparent"
                  />
                </div>

                {/* Middle Row: Supplier and Amount */}
                <div className="flex flex-col gap-1 mt-3">
                  <div className="text-[17px] font-bold text-slate-800 dark:text-white leading-tight">
                    {invoice.supplier}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-1.5 py-0.5 rounded-[4px] border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 text-[10px] font-bold text-gray-500 dark:text-slate-400">
                      {displayCurrency}
                    </span>
                    <span className={`text-[22px] font-extrabold tracking-tight ${invoice.netValue > 10000 && invoice.status === 'overdue' ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-gray-50'}`}>
                      {((invoice.netValue / EXCHANGE_RATES["USD"]) * EXCHANGE_RATES[displayCurrency]).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Links Row */}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <button
                    onClick={() => setSelectedInvoiceDetails(invoice)}
                    className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 dark:bg-[#1a1d2d]/80 border border-gray-200 dark:border-slate-700/60 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors group"
                  >
                    <FileText className="h-3 w-3 text-blue-500 group-hover:text-blue-600 dark:text-blue-400" />
                    <span className="font-mono text-[10px] font-bold text-gray-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{invoice.refNumber}</span>
                  </button>

                  {poNumber !== 'N/A' && (
                    <button
                      onClick={() => handlePOClick(poNumber)}
                      className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 dark:bg-[#1a1d2d]/80 border border-gray-200 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors group"
                    >
                      <ShoppingCart className="h-3 w-3 text-indigo-500 group-hover:text-indigo-600 dark:text-indigo-400" />
                      <span className="font-mono text-[10px] font-bold text-gray-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">PO: {poNumber}</span>
                    </button>
                  )}
                </div>

                <hr className="border-gray-100 dark:border-slate-800/80 my-3.5" />

                {/* Bottom Row: Dates and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[4px] text-[11px] font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wide">
                    <span>Due</span>
                    <span className="font-bold text-gray-600 dark:text-slate-300">{invoice.dueDate}</span>
                    <span className="mx-1 text-gray-300 dark:text-slate-600 text-[10px]">•</span>
                    <span>Aging</span>
                    <span className={`font-bold ${invoice.agingDays > 90 ? 'text-red-500 dark:text-red-400' : invoice.agingDays > 30 ? 'text-amber-500 dark:text-amber-400' : 'text-gray-600 dark:text-slate-300'}`}>{invoice.agingDays}d</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-[8px] border-gray-200 dark:border-slate-700 shadow-sm text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                      onClick={() => setSelectedInvoiceDetails(invoice)}
                    >
                      <MoreHorizontal className="h-[14px] w-[14px]" />
                    </Button>
                    {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredInvoices.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-slate-500">
              <FileText className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No invoices found</p>
              <p className="text-xs mt-1">Try adjusting your search</p>
            </div>
          )}
        </div>

        {/* Floating Action Bar for Mobile */}
        {selectedRows.size > 0 && (
          <div
            className="sm:hidden fixed bottom-0 left-0 right-0 px-2 pt-3 bg-white/90 dark:bg-[#11131e]/90 backdrop-blur-md border-t border-gray-200 dark:border-slate-800 z-50"
            style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))' }}
          >
            <div className="w-full flex items-center justify-between gap-1">
              <div className="flex-shrink-0 h-11 px-2 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-[#1c2132] border border-blue-100 dark:border-slate-700 font-bold text-blue-600 dark:text-blue-400 text-xs">
                {selectedRows.size} sel.
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

      {/* File Attachment Modal */}
      <FileAttachmentModal
        isOpen={showFilesModal}
        onClose={() => setShowFilesModal(false)}
        attachments={mockAttachments}
        title="Invoice Attachments"
      />

      {/* PO Details Modal */}
      {showPOModal && selectedPO && (
        <PODetailsModal
          isOpen={showPOModal}
          onClose={() => {
            setShowPOModal(false);
            setSelectedPO(null);
          }}
          poNumber={selectedPO}
        />
      )}

      {/* Invoice Details Modal */}
      {selectedInvoiceDetails && (
        <InvoiceDetailsModal
          isOpen={true}
          onClose={() => setSelectedInvoiceDetails(null)}
          invoice={selectedInvoiceDetails}
        />
      )}
    </div>
  );
}

// ================================================
// PO Details Modal
// ================================================
interface PODetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  poNumber: string;
}

function PODetailsModal({ isOpen, onClose, poNumber }: PODetailsModalProps) {
  const { data: requestResult } = usePurchaseOrders();
  // Find exact match, or fallback to the first available mock order so the UI preview works beautifully
  const order = requestResult?.orders.find(o => o.poNumber === poNumber) || requestResult?.orders[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in">
      <div className="bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in border border-gray-200 dark:border-slate-800">

        {/* HEADER */}
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex-shrink-0">
          <h3 className="text-base sm:text-lg font-semibold text-white truncate">Purchase Order: {poNumber}</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white ml-2 flex-shrink-0">
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-slate-950">
          {!order ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <FileText className="h-10 w-10 mb-2 opacity-50" />
              <p>Details not found for {poNumber}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Order Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Supplier</p>
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{order.supplier}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Amount</p>
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{order.currency} {order.amount.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Order Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{order.orderDate}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
                  <Badge variant={order.status === 'pending' ? 'warning' : order.status === 'approved' ? 'success' : 'danger'}>
                    {order.status}
                  </Badge>
                </div>
              </div>

              {/* Line Items */}
              <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                <div className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/50 px-4 py-3">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-200">Line Items</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-500 dark:text-slate-400">
                        <th className="px-4 py-3 text-left font-medium">Item</th>
                        <th className="px-4 py-3 text-right font-medium">Qty</th>
                        <th className="px-4 py-3 text-left font-medium">UOM</th>
                        <th className="px-4 py-3 text-right font-medium">Unit Price</th>
                        <th className="px-4 py-3 text-right font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-slate-800/60">
                      {order.lineItems?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50">
                          <td className="px-4 py-3 text-gray-900 dark:text-white">{item.description}</td>
                          <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{item.quantity}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{item.uom}</td>
                          <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{item.unitPrice.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">{item.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 flex justify-end gap-3 flex-shrink-0 pb-safe">
          <Button variant="outline" className="rounded-full px-5" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

// ================================================
// Invoice Row with expandable GRN Details (Desktop)
// ================================================
function InvoiceRow({
  invoice,
  isExpanded,
  isSelected,
  onToggle,
  onToggleSelect,
  onPOClick,
  onInvoiceClick,
}: {
  invoice: SupplierInvoice;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onToggleSelect: () => void;
  onPOClick: (poNumber: string) => void;
  onInvoiceClick: (invoice: SupplierInvoice) => void;
}) {
  const poNumber = invoice.grnDetails[0]?.purchaseOrder || 'N/A';

  return (
    <>
      <tr className={`transition-colors duration-150 text-gray-700 dark:text-slate-300 ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/20' : 'hover:bg-gray-50/80 dark:hover:bg-slate-800/50'
        }`}>
        <td className="px-4 py-3">
          <input
            type="checkbox"
            checked={isSelected}
            disabled={invoice.status === 'approved'}
            onChange={onToggleSelect}
            className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-blue-600 disabled:opacity-40 cursor-pointer dark:bg-slate-700"
          />
        </td>
        <td className="px-4 py-3">
        </td>
        <td className="px-4 py-3">
          <button
            onClick={() => onPOClick(poNumber)}
            className="inline-flex items-center px-2.5 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-800 dark:hover:text-blue-300 rounded-md font-medium text-xs transition-all shadow-sm border border-blue-200/50 dark:border-blue-800/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            title="View PO Details"
          >
            <span className="font-mono whitespace-nowrap">{poNumber}</span>
          </button>
        </td>
        <td className="px-4 py-3 font-mono text-xs">{invoice.refNumber}</td>
        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{invoice.supplier}</td>
        <td className="px-4 py-3">
          <button
            onClick={() => onInvoiceClick(invoice)}
            className="inline-flex items-center px-2.5 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-800 dark:hover:text-blue-300 rounded-md font-medium text-xs transition-all shadow-sm border border-blue-200/50 dark:border-blue-800/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            title="View Invoice Details"
          >
            <span className="font-mono tracking-tight">{invoice.invoiceNumber}</span>
          </button>
        </td>
        <td className="px-4 py-3 text-right">
          <span className={`font-semibold ${invoice.netValue > 10000 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
            $ {invoice.netValue.toLocaleString(undefined, { minimumFractionDigits: 0 })}
          </span>
        </td>
        <td className="px-4 py-3 text-xs">{invoice.dueDate}</td>
        <td className="px-4 py-3 text-right">
          <span className={`font-mono text-xs font-semibold ${invoice.agingDays > 90 ? 'text-red-600 dark:text-red-400' : invoice.agingDays > 30 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400'
            }`}>
            {invoice.agingDays}
          </span>
        </td>
        <td className="px-4 py-3 text-xs">{invoice.approver1 || '—'}</td>
        <td className="px-4 py-3 text-xs">{invoice.comment || '—'}</td>
        <td className="px-4 py-3 text-xs">{invoice.approvalDate1 || '—'}</td>
        <td className="px-4 py-3 text-center">
          <Badge variant={statusVariants[invoice.status]}>
            {invoice.approvalStatus}
          </Badge>
        </td>
      </tr>
    </>
  );
}

// ================================================
// Invoice Details Modal
// ================================================
interface InvoiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: SupplierInvoice;
}

function InvoiceDetailsModal({ isOpen, onClose, invoice }: InvoiceDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in">
      <div className="bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in border border-gray-200 dark:border-slate-800">

        {/* HEADER */}
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex-shrink-0">
          <h3 className="text-base sm:text-lg font-semibold text-white truncate">
            Invoice Breakdown: {invoice.invoiceNumber}
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white ml-2 flex-shrink-0">
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-slate-950">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Supplier</p>
              <p className="font-semibold text-gray-900 dark:text-white truncate">{invoice.supplier}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ref Number</p>
              <p className="font-mono font-semibold text-gray-900 dark:text-white truncate">{invoice.refNumber}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Due Date</p>
              <p className="font-semibold text-gray-900 dark:text-white truncate">{invoice.dueDate}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Approval Status</p>
              <Badge className="capitalize" variant={invoice.status === 'pending' ? 'warning' : invoice.status === 'approved' ? 'success' : 'danger'}>
                {invoice.approvalStatus || invoice.status}
              </Badge>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/50 px-4 py-3 flex items-center justify-between">
              <h4 className="font-semibold text-gray-700 dark:text-gray-200">Matching GRN Details</h4>
              <span className="text-xs text-gray-500 dark:text-slate-400">Total Net: ${invoice.netValue.toLocaleString()}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-500 dark:text-slate-400">
                    <th className="px-4 py-3 text-left font-medium">Item Code</th>
                    <th className="px-4 py-3 text-left font-medium">Description</th>
                    <th className="px-4 py-3 text-left font-medium">Warehouse</th>
                    <th className="px-4 py-3 text-right font-medium">Qty Rcvd</th>
                    <th className="px-4 py-3 text-right font-medium">Matched Val</th>
                    <th className="px-4 py-3 text-right font-medium">Tax Ext.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800/60">
                  {invoice.grnDetails.map((item) => {
                    const tax = item.matchedValue * 0.16;
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3 text-gray-900 dark:text-white font-mono text-xs">{item.stockCode}</td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white">{item.description}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{item.warehouse}</td>
                        <td className="px-4 py-3 text-right text-gray-600 dark:text-slate-300">{item.qtyReceived} <span className="text-xs text-gray-400">{item.uom}</span></td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">${item.matchedValue.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">${tax.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 flex flex-wrap justify-end gap-3 flex-shrink-0 pb-safe">
          <Button variant="outline" className="rounded-full px-5" onClick={onClose}>
            Cancel
          </Button>
          {(invoice.status === 'pending' || invoice.status === 'overdue') && (
            <>
              <Button variant="destructive" className="rounded-full px-5" onClick={onClose}>
                Reject
              </Button>
              <Button variant="success" className="rounded-full px-5" onClick={onClose}>
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Approve
              </Button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
