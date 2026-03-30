import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockAuditTrailEntries } from '@/mocks/data';
import {
  Search,
  FileText,
  FileSpreadsheet,
  Filter,
  Eye,
  ClipboardList,
} from 'lucide-react';

export function AuditTrailPage() {
  const [filterText, setFilterText] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEntries = useMemo(() => {
    return mockAuditTrailEntries.filter((entry) => {
      const matchesText = !filterText ||
        entry.poNumber.toLowerCase().includes(filterText.toLowerCase()) ||
        entry.supplier.toLowerCase().includes(filterText.toLowerCase());
      const matchesSupplier = supplierFilter === 'all' || entry.supplier === supplierFilter;
      const matchesStatus = statusFilter === 'all' || entry.approvalStatus === statusFilter;
      return matchesText && matchesSupplier && matchesStatus;
    });
  }, [filterText, supplierFilter, statusFilter]);

  const suppliers = [...new Set(mockAuditTrailEntries.map((e) => e.supplier))];
  const statuses = [...new Set(mockAuditTrailEntries.map((e) => e.approvalStatus))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Audit Trail"
        subtitle="Comprehensive approval history and reporting"
      />

      <div className="p-6 space-y-5">
        {/* Page Title */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <ClipboardList className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Purchase Order Approval Report</h3>
          </div>
          <p className="text-sm text-gray-500 ml-8">
            Every action is logged. Trace who approved a transaction, when they did it, and the value at the time.
          </p>
        </div>

        {/* Filters Row */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Filter
              </label>
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Select..."
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Supplier
              </label>
              <select
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Select supplier</option>
                {suppliers.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Appr. Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Select status</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <Button variant="default" className="h-[42px] px-6">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
            <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
              <FileText className="h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="success" size="sm">
              <FileSpreadsheet className="h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Audit Trail Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">PO #</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Supplier</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Entry Date</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500 text-xs uppercase tracking-wider">Value</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500 text-xs uppercase tracking-wider">Appr. Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Approver 1</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Approver 2</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Appr. Date 1</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">Appr. Date 2</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500 text-xs uppercase tracking-wider">Files</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-blue-50/30 transition-colors duration-150">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-gray-900">{entry.poNumber}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="success" className="text-[10px]">
                        {entry.statusLabel}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{entry.supplier}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{entry.entryDate}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 font-mono">
                      ${entry.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="success">{entry.approvalStatus}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-xs">{entry.approver1}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs">{entry.approver2 || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{entry.approvalDate1 || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{entry.approvalDate2 || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      {entry.hasFiles ? (
                        <button className="rounded p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEntries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <ClipboardList className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No audit entries found</p>
              <p className="text-xs mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
