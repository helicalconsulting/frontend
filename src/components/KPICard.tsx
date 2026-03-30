import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import type { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor?: string;
  trend?: { value: number; isPositive: boolean };
  isLoading?: boolean;
  className?: string;
}

export function KPICard({
  title,
  value,
  icon,
  iconBgColor = 'bg-blue-100',
  trend,
  isLoading = false,
  className,
}: KPICardProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          'rounded-2xl border border-gray-200/80 bg-white p-6 shadow-lg',
          className,
        )}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>
          <Skeleton className="h-14 w-14 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative rounded-2xl border border-gray-200/80 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-blue-300/60 hover:-translate-y-1 overflow-hidden cursor-pointer',
        className,
      )}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-indigo-50/0 to-purple-50/0 group-hover:from-blue-50/60 group-hover:via-indigo-50/40 group-hover:to-purple-50/20 transition-all duration-300" />
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-600 transition-colors">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight mt-2 group-hover:scale-105 transition-transform duration-200 origin-left">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full',
                  trend.isPositive 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-red-100 text-red-700',
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-[10px] text-gray-400 font-medium">vs last week</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'flex items-center justify-center w-14 h-14 rounded-xl shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg',
            iconBgColor,
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
