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

  const filteredInvoices = useMemo(() => {
    return mockSupplierInvoices.filter((inv) => {
      return !searchQuery ||
        inv.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.refNumber.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
                  <th className="px-4 py-3 text-left w-10" />
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
                    onToggle={() => toggleRow(invoice.id)}
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
    </div>
  );
}

// ================================================
// Invoice Row with expandable GRN Details
// ================================================
function InvoiceRow({
  invoice,
  isExpanded,
  onToggle,
}: {
  invoice: SupplierInvoice;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="hover:bg-gray-50/80 transition-colors duration-150">
        <td className="px-4 py-3">
          <button
            onClick={onToggle}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </td>
        <td className="px-4 py-3 font-mono text-xs text-gray-700">{invoice.refNumber}</td>
        <td className="px-4 py-3 font-medium text-gray-900">{invoice.supplier}</td>
        <td className="px-4 py-3 font-mono text-xs text-gray-700">{invoice.invoiceNumber}</td>
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
          <td colSpan={11} className="bg-slate-50/80 px-4 py-0">
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
