import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { FileAttachmentModal } from '@/components/FileAttachmentModal';
import { mockSupplierInvoices, mockAttachments } from '@/mocks/data';
import {
  Search,
  Home,
  BarChart3,
  AlertTriangle,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Eye,
  FileText,
  XCircle,
  CheckCircle2,
} from 'lucide-react';
import type { SupplierInvoice } from '@/types';

const statusVariants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  pending: 'warning',
  approved: 'success',
  overdue: 'danger',
  paid: 'info',
};

type TabType = 'home' | 'reports' | 'exception' | 'release';

export function AccountsPayablePage() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showPOModal, setShowPOModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState<string | null>(null);
  const [selectedInvoiceDetails, setSelectedInvoiceDetails] = useState<SupplierInvoice | null>(null);

  const filteredInvoices = useMemo(() => {
    return mockSupplierInvoices.filter((inv) => {
      return !searchQuery ||
        inv.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.refNumber.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

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
    .filter((inv) => inv.status !== 'approved') // ❗ approved hata diye
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
  const totalValue = mockSupplierInvoices.reduce((sum, i) => sum + i.netValue, 0);

  const tabs: { id: TabType; label: string; variant?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'reports', label: 'Payment Reports' },
    { id: 'exception', label: 'Exception' },
    { id: 'release', label: 'Release Payment' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Supplier Invoices Due"
        subtitle="Accounts Payable — Invoice approval and GRN matching"
      />

      <div className="p-6 space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? tab.id === 'exception'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : tab.id === 'release'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Invoices</p>
                <p className="text-xl font-bold text-gray-900">{mockSupplierInvoices.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Pending</p>
                <p className="text-xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Overdue</p>
                <p className="text-xl font-bold text-red-600">{overdueCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Value</p>
                <p className="text-xl font-bold text-gray-900">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search + Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search-invoices"
              placeholder="Search by supplier, invoice, or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
  {selectedRows.size > 0 && (
    <>
      <span className="text-xs text-gray-500 font-medium mr-2">
        {selectedRows.size} selected
      </span>

      

      {/* ✅ Accept */}
      <Button
        size="sm"
        variant="success"
        className="h-8 px-3 text-xs"
        onClick={() => {
          console.log("Approve selected:", Array.from(selectedRows));
        }}
        
      >
        Approve
      </Button>
      {/* ✅ Reject */}
      <Button
        size="sm"
        variant="destructive"
        className="h-8 px-3 text-xs"
        onClick={() => {
          console.log("Reject selected:", Array.from(selectedRows));
        }}
      >
        Reject
      </Button>
    </>
  )}

  {/* View Details (always right side) */}
  <Button size="sm" variant="outline" onClick={() => setShowFilesModal(true)}>
    <Eye className="h-4 w-4" />
    View Details
  </Button>
</div>
        </div>

        {/* Invoices Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider w-10">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === selectableCount && selectableCount > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      title="Select All"
                    />
                  </th>
                  <th className="px-4 py-3 text-left w-10" />
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">PO Number</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Ref #</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Supplier</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Invoice #</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500 text-xs uppercase tracking-wider">Net Value</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Due Date</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500 text-xs uppercase tracking-wider">Days</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Approver 1</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Comment</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Appr. Date</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
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
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FileText className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No invoices found</p>
              <p className="text-xs mt-1">Try adjusting your search</p>
            </div>
          )}
        </div>
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Purchase Order Details</h3>
            <p className="text-sm text-blue-100">PO# {poNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Supplier</p>
                <p className="text-sm font-medium text-gray-900 mt-1">Acme Corporation Ltd.</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Order Date</p>
                <p className="text-sm font-medium text-gray-900 mt-1">2024-03-15</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Due Date</p>
                <p className="text-sm font-medium text-gray-900 mt-1">2024-04-15</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Total Amount</p>
                <p className="text-sm font-bold text-gray-900 mt-1">$45,230.00</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Line Items</h4>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Item</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Description</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Qty</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Unit Price</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr className="hover:bg-blue-50/30">
                      <td className="px-4 py-2.5 text-gray-700">1</td>
                      <td className="px-4 py-2.5 text-gray-900 font-medium">Industrial Equipment</td>
                      <td className="px-4 py-2.5 text-right text-gray-700 font-mono">150</td>
                      <td className="px-4 py-2.5 text-right text-gray-700 font-mono">$301.53</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-gray-900 font-mono">$45,230.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================================================
// Invoice Row with expandable GRN Details
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
  // Extract PO number from GRN details
  const poNumber = invoice.grnDetails[0]?.purchaseOrder || 'N/A';

  return (
    <>
      <tr className={`transition-colors duration-150 ${
        isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50/80'
      }`}>
        <td className="px-4 py-3">
          <input
  type="checkbox"
  checked={isSelected}
  disabled={invoice.status === 'approved'} // 🔥 main logic
  onChange={onToggleSelect}
  className="h-4 w-4 rounded border-gray-300 text-blue-600 disabled:opacity-40 cursor-pointer"
/>
        </td>
        <td className="px-4 py-3">
          
        </td>
        <td className="px-4 py-3">
          <button
            onClick={() => onPOClick(poNumber)}
            className="inline-flex items-center px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 rounded-md font-medium text-xs transition-all shadow-sm border border-blue-200/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            title="View PO Details"
          >
            <span className="font-mono whitespace-nowrap">{poNumber}</span>
          </button>
        </td>
        <td className="px-4 py-3 font-mono text-xs text-gray-700">{invoice.refNumber}</td>
        <td className="px-4 py-3 font-medium text-gray-900">{invoice.supplier}</td>
        <td className="px-4 py-3">
          <button
            onClick={() => onInvoiceClick(invoice)}
            className="inline-flex items-center px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 rounded-md font-medium text-xs transition-all shadow-sm border border-blue-200/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            title="View Invoice Details"
          >
            <span className="font-mono tracking-tight">{invoice.invoiceNumber}</span>
          </button>
        </td>
        <td className="px-4 py-3 text-right">
          <span className={`font-semibold ${invoice.netValue > 10000 ? 'text-red-600' : 'text-gray-900'}`}>
            $ {invoice.netValue.toLocaleString(undefined, { minimumFractionDigits: 0 })}
          </span>
        </td>
        <td className="px-4 py-3 text-gray-600 text-xs">{invoice.dueDate}</td>
        <td className="px-4 py-3 text-right">
          <span className={`font-mono text-xs font-semibold ${
            invoice.agingDays > 90 ? 'text-red-600' : invoice.agingDays > 30 ? 'text-amber-600' : 'text-gray-600'
          }`}>
            {invoice.agingDays}
          </span>
        </td>
        <td className="px-4 py-3 text-gray-700 text-xs">{invoice.approver1 || '—'}</td>
        <td className="px-4 py-3 text-gray-600 text-xs">{invoice.comment || '—'}</td>
        <td className="px-4 py-3 text-gray-600 text-xs">{invoice.approvalDate1 || '—'}</td>
        <td className="px-4 py-3 text-center">
          <Badge variant={statusVariants[invoice.status]}>
            {invoice.approvalStatus}
          </Badge>
        </td>
      </tr>
      {/* Expanded GRN Details */}
      {isExpanded && (
        <tr>
          <td colSpan={13} className="bg-slate-50/80 px-4 py-0">
            <div className="py-4 pl-10">
              <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    GRN Details — Goods Received
                  </h4>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Item</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Purchase Order</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">GRN</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Stock Code</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Description</th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">WH</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Qty Received</th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">UOM</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Delivery Note</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Matched Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {invoice.grnDetails.map((grn) => (
                      <tr key={grn.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-4 py-2.5 text-gray-700">{grn.item}</td>
                        <td className="px-4 py-2.5 text-gray-700 font-mono text-xs">{grn.purchaseOrder}</td>
                        <td className="px-4 py-2.5 text-gray-700 font-mono text-xs">{grn.grn}</td>
                        <td className="px-4 py-2.5 text-gray-700 font-mono text-xs">{grn.stockCode}</td>
                        <td className="px-4 py-2.5 text-gray-900 font-medium">{grn.description}</td>
                        <td className="px-4 py-2.5 text-gray-500 text-center text-xs">{grn.warehouse}</td>
                        <td className="px-4 py-2.5 text-right text-gray-700 font-mono">{grn.qtyReceived.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-gray-500 text-center text-xs">{grn.uom}</td>
                        <td className="px-4 py-2.5 text-gray-700 text-xs">{grn.deliveryNote}</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-gray-900 font-mono">
                          ${grn.matchedValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-200 bg-gray-50/50">
                      <td colSpan={9} className="px-4 py-2.5 text-right text-xs font-semibold text-gray-600 uppercase">
                        Total Matched
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-gray-900 font-mono">
                        ${invoice.grnDetails.reduce((s, g) => s + g.matchedValue, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </td>
        </tr>
      )}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Invoice Details: {invoice.invoiceNumber}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Supplier</p>
              <p className="font-medium text-gray-900 mt-1">{invoice.supplier}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Reference #</p>
              <p className="font-medium text-gray-900 mt-1">{invoice.refNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Due Date</p>
              <p className="font-medium text-gray-900 mt-1">{invoice.dueDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
              <Badge variant={statusVariants[invoice.status]} className="mt-1">
                {invoice.approvalStatus}
              </Badge>
            </div>
          </div>
          
          <div className="rounded-lg border border-gray-200 overflow-hidden mt-6">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                GRN Details — Goods Received
              </h4>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Item</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">PO #</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Description</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">WH</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Qty</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoice.grnDetails.map((grn) => (
                  <tr key={grn.id}>
                    <td className="px-4 py-2 text-gray-700">{grn.item}</td>
                    <td className="px-4 py-2 font-mono text-xs text-gray-700">{grn.purchaseOrder}</td>
                    <td className="px-4 py-2 text-gray-900 font-medium">{grn.description}</td>
                    <td className="px-4 py-2 text-center text-gray-500">{grn.warehouse}</td>
                    <td className="px-4 py-2 text-right text-gray-700">{grn.qtyReceived.toLocaleString()} {grn.uom}</td>
                    <td className="px-4 py-2 text-right font-semibold text-gray-900">${grn.matchedValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-200 bg-gray-50/50">
                  <td colSpan={5} className="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase">
                    Total Matched
                  </td>
                  <td className="px-4 py-2 text-right font-bold text-gray-900 font-mono">
                    ${invoice.grnDetails.reduce((s, g) => s + g.matchedValue, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 items-center">
          <Button variant="ghost" onClick={onClose} className="mr-auto">Close</Button>
          {(invoice.status === 'pending' || invoice.status === 'overdue') && (
            <>
              <Button variant="destructive" size="sm" onClick={onClose}>
  <XCircle className="h-4 w-4" />
  Reject
</Button>

<Button variant="success" size="sm" onClick={onClose}>
  <CheckCircle2 className="h-4 w-4" />
  Approve
</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
