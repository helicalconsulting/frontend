import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import * as adminApi from '../../services/adminService.ts';
import {
  Shield,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Loader2,
  Lock,
  AlertTriangle,
  Eye,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Crown,
  Briefcase,
  DollarSign,
  User,
} from 'lucide-react';

// ─── Types — matching Prisma schema exactly ───────────────────────────────────

interface Permission {
  id: number;
  roleId: number;
  module: string;
  canView: boolean;
  canCreate: boolean;
  canApprove: boolean;
  canReject: boolean;
  maxValue?: number | null;
}

interface Role {
  id: number;
  roleName: string;         // API field — may also appear as 'name' in older responses
  systemName?: string;      // e.g. 'super_admin', 'manager'
  description?: string;
  permissions?: Permission[];
  userCount?: number;
}

// Helper: get a stable display name regardless of API field
function getRoleDisplayName(role: Role): string {
  return role.roleName ?? (role as any).name ?? 'Unknown';
}

// Helper: pick gradient + icon based on role name
function getRoleStyle(role: Role): { gradient: string; icon: React.ReactNode } {
  const key = (role.systemName ?? role.roleName ?? '').toLowerCase().replace(/[\s-]+/g, '_');
  if (key.includes('super_admin') || key.includes('super admin'))
    return { gradient: 'from-amber-500 to-orange-600', icon: <Crown className="h-5 w-5 text-white" /> };
  if (key.includes('administrator') || key.includes('admin'))
    return { gradient: 'from-red-500 to-rose-600', icon: <Shield className="h-5 w-5 text-white" /> };
  if (key.includes('manager'))
    return { gradient: 'from-sky-500 to-blue-600', icon: <Briefcase className="h-5 w-5 text-white" /> };
  if (key.includes('finance'))
    return { gradient: 'from-emerald-500 to-teal-600', icon: <DollarSign className="h-5 w-5 text-white" /> };
  if (key.includes('staff'))
    return { gradient: 'from-gray-400 to-gray-500', icon: <User className="h-5 w-5 text-white" /> };
  return { gradient: 'from-blue-500 to-indigo-600', icon: <Shield className="h-5 w-5 text-white" /> };
}

// Backend getPermissions() returns: Record<string, Permission[]>
type PermissionsByModule = Record<string, Permission[]>;

// What we send to updateRolePermissions()
interface PermissionUpdate {
  module: string;
  canView: boolean;
  canCreate: boolean;
  canApprove: boolean;
  canReject: boolean;
  maxValue?: number | null;
}

// ─── RolesPage ────────────────────────────────────────────────────────────────

export function RolesPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [expandedRoles, setExpandedRoles] = useState<Set<number>>(new Set());
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // getRoles() → Role[]
  const {
    data: rolesData,
    isLoading: isLoadingRoles,
    error: rolesError,
  } = useQuery<Role[]>({
    queryKey: ['admin-roles'],
    queryFn: adminApi.getRoles,
    staleTime: 30000,
  });

  // getPermissions() → Record<string, Permission[]>
  const {
    data: permissionsByModule,
    isLoading: isLoadingPermissions,
  } = useQuery<PermissionsByModule>({
    queryKey: ['admin-permissions'],
    queryFn: adminApi.getPermissions,
    staleTime: 60000,
  });

  // updateRolePermissions(roleId, PermissionUpdate[])
  const updatePermissionsMutation = useMutation({
    mutationFn: ({
      roleId,
      permissions,
    }: {
      roleId: number;
      permissions: PermissionUpdate[];
    }) => adminApi.updateRolePermissions(roleId, permissions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      showToast('success', 'Permissions Updated', 'Role permissions have been saved');
      setEditingRole(null);
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error?.message ||
        error?.message ||
        'Failed to update permissions';
      showToast('error', 'Error', msg);
    },
  });

  const toggleExpand = (roleId: number) => {
    setExpandedRoles((prev) => {
      const next = new Set(prev);
      if (next.has(roleId)) next.delete(roleId);
      else next.add(roleId);
      return next;
    });
  };

  const isLoading = isLoadingRoles || isLoadingPermissions;
  const roles = rolesData ?? [];
  const allModules = Object.keys(permissionsByModule ?? {});
  const totalPermissions = Object.values(permissionsByModule ?? {}).flat().length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        title="Roles & Permissions"
        subtitle="Manage user roles and their access permissions"
      />

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Roles</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {roles.length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Permissions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {totalPermissions}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Lock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Modules</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {allModules.length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <span className="text-xl text-white font-bold">#</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error state */}
        {rolesError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700">Failed to load roles. Please try again later.</p>
          </div>
        )}

        {/* Roles List */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 px-5 py-3">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Roles</h3>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading
              ? Array(4).fill(null).map((_, i) => (
                <div key={i} className="p-4">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
              ))
              : roles.map((role: Role) => (
                <RoleItem
                  key={role.id}
                  role={role}
                  isExpanded={expandedRoles.has(role.id)}
                  onToggleExpand={() => toggleExpand(role.id)}
                  onEditPermissions={() => setEditingRole(role)}
                />
              ))}
          </div>

          {!isLoading && roles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Shield className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No roles configured</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Permissions Modal */}
      {editingRole && (
        <PermissionsModal
          role={editingRole}
          allModules={allModules}
          onClose={() => setEditingRole(null)}
          onSave={(permissions: PermissionUpdate[]) =>
            updatePermissionsMutation.mutate({ roleId: editingRole.id, permissions })
          }
          isLoading={updatePermissionsMutation.isPending}
        />
      )}
    </div>
  );
}

