import { useAuth } from '@/hooks/useAuth';
import { Bell, Search, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between 
    border-b border-gray-200/60 dark:border-gray-700
    bg-white/90 dark:bg-gray-900/90 
    backdrop-blur-xl px-6 shadow-sm transition-colors duration-300">

      {/* LEFT */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h2>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-2 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {darkMode ? (
              <Sun className="h-4 w-4 text-yellow-400" />
            ) : (
              <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 
        bg-white dark:bg-gray-800 px-3 py-2">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 dark:text-gray-300">
          <Bell className="h-5 w-5" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <span className="hidden lg:block text-sm text-gray-800 dark:text-white">
            {user?.fullName || 'User'}
          </span>
        </div>

      </div>
    </header>
  );
}