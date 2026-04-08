import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useSidebar } from '@/hooks/useSidebar';

export function AppLayout() {
  const { collapsed } = useSidebar();

  return (
    <div className="flex min-h-screen relative bg-gray-50 dark:bg-slate-950 transition-colors duration-300">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ml-0 ${
          collapsed ? 'md:ml-[72px]' : 'md:ml-64'
        }`}
      >
        <Outlet />
      </main>

    </div>
  );
}