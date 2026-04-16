import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockMasterDataRequests } from '@/mocks/data';
import {
  Users,
  Building2,
  FileText,
  FileImage,
  FileSpreadsheet,
  Filter,
  Plus,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const docIcons: Record<string, typeof FileText> = {
  pdf: FileText,
  doc: FileText,
  xls: FileSpreadsheet,
  img: FileImage,
};

const docColors: Record<string, string> = {
  pdf: 'bg-red-500',
  doc: 'bg-blue-500',
  xls: 'bg-emerald-500',
  img: 'bg-amber-500',
};

export function MasterDataPage() {
  const navigate = useNavigate();
  const [comments, setComments] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [filterLevel, setFilterLevel] = useState('all');

  const pendingRequests = useMemo(() => {
    return mockMasterDataRequests.filter((r) => {
      if (filterLevel !== 'all' && r.workflowLevel !== filterLevel) return false;
      return true;
    });
  }, [filterLevel]);

  const supplierCount = mockMasterDataRequests.filter((r) => r.entityType === 'Supplier').length;
  const customerCount = mockMasterDataRequests.filter((r) => r.entityType === 'Customer').length;
  const total = supplierCount + customerCount;
  const supplierPct = total > 0 ? (supplierCount / total) * 100 : 0;
  const customerPct = total > 0 ? (customerCount / total) * 100 : 0;

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === pendingRequests.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingRequests.map((r) => r.id)));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        title="Customer/Supplier On-boarding Approval"
        subtitle="Vet entities before they enter the ERP system"
      />

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-5">
        {/* Top Section: Distribution + Action Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {/* Request Distribution */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Request Distribution</h3>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Donut Chart (CSS-based) */}
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="relative h-32 w-32 sm:h-40 sm:w-40">
                <svg viewBox="0 0 36 36" className="h-32 w-32 sm:h-40 sm:w-40 -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                  <circle
                    cx="18" cy="18" r="14" fill="none" stroke="#1e40af" strokeWidth="4"
                    strokeDasharray={`${supplierPct * 0.88} ${100 - supplierPct * 0.88}`}
                    strokeDashoffset="0" className="transition-all duration-700"
                  />
                  <circle
                    cx="18" cy="18" r="14" fill="none" stroke="#16a34a" strokeWidth="4"
                    strokeDasharray={`${customerPct * 0.88} ${100 - customerPct * 0.88}`}
                    strokeDashoffset={`-${supplierPct * 0.88}`} className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{total}</span>
                  <span className="text-[10px] text-gray-400 font-medium">Total</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-800" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Suppliers ({supplierCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-600" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Customers ({customerCount})</span>
              </div>
            </div>
          </div>

          {/* Action Controls */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-amber-500">⚡</span>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Action Controls</h3>
              {selectedIds.size > 0 && (
                <span className="ml-auto text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                  {selectedIds.size} selected
                </span>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                Approval/Rejection Comments
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter reason for rejection or approval notes..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-3 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm resize-none focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
                rows={4}
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-4">
              <Button
                variant="destructive"
                disabled={selectedIds.size === 0}
                onClick={() => setSelectedIds(new Set())}
                className="flex-1 sm:flex-none"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button
                variant="default"
                disabled={selectedIds.size === 0}
                onClick={() => setSelectedIds(new Set())}
                className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve
              </Button>
            </div>
          </div>
        </div>

        {/* Pending Requests Table */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 px-4 sm:px-5 py-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Pending Master Data Requests</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter Active: Level</span>
              </div>
              <Button
                size="sm"
                variant="default"
                onClick={() => navigate('/master-data/new')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                <Plus className="h-4 w-4" />
                New Request
              </Button>
            </div>
          </div>

          {/* Mobile Select All Row */}
          <div className="sm:hidden flex flex-row items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={pendingRequests.length > 0 && selectedIds.size === pendingRequests.length}
                onChange={toggleSelectAll}
                className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-blue-500 focus:ring-blue-500"
              />
              <span className={`text-sm font-medium ${selectedIds.size > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                Select All
              </span>
            </label>
            <span className={`text-xs font-medium ${selectedIds.size > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
              {selectedIds.size > 0 ? `${selectedIds.size} selected` : `${pendingRequests.length} pending`}
            </span>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === pendingRequests.length && pendingRequests.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Entity Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Entity Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Tax/VAT Number</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Submitted</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Documents</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Workflow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {pendingRequests.map((request) => (
                  <tr
                    key={request.id}
                    className={`transition-colors duration-150 ${selectedIds.has(request.id) ? 'bg-blue-50/50 dark:bg-blue-900/20' : 'hover:bg-gray-50/80 dark:hover:bg-gray-700/50'
                      }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(request.id)}
                        onChange={() => toggleSelect(request.id)}
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-gray-300">{request.id}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={request.entityType === 'Supplier' ? 'info' : 'success'}
                        className="gap-1"
                      >
                        {request.entityType === 'Supplier' ? (
                          <Building2 className="h-3 w-3" />
                        ) : (
                          <Users className="h-3 w-3" />
                        )}
                        {request.entityType}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{request.entityName}</td>
                    <td className="px-4 py-3 font-mono text-xs text-blue-600 dark:text-blue-400">{request.taxVatNumber}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{request.submittedDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {request.documents.map((docType, i) => {
                          const Icon = docIcons[docType] || FileText;
                          const bg = docColors[docType] || 'bg-gray-500';
                          return (
                            <div
                              key={i}
                              className={`flex h-6 w-6 items-center justify-center rounded ${bg}`}
                            >
                              <Icon className="h-3 w-3 text-white" />
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {request.workflowLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="sm:hidden flex flex-col gap-3 p-3 pb-24">
            {pendingRequests.map((request) => {
              const isSelected = selectedIds.has(request.id);
              const isSupplier = request.entityType === 'Supplier';
              return (
                <div
                  key={request.id}
                  className={`flex flex-col p-4 rounded-xl shadow-sm transition-colors ${
                    isSelected
                      ? 'bg-blue-50/40 dark:bg-blue-900/10 border-[1.5px] border-blue-400 dark:border-blue-800'
                      : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800'
                  }`}
                >
                  {/* Top Row: ID + Type badge + Checkbox */}
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-2">
                      <span className="font-mono text-[13px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                        #{request.id}
                      </span>
                      <Badge variant={isSupplier ? 'info' : 'success'} className="gap-1 self-start text-[10px]">
                        {isSupplier ? <Building2 className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                        {request.entityType}
                      </Badge>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(request.id)}
                      className="h-5 w-5 rounded-[4px] border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-0 checked:bg-blue-500 mt-0.5 bg-transparent"
                    />
                  </div>

                  {/* Entity Name */}
                  <div className="mt-3">
                    <div className="text-[17px] font-bold text-slate-800 dark:text-white leading-tight">
                      {request.entityName}
                    </div>
                    <div className="mt-1 font-mono text-xs text-blue-600 dark:text-blue-400">
                      {request.taxVatNumber}
                    </div>
                  </div>

                  <hr className="border-gray-100 dark:border-gray-800/80 my-3" />

                  {/* Bottom Row: docs + workflow + date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {request.documents.map((docType, i) => {
                        const Icon = docIcons[docType] || FileText;
                        const bg = docColors[docType] || 'bg-gray-500';
                        return (
                          <div key={i} className={`flex h-6 w-6 items-center justify-center rounded ${bg}`}>
                            <Icon className="h-3 w-3 text-white" />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                        {request.submittedDate}
                      </span>
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                        {request.workflowLevel}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {pendingRequests.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                <Users className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm font-medium">No pending requests</p>
              </div>
            )}
          </div>

          {pendingRequests.length === 0 && (
            <div className="hidden sm:flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
              <Users className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No pending requests</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Floating Action Bar */}
      {selectedIds.size > 0 && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-[#11131e]/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 z-40 pb-safe">
          <div className="max-w-md mx-auto w-full flex items-center justify-between gap-2">
            <div className="flex-shrink-0 h-12 px-3 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-[#1c2132] border border-blue-100 dark:border-gray-700 font-bold text-blue-600 dark:text-blue-400 text-sm">
              {selectedIds.size} sel.
            </div>
            <Button
              className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm"
              onClick={() => setSelectedIds(new Set())}
            >
              Reject
            </Button>
            <Button
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm"
              onClick={() => setSelectedIds(new Set())}
            >
              Approve
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
