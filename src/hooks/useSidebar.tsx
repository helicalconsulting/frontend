import { createContext, useContext, useState, type ReactNode } from 'react';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  // Mobile defaults to true (collapsed/hidden), Desktop false (open)
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768; // 768px is Tailwind 'md' breakpoint
    }
    return false;
  });

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
