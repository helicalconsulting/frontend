import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockFinanceReportEntries } from '@/mocks/data';
import {
  Search,
  FileText,
  FileSpreadsheet,
  Download,
  Eye,
  Calendar,
  Filter,
  BarChart3,
} from 'lucide-react';

export function ReportsPage() {
  const [approvalStatus, setApprovalStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showReport, setShowReport] = useState(true);

  const filteredEntries = useMemo(() => {
    return mockFinanceReportEntries.filter((entry) => {
      if (approvalStatus === 'approved' && !entry.approved) return false;
      if (approvalStatus === 'pending' && entry.approved) return false;
      return true;
    });
  }, [approvalStatus]);

  const totalValue = filteredEntries.reduce((sum, e) => sum + e.netValue, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Header
        title="Finance Reports"
        subtitle="Audit and report payment approvals and overdue aging"
      />

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-5">
        {/* Page Title Card */}
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
              Supplier Invoice Payment Report
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 ml-8">
            Audit and report payment approvals and overdue aging
          </p>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col gap-3">
            {/* Filter Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Approval Status
                </label>
                <select
                  value={approvalStatus}
                  onChange={(e) => setApprovalStatus(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Due Date From
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Due Date To
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
                />
              </div>
            </div>

            {/* Generate Button — full width on mobile */}
            <Button
              variant="default"
              className="w-full sm:w-auto sm:self-end h-[42px] px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={() => setShowReport(true)}
            >
              <Search className="h-4 w-4" />
              Generate Report
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
                {filteredEntries.length} records · Total: ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* Report Table */}
        {showReport && (
          <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden animate-in">

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Ref #</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Approval</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Supplier</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Invoice #</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Net Value</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Due Date</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Days</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Approver 1</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Comment</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Appr. Date</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Files</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/60 transition-colors duration-150">
                      <td className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-slate-300">{entry.refNumber}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={entry.approved ? 'success' : 'warning'}>
                          {entry.approved ? 'True' : 'False'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{entry.supplier}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-slate-300">{entry.invoiceNumber}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-semibold ${entry.netValue > 10000 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                          $ {entry.netValue.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-slate-400 text-xs">{entry.dueDate}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-mono text-xs font-semibold ${entry.agingDays > 90 ? 'text-red-600 dark:text-red-400' : entry.agingDays > 30 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-slate-400'}`}>
                          {entry.agingDays}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-slate-300 text-xs">{entry.approver1 || '—'}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-slate-400 text-xs">{entry.comment || '—'}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-slate-400 text-xs">{entry.approvalDate || '—'}</td>
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
              {filteredEntries.map((entry) => {
                const isOverdue = entry.agingDays > 90;
                const isWarning = entry.agingDays > 30 && !isOverdue;
                return (
                  <div
                    key={entry.id}
                    className={`flex flex-col p-4 rounded-xl border shadow-sm transition-colors ${
                      isOverdue
                        ? 'border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/10'
                        : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {/* Top Row: Ref # + Approval badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                        {entry.refNumber}
                      </span>
                      <div className="flex items-center gap-2">
                        {entry.hasFiles && (
                          <button className="rounded-md p-1.5 text-gray-400 dark:text-slate-500 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        <Badge variant={entry.approved ? 'success' : 'warning'} className="text-[10px]">
                          {entry.approved ? 'Approved' : 'Pending'}
                        </Badge>
                      </div>
                    </div>

                    {/* Supplier Name */}
                    <div className="mt-3">
                      <p className="text-[16px] font-bold text-gray-900 dark:text-white leading-tight">
                        {entry.supplier}
                      </p>
                      <p className="font-mono text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                        {entry.invoiceNumber}
                      </p>
                    </div>

                    <hr className="border-gray-100 dark:border-slate-800/60 my-3" />

                    {/* Value + Aging */}
                    <div className="flex items-center justify-between">
                      <span className={`text-lg font-bold ${entry.netValue > 10000 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                        ${entry.netValue.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-400 dark:text-slate-500">Due: {entry.dueDate}</span>
                        <span className={`font-mono font-bold px-2 py-0.5 rounded-full text-[11px] ${
                          isOverdue
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : isWarning
                              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                              : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'
                        }`}>
                          {entry.agingDays}d
                        </span>
                      </div>
                    </div>

                    {/* Approver Info */}
                    {(entry.approver1 || entry.approvalDate) && (
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-400 dark:text-slate-500">
                        {entry.approver1 && <span>Approver: {entry.approver1}</span>}
                        {entry.approvalDate && <span>Date: {entry.approvalDate}</span>}
                        {entry.comment && <span className="truncate max-w-full">Note: {entry.comment}</span>}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredEntries.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-slate-500">
                  <FileText className="h-12 w-12 mb-3 opacity-50" />
                  <p className="text-sm font-medium">No report entries found</p>
                  <p className="text-xs mt-1">Try adjusting your filters</p>
                </div>
              )}
            </div>

            {filteredEntries.length === 0 && (
              <div className="hidden sm:flex flex-col items-center justify-center py-16 text-gray-400 dark:text-slate-500">
                <FileText className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm font-medium">No report entries found</p>
                <p className="text-xs mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
