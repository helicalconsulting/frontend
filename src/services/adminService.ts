import apiClient from './apiClient';
import { mockUsers, mockRoles, mockPermissions, mockApprovalLevels, mockSystemSettings } from '@/mocks/data';

// Toggle between mock and real API calls
const USE_MOCK = false;

// ============================================
// Types
// ============================================
export interface AdminUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  department?: string;
  isActive: boolean;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  roleName: string;           // matches backend `roleName` field
  name?: string;              // kept for backwards-compat with other consumers
  description?: string;
  userCount?: number;         // from _count.userRoles
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  roleId: number;
  module: string;
  canView: boolean;
  canCreate: boolean;
  canApprove: boolean;
  canReject: boolean;
  maxValue?: number | null;
}

export interface ApprovalLevel {
  id: number;
  module: string;
  level: number;
  name: string;
  minValue: number;
  maxValue: number | null;
  roleId: number;
  role?: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettings {
  id: number;
  key: string;
  value: string;
  description?: string;
  updatedAt: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive' | 'all';
  search?: string;
  roleId?: number;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  department?: string;
  roleIds?: number[];
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
  department?: string;
  password?: string;
}

export interface CreateApprovalLevelData {
  module: string;
  level: number;
  name: string;
  minValue: number;
  maxValue?: number | null;
  roleId: number;
}

export interface UpdateApprovalLevelData {
  name?: string;
  minValue?: number;
  maxValue?: number | null;
  roleId?: number;
  isActive?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ============================================
// User Management
// ============================================

/**
 * Get all users with pagination and filters
 */
export async function getUsers(params?: GetUsersParams): Promise<PaginatedResponse<AdminUser>> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    const users = mockUsers.map(u => ({
      id: parseInt(u.id.replace('usr-', '')),
      username: u.username,
      email: u.email,
      fullName: u.fullName,
      department: u.department,
      isActive: u.isActive,
      roles: u.roles as unknown as Role[],
      createdAt: u.createdAt,
      updatedAt: u.createdAt,
    }));
    return { 
      items: users, 
      pagination: { page: 1, limit: 20, total: users.length, pages: 1 } 
    };
  }

  const response = await apiClient.get('/admin/users', { params });
  
  const apiData = response.data.data;

  return {
    items: apiData.users,        // ✅ FIX
    pagination: apiData.pagination
  };
}

/**
 * Get a single user by ID
 */
export async function getUser(id: number): Promise<AdminUser> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    throw new Error('User not found');
  }
  const response = await apiClient.get(`/admin/users/${id}`);
  return response.data.data || response.data.data.user;
}

/**
 * Create a new user
 */
export async function createUser(data: CreateUserData): Promise<AdminUser> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    throw new Error('Mock mode - cannot create user');
  }
  const response = await apiClient.post('/admin/users', data);
  console.log("api calling");
  return response.data.data.user || response.data.data;
}

/**
 * Update a user
 */
export async function updateUser(id: number, data: UpdateUserData): Promise<AdminUser> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    throw new Error('Mock mode - cannot update user');
  }
  const response = await apiClient.put(`/admin/users/${id}`, data);
  return response.data.data || response.data.data.user;
}

/**
 * Update user active status
 */
export async function updateUserStatus(id: number, isActive: boolean): Promise<AdminUser> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    throw new Error('Mock mode - cannot update status');
  }
  const response = await apiClient.patch(`/admin/users/${id}/status`, { isActive });
  return response.data.data;
}

/**
 * Assign roles to a user
 */
export async function updateUserRoles(id: number, roleIds: number[]): Promise<AdminUser> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    throw new Error('Mock mode - cannot update roles');
  }
  const response = await apiClient.put(`/admin/users/${id}/roles`, { roleIds });
  return response.data.data;
}

// ============================================
// Roles & Permissions
// ============================================

/**
 * Get all roles
 */
export async function getRoles(): Promise<Role[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return mockRoles.map((r) => ({
      id: parseInt(r.id.replace('role-', '')),
      roleName: r.displayName,
      name: r.displayName,
      description: r.description,
      userCount: 0,
      permissions: r.permissions.map((p, i) => ({
        id: i,
        roleId: 0,
        module: p.split(':')[0],
        canView: true,
        canCreate: false,
        canApprove: false,
        canReject: false,
      })),
    }));
  }
  const response = await apiClient.get('/admin/roles');
  // Backend returns: { success, data: Role[] }
  return response.data.data;
}

