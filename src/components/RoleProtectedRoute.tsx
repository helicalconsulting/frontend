import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface RoleProtectedRouteProps {
  children: ReactNode;
  /** List of roles allowed to access this route */
  allowedRoles: string[];
  /** Where to redirect if access is denied (default: /dashboard) */
  redirectTo?: string;
}

/**
 * Route guard that checks if the authenticated user has one of the allowed roles.
 * Checks both `user.roles` (array from backend) and `user.role` (legacy string).
 */
export function RoleProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/dashboard',
}: RoleProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check roles array from backend
  const userRoles = user.roles || [];
  // Also check legacy single role field
  const legacyRole = user.role || '';

  const hasAccess =
    userRoles.some((r) => allowedRoles.includes(r)) ||
    allowedRoles.includes(legacyRole) ||
    // Super admin always has access
    userRoles.includes('super_admin') ||
    legacyRole === 'Super Admin';

  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
