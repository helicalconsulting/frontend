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

// ─── Types ────────────────────────────────────────────────────────────────────

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
  roleName: string;
  systemName?: string;
  description?: string;
  permissions?: Permission[];
  userCount?: number;
}

type PermissionsByModule = Record<string, Permission[]>;

interface PermissionUpdate {
  module: string;
  canView: boolean;
  canCreate: boolean;
  canApprove: boolean;
  canReject: boolean;
  maxValue?: number | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRoleDisplayName(role: Role): string {
  return role.roleName ?? (role as any).name ?? 'Unknown';
}

type RoleVariant = 'admin' | 'finance' | 'manager' | 'staff' | 'default';

function getRoleVariant(role: Role): RoleVariant {
  const key = (role.systemName ?? role.roleName ?? '').toLowerCase();
  if (key.includes('super_admin') || key.includes('super admin')) return 'admin';
  if (key.includes('admin')) return 'admin';
  if (key.includes('finance')) return 'finance';
  if (key.includes('manager')) return 'manager';
  if (key.includes('staff')) return 'staff';
  return 'default';
}

const VARIANT_STYLES: Record<
  RoleVariant,
  { iconBg: string; iconColor: string; icon: React.ReactNode; border: string }
> = {
  admin: {
    iconBg: 'bg-red-50 dark:bg-red-900/20',
    iconColor: 'text-red-600 dark:text-red-400',
    icon: <Shield className="h-4 w-4" />,
    border: 'border-l-red-500',
  },
  finance: {
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    icon: <DollarSign className="h-4 w-4" />,
    border: 'border-l-emerald-500',
  },
  manager: {
    iconBg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    icon: <Briefcase className="h-4 w-4" />,
    border: 'border-l-blue-500',
  },
  staff: {
    iconBg: 'bg-gray-100 dark:bg-gray-700',
    iconColor: 'text-gray-500 dark:text-gray-400',
    icon: <User className="h-4 w-4" />,
    border: 'border-l-gray-400',
  },
  default: {
    iconBg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    icon: <Crown className="h-4 w-4" />,
    border: 'border-l-blue-500',
  },
};

// ─── RolesPage ────────────────────────────────────────────────────────────────

export function RolesPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [expandedRoles, setExpandedRoles] = useState<Set<number>>(new Set());
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const {
    data: rolesData,
    isLoading: isLoadingRoles,
    error: rolesError,
  } = useQuery<Role[]>({
    queryKey: ['admin-roles'],
    queryFn: adminApi.getRoles,
    staleTime: 30000,
  });

  const { data: permissionsByModule, isLoading: isLoadingPermissions } =
    useQuery<PermissionsByModule>({
      queryKey: ['admin-permissions'],
      queryFn: adminApi.getPermissions,
      staleTime: 60000,
    });

