import apiClient from "./apiClient";
import { API_CONFIG } from "@/config";

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
  name: string;
  description?: string;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  module: string;
  description?: string;
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
  const response = await apiClient.get('/admin/users', { params });
  return response.data.data;
}

/**
 * Get a single user by ID
 */
export async function getUser(id: number): Promise<AdminUser> {
  const response = await apiClient.get(`/admin/users/${id}`);
  return response.data.data;
}

/**
 * Create a new user
 */
export async function createUser(data: CreateUserData): Promise<AdminUser> {
  const response = await apiClient.post('/admin/users', data);
  return response.data.data;
}

/**
 * Update a user
 */
export async function updateUser(id: number, data: UpdateUserData): Promise<AdminUser> {
  const response = await apiClient.put(`/admin/users/${id}`, data);
  return response.data.data;
}

/**
 * Update user active status
 */
export async function updateUserStatus(id: number, isActive: boolean): Promise<AdminUser> {
  const response = await apiClient.patch(`/admin/users/${id}/status`, { isActive });
  return response.data.data;
}

/**
 * Assign roles to a user
 */
export async function updateUserRoles(id: number, roleIds: number[]): Promise<AdminUser> {
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
  const response = await apiClient.get('/admin/roles');
  return response.data.data;
}

/**
 * Get all permissions
 */
export async function getPermissions(): Promise<Permission[]> {
  const response = await apiClient.get('/admin/permissions');
  return response.data.data;
}

/**
 * Update permissions for a role
 */
export async function updateRolePermissions(
  roleId: number,
  permissionIds: number[]
): Promise<Role> {
  const response = await apiClient.put(`/admin/roles/${roleId}/permissions`, { permissionIds });
  return response.data.data;
}

// ============================================
// Approval Levels
// ============================================

/**
 * Get approval levels, optionally filtered by module
 */
export async function getApprovalLevels(module?: string): Promise<ApprovalLevel[]> {
  const params = module ? { module } : undefined;
  const response = await apiClient.get('/admin/approval-levels', { params });
  return response.data.data;
}

/**
 * Get list of modules that have approval levels
 */
export async function getApprovalModules(): Promise<string[]> {
  const response = await apiClient.get('/admin/approval-levels/modules');
  return response.data.data;
}

/**
 * Create a new approval level
 */
export async function createApprovalLevel(data: CreateApprovalLevelData): Promise<ApprovalLevel> {
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
  const response = await apiClient.put(`/admin/approval-levels/${id}`, data);
  return response.data.data;
}

/**
 * Delete an approval level
 */
export async function deleteApprovalLevel(id: number): Promise<void> {
  await apiClient.delete(`/admin/approval-levels/${id}`);
}

/**
 * Reorder approval levels for a module
 */
export async function reorderApprovalLevels(
  levels: { id: number; level: number }[]
): Promise<ApprovalLevel[]> {
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
  const response = await apiClient.get('/admin/settings');
  return response.data.data;
}

/**
 * Update system settings
 */
export async function updateSettings(
  data: Record<string, string>
): Promise<SystemSettings[]> {
  const response = await apiClient.put('/admin/settings', data);
  return response.data.data;
}
