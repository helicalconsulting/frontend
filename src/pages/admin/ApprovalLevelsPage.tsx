import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import {
  getApprovalLevels,
  getApprovalModules,
  createApprovalLevel,
  updateApprovalLevel,
  deleteApprovalLevel,
  reorderApprovalLevels,
} from '@/services/adminService';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Layers,
  X,
  Loader2,
  AlertTriangle,
  Filter,
} from 'lucide-react';

// Type matches adminService return shape exactly
interface ApprovalLevel {
  id: number;
  module: string;
  level: number;
  name: string;
  minValue: number;
  maxValue: number | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ModuleOption {
  id: string;
  name: string;
  displayName: string;
}

const moduleColors: Record<string, string> = {
  PAYMENT: 'from-blue-500 to-blue-600',
  PO: 'from-emerald-500 to-emerald-600',
  AP: 'from-amber-500 to-amber-600',
  SALES: 'from-purple-500 to-purple-600',
  ONBOARDING: 'from-rose-500 to-rose-600',
};

export function ApprovalLevelsPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<ApprovalLevel | null>(null);

  // ── Queries ──────────────────────────────────────────────────────────────────

  const {
    data: levelsData,
    isLoading: isLoadingLevels,
    error: levelsError,
  } = useQuery<ApprovalLevel[]>({
    queryKey: ['admin-approval-levels', selectedModule],
    queryFn: () =>
      getApprovalLevels(selectedModule === 'all' ? undefined : selectedModule),
    staleTime: 30000,
  });

  // getApprovalModules returns string[] — e.g. ['PO', 'AP', 'PAYMENT', ...]
  const { data: rawModules = [] } = useQuery<string[]>({
    queryKey: ['admin-modules'],
    queryFn: () => getApprovalModules(),
    staleTime: 60000,
  });

  // Normalise string[] → ModuleOption[] for selects
  const moduleOptions: ModuleOption[] = rawModules.map((m) => ({
    id: m,
    name: m,
    displayName: m.charAt(0).toUpperCase() + m.slice(1).toLowerCase(),
  }));

