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
        className={`flex-1 min-w-0 ml-0 ${
          collapsed ? 'md:ml-[72px]' : 'md:ml-64'
        }`}
        style={{ transition: 'margin-left 300ms ease-in-out' }}
      >
        <Outlet />
      </main>

    </div>
  );
}