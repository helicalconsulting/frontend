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
import { useSidebar } from '@/hooks/useSidebar';

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

export function Sidebar() {
  const { user, logout } = useAuth();
  const { collapsed, setCollapsed, toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  // Check if user has admin permissions
  const hasAdminAccess = user?.permissions?.ADMIN?.canView || user?.role === 'Super Admin' || user?.role === 'Administrator';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-gray-900/50 backdrop-blur-sm md:hidden transition-opacity duration-300",
          !collapsed ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={() => setCollapsed(true)}
      />

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-200/60 dark:border-slate-800 bg-gradient-to-b from-white via-gray-50/30 to-white dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-900 shadow-xl',
          collapsed ? '-translate-x-full md:translate-x-0 md:w-[72px]' : 'translate-x-0 w-64',
        )}
        style={{ transition: 'width 300ms ease-in-out, transform 300ms ease-in-out' }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-200/60 dark:border-slate-800 px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
          <div className="flex items-center">
            <div className="relative flex h-8 w-auto shrink-0 items-center justify-center">
              <img src="/logo.jpeg" alt="Helical Logo" className="h-full w-auto object-contain rounded-md" />
            </div>
            <div className={cn(
              "overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
              collapsed ? "max-w-0 opacity-0 pl-0" : "max-w-[200px] opacity-100 pl-3"
            )}>
              <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate tracking-tight">Helical</h1>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Workflow System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-3">
          {navSections
            .filter((section) => !section.requireAdmin || hasAdminAccess)
            .map((section) => (
              <div key={section.label} className="mb-4">
                <div className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  collapsed ? "max-h-0 opacity-0" : "max-h-[24px] opacity-100 mb-1.5"
                )}>
                  <p className="px-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    {section.label}
                  </p>
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          'group relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out',
                          isActive
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                            : 'text-gray-600 dark:text-slate-400 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-slate-800 dark:hover:to-slate-800/80 hover:text-gray-900 dark:hover:text-slate-100 hover:shadow-sm',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute inset-0 rounded-xl bg-white/20"></div>
                          )}
                          <item.icon className={cn(
                            "h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110 relative z-10",
                            isActive && "drop-shadow-sm"
                          )} />
                          <span className={cn(
                            "whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out relative z-10",
                            collapsed ? "max-w-0 opacity-0 pl-0" : "max-w-[200px] opacity-100 pl-3"
                          )}>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-slate-800 p-3 space-y-1 overflow-x-hidden">
          <button
            className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-slate-400 transition-all hover:bg-gray-100 dark:hover:bg-slate-800"
            disabled
          >
            <Settings className="h-[18px] w-[18px] shrink-0 opacity-40" />
            <span className={cn(
              "whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
              collapsed ? "max-w-0 opacity-0 pl-0" : "max-w-[200px] opacity-40 pl-3"
            )}>Settings</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 transition-all hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            <span className={cn(
              "whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
              collapsed ? "max-w-0 opacity-0 pl-0" : "max-w-[200px] opacity-100 pl-3"
            )}>Logout</span>
          </button>

          {/* User info */}
          {user && (
            <div className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out mt-2",
              collapsed ? "opacity-0 invisible h-0 m-0" : "opacity-100 visible"
            )}>
              <div className="rounded-lg bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-800/50 p-3 border border-gray-100 dark:border-slate-700">
                <p className="text-xs font-semibold text-gray-700 dark:text-slate-200 whitespace-nowrap overflow-hidden text-ellipsis">{user.fullName}</p>
                <p className="text-[10px] text-gray-400 dark:text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis">{user.role} • {user.company}</p>
              </div>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 z-50 flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-200 dark:border-slate-700 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-xl hover:scale-110 active:scale-95 group"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5 text-gray-600 dark:text-slate-400 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5 text-gray-600 dark:text-slate-400 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          )}
        </button>
      </aside>
    </>
  );
}
