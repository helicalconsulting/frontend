import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useSidebar } from '@/hooks/useSidebar';

export function AppLayout() {
  const { collapsed } = useSidebar();

  return (
    <div className="flex min-h-screen min-h-[100dvh] relative bg-gray-50 dark:bg-slate-950">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main
        className={`flex-1 min-w-0 ml-0 flex flex-col ${
          collapsed ? 'md:ml-[72px]' : 'md:ml-64'
        }`}
        style={{ transition: 'margin-left 300ms ease-in-out' }}
      >
        <div className="flex-1">
          <Outlet />
        </div>
        <footer className="mt-auto border-t border-gray-200 dark:border-slate-800/60 py-6 w-full text-center flex-shrink-0">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} Helical Consulting. All rights reserved.
          </p>
        </footer>
      </main>

    </div>
  );
}