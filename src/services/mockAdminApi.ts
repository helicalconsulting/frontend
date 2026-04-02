/**
 * Mock Admin API — In-memory state management for demo mode
 * Provides all admin CRUD operations using local mock data
 */

import {
  mockUsers as rawMockUsers,
  mockRoles as rawMockRoles,
  mockPermissions as rawMockPermissions,
  mockApprovalLevels as rawMockApprovalLevels,
  mockSystemSettings as rawMockSettings,
} from '@/mocks/data';

// ============================================
// In-memory state (mutable copies)
// ============================================

let users = rawMockUsers.map((u) => ({
  id: u.id,
  username: u.username,
  email: u.email,
  fullName: u.fullName,
  department: u.department || null,
  phone: u.phone || null,
  isActive: u.isActive,
  roles: u.roles.map((r: any) => (typeof r === 'string' ? r : r.name || r.displayName)),
  createdAt: u.createdAt,
  lastLogin: u.lastLogin || null,
  company: u.company || 'DEMO',
}));

let roles = rawMockRoles.map((r) => ({
  id: r.id,
  name: r.displayName,
  systemName: r.name,
  description: r.description || '',
  permissions: [...r.permissions],
  userCount: r.userCount || 0,
  isSystem: r.isSystem || false,
}));

let permissions = rawMockPermissions.map((p) => ({
  id: p.id,
  name: `${p.module}:${p.action}`,
  module: p.module,
  action: p.action,
  description: p.description || '',
}));

let approvalLevels = rawMockApprovalLevels.map((l) => ({
  id: l.id,
  module: l.module,
  level: l.levelNumber,
  name: l.levelName,
  minValue: l.minValue,
  maxValue: l.maxValue,
  requiredRole: l.requiredRole,
  description: l.description || '',
  isActive: l.isActive,
  isFinal: l.isFinal || false,
  autoApprove: l.autoApprove || false,
  timeoutHours: l.timeoutHours || 24,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}));

let systemSettings = { ...rawMockSettings };

// ============================================
// Helpers
// ============================================

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
let idCounter = 100;
function nextId(prefix: string) {
  idCounter++;
  return `${prefix}-${String(idCounter).padStart(3, '0')}`;
}

// ============================================
// Users API
// ============================================

export async function getUsers(
  page: number = 1,
  limit: number = 20,
  search: string = ''
) {
  await delay(300);
  let filtered = [...users];
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q)
    );
  }
  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    users: filtered.slice(start, end),
    total,
    page,
    limit,
  };
}

export async function createUser(data: {
  fullName: string;
  email: string;
  username: string;
  department?: string | null;
  password: string;
  roleIds?: string[];
}) {
  await delay(400);
  const newUser = {
    id: nextId('usr'),
    username: data.username,
    email: data.email,
    fullName: data.fullName,
    department: data.department || null,
    phone: null,
    isActive: true,
    roles: data.roleIds
      ? data.roleIds.map((rid) => {
          const r = roles.find((role) => role.id === rid);
          return r ? r.name : rid;
        })
      : ['Staff'],
    createdAt: new Date().toISOString(),
    lastLogin: null,
    company: 'DEMO',
  };
  users = [newUser, ...users];
  return newUser;
}

export async function updateUser(
  id: string,
  data: { fullName?: string; email?: string; department?: string | null }
) {
  await delay(300);
  users = users.map((u) =>
    u.id === id
      ? {
          ...u,
          ...(data.fullName !== undefined && { fullName: data.fullName }),
          ...(data.email !== undefined && { email: data.email }),
          ...(data.department !== undefined && { department: data.department }),
        }
      : u
  );
  return users.find((u) => u.id === id)!;
}

export async function toggleUserStatus(id: string, isActive: boolean) {
  await delay(200);
  users = users.map((u) => (u.id === id ? { ...u, isActive } : u));
  return users.find((u) => u.id === id)!;
}

export async function assignUserRoles(id: string, roleNames: string[]) {
  await delay(300);
  users = users.map((u) => (u.id === id ? { ...u, roles: roleNames } : u));
  return users.find((u) => u.id === id)!;
}

// ============================================
// Roles API
// ============================================