/**
 * Get all permissions grouped by module.
 * Backend returns: Record<string, Permission[]>
 */
export async function getPermissions(): Promise<Record<string, Permission[]>> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    const byModule: Record<string, Permission[]> = {};
    mockPermissions.forEach((p, i) => {
      const mod = p.module;
      if (!byModule[mod]) byModule[mod] = [];
      byModule[mod].push({
        id: i,
        roleId: 0,
        module: mod,
        canView: true,
        canCreate: false,
        canApprove: false,
        canReject: false,
      });
    });
    return byModule;
  }
  const response = await apiClient.get('/admin/permissions');
  return response.data.data;
}

/**
 * Update permissions for a role.
 * Sends: { permissions: Array<{ module, canView, canCreate, canApprove, canReject, maxValue }> }
 */
export async function updateRolePermissions(
  roleId: number,
  permissions: Array<{
    module: string;
    canView?: boolean;
    canCreate?: boolean;
    canApprove?: boolean;
    canReject?: boolean;
    maxValue?: number | null;
  }>
): Promise<Permission[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    throw new Error('Mock mode - cannot update permissions');
  }
  const response = await apiClient.put(`/admin/roles/${roleId}/permissions`, { permissions });
  return response.data.data;
}

// ============================================
// Approval Levels
// ============================================

/**
 * Get approval levels, optionally filtered by module
 */
export async function getApprovalLevels(module?: string): Promise<ApprovalLevel[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    let levels = mockApprovalLevels;
    if (module) {
      levels = levels.filter(l => l.module.toLowerCase() === module.toLowerCase());
    }
    return levels.map(l => ({
      id: parseInt(l.id.replace('lvl-', '')),
      module: l.module,
      level: l.levelNumber,
      name: l.levelName,
      minValue: l.minValue,
      maxValue: l.maxValue,
      roleId: 1,
      isActive: l.isActive,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    }));
  }
  const params = module ? { module } : undefined;
  const response = await apiClient.get('/admin/approval-levels', { params });
  return response.data.data;
}

/**
 * Get list of modules that have approval levels
 */
export async function getApprovalModules(): Promise<string[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return ['po', 'ap', 'payments', 'sales', 'onboarding'];
  }
  const response = await apiClient.get('/admin/approval-levels/modules');
  return response.data.data;
}

/**
 * Create a new approval level
 */
export async function createApprovalLevel(data: CreateApprovalLevelData): Promise<ApprovalLevel> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    throw new Error('Mock mode - cannot create approval level');
  }
  const response = await apiClient.post('/admin/approval-levels', data);
  return response.data.data;
}

/**
 * Update an approval level
 */
export async function updateApprovalLevel(
  id: number,
  data: UpdateApprovalLevelData
): Promise<ApprovalLevel> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    throw new Error('Mock mode - cannot update approval level');
  }
  const response = await apiClient.put(`/admin/approval-levels/${id}`, data);
  return response.data.data;
}

/**
 * Delete an approval level
 */
export async function deleteApprovalLevel(id: number): Promise<void> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    throw new Error('Mock mode - cannot delete approval level');
  }
  await apiClient.delete(`/admin/approval-levels/${id}`);
}

/**
 * Reorder approval levels for a module
 */
export async function reorderApprovalLevels(
  levels: { id: number; level: number }[]
): Promise<ApprovalLevel[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    throw new Error('Mock mode - cannot reorder levels');
  }
  const response = await apiClient.post('/admin/approval-levels/reorder', { levels });
  return response.data.data;
}

// ============================================
// System Settings
// ============================================

/**
 * Get all system settings
 */
export async function getSettings(): Promise<SystemSettings[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    const settings = mockSystemSettings;
    return Object.entries(settings).map(([key, value], i) => ({
      id: i + 1,
      key,
      value: typeof value === 'object' ? JSON.stringify(value) : String(value),
      description: key,
      updatedAt: '2026-01-01T00:00:00Z',
    }));
  }
  const response = await apiClient.get('/admin/settings');
  return response.data.data;
}

/**
 * Update system settings
 */
export async function updateSettings(
  data: Record<string, string>
): Promise<SystemSettings[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    throw new Error('Mock mode - cannot update settings');
  }
  const response = await apiClient.put('/admin/settings', data);
  return response.data.data;
}
// ✅ NAYA - REPLACE KARO
export async function toggleUserStatus(id: number, isActive: boolean): Promise<AdminUser> {
  const response = await apiClient.patch(`/admin/users/${id}/status`, { isActive });
  return response.data.data;
}