// ─── Role Item ────────────────────────────────────────────────────────────────

function RoleItem({
  role,
  isExpanded,
  onToggleExpand,
  onEditPermissions,
}: {
  role: Role;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEditPermissions: () => void;
}) {
  const permissions = role.permissions ?? [];

  return (
    <div className="transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-3 hover:bg-gray-50/80 dark:hover:bg-gray-700/50">
        {/* Left: chevron + icon + name */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleExpand}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 transition-all shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${getRoleStyle(role).gradient} flex items-center justify-center shrink-0`}>
            {getRoleStyle(role).icon}
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{getRoleDisplayName(role)}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{role.description || 'No description'}</p>
          </div>
        </div>
        {/* Right: stats + button */}
        <div className="flex items-center gap-3 sm:gap-4 pl-9 sm:pl-0 shrink-0">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{permissions.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">modules</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{role.userCount ?? 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">users</p>
          </div>
          <Button size="sm" variant="outline" onClick={onEditPermissions} className="shrink-0">
            <span className="hidden sm:inline">Edit Permissions</span>
            <span className="sm:hidden">Edit</span>
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-gray-50/50 dark:bg-gray-900/50 px-2 sm:px-4 pb-4">
          <div className="sm:ml-14 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Module Permissions
              </h5>
            </div>

            {permissions.length === 0 ? (
              <p className="text-sm text-gray-400 p-4">No permissions assigned</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/40">
                      <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Module</th>
                      <th className="text-center px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">View</th>
                      <th className="text-center px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Create</th>
                      <th className="text-center px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Approve</th>
                      <th className="text-center px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Reject</th>
                      <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Max Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {permissions.map((perm) => (
                      <tr key={perm.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-2.5">
                          <span className="font-medium text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wide">
                            {perm.module}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center"><PermBadge value={perm.canView} /></td>
                        <td className="px-3 py-2.5 text-center"><PermBadge value={perm.canCreate} /></td>
                        <td className="px-3 py-2.5 text-center"><PermBadge value={perm.canApprove} /></td>
                        <td className="px-3 py-2.5 text-center"><PermBadge value={perm.canReject} /></td>
                        <td className="px-4 py-2.5 text-right text-xs text-gray-500 dark:text-gray-400">
                          {perm.maxValue != null ? `$${Number(perm.maxValue).toLocaleString()}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Small helper — green check or grey x
function PermBadge({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40">
      <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
    </span>
  ) : (
    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gray-100 dark:bg-gray-700">
      <X className="h-3 w-3 text-gray-400" />
    </span>
  );
}

// ─── Permissions Modal ────────────────────────────────────────────────────────

type ModulePerms = {
  canView: boolean;
  canCreate: boolean;
  canApprove: boolean;
  canReject: boolean;
  maxValue: string;
};

function PermissionsModal({
  role,
  allModules,
  onClose,
  onSave,
  isLoading,
}: {
  role: Role;
  allModules: string[];
  onClose: () => void;
  onSave: (permissions: PermissionUpdate[]) => void;
  isLoading: boolean;
}) {
  // Build initial state — all modules false, then overlay existing role permissions
  const initialState = useMemo(() => {
    const state: Record<string, ModulePerms> = {};
    allModules.forEach((mod) => {
      state[mod] = { canView: false, canCreate: false, canApprove: false, canReject: false, maxValue: '' };
    });
    (role.permissions ?? []).forEach((p) => {
      if (state[p.module]) {
        state[p.module] = {
          canView: p.canView,
          canCreate: p.canCreate,
          canApprove: p.canApprove,
          canReject: p.canReject,
          maxValue: p.maxValue != null ? String(p.maxValue) : '',
        };
      }
    });
    return state;
  }, [role.permissions, allModules]);

  const [perms, setPerms] = useState<Record<string, ModulePerms>>(initialState);

  const toggle = (module: string, field: keyof Omit<ModulePerms, 'maxValue'>) => {
    setPerms((prev) => ({
      ...prev,
      [module]: { ...prev[module], [field]: !prev[module][field] },
    }));
  };

  const setMaxValue = (module: string, value: string) => {
    setPerms((prev) => ({
      ...prev,
      [module]: { ...prev[module], maxValue: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: PermissionUpdate[] = Object.entries(perms).map(([module, p]) => ({
      module,
      canView: p.canView,
      canCreate: p.canCreate,
      canApprove: p.canApprove,
      canReject: p.canReject,
      maxValue: p.maxValue !== '' ? parseFloat(p.maxValue) : null,
    }));
    onSave(payload);
  };

  const activeCount = Object.values(perms).filter(
    (p) => p.canView || p.canCreate || p.canApprove || p.canReject
  ).length;

  const ACTIONS: { key: keyof Omit<ModulePerms, 'maxValue'>; label: string; icon: React.ReactNode }[] = [
    { key: 'canView', label: 'View', icon: <Eye className="h-3.5 w-3.5" /> },
    { key: 'canCreate', label: 'Create', icon: <Plus className="h-3.5 w-3.5" /> },
    { key: 'canApprove', label: 'Approve', icon: <ThumbsUp className="h-3.5 w-3.5" /> },
    { key: 'canReject', label: 'Reject', icon: <ThumbsDown className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-3xl sm:mx-4 max-h-[92vh] sm:max-h-[85vh] flex flex-col overflow-hidden mt-auto sm:mt-0">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Permissions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{getRoleDisplayName(role)}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="info">{activeCount} modules active</Badge>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">

            {/* Sticky column headers */}
            <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-6 py-2 grid grid-cols-[1fr_repeat(4,44px)_80px] sm:grid-cols-[1fr_repeat(4,72px)_100px] gap-1 sm:gap-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Module</span>
              {ACTIONS.map((a) => (
                <span key={a.key} className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center flex flex-col items-center gap-0.5">
                  {a.icon}
                  <span className="hidden sm:inline">{a.label}</span>
                </span>
              ))}
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right hidden sm:block">Max Value</span>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right sm:hidden">$</span>
            </div>

            {/* Module rows */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {allModules.map((module) => {
                const p = perms[module];
                const hasAny = p.canView || p.canCreate || p.canApprove || p.canReject;

                return (
                  <div
                    key={module}
                    className={`px-3 sm:px-6 py-3 grid grid-cols-[1fr_repeat(4,44px)_80px] sm:grid-cols-[1fr_repeat(4,72px)_100px] gap-1 sm:gap-2 items-center transition-colors ${hasAny
                        ? 'bg-blue-50/40 dark:bg-blue-900/10'
                        : 'hover:bg-gray-50/50 dark:hover:bg-gray-700/20'
                      }`}
                  >
                    {/* Module name */}
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full shrink-0 ${hasAny ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        {module}
                      </span>
                    </div>

                    {/* Toggle buttons */}
                    {ACTIONS.map((action) => (
                      <div key={action.key} className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => toggle(module, action.key)}
                          className={`h-6 w-6 sm:h-7 sm:w-7 rounded-lg flex items-center justify-center transition-all ${p[action.key]
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}

                    {/* Max value input */}
                    <div className="flex justify-end">
                      <input
                        type="number"
                        value={p.maxValue}
                        onChange={(e) => setMaxValue(module, e.target.value)}
                        placeholder="—"
                        className="w-16 sm:w-24 text-right text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 sm:px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {allModules.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Lock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No modules available</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-gray-900 shrink-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Save Permissions
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}