export async function getRoles() {
  await delay(200);
  // Recalculate user counts
  const counts: Record<string, number> = {};
  users.forEach((u) => {
    u.roles.forEach((r) => {
      counts[r] = (counts[r] || 0) + 1;
    });
  });
  return {
    roles: roles.map((r) => ({
      ...r,
      userCount: counts[r.name] || counts[r.systemName] || r.userCount || 0,
    })),
  };
}

export async function getPermissions() {
  await delay(200);
  return { permissions };
}

export async function updateRolePermissions(
  roleId: string,
  newPermissions: string[]
) {
  await delay(400);
  roles = roles.map((r) =>
    r.id === roleId ? { ...r, permissions: newPermissions } : r
  );
  return roles.find((r) => r.id === roleId)!;
}

// ============================================
// Approval Levels API
// ============================================

export async function getApprovalLevels(module?: string) {
  await delay(200);
  let filtered = [...approvalLevels];
  if (module && module !== 'all') {
    filtered = filtered.filter(
      (l) => l.module.toLowerCase() === module.toLowerCase()
    );
  }
  return { levels: filtered.sort((a, b) => a.module.localeCompare(b.module) || a.level - b.level) };
}

export async function getModules() {
  await delay(150);
  const moduleSet = new Set(approvalLevels.map((l) => l.module));
  return Array.from(moduleSet).map((m) => ({
    id: m.toLowerCase(),
    name: m,
    displayName: m.charAt(0) + m.slice(1).toLowerCase(),
  }));
}

export async function createApprovalLevel(data: {
  module: string;
  level: number;
  name: string;
  minValue: number;
  maxValue: number | null;
  requiredRole: string;
  isActive: boolean;
}) {
  await delay(400);
  const newLevel = {
    id: nextId('lvl'),
    module: data.module.toUpperCase(),
    level: data.level,
    name: data.name,
    minValue: data.minValue,
    maxValue: data.maxValue,
    requiredRole: data.requiredRole,
    description: '',
    isActive: data.isActive ?? true,
    isFinal: false,
    autoApprove: false,
    timeoutHours: 24,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  approvalLevels = [...approvalLevels, newLevel];
  return newLevel;
}

export async function updateApprovalLevel(
  id: string,
  data: Partial<{
    name: string;
    minValue: number;
    maxValue: number | null;
    requiredRole: string;
    isActive: boolean;
  }>
) {
  await delay(300);
  approvalLevels = approvalLevels.map((l) =>
    l.id === id ? { ...l, ...data, updatedAt: new Date().toISOString() } : l
  );
  return approvalLevels.find((l) => l.id === id)!;
}

export async function deleteApprovalLevel(id: string) {
  await delay(300);
  approvalLevels = approvalLevels.filter((l) => l.id !== id);
}

export async function toggleApprovalLevelStatus(
  id: string,
  isActive: boolean
) {
  await delay(200);
  approvalLevels = approvalLevels.map((l) =>
    l.id === id ? { ...l, isActive } : l
  );
}

export async function reorderApprovalLevels(
  module: string,
  levelIds: string[]
) {
  await delay(300);
  levelIds.forEach((lid, idx) => {
    approvalLevels = approvalLevels.map((l) =>
      l.id === lid ? { ...l, level: idx + 1 } : l
    );
  });
}

// ============================================
// Settings API
// ============================================

export async function getSettings() {
  await delay(200);
  return {
    sessionTimeout: systemSettings.sessionTimeoutMinutes || 30,
    maxLoginAttempts: systemSettings.maxLoginAttempts || 5,
    passwordExpireDays: 90,
    defaultCurrency: systemSettings.defaultCurrency || 'USD',
    defaultLanguage: 'en',
    enableEmailNotifications: systemSettings.emailNotifications ?? true,
    enableTwoFactor: systemSettings.requireTwoFactor ?? false,
    maintenanceMode: false,
    maxFileUploadSize: 10,
    allowedFileTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png'],
    companyName: systemSettings.companyName || 'Helical Demo Company',
    companyLogo: systemSettings.companyLogo || '',
    fiscalYearStart: '01',
    approvalReminderHours: systemSettings.approvalReminderHours || 24,
    auditLogRetentionDays: 365,
  };
}

export async function updateSettings(
  updates: Record<string, unknown>
) {
  await delay(400);
  // Merge updates into system settings
  Object.entries(updates).forEach(([key, value]) => {
    (systemSettings as any)[key] = value;
  });
  return getSettings();
}