  // ── Mutations ─────────────────────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: (data: Parameters<typeof createApprovalLevel>[0]) =>
      createApprovalLevel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-approval-levels'] });
      showToast('success', 'Level Created', 'New approval level has been created');
      setIsCreateModalOpen(false);
    },
    onError: () => {
      showToast('error', 'Error', 'Failed to create approval level');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Parameters<typeof updateApprovalLevel>[1];
    }) => updateApprovalLevel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-approval-levels'] });
      showToast('success', 'Level Updated', 'Approval level has been updated');
      setIsEditModalOpen(false);
      setSelectedLevel(null);
    },
    onError: () => {
      showToast('error', 'Error', 'Failed to update approval level');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApprovalLevel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-approval-levels'] });
      showToast('success', 'Level Deleted', 'Approval level has been removed');
      setIsDeleteModalOpen(false);
      setSelectedLevel(null);
    },
    onError: () => {
      showToast('error', 'Error', 'Failed to delete approval level');
    },
  });

  const reorderMutation = useMutation({
    mutationFn: ({
      module,
      levels,
    }: {
      module: string;
      levels: { id: number; level: number }[];
    }) => reorderApprovalLevels(module, levels),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-approval-levels'] });
    },
    onError: () => {
      showToast('error', 'Error', 'Failed to reorder levels');
    },
  });

  // toggleStatus reuses updateApprovalLevel — no separate mock fn needed
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      updateApprovalLevel(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-approval-levels'] });
      showToast('success', 'Status Updated', 'Level status has been changed');
    },
    onError: () => {
      showToast('error', 'Error', 'Failed to update level status');
    },
  });

  // ── Derived state ─────────────────────────────────────────────────────────────

  // levelsData is ApprovalLevel[] — group by module
  const levelsByModule = useMemo(() => {
    if (!levelsData || !Array.isArray(levelsData)) return {};

    return levelsData.reduce<Record<string, ApprovalLevel[]>>((acc, level) => {
      if (!acc[level.module]) acc[level.module] = [];
      acc[level.module].push(level);
      return acc;
    }, {});
  }, [levelsData]);

  // Sort each module's levels ascending by level number
  Object.keys(levelsByModule).forEach((mod) => {
    levelsByModule[mod].sort((a, b) => a.level - b.level);
  });

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const handleMoveUp = (level: ApprovalLevel) => {
    const moduleLevels = levelsByModule[level.module];
    const idx = moduleLevels.findIndex((l) => l.id === level.id);
    if (idx <= 0) return;

    const newOrder = [...moduleLevels];
    [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];

    reorderMutation.mutate({
      module: level.module,
      levels: newOrder.map((l, i) => ({ id: l.id, level: i + 1 })),
    });
  };

  const handleMoveDown = (level: ApprovalLevel) => {
    const moduleLevels = levelsByModule[level.module];
    const idx = moduleLevels.findIndex((l) => l.id === level.id);
    if (idx >= moduleLevels.length - 1) return;

    const newOrder = [...moduleLevels];
    [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];

    reorderMutation.mutate({
      module: level.module,
      levels: newOrder.map((l, i) => ({ id: l.id, level: i + 1 })),
    });
  };

  const openEditModal = (level: ApprovalLevel) => {
    setSelectedLevel(level);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (level: ApprovalLevel) => {
    setSelectedLevel(level);
    setIsDeleteModalOpen(true);
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        title="Approval Levels"
        subtitle="Configure approval workflow levels and thresholds"
      />

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-5">

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['PAYMENT', 'PO', 'AP', 'SALES'].map((mod) => {
            const count = (levelsByModule[mod] || []).length;
            const gradient = moduleColors[mod] || 'from-gray-500 to-gray-600';
            return (
              <div
                key={mod}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <Layers className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{mod}</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {count} level{count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
            >
              <option value="all">All Modules</option>
              {moduleOptions.map((mod) => (
                <option key={mod.id} value={mod.name}>
                  {mod.displayName}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Level
          </Button>
        </div>

        {/* Error */}
        {levelsError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700">
              Failed to load approval levels. Please try again later.
            </p>
          </div>
        )}

        {/* Table */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80">
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider w-20">Order</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Level</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Module</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Min Value</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Max Value</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Required Role</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {isLoadingLevels
                  ? Array(5).fill(null).map((_, i) => (
                      <tr key={i}>
                        {Array(9).fill(null).map((_, j) => (
                          <td key={j} className="px-4 py-4">
                            <Skeleton className="h-4 w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : Object.entries(levelsByModule).flatMap(([, levels]) =>
                      levels.map((level, index) => (
                        <tr
                          key={level.id}
                          className="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleMoveUp(level)}
                                disabled={index === 0 || reorderMutation.isPending}
                                className="p-1 rounded text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleMoveDown(level)}
                                disabled={
                                  index === levelsByModule[level.module].length - 1 ||
                                  reorderMutation.isPending
                                }
                                className="p-1 rounded text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </button>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <Badge variant="info" className="font-mono">L{level.level}</Badge>
                          </td>

                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                            {level.name}
                          </td>

                          <td className="px-4 py-3">
                            <Badge variant="outline">{level.module}</Badge>
                          </td>

                          <td className="px-4 py-3 text-right font-mono text-gray-600 dark:text-gray-400">
                            {level.minValue.toLocaleString()}
                          </td>

                          <td className="px-4 py-3 text-right font-mono text-gray-600 dark:text-gray-400">
                            {level.maxValue !== null ? level.maxValue.toLocaleString() : '∞'}
                          </td>

                          <td className="px-4 py-3">
                            <Badge variant="default">{level.role}</Badge>
                          </td>

                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() =>
                                toggleStatusMutation.mutate({
                                  id: level.id,
                                  isActive: !level.isActive,
                                })
                              }
                              disabled={toggleStatusMutation.isPending}
                              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              style={{ backgroundColor: level.isActive ? '#10b981' : '#d1d5db' }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  level.isActive ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditModal(level)}
                                title="Edit Level"
                                className="h-8 w-8 p-0"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openDeleteModal(level)}
                                title="Delete Level"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {!isLoadingLevels && Object.keys(levelsByModule).length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
              <Layers className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No approval levels configured</p>
              <p className="text-xs mt-1">Add a level to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <LevelFormModal
          title="Create Approval Level"
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(data) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
          modules={moduleOptions}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedLevel && (
        <LevelFormModal
          title="Edit Approval Level"
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedLevel(null);
          }}
          onSubmit={(data) => updateMutation.mutate({ id: selectedLevel.id, data })}
          isLoading={updateMutation.isPending}
          modules={moduleOptions}
          initialData={selectedLevel}
        />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedLevel && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedLevel(null);
          }}
          onConfirm={() => deleteMutation.mutate(selectedLevel.id)}
          isLoading={deleteMutation.isPending}
          levelName={selectedLevel.name}
        />
      )}
    </div>
  );
}

// ─── Level Form Modal ─────────────────────────────────────────────────────────

function LevelFormModal({
  title,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  modules,
  initialData,
}: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  modules: ModuleOption[];
  initialData?: ApprovalLevel;
}) {
  const [formData, setFormData] = useState({
    module:   initialData?.module             || '',
    level:    initialData?.level?.toString()  || '',
    name:     initialData?.name               || '',
    minValue: initialData?.minValue?.toString() || '0',
    maxValue: initialData?.maxValue?.toString() || '',
    role:     initialData?.role               || '',
    isActive: initialData?.isActive           ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      module:   formData.module,
      level:    parseInt(formData.level, 10),
      name:     formData.name,
      minValue: parseFloat(formData.minValue),
      maxValue: formData.maxValue ? parseFloat(formData.maxValue) : null,
      role:     formData.role,
      isActive: formData.isActive,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-scale-in">

        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Module
              </label>
              <select
                value={formData.module}
                onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                required
                disabled={!!initialData}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              >
                <option value="">Select Module</option>
                {modules.map((mod) => (
                  <option key={mod.id} value={mod.name}>
                    {mod.displayName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Level Number
              </label>
              <Input
                type="number"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                required
                min="1"
                placeholder="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Level Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Department Head Approval"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min Value
              </label>
              <Input
                type="number"
                value={formData.minValue}
                onChange={(e) => setFormData({ ...formData, minValue: e.target.value })}
                required
                min="0"
                step="0.01"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Value
              </label>
              <Input
                type="number"
                value={formData.maxValue}
                onChange={(e) => setFormData({ ...formData, maxValue: e.target.value })}
                min="0"
                step="0.01"
                placeholder="Unlimited"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Leave empty for unlimited
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Required Role
            </label>
            <Input
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
              placeholder="Finance Manager"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {initialData ? 'Save Changes' : 'Create Level'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────

function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  levelName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  levelName: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-scale-in">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Delete Approval Level
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Are you sure you want to delete{' '}
            <span className="font-semibold">{levelName}</span>? Any workflows
            using this level will need to be reconfigured.
          </p>

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete Level
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}