  const updatePermissionsMutation = useMutation({
    mutationFn: ({ roleId, permissions }: { roleId: number; permissions: PermissionUpdate[] }) =>
      adminApi.updateRolePermissions(roleId, permissions),
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

      <div className="px-3 py-4 sm:px-6 sm:py-6 space-y-4">

        {/* ── Summary Strip ── */}
        <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
          {[
            { label: 'Roles', value: roles.length, icon: <Shield className="h-4 w-4" />, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Permissions', value: totalPermissions, icon: <Lock className="h-4 w-4" />, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
            { label: 'Modules', value: allModules.length, icon: <span className="text-xs font-bold">#</span>, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center justify-center gap-1.5 py-4">
              <div className={`h-7 w-7 rounded-md flex items-center justify-center ${s.bg} ${s.color}`}>
                {s.icon}
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white leading-none">
                {isLoading ? '—' : s.value}
              </p>
              <p className="text-[10px] uppercase tracking-wide font-medium text-gray-400 dark:text-gray-500">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Error ── */}
        {rolesError && (
          <div className="rounded-md border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 p-3 flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-400">
              Failed to load roles. Please try again.
            </p>
          </div>
        )}

        {/* ── Roles List ── */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">

          {/* List header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Roles
            </span>
            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              {roles.length} records
            </span>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
            {isLoading
              ? Array(4).fill(null).map((_, i) => (
                  <div key={i} className="p-4 space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-52" />
                  </div>
                ))
              : roles.map((role) => (
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
            <div className="flex flex-col items-center justify-center py-14 text-gray-400 dark:text-gray-600">
              <Shield className="h-10 w-10 mb-2 opacity-40" />
              <p className="text-sm">No roles configured</p>
            </div>
          )}
        </div>
      </div>

      {editingRole && (
        <PermissionsModal
          role={editingRole}
          allModules={allModules}
          onClose={() => setEditingRole(null)}
          onSave={(permissions) =>
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
  const variant = getRoleVariant(role);
  const style = VARIANT_STYLES[variant];

  return (
    <div>
      {/* ── Row ── */}
      <div
        className={`
          flex items-center gap-3 px-4 py-3 cursor-pointer
          border-l-[3px] transition-colors
          ${isExpanded
            ? `${style.border} bg-gray-50/60 dark:bg-gray-700/30`
            : 'border-l-transparent hover:bg-gray-50/60 dark:hover:bg-gray-700/20'}
        `}
        onClick={onToggleExpand}
      >
        {/* Role icon */}
        <div className={`h-9 w-9 rounded-md flex items-center justify-center shrink-0 ${style.iconBg} ${style.iconColor}`}>
          {style.icon}
        </div>

        {/* Name + desc */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate leading-tight">
            {getRoleDisplayName(role)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
            {role.description || 'No description'}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-center hidden xs:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-none">
              {permissions.length}
            </p>
            <p className="text-[9px] uppercase tracking-wide text-gray-400 mt-0.5">Modules</p>
          </div>
          <div className="text-center hidden xs:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-none">
              {role.userCount ?? 0}
            </p>
            <p className="text-[9px] uppercase tracking-wide text-gray-400 mt-0.5">Users</p>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onEditPermissions(); }}
            className="
              h-7 px-2.5 rounded border border-gray-200 dark:border-gray-600
              text-xs font-medium text-blue-600 dark:text-blue-400
              bg-white dark:bg-gray-800
              hover:bg-blue-50 dark:hover:bg-blue-900/20
              hover:border-blue-300 dark:hover:border-blue-700
              transition-colors shrink-0
            "
          >
            Edit
          </button>

          <ChevronRight
            className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
          />
        </div>
      </div>

      {/* Stats row on small screens */}
      {isExpanded && (
        <div className="flex xs:hidden gap-4 px-4 pb-2 pt-0">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-800 dark:text-gray-200">{permissions.length}</span> modules
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-800 dark:text-gray-200">{role.userCount ?? 0}</span> users
          </span>
        </div>
      )}

      {/* ── Expanded Permissions Table ── */}
      {isExpanded && (
        <div className="bg-gray-50/50 dark:bg-gray-900/40 border-t border-gray-100 dark:border-gray-700/60 px-3 pb-3 pt-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-1 mb-2">
            Module Permissions
          </p>

          {permissions.length === 0 ? (
            <p className="text-xs text-gray-400 px-1 py-2">No permissions assigned</p>
          ) : (
            <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                      <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Module
                      </th>
                      {['View', 'Create', 'Approve', 'Reject'].map((h) => (
                        <th key={h} className="text-center px-2 py-2 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                      <th className="text-right px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Max Val
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {permissions.map((perm) => (
                      <tr key={perm.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-700/20">
                        <td className="px-3 py-2.5 font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                          {perm.module}
                        </td>
                        <td className="px-2 py-2.5 text-center"><PermBadge value={perm.canView} /></td>
                        <td className="px-2 py-2.5 text-center"><PermBadge value={perm.canCreate} /></td>
                        <td className="px-2 py-2.5 text-center"><PermBadge value={perm.canApprove} /></td>
                        <td className="px-2 py-2.5 text-center"><PermBadge value={perm.canReject} /></td>
                        <td className="px-3 py-2.5 text-right text-gray-400 dark:text-gray-500">
                          {perm.maxValue != null ? `$${Number(perm.maxValue).toLocaleString()}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PermBadge ────────────────────────────────────────────────────────────────

function PermBadge({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex items-center justify-center h-4 w-4 rounded bg-emerald-100 dark:bg-emerald-900/40">
      <Check className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
    </span>
  ) : (
    <span className="inline-flex items-center justify-center h-4 w-4 rounded bg-gray-100 dark:bg-gray-700">
      <X className="h-2.5 w-2.5 text-gray-300 dark:text-gray-600" />
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
    setPerms((prev) => ({ ...prev, [module]: { ...prev[module], maxValue: value } }));
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
    { key: 'canView',    label: 'View',    icon: <Eye className="h-3 w-3" /> },
    { key: 'canCreate',  label: 'Create',  icon: <Plus className="h-3 w-3" /> },
    { key: 'canApprove', label: 'Approve', icon: <ThumbsUp className="h-3 w-3" /> },
    { key: 'canReject',  label: 'Reject',  icon: <ThumbsDown className="h-3 w-3" /> },
  ];

  const variant = getRoleVariant(role);
  const style = VARIANT_STYLES[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-800 rounded-t-xl sm:rounded-xl shadow-xl w-full max-w-2xl sm:mx-4 max-h-[90vh] sm:max-h-[82vh] flex flex-col overflow-hidden">

        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-4 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-md flex items-center justify-center ${style.iconBg} ${style.iconColor}`}>
              {style.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                Edit Permissions
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {getRoleDisplayName(role)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              {activeCount} active
            </span>
            <button
              onClick={onClose}
              className="h-7 w-7 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">

          {/* ── Sticky column header ── */}
          <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2 grid grid-cols-[1fr_repeat(4,40px)_72px] gap-1 items-center shrink-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Module
            </span>
            {ACTIONS.map((a) => (
              <div key={a.key} className="flex flex-col items-center gap-0.5">
                <span className="text-gray-400 dark:text-gray-500">{a.icon}</span>
                <span className="text-[9px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 hidden sm:block">
                  {a.label}
                </span>
              </div>
            ))}
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-right">
              Max
            </span>
          </div>

          {/* ── Module rows ── */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700/50">
            {allModules.map((module) => {
              const p = perms[module];
              const hasAny = p.canView || p.canCreate || p.canApprove || p.canReject;

              return (
                <div
                  key={module}
                  className={`
                    px-4 py-2.5 grid grid-cols-[1fr_repeat(4,40px)_72px] gap-1 items-center transition-colors
                    ${hasAny ? 'bg-blue-50/40 dark:bg-blue-900/10' : 'hover:bg-gray-50/60 dark:hover:bg-gray-700/20'}
                  `}
                >
                  {/* Module name */}
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${hasAny ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide truncate">
                      {module}
                    </span>
                  </div>

                  {/* Toggles */}
                  {ACTIONS.map((action) => (
                    <div key={action.key} className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => toggle(module, action.key)}
                        className={`
                          h-6 w-6 rounded flex items-center justify-center transition-colors
                          ${p[action.key]
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-300 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }
                        `}
                      >
                        <Check className="h-3 w-3" />
                      </button>
                    </div>
                  ))}

                  {/* Max value */}
                  <div className="flex justify-end">
                    <input
                      type="number"
                      value={p.maxValue}
                      onChange={(e) => setMaxValue(module, e.target.value)}
                      placeholder="—"
                      className="
                        w-full text-right text-xs rounded border border-gray-200 dark:border-gray-600
                        bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300
                        px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500
                      "
                    />
                  </div>
                </div>
              );
            })}

            {allModules.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Lock className="h-10 w-10 mb-2 opacity-30" />
                <p className="text-sm">No modules available</p>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-end gap-2 border-t border-gray-100 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-900 shrink-0">
            <Button type="button" variant="outline" onClick={onClose} className="h-8 text-sm">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="h-8 text-sm">
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
              ) : (
                <Check className="h-3.5 w-3.5 mr-1.5" />
              )}
              Save Permissions
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}