import { useAuth } from '@/hooks/useAuth';
import { Bell, Search, Sparkles } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200/60 bg-white/90 backdrop-blur-xl px-6 shadow-sm">
      <div className="animate-slide-left">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h2>
          <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
        </div>
        {subtitle && <p className="text-xs text-gray-500 font-medium mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3 animate-slide-right">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-gray-200/80 bg-gradient-to-br from-gray-50 to-white px-3.5 py-2 transition-all duration-300 focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-blue-100/50 hover:border-gray-300 group">
          <Search className="h-4 w-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />
          <input
            type="text"
            placeholder="Quick search..."
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-52 font-medium"
          />
          <kbd className="hidden xl:inline-flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 border border-gray-200">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button className="relative rounded-xl p-2.5 text-gray-500 transition-all duration-200 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 hover:text-gray-700 hover:shadow-sm active:scale-95 group">
          <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-[10px] font-bold text-white shadow-lg shadow-red-500/30">
            3
          </span>
          <span className="absolute -right-0.5 -top-0.5 h-5 w-5 rounded-full bg-red-500 animate-ping opacity-40"></span>
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-3 rounded-xl px-2.5 py-1.5 transition-all duration-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:shadow-sm cursor-pointer group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-md ring-2 ring-white transition-transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/30">
            <span className="text-sm font-bold text-white">
              {user?.fullName?.charAt(0) || 'U'}
            </span>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></div>
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-gray-800">{user?.fullName || 'User'}</p>
            <p className="text-[10px] text-gray-500 font-medium">{user?.role || 'Admin'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
