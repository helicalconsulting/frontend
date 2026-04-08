import { useState, useCallback, type ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContext } from '@/hooks/useAuth';
import { ThemeProvider } from '@/hooks/useTheme';
import { SidebarProvider } from '@/hooks/useSidebar';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { PurchaseOrdersPage } from '@/pages/PurchaseOrdersPage';
import { AccountsPayablePage } from '@/pages/AccountsPayablePage';
import { PaymentsPage } from '@/pages/PaymentsPage';
import { SalesOrdersPage } from '@/pages/SalesOrdersPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { MasterDataPage } from '@/pages/MasterDataPage';
import { MasterDataRequestPage } from '@/pages/MasterDataRequestPage';
import { SignaturePage } from '@/pages/SignaturePage';
import { AuditTrailPage } from '@/pages/AuditTrailPage';
import { UsersPage } from '@/pages/admin/UsersPage';
import { RolesPage } from '@/pages/admin/RolesPage';
import { ApprovalLevelsPage } from '@/pages/admin/ApprovalLevelsPage';
import { SettingsPage } from '@/pages/admin/SettingsPage';
import type { User } from '@/types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ============================================
// Auth Provider
// ============================================
function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });

  const isAuthenticated = user !== null;

  const login = useCallback((token: string, user: User) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// Protected Route
// ============================================
function ProtectedRoute({ children }: { children: ReactNode }) {
  const stored = localStorage.getItem('auth_user');
  if (!stored) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// ============================================
// App
// ============================================
export default function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <QueryClientProvider client={queryClient}>
        <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
                <Route path="/accounts-payable" element={<AccountsPayablePage />} />
                <Route path="/payments" element={<PaymentsPage />} />
                <Route path="/sales-orders" element={<SalesOrdersPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/master-data" element={<MasterDataPage />} />
                <Route path="/master-data/new" element={<MasterDataRequestPage />} />
                <Route path="/signature" element={<SignaturePage />} />
                <Route path="/audit-trail" element={<AuditTrailPage />} />
                {/* Admin Routes */}
                <Route path="/admin/users" element={<UsersPage />} />
                <Route path="/admin/roles" element={<RolesPage />} />
                <Route path="/admin/approval-levels" element={<ApprovalLevelsPage />} />
                <Route path="/admin/settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
        </ToastProvider>
        </QueryClientProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
