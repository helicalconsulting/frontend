import { useAuth } from '@/hooks/useAuth';
import { Bell, Search } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-md px-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 transition-all focus-within:border-blue-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-48"
          />
        </div>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
            3
          </span>
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-all hover:bg-gray-50">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
            <span className="text-xs font-bold text-white">
              {user?.fullName?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-gray-700">{user?.fullName || 'User'}</p>
            <p className="text-[10px] text-gray-400">{user?.role || 'Admin'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
