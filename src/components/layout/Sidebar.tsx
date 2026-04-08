import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  CreditCard,
  TrendingUp,
  BarChart3,
  Users,
  ClipboardList,
  PenTool,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navSections = [
  {
    label: 'Main',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Approvals',
    items: [
      { to: '/purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
      { to: '/accounts-payable', label: 'Accounts Payable', icon: Receipt },
      { to: '/payments', label: 'Payments', icon: CreditCard },
      { to: '/sales-orders', label: 'Sales Orders', icon: TrendingUp },
    ],
  },
  {
    label: 'Governance',
    items: [
      { to: '/master-data', label: 'Master Data', icon: Users },
      { to: '/signature', label: 'Signature', icon: PenTool },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { to: '/reports', label: 'Reports', icon: BarChart3 },
      { to: '/audit-trail', label: 'Audit Trail', icon: ClipboardList },
    ],
  },
  {
    label: 'Administration',
    requireAdmin: true,
    items: [
      { to: '/admin/users', label: 'Users', icon: Users },
      { to: '/admin/roles', label: 'Roles & Permissions', icon: Settings },
      { to: '/admin/approval-levels', label: 'Approval Levels', icon: ClipboardList },
      { to: '/admin/settings', label: 'System Settings', icon: Settings },
    ],
  },
];

export function Sidebar({ collapsed, setCollapsed }: any) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Check if user has admin permissions
  const hasAdminAccess = user?.permissions?.ADMIN?.canView || user?.role === 'Super Admin' || user?.role === 'Administrator';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-200/60 bg-gradient-to-b from-white via-gray-50/30 to-white shadow-xl transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200/60 px-4 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 shadow-lg shadow-blue-500/30 ring-2 ring-blue-100">
            <span className="text-sm font-bold text-white">H</span>
            <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse"></div>
          </div>
          {!collapsed && (
            <div className="min-w-0 animate-slide-left">
              <h1 className="text-sm font-bold text-gray-900 truncate tracking-tight">Helical</h1>
              <p className="text-[10px] text-blue-600 font-semibold">Workflow System</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {navSections
          .filter((section) => !section.requireAdmin || hasAdminAccess)
          .map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:text-gray-900 hover:shadow-sm',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse"></div>
                      )}
                      <item.icon className={cn(
                        "h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110 relative z-10",
                        isActive && "drop-shadow-sm"
                      )} />
                      {!collapsed && <span className="truncate relative z-10">{item.label}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-3 space-y-1">
        <button
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100"
          disabled
        >
          <Settings className="h-[18px] w-[18px] shrink-0 opacity-40" />
          {!collapsed && <span className="truncate opacity-40">Settings</span>}
        </button>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span className="truncate">Logout</span>}
        </button>

        {/* User info */}
        {!collapsed && user && (
          <div className="mt-2 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50/30 p-3 border border-gray-100">
            <p className="text-xs font-semibold text-gray-700 truncate">{user.fullName}</p>
            <p className="text-[10px] text-gray-400 truncate">{user.role} • {user.company}</p>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-50 flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-lg transition-all duration-200 hover:border-blue-300 hover:shadow-xl hover:scale-110 active:scale-95 group"
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5 text-gray-600 transition-colors group-hover:text-blue-600" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5 text-gray-600 transition-colors group-hover:text-blue-600" />
        )}
      </button>
    </aside>
  );
}
