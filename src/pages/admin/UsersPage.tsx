import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import * as adminApi from '../../services/adminService.ts';
import {
  Search,
  Plus,
  Edit2,
  Shield,
  UserCheck,
  UserX,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Crown,
  Briefcase,
  DollarSign,
  User,
} from 'lucide-react';

// ─── Predefined roles (always shown in the Assign Roles modal) ───────────────
// These are merged with whatever the API returns. If an API role matches by
// systemName/name, its real ID is used; otherwise the row is shown disabled.
const PREDEFINED_ROLES = [
  {
    key: 'super_admin',
    label: 'Super Admin',
    description: 'Full system access — company administrator',
    badgeVariant: 'warning' as const,
    badgeLabel: 'Admin',
    icon: 'crown',
  },
  {
    key: 'administrator',
    label: 'Administrator',
    description: 'Manage users, settings and system configuration',
    badgeVariant: 'danger' as const,
    badgeLabel: 'Admin',
    icon: 'shield',
  },
  {
    key: 'manager',
    label: 'Manager',
    description: 'Oversee team workflows and approve requests',
    badgeVariant: 'info' as const,
    badgeLabel: 'Manager',
    icon: 'briefcase',
  },
  {
    key: 'finance_approver',
    label: 'Finance Approver',
    description: 'Review and approve financial transactions',
    badgeVariant: 'success' as const,
    badgeLabel: 'Finance',
    icon: 'dollar',
  },
  {
    key: 'staff',
    label: 'Staff',
    description: 'Standard employee access to assigned modules',
    badgeVariant: 'outline' as const,
    badgeLabel: 'Staff',
    icon: 'user',
  },
];

// ─── Helper: normalize a role to its display name string ───────────────────
// API may return roles as strings OR as { id, roleName } objects
function getRoleName(role: any): string {
  if (typeof role === 'string') return role;
  return role?.roleName ?? role?.name ?? String(role);
}

function isAdminRole(role: any): boolean {
  const name = getRoleName(role).toLowerCase();
  return name === 'super admin' || name === 'administrator' || name === 'super_admin' || name === 'admin';
}

// ─── Get current logged-in user ID ───────────────────────────────────────────
// Tries common storage keys — adjust if your auth stores it differently
function getCurrentUserId(): number | null {
  try {
    // Try common patterns — update the key if yours is different
    const raw =
      localStorage.getItem('user') ||
      localStorage.getItem('currentUser') ||
      sessionStorage.getItem('user') ||
      sessionStorage.getItem('currentUser');
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed?.id ?? parsed?.userId ?? null;
    }
  } catch { }
  return null;
}

