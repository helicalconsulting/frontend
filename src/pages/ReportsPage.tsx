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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <Header
        title="Finance Reports"
        subtitle="Audit and report payment approvals and overdue aging"
      />

      <div className="p-6 space-y-5">
        {/* Page Title Card */}
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Supplier Invoice Payment Report</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-slate-400 ml-8">
            Audit and report payment approvals and overdue aging
          </p>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4">
            <div className="flex-1">
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

            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Due Date From
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
                />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Due Date To
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
                />
              </div>
            </div>

            <Button
              variant="default"
              className="h-[42px] px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={() => setShowReport(true)}
            >
              <Search className="h-4 w-4" />
              Generate Report
            </Button>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-slate-800/80">
            <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
              <FileText className="h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="success" size="sm">
              <FileSpreadsheet className="h-4 w-4" />
              Export Excel
            </Button>
            <div className="ml-auto text-xs text-gray-400 dark:text-slate-500">
              {filteredEntries.length} records • Total: ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Report Table */}
        {showReport && (
          <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden animate-in">
            <div className="overflow-x-auto">
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

            {filteredEntries.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-slate-500">
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
