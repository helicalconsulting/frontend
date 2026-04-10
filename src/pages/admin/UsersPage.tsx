import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import * as mockApi from '@/services/mockAdminApi';
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
} from 'lucide-react';

export function UsersPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

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
    queryFn: () => mockApi.getUsers(page, limit, debouncedSearch),
    staleTime: 30000,
  });

  const { data: rolesData } = useQuery({
    queryKey: ['admin-roles-list-simple'],
    queryFn: () => mockApi.getRoles(),
    staleTime: 60000,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: mockApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      showToast('success', 'User Created', 'New user has been created successfully');
      setIsCreateModalOpen(false);
    },
    onError: () => {
      showToast('error', 'Error', 'Failed to create user');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      mockApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      showToast('success', 'User Updated', 'User details have been updated');
      setIsEditModalOpen(false);
      setSelectedUser(null);
    },
    onError: () => {
      showToast('error', 'Error', 'Failed to update user');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      mockApi.toggleUserStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      showToast('success', 'Status Updated', 'User status has been changed');
    },
    onError: () => {
      showToast('error', 'Error', 'Failed to update user status');
    },
  });

  const assignRolesMutation = useMutation({
    mutationFn: ({ id, roles }: { id: string; roles: string[] }) =>
      mockApi.assignUserRoles(id, roles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      showToast('success', 'Roles Updated', 'User roles have been assigned');
      setIsRolesModalOpen(false);
      setSelectedUser(null);
    },
    onError: () => {
      showToast('error', 'Error', 'Failed to assign roles');
    },
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
    setTimeout(() => setDebouncedSearch(e.target.value), 300);
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const openRolesModal = (user: any) => {
    setSelectedUser(user);
    setIsRolesModalOpen(true);
  };

  const handleMakeAdmin = (user: any) => {
    const hasAdmin = user.roles.some(
      (r: string) => r === 'Super Admin' || r === 'Administrator'
    );
    if (hasAdmin) {
      // Remove admin role
      const newRoles = user.roles.filter(
        (r: string) => r !== 'Super Admin' && r !== 'Administrator'
      );
      assignRolesMutation.mutate({
        id: user.id,
        roles: newRoles.length > 0 ? newRoles : ['Staff'],
      });
    } else {
      // Add admin role
      assignRolesMutation.mutate({
        id: user.id,
        roles: [...user.roles, 'Administrator'],
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        title="User Management"
        subtitle="Manage system users and their access permissions"
      />

      <div className="p-6 space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {data?.total || 0}
                </p>
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
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {data?.users.filter((u: any) => u.isActive).length || 0}
                </p>
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
                <p className="text-2xl font-bold text-red-500 mt-1">
                  {data?.users.filter((u: any) => !u.isActive).length || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                <UserX className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Top toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, or username..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>

          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Error state */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700">Failed to load users. Please try again later.</p>
          </div>
        )}

        {/* Data Table */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80">
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Username</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Roles</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {isLoading
                  ? Array(5)
                      .fill(null)
                      .map((_, i) => (
                        <tr key={i}>
                          {Array(7)
                            .fill(null)
                            .map((_, j) => (
                              <td key={j} className="px-4 py-4">
                                <Skeleton className="h-4 w-full" />
                              </td>
                            ))}
                        </tr>
                      ))
                  : data?.users.map((user: any) => {
                      const isAdmin = user.roles.some(
                        (r: string) =>
                          r === 'Super Admin' ||
                          r === 'Administrator' ||
                          r === 'super_admin' ||
                          r === 'admin'
                      );
                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${isAdmin ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
                                {user.fullName?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{user.fullName}</span>
                                {isAdmin && (
                                  <Crown className="inline h-3.5 w-3.5 ml-1.5 text-amber-500" />
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.email}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-mono text-xs">{user.username}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.department || '—'}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {user.roles.slice(0, 2).map((role: string) => (
                                <Badge
                                  key={role}
                                  variant={
                                    role === 'Super Admin' || role === 'super_admin'
                                      ? 'warning'
                                      : role === 'Administrator' || role === 'admin'
                                      ? 'danger'
                                      : 'info'
                                  }
                                  className="text-xs"
                                >
                                  {role}
                                </Badge>
                              ))}
                              {user.roles.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{user.roles.length - 2}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant={user.isActive ? 'success' : 'danger'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditModal(user)}
                                title="Edit User"
                                className="h-8 w-8 p-0"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openRolesModal(user)}
                                title="Assign Roles"
                                className="h-8 w-8 p-0"
                              >
                                <Shield className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleMakeAdmin(user)}
                                title={isAdmin ? 'Remove Admin' : 'Make Admin'}
                                className="h-8 w-8 p-0"
                                disabled={assignRolesMutation.isPending}
                              >
                                <Crown
                                  className={`h-4 w-4 ${isAdmin ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}`}
                                />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  toggleStatusMutation.mutate({
                                    id: user.id,
                                    isActive: !user.isActive,
                                  })
                                }
                                title={user.isActive ? 'Deactivate' : 'Activate'}
                                className="h-8 w-8 p-0"
                                disabled={toggleStatusMutation.isPending}
                              >
                                {user.isActive ? (
                                  <UserX className="h-4 w-4 text-red-500" />
                                ) : (
                                  <UserCheck className="h-4 w-4 text-emerald-500" />
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>

          {!isLoading && (!data?.users || data.users.length === 0) && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Users className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No users found</p>
              <p className="text-xs mt-1">Try adjusting your search criteria</p>
            </div>
          )}

          {/* Pagination */}
          {data && data.total > limit && (
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 px-4 py-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, data.total)} of{' '}
                {data.total} users
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <UserFormModal
          title="Create New User"
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(data: any) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
          isCreate
        />
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <UserFormModal
          title="Edit User"
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          onSubmit={(data: any) =>
            updateMutation.mutate({ id: selectedUser.id, data })
          }
          isLoading={updateMutation.isPending}
          initialData={selectedUser}
        />
      )}

      {/* Assign Roles Modal */}
      {isRolesModalOpen && selectedUser && (
        <RolesModal
          isOpen={isRolesModalOpen}
          onClose={() => {
            setIsRolesModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          allRoles={rolesData?.roles || []}
          onSubmit={(roles: string[]) =>
            assignRolesMutation.mutate({ id: selectedUser.id, roles })
          }
          isLoading={assignRolesMutation.isPending}
        />
      )}
    </div>
  );
}

// User Form Modal Component
function UserFormModal({
  title,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
  isCreate,
}: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  initialData?: any;
  isCreate?: boolean;
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
    const data: any = {
      fullName: formData.fullName,
      email: formData.email,
      username: formData.username,
      department: formData.department || null,
    };
    if (isCreate && formData.password) {
      data.password = formData.password;
    }
    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-scale-in">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <Input
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <Input
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              placeholder="johndoe"
              disabled={!isCreate}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <Input
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="Finance"
            />
          </div>
          {isCreate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="••••••••"
              />
            </div>
          )}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
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

// Roles Modal Component
function RolesModal({
  isOpen,
  onClose,
  user,
  allRoles,
  onSubmit,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  allRoles: any[];
  onSubmit: (roles: string[]) => void;
  isLoading: boolean;
}) {
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(
    new Set(user.roles)
  );

  const toggleRole = (roleName: string) => {
    setSelectedRoles((prev) => {
      const next = new Set(prev);
      if (next.has(roleName)) {
        next.delete(roleName);
      } else {
        next.add(roleName);
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(Array.from(selectedRoles));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Assign Roles</h2>
            <p className="text-sm text-gray-500 mt-0.5">{user.fullName}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {allRoles.map((role: any) => {
              const isAdminRole =
                role.systemName === 'super_admin' || role.systemName === 'admin';
              return (
                <label
                  key={role.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedRoles.has(role.name)
                      ? isAdminRole
                        ? 'border-amber-300 bg-amber-50'
                        : 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedRoles.has(role.name)}
                    onChange={() => toggleRole(role.name)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    {isAdminRole ? (
                      <Crown className="h-4 w-4 text-amber-500" />
                    ) : (
                      <Shield className="h-4 w-4 text-gray-400" />
                    )}
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        {role.name}
                      </span>
                      {role.description && (
                        <p className="text-xs text-gray-400">{role.description}</p>
                      )}
                    </div>
                  </div>
                  {isAdminRole && (
                    <Badge variant="warning" className="text-xs">
                      Admin
                    </Badge>
                  )}
                </label>
              );
            })}
            {allRoles.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No roles available
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
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
