import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import * as mockApi from '@/services/mockAdminApi';
import {
  Shield,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Loader2,
  Lock,
  AlertTriangle,
} from 'lucide-react';

// Types
interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface Role {
  id: string;
  name: string;
  systemName: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
}

export function RolesPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Queries
  const {
    data: rolesData,
    isLoading: isLoadingRoles,
    error: rolesError,
  } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: mockApi.getRoles,
    staleTime: 30000,
  });

  const { data: permissionsData, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['admin-permissions'],
    queryFn: mockApi.getPermissions,
    staleTime: 60000,
  });

  // Mutations
  const updatePermissionsMutation = useMutation({
    mutationFn: ({
      roleId,
      permissions,
    }: {
      roleId: string;
      permissions: string[];
    }) => mockApi.updateRolePermissions(roleId, permissions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      showToast(
        'success',
        'Permissions Updated',
        'Role permissions have been saved'
      );
      setEditingRole(null);
    },
    onError: () => {
      showToast('error', 'Error', 'Failed to update permissions');
    },
  });

  // Group permissions by module
  const permissionsByModule = useMemo(() => {
    if (!permissionsData?.permissions) return {};
    return permissionsData.permissions.reduce(
      (acc: Record<string, Permission[]>, perm: Permission) => {
        if (!acc[perm.module]) {
          acc[perm.module] = [];
        }
        acc[perm.module].push(perm);
        return acc;
      },
      {} as Record<string, Permission[]>
    );
  }, [permissionsData]);

  const toggleExpand = (roleId: string) => {
    setExpandedRoles((prev) => {
      const next = new Set(prev);
      if (next.has(roleId)) {
        next.delete(roleId);
      } else {
        next.add(roleId);
      }
      return next;
    });
  };

  const isLoading = isLoadingRoles || isLoadingPermissions;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        title="Roles & Permissions"
        subtitle="Manage user roles and their access permissions"
      />

      <div className="p-6 space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Roles</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {rolesData?.roles.length || 0}
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
                  {permissionsData?.permissions.length || 0}
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
                  {Object.keys(permissionsByModule).length}
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
            <p className="text-sm text-red-700">
              Failed to load roles. Please try again later.
            </p>
          </div>
        )}

        {/* Roles List */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 px-5 py-3">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Roles</h3>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading
              ? Array(4)
                  .fill(null)
                  .map((_, i) => (
                    <div key={i} className="p-4">
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  ))
              : rolesData?.roles.map((role: Role) => (
                  <RoleItem
                    key={role.id}
                    role={role}
                    isExpanded={expandedRoles.has(role.id)}
                    onToggleExpand={() => toggleExpand(role.id)}
                    onEditPermissions={() => setEditingRole(role)}
                    permissionsByModule={permissionsByModule}
                  />
                ))}
          </div>

          {!isLoading &&
            (!rolesData?.roles || rolesData.roles.length === 0) && (
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
          permissionsByModule={permissionsByModule}
          onClose={() => setEditingRole(null)}
          onSave={(permissions: string[]) =>
            updatePermissionsMutation.mutate({
              roleId: editingRole.id,
              permissions,
            })
          }
          isLoading={updatePermissionsMutation.isPending}
        />
      )}
    </div>
  );
}

// Role Item Component
function RoleItem({
  role,
  isExpanded,
  onToggleExpand,
  onEditPermissions,
  permissionsByModule,
}: {
  role: Role;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEditPermissions: () => void;
  permissionsByModule: Record<string, Permission[]>;
}) {
  // Group the role's permissions by module
  const rolePermsByModule = useMemo(() => {
    const result: Record<string, string[]> = {};
    role.permissions.forEach((p) => {
      const parts = p.split(':');
      if (parts.length === 2) {
        const mod = parts[0];
        if (!result[mod]) result[mod] = [];
        result[mod].push(parts[1]);
      }
    });
    return result;
  }, [role.permissions]);

  return (
    <div className="transition-colors">
      <div className="flex items-center justify-between p-4 hover:bg-gray-50/80 dark:hover:bg-gray-700/50">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleExpand}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 transition-all"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">{role.name}</h4>
              {role.isSystem && (
                <Badge variant="outline" className="text-xs">
                  System
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{role.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {role.permissions.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">permissions</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {role.userCount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">users</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onEditPermissions}
          >
            Edit Permissions
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-gray-50/50 dark:bg-gray-900/50 px-4 pb-4">
          <div className="ml-14 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Assigned Permissions
            </h5>

            {Object.keys(rolePermsByModule).length === 0 ? (
              <p className="text-sm text-gray-400">No permissions assigned</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(rolePermsByModule).map(([module, actions]) => (
                  <div key={module} className="space-y-2">
                    <h6 className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      {module}
                    </h6>
                    <div className="flex flex-wrap gap-1">
                      {actions.map((action) => (
                        <Badge key={action} variant="info" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Permissions Modal Component
function PermissionsModal({
  role,
  permissionsByModule,
  onClose,
  onSave,
  isLoading,
}: {
  role: Role;
  permissionsByModule: Record<string, Permission[]>;
  onClose: () => void;
  onSave: (permissions: string[]) => void;
  isLoading: boolean;
}) {
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(role.permissions)
  );

  const togglePermission = (permName: string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(permName)) {
        next.delete(permName);
      } else {
        next.add(permName);
      }
      return next;
    });
  };

  const toggleModule = (permissions: Permission[]) => {
    const allSelected = permissions.every((p) =>
      selectedPermissions.has(p.name)
    );
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      permissions.forEach((p) => {
        if (allSelected) {
          next.delete(p.name);
        } else {
          next.add(p.name);
        }
      });
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(Array.from(selectedPermissions));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[80vh] flex flex-col overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Edit Permissions
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{role.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="info">{selectedPermissions.size} selected</Badge>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {Object.entries(permissionsByModule).map(
                ([module, permissions]) => {
                  const selectedCount = permissions.filter((p: Permission) =>
                    selectedPermissions.has(p.name)
                  ).length;
                  const allSelected =
                    selectedCount === permissions.length;
                  const someSelected =
                    selectedCount > 0 && selectedCount < permissions.length;

                  return (
                    <div
                      key={module}
                      className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            ref={(el) => {
                              if (el) el.indeterminate = someSelected;
                            }}
                            onChange={() => toggleModule(permissions)}
                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {module}
                          </span>
                        </label>
                        <Badge variant="outline" className="text-xs">
                          {selectedCount}/{permissions.length}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-4">
                        {permissions.map((perm: Permission) => (
                          <label
                            key={perm.id}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/80 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedPermissions.has(perm.name)}
                              onChange={() => togglePermission(perm.name)}
                              className="h-4 w-4 mt-0.5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {perm.name}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                {perm.description}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                }
              )}

              {Object.keys(permissionsByModule).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Lock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No permissions available</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900 shrink-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Save Permissions
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
