import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  CreditCard,
  TrendingUp,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
  { to: '#', label: 'Accounts Payable', icon: Receipt, disabled: true },
  { to: '#', label: 'Payments', icon: CreditCard, disabled: true },
  { to: '#', label: 'Sales Orders', icon: TrendingUp, disabled: true },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md">
            <span className="text-sm font-bold text-white">W</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-gray-900 truncate">Workflow</h1>
              <p className="text-[10px] text-gray-400 font-medium">Approval System</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={(e) => item.disabled && e.preventDefault()}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive && !item.disabled
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  item.disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent hover:text-gray-600',
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.disabled && (
                <span className="ml-auto rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-400">
                  Soon
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-3 space-y-1">
        <button
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100',
          )}
          disabled
        >
          <Settings className="h-5 w-5 shrink-0 opacity-40" />
          {!collapsed && <span className="truncate opacity-40">Settings</span>}
        </button>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="truncate">Logout</span>}
        </button>

        {/* User info */}
        {!collapsed && user && (
          <div className="mt-2 rounded-lg bg-gray-50 p-3">
            <p className="text-xs font-semibold text-gray-700 truncate">{user.fullName}</p>
            <p className="text-[10px] text-gray-400 truncate">{user.role} • {user.company}</p>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50 hover:shadow"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3 text-gray-600" />
        ) : (
          <ChevronLeft className="h-3 w-3 text-gray-600" />
        )}
      </button>
    </aside>
  );
}
