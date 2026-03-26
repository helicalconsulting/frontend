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
          'rounded-xl border border-gray-200 bg-white p-6 shadow-sm',
          className,
        )}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-12 w-12 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 overflow-hidden',
        className,
      )}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/30 transition-all duration-300" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-1">
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-emerald-600' : 'text-red-600',
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-400">vs last week</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-lg transition-transform duration-300 group-hover:scale-110',
            iconBgColor,
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
