import * as React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (type: ToastType, title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = React.useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    className: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300 text-emerald-900',
    iconClassName: 'text-emerald-600',
    iconBgClassName: 'bg-emerald-100',
  },
  error: {
    icon: XCircle,
    className: 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300 text-red-900',
    iconClassName: 'text-red-600',
    iconBgClassName: 'bg-red-100',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 text-amber-900',
    iconClassName: 'text-amber-600',
    iconBgClassName: 'bg-amber-100',
  },
  info: {
    icon: Info,
    className: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 text-blue-900',
    iconClassName: 'text-blue-600',
    iconBgClassName: 'bg-blue-100',
  },
};

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const config = toastConfig[toast.type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-2xl border-2 p-4 shadow-xl backdrop-blur-sm transition-all duration-300 animate-slide-left min-w-[320px] max-w-md',
        config.className,
      )}
    >
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-md', config.iconBgClassName)}>
        <Icon className={cn('h-5 w-5', config.iconClassName)} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold tracking-tight mb-0.5">{toast.title}</h4>
        {toast.message && (
          <p className="text-xs opacity-80 font-medium">{toast.message}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all hover:bg-black/5 active:scale-95"
      >
        <X className="h-4 w-4 opacity-50 hover:opacity-100" />
      </button>
    </div>
  );
}
