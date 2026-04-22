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
  ChevronDown,
  Loader2,
  AlertTriangle,
  Crown,
  Briefcase,
  DollarSign,
  User,
  Check,
  Mail,
  Building2,
  AtSign,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserRole {
  id: number;
  roleName?: string;
  name?: string;
  systemName?: string;
}

interface UserItem {
  id: number;
  fullName: string;
  email: string;
  username: string;
  department?: string;
  isActive: boolean;
  roles: UserRole[];
}

// ─── Predefined roles ─────────────────────────────────────────────────────────

const PREDEFINED_ROLES = [
  { key: 'super_admin', label: 'Super Admin', description: 'Full system access — company administrator', badgeVariant: 'warning' as const, badgeLabel: 'Admin', icon: 'crown' },
  { key: 'administrator', label: 'Administrator', description: 'Manage users, settings and system configuration', badgeVariant: 'danger' as const, badgeLabel: 'Admin', icon: 'shield' },
  { key: 'manager', label: 'Manager', description: 'Oversee team workflows and approve requests', badgeVariant: 'info' as const, badgeLabel: 'Manager', icon: 'briefcase' },
  { key: 'finance_approver', label: 'Finance Approver', description: 'Review and approve financial transactions', badgeVariant: 'success' as const, badgeLabel: 'Finance', icon: 'dollar' },
  { key: 'staff', label: 'Staff', description: 'Standard employee access to assigned modules', badgeVariant: 'outline' as const, badgeLabel: 'Staff', icon: 'user' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRoleName(role: any): string {
  if (typeof role === 'string') return role;
  return role?.roleName ?? role?.name ?? String(role);
}

function isAdminRole(role: any): boolean {
  const name = getRoleName(role).toLowerCase();
  return name === 'super admin' || name === 'administrator' || name === 'super_admin' || name === 'admin';
}

function getCurrentUserId(): number | null {
  try {
    const raw = localStorage.getItem('user') || localStorage.getItem('currentUser') || sessionStorage.getItem('user') || sessionStorage.getItem('currentUser');
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed?.id ?? parsed?.userId ?? null;
    }
  } catch {}
  return null;
}

type UserVariant = 'admin' | 'finance' | 'manager' | 'staff' | 'default';

function getUserVariant(user: UserItem): UserVariant {
  for (const role of user.roles) {
    const key = getRoleName(role).toLowerCase();
    if (key.includes('super_admin') || key.includes('super admin') || key.includes('administrator') || key.includes('admin')) return 'admin';
    if (key.includes('finance')) return 'finance';
    if (key.includes('manager')) return 'manager';
    if (key.includes('staff')) return 'staff';
  }
  return 'default';
}

// Same VARIANT_STYLES as RolesPage for visual consistency
const VARIANT_STYLES: Record<UserVariant, { iconBg: string; iconColor: string; avatarGradient: string; border: string }> = {
  admin:   { iconBg: 'bg-red-50 dark:bg-red-900/20',       iconColor: 'text-red-600 dark:text-red-400',       avatarGradient: 'from-red-500 to-orange-600',     border: 'border-l-red-500' },
  finance: { iconBg: 'bg-emerald-50 dark:bg-emerald-900/20', iconColor: 'text-emerald-600 dark:text-emerald-400', avatarGradient: 'from-emerald-500 to-teal-600', border: 'border-l-emerald-500' },
  manager: { iconBg: 'bg-blue-50 dark:bg-blue-900/20',     iconColor: 'text-blue-600 dark:text-blue-400',     avatarGradient: 'from-blue-500 to-indigo-600',    border: 'border-l-blue-500' },
  staff:   { iconBg: 'bg-gray-100 dark:bg-gray-700',       iconColor: 'text-gray-500 dark:text-gray-400',     avatarGradient: 'from-gray-400 to-gray-600',      border: 'border-l-gray-400' },
  default: { iconBg: 'bg-blue-50 dark:bg-blue-900/20',     iconColor: 'text-blue-600 dark:text-blue-400',     avatarGradient: 'from-blue-500 to-indigo-600',    border: 'border-l-blue-500' },
};

// ─── UsersPage ────────────────────────────────────────────────────────────────

export function UsersPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const currentUserId = getCurrentUserId();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set());

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

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

  const createMutation = useMutation({
    mutationFn: adminApi.createUser,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); showToast('success', 'User Created', 'New user has been created successfully'); setIsCreateModalOpen(false); },
    onError: () => showToast('error', 'Error', 'Failed to create user'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updateUser(Number(id), data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); showToast('success', 'User Updated', 'User details have been updated'); setIsEditModalOpen(false); setSelectedUser(null); },
    onError: () => showToast('error', 'Error', 'Failed to update user'),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => adminApi.toggleUserStatus(id, isActive),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); showToast('success', 'Status Updated', 'User status has been changed'); },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.response?.data?.error?.message || error?.message || 'Failed to update user status';
      showToast('warning', 'Action Restricted', message);
    },
  });

  const assignRolesMutation = useMutation({
    mutationFn: ({ id, roles }: { id: number; roles: number[] }) => adminApi.updateUserRoles(id, roles),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); queryClient.invalidateQueries({ queryKey: ['admin-roles'] }); showToast('success', 'Roles Updated', 'User roles have been assigned'); setIsRolesModalOpen(false); setSelectedUser(null); },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error?.response?.data?.error?.message || error?.message || 'Failed to assign roles';
      showToast('error', 'Error', msg);
    },
  });

  const handleMakeAdmin = (user: UserItem) => {
    if (!rolesData) return;
    const adminRole = rolesData.find((r: any) => getRoleName(r).toLowerCase().includes('admin'));
    if (!adminRole) { showToast('error', 'Error', 'Admin role not found'); return; }
    const currentRoleIds = user.roles.map((r) => r.id);
    const hasAdmin = currentRoleIds.includes(adminRole.id);
    assignRolesMutation.mutate({ id: user.id, roles: hasAdmin ? currentRoleIds.filter((id) => id !== adminRole.id) : [...currentRoleIds, adminRole.id] });
  };

  const toggleExpand = (userId: number) => {
    setExpandedUsers((prev) => { const next = new Set(prev); next.has(userId) ? next.delete(userId) : next.add(userId); return next; });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
    setTimeout(() => setDebouncedSearch(e.target.value), 300);
  };

  const totalPages = data?.pagination?.pages || 0;
  const users: UserItem[] = data?.items ?? [];
  const totalUsers = data?.pagination?.total || 0;
  const activeCount = users.filter((u) => u.isActive).length;
  const inactiveCount = users.filter((u) => !u.isActive).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="User Management" subtitle="Manage system users and their access permissions" />

      <div className="px-3 py-4 sm:px-6 sm:py-6 space-y-4">

        {/* ── Summary Strip (matches RolesPage style) ── */}
        <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
          {[
            { label: 'Total',    value: totalUsers,    icon: <Users className="h-4 w-4" />,     color: 'text-blue-600 dark:text-blue-400',     bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Active',   value: activeCount,   icon: <UserCheck className="h-4 w-4" />,  color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
            { label: 'Inactive', value: inactiveCount, icon: <UserX className="h-4 w-4" />,     color: 'text-red-600 dark:text-red-400',       bg: 'bg-red-50 dark:bg-red-900/20' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center justify-center gap-1.5 py-4">
              <div className={`h-7 w-7 rounded-md flex items-center justify-center ${s.bg} ${s.color}`}>{s.icon}</div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white leading-none">
                {isLoading ? '—' : s.value}
              </p>
              <p className="text-[10px] uppercase tracking-wide font-medium text-gray-400 dark:text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 p-3 flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-400">Failed to load users. Please try again.</p>
          </div>
        )}

        {/* ── Users List ── */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">

          {/* List header with search + add */}
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 shrink-0">
                Users
              </span>
              <div className="relative flex-1 max-w-xs hidden sm:block">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search users..."
                  className="w-full h-7 pl-7 pr-3 text-xs rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-gray-400 dark:text-gray-500 hidden sm:block">
                {totalUsers} records
              </span>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="h-8 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="h-4 w-4" /> Add User
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="sm:hidden px-4 py-2 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
              <input
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search users..."
                className="w-full h-8 pl-7 pr-3 text-xs rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
            {isLoading
              ? Array(5).fill(null).map((_, i) => (
                  <div key={i} className="p-4 space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-52" />
                  </div>
                ))
              : users.map((user) => (
                  <UserItem
                    key={user.id}
                    user={user}
                    isExpanded={expandedUsers.has(user.id)}
                    onToggleExpand={() => toggleExpand(user.id)}
                    onEdit={() => { setSelectedUser(user); setIsEditModalOpen(true); }}
                    onAssignRoles={() => { setSelectedUser(user); setIsRolesModalOpen(true); }}
                    onToggleAdmin={() => handleMakeAdmin(user)}
                    onToggleStatus={() => {
                      if (user.id === currentUserId && user.roles.some(isAdminRole)) {
                        showToast('warning', 'Action Restricted', 'You are an admin and cannot deactivate your own account.');
                        return;
                      }
                      toggleStatusMutation.mutate({ id: user.id, isActive: !user.isActive });
                    }}
                    isAdminTogglePending={assignRolesMutation.isPending}
                    isStatusTogglePending={toggleStatusMutation.isPending}
                  />
                ))}
          </div>

          {!isLoading && users.length === 0 && (
            <div className="flex flex-col items-center justify-center py-14 text-gray-400 dark:text-gray-600">
              <Users className="h-10 w-10 mb-2 opacity-40" />
              <p className="text-sm">No users found</p>
            </div>
          )}

          {/* Pagination */}
          {data && data.pagination.total > limit && (
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 px-4 py-2.5">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(page - 1) * limit + 1}–{Math.min(page * limit, data.pagination.total)} of {data.pagination.total}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-6 w-6 rounded flex items-center justify-center border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="text-xs text-gray-500 dark:text-gray-400 px-1">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="h-6 w-6 rounded flex items-center justify-center border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <UserFormModal title="Create New User" onClose={() => setIsCreateModalOpen(false)} onSubmit={(d) => createMutation.mutate(d)} isLoading={createMutation.isPending} isCreate />
      )}
      {isEditModalOpen && selectedUser && (
        <UserFormModal title="Edit User" onClose={() => { setIsEditModalOpen(false); setSelectedUser(null); }} onSubmit={(d) => updateMutation.mutate({ id: String(selectedUser.id), data: d })} isLoading={updateMutation.isPending} initialData={selectedUser} />
      )}
      {isRolesModalOpen && selectedUser && (
        <RolesModal onClose={() => { setIsRolesModalOpen(false); setSelectedUser(null); }} user={selectedUser} allRoles={rolesData || []} onSubmit={(roles) => assignRolesMutation.mutate({ id: selectedUser.id, roles })} isLoading={assignRolesMutation.isPending} />
      )}
    </div>
  );
}

// ─── UserItem ─────────────────────────────────────────────────────────────────

function UserItem({
  user, isExpanded, onToggleExpand, onEdit, onAssignRoles, onToggleAdmin, onToggleStatus,
  isAdminTogglePending, isStatusTogglePending,
}: {
  user: UserItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onAssignRoles: () => void;
  onToggleAdmin: () => void;
  onToggleStatus: () => void;
  isAdminTogglePending: boolean;
  isStatusTogglePending: boolean;
}) {
  const variant = getUserVariant(user);
  const style = VARIANT_STYLES[variant];
  const userIsAdmin = user.roles.some(isAdminRole);
  const initial = user.fullName?.charAt(0)?.toUpperCase() || 'U';

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
        {/* Avatar */}
        <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${style.avatarGradient} flex items-center justify-center text-white text-sm font-semibold shrink-0`}>
          {initial}
        </div>

        {/* Name + email */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate leading-tight">
              {user.fullName}
            </p>
            {userIsAdmin && <Crown className="h-3 w-3 text-amber-500 shrink-0" />}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{user.email}</p>
        </div>

        {/* Role badges */}
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          {user.roles.slice(0, 2).map((role) => {
            const name = getRoleName(role);
            const nl = name.toLowerCase();
            return (
              <span
                key={typeof role === 'object' ? role.id : name}
                className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded
                  ${nl.includes('admin') ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    : nl.includes('finance') ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                    : nl.includes('manager') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
              >
                {name}
              </span>
            );
          })}
          {user.roles.length > 2 && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              +{user.roles.length - 2}
            </span>
          )}
        </div>

        {/* Status badge */}
        <span
          className={`hidden xs:inline-flex text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0
            ${user.isActive
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}
        >
          {user.isActive ? 'Active' : 'Inactive'}
        </span>

        {/* Action buttons */}
        <div
          className="flex items-center gap-1 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onEdit}
            title="Edit"
            className="h-7 w-7 rounded flex items-center justify-center text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onAssignRoles}
            title="Assign Roles"
            className="h-7 w-7 rounded flex items-center justify-center text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Shield className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onToggleAdmin}
            title={userIsAdmin ? 'Remove Admin' : 'Make Admin'}
            disabled={isAdminTogglePending}
            className="h-7 w-7 rounded flex items-center justify-center transition-colors disabled:opacity-50 hover:bg-amber-50 dark:hover:bg-amber-900/20"
          >
            <Crown className={`h-3.5 w-3.5 ${userIsAdmin ? 'text-amber-500 fill-amber-400' : 'text-gray-400 hover:text-amber-500'}`} />
          </button>
          <button
            onClick={onToggleStatus}
            title={user.isActive ? 'Deactivate' : 'Activate'}
            disabled={isStatusTogglePending}
            className="h-7 w-7 rounded flex items-center justify-center transition-colors disabled:opacity-50"
          >
            {user.isActive
              ? <UserX className="h-3.5 w-3.5 text-red-500 hover:text-red-600" />
              : <UserCheck className="h-3.5 w-3.5 text-emerald-500 hover:text-emerald-600" />}
          </button>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>

      {/* ── Expanded Detail Panel ── */}
      {isExpanded && (
        <div className="bg-gray-50/50 dark:bg-gray-900/40 border-t border-gray-100 dark:border-gray-700/60 px-4 pb-3 pt-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
            User Details
          </p>

          <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="divide-y divide-gray-100 dark:divide-gray-700/50">

              {/* Username */}
              <div className="flex items-center gap-3 px-3 py-2.5">
                <AtSign className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 w-20 shrink-0">Username</span>
                <span className="text-xs font-mono text-gray-700 dark:text-gray-300">{user.username}</span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 px-3 py-2.5">
                <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 w-20 shrink-0">Email</span>
                <span className="text-xs text-gray-700 dark:text-gray-300 truncate">{user.email}</span>
              </div>

              {/* Department */}
              <div className="flex items-center gap-3 px-3 py-2.5">
                <Building2 className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 w-20 shrink-0">Department</span>
                <span className="text-xs text-gray-700 dark:text-gray-300">{user.department || '—'}</span>
              </div>

              {/* Roles */}
              <div className="flex items-start gap-3 px-3 py-2.5">
                <Shield className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 w-20 shrink-0 mt-0.5">Roles</span>
                <div className="flex flex-wrap gap-1">
                  {user.roles.length === 0
                    ? <span className="text-xs text-gray-400">No roles assigned</span>
                    : user.roles.map((role) => {
                        const name = getRoleName(role);
                        const nl = name.toLowerCase();
                        return (
                          <span
                            key={typeof role === 'object' ? role.id : name}
                            className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded
                              ${nl.includes('admin') ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                : nl.includes('finance') ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                : nl.includes('manager') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
                          >
                            {name}
                          </span>
                        );
                      })}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── User Form Modal ──────────────────────────────────────────────────────────

function UserFormModal({
  title, onClose, onSubmit, isLoading, initialData, isCreate,
}: {
  title: string; onClose: () => void; onSubmit: (data: any) => void;
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

  const fields = [
    { label: 'Full Name',   field: 'fullName',    type: 'text',     placeholder: 'John Doe',          required: true },
    { label: 'Email',       field: 'email',       type: 'email',    placeholder: 'john@example.com',  required: true },
    { label: 'Username',    field: 'username',    type: 'text',     placeholder: 'johndoe',           required: true, disabled: !isCreate },
    { label: 'Department',  field: 'department',  type: 'text',     placeholder: 'Finance' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-800 rounded-t-xl sm:rounded-xl shadow-xl w-full max-w-md sm:mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <User className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
          </div>
          <button onClick={onClose} className="h-7 w-7 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {fields.map(({ label, field, type, placeholder, required, disabled }) => (
            <div key={field}>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">{label}</label>
              <input
                type={type}
                value={(formData as any)[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                required={required}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full h-8 px-3 text-sm rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          ))}
          {isCreate && (
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="••••••••"
                className="w-full h-8 px-3 text-sm rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="h-8 px-3 rounded border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="h-8 px-3 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-60">
              {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              {isCreate ? 'Create User' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Roles Modal ──────────────────────────────────────────────────────────────

function RolesModal({
  onClose, user, allRoles, onSubmit, isLoading,
}: {
  onClose: () => void; user: UserItem; allRoles: any[];
  onSubmit: (roles: number[]) => void; isLoading: boolean;
}) {
  const getRoleKey = (r: any) => (r?.systemName ?? r?.roleName ?? r?.name ?? '').toLowerCase().replace(/[\s-]+/g, '_');

  const mergedRoles = PREDEFINED_ROLES.map((pre) => {
    const apiMatch = allRoles.find((r: any) => {
      const k1 = getRoleKey(r);
      const k2 = (r?.roleName ?? r?.name ?? '').toLowerCase().replace(/[\s-]+/g, '_');
      return k1 === pre.key || k2 === pre.key;
    });
    return { ...pre, id: apiMatch?.id ?? null, description: apiMatch?.description ?? pre.description };
  });

  const predefinedKeys = new Set(PREDEFINED_ROLES.map((p) => p.key));
  const extraApiRoles = allRoles
    .filter((r: any) => !predefinedKeys.has(getRoleKey(r)))
    .map((r: any) => ({ key: String(r.id), label: getRoleName(r), description: r.description ?? '', badgeVariant: 'outline' as const, badgeLabel: '', icon: 'shield', id: r.id }));

  const allDisplayRoles = [...mergedRoles, ...extraApiRoles];
  const [selectedRoles, setSelectedRoles] = useState<Set<number>>(new Set(user.roles.map((r) => r.id)));

  const toggleRole = (roleId: number | null) => {
    if (roleId === null) return;
    setSelectedRoles((prev) => { const next = new Set(prev); next.has(roleId) ? next.delete(roleId) : next.add(roleId); return next; });
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(Array.from(selectedRoles)); };

  const iconColorMap: Record<string, string> = { crown: 'text-amber-500', shield: 'text-indigo-500', briefcase: 'text-sky-500', dollar: 'text-emerald-500', user: 'text-gray-400' };

  const RoleIcon = ({ icon, className }: { icon: string; className: string }) => {
    if (icon === 'crown') return <Crown className={className} />;
    if (icon === 'briefcase') return <Briefcase className={className} />;
    if (icon === 'dollar') return <DollarSign className={className} />;
    if (icon === 'user') return <User className={className} />;
    return <Shield className={className} />;
  };

  const checkedBgMap: Record<string, string> = {
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-600',
    danger:  'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600',
    info:    'bg-sky-50 dark:bg-sky-900/20 border-sky-300 dark:border-sky-600',
    success: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-600',
    outline: 'bg-gray-50 dark:bg-gray-700/40 border-gray-300 dark:border-gray-500',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-800 rounded-t-xl sm:rounded-xl shadow-xl w-full max-w-md sm:mx-4 max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-4 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">Assign Roles</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{user.fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              {selectedRoles.size} selected
            </span>
            <button onClick={onClose} className="h-7 w-7 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          {/* Column hint */}
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 shrink-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Select one or more roles
            </span>
          </div>

          {/* Role list */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700/50">
            {allDisplayRoles.map((role) => {
              const available = role.id !== null;
              const checked = available && selectedRoles.has(role.id as number);

              return (
                <label
                  key={role.key}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 cursor-pointer
                    border-l-[3px] transition-colors
                    ${!available ? 'opacity-50 cursor-not-allowed border-l-transparent' :
                      checked
                        ? `${checkedBgMap[role.badgeVariant] ?? checkedBgMap.outline} border-l-blue-500`
                        : 'border-l-transparent hover:bg-gray-50/60 dark:hover:bg-gray-700/20'}
                  `}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleRole(role.id)}
                    disabled={!available}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 shrink-0"
                  />
                  <div className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${checked ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    <RoleIcon icon={role.icon} className={`h-4 w-4 ${iconColorMap[role.icon] ?? 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{role.label}</p>
                    {role.description && <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{role.description}</p>}
                    {!available && <p className="text-[10px] text-amber-500 font-medium mt-0.5">Not configured in backend</p>}
                  </div>
                  {role.badgeLabel && (
                    <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0
                      ${role.badgeVariant === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                        : role.badgeVariant === 'danger' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        : role.badgeVariant === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                        : role.badgeVariant === 'info' ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
                    >
                      {role.badgeLabel}
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-gray-100 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-900 shrink-0">
            <button type="button" onClick={onClose} className="h-8 px-3 rounded border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="h-8 px-3 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-60">
              {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Save Roles
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}