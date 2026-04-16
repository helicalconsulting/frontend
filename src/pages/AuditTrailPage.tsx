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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Header
        title="Audit Trail"
        subtitle="Comprehensive approval history and reporting"
      />

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-5">
        {/* Page Title */}
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <ClipboardList className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
              Purchase Order Approval Report
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 ml-8">
            Every action is logged. Trace who approved a transaction, when they did it, and the value at the time.
          </p>
        </div>

        {/* Filters Row */}
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col gap-3">
            {/* Filter Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Search
                </label>
                <input
                  type="text"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="PO number or supplier..."
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Supplier
                </label>
                <select
                  value={supplierFilter}
                  onChange={(e) => setSupplierFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
                >
                  <option value="all">All Suppliers</option>
                  {suppliers.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Appr. Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
                >
                  <option value="all">All Statuses</option>
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Button — full width on mobile */}
            <Button variant="default" className="w-full sm:w-auto sm:self-end h-[42px] px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Filter className="h-4 w-4" />
              Apply Filter
            </Button>
          </div>

          {/* Export Buttons */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800/80">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Button variant="destructive" size="sm" className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700">
                <FileText className="h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="success" size="sm" className="flex-1 sm:flex-none">
                <FileSpreadsheet className="h-4 w-4" />
                Export Excel
              </Button>
              <div className="w-full sm:w-auto sm:ml-auto text-xs text-gray-400 dark:text-slate-500 text-center sm:text-right mt-1 sm:mt-0">
                {filteredEntries.length} entries found
              </div>
            </div>
          </div>
        </div>

        {/* Audit Trail Table */}
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">PO #</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Supplier</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Entry Date</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Value</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Appr. Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Approver 1</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Approver 2</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Appr. Date 1</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Appr. Date 2</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Files</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-800/60 transition-colors duration-150">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-gray-900 dark:text-white">{entry.poNumber}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="success" className="text-[10px]">{entry.statusLabel}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{entry.supplier}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-slate-400 text-xs">{entry.entryDate}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white font-mono">
                      ${entry.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="success">{entry.approvalStatus}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-slate-300 text-xs">{entry.approver1}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-slate-300 text-xs">{entry.approver2 || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-slate-400 text-xs">{entry.approvalDate1 || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-slate-400 text-xs">{entry.approvalDate2 || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      {entry.hasFiles ? (
                        <button className="rounded p-1.5 text-gray-400 dark:text-slate-500 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      ) : (
                        <span className="text-gray-300 dark:text-slate-600">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="sm:hidden flex flex-col gap-3 p-3">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
              >
                {/* Top Row: PO # + status badges */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                    {entry.poNumber}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {entry.hasFiles && (
                      <button className="rounded-md p-1.5 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    <Badge variant="success" className="text-[10px]">{entry.statusLabel}</Badge>
                    <Badge variant="success" className="text-[10px]">{entry.approvalStatus}</Badge>
                  </div>
                </div>

                {/* Supplier Name */}
                <div className="mt-3">
                  <p className="text-[16px] font-bold text-gray-900 dark:text-white leading-tight">
                    {entry.supplier}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{entry.entryDate}</p>
                </div>

                <hr className="border-gray-100 dark:border-slate-800/60 my-3" />

                {/* Value */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                    ${entry.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Approvers */}
                <div className="mt-2 flex flex-col gap-0.5 text-xs text-gray-400 dark:text-slate-500">
                  {entry.approver1 && (
                    <div className="flex gap-2">
                      <span className="font-semibold text-gray-500 dark:text-slate-400 w-20 flex-shrink-0">Approver 1:</span>
                      <span>{entry.approver1}{entry.approvalDate1 ? ` · ${entry.approvalDate1}` : ''}</span>
                    </div>
                  )}
                  {entry.approver2 && (
                    <div className="flex gap-2">
                      <span className="font-semibold text-gray-500 dark:text-slate-400 w-20 flex-shrink-0">Approver 2:</span>
                      <span>{entry.approver2}{entry.approvalDate2 ? ` · ${entry.approvalDate2}` : ''}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredEntries.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-slate-500">
                <ClipboardList className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm font-medium">No audit entries found</p>
                <p className="text-xs mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>

          {filteredEntries.length === 0 && (
            <div className="hidden sm:flex flex-col items-center justify-center py-16 text-gray-400 dark:text-slate-500">
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