export function UsersPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // Current logged-in user — to prevent self-deactivation
  const currentUserId = getCurrentUserId();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Queries
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-users', page, limit, debouncedSearch],
    queryFn: () => adminApi.getUsers({ page, limit, search: debouncedSearch }),
    staleTime: 30000,
  });

  const { data: rolesData } = useQuery({
    queryKey: ['admin-roles-list-simple'],
    queryFn: () => adminApi.getRoles(),
    staleTime: 60000,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: adminApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      showToast('success', 'User Created', 'New user has been created successfully');
      setIsCreateModalOpen(false);
    },
    onError: () => showToast('error', 'Error', 'Failed to create user'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminApi.updateUser(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      showToast('success', 'User Updated', 'User details have been updated');
      setIsEditModalOpen(false);
      setSelectedUser(null);
    },
    onError: () => showToast('error', 'Error', 'Failed to update user'),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      adminApi.toggleUserStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      showToast('success', 'Status Updated', 'User status has been changed');
    },
    onError: (error: any) => {
      console.log(error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error?.message ||
        error?.message ||
        'Failed to update user status';

      showToast('warning', 'Action Restricted', message);
    },
  });

  const assignRolesMutation = useMutation({
    mutationFn: ({ id, roles }: { id: number; roles: number[] }) =>
      adminApi.updateUserRoles(id, roles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      showToast('success', 'Roles Updated', 'User roles have been assigned');
      setIsRolesModalOpen(false);
      setSelectedUser(null);
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error?.message ||
        error?.message ||
        'Failed to assign roles';
      showToast('error', 'Error', msg);
    },
  });

  const totalPages = data?.pagination?.pages || 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
    setTimeout(() => setDebouncedSearch(e.target.value), 300);
  };

  const openEditModal = (user: any) => { setSelectedUser(user); setIsEditModalOpen(true); };
  const openRolesModal = (user: any) => { setSelectedUser(user); setIsRolesModalOpen(true); };

  const handleMakeAdmin = (user: any) => {
    if (!rolesData) return;

    // 🔍 Find admin role from all roles
    const adminRole = rolesData.find((r: any) =>
      getRoleName(r).toLowerCase().includes('admin')
    );

    if (!adminRole) {
      showToast('error', 'Error', 'Admin role not found');
      return;
    }

    const currentRoleIds = user.roles.map((r: any) => r.id);

    const hasAdmin = currentRoleIds.includes(adminRole.id);

    if (hasAdmin) {
      // ❌ Remove admin
      const newRoles = currentRoleIds.filter(
        (id: number) => id !== adminRole.id
      );

      assignRolesMutation.mutate({
        id: user.id,
        roles: newRoles.length > 0 ? newRoles : []
      });

    } else {
      // ✅ Add admin
      assignRolesMutation.mutate({
        id: user.id,
        roles: [...currentRoleIds, adminRole.id]
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="User Management" subtitle="Manage system users and their access permissions" />

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{data?.pagination?.total || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{data?.items.filter((u: any) => u.isActive).length || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Inactive Users</p>
                <p className="text-2xl font-bold text-red-500 mt-1">{data?.items.filter((u: any) => !u.isActive).length || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                <UserX className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search by name, email, or username..." value={searchQuery} onChange={handleSearchChange} className="pl-10" />
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4" /> Add User
          </Button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700">Failed to load users. Please try again later.</p>
          </div>
        )}

        {/* Table */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80">
                  {['Name', 'Email', 'Username', 'Department', 'Roles', 'Status', 'Actions'].map((h) => (
                    <th key={h} className={`px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider ${h === 'Status' || h === 'Actions' ? 'text-center' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {isLoading
                  ? Array(5).fill(null).map((_, i) => (
                    <tr key={i}>{Array(7).fill(null).map((_, j) => <td key={j} className="px-4 py-4"><Skeleton className="h-4 w-full" /></td>)}</tr>
                  ))
                  : data?.items.map((user: any) => {
                    const userIsAdmin = user.roles.some(isAdminRole);
                    return (
                      <tr key={user.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${userIsAdmin ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
                              {user.fullName?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-gray-100">{user.fullName}</span>
                              {userIsAdmin && <Crown className="inline h-3.5 w-3.5 ml-1.5 text-amber-500" />}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.email}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-mono text-xs">{user.username}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.department || '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {user.roles.slice(0, 2).map((role: any) => {
                              const name = getRoleName(role);
                              const nameLower = name.toLowerCase();
                              return (
                                <Badge
                                  key={typeof role === 'object' ? role.id : name}
                                  variant={nameLower === 'super admin' || nameLower === 'super_admin' ? 'warning' : nameLower === 'administrator' || nameLower === 'admin' ? 'danger' : 'info'}
                                  className="text-xs"
                                >
                                  {name}
                                </Badge>
                              );
                            })}
                            {user.roles.length > 2 && <Badge variant="outline" className="text-xs">+{user.roles.length - 2}</Badge>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={user.isActive ? 'success' : 'danger'}>{user.isActive ? 'Active' : 'Inactive'}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button size="sm" variant="ghost" onClick={() => openEditModal(user)} title="Edit User" className="h-8 w-8 p-0"><Edit2 className="h-4 w-4" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => openRolesModal(user)} title="Assign Roles" className="h-8 w-8 p-0"><Shield className="h-4 w-4" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => handleMakeAdmin(user)} title={userIsAdmin ? 'Remove Admin' : 'Make Admin'} className="h-8 w-8 p-0" disabled={assignRolesMutation.isPending}>
                              <Crown className={`h-4 w-4 ${userIsAdmin ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}`} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                if (user.id === currentUserId && user.roles.some(isAdminRole)) {
                                  showToast(
                                    'warning',
                                    'Action Restricted',
                                    'You are an admin and cannot deactivate your own account.'
                                  );
                                  return;
                                }
                                toggleStatusMutation.mutate({ id: user.id, isActive: !user.isActive });
                              }}
                              title={user.isActive ? 'Deactivate' : 'Activate'}
                              className="h-8 w-8 p-0"
                              disabled={toggleStatusMutation.isPending}
                            >
                              {user.isActive ? <UserX className="h-4 w-4 text-red-500" /> : <UserCheck className="h-4 w-4 text-emerald-500" />}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading
              ? Array(4).fill(null).map((_, i) => (
                <div key={i} className="p-4 animate-pulse space-y-2">
                  <div className="h-4 w-32 rounded bg-gray-200 dark:bg-slate-700" />
                  <div className="h-3 w-48 rounded bg-gray-200 dark:bg-slate-700" />
                </div>
              ))
              : data?.items.map((user: any) => {
                const userIsAdmin = user.roles.some(isAdminRole);
                return (
                  <div key={user.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${userIsAdmin ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
                          {user.fullName?.charAt(0) || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {user.fullName}
                            {userIsAdmin && <Crown className="inline h-3.5 w-3.5 ml-1 text-amber-500" />}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                      <Badge variant={user.isActive ? 'success' : 'danger'} className="text-[10px] flex-shrink-0">
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.slice(0, 2).map((role: any) => {
                        const name = getRoleName(role);
                        const nameLower = name.toLowerCase();
                        return (
                          <Badge key={typeof role === 'object' ? role.id : name} variant={nameLower === 'super admin' ? 'warning' : nameLower === 'administrator' ? 'danger' : 'info'} className="text-xs">
                            {name}
                          </Badge>
                        );
                      })}
                      {user.roles.length > 2 && <Badge variant="outline" className="text-xs">+{user.roles.length - 2}</Badge>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{user.department || 'No dept.'}</span>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEditModal(user)} className="h-7 w-7 p-0"><Edit2 className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => openRolesModal(user)} className="h-7 w-7 p-0"><Shield className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => handleMakeAdmin(user)} className="h-7 w-7 p-0">
                          <Crown className={`h-3.5 w-3.5 ${userIsAdmin ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}`} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => {
                          if (user.id === currentUserId) {
                            showToast('warning', 'Action Not Allowed', 'Aap apna khud ka account deactivate nahi kar sakte!');
                            return;
                          }
                          toggleStatusMutation.mutate({ id: user.id, isActive: !user.isActive });
                        }} className="h-7 w-7 p-0">
                          {user.isActive ? <UserX className="h-3.5 w-3.5 text-red-500" /> : <UserCheck className="h-3.5 w-3.5 text-emerald-500" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {!isLoading && (!data?.items || data.items.length === 0) && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Users className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No users found</p>
              <p className="text-xs mt-1">Try adjusting your search criteria</p>
            </div>
          )}

          {data && data.pagination.total > limit && (
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 px-4 py-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, data?.pagination?.total)} of {data?.pagination?.total} users
              </p>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
                <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isCreateModalOpen && (
        <UserFormModal title="Create New User" isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={(data: any) => createMutation.mutate(data)} isLoading={createMutation.isPending} isCreate />
      )}

      {isEditModalOpen && selectedUser && (
        <UserFormModal title="Edit User" isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedUser(null); }} onSubmit={(data: any) => updateMutation.mutate({ id: selectedUser.id, data })} isLoading={updateMutation.isPending} initialData={selectedUser} />
      )}

      {isRolesModalOpen && selectedUser && (
        <RolesModal isOpen={isRolesModalOpen} onClose={() => { setIsRolesModalOpen(false); setSelectedUser(null); }} user={selectedUser} allRoles={rolesData || []} onSubmit={(roles: number[]) => assignRolesMutation.mutate({ id: selectedUser.id, roles })} isLoading={assignRolesMutation.isPending} />
      )}
    </div>
  );
}

// ─── User Form Modal ─────────────────────────────────────────────────────────
function UserFormModal({ title, isOpen, onClose, onSubmit, isLoading, initialData, isCreate }: {
  title: string; isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void;
  isLoading: boolean; initialData?: any; isCreate?: boolean;
}) {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
    username: initialData?.username || '',
    department: initialData?.department || '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: any = { fullName: formData.fullName, email: formData.email, username: formData.username, department: formData.department || null };
    if (isCreate && formData.password) data.password = formData.password;
    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[
            { label: 'Full Name', field: 'fullName', type: 'text', placeholder: 'John Doe', required: true },
            { label: 'Email', field: 'email', type: 'email', placeholder: 'john@example.com', required: true },
            { label: 'Username', field: 'username', type: 'text', placeholder: 'johndoe', required: true, disabled: !isCreate },
            { label: 'Department', field: 'department', type: 'text', placeholder: 'Finance' },
          ].map(({ label, field, type, placeholder, required, disabled }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <Input type={type} value={(formData as any)[field]} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} required={required} placeholder={placeholder} disabled={disabled} />
            </div>
          ))}
          {isCreate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required placeholder="••••••••" />
            </div>
          )}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isCreate ? 'Create User' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Roles Modal ─────────────────────────────────────────────────────────────
function RolesModal({ isOpen, onClose, user, allRoles, onSubmit, isLoading }: {
  isOpen: boolean; onClose: () => void; user: any; allRoles: any[];
  onSubmit: (roles: number[]) => void; isLoading: boolean;
}) {
  // Build a merged list: predefined roles enriched with real API role IDs.
  // If an API role matches by systemName / name, its ID is used for assignment.
  // Helper: get a consistent lookup key from an API role object.
  // API may return 'roleName', 'name', or 'systemName' — check all three.
  const getRoleKey = (r: any) =>
    (r?.systemName ?? r?.roleName ?? r?.name ?? '')
      .toLowerCase()
      .replace(/[\s-]+/g, '_');

  const mergedRoles = PREDEFINED_ROLES.map((pre) => {
    const apiMatch = allRoles.find((r: any) => {
      const k1 = getRoleKey(r);
      // also check display name separately in case systemName differs
      const k2 = (r?.roleName ?? r?.name ?? '').toLowerCase().replace(/[\s-]+/g, '_');
      return k1 === pre.key || k2 === pre.key;
    });
    return {
      ...pre,
      id: apiMatch?.id ?? null,          // null → not yet in backend
      description: apiMatch?.description ?? pre.description,
    };
  });

  // Also append any extra API roles that aren't in our predefined list
  const predefinedKeys = new Set(PREDEFINED_ROLES.map((p) => p.key));
  const extraApiRoles = allRoles
    .filter((r: any) => {
      const k = getRoleKey(r);
      return !predefinedKeys.has(k);
    })
    .map((r: any) => ({
      key: String(r.id),
      label: getRoleName(r),
      description: r.description ?? '',
      badgeVariant: 'outline' as const,
      badgeLabel: '',
      icon: 'shield',
      id: r.id,
    }));

  const allDisplayRoles = [...mergedRoles, ...extraApiRoles];

  const initialRoleIds = new Set<number>(user.roles.map((r: any) => r.id));
  const [selectedRoles, setSelectedRoles] = useState<Set<number>>(initialRoleIds);

  const toggleRole = (roleId: number | null) => {
    if (roleId === null) return;          // not in backend yet — can't assign
    setSelectedRoles((prev) => {
      const next = new Set(prev);
      next.has(roleId) ? next.delete(roleId) : next.add(roleId);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(Array.from(selectedRoles));
  };

  if (!isOpen) return null;

  // helper: pick the right icon component
  const RoleIcon = ({ icon, className }: { icon: string; className: string }) => {
    if (icon === 'crown') return <Crown className={className} />;
    if (icon === 'briefcase') return <Briefcase className={className} />;
    if (icon === 'dollar') return <DollarSign className={className} />;
    if (icon === 'user') return <User className={className} />;
    return <Shield className={className} />;
  };

  const iconColorMap: Record<string, string> = {
    crown: 'text-amber-500',
    shield: 'text-indigo-500',
    briefcase: 'text-sky-500',
    dollar: 'text-emerald-500',
    user: 'text-gray-400',
  };

  const checkedBorderMap: Record<string, string> = {
    warning: 'border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-600',
    danger: 'border-red-300   bg-red-50   dark:bg-red-900/20   dark:border-red-600',
    info: 'border-sky-300   bg-sky-50   dark:bg-sky-900/20   dark:border-sky-600',
    success: 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-600',
    outline: 'border-gray-300  bg-gray-50  dark:bg-gray-700/40  dark:border-gray-500',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Assign Roles</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{user.fullName}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Select one or more roles</p>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {allDisplayRoles.map((role) => {
              const available = role.id !== null;
              const checked = available && selectedRoles.has(role.id as number);
              const borderCls = checked
                ? checkedBorderMap[role.badgeVariant] ?? checkedBorderMap.outline
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40';

              return (
                <label
                  key={role.key}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-150 ${available ? borderCls : 'border-dashed border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleRole(role.id)}
                    disabled={!available}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${checked
                      ? 'bg-current/10'
                      : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                      <RoleIcon icon={role.icon} className={`h-4 w-4 ${iconColorMap[role.icon] ?? 'text-gray-400'}`} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{role.label}</span>
                      {role.description && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{role.description}</p>
                      )}
                      {!available && (
                        <p className="text-[10px] text-amber-500 font-medium">Not configured in backend</p>
                      )}
                    </div>
                  </div>
                  {role.badgeLabel && (
                    <Badge variant={role.badgeVariant} className="text-xs flex-shrink-0">{role.badgeLabel}</Badge>
                  )}
                </label>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-3 pt-5">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Roles
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}